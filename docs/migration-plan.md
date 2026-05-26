# migration-plan.md

> **상태:** ✅ Migration 적용 완료 (`initial_schema`, version `20260526122637`)  
> **프로젝트:** `yhyblckdxnioozzwtcln` · `https://yhyblckdxnioozzwtcln.supabase.co`  
> **조사 일시:** 2026-05-26 (Supabase MCP `project-0-BBS01-supabase`)

---

## 문서 요약 (기준 문서 반영)

### Product goal

- **Mini Board**: Supabase Free Plan 기반 **로그인 게시판** 실습
- **핵심 목표:** Auth, CRUD, RLS 학습 후 **Vercel 배포**
- **대상 사용자:** 초보 개발자 (Anonymous / Authenticated)

### MVP scope

| 포함 | 제외 |
|------|------|
| 이메일 회원가입·로그인·로그아웃 | 댓글, 좋아요, 북마크, 신고 |
| 게시글 목록·작성·수정·삭제 | 관리자, 이미지(Storage) |
| 본인 글만 수정/삭제 (RLS) | Realtime, Playwright MCP |

### Required tables

| 테이블 | 용도 |
|--------|------|
| `profiles` | `auth.users`와 1:1 프로필 (`id`, `nickname`, `created_at`) |
| `posts` | 게시글 (`id`, `author_id` → `profiles`, `title`, `content`, `created_at`, `updated_at`) |

### Required RLS policies

#### `posts`

| 작업 | 대상 | 조건 |
|------|------|------|
| SELECT | `anon`, `authenticated` | 누구나 (`USING (true)`) |
| INSERT | `authenticated` | `auth.uid() = author_id` |
| UPDATE | `authenticated` | `auth.uid() = author_id` (USING + WITH CHECK) |
| DELETE | `authenticated` | `auth.uid() = author_id` |

#### `profiles` (rdb-design.md / AGENTS.md)

| 작업 | 대상 | 조건 |
|------|------|------|
| SELECT | `authenticated` | 로그인 사용자 (`USING (true)`) |
| INSERT | `authenticated` | `auth.uid() = id` (트리거 실패 시 대비) |
| UPDATE | `authenticated` | `auth.uid() = id` (USING + WITH CHECK) |

> 비로그인 사용자는 `profiles` 조회 불가. 게시글 목록은 `posts`만 공개 조회.

### Required test cases (`docs/test-plan.md`)

**성공해야 함**

| Test ID | 시나리오 |
|---------|----------|
| AUTH-001 | 회원가입 |
| AUTH-002 | 로그인 |
| AUTH-003 | 로그아웃 |
| POST-001 | 게시글 목록 (비로그인 포함) |
| POST-002 | 게시글 작성 (로그인) |
| POST-003 | 본인 글 수정 |
| POST-004 | 본인 글 삭제 |

**실패해야 정상 (RLS)**

| Test ID | 시나리오 |
|---------|----------|
| RLS-001 | 비회원 글 작성 |
| RLS-002 | 남의 글 수정 (userB) |
| RLS-003 | 남의 글 삭제 (userB) |

**데이터 무결성**

| Test ID | 시나리오 |
|---------|----------|
| DATA-001 | 제목 없이 저장 → 실패 |
| DATA-002 | 내용 없이 저장 → 실패 |

**테스트 계정:** `userA@test.com` (작성), `userB@test.com` (RLS)

---

## 1. Current DB state (MCP inspection)

### 1.1 Connection

| 항목 | 결과 |
|------|------|
| MCP 서버 | `project-0-BBS01-supabase` ✅ 연결됨 |
| Project URL | `https://yhyblckdxnioozzwtcln.supabase.co` |
| 로컬 `.env.local` | `NEXT_PUBLIC_SUPABASE_URL` 설정됨 (publishable key만, **service_role/Secret 미사용**) |

### 1.2 Tables (`public` schema)

| 테이블 | 존재 | RLS enabled |
|--------|------|-------------|
| `profiles` | ❌ 없음 | — |
| `posts` | ❌ 없음 | — |

`list_tables` (verbose): **빈 스키마** (`tables: []`)

### 1.3 Columns / constraints / indexes

| 대상 | 상태 |
|------|------|
| `profiles` 컬럼 | 없음 |
| `posts` 컬럼 | 없음 |
| PK / FK / CHECK | 없음 |
| 인덱스 (`posts_author_id_idx`, `posts_created_at_desc_idx`) | 없음 |

### 1.4 RLS status

```sql
-- pg_class (public, relkind = 'r')
-- 결과: []
```

| 테이블 | `relrowsecurity` | 정책 수 |
|--------|------------------|---------|
| `profiles` | — | 0 |
| `posts` | — | 0 |

`pg_policies` (schema = `public`): **정책 없음** (`[]`)

### 1.5 Migrations (remote)

`list_migrations`: **적용된 migration 없음** (`[]`)

### 1.6 Local migration file (미적용)

| 파일 | 상태 |
|------|------|
| `supabase/migrations/20260526120000_initial_schema.sql` | 로컬에만 존재, **원격 DB 미반영** |

---

## 2. Gap analysis

| 영역 | 목표 (문서) | 현재 | Gap |
|------|-------------|------|-----|
| `profiles` 테이블 | 존재 | 없음 | **CREATE 필요** |
| `posts` 테이블 | 존재 | 없음 | **CREATE 필요** |
| FK `posts.author_id` → `profiles.id` | 필요 | 없음 | **CREATE 필요** |
| FK `profiles.id` → `auth.users` | 필요 | 없음 | **CREATE 필요** |
| NOT NULL / trim CHECK | DATA-001/002 | 없음 | **CHECK 제약 필요** |
| 인덱스 | `author_id`, `created_at DESC` | 없음 | **CREATE INDEX 필요** |
| `posts` RLS (4 policies) | 필요 | 없음 | **정책 4개 필요** |
| `profiles` RLS (3 policies) | 필요 | 없음 | **정책 3개 필요** |
| 회원가입 → profile | Auth 연동 | 없음 | **트리거 `handle_new_user` 필요** |
| `posts.updated_at` | 자동 갱신 | 없음 | **BEFORE UPDATE 트리거 필요** |
| Data API GRANT | REST 접근 | 미확인 | **GRANT 추가 권장** |
| Auth UI / CRUD UI | MVP | 미구현 | 코드 단계 (본 문서 범위 외) |

**결론:** 원격 DB는 **Greenfield**. 초기 migration 1회로 전체 스키마·RLS·트리거를 적용하면 됨. 기존 테이블 충돌 위험 없음.

---

## 3. Tables to create

### 3.1 `public.profiles`

| 컬럼 | 타입 | 제약 |
|------|------|------|
| `id` | `uuid` | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| `nickname` | `text` | NOT NULL |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` |

### 3.2 `public.posts`

| 컬럼 | 타입 | 제약 |
|------|------|------|
| `id` | `bigint` | PK, `GENERATED ALWAYS AS IDENTITY` |
| `author_id` | `uuid` | NOT NULL, FK → `profiles(id)` ON DELETE CASCADE |
| `title` | `text` | NOT NULL |
| `content` | `text` | NOT NULL |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` |

---

## 4. Constraints to create

| 이름 | 테이블 | 유형 | 정의 |
|------|--------|------|------|
| `profiles_pkey` | `profiles` | PRIMARY KEY | `(id)` |
| `profiles_id_fkey` | `profiles` | FOREIGN KEY | `id` → `auth.users(id)` |
| `profiles_nickname_not_empty` | `profiles` | CHECK | `trim(nickname) <> ''` |
| `posts_pkey` | `posts` | PRIMARY KEY | `(id)` |
| `posts_author_id_fkey` | `posts` | FOREIGN KEY | `author_id` → `profiles(id)` |
| `posts_title_not_empty` | `posts` | CHECK | `trim(title) <> ''` |
| `posts_content_not_empty` | `posts` | CHECK | `trim(content) <> ''` |

### Indexes

| 이름 | 테이블 | 정의 | 목적 |
|------|--------|------|------|
| `posts_author_id_idx` | `posts` | `(author_id)` | 작성자별 조회 |
| `posts_created_at_desc_idx` | `posts` | `(created_at DESC)` | 최신글 목록 |

### Functions / triggers (non-RLS)

| 객체 | 목적 |
|------|------|
| `set_posts_updated_at()` + `posts_set_updated_at` | UPDATE 시 `updated_at` 갱신 |
| `handle_new_user()` + `on_auth_user_created` | `auth.users` INSERT 시 `profiles` 자동 생성 |

---

## 5. RLS policies to create

적용 순서: 테이블 생성 → `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` → 정책 생성

### 5.1 `profiles`

| Policy name | CMD | Roles | USING | WITH CHECK |
|-------------|-----|-------|-------|------------|
| `profiles_select_authenticated` | SELECT | `authenticated` | `true` | — |
| `profiles_insert_own` | INSERT | `authenticated` | — | `auth.uid() = id` |
| `profiles_update_own` | UPDATE | `authenticated` | `auth.uid() = id` | `auth.uid() = id` |

### 5.2 `posts`

| Policy name | CMD | Roles | USING | WITH CHECK |
|-------------|-----|-------|-------|------------|
| `posts_select_all` | SELECT | `anon`, `authenticated` | `true` | — |
| `posts_insert_own` | INSERT | `authenticated` | — | `auth.uid() = author_id` |
| `posts_update_own` | UPDATE | `authenticated` | `auth.uid() = author_id` | `auth.uid() = author_id` |
| `posts_delete_own` | DELETE | `authenticated` | `auth.uid() = author_id` | — |

### 5.3 Grants (Data API, RLS와 별개)

| Grant | 역할 |
|-------|------|
| `USAGE` on `public` | `anon`, `authenticated` |
| `profiles`: SELECT, INSERT, UPDATE | `authenticated` |
| `posts`: SELECT | `anon`, `authenticated` |
| `posts`: INSERT, UPDATE, DELETE | `authenticated` |
| Sequences `USAGE, SELECT` | `authenticated` |

---

## 6. Migration order

승인 후 **단일 migration** 권장: `supabase/migrations/20260526120000_initial_schema.sql`

| Step | 작업 | 비고 |
|------|------|------|
| 1 | `CREATE TABLE profiles` | `auth.users` FK |
| 2 | `CREATE TABLE posts` | `profiles` FK, identity PK |
| 3 | `CREATE INDEX` (2개) | `author_id`, `created_at DESC` |
| 4 | `CREATE FUNCTION set_posts_updated_at` + trigger | `SECURITY INVOKER` |
| 5 | `CREATE FUNCTION handle_new_user` + trigger on `auth.users` | `SECURITY DEFINER`, `search_path = ''` |
| 6 | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` | both tables |
| 7 | `CREATE POLICY` × 7 | profiles 3 + posts 4 |
| 8 | `GRANT` | anon / authenticated |

**적용 방법 (승인 후 택 1):**

- A) Supabase Dashboard → SQL Editor
- B) MCP `apply_migration` (DDL 권장)
- C) Supabase CLI `db push` (CLI 설치·link 후)

**실행 금지 (승인 전):** `DROP`, `DELETE`, `TRUNCATE`, `service_role` 키 사용

---

## 7. Validation checklist

### 7.1 Post-migration (DB)

- [ ] `list_tables`: `profiles`, `posts` 존재
- [ ] `pg_class`: 두 테이블 `relrowsecurity = true`
- [ ] `pg_policies`: 정책 7개 존재
- [ ] 인덱스 2개 존재
- [ ] 회원가입 시 `profiles` 행 자동 생성
- [ ] `list_migrations`에 migration 기록 (MCP/CLI 적용 시)

### 7.2 Auth (`test-plan`)

- [ ] AUTH-001 회원가입
- [ ] AUTH-002 로그인
- [ ] AUTH-003 로그아웃

### 7.3 Posts CRUD

- [ ] POST-001 비로그인 목록 조회
- [ ] POST-002 로그인 후 작성
- [ ] POST-003 본인 글 수정
- [ ] POST-004 본인 글 삭제

### 7.4 RLS (실패 = 정상)

- [ ] RLS-001 비회원 INSERT 거부
- [ ] RLS-002 userB → userA 글 UPDATE 거부
- [ ] RLS-003 userB → userA 글 DELETE 거부

### 7.5 Data integrity

- [ ] DATA-001 빈 제목 저장 실패
- [ ] DATA-002 빈 내용 저장 실패

---

## 적용 기록

| 항목 | 값 |
|------|-----|
| 적용 일시 | 2026-05-26 |
| 방법 | MCP `apply_migration` |
| Migration name | `initial_schema` |
| Remote version | `20260526122637` |
| 로컬 파일 | `supabase/migrations/20260526120000_initial_schema.sql` |

**다음 단계:** Next.js 최소 UI → `test-plan.md` 수동 검증 → Vercel 배포 준비
