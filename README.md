# BBS01 — Mini Board

Supabase Free Plan 실습용 로그인 게시판 (Next.js + Auth + RLS).

## 환경 변수

로컬: `.env.local` (`.env.example` 참고)

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (권장) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy anon key (대안) |

**Vercel:** Project → Settings → Environment Variables에 위 두 변수(또는 URL + publishable)를 **Production / Preview**에 동일하게 등록하세요. `service_role`·Secret key는 넣지 마세요.

## 실행

```bash
npm install
npm run dev
```

## 테스트

```bash
npm test
```

자세한 시나리오는 [docs/test-plan.md](docs/test-plan.md)를 참고하세요.
