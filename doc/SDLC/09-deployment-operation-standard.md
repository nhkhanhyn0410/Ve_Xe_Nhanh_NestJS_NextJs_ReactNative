# 09. Deployment & Operation Standard - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| Tên tài liệu | Deployment & Operation Standard  |
| Mã tài liệu  | 09-deployment-operation-standard |
| Dự án        | Hệ thống đặt vé xe khách         |
| Phiên bản    | v1.0                             |
| Trạng thái   | Draft                            |
| Người viết   | AI Agent                         |
| Người duyệt  | Nguyễn Hồng Khanh                |
| Ngày tạo     | 11/05/2026                       |
| Ngày cập nhật | 13/05/2026                      |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi |
| --------- | ---------- | -------------- | ----------------- |
| v1.0      | 13/05/2026 | AI Agent       | Viết lại Deployment & Operation Standard đủ cho Backend V1 local/CI/staging: environment, config, secret, DB migration, provider sandbox/mock, observability, backup, incident và release gate. |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp Deployment & Operation Standard. |

### 1.3. Trạng thái sử dụng

Tài liệu này là bản `Draft`. Nội dung đủ làm baseline vận hành local/CI/staging cho Backend V1 và làm checklist production readiness. AI Agent KHÔNG tự chuyển tài liệu sang `Approved`.

Production deployment target, secret manager cụ thể, monitoring stack cụ thể và RPO/RTO chính thức vẫn cần reviewer/DevOps chốt trước production release. Các OP này không chặn triển khai backend local/CI/staging nếu implementation tuân thủ adapter/config boundary.

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Nguồn đầu vào và phạm vi vận hành
5. Nguyên tắc triển khai V1
6. Environment baseline
7. Configuration và secret
8. Local development standard
9. CI và test automation standard
10. Staging standard
11. Production readiness standard
12. Database migration, index và seed
13. Provider sandbox, mock và external callback
14. Observability, logging, metric và alert
15. Backup, restore và retention operation
16. Release, rollback và migration safety
17. Incident runbook baseline
18. Operation checklist
19. Traceability, OP và rủi ro

---

## 3. Giới thiệu

### 3.1. Mục đích

Tài liệu này quy định cách triển khai, cấu hình, kiểm thử vận hành và chuẩn bị release cho hệ thống đặt vé xe khách V1. Trọng tâm của bản v1.0 là Backend V1 vì đây là phần cần bắt đầu code sau khi SRS/HLD/LLD/DB/API/Security/Test đã đủ baseline.

### 3.2. Mục tiêu vận hành

| Mục tiêu | Ý nghĩa |
| -------- | ------- |
| Reproducible environment | Local/CI/staging phải có dependency tương đương cho các luồng P0: auth, tenant, SeatHold, booking, payment, ticket, file, job. |
| Safe configuration | Secret không commit vào repo; env khác nhau không dùng chung secret/callback URL. |
| Data safety | MongoDB replica set, migration/index/seed có kiểm tra trước khi bật write path rủi ro cao. |
| Provider safety | VNPay Sandbox/mock, email/in-app sandbox/mock, storage private; không dùng tiền thật trong test baseline. |
| Observable backend | Log/metric/audit/job evidence đủ để debug payment, SeatHold, refund, payout, tenant denial và check-in. |
| Release control | Không release production nếu P0 test, backup/restore, secret, monitoring/alert và incident runbook chưa đạt. |

### 3.3. Ngoài phạm vi

| Ngoài phạm vi | Ghi chú |
| ------------- | ------- |
| Chọn vendor cloud/hosting production cuối cùng | Ghi OP trong §19; không hard-code vào backend. |
| Quy trình App Store/Play Store chi tiết | Thuộc mobile release plan sau UI/UX và mobile implementation. |
| Legal/compliance review chính thức | SRS/HLD chỉ yêu cầu review pháp chế trước production, không thay thế tư vấn pháp lý. |
| Script implementation cụ thể trong repo | Khi code, script phải được cập nhật theo ADR/09/11 và test thực tế. |

---

## 4. Nguồn đầu vào và phạm vi vận hành

### 4.1. Nguồn được dùng

| Nguồn | Trạng thái | Vai trò |
| ----- | ---------- | ------- |
| SRS v1.20 | Approved | NFR vận hành, backup, security, provider, acceptance, risk. |
| HLD v1.13 | Approved | Environment, adapter, job, observability hook, production handoff. |
| LLD v1.2 | Approved | Module pipeline, job/idempotency, audit/observability hook, implementation order. |
| DB Design v1.4 | Approved | MongoDB replica set, migration, seed, retention, backup priority. |
| API Spec v1.1 | Approved | Header, idempotency, webhook, realtime, job/audit API. |
| Security v1.0 | Approved | Auth/session, secret/log hygiene, file security, rate limit, audit retention. |
| Test Plan v1.0 | Approved | Test environment, seed data, evidence, release gate. |
| ADR v1.0 | Draft | Implementation decision package và OP hạ tầng. |

### 4.2. Phạm vi Backend V1 trong tài liệu này

| Nhóm | Có trong 09 v1.0 | Ghi chú |
| ---- | ---------------- | ------- |
| Local backend environment | Có | MongoDB replica set, Redis-compatible backend, MinIO/storage mock, VNPay/email mock/sandbox. |
| CI test baseline | Có | Typecheck/lint/unit/integration/API/security gate theo Test Plan. |
| Staging backend readiness | Có | HTTPS, provider sandbox, seed data, private storage, audit/job evidence. |
| Production readiness | Có checklist/vendor-neutral | Vendor target, secret manager, monitoring stack và RPO/RTO cần reviewer chốt. |
| Frontend/mobile deployment | Chỉ touchpoint | Không thay thế UI/mobile release plan. |

---

## 5. Nguyên tắc triển khai V1

| ID | Nguyên tắc | Nguồn |
| -- | ---------- | ----- |
| OPS-PRIN-01 | Backend phải đọc cấu hình từ environment/secret store; không hard-code provider secret, endpoint production hoặc key trong code. | SRS NFR-MAINT-04, Security §11 |
| OPS-PRIN-02 | Mọi môi trường có dữ liệu write path P0 phải dùng MongoDB replica set hoặc môi trường tương đương hỗ trợ transaction. | DB-OP-01, DB-MIG-07 |
| OPS-PRIN-03 | Migration/index liên quan SeatHold, payment, booking lookup, tenant query phải chạy trước khi bật API ghi dữ liệu. | DB §19.1 |
| OPS-PRIN-04 | Provider ngoài luôn qua adapter/mock/sandbox; test baseline không dùng tiền thật hoặc dữ liệu cá nhân thật. | SRS BR-63, Test §6 |
| OPS-PRIN-05 | Realtime và queue không là source of truth; REST/DB state là nguồn cuối cùng. | API §21, ADR-012 |
| OPS-PRIN-06 | Log/metric/audit không chứa plaintext password, OTP, token, QR raw secret, provider secret hoặc payment sensitive payload. | Security §11, API §23 |
| OPS-PRIN-07 | Job ảnh hưởng tiền/vé/notification/report phải có idempotency, lock/checkpoint, retry và manual review path. | SRS BR-62, DB §17 |
| OPS-PRIN-08 | Không hard delete production đối với dữ liệu tiền, vé, KYC, dispute, audit và state history. | SRS BR-59, DB §18 |
| OPS-PRIN-09 | Production release yêu cầu backup/restore rehearsal, alert, runbook và P0 test evidence. | SRS AC-35, Test §13 |

---

## 6. Environment baseline

### 6.1. Environment matrix

| Environment | Mục đích | Dependency tối thiểu | Dữ liệu | Release gate |
| ----------- | -------- | -------------------- | ------- | ------------ |
| Local | Dev, debug, integration nhanh. | MongoDB replica set local/test, Redis-compatible backend, storage local/mock, provider mock/sandbox. | Seed nhỏ, deterministic, không PII thật. | Developer tự chạy P0 local suite khi chạm core. |
| CI | Typecheck, lint, unit/integration/API/security contract. | Ephemeral MongoDB transaction-capable, Redis/queue test, provider mocks. | Seed deterministic; reset mỗi run. | Fail fast nếu P0 test fail. |
| Staging | E2E backend, UAT, provider sandbox, migration rehearsal. | HTTPS, MongoDB replica set, Redis/queue, private object storage, VNPay Sandbox, email sandbox/mock. | Seed/UAT data giả, không secret production. | P0/P1 gate theo Test Plan; provider transcript. |
| Production | Bán vé thật. | Hosting target, managed/operated MongoDB replica set, Redis/queue, private S3-compatible storage, provider production secret, monitoring/alert. | Dữ liệu thật, backup/restore và retention chính thức. | Chỉ release khi §11/§16/§17 đạt. |

### 6.2. Service dependency baseline

| Service | Local | CI | Staging | Production readiness |
| ------- | ----- | -- | ------- | -------------------- |
| Backend API | Chạy bằng dev runtime hoặc container. | Build/test runtime. | Container/release artifact. | Scale/rollback/health check có runbook. |
| Worker/scheduler | Chạy cùng hoặc riêng process tùy implementation. | Chạy test job có kiểm soát. | Chạy job thật với sandbox/mock. | Separate worker process, alert retry/dead job. |
| MongoDB | Replica set local/test. | Transaction-capable ephemeral DB. | Replica set, migration rehearsal. | Backup, restore drill, monitoring, index audit. |
| Redis-compatible backend | Cache/rate/lock/queue test. | Test queue/rate/lock. | Staging queue/cache. | Persistence/eviction policy, alert, memory monitoring. |
| Object storage | MinIO hoặc mock S3-compatible. | Mock/MinIO ephemeral. | Private bucket/test bucket. | Private bucket, lifecycle, scan gate, signed URL. |
| VNPay | Adapter mock hoặc Sandbox. | Mock. | VNPay Sandbox. | Production credential/callback allowlist riêng. |
| Email/in-app | Mail sandbox/mock + DB in-app. | Mock. | Sandbox/provider test. | Provider production, template review, delivery alert. |
| OSRM/routing | Local/mock endpoint. | Mock. | Staging endpoint/mock. | Timeout/fallback và data refresh policy. |

---

## 7. Configuration và secret

### 7.1. Config group

| Nhóm | Ví dụ logical | Rule |
| ---- | ------------- | ---- |
| App | `APP_ENV`, `APP_BASE_URL`, `API_BASE_PATH`, timezone display. | `APP_ENV` phải phân biệt local/ci/staging/production. |
| Database | MongoDB URI, DB name, migration lock config. | Không log URI có credential; production dùng secret store. |
| Redis/queue | Redis URI, queue prefix, lock timeout, retry/backoff. | Prefix theo environment; không dùng chung queue staging/production. |
| Auth/session | Access token TTL, refresh/session TTL, cookie/CSRF config, MFA config. | Theo Security §6; secret rotate được. |
| Rate limit | Login, OTP, search, hold, payment, lookup, upload. | Rule theo Security §15; config theo env nhưng không yếu hơn baseline staging/prod. |
| Payment | VNPay terminal/merchant config, return/callback URL, hash secret. | Sandbox/prod tách secret và callback allowlist. |
| Notification | Email provider config, template version, retry budget. | SMS/push disabled nếu chưa mở scope. |
| Storage | Bucket, region/endpoint, signed URL TTL, max size/type, scan mode. | Private bucket, no public-read, scan gate. |
| Job | Schedule, max retry, backoff, concurrency, manual review threshold. | Job P0 không chạy không có lock/checkpoint. |
| Observability | Log level, metric enable, trace/export endpoint, retention target. | Không log secret/PII; correlation id bắt buộc. |
| Admin bootstrap | Initial Admin email/identifier, MFA seed/setup flow. | Chỉ dùng bootstrap one-time; audit sau kích hoạt. |

### 7.2. Secret rule

| ID | Rule |
| -- | ---- |
| SEC-OPS-01 | Không commit `.env` thật, provider key, JWT secret, cookie secret, database URI có credential hoặc storage key. |
| SEC-OPS-02 | Secret production không được dùng ở local/CI/staging. |
| SEC-OPS-03 | Rotation phải có kế hoạch cho auth secret, payment secret, storage key và provider credential. |
| SEC-OPS-04 | Log/error/safe payload phải redact secret kể cả khi provider trả lỗi. |
| SEC-OPS-05 | Secret leak là incident P0/P1 tùy scope; phải revoke/rotate và audit access. |

### 7.3. Environment validation

Backend startup phải fail fast nếu:

- Thiếu config bắt buộc cho environment đang chạy.
- `APP_ENV=production` nhưng HTTPS/cookie secure/callback URL/secret store chưa đạt rule production.
- MongoDB transaction support không khả dụng ở môi trường chạy transaction-core.
- Queue/worker bật nhưng thiếu lock/checkpoint/job storage.
- Storage production không private hoặc signed URL config thiếu TTL.
- Payment provider bật production nhưng callback URL/secret/allowlist chưa cấu hình.

---

## 8. Local development standard

### 8.1. Local dependency

| Dependency | Baseline local |
| ---------- | -------------- |
| MongoDB | Replica set local hoặc test container có transaction. |
| Redis-compatible backend | Dùng cho cache/rate/lock helper/queue nếu ADR-011 được chốt. |
| Object storage | MinIO hoặc mock S3-compatible, private bucket local. |
| Payment | VNPay adapter mock; có thể dùng Sandbox khi cần debug callback. |
| Email | Mail sandbox/mock; không gửi email thật nếu chưa cấu hình rõ. |
| OSRM | Mock hoặc endpoint local/dev; lỗi routing không được làm sai booking. |

### 8.2. Local seed

Local seed tối thiểu phải khớp Test Plan §6.2:

- Admin bootstrap active có MFA test, Admin thiếu quyền finance, Admin locked.
- Platform policy: SeatHold TTL 10 phút, refund default, commission 5%, payout T+3/no minimum/manual confirm.
- Catalog seed có version/checksum/review metadata.
- Operator A/B để test tenant, một approved, một pending/rejected/locked.
- Employee `TICKET_STAFF`, `DRIVER`, `SUPPORT_STAFF` có assigned/unassigned.
- Trip/fare/seat inventory đủ trạng thái cho checkout và concurrency test.
- Booking/payment/ticket/refund/payout/job/notification mẫu cho regression.

### 8.3. Local no-go

| No-go | Lý do |
| ----- | ----- |
| Dùng standalone MongoDB không transaction cho test SeatHold/payment success. | Không bắt được lỗi consistency P0. |
| Dùng provider production credential. | Rủi ro tiền thật/secret leak. |
| Bỏ qua seed Admin/MFA/RBAC/tenant. | Test auth/security không đại diện. |
| Tắt audit/log hoàn toàn khi debug. | Mất evidence cho luồng tiền/vé. |

---

## 9. CI và test automation standard

### 9.1. CI stages tối thiểu

| Stage | Nội dung | Gate |
| ----- | -------- | ---- |
| Static | Typecheck, lint, format/check convention nếu có. | Fail nếu lỗi. |
| Unit | Domain policy, state transition, amount/refund/commission calculation, DTO validation. | P0 unit pass. |
| Repository/DB | Index/unique/transaction/TTL/idempotency, tenant query. | P0 DB pass. |
| Integration | Auth/RBAC, SeatHold, booking, payment callback, ticket issuance, refund/payout/job. | P0 integration pass. |
| API contract | Response envelope, error code, idempotency header, OpenAPI artifact nếu đã tạo. | Contract mismatch fail. |
| Security | Tenant/IDOR/Guest lookup/rate limit/CSRF/log redaction/token leak. | P0 security fail là blocker. |

### 9.2. CI data rule

| Rule | Nội dung |
| ---- | -------- |
| CI-DATA-01 | Mỗi CI run dùng DB/queue/storage namespace riêng hoặc reset sạch. |
| CI-DATA-02 | Seed deterministic, không phụ thuộc nguồn dữ liệu ngoài runtime. |
| CI-DATA-03 | Provider mock phải mô phỏng success/fail/duplicate/mismatch cho VNPay callback. |
| CI-DATA-04 | Log test không được in secret/token/OTP/QR raw secret. |
| CI-DATA-05 | Artifact test report phải lưu requestId/jobId/paymentCode/bookingCode mẫu đủ debug, không chứa PII thật. |

---

## 10. Staging standard

### 10.1. Staging readiness

| Nhóm | Yêu cầu |
| ---- | ------- |
| HTTPS/domain | Staging dùng HTTPS; callback/return URL tách production. |
| Database | MongoDB replica set, migration/index rehearsal, seed UAT giả. |
| Queue/worker | Worker chạy thật với retry/dead job/manual review visibility. |
| Payment | VNPay Sandbox hoặc mock có transcript; không dùng tiền thật. |
| Notification | Email sandbox/provider test; in-app delivery record; SMS/push transactional disabled nếu chưa mở scope. |
| Storage | Private bucket/test bucket; signed URL TTL; scan gate mock/real theo config. |
| Audit/log | Audit append-only; log redaction; requestId correlation. |
| Security | Admin MFA, CSRF refresh web, rate limit, tenant denial, PII masking test được. |

### 10.2. Staging evidence bắt buộc

| Evidence | Khi nào cần |
| -------- | ----------- |
| Migration report | Mỗi lần chạy migration/index/seed staging. |
| P0 test report | Trước mỗi release candidate. |
| VNPay Sandbox transcript | Khi thay đổi payment/callback/reconciliation. |
| DB assertion | Khi thay đổi SeatHold, payment, ticket, ledger, payout, job. |
| Security evidence | Khi thay đổi IAM/RBAC/tenant/session/rate limit/upload. |
| Smoke test result | Sau deploy staging. |

---

## 11. Production readiness standard

Production chỉ được xem là sẵn sàng khi các nhóm dưới đây đạt và OP liên quan đã đóng.

| Nhóm | Baseline production readiness |
| ---- | ----------------------------- |
| Hosting target | Chốt nơi deploy, network, domain, TLS, callback route, scale/rollback model. |
| Secret manager | Chốt nơi lưu/rotate secret; không dùng file secret thủ công không kiểm soát. |
| MongoDB | Replica set, backup, restore rehearsal, index monitoring, capacity plan. |
| Redis/queue | Memory/eviction/persistence policy, dead job handling, alert. |
| Object storage | Private bucket, lifecycle, backup/cross-region nếu cần, signed URL, scan gate. |
| Payment | VNPay production onboarding, callback allowlist, secret rotation, reconciliation runbook. |
| Notification | Email provider production, template review, unsubscribe/preference rule, delivery alert. |
| Observability | Log/metric/alert stack, retention, dashboard, on-call/contact. |
| Security | Admin MFA, session/revoke, CSRF, rate limit, log redaction, vulnerability/dependency check. |
| Backup/restore | RPO/RTO chính thức, restore drill, backup access control. |
| Legal/operation | Policy, privacy, refund, support/hotline, contract/legal review before real sale. |

---

## 12. Database migration, index và seed

### 12.1. Migration rule

| ID | Rule |
| -- | ---- |
| MIG-01 | Migration phải xuất phát từ DB Design Approved; không suy diễn từ legacy code khi mâu thuẫn tài liệu. |
| MIG-02 | Migration phải kiểm MongoDB replica set/transaction support trước khi tạo index transaction-core. |
| MIG-03 | Unique/partial index cho SeatHold/payment/idempotency/tenant query phải tạo trước khi mở API write path. |
| MIG-04 | Migration snapshot/ledger/audit phải có rollback hoặc forward-fix plan, không phá dữ liệu đã ghi. |
| MIG-05 | Migration log phải ghi version, checksum, người chạy, thời điểm, environment và kết quả. |
| MIG-06 | Production migration cần backup trước khi chạy và smoke test sau khi chạy. |

### 12.2. Index readiness checklist

| Nhóm | Index/constraint phải có test |
| ---- | ----------------------------- |
| Tenant | `operatorId` query cho Operator/Employee scoped data. |
| SeatHold | Active hold/TripSeat invariant, TTL/index expiry, conflict query. |
| Booking lookup | `bookingCode`, `ticketCode`, contact verification lookup safe. |
| Payment callback | `paymentCode`, provider transaction id, callback digest/idempotency. |
| Ticket QR | Ticket code/token reference/hash lookup, revoke/invalid state. |
| Ledger/payout | Operator, period, ledger checkpoint, payout status. |
| Audit/job | Cursor/time/action/target filters; job lock/checkpoint/status. |

### 12.3. Seed package rule

| Seed | Rule |
| ---- | ---- |
| Admin bootstrap | One-time setup, MFA required, bootstrap secret rotated/disabled after activation. |
| Platform policy | SeatHold TTL 10 phút, refund default, commission 5%, payout T+3/no minimum/manual confirm. |
| Catalog | Admin Ops seed package có source metadata, checksum, reviewedBy/reviewedAt. |
| Role/permission | Actor roles và Employee role codes theo SRS/Security. |
| Test/UAT data | Tách khỏi production seed; không chứa dữ liệu cá nhân thật. |

---

## 13. Provider sandbox, mock và external callback

### 13.1. Payment provider

| Môi trường | Rule |
| ---------- | ---- |
| Local | VNPay adapter mock là mặc định; có thể dùng Sandbox riêng khi debug. |
| CI | Chỉ dùng mock deterministic. |
| Staging | Dùng VNPay Sandbox hoặc mock có transcript đủ success/fail/duplicate/mismatch. |
| Production | Chỉ bật khi credential/callback allowlist/secret rotation/runbook đã chốt. |

VNPay callback xử lý theo API/Security:

- Verify chữ ký/source.
- Kiểm `paymentCode`, booking/payment id, amount VND, provider transaction id, status.
- Lưu digest/safe payload; không lưu raw sensitive payload.
- Idempotent; mismatch vào `RECONCILING`/manual review.

### 13.2. Notification provider

| Kênh | V1 rule |
| ---- | ------- |
| In-app | Baseline V1, ghi delivery/state trong DB. |
| Email | Baseline V1 cho OTP/transactional notification qua sandbox/mock/local; production provider cần OP đóng. |
| SMS | Adapter boundary; SMS OTP ngoài phạm vi V1. |
| Push | Adapter boundary; không bật transactional launch nếu chưa mở scope. |

### 13.3. Storage/routing/bank payout

| Provider | Rule |
| -------- | ---- |
| Storage | S3-compatible private; MinIO local/dev; AWS S3 production baseline; signed URL và scan gate. |
| Routing | OSRM/routing qua adapter; timeout/fallback; provider lỗi không làm sai booking. |
| Bank payout | V1 chuyển khoản ngân hàng, Admin xác nhận thủ công; không có bank webhook baseline. |

---

## 14. Observability, logging, metric và alert

### 14.1. Structured log baseline

Mọi request/job/callback quan trọng phải có:

| Field | Rule |
| ----- | ---- |
| `requestId` | Sinh nếu client không gửi; truyền qua service/job/audit khi phù hợp. |
| `actorType`, `actorId` | Mask/omit nếu chưa auth hoặc nhạy cảm. |
| `operatorId` | Có khi xử lý tenant data. |
| `surface` | Web/mobile/admin/operator/employee nếu có. |
| `action` | Tên command/event/job. |
| `targetType`, `targetId` | Không lộ public/private id ngoài quyền trong log public. |
| `result`, `errorCode` | Safe code, không stack trace cho client. |
| `durationMs` | Cho API/job/provider call. |

### 14.2. Metric/event tối thiểu

| Nhóm | Metric/event |
| ---- | ------------ |
| API | Latency, error rate, status code, request count. |
| Auth/security | Login fail, OTP fail, lock, session revoke, tenant/RBAC denial, rate limit hit. |
| Marketplace | Search latency, trip detail latency, empty/error rate. |
| SeatHold | Hold success/conflict/expiry, active hold count, double-booking prevention failures. |
| Booking/payment/ticket | Booking conversion/expiry, callback success/fail/duplicate/reconciling, ticket issuance failure. |
| Refund/payout/ledger | Refund failed/manual review, payout ON_HOLD/FAILED/PAID, ledger mismatch. |
| Queue/job | Job duration, retry count, failed/dead/manual review, worker lag. |
| Notification | Delivery sent/failed/retrying/skipped by channel/template. |
| File/storage | Upload intent, scan pending/failed, signed URL access denied/expired. |
| Employee ops | Manifest latency, check-in latency, offline queued count, conflict count. |

### 14.3. Alert baseline

| Alert | Mức | Trigger logical |
| ----- | --- | --------------- |
| Seat double-booking invariant violation | P0 | Có dấu hiệu hai ticket hợp lệ cho cùng trip seat. |
| Payment callback spoof/mismatch burst | P0/P1 | Wrong signature/amount mismatch tăng bất thường. |
| Ticket issuance failure after payment success | P0 | Payment success nhưng ticket chưa phát hành sau ngưỡng. |
| Tenant/RBAC denial spike | P1 | Tăng bất thường, có thể là attack hoặc bug guard. |
| Job dead/manual review spike | P1 | Payment/refund/payout/notification/report job stuck. |
| Backup failure | P1 | Backup production fail hoặc restore drill fail. |
| Secret leak suspected | P0/P1 | Secret xuất hiện trong log/test artifact hoặc truy cập lạ. |
| Storage public-read detected | P0 | Bucket/file sensitive có public access. |

---

## 15. Backup, restore và retention operation

### 15.1. Backup priority

| Priority | Data |
| -------- | ---- |
| P0 | Booking, Ticket, Payment, Refund, EscrowLedger, Payout, AuditLog, KYC, BankAccount, Dispute. |
| P1 | Trip, TripSeat, SeatHold, Fare, PolicyVersion, CommissionRule, StateTransitionLog. |
| P2 | Notification, Support/Complaint, Review, Scorecard, BackgroundJob, ReportExport. |
| P3 | Derived/read model/cache có thể rebuild. |

### 15.2. Restore rule

| ID | Rule |
| -- | ---- |
| RESTORE-01 | Restore rehearsal bắt buộc trước production, theo NFR-AUDIT-02. |
| RESTORE-02 | Sau restore phải chạy consistency check cho booking-payment-ticket-seat-ledger-payout. |
| RESTORE-03 | Restore không được làm mất audit trail hoặc phá reference chain. |
| RESTORE-04 | Nếu restore partial làm lệch provider state, phải chạy reconciliation và manual review. |

### 15.3. Retention operation

Retention theo DB §18.1. Operation chỉ được siết chặt hơn baseline nếu Security/Legal yêu cầu; không được yếu hơn:

- Dữ liệu tiền/vé/audit/KYC/dispute giữ tối thiểu 10 năm, không hard delete production.
- Security event giữ tối thiểu 12 tháng.
- Provider callback safe payload giữ 24 tháng; digest giữ theo payment event.
- Report export object private hết hạn sau 30 ngày; metadata/export audit giữ 24 tháng.

---

## 16. Release, rollback và migration safety

### 16.1. Release gate Backend V1

| Gate | Điều kiện |
| ---- | --------- |
| REL-G1 | Tài liệu 01..05 và Security/Test baseline liên quan đã được reviewer chấp nhận theo `PROJECT-STATE`. |
| REL-G2 | ADR Proposed ảnh hưởng implementation đã được reviewer chốt hoặc ghi risk accept rõ. |
| REL-G3 | Migration/index/seed report pass ở staging. |
| REL-G4 | P0 unit/integration/API/security/concurrency test pass. |
| REL-G5 | VNPay Sandbox/mock transcript pass cho success/fail/duplicate/mismatch. |
| REL-G6 | Backup trước deploy production và restore rehearsal trước production release. |
| REL-G7 | Smoke test sau deploy pass; rollback plan sẵn. |

### 16.2. Rollback rule

| Tình huống | Rule |
| ---------- | ---- |
| Backend deploy lỗi không chạm migration phá vỡ | Rollback artifact/image version trước, giữ DB nếu backward compatible. |
| Migration lỗi trước khi bật traffic | Rollback/forward-fix theo migration plan; không mở API write path. |
| Migration lỗi sau khi có traffic | Dừng write path liên quan nếu cần, backup current state, forward-fix có audit. |
| Payment callback lỗi | Tạm chuyển payment vào `RECONCILING`/manual review; không issue ticket khi thiếu verify. |
| Queue/worker lỗi | Dừng worker lỗi, giữ job record, rerun theo checkpoint sau fix. |
| Notification lỗi | Retry/mark failed; không chặn ticket lookup. |

### 16.3. Smoke test sau deploy

| Nhóm | Smoke |
| ---- | ----- |
| Health/config | App health, DB/queue/storage connectivity, migration version. |
| Auth | Login smoke cho Admin/User test, token refresh/revoke safe. |
| Tenant | Operator A không đọc Operator B. |
| Checkout sandbox | Search/detail/SeatHold/create booking/create payment mock/sandbox. |
| Payment callback | Callback success/fail mock/sandbox idempotent. |
| Job | Worker nhận job test và ghi trạng thái. |
| Audit/log | RequestId/audit log xuất hiện, không chứa secret. |

---

## 17. Incident runbook baseline

### 17.1. Incident severity

| Mức | Ví dụ | Thái độ vận hành |
| --- | ----- | ---------------- |
| P0 | Bán trùng ghế, phát hành vé sai sau payment, ghi nhận tiền sai, lộ secret/PII lớn, bypass tenant/RBAC. | Dừng hoặc cô lập luồng lỗi, bảo toàn dữ liệu, thông báo owner ngay. |
| P1 | Payment callback lỗi diện rộng, worker payment/refund/payout stuck, không check-in diện rộng, backup fail production. | Kích hoạt runbook, manual review/reconciliation, cập nhật trạng thái dịch vụ. |
| P2 | Notification lỗi, report export chậm, search chậm cục bộ, storage scan pending lâu. | Theo dõi, retry, giảm tải, không làm mất dữ liệu core. |
| P3 | Lỗi UI/ops nhỏ, metric phụ thiếu, log không đầy đủ nhưng không ảnh hưởng tiền/vé/quyền. | Fix theo sprint/maintenance. |

### 17.2. Runbook P0/P1 tối thiểu

| Incident | Bước xử lý tối thiểu |
| -------- | -------------------- |
| Bán trùng ghế nghi ngờ | Dừng mở bán trip liên quan, export booking/ticket/tripSeat/SeatHold/audit, khóa payment mới nếu cần, tạo manual review/refund path. |
| Payment mismatch/spoof | Chặn callback không hợp lệ, chuyển affected payment `RECONCILING`, kiểm signature/amount/provider transaction, rerun reconciliation. |
| Ticket issuance failure | Dừng retry mù, kiểm payment success, booking/seat state, issue idempotent hoặc manual review; thông báo support nếu khách bị ảnh hưởng. |
| Tenant leak | Tắt endpoint/feature nếu cần, revoke session nghi ngờ, audit access, vá guard/repository scope, thông báo owner. |
| Secret leak | Revoke/rotate secret, tìm log/artifact chứa secret, invalidate session/token nếu cần, ghi incident/audit. |
| DB restore/migration failure | Đóng write path liên quan, snapshot current state, chạy rollback/forward-fix, kiểm consistency chain. |
| Queue worker stuck | Pause queue, kiểm dead/manual review, fix handler idempotency, rerun theo checkpoint. |

---

## 18. Operation checklist

### 18.1. Hằng ngày khi staging/production active

| Checklist | Mục tiêu |
| --------- | -------- |
| Payment/reconciliation queue | Không có payment stuck/mismatch chưa owner. |
| SeatHold expiry/job | Không có active hold quá TTL bất thường. |
| Dead/manual review jobs | Có owner và action cho job P0/P1. |
| Backup status | Backup gần nhất thành công. |
| Security anomaly | Login fail/rate limit/tenant denial spike được xem. |
| Storage scan/public access | Không có file sensitive public/pending quá ngưỡng. |

### 18.2. Trước mỗi release candidate

| Checklist | Mục tiêu |
| --------- | -------- |
| Migration/index dry-run | Pass ở staging hoặc môi trường tương đương. |
| P0/P1 test suite | Pass theo Test Plan §13. |
| Provider sandbox transcript | Có cho payment changes. |
| Rollback plan | Có version trước, migration plan và owner. |
| Config/secret review | Không dùng nhầm secret/env/callback URL. |
| Smoke test script/checklist | Sẵn sàng chạy sau deploy. |

### 18.3. Trước production release đầu tiên

| Checklist | Mục tiêu |
| --------- | -------- |
| Production target accepted | Hosting/network/domain/TLS/callback rõ. |
| Secret manager accepted | Secret storage/rotation/audit rõ. |
| Monitoring/alert accepted | Dashboard/alert/on-call/runbook rõ. |
| Backup/restore rehearsal | Đã test restore và consistency check. |
| Legal/operation readiness | Policy, privacy, refund, support/hotline, contract review. |
| Incident contacts | Owner P0/P1 và escalation rõ. |

---

## 19. Traceability, OP và rủi ro

### 19.1. Traceability nhanh

| Ops topic | Nguồn | Section |
| --------- | ----- | ------- |
| MongoDB replica set/migration/index | DB-OP-01, DB §19 | §6, §12 |
| Seed data | DB §19.2, Test §6.2 | §8, §12 |
| Provider sandbox/mock | SRS OQ-05, API §20, Test §6 | §13 |
| Auth/session/secret/log hygiene | Security §6/§11 | §7, §14 |
| Job/queue/reconciliation | SRS BR-62, HLD §12, DB §17 | §6, §9, §14, §17 |
| Backup/restore | SRS NFR-AUDIT, DB §18 | §15 |
| Release gate | Test §13 | §16 |
| Incident | SRS risk register, HLD risk register | §17 |

### 19.2. Open Points

| ID | Vấn đề | Đề xuất xử lý | Chặn |
| -- | ------ | ------------- | ---- |
| OPS-OP-01 | Production deployment target chưa chốt: VPS/Docker host/cloud container/platform khác. | Reviewer/DevOps chốt bằng ADR hoặc cập nhật 09 trước production. | Production release |
| OPS-OP-02 | Secret manager production chưa chốt. | Chọn secret manager và rotation policy trước production. | Production release |
| OPS-OP-03 | Monitoring/logging/alert stack cụ thể chưa chốt. | Chọn stack và alert rule; backend dùng vendor-neutral instrumentation từ đầu. | Production release |
| OPS-OP-04 | RPO/RTO chính thức chưa chốt. | Chốt theo business/legal trước production; trước đó vẫn phải backup/restore rehearsal. | Production release |
| OPS-OP-05 | Exact Node/npm/package manager/Docker image chưa chốt. | Pin khi bắt đầu implementation environment/CI. | CI reproducibility |
| OPS-OP-06 | Email provider production chưa chốt. | Dùng sandbox/mock ở local/CI/staging; chọn provider trước email transactional production. | Production email |

### 19.3. Rủi ro còn lại

| ID | Rủi ro | Mức | Giảm thiểu |
| -- | ------ | --- | ---------- |
| OPS-RISK-01 | Môi trường local/CI không dùng MongoDB transaction nên bỏ sót lỗi SeatHold/payment. | Cao | Fail fast khi test transaction-core không có replica set/transaction. |
| OPS-RISK-02 | Dùng nhầm provider production ở staging/local. | Rất cao | Tách secret/env/callback URL; environment validation; no production secret outside production. |
| OPS-RISK-03 | Migration tạo API trước index/constraint làm bán trùng hoặc leak tenant. | Rất cao | MIG-02/MIG-03, staging rehearsal, release gate. |
| OPS-RISK-04 | Thiếu observability vendor cụ thể làm chậm incident production. | Cao | Instrumentation vendor-neutral từ đầu; OPS-OP-03 chặn production. |
| OPS-RISK-05 | Backup có nhưng restore không dùng được. | Rất cao | Restore rehearsal và consistency check bắt buộc trước production. |

