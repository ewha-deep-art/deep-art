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

1. User uploads image → stored in Supabase Storage (`docent-images/{user_id}/{timestamp}.ext`)
2. Client POSTs to `/api/docents` (server route) → server Supabase client inserts row with `status: "processing"`
   - If insert fails → redirects to `/docents/demo` (mock fallback, no DB required)
3. `/api/docents/generate` called fire-and-forget (no await) — updates DB with text, audio_url, `status: "done"`
4. User is redirected to `/docents/[id]` and refreshes to see results

> **Why server-side insert?** Supabase RLS `auth.uid()` requires the JWT to be present in the request. Browser clients sometimes fail to pass the JWT correctly to the DB; using the server Supabase client (reads cookies directly) is more reliable.

### Auth flow

`app/(main)/layout.tsx` (Server Component) calls `supabase.auth.getUser()` and redirects to `/login` if unauthenticated.
`middleware.ts` handles Supabase session refresh (token rotation) — required for server components to read auth cookies correctly. No auth logic in middleware; auth gate is solely in `(main)/layout.tsx`.
Supabase SSR clients: `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server).

### Supabase schema

```sql
docents(id, user_id, title, image_url, docent_text, audio_url, status, created_at)
```

RLS policies required on `docents` table:
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id` (WITH CHECK)
- UPDATE: `auth.uid() = user_id`

Storage bucket: `docent-images` (public read).

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
