export type AiFeedback = {
  overall: string;
  scene: string;
  directEmotion: string;
  hookPotential: string;
  wordChoice: string;
  rhythm: string;
};

export type Entry = {
  id: string;
  /** YYYY-MM-DD, 새벽 4시 경계 기준 귀속일 */
  date: string;
  songTitle?: string;
  artist?: string;
  copiedLyrics: string;
  favoriteExpression?: string;
  reason?: string;
  /** 내 문장 2줄 변주 — 선택 */
  myLines?: string;
  moods: string[];
  memo?: string;
  isFavorite: boolean;
  /** 후렴 후보 표시 */
  isHookCandidate: boolean;
  /** CHECKLIST_ITEMS와 인덱스 정렬, 길이 5 */
  checklist: boolean[];
  aiFeedback?: AiFeedback | null;
  aiFeedbackAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RoutineStats = {
  currentStreak: number;
  bestStreak: number;
  totalEntries: number;
  totalDays: number;
  recordedToday: boolean;
};
