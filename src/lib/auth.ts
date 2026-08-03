import { supabase } from "./supabase";

export type AuthResult = {
  success: boolean;
  message: string;
};

/** 휴대폰 입력 검증: 010으로 시작하는 10~11자리 */
export const PHONE_REGEX = /^010\d{7,8}$/;

// onmatout_rn lib/api/auth.ts에서 이식한 E.164 정규화
function toE164(rawPhone: string): string {
  const digits = rawPhone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return "+82" + digits.slice(1);
  if (digits.startsWith("82")) return "+" + digits;
  if (digits.startsWith("1") || digits.startsWith("2")) return "+82" + digits;
  return "+" + digits;
}

function isRateLimitError(error: unknown): boolean {
  if (!error) return false;
  const e = error as { message?: string; status?: number };
  const message = (e.message || "").toLowerCase();
  return (
    e.status === 429 ||
    message.includes("rate limit") ||
    message.includes("you can only request this after")
  );
}

function getRateLimitMessage(error: unknown): string {
  const rawMessage = (error as { message?: string })?.message || "";
  const match = rawMessage.match(/after (\d+) seconds/i);
  const seconds = match ? match[1] : "60";
  return `요청이 너무 자주 발생하고 있습니다. 약 ${seconds}초 후에 다시 시도해주세요.`;
}

export async function requestOtp(phone: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOtp({
    phone: toE164(phone),
  });

  if (error) {
    if (isRateLimitError(error)) {
      return { success: false, message: getRateLimitMessage(error) };
    }
    return {
      success: false,
      message: "인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
  return { success: true, message: "인증번호가 발송되었습니다." };
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: toE164(phone),
    token: code,
    type: "sms",
  });

  if (error) {
    if (isRateLimitError(error)) {
      return { success: false, message: getRateLimitMessage(error) };
    }
    let message = "인증 코드가 올바르지 않습니다.";
    if (error.message.includes("Token has expired or is invalid")) {
      message = "인증 코드가 올바르지 않거나 만료되었습니다. 다시 확인해주세요.";
    } else if (error.message.includes("expired")) {
      message = "인증 코드가 만료되었습니다. 새로운 코드를 요청해주세요.";
    } else if (error.message.includes("invalid")) {
      message = "인증 코드가 올바르지 않습니다. 다시 입력해주세요.";
    }
    return { success: false, message };
  }

  if (!data.session) {
    return {
      success: false,
      message: "로그인에 실패했습니다. 다시 시도해주세요.",
    };
  }
  return { success: true, message: "로그인되었습니다." };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
