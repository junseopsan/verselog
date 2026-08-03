"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PHONE_REGEX, requestOtp } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = PHONE_REGEX.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
    setSending(true);
    setError(null);
    const result = await requestOtp(phone);
    setSending(false);
    if (result.success) {
      router.push(`/verify?phone=${phone}`);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col justify-center px-2 pb-24">
      <header className="mb-12 text-center">
        <span
          aria-hidden
          className="mb-3 block font-serif text-4xl leading-none text-accent/30"
        >
          &ldquo;
        </span>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          필사와 변주
        </h1>
        <p className="mt-3 text-sm text-muted">
          매일 한 줄, 끊기지 않는 작사 루틴
        </p>
        <div aria-hidden className="mx-auto mt-5 h-px w-12 bg-accent/70" />
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs text-muted">휴대폰 번호</span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={11}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/[^0-9]/g, ""));
              if (error) setError(null);
            }}
            placeholder="01012345678"
            className="w-full rounded-lg border border-edge bg-surface px-3 py-3 text-[16px] tracking-wide transition-colors duration-200 placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </label>

        {error && <p className="text-sm text-accent">{error}</p>}

        <button
          type="submit"
          disabled={!valid || sending}
          className="press w-full rounded-xl bg-accent py-3.5 font-semibold text-background shadow-lg shadow-accent/20 disabled:opacity-40 disabled:shadow-none"
        >
          {sending ? "발송 중…" : "인증번호 받기"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        입력한 번호로 인증번호 문자가 발송됩니다.
      </p>
    </div>
  );
}
