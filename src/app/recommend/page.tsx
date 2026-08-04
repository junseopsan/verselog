"use client";

import { useState } from "react";
import Link from "next/link";
import { MOODS } from "@/lib/constants";
import { SONG_RECS, hashKey, type SongRec, type Mood } from "@/lib/songs";
import { getEffectiveDateKey } from "@/lib/date";
import { useEntries } from "@/lib/useEntries";

function writeHref(song: SongRec): string {
  return `/write?song=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`;
}

function normalize(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

export default function RecommendPage() {
  const { entries } = useEntries();
  const [skip, setSkip] = useState(0);
  const [mood, setMood] = useState<Mood | null>(null);

  const recordedTitles = new Set(
    (entries ?? [])
      .map((e) => e.songTitle && normalize(e.songTitle))
      .filter(Boolean) as string[],
  );
  const isRecorded = (song: SongRec) => recordedTitles.has(normalize(song.title));

  // 오늘의 추천: 날짜에 고정하되, 이미 기록한 곡은 건너뛴다.
  const pool = SONG_RECS.filter((s) => !isRecorded(s));
  const todayPool = pool.length > 0 ? pool : SONG_RECS;
  const todayPick =
    todayPool[(hashKey(getEffectiveDateKey()) + skip) % todayPool.length];

  const filtered = mood
    ? SONG_RECS.filter((s) => s.moods.includes(mood))
    : SONG_RECS;

  return (
    <div className="space-y-8">
      <header className="pt-2">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          필사 추천
        </h1>
        <div aria-hidden className="mt-3 h-px w-10 bg-accent/70" />
        <p className="mt-3 text-sm text-muted">
          가사가 좋기로 손꼽히는 곡들이에요. 마음 가는 한 곡을 골라, 좋아하는
          부분만 옮겨 적어봐요.
        </p>
      </header>

      <section className="relative overflow-hidden rounded-3xl border border-edge bg-gradient-to-b from-surface to-background p-6 pt-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 -top-20 h-52 w-52 rounded-full bg-accent/15 blur-3xl"
        />
        <p className="text-[13px] tracking-[0.14em] text-muted">오늘의 추천</p>
        <p className="mt-2 font-serif text-[22px] leading-snug">
          {todayPick.title}
        </p>
        <p className="mt-1 text-sm text-muted">{todayPick.artist}</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
          {todayPick.point}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge>{todayPick.focus}</Badge>
          {todayPick.moods.map((m) => (
            <span key={m} className="text-xs text-muted">
              #{m}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            href={writeHref(todayPick)}
            className="press flex-1 rounded-xl bg-accent py-3 text-center font-semibold text-background shadow-lg shadow-accent/20"
          >
            이 곡으로 기록하기
          </Link>
          <button
            type="button"
            onClick={() => setSkip((n) => n + 1)}
            className="press rounded-xl border border-edge px-4 text-sm text-muted active:border-accent/40"
          >
            다른 곡
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2.5 text-sm font-semibold text-muted">
          <span aria-hidden className="h-px w-5 bg-accent/60" />
          분위기로 고르기
        </h2>
        <div className="flex flex-wrap gap-1.5">
          <MoodChip active={mood === null} onClick={() => setMood(null)}>
            전체
          </MoodChip>
          {MOODS.map((m) => (
            <MoodChip
              key={m}
              active={mood === m}
              onClick={() => setMood(mood === m ? null : m)}
            >
              {m}
            </MoodChip>
          ))}
        </div>

        <ul className="space-y-2.5">
          {filtered.map((song) => {
            const recorded = isRecorded(song);
            return (
              <li key={`${song.title}-${song.artist}`}>
                <Link
                  href={writeHref(song)}
                  className="press block rounded-2xl border border-edge bg-surface p-4 transition-colors active:border-accent/40"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif text-[17px] leading-snug">
                      {song.title}
                    </p>
                    {recorded && (
                      <span className="shrink-0 text-[11px] text-accent">
                        기록함 ✓
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted">{song.artist}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground/75">
                    {song.point}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <Badge>{song.focus}</Badge>
                    {song.moods.map((m) => (
                      <span key={m} className="text-xs text-muted">
                        #{m}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
      {children}
    </span>
  );
}

function MoodChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press rounded-full border px-3 py-1.5 text-[13px] transition-colors duration-200 ${
        active
          ? "border-accent/60 bg-accent/15 font-medium text-accent"
          : "border-edge bg-surface text-muted active:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
