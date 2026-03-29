import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AudioPlayer from "@/components/docent/AudioPlayer";

const STATUS_LABEL: Record<string, string> = {
  pending: "대기 중",
  processing: "AI 분석 중...",
  done: "생성 완료",
  error: "생성 오류",
};

export default async function DocentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: docent } = await supabase
    .from("docents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!docent) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/docents" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          ← 목록
        </Link>
        <Badge variant={docent.status === "done" ? "default" : "secondary"}>
          {STATUS_LABEL[docent.status] ?? docent.status}
        </Badge>
      </div>

      <h1 className="text-2xl font-semibold">{docent.title ?? "제목 없음"}</h1>

      {docent.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={docent.image_url}
          alt={docent.title ?? "전시 이미지"}
          className="w-full rounded-lg object-contain max-h-80 bg-gray-100"
        />
      )}

      {docent.status === "processing" && (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <p className="text-blue-600 animate-pulse">AI가 도슨트를 생성하고 있습니다...</p>
          <p className="text-sm text-blue-400 mt-1">페이지를 새로고침하면 결과를 확인할 수 있습니다</p>
        </div>
      )}

      {docent.status === "done" && docent.docent_text && (
        <div className="space-y-4">
          {docent.audio_url && <AudioPlayer src={docent.audio_url} />}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-3">도슨트 텍스트</h2>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {docent.docent_text}
            </p>
          </div>
        </div>
      )}

      {docent.status === "error" && (
        <div className="bg-red-50 rounded-lg p-6 text-center text-red-600">
          도슨트 생성 중 오류가 발생했습니다. 다시 시도해주세요.
        </div>
      )}

      <p className="text-xs text-gray-400">
        생성일: {new Date(docent.created_at).toLocaleString("ko-KR")}
      </p>
    </div>
  );
}
