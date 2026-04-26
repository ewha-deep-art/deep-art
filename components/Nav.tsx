import Link from "next/link";
import { TEAM } from "@/lib/team";

const navLinks = [
  { href: "/", label: "팀 소개" },
  { href: "/projects", label: "프로젝트" },
  { href: "/docs", label: "문서" },
];

export default function Nav() {
  return (
    <header className="border-b bg-background">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          {TEAM.team.name}
          <span className="text-muted-foreground font-normal ml-1 text-sm">/ {TEAM.team.nameEn}</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
