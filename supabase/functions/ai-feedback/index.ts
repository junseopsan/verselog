// AI 피드백 Edge Function
// 호출자 JWT로 Supabase 클라이언트를 만들어 RLS가 소유권 검증을 담당한다.
// GPT-5 구조화 출력으로 5개 기준 피드백을 생성하고 entries.ai_feedback에 캐시한다.
import { createClient } from "npm:@supabase/supabase-js@2";
import OpenAI from "npm:openai";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info",
};

const FEEDBACK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "overall",
    "scene",
    "directEmotion",
    "hookPotential",
    "wordChoice",
    "rhythm",
  ],
  properties: {
    overall: { type: "string", description: "전체 총평 2~3문장" },
    scene: { type: "string", description: "장면성: 장면이 그려지는가" },
    directEmotion: {
      type: "string",
      description: "감정의 직접성: 감정을 직접 말하지 않고 보여주는가",
    },
    hookPotential: {
      type: "string",
      description: "후렴 가능성: 반복하고 싶은 한 줄이 있는가",
    },
    wordChoice: {
      type: "string",
      description: "단어의 추상성과 신선함",
    },
    rhythm: { type: "string", description: "리듬감: 멜로디에 얹기 좋은 호흡인가" },
  },
} as const;

const SYSTEM_PROMPT = `당신은 K-POP 작사를 가르치는 따뜻하고 구체적인 멘토입니다.
작사 지망생이 좋아하는 가사를 필사한 뒤 자기 문장으로 변주한 2줄을 평가합니다.

평가 기준:
1. 장면성 — 장면이 눈에 보이는가
2. 감정의 직접성 — 감정을 직접 말하지 않고 장면과 사물로 보여주는가
3. 후렴 가능성 — 후렴처럼 반복하고 싶은 한 줄이 있는가
4. 단어의 추상성과 신선함 — 단어가 과하게 추상적이지 않고 신선한가
5. 리듬감 — 멜로디에 얹기 좋은 짧은 호흡인가

원칙:
- 각 항목 2~3문장, 사용자의 실제 문장을 인용하며 구체적으로.
- 칭찬할 지점을 먼저 찾고, 개선점은 구체적인 다시 쓰기 방향 1가지로 제안.
- 따뜻하지만 두루뭉술하지 않게. 한국어로.`;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return json({ error: "로그인이 필요합니다." }, 401);
  }

  let entryId: string | undefined;
  let force = false;
  try {
    const body = await req.json();
    entryId = body.entryId;
    force = body.force === true;
  } catch {
    // fall through to validation below
  }
  if (!entryId) {
    return json({ error: "entryId가 필요합니다." }, 400);
  }

  // RLS 하에서 조회 — 남의 entry는 0 rows
  const { data: entry, error: selectError } = await supabase
    .from("entries")
    .select("id, song_title, artist, copied_lyrics, favorite_expression, reason, moods, my_lines, ai_feedback, ai_feedback_at")
    .eq("id", entryId)
    .maybeSingle();

  if (selectError) {
    return json({ error: "기록 조회에 실패했습니다." }, 500);
  }
  if (!entry) {
    return json({ error: "기록을 찾을 수 없습니다." }, 404);
  }
  if (entry.ai_feedback && !force) {
    return json({ feedback: entry.ai_feedback, aiFeedbackAt: entry.ai_feedback_at });
  }
  if (!entry.my_lines?.trim()) {
    return json(
      { error: "변주(내 문장)가 있어야 피드백을 받을 수 있어요." },
      400,
    );
  }

  const openai = new OpenAI();

  const context = [
    entry.song_title && `필사한 곡: ${entry.song_title}${entry.artist ? ` — ${entry.artist}` : ""}`,
    `필사한 가사:\n${entry.copied_lyrics}`,
    entry.favorite_expression && `사용자가 좋았다고 한 표현: ${entry.favorite_expression}`,
    entry.reason && `좋았던 이유: ${entry.reason}`,
    entry.moods?.length ? `오늘의 분위기: ${entry.moods.join(", ")}` : null,
    `\n평가할 변주 2줄:\n${entry.my_lines}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  let response;
  try {
    response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 4096,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "lyric_feedback",
          strict: true,
          schema: FEEDBACK_SCHEMA,
        },
      },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: context },
      ],
    });
  } catch (err) {
    console.error("openai error", err);
    return json({ error: "피드백 생성에 실패했습니다. 잠시 후 다시 시도해주세요." }, 502);
  }

  const message = response.choices[0]?.message;
  if (message?.refusal) {
    return json({ refused: true, message: "이 내용에는 피드백을 제공할 수 없어요." });
  }

  const text = message?.content;
  if (!text) {
    return json({ error: "피드백 생성에 실패했습니다." }, 502);
  }

  let feedback;
  try {
    feedback = JSON.parse(text);
  } catch {
    return json({ error: "피드백 형식이 올바르지 않습니다. 다시 시도해주세요." }, 502);
  }

  const aiFeedbackAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("entries")
    .update({ ai_feedback: feedback, ai_feedback_at: aiFeedbackAt })
    .eq("id", entryId);
  if (updateError) {
    console.error("persist error", updateError.message);
    // 저장 실패해도 피드백 자체는 반환
  }

  return json({ feedback, aiFeedbackAt });
});
