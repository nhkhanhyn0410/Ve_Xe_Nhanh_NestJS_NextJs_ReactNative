# 11. Task Format Proposal — Đề xuất format machine-readable

Tài liệu này phân tích format hiện tại của `SDLC/11-project-task-breakdown.md` và đề xuất cải tiến để AI agent có thể đọc và xử lý task tốt hơn. Không sửa file 11 gốc.

---

## 1. Đánh giá format hiện tại

**Format hiện tại:** Markdown table với 8 cột:
`Task ID | Task | Output | Source | Dependency | Owner | Priority | Status`

**Kết luận: KHÔNG đủ machine-readable cho agent.**

| Tiêu chí | Trạng thái | Ghi chú |
|----------|-----------|---------|
| Task ID có prefix nhóm (`TASK-HO-*`) | Đạt | Dễ parse và group theo milestone |
| Dependency là danh sách Task ID | Đạt | Parseable nhưng cần resolver |
| Source trace về tài liệu SDLC | Đạt | Tốt, nhưng không chỉ rõ section |
| Status values có tập giá trị cố định | Đạt | `Draft`, `Ready`, `Blocked`, `In Progress`, `Done` |
| Milestone là section heading, không phải cột | Thiếu | Agent phải suy luận milestone từ context |
| Không có cột AC-ref | Thiếu | Agent không biết AC nào cần verify sau khi implement |
| Không có cột Skills | Thiếu | Agent không biết skill nào cần load khi nhận task |

---

## 2. Đề xuất format mới

Thêm 2 cột vào mỗi task row:

| Cột mới | Kiểu | Mô tả |
|---------|------|-------|
| `Milestone` | string | `M0`, `M1`, ..., `M8` — cho phép filter theo milestone mà không cần đọc heading |
| `AC-ref` | list string | AC-01..AC-35 liên quan; `—` nếu task là infrastructure/tooling |
| `Skills` | list string | Tên skill cần load từ `.claude/skills/`; `—` nếu là reviewer task |

**Ví dụ header cột đầy đủ:**
```
| Task ID | Milestone | Task | Output | Source | Dependency | Owner | Priority | Status | AC-ref | Skills |
```

---

## 3. Ví dụ minh họa — 3 task đầu tiên (TASK-HO-001..003)

Task gốc từ `SDLC/11-project-task-breakdown.md §7`:

| Task ID | Milestone | Task | Output | Source | Dependency | Owner | Priority | Status | AC-ref | Skills |
|---------|-----------|------|--------|--------|------------|-------|----------|--------|--------|--------|
| TASK-HO-001 | M0 | Reviewer xác nhận ADR-010 backend framework target hoặc mở lại lựa chọn | Decision record update / risk accept | ADR-OP-01 | None | Reviewer/Tech Lead | P0 | Done | — | `task-adr` |
| TASK-HO-002 | M0 | Reviewer xác nhận ADR-011 cache/queue target hoặc mở lại lựa chọn | Decision record update / risk accept | ADR-OP-02 | None | Reviewer/Tech Lead | P0 | Done | — | `task-adr` |
| TASK-HO-003 | M0 | Pin runtime/package manager/Docker image cho implementation environment | Runtime/version policy | ADR-OP-04, OPS-OP-05 | TASK-HO-001 | DevOps/BE | P1 | Draft | — | `task-adr`, `deploy-ops` |

Ghi chú:
- TASK-HO-001 và TASK-HO-002 ghi `Done` vì ADR-010 và ADR-011 đã được reviewer chấp nhận (13/05/2026).
- `AC-ref = —` vì đây là reviewer/handoff task, không có AC backend tương ứng.
- `Skills` cho TASK-HO-003 thêm `deploy-ops` vì output ảnh hưởng trực tiếp đến CI/environment setup.

---

## 4. Quy tắc áp dụng khi chuyển format

| Trường | Quy tắc |
|--------|---------|
| `Milestone` | Lấy từ heading section (`###8.1. M1 - Foundation` → `M1`); không inference từ dependency. |
| `AC-ref` | Chỉ điền khi task implement một flow có AC trong `08-test-plan §8`. Infrastructure task ghi `—`. |
| `Skills` | Lấy từ `Source` field: `LLD §6` → `low-level-design`; `Security §8` → `security-auth`; v.v. Reviewer task ghi `task-adr`. |
| `Status` | Giữ nguyên tập giá trị: `Draft`, `Ready`, `Blocked`, `In Progress`, `Done`. |

---

## 5. Lưu ý

- Đây là đề xuất, chưa phải quyết định. Cần reviewer approve trước khi reformatting file 11.
- Không nên reformatting toàn bộ file 11 trong một lần — làm từng milestone một, bắt đầu từ M0.
- Nếu issue tracker (GitHub Issues, Linear) được chọn, `Task ID` có thể map sang issue number.
