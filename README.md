# verselog.

매일 좋은 가사를 한 줄 필사하고, 내 문장으로 변주하는 작사 루틴 기록장.

- **웹**: https://verselog.app (예정)
- **스택**: Next.js 16 · React 19 · Tailwind v4 · Supabase (Auth/DB/Edge Functions)

## 주요 기능

- 전화번호(SMS OTP) 로그인 — NCP SENS 연동 Edge Function
- 오늘의 필사 + 내 문장 2줄 변주 기록
- 연속 기록(스트릭) · 주간 리포트 · 분위기 통계
- 후렴 후보 모음, 보관함 검색/필터
- AI 피드백 — 변주 2줄에 대해 장면성·후렴 가능성·리듬감 등 5개 기준 코칭
- JSON 백업 내보내기/가져오기

## 개발

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npx vitest run     # 단위 테스트
```

`.env.local`에 Supabase URL/키가 필요합니다. 서버 측 설정은 `SETUP.md` 참고.

## 구조

- `src/app/` — 화면 (홈·기록·보관함·통계·후렴 후보·설정·로그인)
- `src/components/` — 공용 컴포넌트
- `src/lib/` — 데이터 훅, 통계/백업 로직 (테스트 포함)
- `supabase/` — DB 마이그레이션, Edge Functions (`send-sms`, `ai-feedback`)
- `public/brand/` — 로고/브랜드 에셋
