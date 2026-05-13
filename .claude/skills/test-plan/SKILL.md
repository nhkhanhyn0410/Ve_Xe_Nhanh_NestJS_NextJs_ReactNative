---
name: test-plan
description: Load when writing tests for any Backend V1 feature, verifying that an implementation satisfies one of the 35 Acceptance Criteria (AC-01..AC-35), planning test coverage for security or concurrency scenarios, determining what seed data is required, or confirming release gate requirements before promoting to staging or production.
---

# Test Plan & Acceptance Criteria — Index

**Source of truth:** `doc/SDLC/08-test-plan-acceptance-criteria.md` (v1.0, Approved)

## When to read what

| Task | Đọc section này |
|------|----------------|
| Test strategy và test types cho Backend V1 | §5 Test strategy Backend V1 |
| Cấu hình environment, seed data yêu cầu, evidence | §6 Test environment, seed data và test evidence |
| Traceability FR → AC → test suite | §7 Traceability matrix |
| Acceptance Criteria cụ thể (AC-01..AC-35) | §8 Acceptance Criteria V1 theo SRS AC-01..AC-35 |
| Test suite chi tiết (foundation, IAM, SeatHold, payment, ...) | §9 Test suite chi tiết Backend V1 |
| Security, RBAC, IDOR, rate limit, PII test | §10 Security, privacy và abuse test |
| Concurrency (SeatHold race), reliability (retry, failover) | §11 Performance, concurrency và reliability test |
| Release gate và defect policy | §12 Regression, release gate và defect policy |
| Entry / exit criteria cho từng milestone | §13 Entry / Exit criteria |

## Top-level catalog

**AC groups (35 criteria):**
| Range | Scope |
|-------|-------|
| AC-01..05 | Foundation (health, config, DB, error pipeline, structured logging) |
| AC-06..10 | IAM / Security (login, RBAC negative, tenant isolation, Guest verification, Admin MFA) |
| AC-11..15 | Supply-side (operator onboarding, KYC, vehicle, route, trip / fare) |
| AC-16..20 | Checkout (search, SeatHold TTL, booking snapshot, concurrency) |
| AC-21..25 | Payment / Ticket (VNPay callback, idempotency, ticket issuance, QR validation) |
| AC-26..30 | Post-booking / Ops (cancel / refund, check-in, manifest, Employee offline) |
| AC-31..35 | Admin / Finance / Trust (payout, dispute resolution, report export, audit trail) |

**P0 gates — release bị chặn nếu fail:**
- Không bán trùng ghế (SeatHold concurrency race)
- Không phát hành ticket sai sau payment failure hoặc callback duplicate
- Không ghi trùng payment / refund / payout
- RBAC + tenant boundary 100% negative test pass
- VNPay callback idempotent + HMAC-SHA512 verify

**Seed data yêu cầu tối thiểu:**
- Catalog seed: Admin Ops package (ART-006, có checksum/version)
- Test Operator + vehicle + route + trip + fare
- Test User + Guest session
- Provider sandbox config (VNPay Sandbox, email mock, storage mock)

## Invariants (luôn áp dụng)

- Mỗi AC phải có: test result, log/evidence, trace về FR/UC/BR. `Test §7`
- P0 test case phải pass 100% trước staging promotion. `Test §12`
- Test KHÔNG được dùng tiền thật hoặc dữ liệu production. `Test §3.3`
- SeatHold concurrency test phải chạy ít nhất 10 concurrent requests cùng ghế. `Test §11`
- Provider mock phải cover: success, fail, duplicate, wrong signature, amount mismatch. `ART-007, Test §9`
- Evidence (log, test result) phải được lưu lại — không chỉ pass locally. `Test §6`

## Cross-references

- Skills liên quan: `system-requirements` (AC trace về SRS), `security-auth` (security test baseline §16), `deploy-ops` (environment/seed setup), `task-adr` (milestone exit criteria)
- `doc/agent/02-backend-v1-artifact-index.md` — ART-006 (seed package), ART-009 (smoke checklist), ART-010 (critical evidence checklist)
