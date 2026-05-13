# 08. Test Plan & Acceptance Criteria - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính        | Giá trị                          |
| ----------------- | -------------------------------- |
| Tên tài liệu      | Test Plan & Acceptance Criteria  |
| Mã tài liệu       | 08-test-plan-acceptance-criteria |
| Dự án             | Hệ thống đặt vé xe khách         |
| Phiên bản         | v1.0                             |
| Trạng thái        | Draft                            |
| Người viết        | AI Agent, Nguyễn Hồng Khanh      |
| Người duyệt       | Nguyễn Hồng Khanh                |
| Ngày tạo          | 11/05/2026                       |
| Cập nhật gần nhất | 13/05/2026                       |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                                                                                                                            |
| --------- | ---------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0      | 13/05/2026 | AI Agent       | Viết lại toàn bộ Test Plan & Acceptance Criteria từ tài liệu Approved 01/02/03/04/05 và Security Design v1.0; bổ sung test suite Backend V1. |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp Test Plan & Acceptance Criteria.                                                                                                |

### 1.3. Trạng thái sử dụng

Tài liệu này ở trạng thái `Draft`. Nội dung v1.0 đủ làm baseline review, planning QA và chuẩn bị triển khai test Backend V1 theo SRS/HLD/LLD/DB/API/Security. Theo quy chuẩn SDLC, tài liệu vẫn cần người duyệt chuyển trạng thái trước khi được xem là nguồn nghiệm thu chính thức.

Tài liệu này KHÔNG dựa vào source code hiện tại. Test plan lấy nguồn từ tài liệu SDLC đã `Approved` theo `PROJECT-STATE`: SRS v1.20, HLD v1.13, LLD v1.2, Database Design v1.4, API Specification v1.1; đồng thời dùng `07-security-permission-design.md` v1.0 làm tài liệu nhận vừa được viết để chi tiết hóa security test.

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Nguồn đầu vào và phạm vi test
5. Test strategy Backend V1
6. Test environment, seed data và test evidence
7. Traceability matrix
8. Acceptance Criteria V1 theo SRS AC-01..AC-35
9. Test suite chi tiết Backend V1
10. Security, privacy và abuse test
11. Performance, concurrency và reliability test
12. Regression, release gate và defect policy
13. Entry / Exit criteria
14. Rủi ro test và OP
15. Phụ lục

---

## 3. Giới thiệu

### 3.1. Mục đích

Tài liệu này xác định chiến lược kiểm thử, tiêu chí nghiệm thu, test suite bắt buộc, dữ liệu kiểm thử và exit criteria cho Backend V1 của hệ thống đặt vé xe khách managed marketplace. Test Plan phải bảo đảm mỗi luồng chính có thể truy vết về FR, UC, BR, AC, API contract, DB invariant và Security baseline.

### 3.2. Mục tiêu kiểm thử

| Mục tiêu                 | Ý nghĩa                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Đúng nghiệp vụ           | Luồng User/Guest, Operator, Employee, Admin và System khớp SRS AC-01..AC-35.                           |
| An toàn tiền/vé/ghế      | Không bán trùng ghế, không phát hành ticket sai, không ghi trùng tiền/refund/payout.                   |
| Đúng phân quyền          | Backend enforce RBAC, tenant boundary, assignment scope, ownership và Guest verification.              |
| Bảo vệ dữ liệu cá nhân   | Masking, audit, export control, file private, token/OTP/QR secret handling đúng baseline.              |
| Chịu lỗi tích hợp        | VNPay callback trễ/trùng/lệch, notification failure, file scan pending, job retry không làm sai state. |
| Có bằng chứng nghiệm thu | Mỗi critical AC có test result, log/evidence và truy vết tới yêu cầu.                                  |

### 3.3. Ngoài phạm vi

| Ngoài phạm vi trong tài liệu này                            | Tài liệu / owner nhận                                 |
| ----------------------------------------------------------- | ----------------------------------------------------- |
| Chi tiết UI layout, copy, accessibility theo màn hình       | `06-ui-ux-flow-specification.md`                      |
| Deployment pipeline, monitoring stack, backup schedule      | `09-deployment-operation-standard.md`                 |
| Task breakdown, sprint plan, owner từng test implementation | `11-project-task-breakdown.md`                        |
| Test dữ liệu production thật hoặc tiền thật                 | Không dùng trong V1 test baseline; dùng sandbox/mock. |

---

## 4. Nguồn đầu vào và phạm vi test

### 4.1. Nguồn được dùng

| Nguồn                                      | Trạng thái | Cách dùng trong Test Plan                                                                       |
| ------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------- |
| `01-srs-he-thong-dat-ve-xe-khach.md` v1.20 | Approved   | Nguồn FR, NFR, UC, BR, BF, state, risk và AC-01..AC-35.                                         |
| `02-hld-he-thong-dat-ve-xe-khach.md` v1.13 | Approved   | Nguồn architecture boundary, client/backend boundary, integration, realtime/job và NFR mapping. |
| `03-lld-he-thong-dat-ve-xe-khach.md` v1.2  | Approved   | Nguồn application service, state transition, idempotency, error behavior và test handoff.       |
| `04-database-design.md` v1.4               | Approved   | Nguồn schema logical, index/constraint, transaction, TTL, retention và file policy.             |
| `05-api-specification.md` v1.1             | Approved   | Nguồn endpoint, DTO, error envelope, header, idempotency, webhook, realtime và API constraints. |
| `07-security-permission-design.md` v1.0    | Draft      | Chi tiết security test vừa được viết từ nguồn Approved; không dùng để mở rộng nghiệp vụ.        |
| `context/DOMAIN-MAP.md`                    | Context    | Định vị capability/module để gom test suite.                                                    |
| `context/GLOSSARY.md`                      | Context    | Thuật ngữ thống nhất.                                                                           |

### 4.2. Phạm vi kiểm thử Backend V1

| Nhóm phạm vi                       | Trong scope | Ghi chú                                                              |
| ---------------------------------- | ----------- | -------------------------------------------------------------------- |
| IAM/session/auth                   | Có          | User, Guest, Operator, Employee, Admin, refresh/revoke/force logout. |
| RBAC/tenant/assignment/ownership   | Có          | Security regression bắt buộc.                                        |
| Marketplace search/detail          | Có          | Search visibility, trip detail, sale window, public data.            |
| SeatHold/booking/payment/ticket    | Có          | Critical path; có concurrency/idempotency/provider failure test.     |
| Guest lookup/cancel/refund/support | Có          | Anti-enumeration và verified scope.                                  |
| Operator onboarding/resource/trip  | Có          | KYC gate, tenant data, trip open/change/cancel, inventory.           |
| Employee manifest/check-in/offline | Có          | Role/assignment, QR server-side, queued operation giới hạn.          |
| Admin governance/finance/dispute   | Có          | MFA/re-auth, audit, manual decisions, payout, reconciliation.        |
| Notification/in-app/email baseline | Có          | Mandatory/non-mandatory, retry, idempotency, privacy.                |
| File/attachment/report export      | Có          | Signed URL, scan gate, type/size, async export, audit.               |
| Realtime event contract            | Có          | WebSocket contract/payload/scope/fallback ở mức backend contract.    |
| Deployment/production operations   | Một phần    | Chỉ test readiness liên quan app; runbook/infra chi tiết thuộc `09`. |

### 4.3. Mức ưu tiên test

| Priority | Ý nghĩa                                                                                                    | Yêu cầu trước release backend V1                             |
| -------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| P0       | Critical: sai sẽ gây mất tiền, bán trùng ghế, lộ PII, sai quyền, phát hành vé sai hoặc không thể vận hành. | 100% pass hoặc có quyết định chấp nhận rủi ro bằng văn bản.  |
| P1       | High: hỏng luồng chính, tăng dispute/refund/manual ops hoặc sai báo cáo quan trọng.                        | Pass trước release; exception cần owner và mitigation.       |
| P2       | Medium: ảnh hưởng UX/vận hành nhưng có workaround.                                                         | Pass theo regression plan hoặc đưa vào backlog có kiểm soát. |
| P3       | Low: cải thiện coverage/edge ít rủi ro.                                                                    | Không chặn release nếu đã ghi rõ.                            |

---

## 5. Test strategy Backend V1

### 5.1. Test levels

| Cấp độ test           | Mục tiêu                                                                                     | Owner chính    | Bắt buộc với nhóm nào                                             |
| --------------------- | -------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------- |
| Unit test             | Test domain policy, validator, state transition, price/refund/commission/payout calculation. | Backend dev    | Fare, promotion, refund, commission, payout, permission, state.   |
| Repository/DB test    | Test transaction, conditional update, unique/partial index, TTL logic, query tenant.         | Backend dev    | SeatHold, payment callback, ticket QR, tenant query, audit, jobs. |
| Integration test      | Test service + DB + adapter mock + job queue boundary.                                       | Backend dev/QA | Booking/payment/refund/payout/notification/file/report.           |
| API contract test     | Test endpoint, header, DTO, error envelope, idempotency, pagination, permission.             | QA/Backend dev | Tất cả endpoint từ API Spec V1.                                   |
| Security test         | Test auth, RBAC, tenant, IDOR, Guest lookup, rate limit, CSRF, token/log hygiene.            | QA/Security    | P0/P1 security baseline.                                          |
| Concurrency test      | Test race condition, retry, duplicate callback, double booking, job rerun.                   | Backend dev/QA | SeatHold, booking, payment, notification, payout.                 |
| E2E backend flow test | Test luồng end-to-end qua API và adapter sandbox/mock.                                       | QA             | BF-01..BF-10.                                                     |
| Performance test      | Test baseline NFR search/trip detail/checkout/callback/report.                               | QA/DevOps      | NFR-PERF, NFR-SCALE.                                              |
| UAT support checklist | Chuẩn bị evidence để người duyệt xác nhận nghiệp vụ.                                         | QA/PO          | AC-01..AC-35.                                                     |

### 5.2. Automation priority

| Wave | Nội dung tự động hóa                                                                                            | Lý do                                          |
| ---- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1    | P0 unit/integration: SeatHold, booking snapshot, payment callback, ticket issuance, tenant guard, Guest lookup. | Chặn mất tiền/vé/PII.                          |
| 2    | P0/P1 API contract: auth/session, checkout, Operator tenant, Employee check-in, Admin finance, refund/dispute.  | Chặn tích hợp FE/Mobile và backend regression. |
| 3    | Job/provider/file/notification/realtime tests.                                                                  | Chặn retry sai, leak dữ liệu và lỗi vận hành.  |
| 4    | Performance/concurrency/regression suite mở rộng.                                                               | Chuẩn bị peak traffic và production readiness. |

### 5.3. Contract testing

| Contract source              | Test rule                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| API Spec V1                  | API contract test phải đối chiếu method/path/header/DTO/error/idempotency.                     |
| OpenAPI 3.1 derived artifact | Khi artifact được tạo, test phải kiểm OpenAPI khớp API Spec; artifact không thay thế tài liệu. |
| DB Design                    | Repository/integration test kiểm unique/index/transaction/TTL/idempotency retention.           |
| Security Design              | Security test kiểm auth/RBAC/tenant/masking/log/audit/rate limit.                              |
| SRS AC                       | UAT/evidence phải trace về AC-01..AC-35.                                                       |

---

## 6. Test environment, seed data và test evidence

### 6.1. Environment matrix

| Môi trường       | Mục đích                                                                                 | Yêu cầu tối thiểu                                                         |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Local            | Unit/integration nhanh của developer.                                                    | DB local hoặc test container; adapter mock; seed nhỏ ổn định.             |
| CI               | Typecheck/lint/unit/integration/API contract tự động.                                    | Seed deterministic; không gọi tiền thật; fail fast với P0.                |
| Test/Staging     | E2E backend flow, VNPay Sandbox, email sandbox/mock, file storage private, UAT evidence. | Cấu hình giống production logic; dữ liệu giả không nhạy cảm thật.         |
| Production smoke | Smoke sau deploy, không tạo tiền thật ngoài quy trình được duyệt.                        | Chỉ health, auth smoke, read-only hoặc transaction sandbox nếu được tách. |

### 6.2. Seed data tối thiểu

| Seed group              | Dữ liệu cần có                                                                                             | Trace                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------- |
| Admin bootstrap         | 1 Admin active có MFA, 1 Admin thiếu quyền finance, 1 Admin locked.                                        | AC-01, AC-14               |
| Platform policy         | SeatHold TTL 10 phút, refund policy default, commission 5%, payout T+3/no minimum/manual confirm.          | OQ-06, OQ-13, OQ-16, OQ-18 |
| Catalog                 | Province/Ward, StopPoint, VehicleType, Amenity seed có version/checksum/review metadata.                   | DB §19.2                   |
| Operators               | Operator approved, pending KYC, rejected/locked, Operator A/B để test tenant.                              | AC-17, AC-20               |
| Employees               | `TICKET_STAFF`, `DRIVER`, `SUPPORT_STAFF`, assigned/unassigned, locked employee.                           | AC-21..24                  |
| Transport               | Vehicle, SeatMap, Route, FareRule, Trip draft/open/sold_out/locked/cancelled/completed.                    | AC-18..19                  |
| Inventory               | TripSeat available/holding/booked/checked_in/blocked; SeatHold active/expired/consumed.                    | AC-05..06                  |
| Booking/payment         | User booking, Guest booking, pending/paid/confirmed/expired/cancelled/refund_pending.                      | AC-07..14                  |
| Tickets                 | Valid/cancelled/refunded/checked_in/no_show, QR valid/invalid/revoked.                                     | AC-11, AC-23               |
| Finance                 | Payment success/failed/reconciling, refund requested/processing/success/failed, ledger, payout candidates. | AC-26..27                  |
| Support/dispute         | Support ticket, complaint, dispute states, evidence attachments.                                           | AC-15, AC-28               |
| Notification/job/export | Mandatory/non-mandatory notification, failed delivery, background jobs, report export metadata.            | AC-30..33                  |

### 6.3. Test evidence

| Evidence type               | Bắt buộc khi                                                            |
| --------------------------- | ----------------------------------------------------------------------- |
| Automated test report       | Mọi CI run và regression run.                                           |
| API request/response sample | API contract test, UAT backend flow, provider callback.                 |
| DB state assertion          | SeatHold, booking/payment/ticket, refund, payout, audit, job.           |
| Security evidence           | RBAC/tenant denial, masked response, rate limit, CSRF, log redaction.   |
| Provider sandbox transcript | VNPay success/fail/return/callback/reconciliation.                      |
| Audit/job log evidence      | Sensitive action, Admin decision, payout, job rerun, callback mismatch. |
| Performance report          | Search/detail/checkout/callback/report/export load tests.               |
| UAT checklist               | Người duyệt xác nhận AC theo nhóm nghiệp vụ.                            |

---

## 7. Traceability matrix

| Source group      | Test suite chính                                                                                  | Priority |
| ----------------- | ------------------------------------------------------------------------------------------------- | -------- |
| FR-IAM-\*         | IAM/session/MFA/re-auth/RBAC/security logs.                                                       | P0       |
| FR-MKT-\*         | Search/detail/seat selection/Guest lookup/User history.                                           | P0/P1    |
| FR-BTP-\*         | SeatHold/booking/payment/ticket/refund/escrow/reconciliation.                                     | P0       |
| FR-OPR-\*         | Operator onboarding/KYC/bank account/finance tenant.                                              | P0/P1    |
| FR-OPS-\*         | Vehicle/route/trip/fare/inventory/manifest.                                                       | P1       |
| FR-PROM-\*        | Promotion validation, usage, snapshot, tenant guard.                                              | P1       |
| FR-EMP-\*         | Assignment/manifest/check-in/journey/incident/offline sync.                                       | P0/P1    |
| FR-ADM-\*         | Admin KYC/catalog/policy/commission/payment/refund/payout/audit/report.                           | P0/P1    |
| FR-NSR-\*         | Notification/support/review/reporting/scorecard.                                                  | P1/P2    |
| FR-DSP-\*         | Dispute state machine/evidence/deadline/decision.                                                 | P1       |
| NFR-PERF-\*       | Search <= 3s, trip detail <= 2s, concurrent checkout, async callback/report.                      | P0/P1    |
| NFR-SEC-\*        | Password/token/log hygiene, HTTPS assumption, RBAC, rate limit, NoSQL/XSS/CSRF/IDOR, QR security. | P0       |
| NFR-PRIV-\*       | Data minimization, masking, export control, log redaction, retention.                             | P0/P1    |
| NFR-AUDIT-\*      | Audit fields, backup readiness, financial traceability, no hard delete.                           | P0/P1    |
| BR-01..03         | SeatHold atomic/TTL/no double booking.                                                            | P0       |
| BR-17, BR-27..35  | Payment/refund/ledger/payout/manual decision.                                                     | P0       |
| BR-52..63         | Notification, audit, personal data, rate limit, job, provider adapter.                            | P0/P1    |
| API Spec §11..§22 | Endpoint contract, idempotency, webhook, realtime, jobs, audit API.                               | P0/P1    |
| DB §12..§18       | Transaction, TTL, idempotency retention, file scan, job state, retention, backup priority.        | P0/P1    |
| Security §5..§16  | Auth/session, RBAC, sensitive action, Guest verification, data protection, threat controls.       | P0/P1    |

---

## 8. Acceptance Criteria V1 theo SRS AC-01..AC-35

| AC ID | Nhóm                   | Acceptance criteria kiểm thử                                                                   | Test suite chính  | Priority |
| ----- | ---------------------- | ---------------------------------------------------------------------------------------------- | ----------------- | -------- |
| AC-01 | Identity               | User đăng ký/đăng nhập/reset đúng flow; Admin/Operator/Employee dùng cổng riêng.               | TS-IAM            | P0       |
| AC-02 | Identity               | Revoke session khi account khóa, quyền thu hồi hoặc mật khẩu cấp lại.                          | TS-IAM, TS-SEC    | P0       |
| AC-03 | Search                 | User/Guest search chuyến đúng filter; chỉ hiển thị trip mở bán/còn ghế/chưa hết sale.          | TS-MKT            | P1       |
| AC-04 | Trip detail            | User/Guest xem trip detail, Operator profile, giá, seat map, pickup/dropoff, policy trước đặt. | TS-MKT            | P1       |
| AC-05 | Seat hold              | User/Guest hold ghế khả dụng 10 phút; người khác không giữ/mua cùng ghế trong TTL.             | TS-SEAT, TS-CONC  | P0       |
| AC-06 | Seat expiry            | SeatHold hết hạn giải phóng ghế và booking cũ không thanh toán tiếp được.                      | TS-SEAT, TS-JOB   | P0       |
| AC-07 | Booking                | Tạo booking `PENDING_PAYMENT` từ hold hợp lệ, snapshot trip/fare/policy/contact/amount.        | TS-BOOK           | P0       |
| AC-08 | Promotion              | Promotion chỉ áp đúng scope/time/usage/actor/condition; lưu snapshot/redemption.               | TS-PROMO          | P1       |
| AC-09 | Payment                | VNPay Sandbox success cập nhật booking/payment/seat/ticket/escrow.                             | TS-PAY            | P0       |
| AC-10 | Payment exception      | Callback trễ/trùng/lệch không tạo trùng tiền/ticket; vào reconciliation.                       | TS-PAY, TS-JOB    | P0       |
| AC-11 | Ticket                 | Ticket có mã, QR không đoán được, trip/seat/passenger/pickup/dropoff/status.                   | TS-TICKET         | P0       |
| AC-12 | Guest lookup           | Guest lookup bằng code + contact; sensitive action cần verification.                           | TS-GUEST, TS-SEC  | P0       |
| AC-13 | Cancel/refund          | User/Guest verified hủy theo policy snapshot, tính refund và tạo request nếu đủ điều kiện.     | TS-REFUND         | P0       |
| AC-14 | Manual refund          | Admin manual refund/refund đơn phương cần quyền, re-auth/MFA, reason, audit, notification.     | TS-REFUND, TS-SEC | P0       |
| AC-15 | Support/complaint      | User tạo/theo dõi support; Guest verified tạo/theo dõi case gắn booking/ticket.                | TS-SUPPORT        | P1       |
| AC-16 | Review                 | Chỉ User có ticket hợp lệ trên trip completed gửi review; Guest không review V1.               | TS-REVIEW         | P1       |
| AC-17 | Operator onboarding    | Operator gửi KYC; Admin duyệt/từ chối/bổ sung/khóa; chưa duyệt không mở bán.                   | TS-OPR            | P0       |
| AC-18 | Operator resources     | Operator quản lý Vehicle/SeatMap/Route/StopPoint proposal/Trip/Fare/Inventory trong tenant.    | TS-OPS            | P1       |
| AC-19 | Trip change            | Sửa trip đã bán cần reason/log/notification cho hành khách bị ảnh hưởng.                       | TS-OPS, TS-NOTI   | P0       |
| AC-20 | Operator booking       | Operator xem/lọc/export booking/ticket thuộc tenant; không truy cập Operator khác.             | TS-TENANT         | P0       |
| AC-21 | Employee assignment    | Operator quản lý Employee/role/assignment; Employee chỉ thấy nhiệm vụ được giao.               | TS-EMP            | P0       |
| AC-22 | Manifest               | Employee xem manifest theo assignment; phone/PII mask theo policy.                             | TS-EMP, TS-PRIV   | P0       |
| AC-23 | Check-in               | Employee check-in server-side; vé sai/hủy/hoàn/đã check-in bị từ chối.                         | TS-EMP, TS-TICKET | P0       |
| AC-24 | Operation log          | Employee cập nhật trip/journey/incident; sync cho Operator/Admin và ghi operation log.         | TS-EMP            | P1       |
| AC-25 | Catalog/policy         | Admin quản lý catalog, policy, commission, payout policy và cảnh báo giá.                      | TS-ADM            | P1       |
| AC-26 | Finance monitoring     | Admin giám sát payment/refund/escrow/commission/payout; Operator xem finance tenant.           | TS-FIN            | P0       |
| AC-27 | Payout                 | Job tạo payout candidate T+3; Admin confirm manual trước `PAID`.                               | TS-PAYOUT         | P0       |
| AC-28 | Dispute                | Dispute theo state machine, evidence, deadline, Admin decision, notification.                  | TS-DSP            | P1       |
| AC-29 | Moderation             | Admin kiểm duyệt review/content/scorecard; nội dung vi phạm bị ẩn/giữ theo policy.             | TS-REVIEW         | P2       |
| AC-30 | Reporting              | Operator/Admin xem/export report theo quyền; report lớn async, không làm chậm core flow.       | TS-RPT            | P1       |
| AC-31 | Audit                  | Admin search audit theo actor/module/time/target/result; log nhạy cảm masked.                  | TS-AUDIT          | P0       |
| AC-32 | Notification           | Mandatory notification tạo/gửi/retry/lưu trạng thái; preference chỉ non-mandatory.             | TS-NOTI           | P1       |
| AC-33 | Background job         | Payment/refund/payout/notification/reconciliation job có lock/checkpoint/retry/status.         | TS-JOB            | P0       |
| AC-34 | Privacy/security       | Backend enforce RBAC, tenant, rate limit, masking, no token/OTP/payment sensitive leak.        | TS-SEC            | P0       |
| AC-35 | Backup/audit readiness | Booking/ticket/payment/refund/escrow/payout/KYC/dispute/audit ưu tiên backup/restore.          | TS-READINESS      | P1       |

---

## 9. Test suite chi tiết Backend V1

### 9.1. TS-IAM - Identity, session và auth

| ID      | Scenario                                                           | Expected result                                                                       | Type                 | Priority |
| ------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | -------------------- | -------- |
| IAM-001 | User đăng ký bằng email hợp lệ và xác minh OTP.                    | Account/session được tạo theo policy; OTP không log plaintext.                        | API/Security         | P0       |
| IAM-002 | User login sai credential nhiều lần.                               | Response safe, rate limit/lock tạm theo policy, security log.                         | API/Security         | P0       |
| IAM-003 | Operator login bằng username/password ở Operator auth.             | Session có `actorType=Operator`, `operatorId`; không dùng User flow.                  | API                  | P0       |
| IAM-004 | Employee login bằng account Operator cấp.                          | Session có role, operatorId, assignment summary safe.                                 | API                  | P0       |
| IAM-005 | Admin login không có MFA.                                          | Bị yêu cầu MFA; không cấp session privileged trước khi pass MFA.                      | Security             | P0       |
| IAM-006 | Public User reset password cho Admin/Operator/Employee identifier. | Không reset; response safe, audit/security log nếu cần.                               | Security             | P0       |
| IAM-007 | Refresh token Web thiếu `X-CSRF-Token`.                            | Từ chối refresh; security log.                                                        | Security/API         | P0       |
| IAM-008 | Refresh token hết hạn/revoked.                                     | Từ chối; yêu cầu login lại.                                                           | API                  | P0       |
| IAM-009 | Account bị khóa sau khi đã login.                                  | Session bị revoke/force logout; request kế tiếp bị từ chối.                           | Integration          | P0       |
| IAM-010 | Role/permission/assignment bị thu hồi.                             | Backend re-evaluate scope; action cũ bị từ chối.                                      | Integration/Security | P0       |
| IAM-011 | Multi-device list và revoke session của chính mình.                | Session bị revoke không refresh được; session khác còn hoạt động nếu policy cho phép. | API                  | P1       |
| IAM-012 | Access token xuất hiện trong query/log.                            | Test log hygiene phải fail nếu phát hiện token plaintext.                             | Security             | P0       |

### 9.2. TS-MKT - Search, trip detail và public data

| ID      | Scenario                                                                            | Expected result                                                     | Type         | Priority |
| ------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------ | -------- |
| MKT-001 | Search theo origin/destination/date/passenger count.                                | Trả trip `OPEN_FOR_SALE`, còn ghế phù hợp, chưa hết sale window.    | API          | P1       |
| MKT-002 | Search không trả trip `DRAFT`, `LOCKED`, `CANCELLED`, `COMPLETED`, hết sale window. | Các trip không hợp lệ bị loại.                                      | API          | P1       |
| MKT-003 | Search không trả Operator chưa KYC approved hoặc bị khóa.                           | Data public tuân KYC gate.                                          | Integration  | P0       |
| MKT-004 | Trip detail trả seat map/fare/pickup/dropoff/policy.                                | Response đủ field theo API Spec, không chứa PII.                    | API contract | P1       |
| MKT-005 | Availability trong detail cũ, sau đó hold bị conflict.                              | Hold API recheck và trả conflict đúng; client không dựa detail cũ.  | Integration  | P0       |
| MKT-006 | Public Operator profile.                                                            | Chỉ public fields/scorecard hợp lệ, không leak tenant/private data. | Security/API | P1       |

### 9.3. TS-SEAT - SeatHold, inventory và concurrency

| ID       | Scenario                                             | Expected result                                                                              | Type            | Priority |
| -------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------- | -------- |
| SEAT-001 | User hold một ghế `AVAILABLE`.                       | SeatHold `ACTIVE`, `expiresAt = createdAt + 10 phút`, TripSeat `HOLDING`.                    | Integration     | P0       |
| SEAT-002 | Guest hold nhiều ghế cùng trip.                      | All-or-nothing; mọi ghế held hoặc toàn bộ fail.                                              | Integration     | P0       |
| SEAT-003 | Hai actor hold cùng ghế đồng thời.                   | Chỉ một hold success; actor còn lại nhận `SEAT_HOLD_CONFLICT`.                               | Concurrency     | P0       |
| SEAT-004 | Request hold retry cùng `Idempotency-Key` và digest. | Trả hold hiện có, không tạo hold mới.                                                        | API/DB          | P0       |
| SEAT-005 | Retry cùng key nhưng digest khác.                    | Trả `IDEMPOTENCY_CONFLICT`.                                                                  | API/DB          | P0       |
| SEAT-006 | Hold ghế `BOOKED` hoặc `BLOCKED`.                    | Bị từ chối; không đổi trạng thái ghế.                                                        | Integration     | P0       |
| SEAT-007 | SeatHold hết hạn.                                    | Hold `EXPIRED`; ghế về `AVAILABLE` nếu chưa `BOOKED`/`BLOCKED`; booking cũ không thanh toán. | Job/Integration | P0       |
| SEAT-008 | TTL cleanup chạy trễ.                                | Mutation vẫn kiểm `expiresAt` tại DB và từ chối hold/payment hết hạn.                        | Integration     | P0       |
| SEAT-009 | Operator block ghế bán ngoài kênh.                   | Ghế không hold được; operation/audit log.                                                    | API/Integration | P1       |
| SEAT-010 | Payment success xảy ra gần lúc expire job chạy.      | Ghế không bị release sau khi `BOOKED`; không double booking.                                 | Concurrency     | P0       |

### 9.4. TS-BOOK - Booking, snapshot và promotion

| ID       | Scenario                                                                                              | Expected result                                                        | Type            | Priority |
| -------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------- | -------- |
| BOOK-001 | Create booking từ SeatHold `ACTIVE`.                                                                  | Booking `PENDING_PAYMENT`, SeatHold `CONSUMED`, snapshot đầy đủ.       | Integration     | P0       |
| BOOK-002 | Create booking từ SeatHold không thuộc actor/session.                                                 | Từ chối `SEAT_HOLD_NOT_OWNED` hoặc permission equivalent.              | Security/API    | P0       |
| BOOK-003 | Create booking từ expired/released hold.                                                              | Từ chối; không tạo booking; ghế state không sai.                       | Integration     | P0       |
| BOOK-004 | Booking snapshot chứa trip/operator/route/seat/fare/promotion/refund policy/passenger/contact/amount. | Snapshot immutable và đủ field DB/API.                                 | DB/API          | P0       |
| BOOK-005 | Policy/fare đổi sau booking.                                                                          | Booking cũ giữ snapshot; refund/amount không tính lại theo policy mới. | Regression      | P0       |
| BOOK-006 | Apply promotion đúng scope/usage/time/actor.                                                          | Booking preview/snapshot cập nhật, redemption lưu đúng.                | Integration     | P1       |
| BOOK-007 | Apply promotion hết hạn/vượt lượt/sai tenant.                                                         | Bị từ chối; usage không bị trừ sai.                                    | Integration     | P1       |
| BOOK-008 | Retry create booking cùng idempotency key.                                                            | Trả booking cũ nếu digest khớp; không tạo bookingCode trùng.           | API/DB          | P0       |
| BOOK-009 | Booking hết payment deadline.                                                                         | Không tạo payment mới; booking `EXPIRED` theo policy.                  | Job/Integration | P0       |

### 9.5. TS-PAY - Payment, VNPay callback và reconciliation

| ID      | Scenario                                                                    | Expected result                                                                              | Type         | Priority |
| ------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------ | -------- |
| PAY-001 | Create VNPay payment cho booking `PENDING_PAYMENT`.                         | Payment `INITIATED/PROCESSING`, amount VND khớp snapshot, redirectUrl safe.                  | API          | P0       |
| PAY-002 | Create payment cho booking expired/cancelled/paid/confirmed.                | Từ chối `PAYMENT_INVALID_STATE`; không tạo payment mới.                                      | API          | P0       |
| PAY-003 | VNPay callback success signature hợp lệ, response/status `00`, amount khớp. | Payment `SUCCESS`, booking `PAID/CONFIRMED`, TripSeat `BOOKED`, ticket issued, ledger entry. | Integration  | P0       |
| PAY-004 | Callback duplicate cùng provider transaction/payload digest.                | Idempotent; không tạo thêm ticket/ledger/notification bắt buộc.                              | Integration  | P0       |
| PAY-005 | Callback sai signature.                                                     | Không update success; log safe; response provider theo contract; no ticket.                  | Security     | P0       |
| PAY-006 | Callback amount mismatch.                                                   | Payment `RECONCILING` hoặc record reconciliation; không issue ticket.                        | Integration  | P0       |
| PAY-007 | Callback provider success nhưng booking expired/seat sold.                  | Vào `RECONCILING`/manual review; không auto issue ticket.                                    | Integration  | P0       |
| PAY-008 | Callback failed/cancelled/expired.                                          | Payment state tương ứng; ghế release theo policy nếu chưa success.                           | Integration  | P0       |
| PAY-009 | Browser return URL sau thanh toán.                                          | Không tin client; chỉ đọc payment status backend đã verify.                                  | API/Security | P0       |
| PAY-010 | Provider callback safe payload retention.                                   | Digest lưu; raw sensitive payload/secret không lưu/log; safe payload redacted.               | DB/Security  | P0       |
| PAY-011 | Reconciliation job xử lý payment `RECONCILING`.                             | Cập nhật theo kết quả hợp lệ hoặc manual review, có job/audit log.                           | Job          | P0       |

### 9.6. TS-TICKET - Ticket, QR và Guest ticket view

| ID         | Scenario                                    | Expected result                                                           | Type           | Priority |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------------- | -------------- | -------- |
| TICKET-001 | Payment success phát hành ticket.           | Ticket unique code, status `VALID`, QR token/hash, ticket snapshot.       | Integration    | P0       |
| TICKET-002 | Retry ticket issuance.                      | Không tạo trùng ticket/QR cho cùng passenger/seat item.                   | DB/Integration | P0       |
| TICKET-003 | User xem ticket của mình.                   | Trả TicketView đủ field, QR display payload không là raw secret.          | API            | P0       |
| TICKET-004 | User khác xem ticket.                       | Bị từ chối, không leak ticket tồn tại.                                    | Security       | P0       |
| TICKET-005 | QR invalid/forged.                          | Server-side verify fail, không check-in.                                  | Security       | P0       |
| TICKET-006 | QR đã check-in dùng lại.                    | Từ chối duplicate check-in hoặc trả idempotent nếu cùng operation hợp lệ. | Integration    | P0       |
| TICKET-007 | Ticket cancelled/refunded dùng để check-in. | Từ chối.                                                                  | Integration    | P0       |

### 9.7. TS-GUEST - Guest lookup, cancel, support

| ID        | Scenario                                                       | Expected result                                                         | Type         | Priority |
| --------- | -------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------ | -------- |
| GUEST-001 | Guest lookup bookingCode + contact đúng.                       | Verified guest context được tạo; chỉ thấy booking/ticket liên quan.     | API/Security | P0       |
| GUEST-002 | Lookup đúng code nhưng sai contact.                            | Response generic; không leak code tồn tại; rate limit count tăng.       | Security     | P0       |
| GUEST-003 | Lookup bằng phone/email không kèm code.                        | Từ chối; không broad lookup.                                            | Security     | P0       |
| GUEST-004 | Guest session checkout hết hạn.                                | Không thao tác bằng session cũ; lookup bằng code+contact vẫn hoạt động. | Integration  | P0       |
| GUEST-005 | Guest cancel/refund sau lookup nhưng chưa sensitive challenge. | Yêu cầu verification/challenge; không hủy trực tiếp.                    | Security/API | P0       |
| GUEST-006 | Guest tạo support/complaint cho booking verified.              | Case gắn đúng booking/ticket; scope chỉ case liên quan.                 | API          | P1       |
| GUEST-007 | Guest cố gửi review.                                           | Từ chối trong V1.                                                       | API          | P1       |

### 9.8. TS-REFUND - Cancel, refund và dispute-linked finance

| ID      | Scenario                                                | Expected result                                                       | Type        | Priority |
| ------- | ------------------------------------------------------- | --------------------------------------------------------------------- | ----------- | -------- |
| REF-001 | User cancel ticket trước deadline theo policy snapshot. | Ticket/booking update, refund request nếu có tiền hoàn, notification. | E2E/API     | P0       |
| REF-002 | Cancel ticket đã check-in/completed/quá hạn.            | Từ chối luồng thường; hướng support/dispute/Admin.                    | Integration | P0       |
| REF-003 | Partial cancel booking nhiều vé.                        | Chỉ ticket chọn bị hủy; refund amount đúng snapshot.                  | Integration | P1       |
| REF-004 | Refund request retry cùng idempotency key.              | Không tạo refund trùng.                                               | API/DB      | P0       |
| REF-005 | Admin manual refund không có permission.                | Từ chối; audit/security log.                                          | Security    | P0       |
| REF-006 | Admin manual refund thiếu MFA/re-auth challenge.        | Trả `AUTH_REAUTH_REQUIRED`/equivalent; không đổi state.               | Security    | P0       |
| REF-007 | Admin manual refund hợp lệ.                             | Refund state/ledger/audit/notification cập nhật đúng.                 | Integration | P0       |
| REF-008 | Refund provider/job trả mismatch.                       | Refund `RECONCILING`/manual review; không ledger sai.                 | Integration | P0       |

### 9.9. TS-OPR / TS-OPS - Operator onboarding, resource, trip

| ID      | Scenario                                              | Expected result                                                      | Type         | Priority |
| ------- | ----------------------------------------------------- | -------------------------------------------------------------------- | ------------ | -------- |
| OPR-001 | Operator submit profile/KYC docs.                     | Hồ sơ pending, attachment metadata private, scan status tracked.     | API/File     | P1       |
| OPR-002 | Operator chưa KYC approved mở bán trip.               | Từ chối open-for-sale.                                               | Integration  | P0       |
| OPR-003 | Admin approve/reject/request supplement KYC.          | State đúng, reason/audit/notification.                               | API/Security | P1       |
| OPR-004 | Operator đổi bank account thiếu re-auth/OTP.          | Từ chối; no bank snapshot update.                                    | Security     | P0       |
| OPR-005 | Operator đổi bank account hợp lệ.                     | Change request/audit/masked display; Admin review nếu cần.           | Integration  | P0       |
| OPS-001 | Operator tạo Vehicle/SeatMap/Route/Fare trong tenant. | Resource thuộc đúng `operatorId`; version field.                     | API          | P1       |
| OPS-002 | Operator A sửa Vehicle/Trip của Operator B.           | Từ chối tenant violation; không leak data.                           | Security     | P0       |
| OPS-003 | Trip thiếu route/seat map/fare/pickup/dropoff mở bán. | Từ chối; trip vẫn draft/invalid.                                     | Integration  | P1       |
| OPS-004 | Trip open-for-sale hợp lệ.                            | Trip public search được; TripSeat initialized.                       | Integration  | P1       |
| OPS-005 | Sửa trip đã bán vé thiếu reason/impact.               | Từ chối.                                                             | API          | P0       |
| OPS-006 | Đổi xe làm seat map không map được.                   | Chặn hoặc yêu cầu đổi ghế/refund/dispute path.                       | Integration  | P0       |
| OPS-007 | Hủy trip đã bán vé.                                   | Dừng bán, chặn payment mới, notification/refund/support path, audit. | E2E          | P0       |

### 9.10. TS-EMP - Employee assignment, manifest, check-in, offline

| ID      | Scenario                                                        | Expected result                                                         | Type             | Priority |
| ------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------- | -------- |
| EMP-001 | Operator tạo Employee role `DRIVER`.                            | Account active trong tenant; không login User flow.                     | API              | P1       |
| EMP-002 | Employee chưa assigned xem manifest.                            | Từ chối assignment scope.                                               | Security         | P0       |
| EMP-003 | Employee assigned xem manifest.                                 | Trả danh sách khách đúng trip; phone mask `0*** *** 789`.               | API/Privacy      | P0       |
| EMP-004 | Employee tìm khách ngoài trip assigned.                         | Từ chối hoặc không trả data.                                            | Security         | P0       |
| EMP-005 | Verify ticket đúng trip/status valid.                           | Trả valid safe result.                                                  | API              | P0       |
| EMP-006 | Check-in ticket valid.                                          | Ticket `CHECKED_IN`, TripSeat `CHECKED_IN`, operation log.              | Integration      | P0       |
| EMP-007 | Check-in ticket sai trip/cancelled/refunded/already checked-in. | Từ chối đúng error; no state corruption.                                | Integration      | P0       |
| EMP-008 | `SUPPORT_STAFF` không có quyền check-in theo assignment.        | Từ chối nếu không được phân quyền.                                      | Security         | P0       |
| EMP-009 | Journey log/incident attachment.                                | Ghi log/incident, attachment private, scan gate.                        | Integration/File | P1       |
| EMP-010 | Offline queued check-in sync một lần.                           | Apply idempotent theo `localOperationId`; operation log source offline. | Integration      | P0       |
| EMP-011 | Offline queued operation ngoài whitelist như refund/payment.    | Từ chối.                                                                | Security         | P0       |
| EMP-012 | Offline conflict do assignment bị thu hồi/baseVersion cũ.       | Mark conflict/rejected; không update state sai.                         | Integration      | P0       |

### 9.11. TS-ADM / TS-FIN / TS-PAYOUT - Admin governance và finance

| ID         | Scenario                                               | Expected result                                                         | Type         | Priority |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------------------- | ------------ | -------- |
| ADM-001    | Admin tạo policy version mới.                          | Version/effective time/reason/audit; booking cũ không đổi snapshot.     | Integration  | P1       |
| ADM-002    | Admin thiếu quyền tạo commission rule.                 | Từ chối, audit/security log.                                            | Security     | P0       |
| ADM-003    | Admin khóa Operator.                                   | Operator không mở bán; sessions liên quan bị revoke theo policy; audit. | Integration  | P0       |
| FIN-001    | Operator xem escrow ledger tenant.                     | Chỉ ledger thuộc Operator; không thấy Operator khác.                    | Security/API | P0       |
| FIN-002    | Admin search payment/refund/ledger theo filter.        | Trả safe payload, no secret/raw callback.                               | API/Security | P1       |
| PAYOUT-001 | Job tạo payout candidate T+3 sau Trip completed.       | Payout `PENDING_REVIEW`, no minimum threshold, checkpoint unique.       | Job          | P0       |
| PAYOUT-002 | Ledger lệch/refund/dispute chưa đóng.                  | Payout `ON_HOLD`/manual review, không `PAID`.                           | Integration  | P0       |
| PAYOUT-003 | Admin confirm bank transfer thiếu MFA/proof/reference. | Từ chối.                                                                | Security     | P0       |
| PAYOUT-004 | Admin confirm bank transfer hợp lệ.                    | Payout `PAID`, ledger entry, audit, notification Operator.              | Integration  | P0       |
| PAYOUT-005 | Retry payout candidate job.                            | Không tạo payout trùng checkpoint.                                      | Job/DB       | P0       |

### 9.12. TS-SUPPORT / TS-DSP / TS-REVIEW

| ID      | Scenario                                           | Expected result                                                         | Type         | Priority |
| ------- | -------------------------------------------------- | ----------------------------------------------------------------------- | ------------ | -------- |
| SUP-001 | User tạo support ticket gắn booking.               | Ticket created, scoped to owner, notification if configured.            | API          | P1       |
| SUP-002 | Operator phản hồi support thuộc tenant.            | Message saved; Operator khác không xem được.                            | Security/API | P1       |
| DSP-001 | Admin tạo DisputeCase từ support/booking/payment.  | Dispute `OPEN`, refs đầy đủ, audit.                                     | API          | P1       |
| DSP-002 | Admin request evidence đặt deadline.               | State/deadline/message notification đúng.                               | API          | P1       |
| DSP-003 | User/Guest verified gửi evidence.                  | Attachment intent/confirm đúng scope/scan gate.                         | File/API     | P1       |
| DSP-004 | Dispute transition sai state.                      | Từ chối; state machine giữ nguyên.                                      | Unit/API     | P1       |
| DSP-005 | Admin decide refund/no refund.                     | State terminal đúng, reason/evidence/audit/notification; refund nếu có. | Integration  | P0       |
| REV-001 | User có ticket hợp lệ trip completed gửi review.   | Review created, scorecard job/update.                                   | API          | P1       |
| REV-002 | Guest hoặc User không có ticket hợp lệ gửi review. | Từ chối.                                                                | API          | P1       |
| REV-003 | Admin moderate review.                             | Review hidden/approved/flagged, reason/audit.                           | API          | P2       |

### 9.13. TS-NOTI - Notification, preference và delivery

| ID       | Scenario                                                        | Expected result                                                             | Type         | Priority |
| -------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------ | -------- |
| NOTI-001 | Payment success/ticket issued tạo mandatory notification.       | In-app/email delivery record, event idempotency key.                        | Integration  | P1       |
| NOTI-002 | User tắt notification non-mandatory.                            | Non-mandatory skipped; mandatory vẫn tạo.                                   | API          | P1       |
| NOTI-003 | Guest notification.                                             | Gửi qua contact booking, không chứa dữ liệu ngoài booking/ticket.           | Security     | P1       |
| NOTI-004 | Delivery failed còn retry budget.                               | Status `RETRYING`, retry theo policy, không gửi trùng mandatory cùng event. | Job          | P1       |
| NOTI-005 | Retry hết budget critical notification.                         | Status `FAILED`; Admin/manual review nếu critical.                          | Job/API      | P1       |
| NOTI-006 | Template chứa token/OTP/QR raw secret/payment sensitive data.   | Test template allowlist fail.                                               | Security     | P0       |
| NOTI-007 | SMS/push transactional endpoint/token registry public trong V1. | Không tồn tại hoặc feature disabled nếu chưa review scope.                  | API contract | P1       |

### 9.14. TS-FILE / TS-RPT / TS-JOB / TS-AUDIT

| ID       | Scenario                                                              | Expected result                                                             | Type         | Priority |
| -------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------ | -------- |
| FILE-001 | Create upload intent type/size hợp lệ.                                | Signed upload URL, expiresAt 15 phút, allowed types/size đúng.              | API/File     | P1       |
| FILE-002 | Upload type/size không allowlist.                                     | Từ chối trước signed URL hoặc confirm.                                      | API          | P1       |
| FILE-003 | Download private file `scanStatus=PENDING`.                           | Từ chối hoặc chỉ Admin quarantine role theo policy.                         | Security     | P0       |
| FILE-004 | Download private file `CLEAN`.                                        | Signed download URL 5 phút, scope đúng.                                     | API/Security | P1       |
| FILE-005 | Report export file.                                                   | Async job, private object 30 ngày, URL 10 phút, metadata audit 24 tháng.    | Integration  | P1       |
| RPT-001  | Operator dashboard/report.                                            | Chỉ dữ liệu tenant; query lớn async.                                        | API/Security | P1       |
| RPT-002  | Admin report export include sensitive fields thiếu reason/permission. | Từ chối.                                                                    | Security     | P0       |
| JOB-001  | Job already running cùng lock/checkpoint.                             | Không chạy song song sai; trả `JOB_ALREADY_RUNNING` hoặc equivalent.        | Job          | P0       |
| JOB-002  | Job retry vượt ngưỡng.                                                | `MANUAL_REVIEW`, safe error payload.                                        | Job          | P1       |
| AUD-001  | Sensitive action success.                                             | Audit đầy đủ actor/action/target/reason/result/before-after masked.         | Integration  | P0       |
| AUD-002  | Sensitive action denied.                                              | Audit/security log nếu thuộc nhóm bắt buộc.                                 | Security     | P0       |
| AUD-003  | Audit export.                                                         | Requires Admin permission/reason; export audit ngược; masked by permission. | Security/API | P0       |

---

## 10. Security, privacy và abuse test

| ID      | Scenario                                                            | Expected result                                                                     | Priority |
| ------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------- |
| SEC-001 | Operator A gửi request với `operatorId` của Operator B.             | Backend bỏ/từ chối client-sent operatorId; không leak data.                         | P0       |
| SEC-002 | Employee sửa assignmentId trong payload để xem trip khác.           | Assignment guard từ chối.                                                           | P0       |
| SEC-003 | User đổi `userId` trong body/path để xem booking người khác.        | Ownership guard từ chối.                                                            | P0       |
| SEC-004 | Guest lookup brute force nhiều code/contact.                        | Rate limit/lock tạm; response generic.                                              | P0       |
| SEC-005 | NoSQL injection trong filter/sort/search.                           | DTO/query whitelist từ chối; không truyền raw filter.                               | P0       |
| SEC-006 | XSS payload trong review/support/incident note.                     | Sanitize/escape hoặc reject theo policy; notification/template không render unsafe. | P1       |
| SEC-007 | CSRF refresh Web thiếu/sai token.                                   | Từ chối refresh.                                                                    | P0       |
| SEC-008 | Access token expired.                                               | Từ chối hoặc refresh flow hợp lệ; không dùng token hết hạn.                         | P0       |
| SEC-009 | Refresh token bị revoke.                                            | Từ chối refresh; session inactive.                                                  | P0       |
| SEC-010 | Full phone manifest không có purpose.                               | Từ chối; default masked.                                                            | P0       |
| SEC-011 | Export PII thiếu permission/reason.                                 | Từ chối; security/audit log.                                                        | P0       |
| SEC-012 | Log scan phát hiện plaintext password/OTP/token/QR/provider secret. | Build/test fail hoặc security finding P0.                                           | P0       |
| SEC-013 | Realtime subscribe topic Operator khác.                             | Server không authorize subscription; connection/topic denied.                       | P0       |
| SEC-014 | Realtime session revoked.                                           | Connection/subscription đóng hoặc giảm scope.                                       | P1       |
| SEC-015 | Payment callback replay/sai signature.                              | Không state success, no ticket/ledger duplicate.                                    | P0       |
| SEC-016 | File signed URL hết hạn.                                            | Không đọc được sau TTL.                                                             | P1       |

---

## 11. Performance, concurrency và reliability test

### 11.1. Performance baseline

| ID       | Scenario                                       | Baseline từ SRS/NFR              | Expected result                                                   | Priority |
| -------- | ---------------------------------------------- | -------------------------------- | ----------------------------------------------------------------- | -------- |
| PERF-001 | Search route/date phổ biến tải bình thường.    | <= 3 giây.                       | p95 theo môi trường test đạt baseline hoặc có risk accepted.      | P1       |
| PERF-002 | Trip detail tải bình thường.                   | <= 2 giây.                       | p95 đạt baseline, không tính mạng bất thường.                     | P1       |
| PERF-003 | Manifest check-in tải trong mạng yếu mô phỏng. | Nhanh đủ vận hành.               | Response phù hợp để Employee check-in; có retry/fallback nếu lỗi. | P1       |
| PERF-004 | Payment callback burst.                        | Không nghẽn luồng booking chính. | Callback queued/processed idempotent, không timeout hàng loạt.    | P0       |
| PERF-005 | Report lớn.                                    | Async job.                       | Request trả job nhanh; job không làm chậm checkout/check-in.      | P1       |

### 11.2. Concurrency baseline

| ID       | Scenario                                       | Expected result                                                             | Priority |
| -------- | ---------------------------------------------- | --------------------------------------------------------------------------- | -------- |
| CONC-001 | 50+ request hold cùng một ghế.                 | Chỉ một success; các request khác conflict; không active hold trùng.        | P0       |
| CONC-002 | Multi-seat hold có một ghế conflict.           | Toàn bộ hold fail, không hold một phần.                                     | P0       |
| CONC-003 | Create booking retry/network timeout.          | Idempotent; không booking/snapshot trùng.                                   | P0       |
| CONC-004 | Payment success callback duplicate song song.  | Một state transition; một bộ ticket/ledger/notification.                    | P0       |
| CONC-005 | Expire SeatHold job chạy cùng payment success. | Payment success thắng nếu verified/committed; job không release ghế booked. | P0       |
| CONC-006 | Payout candidate job chạy lại cùng checkpoint. | Không payout trùng.                                                         | P0       |
| CONC-007 | Notification retry nhiều worker.               | Không gửi trùng mandatory notification cùng event.                          | P1       |
| CONC-008 | Offline check-in sync duplicate.               | Apply một lần theo localOperationId/idempotency.                            | P0       |

### 11.3. Reliability/failure injection

| ID      | Failure                                               | Expected behavior                                                            | Priority |
| ------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- | -------- |
| REL-001 | VNPay unavailable khi create payment.                 | Payment/booking state rõ; không mất hold/booking; có retry theo policy.      | P0       |
| REL-002 | Callback đến sau booking expired.                     | `RECONCILING`/manual review; no auto ticket nếu state không khớp.            | P0       |
| REL-003 | Email provider fail khi ticket issued.                | Ticket vẫn tra cứu được; delivery retry/fail record.                         | P1       |
| REL-004 | Storage upload fail.                                  | Attachment không confirm; business action phụ thuộc file không hoàn tất.     | P1       |
| REL-005 | Scan status `FAILED/QUARANTINED`.                     | Private file không đọc bởi actor thường; Admin quarantine flow nếu có quyền. | P1       |
| REL-006 | Routing unavailable khi cấu hình route/search helper. | Không làm sai booking; trả lỗi/fallback safe.                                | P2       |
| REL-007 | Job worker crash giữa chừng.                          | Job checkpoint/retry an toàn; no duplicate financial/notification state.     | P0       |
| REL-008 | DB transaction unsupported in environment.            | Migration/readiness test fail trước khi bật API rủi ro cao.                  | P0       |

---

## 12. Regression, release gate và defect policy

### 12.1. Regression groups

| Regression group | Kích hoạt khi thay đổi                                                            |
| ---------------- | --------------------------------------------------------------------------------- |
| Auth/RBAC        | Auth/session/permission/account/guard/API gateway.                                |
| Tenant/Employee  | Operator/Employee modules, repository scope, assignment, manifest, report/export. |
| Checkout         | Search/detail/SeatHold/booking/promotion/payment/ticket.                          |
| Finance          | Payment callback, refund, escrow ledger, commission, payout, reconciliation.      |
| Guest            | Guest session, lookup, cancel/refund/support.                                     |
| Notification     | Template, event, preference, delivery retry, provider adapter.                    |
| File/Export      | Attachment, signed URL, scan gate, report export, retention.                      |
| Audit/Job        | Audit log fields, job lock/retry/checkpoint/manual review.                        |

### 12.2. Release gate

| Gate                | Điều kiện bắt buộc                                                              |
| ------------------- | ------------------------------------------------------------------------------- |
| G1 - Contract       | API contract tests P0 pass; breaking change phải cập nhật API Spec trước.       |
| G2 - Security       | Security tests P0 pass; không còn IDOR/RBAC/tenant/payment spoof/token leak P0. |
| G3 - Data           | SeatHold/payment/ticket/refund/payout DB invariants P0 pass.                    |
| G4 - Critical flows | BF-01..BF-10 P0/P1 flow tests pass theo scope release.                          |
| G5 - Evidence       | Test report, callback transcript, audit/job evidence và risk acceptance đầy đủ. |

### 12.3. Defect severity

| Severity   | Định nghĩa                                                                                                      | Release rule                              |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Blocker/P0 | Mất tiền, bán trùng ghế, phát hành vé sai, leak PII/secret, bypass tenant/RBAC, payment spoof, data corruption. | Không release.                            |
| High/P1    | Hỏng luồng chính, refund/payout/report sai, notification bắt buộc không gửi/retry, Admin action thiếu audit.    | Không release trừ khi có risk acceptance. |
| Medium/P2  | Có workaround, không ảnh hưởng tiền/vé/quyền/PII nghiêm trọng.                                                  | Có thể release nếu backlog/owner rõ.      |
| Low/P3     | Cosmetic/test coverage edge thấp.                                                                               | Không chặn release.                       |

---

## 13. Entry / Exit criteria

### 13.1. Entry criteria

| Điều kiện                   | Baseline V1                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| SRS/HLD/LLD/DB/API baseline | Tài liệu 01..05 đang `Approved` theo `PROJECT-STATE`.                           |
| Security baseline           | `07` v1.0 có rule auth/RBAC/tenant/sensitive/data protection đủ để viết test.   |
| Test data                   | Có seed data tối thiểu theo §6.2 hoặc fixture tương đương.                      |
| Provider/payment            | Có VNPay Sandbox hoặc adapter mock mô phỏng đủ success/fail/duplicate/mismatch. |
| Notification                | Có email/in-app adapter mock/sandbox; SMS/push transactional disabled trong V1. |
| File storage                | Có storage test bucket/local adapter, signed URL, scan gate mock.               |
| CI                          | Có khả năng chạy unit/integration/API/security test tối thiểu cho P0.           |

### 13.2. Exit criteria cho Backend V1

| Điều kiện         | Quy định                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0 tests          | 100% pass hoặc có quyết định chấp nhận rủi ro rõ owner/ngày/phạm vi; security/payment/seat P0 không nên accept trừ trường hợp release nội bộ không production. |
| P1 tests          | Pass trước release production; exception cần mitigation và rollback/disable plan.                                                                              |
| Security blockers | Không còn IDOR/RBAC/tenant/Guest lookup/payment spoof/token/log leak P0.                                                                                       |
| Data invariants   | SeatHold, payment callback, ticket issuance, ledger, payout checkpoint, job idempotency pass.                                                                  |
| NFR critical      | Search/detail baseline, callback/retry, report async và manifest đủ dùng đã được đo ở môi trường phù hợp.                                                      |
| Evidence          | Có test report, API sample, DB assertion, audit/job log, provider transcript cho AC critical.                                                                  |
| Documentation     | Nếu implementation thay đổi contract/rule/schema, tài liệu tương ứng được cập nhật trước release.                                                              |

---

## 14. Rủi ro test và OP

### 14.1. Rủi ro test

| ID           | Rủi ro                                                                     | Mức        | Giảm thiểu                                                                                       |
| ------------ | -------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| TEST-RISK-01 | Chưa có tài liệu 09 chốt deployment/monitoring/backup schedule.            | Cao        | 08 chỉ chốt app-level test; 09 phải chốt trước staging/production.                               |
| TEST-RISK-02 | VNPay Sandbox behavior có thể khác production.                             | Trung bình | Test adapter mapping, callback safe payload, reconciliation; production provider review sau.     |
| TEST-RISK-03 | Email provider cụ thể chưa chốt.                                           | Trung bình | Dùng EmailProvider mock/sandbox; kiểm contract/template/retry, không phụ thuộc vendor.           |
| TEST-RISK-04 | Performance baseline phụ thuộc hạ tầng test.                               | Trung bình | Ghi rõ môi trường, dataset, concurrency; không so sánh lệch môi trường.                          |
| TEST-RISK-05 | Source Approved 04/05 có câu trạng thái sử dụng còn stale so với metadata. | Thấp       | Ghi known doc issue trong `PROJECT-STATE`; không ảnh hưởng test case nếu baseline table đã chốt. |

### 14.2. Open Points

Không còn Test Open Point chặn Backend V1 trong phạm vi tài liệu này. Các giá trị vận hành chi tiết như monitoring stack, backup schedule, incident runbook, production secret manager và performance target production theo hạ tầng cụ thể thuộc `09-deployment-operation-standard.md`.

---

## 15. Phụ lục

### 15.1. Test suite code map đề xuất

| Prefix     | Suite                                 |
| ---------- | ------------------------------------- |
| `IAM-*`    | Identity, auth, session, MFA, revoke. |
| `MKT-*`    | Marketplace search/detail.            |
| `SEAT-*`   | SeatHold/inventory.                   |
| `BOOK-*`   | Booking/snapshot/promotion.           |
| `PAY-*`    | Payment/VNPay/reconciliation.         |
| `TICKET-*` | Ticket/QR.                            |
| `GUEST-*`  | Guest lookup/session/support.         |
| `REF-*`    | Cancel/refund/manual refund.          |
| `OPR-*`    | Operator onboarding/KYC/bank.         |
| `OPS-*`    | Vehicle/route/trip/fare/inventory.    |
| `EMP-*`    | Employee/manifest/check-in/offline.   |
| `ADM-*`    | Admin governance.                     |
| `FIN-*`    | Finance monitoring/ledger.            |
| `PAYOUT-*` | Payout candidate/review/confirm.      |
| `SUP-*`    | Support/complaint.                    |
| `DSP-*`    | Dispute.                              |
| `REV-*`    | Review/scorecard/moderation.          |
| `NOTI-*`   | Notification/preference/retry.        |
| `FILE-*`   | Attachment/signed URL/scan.           |
| `RPT-*`    | Reporting/export.                     |
| `JOB-*`    | Background job/retry/checkpoint.      |
| `AUD-*`    | Audit/search/export.                  |
| `SEC-*`    | Cross-cutting security/abuse/privacy. |
| `PERF-*`   | Performance.                          |
| `CONC-*`   | Concurrency.                          |
| `REL-*`    | Reliability/failure injection.        |

### 15.2. Critical evidence checklist

| Evidence                                      | AC liên quan        |
| --------------------------------------------- | ------------------- |
| Double-hold concurrency result                | AC-05, AC-06        |
| VNPay success/duplicate/mismatch transcript   | AC-09, AC-10        |
| Ticket issuance/QR verify result              | AC-11, AC-23        |
| Guest lookup anti-enumeration result          | AC-12, AC-34        |
| Tenant violation denial for Operator/Employee | AC-20, AC-21, AC-34 |
| Admin manual refund audit/MFA evidence        | AC-14, AC-31        |
| Payout T+3/manual confirm evidence            | AC-27               |
| Notification mandatory retry evidence         | AC-32               |
| Job lock/checkpoint retry evidence            | AC-33               |
| PII masking/export audit evidence             | AC-22, AC-31, AC-34 |
