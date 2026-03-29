"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function NewDocentPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError("이미지를 선택해주세요."); return; }
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      // 1. Storage에 이미지 업로드 (실패 시 로컬 미리보기로 대체)
      const ext = file.name.split(".").pop();
      const storagePath = `${user.id}/${Date.now()}.${ext}`;
      let publicUrl: string | null = null;

      const { error: uploadError } = await supabase.storage
        .from("docent-images")
        .upload(storagePath, file);
      if (!uploadError) {
        publicUrl = supabase.storage
          .from("docent-images")
          .getPublicUrl(storagePath).data.publicUrl;
      }

      // 2. DB에 도슨트 row 생성 (서버 API를 통해 인증 세션 확실히 전달)
      const createRes = await fetch("/api/docents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || file.name, image_url: publicUrl }),
      });

      if (!createRes.ok) {
        // DB 저장 불가 → mock 데모 페이지로 fallback
        const params = new URLSearchParams({ title: title || file.name });
        if (preview) params.set("image_url", preview);
        router.push(`/docents/demo?${params.toString()}`);
        return;
      }

      const { docent } = await createRes.json();

      // 3. Mock 생성 API 호출
      await fetch("/api/docents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docentId: docent.id }),
      });

      router.push(`/docents/${docent.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-6">새 도슨트 생성</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">제목 (선택)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="전시 작품명을 입력하세요"
          />
        </div>

        <div className="space-y-2">
          <Label>전시 이미지 *</Label>
          <Card
            className="border-2 border-dashed cursor-pointer hover:border-black transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-10 gap-2">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="미리보기" className="max-h-48 rounded object-contain" />
              ) : (
                <>
                  <span className="text-4xl">🖼️</span>
                  <p className="text-sm text-gray-500">클릭하여 이미지를 선택하세요</p>
                  <p className="text-xs text-gray-400">JPG, PNG, WEBP 지원</p>
                </>
              )}
            </CardContent>
          </Card>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "도슨트 생성 중..." : "도슨트 생성하기"}
        </Button>
      </form>
    </div>
  );
}
