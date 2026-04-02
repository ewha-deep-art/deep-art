import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { getFileName } from "@/lib/utils";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { title, image_url } = await req.json();

  const { data: docent, error: insertError } = await supabase
    .from("docents")
    .insert({
      user_id: DEMO_USER_ID,
      title,
      image_url: image_url ?? "",
      status: "processing",
    })
    .select()
    .single();

  if (insertError) {
    logger.error("/api/docents", `도슨트 생성 실패 — 제목: "${title}", 이미지: ${getFileName(image_url)} → ${insertError.message}`);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  logger.log("/api/docents", `도슨트 생성 완료 — ID: ${docent.id}, 제목: "${docent.title}", 이미지: ${getFileName(docent.image_url)}`);
  return NextResponse.json({ docent });
}
