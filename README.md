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

```
data/team.json    ← 팀원, 프로젝트, 문서 목록
content/          ← 문서 본문 (마크다운)
├── ground-rules.md
└── related-works.md
```

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

1. `content/` 에 `.md` 파일 추가 (예: `content/meeting-log.md`)
2. `docs` 배열에 항목 추가

```json
"docs": [
  { "slug": "meeting-log", "title": "회의록", "desc": "주간 회의 기록" }
]
```

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
