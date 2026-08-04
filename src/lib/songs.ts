import { MOODS } from "./constants";

export type Mood = (typeof MOODS)[number];

/** 필사에서 뭘 배울 수 있는지 기준의 분류 */
export const FOCUSES = ["이미지", "반복", "서사", "화법", "구조"] as const;
export type Focus = (typeof FOCUSES)[number];

export type SongRec = {
  title: string;
  artist: string;
  moods: Mood[];
  focus: Focus;
  /** 이 곡을 필사하면 좋은 이유 — 가사 인용 없이 기법만 설명한다. */
  point: string;
};

export const SONG_RECS: SongRec[] = [
  {
    title: "밤편지",
    artist: "아이유",
    moods: ["밤", "그리움", "고요함"],
    focus: "이미지",
    point:
      "감정을 직접 말하지 않고 반딧불·편지 같은 사물로 마음을 전해요. 장면으로 보여주는 법의 교과서.",
  },
  {
    title: "무릎",
    artist: "아이유",
    moods: ["밤", "고요함", "혼자"],
    focus: "화법",
    point:
      "잠들지 못하는 밤을 어린 시절 기억으로 달래는 독백. 낮고 사적인 말투가 만드는 친밀함.",
  },
  {
    title: "서른 즈음에",
    artist: "김광석",
    moods: ["그리움", "혼자"],
    focus: "구조",
    point:
      "멀어져 가는 감각을 시간의 흐름으로 차곡차곡 쌓는 절제된 반복. 단어 수가 적을수록 커지는 감정.",
  },
  {
    title: "어느 60대 노부부 이야기",
    artist: "김광석",
    moods: ["이별", "그리움"],
    focus: "서사",
    point: "한 사람의 일생을 몇 개의 장면으로 압축하는 서사 작법. 장면 전환의 리듬을 보세요.",
  },
  {
    title: "바람이 분다",
    artist: "이소라",
    moods: ["비", "이별", "혼자"],
    focus: "이미지",
    point: "이별의 감정을 날씨와 풍경 묘사로만 밀고 가는 정공법. 감정 단어 없이 감정을 만드는 법.",
  },
  {
    title: "기억을 걷는 시간",
    artist: "넬",
    moods: ["밤", "그리움"],
    focus: "이미지",
    point: "추상적인 것(기억)을 '걷는다'는 신체 동작과 붙여 만질 수 있게 만드는 은유.",
  },
  {
    title: "보편적인 노래",
    artist: "브로콜리너마저",
    moods: ["그리움", "혼자"],
    focus: "화법",
    point: "특별하지 않다고 말하면서 가장 특별해지는 반어. 담담한 어조의 힘.",
  },
  {
    title: "Everything",
    artist: "검정치마",
    moods: ["설렘"],
    focus: "화법",
    point: "거창한 수사 없이 일상어로 밀어붙이는 직진 고백. 쉬운 단어의 설득력.",
  },
  {
    title: "주저하는 연인들을 위해",
    artist: "잔나비",
    moods: ["설렘", "그리움"],
    focus: "화법",
    point: "옛말투와 현대어를 섞은 어휘 선택이 노래의 인격을 만들어요. 단어의 시대감 연습.",
  },
  {
    title: "싸구려 커피",
    artist: "장기하와 얼굴들",
    moods: ["혼자", "불안"],
    focus: "화법",
    point: "노래말과 말하기의 경계. 구질구질할 만큼 구체적인 디테일이 만드는 생생함.",
  },
  {
    title: "어떻게 이별까지 사랑하겠어, 널 사랑하는 거지",
    artist: "AKMU",
    moods: ["이별"],
    focus: "반복",
    point: "제목 한 문장이 후렴이자 주제. 한 줄로 노래 전체를 지탱하는 법.",
  },
  {
    title: "걱정말아요 그대",
    artist: "이적",
    moods: ["희망"],
    focus: "반복",
    point: "위로의 말을 후렴으로 반복해 확신으로 바꾸는 구조. 청유형 문장의 온도.",
  },
  {
    title: "좋은 사람",
    artist: "토이 (Feat. 김연우)",
    moods: ["혼자", "그리움"],
    focus: "화법",
    point: "끝까지 말하지 못하는 사람의 어조. 짝사랑의 시점을 흔들림 없이 유지하는 법.",
  },
  {
    title: "사랑하기 때문에",
    artist: "유재하",
    moods: ["설렘", "고요함"],
    focus: "구조",
    point: "멜로디와 말의 호흡이 완전히 붙어 있는 교과서. 짧은 호흡으로 쓰는 연습에 좋아요.",
  },
  {
    title: "고백",
    artist: "델리스파이스",
    moods: ["설렘", "밤"],
    focus: "서사",
    point: "수줍은 마음을 구체적인 상황 하나로 보여주는 장면 중심 작법.",
  },
  {
    title: "청춘",
    artist: "산울림",
    moods: ["그리움", "혼자"],
    focus: "구조",
    point: "극도로 적은 단어로 큰 감정을 여는 여백의 작법. 말하지 않은 부분이 노래를 완성해요.",
  },
  {
    title: "눈사람",
    artist: "정승환",
    moods: ["이별", "고요함"],
    focus: "이미지",
    point: "녹아 사라지는 사물 하나로 이별 전체를 은유하는 법. 소재 선택의 힘.",
  },
  {
    title: "모든 날, 모든 순간",
    artist: "폴킴",
    moods: ["설렘"],
    focus: "반복",
    point: "같은 단어의 반복으로 마음의 크기를 키우는 후렴. 반복이 지루하지 않은 이유를 찾아보세요.",
  },
  {
    title: "난춘",
    artist: "새소년",
    moods: ["희망", "불안"],
    focus: "이미지",
    point: "시처럼 압축된 문장. 안아주는 행위 하나에 위로 전체를 싣는 법.",
  },
  {
    title: "광화문 연가",
    artist: "이문세",
    moods: ["그리움", "밤"],
    focus: "이미지",
    point: "장소가 기억을 불러오는 앵커가 되는 작법. 내 동네 지명으로 변주해보기 좋아요.",
  },
  {
    title: "봄날",
    artist: "방탄소년단",
    moods: ["그리움", "희망"],
    focus: "이미지",
    point: "계절과 기다림을 겹쳐 그리움을 시각화하는 은유. 계절어 활용법.",
  },
  {
    title: "양화대교",
    artist: "자이언티",
    moods: ["혼자", "희망"],
    focus: "서사",
    point: "일상어 후렴과 가족 서사의 결합. 특정 장소·직업의 디테일이 보편적 위로가 되는 과정.",
  },
  {
    title: "좋니",
    artist: "윤종신",
    moods: ["이별"],
    focus: "화법",
    point: "미련을 숨기지 않는 직설 화법. 질문형 후렴이 만드는 긴장.",
  },
  {
    title: "거리에서",
    artist: "성시경",
    moods: ["밤", "이별", "혼자"],
    focus: "이미지",
    point: "거리 풍경을 따라 걸으며 감정을 흘려보내는 시점 이동. 카메라처럼 쓰는 법.",
  },
  {
    title: "널 사랑하지 않아",
    artist: "어반자카파",
    moods: ["이별"],
    focus: "화법",
    point: "부정문의 반복으로 오히려 반대 감정이 들리게 하는 반어. 말과 속마음의 거리.",
  },
  {
    title: "비도 오고 그래서",
    artist: "헤이즈 (Feat. 신용재)",
    moods: ["비", "그리움"],
    focus: "화법",
    point: "날씨를 핑계 삼는 화법. 접속사 하나로 이어지는 자연스러운 말맛.",
  },
  {
    title: "우산",
    artist: "에픽하이 (Feat. 윤하)",
    moods: ["비", "이별"],
    focus: "이미지",
    point: "우산이라는 사물 하나에 관계의 거리를 담는 은유. 소품 중심 작법.",
  },
  {
    title: "달리기",
    artist: "S.E.S.",
    moods: ["달리기", "희망"],
    focus: "반복",
    point: "지친 마음을 달리기라는 행위로 치환. 단순한 반복이 응원이 되는 구조.",
  },
  {
    title: "한 페이지가 될 수 있게",
    artist: "DAY6",
    moods: ["달리기", "설렘"],
    focus: "반복",
    point: "청춘의 질주감을 만드는 짧은 호흡과 청유형 후렴. 속도감 있는 문장 연습.",
  },
  {
    title: "위잉위잉",
    artist: "혁오",
    moods: ["혼자", "불안"],
    focus: "이미지",
    point: "무기력을 날벌레 소리로 치환한 감각적 제목과 후렴. 의성어의 힘.",
  },
  {
    title: "백야",
    artist: "짙은",
    moods: ["밤", "고요함"],
    focus: "이미지",
    point: "밤의 정적을 긴 호흡의 문장으로 재현하는 분위기 작법.",
  },
  {
    title: "사계 (Four Seasons)",
    artist: "태연",
    moods: ["이별", "불안"],
    focus: "구조",
    point: "사계절의 순환으로 관계의 온도 변화를 그리는 구성. 시간 구조로 감정 설계하기.",
  },
  {
    title: "수고했어, 오늘도",
    artist: "옥상달빛",
    moods: ["희망", "달리기"],
    focus: "화법",
    point: "구어체 위로 한 문장을 후렴으로. 말 걸듯 쓰는 법.",
  },
  {
    title: "고등어",
    artist: "루시드폴",
    moods: ["고요함", "혼자"],
    focus: "화법",
    point: "사람이 아닌 것의 시점으로 쓴 노래. 시점을 바꾸면 새 문장이 나와요.",
  },
  {
    title: "한숨",
    artist: "이하이",
    moods: ["불안", "희망"],
    focus: "화법",
    point: "괜찮다는 말 대신 숨을 쉬라는 구체적 행동으로 건네는 위로. 추상을 행동으로 바꾸는 법.",
  },
];

/** "YYYY-MM-DD" → 1970-01-01부터의 일수. 타임존 영향 없이 하루에 정확히 1씩 증가한다. */
function dayNumber(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

/**
 * 오늘의 추천 곡. 날짜에 고정되며, 풀이 그대로인 한 어제와 반드시 다른 곡이 나온다.
 * 일수 × (풀 크기와 서로소인 스텝)으로 전곡을 골고루 순회한다.
 */
export function pickDaily(pool: SongRec[], todayKey: string, skip = 0): SongRec {
  const n = pool.length;
  const step = [17, 19, 23].find((k) => n % k !== 0) ?? 1;
  return pool[(((dayNumber(todayKey) * step) % n) + skip) % n];
}

/** 라이선스 문제로 가사 원문은 싣지 않는다. 네이버 가사 검색을 새 탭으로 연다. */
export function lyricsSearchUrl(title: string, artist?: string): string {
  const q = [title, artist, "가사"].filter(Boolean).join(" ");
  return `https://search.naver.com/search.naver?query=${encodeURIComponent(q)}`;
}
