"use client";

export default function AudioPlayer({ src }: { src: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <p className="text-xs text-gray-400 mb-2">오디오 도슨트</p>
      <audio
        controls
        src={src}
        className="w-full"
        aria-label="오디오 도슨트 재생"
      >
        브라우저가 오디오를 지원하지 않습니다.
      </audio>
    </div>
  );
}
