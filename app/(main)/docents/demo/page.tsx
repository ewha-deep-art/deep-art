import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AudioPlayer from "@/components/docent/AudioPlayer";
import { getRandomDocentText, MOCK_AUDIO_URL } from "@/lib/mock";

export default async function DemoDocentPage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; image_url?: string }>;
}) {
  const { title, image_url } = await searchParams;
  const docentText = getRandomDocentText();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/docents" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          ← 목록
        </Link>
        <Badge variant="default">생성 완료</Badge>
        <span className="text-xs text-gray-400">(데모 — DB 저장 안 됨)</span>
      </div>

      <h1 className="text-2xl font-semibold">{title ?? "제목 없음"}</h1>

      {image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image_url}
          alt={title ?? "전시 이미지"}
          className="w-full rounded-lg object-contain max-h-80 bg-gray-100"
        />
      )}

      <div className="space-y-4">
        <AudioPlayer src={MOCK_AUDIO_URL} />
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-3">도슨트 텍스트</h2>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{docentText}</p>
        </div>
      </div>
    </div>
  );
}
