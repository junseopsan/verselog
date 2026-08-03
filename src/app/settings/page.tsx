"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useEntries } from "@/lib/useEntries";
import { getEffectiveDateKey } from "@/lib/date";
import { exportBackup, mergeEntries, parseBackup } from "@/lib/backup";
import { signOut } from "@/lib/auth";
import type { Entry } from "@/lib/types";

export default function SettingsPage() {
  const { entries, replaceAll } = useEntries();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<Entry[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (entries === null) {
    return <div className="mt-2 h-96 animate-pulse rounded-2xl bg-surface" />;
  }

  const todayKey = getEffectiveDateKey();

  const handleFile = async (file: File) => {
    setMessage(null);
    try {
      const imported = parseBackup(await file.text());
      setPendingImport(imported);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "가져오기에 실패했습니다.");
    }
  };

  const runImport = async (next: Entry[]) => {
    setImporting(true);
    const failed = await replaceAll(next);
    setImporting(false);
    setPendingImport(null);
    setMessage(
      failed === 0
        ? "가져오기가 완료됐습니다."
        : `가져오기 완료 — ${failed}건은 저장하지 못했습니다.`,
    );
  };

  return (
    <div className="space-y-8">
      <header className="pt-2">
        <Link
          href="/"
          className="press -ml-1 inline-flex min-h-11 items-center gap-1 text-sm text-muted"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          홈으로
        </Link>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
          설정
        </h1>
        <div aria-hidden className="mt-3 h-px w-10 bg-accent/70" />
      </header>

      <section className="space-y-3 rounded-2xl border border-edge bg-surface p-5">
        <h2 className="text-sm font-semibold">백업</h2>
        <p className="text-xs leading-relaxed text-muted">
          기록은 클라우드에 저장됩니다. 파일 백업은 보관용으로, 가져오기는 1차
          버전(브라우저 저장) 기록을 옮길 때 사용하세요.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => exportBackup(entries, todayKey)}
            disabled={entries.length === 0}
            className="press flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-background disabled:opacity-40"
          >
            내보내기
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="press flex-1 rounded-xl border border-edge py-3 text-sm font-semibold active:border-accent/40"
          >
            가져오기
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </div>

        {pendingImport && (
          <div className="space-y-3 rounded-xl border border-accent/40 bg-accent/5 p-4">
            <p className="text-sm">
              백업에서 기록 {pendingImport.length}개를 찾았어요. 어떻게
              가져올까요?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={importing}
                onClick={() => runImport(mergeEntries(entries, pendingImport))}
                className="press flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-background disabled:opacity-40"
              >
                {importing ? "저장 중…" : "합치기 (권장)"}
              </button>
              <button
                type="button"
                disabled={importing}
                onClick={() => runImport(pendingImport)}
                className="press flex-1 rounded-lg border border-edge py-2.5 text-sm font-semibold text-muted disabled:opacity-40"
              >
                그대로 추가
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPendingImport(null)}
              className="w-full text-center text-xs text-muted"
            >
              취소
            </button>
          </div>
        )}

        {message && <p className="text-sm text-accent">{message}</p>}
      </section>

      <button
        type="button"
        onClick={() => signOut()}
        className="press w-full rounded-xl border border-edge py-3 text-sm font-semibold text-muted active:border-accent/40"
      >
        로그아웃
      </button>
    </div>
  );
}
