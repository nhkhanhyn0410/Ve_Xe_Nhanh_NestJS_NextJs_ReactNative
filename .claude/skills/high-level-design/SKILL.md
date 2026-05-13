---
name: high-level-design
description: Load when you need to understand module boundaries, plan cross-module integration, check data ownership rules, design adapter interfaces, understand realtime/queue/job architecture, or verify a design decision against HLD v1.13. Also load when deciding which service layer (Marketplace, Operator OS, or Platform admin) a capability belongs to.
---

# High Level Design — Index

**Source of truth:** `doc/SDLC/02-hld-he-thong-dat-ve-xe-khach.md` (v1.13, Approved)

## When to read what

| Task | Đọc section này |
|------|----------------|
| Xác định module nào chịu trách nhiệm capability nào | §8 Boundary capability / module |
| Data ownership và tenant boundary mức kiến trúc | §9 Data ownership mức cao |
| Thiết kế luồng tích hợp giữa modules | §10 Luồng tích hợp chính |
| Security tầng kiến trúc (không chi tiết) | §11 Bảo mật và phân quyền mức cao |
| Realtime WebSocket, queue, background job | §12 Realtime, queue và background job |
| External adapter (VNPay, email, SMS, storage, OSRM) | §13 Tích hợp ngoài |
| Deployment và infrastructure overview | §14 Tổng quan triển khai |
| Non-functional requirement → architectural constraint | §15 Mapping yêu cầu phi chức năng |
| Quyết định kiến trúc tầng HLD | §16 Quyết định thiết kế + §18 HLD handoff downstream |
| Architecture overview tổng thể | §5 Kiến trúc tổng quan + §6 Client + §7 Backend |

## Top-level catalog

**3 service layers:**

| Layer | Module groups (target) |
|-------|------------------------|
| Marketplace layer | `iam/`, `marketplace/`, `booking/`, `payment/`, `ticket/`, `notification/`, `support/`, `review/`, `dispute/` |
| Operator OS layer | `operator/`, `vehicle/`, `route/`, `stop-point/`, `trip/`, `fare/`, `promotion/`, `employee/`, `manifest/`, `finance/` |
| Platform admin layer | `admin/`, `catalog/`, `policy/`, `commission/`, `payout/`, `audit/`, `reporting/`, `search/` |
| Cross-cutting | `common/` (guards, interceptors, pipes), `database/`, `redis/`, `osrm/`, `external/` |

**Client apps:**
- Web public → User + Guest
- Web operator portal → Operator
- Web admin portal → Admin
- Mobile → User (passenger mode) + Employee (employee mode)

**Key architectural decisions:**
| ADR | Decision | Status |
|-----|----------|--------|
| ADR-002 | Modular monolith V1, không microservices | Accepted |
| ADR-004 | SeatHold DB-authoritative hybrid | Accepted |
| ADR-006 | External provider qua adapter boundary | Accepted |
| ADR-012 | Realtime WebSocket + REST polling fallback | Accepted |
| ADR-014 | Object storage S3-compatible | Accepted |

## Invariants (luôn áp dụng)

- Mỗi entity do Operator sở hữu phải có `operatorId` và tenant filter trong mọi query/mutation. `HLD §9, DOMAIN-MAP §7`
- External provider không được gọi trực tiếp từ domain service — phải qua adapter port. `HLD §13, ADR-006`
- Backend là điểm quyết định cuối cùng cho state, tiền, ghế, vé, quyền, PII. `HLD §11`
- Queue/job là phụ trợ; DB là single source of truth cho invariants cuối cùng. `HLD §12, ADR-004`
- Không scale thành microservice trong V1 — ưu tiên consistency và testability trước. `ADR-002`

## Cross-references

- Skills liên quan: `low-level-design` (module implementation detail), `security-auth` (auth boundary chi tiết), `database-design` (data ownership → schema), `api-contract` (integration contract)
- `doc/context/DOMAIN-MAP.md §1..§5` — mapping chi tiết module ↔ entity ↔ actor ↔ target folder
- `doc/SDLC/10-architecture-decision-record.md §5..§6` — ADR list đầy đủ và chi tiết từng ADR
