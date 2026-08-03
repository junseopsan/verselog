import type { Entry, RoutineStats } from "./types";
import { prevDateKey } from "./date";

export function computeStats(entries: Entry[], todayKey: string): RoutineStats {
  const dates = new Set(entries.map((e) => e.date));
  const recordedToday = dates.has(todayKey);

  // 현재 스트릭: 오늘 기록이 없어도 어제까지 이어졌다면 살아 있는 것으로 본다.
  let currentStreak = 0;
  let cursor = recordedToday ? todayKey : prevDateKey(todayKey);
  while (dates.has(cursor)) {
    currentStreak++;
    cursor = prevDateKey(cursor);
  }

  let bestStreak = 0;
  const sorted = [...dates].sort();
  let run = 0;
  let prev: string | null = null;
  for (const key of sorted) {
    run = prev !== null && prevDateKey(key) === prev ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    prev = key;
  }

  return {
    currentStreak,
    bestStreak,
    totalEntries: entries.length,
    totalDays: dates.size,
    recordedToday,
  };
}
