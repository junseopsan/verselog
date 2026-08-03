"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { AiFeedback, Entry } from "./types";
import { supabase } from "./supabase";
import {
  deleteEntryRow,
  fetchAll,
  insertEntry,
  updateEntryRow,
  upsertEntries,
} from "./db";
import { getEffectiveDateKey } from "./date";

export type NewEntryInput = Omit<
  Entry,
  "id" | "date" | "createdAt" | "updatedAt" | "aiFeedback" | "aiFeedbackAt"
>;

// Supabase를 단일 진실 원천으로 하는 외부 스토어.
// 뮤테이션은 낙관적으로 로컬 반영 후 백그라운드 저장, 실패 시 refetch로 롤백한다.
let cache: Entry[] | null = null;
let lastError: string | null = null;
let loadStarted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Entry[] | null {
  return cache;
}

function getServerSnapshot(): Entry[] | null {
  return null;
}

function getErrorSnapshot(): string | null {
  return lastError;
}

async function load() {
  try {
    cache = await fetchAll();
    lastError = null;
  } catch {
    cache = cache ?? [];
    lastError = "기록을 불러오지 못했습니다. 네트워크를 확인해주세요.";
  }
  emit();
}

function ensureLoaded() {
  if (loadStarted) return;
  loadStarted = true;
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) load();
  });
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN" && cache === null) load();
    if (event === "SIGNED_OUT") {
      cache = null;
      lastError = null;
      emit();
    }
  });
}

function commitLocal(next: Entry[]) {
  cache = next;
  emit();
}

/** 낙관적 커밋 후 원격 저장. 실패 시 서버 상태로 롤백하고 에러를 남긴다. */
function persist(op: () => Promise<void>, failMessage: string) {
  op().catch(async () => {
    lastError = failMessage;
    await load();
  });
}

/**
 * Supabase 기반 기록 저장소 훅.
 * entries가 null이면 아직 로드 전 — 스켈레톤/빈 상태를 렌더할 것.
 */
export function useEntries() {
  ensureLoaded();

  const entries = useSyncExternalStore<Entry[] | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const error = useSyncExternalStore<string | null>(
    subscribe,
    getErrorSnapshot,
    () => null,
  );

  const addEntry = useCallback((input: NewEntryInput): Entry => {
    const now = new Date();
    const entry: Entry = {
      ...input,
      id: crypto.randomUUID(),
      date: getEffectiveDateKey(now),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    commitLocal([entry, ...(cache ?? [])]);
    persist(() => insertEntry(entry), "기록 저장에 실패했습니다.");
    return entry;
  }, []);

  const updateEntry = useCallback(
    (id: string, patch: Partial<NewEntryInput>) => {
      const target = (cache ?? []).find((e) => e.id === id);
      if (!target) return;
      const next: Entry = {
        ...target,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      commitLocal((cache ?? []).map((e) => (e.id === id ? next : e)));
      persist(() => updateEntryRow(next), "수정 사항 저장에 실패했습니다.");
    },
    [],
  );

  const deleteEntry = useCallback((id: string) => {
    commitLocal((cache ?? []).filter((e) => e.id !== id));
    persist(() => deleteEntryRow(id), "삭제에 실패했습니다.");
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      const target = (cache ?? []).find((e) => e.id === id);
      if (!target) return;
      updateEntry(id, { isFavorite: !target.isFavorite });
    },
    [updateEntry],
  );

  const toggleHookCandidate = useCallback(
    (id: string) => {
      const target = (cache ?? []).find((e) => e.id === id);
      if (!target) return;
      updateEntry(id, { isHookCandidate: !target.isHookCandidate });
    },
    [updateEntry],
  );

  /** 백업 가져오기: 병합 결과를 반영하고 upsert. 실패 건수를 반환. */
  const replaceAll = useCallback(async (next: Entry[]): Promise<number> => {
    commitLocal(next);
    try {
      const failed = await upsertEntries(next);
      await load();
      return failed;
    } catch {
      lastError = "가져오기 저장에 실패했습니다.";
      await load();
      return next.length;
    }
  }, []);

  /** Edge Function이 저장한 AI 피드백을 DB 재기록 없이 로컬에만 반영. */
  const applyFeedback = useCallback(
    (id: string, feedback: AiFeedback, feedbackAt: string) => {
      commitLocal(
        (cache ?? []).map((e) =>
          e.id === id
            ? { ...e, aiFeedback: feedback, aiFeedbackAt: feedbackAt }
            : e,
        ),
      );
    },
    [],
  );

  const refresh = useCallback(() => load(), []);

  return {
    entries,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleFavorite,
    toggleHookCandidate,
    replaceAll,
    applyFeedback,
    refresh,
  };
}
