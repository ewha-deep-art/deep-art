import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import Nav from "@/components/Nav";
import { Card, CardContent } from "@/components/ui/card";
import { TEAM } from "@/lib/team";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-1">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={13} />
            홈
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">문서</h1>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {TEAM.docs.map((doc) => (
            <Link key={doc.slug} href={`/docs/${doc.slug}`}>
              <Card className="hover:border-foreground/30 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-3 py-4">
                  <FileText size={16} className="text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
