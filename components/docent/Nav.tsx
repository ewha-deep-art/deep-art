import Link from "next/link";

export default function Nav() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
        <Link href="/docents" className="font-semibold text-lg tracking-tight">
          디바트
        </Link>
      </div>
    </header>
  );
}
