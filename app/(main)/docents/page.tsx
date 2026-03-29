import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  pending: "대기",
  processing: "생성 중",
  done: "완료",
  error: "오류",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  processing: "secondary",
  done: "default",
  error: "destructive",
};

export default async function DocentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: docents } = await supabase
    .from("docents")
    .select("id, title, status, created_at, image_url")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">도슨트 목록</h1>
        <Link href="/docents/new" className={cn(buttonVariants())}>
          + 새 도슨트
        </Link>
      </div>

      {!docents || docents.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg mb-2">아직 생성된 도슨트가 없습니다</p>
          <p className="text-sm">전시 이미지를 업로드해 첫 도슨트를 만들어보세요</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {docents.map((d) => (
            <Link key={d.id} href={`/docents/${d.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                {d.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={d.image_url}
                    alt={d.title ?? "전시 이미지"}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2">
                      {d.title ?? "제목 없음"}
                    </CardTitle>
                    <Badge variant={STATUS_VARIANT[d.status] ?? "outline"}>
                      {STATUS_LABEL[d.status] ?? d.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">
                    {new Date(d.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
