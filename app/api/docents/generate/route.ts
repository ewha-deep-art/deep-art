import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRandomDocentText, MOCK_AUDIO_URL } from "@/lib/mock";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const { docentId } = await req.json();
  if (!docentId) {
    logger.error("/api/docents/generate", "요청 거부 — docentId 누락");
    return NextResponse.json({ error: "docentId required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Mock: 1.5초 딜레이 후 샘플 텍스트 + 오디오 저장
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { error } = await supabase
    .from("docents")
    .update({
      docent_text: getRandomDocentText(),
      audio_url: MOCK_AUDIO_URL,
      status: "done",
    })
    .eq("id", docentId);

  if (error) {
    logger.error("/api/docents/generate", `AI 생성 실패 — ID: ${docentId} → ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logger.log("/api/docents/generate", `AI 생성 완료 — ID: ${docentId}, 텍스트·오디오 저장됨, status: done`);
  return NextResponse.json({ success: true });
}
