import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MOCK_AUDIO_URL } from "@/lib/mock";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const { docentId } = await req.json();
  if (!docentId) {
    logger.error("/api/docents/audio", "요청 거부 — docentId 누락");
    return NextResponse.json({ error: "docentId required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("docents")
    .update({ audio_url: MOCK_AUDIO_URL })
    .eq("id", docentId);

  if (error) {
    logger.error("/api/docents/audio", `오디오 URL 저장 실패 — ID: ${docentId} → ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  logger.log("/api/docents/audio", `오디오 URL 저장 완료 — ID: ${docentId}`);
  return NextResponse.json({ audio_url: MOCK_AUDIO_URL });
}
