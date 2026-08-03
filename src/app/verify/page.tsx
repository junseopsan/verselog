"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestOtp, verifyOtp } from "@/lib/auth";

const RESEND_SECONDS = 180;

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  if (!phone) {
    return (
      <p className="pt-16 text-center text-sm text-muted">
        잘못된 접근입니다. 로그인 화면에서 다시 시도해주세요.
      </p>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    const result = await verifyOtp(phone, code);
    if (result.success) {
      router.replace("/");
      return;
    }
    setBusy(false);
    setError(result.message);
  };

  const handleResend = async () => {
    if (remaining > 0 || busy) return;
    setBusy(true);
    setError(null);
    const result = await requestOtp(phone);
    setBusy(false);
    if (result.success) {
      setRemaining(RESEND_SECONDS);
      setCode("");
    } else {
      setError(result.message);
    }
  };

  const mm = String(Math.floor(Math.max(remaining, 0) / 60));
  const ss = String(Math.max(remaining, 0) % 60).padStart(2, "0");

  return (
    <div className="flex min-h-dvh flex-col justify-center px-2 pb-24">
      <header className="mb-10 space-y-2 text-center">
        <h1 className="font-serif text-2xl font-semibold">인증번호 입력</h1>
        <p className="text-sm text-muted">
          {phone}로 발송된 6자리 코드를 입력해주세요.
        </p>
      </header>

      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/[^0-9]/g, ""));
            if (error) setError(null);
          }}
          placeholder="000000"
          className="w-full rounded-lg border border-edge bg-surface px-3 py-3 text-center text-2xl tracking-[0.5em] tabular-nums transition-colors duration-200 placeholder:text-muted/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />

        {error && <p className="text-center text-sm text-accent">{error}</p>}

        <button
          type="submit"
          disabled={code.length !== 6 || busy}
          className="press w-full rounded-xl bg-accent py-3.5 font-semibold text-background shadow-lg shadow-accent/20 disabled:opacity-40 disabled:shadow-none"
        >
          {busy ? "확인 중…" : "인증하기"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        {remaining > 0 ? (
          <span>
            재전송 가능까지 {mm}:{ss}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-accent"
          >
            인증번호 재전송
          </button>
        )}
      </div>
    </div>
  );
}
