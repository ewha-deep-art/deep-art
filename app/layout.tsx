import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "디바트 | deep-art",
  description: "2026-1 캡스톤디자인·창업 Team 18 — 멀티모달 AI 기반 배리어프리 오디오 도슨트 자동 생성 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${geist.className} min-h-full`}>{children}</body>
    </html>
  );
}
