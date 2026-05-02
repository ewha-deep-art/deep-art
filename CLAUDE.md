# CLAUDE.md

## Project Overview

**디바트 (deep-art)** — 2026-1학기 캡스톤디자인과창업프로젝트B Team 18 소개 웹사이트

## Git Strategy

### Branch Structure (Gitflow)

- `main` — production-ready code; only receives merges from `dev`
- `dev` — integration branch; all feature work merges here
- `feature/*` — short-lived branches; always branched off `dev`

**IMPORTANT — Claude Code workflow rule:** Before making any code change in a conversation, Claude MUST first create a feature branch off `dev`:

```bash
git checkout dev && git pull
git checkout -b feature/<descriptive-name>
```

This must happen exactly once per conversation, before the first edit. Do not modify files on `main` or `dev` directly.

### Commit Convention

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring without behavior change

### Pull Request & Code Review Process

- PRs target `dev` (never `main` directly)
- `main` is updated only via PRs from `dev`

## Commands

```bash
npm run dev      # local dev server (localhost:3000)
npm run build    # production build
npm run lint     # lint check
```

## Tech Stack

- **Next.js 16** (App Router, TypeScript) — `app/` directory
- **React 19** — `react@19.2.4`
- **shadcn/ui v4** (base-ui, Tailwind CSS v4) — `components/ui/`
- **Vercel** — deployment

## Architecture

### Route Structure

```
app/
├── page.tsx            # 메인 (팀 소개 + 팀원 + 프로젝트 + 문서)
├── projects/page.tsx   # 프로젝트 레포 목록
└── docs/
    ├── page.tsx        # 문서 목록
    └── [slug]/page.tsx # 개별 문서 (md 렌더링)
```

### Team Data

모든 팀 데이터는 `data/team.json`에서 관리, `lib/team.ts`가 타입과 함께 import:
- `members` — 팀원 이름, 역할, GitHub, 블로그
- `projects` — 레포 목록; `links[]`로 발표 자료·영상 링크 추가
- `docs` — 렌더링할 문서 목록

### Document Rendering

`content/` 디렉토리의 마크다운 파일을 `remark` + `remark-html`로 서버 사이드 렌더링.
새 문서 추가 시 `docs` 배열에 항목 등록 필요.

## Claude Code Plugins

Active plugins: `feature-dev` (`/feature-dev`), `code-simplifier` (`/simplify`)

## Deployed URL

https://deep-kk2ptu2bp-deepartcommon-9456s-projects.vercel.app/
