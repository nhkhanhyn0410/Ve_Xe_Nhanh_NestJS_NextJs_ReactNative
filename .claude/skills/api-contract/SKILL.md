---
name: api-contract
description: Load when implementing REST API endpoints, defining request/response DTOs, handling error codes and envelopes, adding idempotency headers, implementing VNPay webhook callbacks, designing realtime WebSocket event contracts, or when you need to check which endpoint exists for a specific actor and use case in the bus ticket booking system.
---

# API Specification — Index

**Source of truth:** `doc/SDLC/05-api-specification.md` (v1.1, Approved)

## When to read what

| Task | Đọc section này |
|------|----------------|
| Auth token, scope, actor-specific header | §7 Actor, auth và scope |
| Response envelope, pagination, error format | §8 Response, pagination và error format |
| Idempotency-Key header và concurrency behavior | §9 Header, idempotency và concurrency |
| DTO field contract (request / response shape) | §10 DTO summary và field contract |
| IAM endpoints (login / logout / refresh / OTP / MFA) | §11 Endpoint catalog - IAM, session và verification |
| Marketplace endpoints (search / hold / book / pay / ticket) | §12 Endpoint catalog - Marketplace checkout |
| User account, ticket, notification | §13 Endpoint catalog - User account, ticket và notification |
| Operator onboarding, KYC, vehicle, route, stop-point | §14 Endpoint catalog - Operator onboarding và resource |
| Trip / booking / finance endpoint cho Operator | §15 Endpoint catalog - Operator trip, booking và finance |
| Employee operation endpoints | §16 Endpoint catalog - Employee operations |
| Admin governance endpoints | §18 Endpoint catalog - Admin governance |
| VNPay webhook, callback, external adapter | §20 Webhook, callback và external adapter API |
| Realtime WebSocket events (seat update, booking, job) | §21 Realtime event contract |
| Background job và audit API | §22 Background job, reconciliation và audit API |

## Top-level catalog

**Auth model:**
| Actor | Access token | Refresh token |
|-------|-------------|--------------|
| User / Operator / Employee (Web) | Bearer header | HttpOnly Secure SameSite=Lax cookie + CSRF |
| User / Employee (Mobile) | Bearer header | Secure storage |
| Admin | Bearer header + MFA | HttpOnly cookie |
| Guest | Guest session token (short TTL) | Không có refresh |

**Response envelope:**
```json
{ "success": true, "data": { ... }, "requestId": "<uuid>" }
{ "success": false, "error": { "code": "ERR_xxx", "message": "safe message" }, "requestId": "<uuid>" }
```

**Idempotency:** Header `Idempotency-Key: <uuid>`. Conflict → HTTP 409 + original response body.

**Realtime:** WebSocket `/realtime`, auth bằng Bearer hoặc guest realtime token. REST là source of truth. Fallback: REST polling.

**VNPay Sandbox mapping:** `vnp_TxnRef = paymentCode`, `vnp_Amount = amountVnd * 100`, HMAC-SHA512, success code `00`. Nguồn: `API-OP-03`.

## Invariants (luôn áp dụng)

- Backend luôn re-validate quyền, trạng thái ghế, booking, tiền server-side — client chỉ hiển thị. `API §3.2`
- Mọi write-path endpoint có rủi ro tiền/ghế/vé PHẢI chấp nhận `Idempotency-Key`. `API §9, DB §12`
- Error code phải stable cho P0 flows — không thay đổi sau khi FE/Mobile integrate. `ART-003`
- Notification V1: email + in-app bật; SMS/push adapter giữ nhưng không bật transactional. `API-OP-04`
- OpenAPI 3.1 là artifact derived — không là source contract. `ADR-013, API-OP-05`
- Support / complaint / dispute endpoint: §17 — không skip dù Admin hay Operator.

## Cross-references

- Skills liên quan: `security-auth` (auth header detail, RBAC enforcement), `database-design` (DTO ↔ DB field contract), `test-plan` (AC traceability per endpoint), `deploy-ops` (provider sandbox/mock)
- `doc/agent/02-backend-v1-artifact-index.md` — ART-001 (OpenAPI artifact), ART-003 (error catalog), ART-007 (provider mock contract)
