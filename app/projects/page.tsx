import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TEAM } from "@/lib/team";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-1">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={13} />
            홈
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">프로젝트</h1>
        </div>

        <div className="grid gap-4">
          {TEAM.projects.map((project) => (
            <Card key={project.name}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-mono">{project.name}</CardTitle>
                    <CardDescription>{project.desc}</CardDescription>
                  </div>
                  <Link
                    href={project.url}
                    target="_blank"
                    className="shrink-0 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink size={15} />
                    GitHub
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs font-mono">{tag}</Badge>
                  ))}
                </div>
                {project.links.length > 0 && (
                  <div className="flex gap-3 flex-wrap pt-1">
                    {project.links.map((link) => (
                      <Link
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={13} />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
