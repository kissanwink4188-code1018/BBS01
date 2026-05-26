# AGENTS.md

## 프로젝트 목적

Supabase Auth, RLS, CRUD 학습을 위한 실습용 게시판입니다.

---

## 기준 문서

반드시 아래 문서를 먼저 읽습니다.

1. docs/prd.md
2. docs/test-plan.md
3. docs/rdb-design.md

---

## 작업 순서

1. Supabase MCP로 현재 상태 확인
2. docs/migration-plan.md 작성
3. 사용자 승인 요청
4. Migration 작성
5. Schema 생성
6. RLS 적용
7. CRUD 구현
8. 검증 수행

---

## 필수 테이블

- profiles
- posts

---

## RLS 원칙

### posts

- SELECT : 누구나
- INSERT : 로그인 사용자
- UPDATE : 작성자만
- DELETE : 작성자만

### profiles

- UPDATE : 본인만

---

## 보안 규칙

- service_role 사용 금지
- Secret Key 노출 금지
- 모든 public 테이블 RLS 활성화
- 프론트에서 RLS 우회 금지

---

## 검증 필수 항목

- 회원가입
- 로그인
- 로그아웃
- 게시글 작성
- 게시글 수정
- 게시글 삭제
- 남의 글 수정 실패
- 남의 글 삭제 실패

---

## Supabase Free Plan 기준

- Storage 사용 안 함
- Realtime 사용 안 함
- 테스트 데이터 최소화