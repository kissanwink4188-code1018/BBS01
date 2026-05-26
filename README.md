# BBS01 — Mini Board

Supabase Free Plan 실습용 로그인 게시판 (Next.js + Auth + RLS).

## 환경 변수

로컬: `.env.local` (`.env.example` 참고)

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (권장) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy anon key (대안) |

**Vercel:** Project → Settings → Environment Variables

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yhyblckdxnioozzwtcln.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Dashboard → API → Publishable key |

- **Production**과 **Preview** 모두에 추가
- 변수 추가·수정 후 **Redeploy** 필수
- `service_role`·Secret key는 넣지 마세요

`MIDDLEWARE_INVOCATION_FAILED`(500)는 보통 위 환경 변수가 Vercel에 없을 때 발생합니다.

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
