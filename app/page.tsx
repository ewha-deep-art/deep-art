import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import Nav from "@/components/Nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TEAM } from "@/lib/team";

export default function HomePage() {
  const { team, members, projects, docs } = TEAM;

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* Hero */}
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground font-mono">{team.course}</p>
          <h1 className="text-3xl font-bold tracking-tight">
            {team.name}
            <span className="text-muted-foreground font-normal ml-2 text-2xl">({team.nameEn})</span>
          </h1>
          <p className="text-muted-foreground max-w-xl">{team.tagline}</p>
        </section>

        {/* 팀원 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">팀원</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {members.map((member, i) => (
              <Card key={i} size="sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    {member.role && (
                      <Badge variant="secondary" className="text-xs">{member.role}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Link
                    href={`https://github.com/${member.github}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <ExternalLink size={13} />
                    @{member.github}
                  </Link>
                  {member.blog && (
                    <Link
                      href={member.blog}
                      target="_blank"
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={13} />
                      블로그
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 프로젝트 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">프로젝트</h2>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              전체 보기 →
            </Link>
          </div>
          <div className="grid gap-4">
            {projects.map((project) => (
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
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={18} />
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
                    <div className="flex gap-3 flex-wrap">
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
        </section>

        {/* 문서 바로가기 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">문서</h2>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              전체 보기 →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {docs.map((doc) => (
              <Link key={doc.slug} href={`/docs/${doc.slug}`}>
                <Card size="sm" className="hover:border-foreground/30 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-3 py-3">
                    <FileText size={15} className="text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
