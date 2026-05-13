---
name: task-adr
description: Load when picking up a task from the Backend V1 backlog, checking milestone M0-M8 readiness and task dependencies, confirming which architecture decisions (ADR-001..ADR-016) apply to the current implementation, verifying Definition of Ready/Done for a task, or understanding which decisions are Accepted vs still Proposed before writing code.
---

# Task Breakdown & Architecture Decisions — Index

**Source of truth:**
- Tasks: `doc/SDLC/11-project-task-breakdown.md` (v1.0, Draft)
- Decisions: `doc/SDLC/10-architecture-decision-record.md` (v1.0, Draft)

## When to read what

| Task | Đọc file và section này |
|------|------------------------|
| Task cần làm trong milestone hiện tại | 11 §8 Task Backend V1 theo milestone |
| Dependency của task cụ thể | 11 §6 Dependency chain (Mermaid diagram) |
| Artifact task (OpenAPI, seed, mock, smoke) | 11 §7 Task handoff và artifact |
| Task test, security và operation | 11 §9 Task test, security và operation |
| Definition of Ready / Definition of Done | 11 §10 DoR/DoD |
| Release gate và điều kiện vào implementation | 11 §11 Release gate và handoff |
| ADR đầy đủ với trạng thái | 10 §5 Danh sách quyết định |
| Chi tiết từng ADR (bối cảnh, quyết định, hệ quả) | 10 §6 ADR chi tiết |
| Decision package cho Backend V1 implementation | 10 §7 Backend V1 implementation decision package |
| Open points còn chặn production | 10 §8 Open Points và rủi ro còn lại |

## Top-level catalog

**Milestone sequence:**
```
M0 Handoff → M1 Foundation → M2 IAM/Security → M3 Supply-side
→ M4 Inventory/Checkout → M5 Payment/Ticket → M6 Post-booking/Ops
→ M7 Finance/Admin/Trust/Report → M8 Hardening/Release
```

**Task groups:**
`TASK-HO-*` (handoff) · `TASK-FND-*` (foundation M1) · `TASK-IAM-*` (M2) · `TASK-SUP-*` (supply M3) · `TASK-INV-*` (inventory M4) · `TASK-PAY-*` (payment M5) · `TASK-OPS-*` (operations M6) · `TASK-ADM-*` (admin M7) · `TASK-QA-*` (test) · `TASK-SEC-*` (security)

**ADR status summary:**
| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Managed marketplace 3 lớp | Accepted |
| ADR-002 | Modular monolith V1, không microservices | Accepted |
| ADR-003 | MongoDB replica set | Accepted |
| ADR-004 | SeatHold DB-authoritative hybrid | Accepted |
| ADR-005 | Escrow trước payout Operator | Accepted |
| ADR-006 | Provider adapter boundary | Accepted |
| ADR-007 | Expo mobile single codebase (User + Employee) | Accepted |
| ADR-008 | Admin arbiter cuối cùng trong dispute | Accepted |
| ADR-010 | NestJS + TypeScript modular monolith | Accepted |
| ADR-011 | Redis-compatible + BullMQ-compatible adapter | Accepted |
| ADR-012 | WebSocket realtime + REST polling fallback | Accepted |
| ADR-013 | API Spec là source contract; OpenAPI là artifact | Accepted |
| ADR-014 | S3-compatible storage (AWS S3 prod / MinIO local) | Accepted |
| ADR-015 | Vendor-neutral observability baseline | Proposed |
| ADR-016 | Production deployment target containerized | Proposed |

**Open blockers (production — không chặn local/CI/staging):**
- ADR-OP-03: Production cloud/hosting, secret manager, monitoring stack, RPO/RTO
- ADR-OP-04: Node.js / npm / Docker image version chưa pin
- ADR-OP-05: Email provider production chưa chốt

## Invariants (luôn áp dụng)

- Task chỉ được chuyển `Ready` khi: source SDLC rõ, dependency xác định, acceptance/test tối thiểu biết, không có ADR `Proposed` ảnh hưởng trực tiếp còn open. `11 §5.3`
- KHÔNG dùng source code hiện tại làm source of truth — repo là legacy skeleton; rewrite theo tài liệu Approved. `11 §3.2, PROJECT-STATE §2`
- Artifact task (ART-001..010) phải có owner và location được confirm trước M1. `11 §7, agent/02-artifact-index`
- Mọi implementation decision phải trace về ADR hoặc tài liệu SDLC Approved. `10 §3`
- ADR-009 đã Superseded — không còn có giá trị; dùng ADR-010..016 thay thế. `10 §5`

## Cross-references

- Skills liên quan: mọi skill — mỗi task trong 11 có `Source` field trace về file SDLC cụ thể
- `doc/agent/02-backend-v1-artifact-index.md` — 10 artifacts với owner, milestone mapping, validate criteria
- `doc/context/PROJECT-STATE.md §4..§5` — open questions và blockers hiện tại
