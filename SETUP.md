# verse-log 2차 설정 가이드

코드, Edge Function 배포, DB 마이그레이션까지 완료된 상태입니다. 아래 항목만 직접 마무리하면 됩니다.

## 1. DB 마이그레이션 적용 — ✅ 완료

`entries` 테이블 + RLS 정책이 MCP로 적용되었습니다 (2026-08-01).
로컬 파일: `supabase/migrations/20260801000000_create_entries.sql`, `20260801000001_optimize_entries_rls.sql`

## 2. 전화번호 로그인 활성화 (필수)

[Auth 설정](https://supabase.com/dashboard/project/eqgmgsgpouuqgncfebjy/auth/providers)에서:

1. **Providers → Phone** 활성화
2. **Hooks → Send SMS hook** → Edge Function `send-sms` 선택해 등록
3. **Edge Functions → Secrets**에 SENS 키 4개 등록 (onmatout 프로젝트와 같은 값):
   - `NCP_SENS_SERVICE_ID`
   - `NCP_SENS_ACCESS_KEY`
   - `NCP_SENS_SECRET_KEY`
   - `NCP_SENS_FROM`
4. **Providers → Phone → Test OTPs**에 테스트 번호 등록 (개발 중 실제 SMS 없이 로그인):
   - 예: `+821000000000` → 코드 `000000`

## 3. AI 피드백 키 (필수)

Edge Functions → Secrets에 `OPENAI_API_KEY` 등록. 또는:

```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

- 모델: GPT-5 mini — 피드백 1회당 1원 미만
- 피드백은 기록별로 캐시되어 "다시 받기"를 누르지 않는 한 재과금되지 않습니다

## 4. 1차 기록 옮기기 (선택, 1회)

1차(LocalStorage) 버전에서 **통계 → 내보내기**로 JSON 백업
→ 2차 로그인 후 **통계 → 가져오기 → 합치기**.

## 확인 체크리스트

- [x] DB 마이그레이션 적용 (MCP로 완료)
- [ ] Test OTP 번호로 로그인 → 기록 작성 → 새로고침해도 유지
- [ ] 본인 번호로 실제 SMS 1회 수신 확인
- [ ] 변주 있는 기록에서 "AI 피드백 받기" 동작
- [ ] 로그아웃 → /login 리다이렉트 확인
