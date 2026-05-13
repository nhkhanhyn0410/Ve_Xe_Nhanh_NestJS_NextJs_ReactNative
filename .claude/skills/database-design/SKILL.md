---
name: database-design
description: Load when writing MongoDB migrations, designing document schemas or indexes, implementing SeatHold or booking consistency logic, handling idempotency records, designing the escrow ledger or commission model, working with file metadata and object storage references, or planning data retention policies and seed packages for the bus ticket marketplace.
---

# Database Design — Index

**Source of truth:** `doc/SDLC/04-database-design.md` (v1.4, Approved)

## When to read what

| Task | Đọc section này |
|------|----------------|
| Danh mục tất cả collections và owner module | §8 Danh mục collection / table logical |
| Field contract cho từng nhóm dữ liệu | §9 Field contract theo nhóm dữ liệu |
| Reference strategy, snapshot, lịch sử trạng thái | §10 Reference, snapshot và lịch sử trạng thái |
| Index, unique constraint và query pattern chính | §11 Index, unique constraint và query pattern |
| Transaction boundary, TTL, idempotency | §12 Transaction, lock, TTL và idempotency |
| SeatHold DB-authoritative — cách implement | §13 Thiết kế SeatHold và TripSeat |
| Booking / ticket / payment record design | §14 Thiết kế booking, ticket và payment |
| Escrow ledger, commission và payout | §15 Thiết kế escrow ledger, commission và payout |
| File metadata, attachment, object key | §16 File metadata, attachment và object storage |
| Job record, outbox, reconciliation | §17 Reporting, job, outbox và reconciliation |
| Retention, soft delete, backup priority | §18 Retention, archive, soft delete và backup priority |
| Migration, seed, schema versioning | §19 Migration, seed và schema versioning |

## Top-level catalog

**Nhóm collection chính:**

| Nhóm | Collections |
|------|-------------|
| IAM | `users`, `admin_accounts`, `operator_accounts`, `employee_accounts`, `sessions`, `otp_records` |
| Transport | `operators`, `vehicles`, `routes`, `stop_points`, `trips`, `trip_seats`, `fares` |
| Booking | `seat_holds`, `bookings`, `passenger_infos`, `tickets`, `ticket_qr_tokens` |
| Payment | `payments`, `idempotency_records`, `vnpay_callbacks` |
| Finance | `escrow_ledger_entries`, `commission_rules`, `payouts`, `reconciliation_records` |
| Support | `support_tickets`, `complaints`, `reviews`, `dispute_cases` |
| Platform | `catalog_entries`, `policies`, `promotions`, `notifications`, `audit_logs`, `jobs` |
| File | `file_metadata` |

**DB decisions đã chốt (DB-OP-01..05):**
| Decision | Nội dung |
|----------|---------|
| DB-OP-01 | Operational DB: MongoDB replica set; transaction, conditional update, unique/partial/TTL index |
| DB-OP-02 | Ledger là append-only typed entry; không double-entry accounting V1 |
| DB-OP-03 | Retention / file scan / signed URL / object lifecycle dùng baseline v1.4 |
| DB-OP-04 | Session TTL, idempotency retention, callback safe payload dùng baseline v1.4 |
| DB-OP-05 | Catalog seed V1 do Admin Ops cung cấp, có checksum/version/review metadata |

## Invariants (luôn áp dụng)

- Mọi entity owned by Operator phải có field `operatorId`. `DB §7, DOMAIN-MAP §7`
- SeatHold trạng thái `ACTIVE` là authoritative — DB quyết định ghế còn hold hay không. `DB §13, ADR-004`
- Idempotency record phải lưu digest của request body; conflict return HTTP 409 với response gốc. `DB §12, API §9.2`
- Audit log là append-only — không có update, không có delete. `DB §18, SRS BR-58..59`
- Booking phải lưu fare snapshot và refund policy snapshot tại thời điểm tạo. `DB §14, SRS BR-07, BR-40`
- File metadata lưu object key — không lưu URL trực tiếp; signed URL sinh on-demand. `DB §16, ADR-014`
- Migration phải kiểm replica set và index trước khi bật write path rủi ro cao. `DB-OP-01, Ops §12`

## Cross-references

- Skills liên quan: `low-level-design` (repository pattern), `api-contract` (DTO ↔ field contract), `security-auth` (session TTL, PII field, audit schema), `deploy-ops` (migration/seed runbook)
- `doc/SDLC/11-project-task-breakdown.md §8.1` — TASK-FND-003..009 cho foundation DB setup
- `doc/agent/02-backend-v1-artifact-index.md` — ART-005 (DB migration manifest), ART-006 (seed package)
