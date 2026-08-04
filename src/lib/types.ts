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
  /** 필사 출처. 없으면 노래(song)로 취급 — 초기 데이터 호환 */
  sourceType?: "song" | "book";
  /** 노래면 곡명, 책이면 책 제목 */
  songTitle?: string;
  /** 노래면 아티스트, 책이면 작가 */
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
