"use client";

import Link from "next/link";
import { useEntries } from "@/lib/useEntries";
import { computeStats } from "@/lib/streak";
import { getEffectiveDateKey, formatKeyForDisplay } from "@/lib/date";
import StatTile from "@/components/StatTile";
import EntryCard from "@/components/EntryCard";

export default function HomePage() {
  const { entries } = useEntries();

  if (entries === null) {
    return <HomeSkeleton />;
  }

  const todayKey = getEffectiveDateKey();
  const stats = computeStats(entries, todayKey);
  const todayEntries = entries.filter((e) => e.date === todayKey);

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between pt-2">
        <div>
          <p className="text-[13px] tracking-[0.14em] text-muted">
            {formatKeyForDisplay(todayKey)}
          </p>
          <h1 className="mt-1.5 font-serif text-[34px] font-semibold leading-tight tracking-tight">
            필사와 변주
          </h1>
          <div aria-hidden className="mt-4 h-px w-12 bg-accent/70" />
        </div>
        <Link
          href="/settings"
          aria-label="설정"
          className="press -mr-2 flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-foreground"
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.08a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03Z" />
          </svg>
        </Link>
      </header>

      <section className="relative overflow-hidden rounded-3xl border border-edge bg-gradient-to-b from-surface to-background p-6 pt-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 -top-20 h-52 w-52 rounded-full bg-accent/15 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-2 right-4 font-serif text-[88px] leading-none text-accent/10"
        >
          &ldquo;
        </span>
        {stats.recordedToday ? (
          <>
            <p className="font-serif text-[22px] leading-snug">
              오늘의 한 줄을
              <br />
              남겼어요.
            </p>
            <p className="mt-2.5 text-sm text-muted">
              내일도 이어서 쓰면 {stats.currentStreak + 1}일이 됩니다.
            </p>
          </>
        ) : (
          <>
            <p className="font-serif text-[22px] leading-snug">
              오늘도 한 줄이면
              <br />
              충분합니다.
            </p>
            <p className="mt-2.5 text-sm text-muted">
              완성보다 중요한 건 끊기지 않는 것.
            </p>
          </>
        )}
        <Link
          href="/write"
          className={`press mt-4 block w-full rounded-xl py-3.5 text-center font-semibold ${
            stats.recordedToday
              ? "border border-edge text-muted active:border-accent/40"
              : "bg-accent text-background shadow-lg shadow-accent/20"
          }`}
        >
          {stats.recordedToday ? "한 편 더 기록하기" : "오늘 기록하기"}
        </Link>
        <Link
          href="/recommend"
          className="mt-3 block text-center text-[13px] text-muted transition-colors hover:text-foreground"
        >
          뭘 필사할지 고민된다면 — 오늘의 추천 →
        </Link>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <StatTile label="현재 연속" value={stats.currentStreak} suffix="일" />
        <StatTile label="최고 연속" value={stats.bestStreak} suffix="일" />
        <StatTile label="누적 기록" value={stats.totalEntries} suffix="개" />
      </section>

      {todayEntries.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2.5 text-sm font-semibold text-muted">
            <span aria-hidden className="h-px w-5 bg-accent/60" />
            오늘의 기록
          </h2>
          {todayEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </section>
      )}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-8 pt-2">
      <div className="h-14 w-40 animate-pulse rounded-lg bg-surface" />
      <div className="h-36 animate-pulse rounded-2xl bg-surface" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 animate-pulse rounded-xl bg-surface" />
        <div className="h-20 animate-pulse rounded-xl bg-surface" />
        <div className="h-20 animate-pulse rounded-xl bg-surface" />
      </div>
    </div>
  );
}
