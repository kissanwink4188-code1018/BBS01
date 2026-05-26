# test-plan.md

## 테스트 범위

| Area | 포함 |
|---|---|
| Auth | O |
| Posts CRUD | O |
| RLS | O |
| Storage | X |
| Realtime | X |

---

## 성공해야 하는 테스트

| Test ID | Area | Scenario | User State | Expected Result | Method | Priority |
|---|---|---|---|---|---|---|
| AUTH-001 | Auth | 회원가입 | Anonymous | Success | Test UI | High |
| AUTH-002 | Auth | 로그인 | Anonymous | Success | Test UI | High |
| AUTH-003 | Auth | 로그아웃 | Authenticated | Success | Test UI | High |
| POST-001 | Posts | 게시글 목록 조회 | Anonymous | Success | Test UI | High |
| POST-002 | Posts | 게시글 작성 | Authenticated | Success | Test UI | High |
| POST-003 | Posts | 본인 글 수정 | Author | Success | Test UI | High |
| POST-004 | Posts | 본인 글 삭제 | Author | Success | Test UI | High |

---

## 실패해야 정상인 테스트

| Test ID | Area | Scenario | User State | Expected Result | Method | Priority |
|---|---|---|---|---|---|---|
| RLS-001 | Posts | 비회원 글 작성 | Anonymous | Fail | Test UI | High |
| RLS-002 | Posts | 남의 글 수정 | User B | Fail | Test UI | High |
| RLS-003 | Posts | 남의 글 삭제 | User B | Fail | Test UI | High |

---

## 데이터 무결성

| Test ID | Scenario | Expected Result |
|---|---|---|
| DATA-001 | 제목 없이 저장 | Fail |
| DATA-002 | 내용 없이 저장 | Fail |

---

## 테스트 계정

| 계정 | 목적 |
|---|---|
| userA@test.com | 게시글 작성 |
| userB@test.com | RLS 검증 |