import { notFound } from "next/navigation";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { remark } from "remark";
import html from "remark-html";
import Nav from "@/components/Nav";
import { TEAM } from "@/lib/team";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TEAM.docs.map((doc) => ({ slug: doc.slug }));
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = TEAM.docs.find((d) => d.slug === slug);
  if (!doc) notFound();

  const filePath = join(process.cwd(), doc.file);
  if (!existsSync(filePath)) notFound();

  const raw = readFileSync(filePath, "utf-8");
  const processed = await remark().use(html).process(raw);
  const contentHtml = processed.toString();

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-1">
          <Link href="/docs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={13} />
            문서 목록
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{doc.title}</h1>
          <p className="text-sm text-muted-foreground">{doc.desc}</p>
        </div>

        <article
          className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-foreground"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </main>
    </div>
  );
}
