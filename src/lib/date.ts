/** 하루의 경계: 새벽 4시. 새벽 3시에 쓴 기록은 전날로 귀속된다. */
export const DAY_BOUNDARY_HOUR = 4;

function formatKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "YYYY-MM-DD"를 로컬 타임존 Date로 파싱한다. new Date(문자열)의 UTC 해석을 피한다. */
export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** now가 귀속되는 날짜 키. 새벽 4시 이전이면 전날. */
export function getEffectiveDateKey(now: Date = new Date()): string {
  const shifted = new Date(now.getTime() - DAY_BOUNDARY_HOUR * 60 * 60 * 1000);
  return formatKey(shifted);
}

export function prevDateKey(key: string): string {
  const d = parseKey(key);
  d.setDate(d.getDate() - 1);
  return formatKey(d);
}

export function formatKeyForDisplay(key: string): string {
  const d = parseKey(key);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekday})`;
}
