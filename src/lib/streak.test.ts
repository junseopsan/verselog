import { describe, expect, it } from "vitest";
import { computeStats } from "./streak";
import { getEffectiveDateKey, prevDateKey } from "./date";
import type { Entry } from "./types";

function entryOn(date: string): Entry {
  return {
    id: crypto.randomUUID(),
    date,
    copiedLyrics: "테스트",
    moods: [],
    isFavorite: false,
    isHookCandidate: false,
    checklist: [false, false, false, false, false],
    createdAt: `${date}T12:00:00.000Z`,
    updatedAt: `${date}T12:00:00.000Z`,
  };
}

const TODAY = "2026-08-01";

describe("computeStats", () => {
  it("빈 배열이면 모두 0", () => {
    const s = computeStats([], TODAY);
    expect(s).toEqual({
      currentStreak: 0,
      bestStreak: 0,
      totalEntries: 0,
      totalDays: 0,
      recordedToday: false,
    });
  });

  it("오늘만 기록하면 스트릭 1", () => {
    const s = computeStats([entryOn(TODAY)], TODAY);
    expect(s.currentStreak).toBe(1);
    expect(s.bestStreak).toBe(1);
    expect(s.recordedToday).toBe(true);
  });

  it("어제까지 연속이고 오늘 미기록이어도 스트릭은 살아 있다", () => {
    const s = computeStats(
      [entryOn("2026-07-30"), entryOn("2026-07-31")],
      TODAY,
    );
    expect(s.currentStreak).toBe(2);
    expect(s.recordedToday).toBe(false);
  });

  it("그저께에서 끊기면 현재 스트릭 0, 최고 스트릭은 유지", () => {
    const s = computeStats(
      [entryOn("2026-07-28"), entryOn("2026-07-29"), entryOn("2026-07-30")],
      TODAY,
    );
    expect(s.currentStreak).toBe(0);
    expect(s.bestStreak).toBe(3);
  });

  it("하루에 2건 기록해도 스트릭은 1일로 센다", () => {
    const s = computeStats([entryOn(TODAY), entryOn(TODAY)], TODAY);
    expect(s.currentStreak).toBe(1);
    expect(s.totalEntries).toBe(2);
    expect(s.totalDays).toBe(1);
  });

  it("월 경계를 넘는 연속 기록", () => {
    const s = computeStats(
      [entryOn("2026-07-30"), entryOn("2026-07-31"), entryOn("2026-08-01")],
      TODAY,
    );
    expect(s.currentStreak).toBe(3);
    expect(s.bestStreak).toBe(3);
  });
});

describe("getEffectiveDateKey (새벽 4시 경계)", () => {
  it("새벽 3시 59분은 전날로 귀속", () => {
    expect(getEffectiveDateKey(new Date(2026, 7, 1, 3, 59))).toBe("2026-07-31");
  });

  it("새벽 4시 정각부터 당일", () => {
    expect(getEffectiveDateKey(new Date(2026, 7, 1, 4, 0))).toBe("2026-08-01");
  });

  it("낮 시간은 당일", () => {
    expect(getEffectiveDateKey(new Date(2026, 7, 1, 14, 0))).toBe("2026-08-01");
  });
});

describe("prevDateKey", () => {
  it("월 경계", () => {
    expect(prevDateKey("2026-08-01")).toBe("2026-07-31");
  });
  it("연 경계", () => {
    expect(prevDateKey("2026-01-01")).toBe("2025-12-31");
  });
});
