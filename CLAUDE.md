# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**디바트 (deep-art)** — Multimodal AI-based barrier-free audio docent auto-generation service (멀티모달 AI 기반 배리어프리 오디오 도슨트 자동 생성 서비스)

2026-1학기 캡스톤디자인·창업 프로젝트, Team 18.

The service analyzes exhibition images using vision models, generates accessible docent descriptions via LLM + RAG, and synthesizes audio via TTS — targeting visually impaired exhibition visitors and exhibition content creators.

## Team Workflow

- Decisions and system architecture must be documented (tracked in Notion)
- Blockers should be surfaced quickly via Slack

## Git Strategy

### Branch Structure (Gitflow)

- `main` — production-ready code; only receives merges from `dev`
- `dev` — integration branch; all feature work merges here
- `feature/*` — short-lived branches for individual features; always branched off `dev`

Feature branch naming should clearly reflect the scope of the feature being implemented (e.g., `feature/image-upload`, `feature/tts-integration`).

### Commit Convention

Commit whenever a meaningful unit of functionality is complete. Use the following prefixes:

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring without behavior change

### Pull Request & Code Review Process

- Open a PR when a feature branch has fully implemented its intended scope
- PRs target `dev` (never `main` directly)
- At least 1 team member review is required before merging to `dev`
- `main` is updated only via PRs from `dev`

## Commands

```bash
npm run dev      # local dev server (localhost:3000)
npm run build    # production build
npm run lint     # lint check
```

## Tech Stack

- **Next.js 16** (App Router, TypeScript) — `app/` directory
- **shadcn/ui v4** (base-ui, Tailwind CSS v4) — `components/ui/`
- **Supabase** (Auth, PostgreSQL, Storage) — `lib/supabase/`
- **Vercel** — deployment

## Architecture

### Current (MVP)

Three core modules, AI replaced with Mock APIs for now:

1. **Image Analysis** — `app/api/docents/generate/route.ts` (mock → replace with Vision/LMM)
2. **Content Generation** — same route, returns sample text (mock → replace with LLM+RAG)
3. **Voice Synthesis** — `app/api/docents/audio/route.ts` (mock → replace with TTS)

### Auth flow

`proxy.ts` (Next.js 16 proxy convention, replaces middleware) handles auth-based redirects.
Supabase SSR clients: `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server).

### Supabase schema

```sql
profiles(id uuid references auth.users, display_name text)
docents(id, user_id, title, image_url, docent_text, audio_url, status, created_at)
```

RLS: `user_id = auth.uid()` on all docents operations.
Storage bucket: `docent-images` (public read).

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Set in `.env.local` locally, and in Vercel project settings for deployment.
After first Vercel deploy, update Supabase Auth → Site URL to the Vercel deployment URL.
