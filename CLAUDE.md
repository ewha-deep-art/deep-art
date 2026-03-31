# CLAUDE.md

## Project Overview

**디바트 (deep-art)** — Multimodal AI-based barrier-free audio docent auto-generation service (멀티모달 AI 기반 배리어프리 오디오 도슨트 자동 생성 서비스)

2026-1학기 캡스톤디자인·창업 프로젝트, Team 18.

The service analyzes exhibition images using vision models, generates accessible docent descriptions via LLM + RAG, and synthesizes audio via TTS — targeting visually impaired exhibition visitors and exhibition content creators.

## Git Strategy

### Branch Structure (Gitflow)

- `main` — production-ready code; only receives merges from `dev`
- `dev` — integration branch; all feature work merges here
- `feature/*` — short-lived branches for individual features; always branched off `dev`

Feature branch naming should clearly reflect the scope of the feature being implemented (e.g., `feature/image-upload`, `feature/tts-integration`).

**IMPORTANT — Claude Code workflow rule:** Before making any code change in a conversation, Claude MUST first create a feature branch off `dev`:

```bash
git checkout dev && git pull
git checkout -b feature/<descriptive-name>
```

This must happen exactly once per conversation, before the first edit. Do not modify files on `main` or `dev` directly.

### Commit Convention

Commit whenever a meaningful unit of functionality is complete. Use the following prefixes:

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring without behavior change

### Pull Request & Code Review Process

- Open a PR when a feature branch has fully implemented its intended scope
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
- **Supabase** (Auth, PostgreSQL, Storage) — `lib/supabase/`
- **Vercel** — deployment

## Architecture

### Route Structure

```
app/
├── (auth)/          # Public pages (no auth check)
│   ├── login/
│   └── signup/
└── (main)/          # Protected pages — layout.tsx enforces auth
    └── docents/
        ├── page.tsx       # List
        ├── new/page.tsx   # Create
        ├── demo/page.tsx  # Mock fallback detail (no DB required)
        └── [id]/page.tsx  # Detail
```

### API Routes

```
app/api/docents/
├── route.ts          # POST — create docent row (server-side insert, auth via cookies)
├── generate/route.ts # POST — mock AI generation (sets docent_text, audio_url, status=done)
└── audio/route.ts    # currently unused
```

### Current (MVP)

Three core modules, AI replaced with Mock APIs for now:

1. **Image Analysis** — `app/api/docents/generate/route.ts` (mock → replace with Vision/LMM)
2. **Content Generation** — same route, returns sample text (mock → replace with LLM+RAG)
3. **Voice Synthesis** — `app/api/docents/generate/route.ts` also sets mock audio_url (mock → replace with TTS); `app/api/docents/audio/route.ts` exists but is currently unused

Mock data lives in `lib/mock.ts` (3 sample Korean art descriptions + sample audio URL).

### Docent creation flow

1. User uploads image → stored in Supabase Storage (`docent-images/demo/{timestamp}.ext`)
   - If upload fails → show error and abort (do not proceed to DB insert)
2. Client POSTs to `/api/docents` (server route) → server Supabase client inserts row with `status: "processing"`
   - If insert fails → redirects to `/docents/demo` (mock fallback, no DB required)
3. Client awaits `/api/docents/generate` — updates DB with text, audio_url, `status: "done"`
4. User is redirected to `/docents/[id]`

Both API routes log success/failure to the server console (`[/api/docents]`, `[/api/docents/generate]`).

### Auth flow

Auth is **disabled for demo**. No login required; all pages are publicly accessible.
`middleware.ts` is a passthrough stub (no session logic).
Supabase SSR clients: `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server).

> **When re-enabling auth:** add `supabase.auth.getUser()` guard back to `app/(main)/layout.tsx`, restore RLS on `docents` table, re-add FK `docents.user_id → profiles(id)`, and replace `DEMO_USER_ID` with real `auth.uid()` in `app/api/docents/route.ts`.

### Supabase schema

```sql
docents(id, user_id, title, image_url, docent_text, audio_url, status, created_at)
```

RLS: **disabled** on `docents` table (no-auth demo mode).

Storage bucket: `docent-images` (public read + public insert allowed via policy).

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Set in `.env.local` locally. Already configured in Vercel project settings for production.

## Claude Code Plugins

Active plugins: `supabase` (MCP — use for DB queries, schema, migrations, logs), `feature-dev` (`/feature-dev`), `code-simplifier` (`/simplify`), `claude-md-management` (`/revise-claude-md`)

## Deployed URL

https://deep-kk2ptu2bp-deepartcommon-9456s-projects.vercel.app/
