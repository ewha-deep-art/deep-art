# 구현 범위 (MVP Scope)

## 포함

| 기능 | 설명 |
|------|------|
| 인증 | Supabase Auth 기반 이메일/비밀번호 로그인·회원가입 |
| 도슨트 생성 플로우 | 이미지 업로드 → Mock AI 처리(딜레이 시뮬레이션) → 결과 저장 |
| 도슨트 목록 | 사용자별 생성 히스토리 카드 목록 |
| 결과 페이지 | 생성 텍스트 표시 + HTML5 오디오 플레이어 |
| DB / Storage | Supabase PostgreSQL + Storage (이미지 저장) |
| 배포 | Vercel (GitHub 연동 자동 배포) |

## 제외 (Mock 처리)

- 실제 Vision / LMM API 호출 (이미지 분석)
- 실제 LLM + RAG API 호출 (도슨트 텍스트 생성)
- 실제 TTS API 호출 (오디오 합성)
- 관리자 화면, 전시 관리, 다국어

## 화면 목록

| 경로 | 화면 |
|------|------|
| `/login` | 로그인 |
| `/signup` | 회원가입 |
| `/docents` | 도슨트 히스토리 목록 |
| `/docents/new` | 이미지 업로드 + 생성 트리거 |
| `/docents/[id]` | 도슨트 결과 (텍스트 + 오디오) |

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- shadcn/ui + Tailwind CSS
- Supabase (Auth, PostgreSQL, Storage)
- Vercel

## Supabase Schema

```sql
-- 사용자 프로필
create table profiles (
  id uuid references auth.users primary key,
  display_name text
);

-- 도슨트
create table docents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade,
  title       text,
  image_url   text,
  docent_text text,
  audio_url   text,
  status      text default 'pending', -- pending | processing | done | error
  created_at  timestamptz default now()
);
```

RLS: `user_id = auth.uid()` 정책 적용 필요

## Mock API

| 엔드포인트 | 동작 |
|-----------|------|
| `POST /api/docents/generate` | 1.5초 딜레이 후 샘플 텍스트 저장, status → done |
| `POST /api/docents/audio` | 샘플 mp3 URL을 audio_url에 저장 |

실제 AI 연동 시 이 두 Route Handler만 교체하면 됩니다.
