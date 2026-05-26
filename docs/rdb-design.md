# rdb-design.md

## 1. 서비스 개요

| 항목 | 내용 |
|---|---|
| 서비스 | Mini Board |
| DB | PostgreSQL |
| 플랫폼 | Supabase |
| 플랜 | Free Plan |

---

## 2. 사용자 유형

| 유형 | 설명 |
|---|---|
| Anonymous | 비로그인 |
| Authenticated | 로그인 사용자 |

---

## 3. 업무 규칙

| Rule ID | 규칙 |
|---|---|
| BR-001 | 로그인 사용자만 글 작성 가능 |
| BR-002 | 작성자는 본인 글만 수정 가능 |
| BR-003 | 작성자는 본인 글만 삭제 가능 |
| BR-004 | 게시글은 누구나 조회 가능 |

---

## 4. 엔티티

| Entity | 설명 |
|---|---|
| profiles | 사용자 프로필 |
| posts | 게시글 |

---

## 5. 관계

| 관계 | 유형 |
|---|---|
| profiles → posts | 1:N |

---

## 6. 테이블 설계

### profiles

| 컬럼 | 타입 | 제약 |
|---|---|---|
| id | uuid | PK, auth.users(id) |
| nickname | text | NOT NULL |
| created_at | timestamptz | default now() |

### posts

| 컬럼 | 타입 | 제약 |
|---|---|---|
| id | bigint | PK |
| author_id | uuid | FK profiles(id) |
| title | text | NOT NULL |
| content | text | NOT NULL |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

---

## 7. 인덱스

| 테이블 | 컬럼 | 목적 |
|---|---|---|
| posts | author_id | 작성자 조회 |
| posts | created_at desc | 최신글 조회 |

---

## 8. Auth 연동

| 항목 | 내용 |
|---|---|
| Auth 테이블 | auth.users |
| 연결 | profiles.id = auth.users.id |

---

## 9. RLS 설계

### profiles

| 작업 | 정책 |
|---|---|
| SELECT | 로그인 사용자 |
| UPDATE | 본인만 |

### posts

| 작업 | 정책 |
|---|---|
| SELECT | 누구나 |
| INSERT | auth.uid() = author_id |
| UPDATE | auth.uid() = author_id |
| DELETE | auth.uid() = author_id |

---

## 10. 테스트 기준 반영

| 테스트 | 관련 설계 |
|---|---|
| POST-003 | UPDATE 정책 |
| POST-004 | DELETE 정책 |
| RLS-002 | UPDATE 차단 |
| RLS-003 | DELETE 차단 |

---

## 11. 실행 전 체크리스트

- Supabase MCP로 현재 상태 확인
- migration-plan.md 작성
- 사용자 승인 전 SQL 실행 금지
- service_role 사용 금지

---

## 12. 실행 후 체크리스트

- profiles 생성 확인
- posts 생성 확인
- RLS 활성화 확인
- CRUD 테스트 통과 확인