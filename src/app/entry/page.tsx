"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEntries } from "@/lib/useEntries";
import { supabase } from "@/lib/supabase";
import { CHECKLIST_ITEMS } from "@/lib/constants";
import { formatKeyForDisplay } from "@/lib/date";
import type { AiFeedback, Entry } from "@/lib/types";

export default function EntryPage() {
  return (
    <Suspense>
      <EntryInner />
    </Suspense>
  );
}

function EntryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const saved = searchParams.get("saved") === "1";
  const { entries, deleteEntry, toggleFavorite, toggleHookCandidate, applyFeedback } =
    useEntries();

  if (entries === null) {
    return <div className="mt-2 h-96 animate-pulse rounded-2xl bg-surface" />;
  }

  const entry = entries.find((e) => e.id === id);
  if (!entry) {
    return (
      <p className="pt-16 text-center text-sm text-muted">
        기록을 찾을 수 없습니다.
      </p>
    );
  }

  const checkedItems = CHECKLIST_ITEMS.filter((_, i) => entry.checklist[i]);

  return (
    <div className="space-y-6">
      {saved && (
        <p className="mt-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          오늘의 기록이 저장됐어요. 이어지는 하루하루가 실력이 됩니다.
        </p>
      )}

      <header className="space-y-1 pt-2">
        <p className="flex items-center gap-1.5 text-xs tracking-[0.14em] text-muted">
          {formatKeyForDisplay(entry.date)}
          {entry.sourceType === "book" && (
            <span className="rounded-full border border-edge px-1.5 py-px text-[10px] tracking-normal">
              책
            </span>
          )}
        </p>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            {entry.songTitle || "제목 없는 기록"}
            {entry.artist && (
              <span className="ml-2 text-sm font-normal text-muted">
                {entry.artist}
              </span>
            )}
          </h1>
          <button
            type="button"
            onClick={() => toggleFavorite(entry.id)}
            aria-label="즐겨찾기 토글"
            className={`min-h-11 min-w-11 text-2xl transition-all duration-200 active:scale-75 ${
              entry.isFavorite
                ? "text-accent drop-shadow-[0_0_6px_rgba(125,162,217,0.5)]"
                : "text-edge"
            }`}
          >
            ★
          </button>
        </div>
      </header>

      <Section title="필사한 부분">
        <p className="whitespace-pre-wrap font-serif text-[15px] leading-loose">
          {entry.copiedLyrics}
        </p>
      </Section>

      {entry.favoriteExpression && (
        <Section title="좋았던 표현">
          <p className="text-[15px]">{entry.favoriteExpression}</p>
        </Section>
      )}

      {entry.reason && (
        <Section title="왜 좋았는지">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
            {entry.reason}
          </p>
        </Section>
      )}

      {entry.myLines && (
        <Section title="내 문장 2줄 변주" accent>
          <p className="whitespace-pre-wrap font-serif text-[15px] leading-loose">
            {entry.myLines}
          </p>
          {entry.sourceType !== "book" && (
          <button
            type="button"
            onClick={() => toggleHookCandidate(entry.id)}
            className={`press mt-3 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
              entry.isHookCandidate
                ? "border-accent bg-accent/15 text-accent"
                : "border-edge text-muted"
            }`}
          >
            {entry.isHookCandidate ? "♪ 후렴 후보" : "후렴 후보로 표시"}
          </button>
          )}
        </Section>
      )}

      <AiFeedbackSection entry={entry} onFeedback={applyFeedback} />

      {entry.moods.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.moods.map((mood) => (
            <span
              key={mood}
              className="rounded-full border border-edge px-2.5 py-1 text-xs text-muted"
            >
              {mood}
            </span>
          ))}
        </div>
      )}

      {checkedItems.length > 0 && (
        <Section title="셀프 피드백">
          <ul className="space-y-2 text-sm text-muted">
            {checkedItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent"
                >
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    className="text-background"
                  >
                    <path
                      d="M2.5 6.5 5 9l4.5-5.5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {entry.memo && (
        <Section title="메모">
          <p className="whitespace-pre-wrap text-sm text-muted">{entry.memo}</p>
        </Section>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href={`/write?id=${entry.id}`}
          className="press flex-1 rounded-xl border border-edge py-3 text-center text-sm font-semibold active:border-accent/40"
        >
          수정
        </Link>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("이 기록을 삭제할까요? 되돌릴 수 없습니다.")) {
              deleteEntry(entry.id);
              router.push("/archive");
            }
          }}
          className="press flex-1 rounded-xl border border-edge py-3 text-sm font-semibold text-muted active:border-red-400/40 active:text-red-300"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

function feedbackLabels(isBook: boolean): { key: keyof AiFeedback; label: string }[] {
  return [
    { key: "scene", label: "장면성" },
    { key: "directEmotion", label: "감정의 직접성" },
    { key: "hookPotential", label: isBook ? "곱씹을 문장" : "후렴 가능성" },
    { key: "wordChoice", label: "단어의 신선함" },
    { key: "rhythm", label: isBook ? "문장의 호흡" : "리듬감" },
  ];
}

type FeedbackResponse =
  | { feedback: AiFeedback; aiFeedbackAt: string }
  | { refused: true; message: string };

function AiFeedbackSection({
  entry,
  onFeedback,
}: {
  entry: Entry;
  onFeedback: (id: string, feedback: AiFeedback, at: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isBook = entry.sourceType === "book";

  const request = async (force: boolean) => {
    if (loading) return;
    if (force && !window.confirm("피드백을 새로 받으면 이전 피드백은 사라집니다. 계속할까요?")) {
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fnError } = await supabase.functions.invoke<FeedbackResponse>(
      "ai-feedback",
      { body: { entryId: entry.id, force } },
    );
    setLoading(false);
    if (fnError || !data) {
      setError("피드백 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    if ("refused" in data) {
      setError(data.message);
      return;
    }
    onFeedback(entry.id, data.feedback, data.aiFeedbackAt);
  };

  if (!entry.myLines?.trim()) {
    return (
      <p className="text-center text-xs text-muted">
        변주를 쓰면 AI 피드백을 받을 수 있어요.
      </p>
    );
  }

  return (
    <Section title="AI 피드백" accent={!!entry.aiFeedback}>
      {entry.aiFeedback ? (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{entry.aiFeedback.overall}</p>
          {feedbackLabels(isBook).map(({ key, label }) => (
            <div key={key} className="rounded-lg bg-background/50 p-3">
              <p className="mb-1 text-xs font-semibold text-accent">{label}</p>
              <p className="text-sm leading-relaxed text-foreground/90">
                {entry.aiFeedback![key]}
              </p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => request(true)}
            disabled={loading}
            className="text-xs text-muted underline underline-offset-2 disabled:opacity-40"
          >
            {loading ? "피드백을 쓰는 중…" : "다시 받기"}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted">
            {isBook
              ? "내 문장 2줄에 대해 장면성·단어·문장의 호흡 피드백을 받아보세요."
              : "내 문장 2줄에 대해 장면성·후렴 가능성·리듬감 피드백을 받아보세요."}
          </p>
          <button
            type="button"
            onClick={() => request(false)}
            disabled={loading}
            className="press w-full rounded-lg border border-accent/50 py-2.5 text-sm font-semibold text-accent active:bg-accent/10 disabled:opacity-40"
          >
            {loading ? "피드백을 쓰는 중… (30초 정도 걸려요)" : "AI 피드백 받기"}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-accent">{error}</p>}
    </Section>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-xl border p-4 ${
        accent ? "border-accent/40 bg-accent/5" : "border-edge bg-surface"
      }`}
    >
      <h2 className="mb-2 text-xs font-semibold text-accent">{title}</h2>
      {children}
    </section>
  );
}
