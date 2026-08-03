"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import BottomNav from "./BottomNav";

const PUBLIC_PATHS = ["/login", "/verify"];

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // undefined = 확인 전, null = 비로그인
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    // iOS PWA는 백그라운드에서 토큰 갱신 타이머가 멈추므로 복귀 시 세션을 확인한다.
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (session === undefined) return;
    if (session === null && !isPublic) router.replace("/login");
    if (session !== null && isPublic) router.replace("/");
  }, [session, isPublic, router]);

  if (session === undefined) {
    return null;
  }
  if ((session === null && !isPublic) || (session !== null && isPublic)) {
    return null;
  }

  return (
    <>
      {children}
      {!isPublic && <BottomNav />}
    </>
  );
}
