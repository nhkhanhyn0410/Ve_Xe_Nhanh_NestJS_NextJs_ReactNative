---
name: low-level-design
description: Load when coding a specific backend module or service, implementing application service or repository pattern, handling state transitions and consistency rules, setting up adapter contracts, defining idempotency behavior, or following the Backend V1 implementation order (M1 Foundation first, then M2 IAM, M3 Supply-side, etc.).
---

# Low Level Design — Index

**Source of truth:** `doc/SDLC/03-lld-he-thong-dat-ve-xe-khach.md` (v1.2, Approved)

## When to read what

| Task | Đọc section này |
|------|----------------|
| Cấu trúc module — file/class pattern cho mỗi capability | §6 Cấu trúc logical module |
| Guard, interceptor, pipe, error handler cross-cutting | §7 Cross-cutting design |
| Thiết kế chi tiết từng module (service, repo, policy) | §8 Thiết kế module chi tiết |
| Luồng SeatHold, booking, payment, ticket trọng yếu | §9 Thiết kế use case trọng yếu |
| State machine và consistency rule cho từng entity | §10 State transition và consistency rule |
| Adapter contract (payment, storage, email, routing) | §11 Adapter contract |
| Error response và behavior chuẩn | §12 Error handling và response behavior |
| Audit hook và logging pattern | §13 Audit, logging và observability hook |
| Thứ tự implement Backend V1 (M1 → M8) | §15 Thứ tự triển khai Backend V1 |
| Quyết định LLD đã chốt (LLD-OP-01..06) | §17 Quyết định đã chốt và handoff downstream |

## Top-level catalog

**Module pattern (mỗi capability):**
```
<module>/
  <module>.module.ts
  <module>.controller.ts      — delivery handler (HTTP / WS / job)
  <module>.service.ts         — application service
  <module>.policy.ts          — domain policy (business invariants)
  <module>.repository.ts      — repository port
  <module>.schema.ts          — schema / model
  dto/                        — request / response DTO
```

**Implementation order:**
```
M1 Foundation → M2 IAM/Security → M3 Supply-side → M4 Inventory/Checkout
→ M5 Payment/Ticket → M6 Post-booking/Ops → M7 Finance/Admin/Trust → M8 Hardening
```

**LLD decisions đã chốt:**

| Decision | Nội dung |
|----------|---------|
| LLD-OP-02 | SeatHold: DB giữ invariant cuối cùng; lock service chỉ giảm contention |
| LLD-OP-03 | Employee offline: read cache manifest + queued actions giới hạn (check-in / no-show / journey log / incident) |
| LLD-OP-04 | Object storage: S3-compatible; production AWS S3; local/dev MinIO |
| LLD-OP-05 | Session/token/re-auth/rate limit chi tiết → Security Design |

## Invariants (luôn áp dụng)

- Idempotency key BẮT BUỘC ở mọi write path có rủi ro tiền/ghế/vé. `LLD §10, API §9`
- Application service không gọi thẳng external provider — phải qua adapter port. `LLD §11, ADR-006`
- Domain policy (invariant nghiệp vụ) không được phụ thuộc vào framework cụ thể. `LLD §6`
- Audit hook phải gắn tại application service layer cho mọi thao tác nhạy cảm. `LLD §13`
- State transition chỉ được thực hiện qua policy method — không bypass qua direct repo update. `LLD §10`
- Framework NestJS + TypeScript đã được chốt (ADR-010 Accepted). `ADR-010`

## Cross-references

- Skills liên quan: `system-requirements` (UC/BR nguồn cho mỗi module), `database-design` (schema cho mỗi module), `api-contract` (DTO shape), `security-auth` (guard pattern), `task-adr` (milestone order)
- `doc/context/DOMAIN-MAP.md §1..§2` — logical module → target folder mapping
- `doc/SDLC/11-project-task-breakdown.md §8.1` — TASK-FND-001..010 cho foundation setup
