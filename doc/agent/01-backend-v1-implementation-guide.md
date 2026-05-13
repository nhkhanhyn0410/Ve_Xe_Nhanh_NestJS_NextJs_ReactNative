# Backend V1 Implementation Guide

Tài liệu rút gọn cho coding agent/dev khi bắt đầu Backend V1. Nguồn đầy đủ vẫn là `@SDLC/01..11`; file này chỉ là handoff ngắn để tránh đọc thiếu các invariant quan trọng.

## 1. Nguồn phải đọc theo thứ tự

1. `@doc/AGENT`
2. `@context/PROJECT-STATE`
3. `@context/DOMAIN-MAP`
4. `@SDLC/10-architecture-decision-record`
5. `@SDLC/11-project-task-breakdown`
6. Tài liệu nguồn theo task: `01` SRS, `03` LLD, `04` DB, `05` API, `07` Security, `08` Test, `09` Operation.

Không dùng source code legacy làm source of truth khi mâu thuẫn tài liệu Approved.

## 2. Gate trước khi code

| Gate     | Cần đạt                                                                                       | Trạng thái  |
| -------- | --------------------------------------------------------------------------------------------- | ----------- |
| START-G1 | `PROJECT-STATE` xác nhận 01..05, 07, 08 đủ baseline.                                          | ĐÃ XÁC NHẬN |
| START-G2 | Reviewer xác nhận hoặc risk-accept ADR-010/011 nếu dùng NestJS + Redis/Bull-compatible queue. | ĐÃ XÁC NHẬN |
| START-G3 | Runtime/package manager/Docker image được pin cho CI.                                         | ĐÃ XÁC NHẬN |
| START-G4 | Có plan/owner cho OpenAPI, DB index manifest, seed, provider mock.                            | ĐÃ XÁC NHẬN |
| START-G5 | Local/CI DB hỗ trợ MongoDB transaction.                                                       | ĐÃ XÁC NHẬN |

## 3. Quyết định đã chốt để code nghiệp vụ

| Chủ đề        | Baseline                                                                         |
| ------------- | -------------------------------------------------------------------------------- |
| Product       | Managed marketplace: Marketplace, Operator OS, Platform Admin.                   |
| Backend shape | Modular application core, không microservice V1.                                 |
| Database      | MongoDB replica set, transaction/index/TTL.                                      |
| SeatHold      | DB-authoritative hybrid, TTL 10 phút, all-or-nothing.                            |
| Payment       | VNPay Sandbox qua adapter; callback verify/idempotent.                           |
| Ticket        | Chỉ phát hành sau payment success/confirmation hợp lệ.                           |
| Escrow/payout | Ledger append-only; payout T+3, no minimum, bank transfer, Admin manual confirm. |
| Auth          | Bearer access token; refresh/session theo Web/Mobile; Admin MFA.                 |
| Realtime      | WebSocket `/realtime`; REST là source of truth.                                  |
| File          | S3-compatible; AWS S3 production, MinIO local/dev; private/signed URL.           |

## 4. Thứ tự build backend

1. Foundation: config, DB, migration/index, error envelope, logging, audit, idempotency, job base.
2. IAM/Security: actor context, session, RBAC, tenant, assignment, Guest verification, rate limit.
3. Supply side: catalog/policy, Operator/KYC, vehicle, route, stop point, trip, fare.
4. Inventory/checkout: TripSeat, SeatHold, search/detail, booking snapshot.
5. Payment/ticket: VNPay adapter, callback, ticket/QR, escrow, notification.
6. Post-booking/ops: Guest lookup, cancel/refund request, Employee manifest/check-in/offline, support.
7. Admin/finance/report: dispute, manual refund, commission, payout, reconciliation, audit/report export.
8. Hardening: P0/P1 tests, performance baseline, staging smoke, runbook.

## 5. Module ownership target

| Group           | Modules                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------ |
| IAM             | `iam/auth`, `iam/user`, `iam/session`, `iam/role`                                                |
| Marketplace     | `marketplace`, `search`, `booking`, `ticket`                                                     |
| Inventory       | `trip`, `trip-seat`, `seat-hold`, `fare`                                                         |
| Payment/finance | `payment`, `refund`, `escrow`, `commission`, `payout`, `reconciliation`                          |
| Operator OS     | `operator`, `operator-kyc`, `vehicle`, `route`, `stop-point`, `employee`, `manifest`, `check-in` |
| Trust           | `support`, `complaint`, `review`, `dispute`, `scorecard`                                         |
| Platform admin  | `admin`, `catalog`, `policy`, `audit`, `reporting`                                               |
| Cross-cutting   | `common`, `database`, `external`, `notification`, `job`                                          |

## 6. Invariant P0 không được phá

| ID     | Invariant                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------- |
| INV-01 | Không có hai ticket hợp lệ cho cùng `tripId + seatCode`.                                           |
| INV-02 | SeatHold hết hạn không được dùng để tạo payment/ticket.                                            |
| INV-03 | Payment callback phải verify signature/source/amount/transaction id và idempotent.                 |
| INV-04 | Ticket QR token không đoán được, verify server-side, không log raw secret.                         |
| INV-05 | Operator/Employee không đọc hoặc thao tác tenant khác.                                             |
| INV-06 | Employee chỉ thao tác trip/manifest/check-in trong assignment scope.                               |
| INV-07 | Admin sensitive actions cần RBAC, re-auth/MFA nếu policy yêu cầu, reason và audit.                 |
| INV-08 | Ledger/payout/refund không cập nhật thiếu reference/audit.                                         |
| INV-09 | Không hard delete production data tiền/vé/KYC/dispute/audit.                                       |
| INV-10 | Log/notification/export không chứa password, OTP, token, QR raw secret, payment sensitive payload. |

## 7. Test tối thiểu theo loại task

| Task type     | Test bắt buộc                                                       |
| ------------- | ------------------------------------------------------------------- |
| DB/repository | Index/unique/transaction/TTL/tenant query.                          |
| API command   | DTO, error envelope, idempotency, state conflict.                   |
| Security      | Auth/RBAC/tenant/assignment/Guest lookup/rate/log redaction.        |
| Payment       | Success/fail/duplicate/wrong signature/amount mismatch/reconciling. |
| SeatHold      | Concurrent hold, expiry race, payment race, no partial hold.        |
| Job           | Lock/checkpoint/retry/manual review/rerun idempotent.               |
| File/export   | Signed URL TTL, private access, scan gate, audit.                   |

## 8. No-go

- Không thêm actor/module/provider mới ngoài docs nếu chưa ghi OP/review.
- Không tạo endpoint/DTO/error/state mới nếu API Spec chưa cập nhật.
- Không dùng queue/realtime/cache làm nguồn đúng sai cuối cùng cho tiền/vé/ghế.
- Không bỏ qua audit vì “chỉ là admin/internal”.
- Không release production khi OPS-OP-01..04 chưa đóng.
