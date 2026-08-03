import { CHECKLIST_ITEMS } from "./constants";
import type { Entry } from "./types";

type BackupFile = {
  app: "verse-log";
  schemaVersion: 1;
  exportedAt: string;
  entries: Entry[];
};

export function exportBackup(entries: Entry[], todayKey: string): void {
  const payload: BackupFile = {
    app: "verse-log",
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    entries,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `verse-log-${todayKey}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** 백업 파일 텍스트를 검증하고 정규화된 Entry 배열을 반환한다. 실패 시 Error를 던진다. */
export function parseBackup(text: string): Entry[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("JSON 파일이 아니거나 파일이 손상되었습니다.");
  }
  const file = parsed as Partial<BackupFile>;
  if (file.app !== "verse-log" || !Array.isArray(file.entries)) {
    throw new Error("필사와 변주 백업 파일이 아닙니다.");
  }
  return file.entries.map((raw, i) => {
    const e = raw as Partial<Entry>;
    if (!e.id || !e.date || typeof e.copiedLyrics !== "string") {
      throw new Error(`${i + 1}번째 기록에 필수 항목이 없습니다.`);
    }
    return {
      id: e.id,
      date: e.date,
      songTitle: e.songTitle,
      artist: e.artist,
      copiedLyrics: e.copiedLyrics,
      favoriteExpression: e.favoriteExpression,
      reason: e.reason,
      myLines: e.myLines,
      moods: Array.isArray(e.moods) ? e.moods : [],
      memo: e.memo,
      isFavorite: e.isFavorite === true,
      isHookCandidate: e.isHookCandidate === true,
      checklist:
        Array.isArray(e.checklist) && e.checklist.length === CHECKLIST_ITEMS.length
          ? e.checklist.map(Boolean)
          : CHECKLIST_ITEMS.map(() => false),
      createdAt: e.createdAt ?? new Date().toISOString(),
      updatedAt: e.updatedAt ?? new Date().toISOString(),
    };
  });
}

/** id 기준 병합. 충돌 시 updatedAt이 최신인 쪽이 남는다. */
export function mergeEntries(current: Entry[], imported: Entry[]): Entry[] {
  const map = new Map(current.map((e) => [e.id, e]));
  for (const entry of imported) {
    const existing = map.get(entry.id);
    if (!existing || entry.updatedAt > existing.updatedAt) {
      map.set(entry.id, entry);
    }
  }
  return [...map.values()].sort((a, b) =>
    (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );
}
