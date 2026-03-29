import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MOCK_AUDIO_URL } from "@/lib/mock";

export async function POST(req: NextRequest) {
  const { docentId } = await req.json();
  if (!docentId) return NextResponse.json({ error: "docentId required" }, { status: 400 });

  const supabase = await createClient();

  const { error } = await supabase
    .from("docents")
    .update({ audio_url: MOCK_AUDIO_URL })
    .eq("id", docentId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ audio_url: MOCK_AUDIO_URL });
}
