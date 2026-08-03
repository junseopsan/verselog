import { createClient } from "@supabase/supabase-js";

// URL과 publishable 키는 브라우저에 노출되는 공개값 (데이터 보호는 RLS 담당).
// 배포 환경에 빌드 변수가 없어도 동작하도록 기본값을 둔다.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://eqgmgsgpouuqgncfebjy.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "sb_publishable_yYZ27PHah5e68PS9pdS_SQ_Q8UtXsUe",
);
