"use client";

import { useState } from "react";
import type { Entry } from "@/lib/types";
import type { NewEntryInput } from "@/lib/useEntries";
import { CHECKLIST_ITEMS } from "@/lib/constants";
import { lyricsSearchUrl } from "@/lib/songs";
import MoodTagPicker from "./MoodTagPicker";
import ChecklistSection from "./ChecklistSection";
import CheckRow from "./CheckRow";

type Draft = {
  songTitle: string;
  artist: string;
  copiedLyrics: string;
  favoriteExpression: string;
  reason: string;
  myLines: string;
  moods: string[];
  memo: string;
  isFavorite: boolean;
  isHookCandidate: boolean;
  checklist: boolean[];
};

export type Prefill = { songTitle?: string; artist?: string };

function toDraft(entry?: Entry, prefill?: Prefill): Draft {
  return {
    songTitle: entry?.songTitle ?? prefill?.songTitle ?? "",
    artist: entry?.artist ?? prefill?.artist ?? "",
    copiedLyrics: entry?.copiedLyrics ?? "",
    favoriteExpression: entry?.favoriteExpression ?? "",
    reason: entry?.reason ?? "",
    myLines: entry?.myLines ?? "",
    moods: entry?.moods ?? [],
    memo: entry?.memo ?? "",
    isFavorite: entry?.isFavorite ?? false,
    isHookCandidate: entry?.isHookCandidate ?? false,
    checklist: entry?.checklist ?? CHECKLIST_ITEMS.map(() => false),
  };
}

function toInput(draft: Draft): NewEntryInput {
  const clean = (s: string) => s.trim() || undefined;
  return {
    songTitle: clean(draft.songTitle),
    artist: clean(draft.artist),
    copiedLyrics: draft.copiedLyrics.trim(),
    favoriteExpression: clean(draft.favoriteExpression),
    reason: clean(draft.reason),
    myLines: clean(draft.myLines),
    moods: draft.moods,
    memo: clean(draft.memo),
    isFavorite: draft.isFavorite,
    isHookCandidate: draft.isHookCandidate,
    checklist: draft.checklist,
  };
}

export default function EntryForm({
  initial,
  prefill,
  onSubmit,
  submitLabel,
}: {
  initial?: Entry;
  prefill?: Prefill;
  onSubmit: (input: NewEntryInput) => void;
  submitLabel: string;
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(initial, prefill));
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.copiedLyrics.trim()) {
      setError("필사한 부분은 비워둘 수 없어요. 한 줄이면 충분합니다.");
      return;
    }
    onSubmit(toInput(draft));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-3">
        <SectionTitle>오늘의 필사</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Field label="곡명">
            <input
              value={draft.songTitle}
              onChange={(e) => set("songTitle", e.target.value)}
              placeholder="Ditto"
              className={inputCls}
            />
          </Field>
          <Field label="아티스트">
            <input
              value={draft.artist}
              onChange={(e) => set("artist", e.target.value)}
              placeholder="NewJeans"
              className={inputCls}
            />
          </Field>
        </div>
        {draft.songTitle.trim() && (
          <a
            href={lyricsSearchUrl(draft.songTitle.trim(), draft.artist.trim() || undefined)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[13px] text-accent/90 transition-colors hover:text-accent"
          >
            &ldquo;{draft.songTitle.trim()}&rdquo; 가사 검색 ↗
          </a>
        )}
        <Field label="필사한 부분" required>
          <textarea
            value={draft.copiedLyrics}
            onChange={(e) => {
              set("copiedLyrics", e.target.value);
              if (error) setError(null);
            }}
            rows={4}
            placeholder="마음에 남은 가사 일부를 옮겨 적어요"
            className={`${inputCls} resize-y font-serif leading-relaxed`}
          />
        </Field>
        <Field label="좋았던 표현">
          <textarea
            value={draft.favoriteExpression}
            onChange={(e) => set("favoriteExpression", e.target.value)}
            rows={4}
            placeholder="반복되는 짧은 문장"
            className={`${inputCls} resize-y font-serif leading-relaxed`}
          />
        </Field>
        <Field label="왜 좋았는지">
          <textarea
            value={draft.reason}
            onChange={(e) => set("reason", e.target.value)}
            rows={4}
            placeholder="감정을 직접 말하지 않고 분위기로 전달해서"
            className={`${inputCls} resize-y`}
          />
        </Field>
      </section>

      <section className="space-y-3">
        <SectionTitle>내 문장 2줄 변주</SectionTitle>
        <p className="text-xs text-muted">
          오늘은 필사만 해도 괜찮아요. 여유가 되면 두 줄만 바꿔 써봐요.
        </p>
        <textarea
          value={draft.myLines}
          onChange={(e) => set("myLines", e.target.value)}
          rows={3}
          placeholder={"가로등이 하나씩 뒤로 넘어가고\n내 숨은 나보다 먼저 언덕을 오른다"}
          className={`${inputCls} resize-y font-serif leading-relaxed`}
        />
        <CheckRow
          checked={draft.isHookCandidate}
          onChange={(value) => set("isHookCandidate", value)}
        >
          후렴 후보로 표시 — 반복하고 싶은 문장이에요
        </CheckRow>
      </section>

      <section className="space-y-3">
        <SectionTitle>분위기</SectionTitle>
        <MoodTagPicker
          selected={draft.moods}
          onChange={(moods) => set("moods", moods)}
        />
      </section>

      <section className="space-y-3">
        <SectionTitle>셀프 피드백</SectionTitle>
        <ChecklistSection
          checked={draft.checklist}
          onChange={(checklist) => set("checklist", checklist)}
        />
      </section>

      <section className="space-y-3">
        <Field label="메모">
          <textarea
            value={draft.memo}
            onChange={(e) => set("memo", e.target.value)}
            rows={2}
            placeholder="남기고 싶은 생각이 있다면"
            className={`${inputCls} resize-y`}
          />
        </Field>
        <CheckRow
          checked={draft.isFavorite}
          onChange={(value) => set("isFavorite", value)}
        >
          마음에 드는 기록으로 표시
        </CheckRow>
      </section>

      {error && <p className="text-sm text-accent">{error}</p>}

      <button
        type="submit"
        className="press w-full rounded-xl bg-accent py-3.5 font-semibold text-background shadow-lg shadow-accent/20"
      >
        {submitLabel}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-edge bg-surface px-3 py-2.5 text-[15px] transition-colors duration-200 placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-sm font-semibold tracking-wide text-accent">
      <span aria-hidden className="h-px w-5 bg-accent/60" />
      {children}
    </h2>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-muted">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      {children}
    </label>
  );
}
