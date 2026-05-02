# 디바트 (deep-art)

2026-1학기 캡스톤디자인과창업프로젝트B Team 18 소개 웹사이트

---

## 로컬에서 실행하기

```bash
npm install
npm run dev   # http://localhost:3000
```

---

## 팀 정보 수정 방법

**`data/team.json`** 하나만 편집하면 됩니다. TypeScript 몰라도 JSON만 수정하면 반영됩니다.

### 팀원 추가 / 수정

```json
"members": [
  { "name": "홍길동", "role": "팀장", "github": "hong", "blog": "https://blog.example.com" },
  { "name": "김철수", "role": "팀원", "github": "kim",  "blog": null }
]
```

### 프로젝트 추가

프로젝트별 `links`에 발표 자료·시연 영상 등을 추가할 수 있습니다.

```json
"projects": [
  {
    "name": "repo-name",
    "desc": "프로젝트 설명",
    "url": "https://github.com/org/repo",
    "tags": ["Next.js", "Python"],
    "links": [
      { "label": "발표 자료", "url": "https://slides.example.com" },
      { "label": "시연 영상", "url": "https://youtube.com/watch?v=..." }
    ]
  }
]
```

### 문서 추가

레포의 어느 경로에 있는 `.md` 파일이든 바로 연결할 수 있습니다.

```json
"docs": [
  {
    "slug": "meeting-log",
    "title": "회의록",
    "desc": "주간 회의 기록",
    "file": "Meeting_Log.md"
  }
]
```

> `slug`는 URL 경로, `file`은 레포 루트 기준 실제 파일 경로입니다.

---

## 개발 명령어

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # 린트 검사
```

## 기술 스택

- **Next.js 16** (App Router, TypeScript)
- **React 19** / **shadcn/ui v4** (Tailwind CSS v4)
- **Vercel** — 배포
