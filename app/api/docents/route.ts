import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    console.error("[/api/docents] DB insert failed:", insertError.message, insertError.details);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  console.log("[/api/docents] Docent created:", docent.id, "title:", docent.title);
  return NextResponse.json({ docent });
}
