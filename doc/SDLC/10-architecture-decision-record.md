# 10. Architecture Decision Record - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính    | Giá trị                            |
| ------------- | ---------------------------------- |
| Tên tài liệu  | Architecture Decision Record - ADR |
| Mã tài liệu   | 10-architecture-decision-record    |
| Dự án         | Hệ thống đặt vé xe khách           |
| Phiên bản     | v1.0                               |
| Trạng thái    | Approved                              |
| Người viết    | AI Agent                           |
| Người duyệt   | Nguyễn Hồng Khanh                  |
| Ngày tạo      | 11/05/2026                         |
| Ngày cập nhật | 13/05/2026                         |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật              | Nội dung thay đổi                                                                                                                                        |
| --------- | ---------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0      | 13/05/2026 | AI Agent                    | Viết lại ADR thành handoff quyết định Backend V1: phân biệt quyết định đã có nguồn Approved, quyết định triển khai được đề xuất, OP còn chặn production. |
| v0.5      | 13/05/2026 | AI Agent, Nguyễn Hồng Khanh | Chốt ADR-003 theo DB-OP-01: operational database target V1 dùng MongoDB replica set.                                                                     |
| v0.4      | 12/05/2026 | AI Agent                    | Đồng bộ quyết định LLD/HLD: SeatHold DB-authoritative hybrid, S3-compatible storage và offline Employee giới hạn.                                        |
| v0.3      | 12/05/2026 | AI Agent                    | Chuyển ADR-009 thành khung đánh giá tech stack cho rebuild; hạ ADR-002..004 về Deferred.                                                                 |
| v0.2      | 12/05/2026 | AI Agent                    | Bổ sung ADR-009 cho bảng tech stack đề xuất.                                                                                                             |
| v0.1      | 11/05/2026 | AI Agent                    | Tạo bản nháp ADR.                                                                                                                                        |

### 1.3. Trạng thái sử dụng

Tài liệu này là bản `Draft` dùng để gom quyết định kiến trúc cho Backend V1. AI Agent KHÔNG tự chuyển trạng thái tài liệu sang `Approved`.

ADR có trạng thái `Accepted` trong tài liệu này chỉ áp dụng khi quyết định đó đã được chốt trong tài liệu Approved hoặc đã được ghi nhận đóng trong `PROJECT-STATE`. Các ADR có trạng thái `Proposed` là khuyến nghị triển khai cần người duyệt xác nhận trước khi dùng làm quyết định cuối cùng.

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Quy ước ADR
4. Nguồn đầu vào
5. Danh sách quyết định
6. ADR chi tiết
7. Backend V1 implementation decision package
8. Open Points và rủi ro còn lại

---

## 3. Quy ước ADR

| Trường     | Ý nghĩa                                                         |
| ---------- | --------------------------------------------------------------- |
| ID         | Mã quyết định `ADR-NNN`.                                        |
| Trạng thái | `Proposed`, `Accepted`, `Deferred`, `Superseded`, `Deprecated`. |
| Bối cảnh   | Vấn đề cần quyết định.                                          |
| Quyết định | Phương án được chọn hoặc đề xuất.                               |
| Hệ quả     | Tác động tích cực, tiêu cực và giới hạn áp dụng.                |
| Nguồn      | SRS/HLD/LLD/DB/API/Security/Test/PROJECT-STATE liên quan.       |

Quy tắc đọc trạng thái:

- `Accepted`: quyết định đã có nguồn Approved hoặc đã được reviewer xử lý trong `PROJECT-STATE`.
- `Proposed`: đủ rõ để reviewer xem xét, chưa phải quyết định bắt buộc.
- `Deferred`: chưa cần chốt cho Backend V1 hoặc chưa đủ nguồn.
- `Superseded`: đã được thay thế bởi ADR khác.

---

## 4. Nguồn đầu vào

| Nguồn                                      | Trạng thái theo `PROJECT-STATE` | Vai trò trong ADR                                                                        |
| ------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------- |
| `01-srs-he-thong-dat-ve-xe-khach.md` v1.20 | Approved                        | Nguồn nghiệp vụ, NFR, BR, OQ/MQ đã chốt, dependency ban đầu.                             |
| `02-hld-he-thong-dat-ve-xe-khach.md` v1.13 | Approved                        | Nguồn kiến trúc modular core, boundary, adapter, queue/job/realtime, deployment handoff. |
| `03-lld-he-thong-dat-ve-xe-khach.md` v1.2  | Approved                        | Nguồn logical module pattern, pipeline, idempotency, thứ tự triển khai Backend V1.       |
| `04-database-design.md` v1.4               | Approved                        | Nguồn MongoDB replica set, transaction/index/TTL, retention, migration/seed.             |
| `05-api-specification.md` v1.1             | Approved                        | Nguồn API contract, idempotency, webhook, realtime, job/audit API.                       |
| `07-security-permission-design.md` v1.0    | Approved                        | Nguồn auth/session/RBAC/tenant/MFA/rate limit/security baseline.                         |
| `08-test-plan-acceptance-criteria.md` v1.0 | Approved                        | Nguồn test gate, seed data, evidence, release readiness.                                 |
| `context/DOMAIN-MAP.md`                    | Current                         | Bản đồ target module theo rewrite strategy.                                              |
| `context/PROJECT-STATE.md`                 | Current                         | Nguồn trạng thái quyết định, blocker và OP.                                              |

Không dùng source code hiện tại làm nguồn quyết định trong ADR này. Repo hiện có chỉ là legacy skeleton theo chiến lược rewrite đã chốt.

---

## 5. Danh sách quyết định

| ID      | Tiêu đề                                                                                | Trạng thái | Blocking scope       | Nguồn                            |
| ------- | -------------------------------------------------------------------------------------- | ---------- | -------------------- | -------------------------------- |
| ADR-001 | Managed marketplace là mô hình sản phẩm V1                                             | Accepted   | Toàn hệ thống        | SRS MQ-05, PROJECT-STATE §2-3    |
| ADR-002 | Backend V1 dùng modular application core, không microservice baseline                  | Accepted   | Backend V1           | HLD-DEC-01, LLD §6               |
| ADR-003 | Operational database target là MongoDB replica set                                     | Accepted   | Backend V1 data      | DB-OP-01, DB §12/§19             |
| ADR-004 | SeatHold dùng DB-authoritative hybrid                                                  | Accepted   | Transaction core     | HLD-DEC-16, LLD-OP-02, DB §13    |
| ADR-005 | Payment flow dùng escrow trước payout Operator                                         | Accepted   | Payment/finance      | SRS MQ-01, BR-30..33             |
| ADR-006 | External provider đi qua adapter boundary                                              | Accepted   | Integration          | HLD-DEC-04/05/14, BR-63          |
| ADR-007 | Mobile một codebase Expo cho User và Employee                                          | Accepted   | Mobile V1            | SRS OQ-10                        |
| ADR-008 | Admin là arbiter cuối cùng trong dispute                                               | Accepted   | Trust/finance        | SRS MQ-03, BR-51                 |
| ADR-009 | Tech stack evaluation framework đã hoàn tất vai trò rebuild                            | Superseded | ADR management       | ADR-OQ-05, ADR-010..015          |
| ADR-010 | Backend framework target đề xuất: NestJS + TypeScript modular monolith                 | Proposed   | Code convention      | SRS DP-01, HLD-DEC-01, LLD §6    |
| ADR-011 | Cache / queue / lock target đề xuất: Redis-compatible + queue adapter                  | Proposed   | Worker/scale         | SRS DP-01/DP-04, HLD §12, DB §17 |
| ADR-012 | Realtime contract: WebSocket `/realtime`, REST là source of truth                      | Accepted   | Realtime API         | API-OP-02, Security §13.3        |
| ADR-013 | API Spec là source contract; OpenAPI 3.1 và SDK là artifact derived                    | Accepted   | Contract tooling     | API-OP-05, Test §5.3             |
| ADR-014 | Object storage target: S3-compatible, AWS S3 production, MinIO local/dev               | Accepted   | File/KYC/export      | HLD-OQ-01, LLD-OP-04             |
| ADR-015 | Observability baseline là vendor-neutral instrumentation + structured log              | Proposed   | Production readiness | SRS NFR-MAINT-03, HLD §13/§14    |
| ADR-016 | Deployment target cho production chưa chốt; local/CI/staging dùng containerized parity | Proposed   | Ops/prod             | HLD-OQ-03, HLD §14, Test §6      |

---

## 6. ADR chi tiết

### ADR-001. Managed marketplace là mô hình sản phẩm V1

| Trường     | Nội dung                                                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Accepted                                                                                                                                                                    |
| Bối cảnh   | SRS đã chốt Platform là managed marketplace ba bên: User/Guest, Operator/Employee và Platform/Admin.                                                                        |
| Quyết định | V1 triển khai ba lớp dịch vụ: Marketplace layer, Operator OS layer và Platform admin layer. Platform không sở hữu xe, không thuê tài xế và không trực tiếp vận hành chuyến. |
| Hệ quả     | Backend phải có tenant boundary, KYC, escrow, payout, dispute, audit, data isolation và permission matrix rõ.                                                               |
| Nguồn      | SRS MQ-05, SRS §4, DOMAIN-MAP §1, PROJECT-STATE §2.                                                                                                                         |

### ADR-002. Backend V1 dùng modular application core, không microservice baseline

| Trường     | Nội dung                                                                                                                                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Accepted                                                                                                                                                                                                                                       |
| Bối cảnh   | HLD yêu cầu boundary nghiệp vụ rõ và không yêu cầu microservice ở V1.                                                                                                                                                                          |
| Quyết định | Backend V1 dùng một application backend trung tâm theo modular application core. Module được tổ chức theo capability, có delivery handler, application service, domain policy, repository port, adapter port, event/job handler và audit hook. |
| Hệ quả     | Ưu tiên consistency, transaction point và testability. Tách scale sau này cho search, booking, payment, notification, reporting, audit khi có số liệu vận hành.                                                                                |
| Nguồn      | HLD §7.1, HLD-DEC-01, LLD §6.1, LLD §15.                                                                                                                                                                                                       |

### ADR-003. Operational database target là MongoDB replica set

| Trường     | Nội dung                                                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Accepted                                                                                                                                                                     |
| Bối cảnh   | SRS chốt audit/reporting dùng MongoDB; DB-OP-01 đã đóng.                                                                                                                     |
| Quyết định | Operational database target cho Backend V1 là MongoDB replica set. DB Design được phép dùng transaction, conditional update, unique/partial index và TTL index theo MongoDB. |
| Hệ quả     | Local/test/staging phải hỗ trợ transaction. Migration phải kiểm replica set và index trước khi bật API ghi dữ liệu rủi ro cao.                                               |
| Nguồn      | SRS OQ-14..15, DB-OP-01, DB §12, DB §19.                                                                                                                                     |

### ADR-004. SeatHold dùng DB-authoritative hybrid

| Trường     | Nội dung                                                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Accepted                                                                                                                                                        |
| Bối cảnh   | Rủi ro bán trùng ghế là P0; lock/cache không được là nguồn đúng sai cuối cùng.                                                                                  |
| Quyết định | DB giữ invariant cuối cùng cho active hold / booked seat. Lock service nếu có chỉ là lớp phụ trợ giảm contention. SeatHold TTL mặc định 10 phút ở cấp Platform. |
| Hệ quả     | Transaction core phải test concurrency. TTL cleanup chỉ hỗ trợ; mọi mutation phải kiểm `status` và `expiresAt` tại DB.                                          |
| Nguồn      | SRS BR-01..03, HLD-DEC-16, LLD-OP-02, DB §13, Test §9.3.                                                                                                        |

### ADR-005. Payment flow dùng escrow trước payout Operator

| Trường     | Nội dung                                                                                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Accepted                                                                                                                                                                      |
| Bối cảnh   | Managed marketplace cần ghi nhận tiền giữa User/Guest và Operator qua Platform.                                                                                               |
| Quyết định | Payment online thành công ghi vào escrow ledger. Payout cho Operator xét T+3 sau Trip `COMPLETED`, không ngưỡng tối thiểu, chuyển khoản ngân hàng và Admin xác nhận thủ công. |
| Hệ quả     | Cần ledger append-only typed, commission snapshot, refund/adjustment/reconciliation và audit đầy đủ.                                                                          |
| Nguồn      | SRS MQ-01, OQ-16, OQ-18, BR-30..33, DB §15.                                                                                                                                   |

### ADR-006. External provider đi qua adapter boundary

| Trường     | Nội dung                                                                                                                                                                                                                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Accepted                                                                                                                                                                                                                                                                                                         |
| Bối cảnh   | Payment, notification, routing, storage và payout có thể thay provider.                                                                                                                                                                                                                                          |
| Quyết định | Domain core chỉ phụ thuộc adapter interface: `PaymentProvider`, `EmailProvider`, `SmsProvider`, `PushProvider`, `RoutingProvider`, `FileStorageProvider`, `BankPayoutChannel`. VNPay Sandbox là provider payment đầu tiên; email/in-app là notification baseline V1; SMS/push chỉ giữ adapter nếu chưa mở scope. |
| Hệ quả     | Provider SDK không lan vào service nghiệp vụ. Callback/webhook phải verify, idempotent và lưu safe payload.                                                                                                                                                                                                      |
| Nguồn      | SRS OQ-05/OQ-09, BR-63, HLD §7.5, HLD §13.                                                                                                                                                                                                                                                                       |

### ADR-007. Mobile một codebase Expo cho User và Employee

| Trường     | Nội dung                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Trạng thái | Accepted                                                                                                                                                                 |
| Bối cảnh   | SRS OQ-10 đã chốt một codebase mobile cho User và Employee.                                                                                                              |
| Quyết định | Mobile V1 dùng một codebase Expo/React Native theo SRS dependency, tách session, navigation, permission và flow theo actor. Guest checkout/lookup thuộc Web Marketplace. |
| Hệ quả     | Backend phải hỗ trợ `X-Actor-Surface`, mobile secure storage, Employee assignment/offline sync và force revoke khi role/assignment đổi.                                  |
| Nguồn      | SRS OQ-10, HLD §6.4, Security §6, API §9.1.                                                                                                                              |

### ADR-008. Admin là arbiter cuối cùng trong dispute

| Trường     | Nội dung                                                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Accepted                                                                                                                           |
| Bối cảnh   | Tranh chấp refund/chất lượng dịch vụ cần bên quyết định cuối cùng.                                                                 |
| Quyết định | Admin Platform là arbiter cuối cùng, có thể quyết định refund, không refund, đổi vé hoặc phương án khác theo policy và bằng chứng. |
| Hệ quả     | Mọi quyết định dispute/refund thủ công cần RBAC, re-auth/MFA nếu thuộc nhóm nhạy cảm, reason, audit và notification bắt buộc.      |
| Nguồn      | SRS MQ-03, BR-35, BR-50..51, Security §9.                                                                                          |

### ADR-009. Tech stack evaluation framework đã hoàn tất vai trò rebuild

| Trường     | Nội dung                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Trạng thái | Superseded                                                                                                                                 |
| Bối cảnh   | ADR v0.3 dùng ADR-009 để tránh biến hiện trạng repo thành target implementation khi HLD/LLD/DB/API/Security chưa đủ rõ.                    |
| Quyết định | ADR-009 được thay thế bởi ADR-010..016. Các quyết định có nguồn Approved được tách khỏi các quyết định kỹ thuật còn cần reviewer xác nhận. |
| Hệ quả     | Backend có thể dùng ADR-010..016 để biết phần nào đã chốt, phần nào là proposed và phần nào chỉ chặn production.                           |
| Nguồn      | PROJECT-STATE ADR-OQ-05, HLD §14.2, LLD §16.                                                                                               |

### ADR-010. Backend framework target đề xuất: NestJS + TypeScript modular monolith

| Trường     | Nội dung                                                                                                                                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Proposed                                                                                                                                                                                                                                       |
| Bối cảnh   | SRS dependency ghi Backend NestJS, MongoDB, Redis, Bull queue, Socket.IO, JWT, Helmet; HLD/LLD đã chốt modular application core nhưng chưa tái xác nhận framework target.                                                                      |
| Quyết định | Đề xuất giữ NestJS + TypeScript cho Backend V1, triển khai theo modular monolith/capability modules của HLD/LLD. Controller/delivery handler không chứa business rule phức tạp; service điều phối use case; policy/repository/adapter tách rõ. |
| Hệ quả     | Giảm rủi ro rewrite vì khớp dependency SRS và target module map. Cần reviewer xác nhận trước khi coi NestJS là target chính thức thay vì chỉ là hiện trạng repo.                                                                               |
| Nguồn      | SRS DP-01, HLD §7.1, LLD §6.1, DOMAIN-MAP §1.                                                                                                                                                                                                  |

### ADR-011. Cache / queue / lock target đề xuất: Redis-compatible + queue adapter

| Trường     | Nội dung                                                                                                                                                                                                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Proposed                                                                                                                                                                                                                                                                           |
| Bối cảnh   | SRS yêu cầu lock/cache/queue cho SeatHold, payment callback, notification, reconciliation, report; DB đã giữ invariant cuối cùng cho SeatHold.                                                                                                                                     |
| Quyết định | Đề xuất dùng Redis-compatible backend cho cache ngắn hạn, rate-limit state, optional lock helper và queue backing store; queue implementation đi qua adapter/job abstraction. Nếu reviewer giữ dependency SRS DP-01, Bull/BullMQ-compatible queue là lựa chọn triển khai mặc định. |
| Hệ quả     | Worker phải có job record trong DB, idempotency, lock/checkpoint/retry. Redis/queue không thay thế DB transaction cho tiền/vé/ghế.                                                                                                                                                 |
| Nguồn      | SRS DP-01, DP-04, BR-62, HLD §12, LLD §7.5, DB §17.                                                                                                                                                                                                                                |

### ADR-012. Realtime contract: WebSocket `/realtime`, REST là source of truth

| Trường     | Nội dung                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Trạng thái | Accepted                                                                                                                                                                                   |
| Bối cảnh   | API-OP-02 đã đóng: V1 dùng WebSocket `/realtime`, server-authorized topics và REST polling fallback.                                                                                       |
| Quyết định | Realtime event chỉ dùng để invalidate/update UI. Client phải query REST để xác nhận state cuối cùng cho payment, ticket, booking, refund, job.                                             |
| Hệ quả     | Event payload tối thiểu, scoped theo actor/tenant/assignment, không chứa PII/tài chính ngoài quyền. Implementation library cụ thể có thể theo ADR-010/011 hoặc quyết định frontend/mobile. |
| Nguồn      | API-OP-02, API §21, Security §13.3, HLD §12.                                                                                                                                               |

### ADR-013. API Spec là source contract; OpenAPI 3.1 và SDK là artifact derived

| Trường     | Nội dung                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Accepted                                                                                                                                          |
| Bối cảnh   | API-OP-05 đã đóng để tránh lẫn API Spec với Swagger/generated artifact.                                                                           |
| Quyết định | `05-api-specification.md` là source contract nghiệp vụ. OpenAPI 3.1, SDK/types và contract tests là artifact sinh/duy trì từ API Spec sau review. |
| Hệ quả     | Nếu implementation đổi endpoint/DTO/error/state, phải cập nhật API Spec trước hoặc cùng PR. Generated SDK không được tự định nghĩa rule mới.      |
| Nguồn      | API-OP-05, API §3.3, Test §5.3.                                                                                                                   |

### ADR-014. Object storage target: S3-compatible, AWS S3 production, MinIO local/dev

| Trường     | Nội dung                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Accepted                                                                                                                                                                            |
| Bối cảnh   | HLD-OQ-01 và LLD-OP-04 đã đóng.                                                                                                                                                     |
| Quyết định | File/KYC/attachment/report export dùng S3-compatible storage qua `FileStorageProvider`; production baseline AWS S3 private bucket; local/dev MinIO; DB chỉ lưu metadata/object key. |
| Hệ quả     | Không dùng public-read. Signed URL, scan gate, type/size allowlist, retention và access audit phải triển khai theo DB/Security/Operation.                                           |
| Nguồn      | HLD-OQ-01, HLD-DEC-14, LLD-OP-04, DB §16, Security §12.                                                                                                                             |

### ADR-015. Observability baseline là vendor-neutral instrumentation + structured log

| Trường     | Nội dung                                                                                                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Proposed                                                                                                                                                                                                                                                                                                                            |
| Bối cảnh   | SRS/HLD yêu cầu logging, monitoring, alert nhưng chưa chốt stack vendor. Backend vẫn cần instrumentation từ đầu để test/incident không bị mù.                                                                                                                                                                                       |
| Quyết định | Đề xuất backend ghi structured log có `requestId`, actor/scope safe, error code safe payload; metric/event tối thiểu cho search, SeatHold, payment, ticket, refund, payout, job, notification, check-in, tenant/security denial. Instrumentation nên tách adapter để sau này nối Prometheus/Grafana, OpenTelemetry hoặc stack khác. |
| Hệ quả     | Không chặn code backend vì không phụ thuộc vendor. Chặn production nếu chưa chốt nơi lưu log/metric, alert rule, retention và on-call/runbook.                                                                                                                                                                                      |
| Nguồn      | SRS NFR-MAINT-03, NFR-AUDIT-03, HLD §13, Security §14, Test §6.3.                                                                                                                                                                                                                                                                   |

### ADR-016. Deployment target production chưa chốt; local/CI/staging dùng containerized parity

| Trường     | Nội dung                                                                                                                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái | Proposed                                                                                                                                                                                                             |
| Bối cảnh   | HLD chuyển production deployment target, secret manager, monitoring/logging/alert stack và incident runbook xuống Deployment & Operation.                                                                            |
| Quyết định | Đề xuất Backend V1 local/CI/staging dùng môi trường containerized parity cho MongoDB replica set, Redis-compatible backend, object storage local/staging, provider mock/sandbox. Production target cụ thể vẫn là OP. |
| Hệ quả     | Backend có thể phát triển và test local/CI/staging. Không release production khi chưa chốt production hosting, secret manager, monitoring/alert, backup/restore rehearsal và incident runbook.                       |
| Nguồn      | HLD-OQ-03, HLD §14, DB §19, Test §6/§13.                                                                                                                                                                             |

---

## 7. Backend V1 implementation decision package

### 7.1. Phần đã chốt đủ để code nghiệp vụ

| Chủ đề            | Quyết định dùng khi code                                             | ADR         |
| ----------------- | -------------------------------------------------------------------- | ----------- |
| Product model     | Managed marketplace, ba service layer.                               | ADR-001     |
| Backend shape     | Modular application core, monolith V1.                               | ADR-002     |
| Database          | MongoDB replica set, transaction/index/TTL.                          | ADR-003     |
| SeatHold          | DB-authoritative hybrid, TTL 10 phút.                                | ADR-004     |
| Payment/finance   | VNPay Sandbox qua adapter, escrow ledger, payout T+3 manual confirm. | ADR-005/006 |
| External boundary | Adapter cho payment/notification/routing/storage/payout.             | ADR-006     |
| Realtime          | WebSocket `/realtime`; REST source of truth.                         | ADR-012     |
| Contract          | API Spec source, OpenAPI/SDK derived.                                | ADR-013     |
| File storage      | S3-compatible; AWS S3 production, MinIO local/dev.                   | ADR-014     |

### 7.2. Phần đề xuất để reviewer chốt trước khi bắt đầu rewrite source

| Chủ đề                  | Đề xuất mặc định                                                                   | Lý do                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Backend framework       | NestJS + TypeScript modular monolith.                                              | Khớp SRS DP-01 và HLD/LLD modular application core.          |
| Cache/queue             | Redis-compatible backend + Bull/BullMQ-compatible queue adapter nếu giữ DP-01.     | Khớp SRS DP-01/DP-04; DB vẫn là source of truth.             |
| Realtime implementation | WebSocket gateway tương thích `/realtime`; library cụ thể theo framework.          | API/Security đã chốt contract, chưa cần vendor trong domain. |
| Observability           | Structured log + metric/event adapter, vendor-neutral.                             | Đủ code hook từ đầu, chưa khóa stack production.             |
| Local/staging runtime   | Containerized services: MongoDB replica set, Redis, MinIO, provider mocks/sandbox. | Đủ chạy integration/concurrency/security tests.              |

### 7.3. Điều kiện không được vượt khi code

| ID          | Rule                                                                                    |
| ----------- | --------------------------------------------------------------------------------------- |
| ADR-GATE-01 | Không dùng legacy source làm source of truth khi mâu thuẫn với tài liệu Approved.       |
| ADR-GATE-02 | Không phát hành ticket nếu payment chưa verify hoặc booking/seat state không hợp lệ.    |
| ADR-GATE-03 | Không để Redis/queue/event thay thế DB invariant cho SeatHold, payment, ticket, ledger. |
| ADR-GATE-04 | Không expose provider raw payload, token, OTP, QR raw secret, payment sensitive data.   |
| ADR-GATE-05 | Không tạo API/DTO/error/state mới ngoài API Spec nếu chưa cập nhật tài liệu.            |
| ADR-GATE-06 | Không hard delete dữ liệu tiền/vé/KYC/dispute/audit trong production.                   |
| ADR-GATE-07 | Không release production khi ADR-OP-03/04 chưa đóng.                                    |

---

## 8. Open Points và rủi ro còn lại

### 8.1. Open Points

| ID        | Vấn đề                                                                                                                                           | Đề xuất xử lý                                                                     | Chặn                             | Trạng thái         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | -------------------------------- | ------------------ |
| ADR-OP-01 | Reviewer cần xác nhận ADR-010 nếu muốn coi NestJS + TypeScript là target implementation chính thức, không chỉ là dependency/candidate trong SRS. | Chấp nhận ADR-010 hoặc mở lựa chọn framework trước khi rewrite source.            | Code convention / source rewrite | Xử lý theo đề xuất |
| ADR-OP-02 | Reviewer cần xác nhận ADR-011 nếu muốn chốt Redis + Bull/BullMQ-compatible queue làm backend queue/cache target.                                 | Chấp nhận ADR-011 hoặc chọn queue/cache khác có cùng capability.                  | Worker/queue implementation      | Xử lý theo đề xuất |
| ADR-OP-03 | Production deployment target, domain/callback routing, secret manager, monitoring/alert stack chưa chốt.                                         | Chốt trong `09-deployment-operation-standard.md` hoặc ADR riêng trước production. | Production release               | Xử lý theo đề xuất |
| ADR-OP-04 | Exact Node.js/npm/package manager/Docker image version chưa chốt trong tài liệu Approved.                                                        | Pin bằng ADR/Operation khi bắt đầu implementation environment.                    | CI/reproducibility               | Xử lý theo đề xuất |
| ADR-OP-05 | Email provider production cụ thể chưa chốt; V1 chỉ có email/in-app baseline và sandbox/mock cho test.                                            | Chọn provider khi chuẩn bị staging/production notification thật.                  | Transactional email production   | Xử lý theo đề xuất |

### 8.2. Rủi ro còn lại

| ID          | Rủi ro                                                                  | Mức        | Giảm thiểu                                                                            |
| ----------- | ----------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| ADR-RISK-01 | Dùng ADR-010/011 như quyết định Accepted khi reviewer chưa xác nhận.    | Cao        | Gắn `Proposed`, yêu cầu reviewer đóng OP trước rewrite source chính thức.             |
| ADR-RISK-02 | Chọn queue/cache sai làm job chạy trùng hoặc mất retry.                 | Cao        | Job record/idempotency/checkpoint lưu DB; queue chỉ là transport thực thi.            |
| ADR-RISK-03 | Không pin runtime làm CI/staging lệch local.                            | Trung bình | ADR-OP-04 phải đóng trước khi CI chính thức.                                          |
| ADR-RISK-04 | Observability vendor chưa chốt làm thiếu alert production.              | Cao        | Code instrumentation vendor-neutral ngay; chốt stack/alert trong 09 trước production. |
| ADR-RISK-05 | Production target chưa chốt nhưng backend code giả định hạ tầng cụ thể. | Cao        | Backend chỉ phụ thuộc env/config/adapter; không hard-code hosting/secret manager.     |
