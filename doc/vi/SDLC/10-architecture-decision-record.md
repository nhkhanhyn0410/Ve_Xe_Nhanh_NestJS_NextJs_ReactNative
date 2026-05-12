# 10. Architecture Decision Record - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| Tên tài liệu | Architecture Decision Record - ADR |
| Mã tài liệu  | 10-architecture-decision-record  |
| Dự án        | Hệ thống đặt vé xe khách         |
| Phiên bản    | v0.3                             |
| Trạng thái   | Draft                            |
| Người viết   | AI Agent                         |
| Người duyệt  | Nguyễn Hồng Khanh                |
| Ngày tạo     | 11/05/2026                       |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                         |
| --------- | ---------- | -------------- | ----------------------------------------- |
| v0.3      | 12/05/2026 | AI Agent       | Chuyển ADR-009 thành khung đánh giá tech stack cho rebuild; hạ ADR-002..004 về Deferred |
| v0.2      | 12/05/2026 | AI Agent       | Bổ sung ADR-009 cho bảng tech stack đề xuất |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp ADR                          |

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Quy ước ADR
4. Danh sách quyết định
5. ADR chi tiết
6. Open Questions / TBD

---

## 3. Quy ước ADR

| Trường | Ý nghĩa |
| ------ | ------- |
| ID | Mã quyết định `ADR-NNN` |
| Trạng thái | Proposed / Deferred / Accepted / Superseded / Deprecated |
| Bối cảnh | Vấn đề cần quyết định |
| Quyết định | Phương án được chọn |
| Hệ quả | Tác động tích cực/tiêu cực |
| Nguồn | SRS/HLD/OQ liên quan |

AI Agent không tự chuyển ADR sang `Accepted` nếu chưa có người duyệt xác nhận. Với tech stack trong giai đoạn rebuild tài liệu, ADR phải phân biệt rõ `hiện trạng repo`, `candidate`, `ràng buộc từ SRS/HLD` và `target decision`; không được gọi candidate là baseline đã chọn.

---

## 4. Danh sách quyết định

| ID | Tiêu đề | Trạng thái | Nguồn |
| -- | ------- | ---------- | ----- |
| ADR-001 | Managed marketplace là mô hình sản phẩm v1 | Proposed | SRS MQ-05 |
| ADR-002 | Backend framework / architecture target cho rebuild | Deferred | SRS DP-01, HLD-DEC-01, ADR-OQ-05 |
| ADR-003 | Operational database target cho rebuild | Deferred | SRS DP-01, OQ-14..15, ADR-OQ-05 |
| ADR-004 | Cache / queue / lock target cho rebuild | Deferred | SRS DP-04, ADR-OQ-05 |
| ADR-005 | Payment flow dùng escrow trước payout Operator | Proposed | SRS MQ-01 |
| ADR-006 | Payment/notification/storage dùng adapter boundary | Proposed | HLD-DEC-04, HLD-DEC-05, HLD-DEC-14 |
| ADR-007 | Mobile dùng một codebase Expo cho User và Employee | Proposed | SRS OQ-10 |
| ADR-008 | Admin là arbiter cuối cùng trong dispute | Proposed | SRS MQ-03 |
| ADR-009 | Khung đánh giá tech stack cho rebuild tài liệu | Proposed | SRS DP-01..04, TECH-STACK, HLD §14 |

---

## 5. ADR chi tiết

### ADR-001. Managed marketplace là mô hình sản phẩm v1

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Proposed |
| Bối cảnh | Hệ thống cần xác định rõ Platform là marketplace, Operator là đơn vị vận tải, User là khách mua vé. |
| Quyết định | V1 theo mô hình managed marketplace gồm Marketplace layer, Operator OS layer và Platform admin layer. |
| Hệ quả | Platform cần KYC, escrow, payout, dispute, audit, data isolation; không trực tiếp vận hành xe. |
| Nguồn | SRS MQ-05, SRS §4-6 |

### ADR-002. Backend framework / architecture target cho rebuild

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Deferred |
| Bối cảnh | Repo hiện có backend NestJS với module pattern; HLD-DEC-01 chốt hướng modular application core, nhưng rebuild tài liệu chưa nên tự động biến hiện trạng repo thành target stack. |
| Quyết định | Chưa chốt target backend framework. NestJS modular monolith là hiện trạng / candidate cần reviewer xác nhận theo ADR-OQ-05. |
| Hệ quả | LLD có thể mô tả boundary nghiệp vụ theo capability, nhưng không được coi framework target là `Accepted` cho đến khi reviewer chốt. |
| Nguồn | SRS DP-01, HLD-DEC-01, ADR-OQ-05 |

### ADR-003. Operational database target cho rebuild

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Deferred |
| Bối cảnh | Repo hiện dùng Mongoose + MongoDB; SRS DP-01, OQ-14 và OQ-15 đang ghi MongoDB cho operational data, audit và reporting. Trong rebuild cần xác nhận giữ quyết định này hay mở lại lựa chọn dữ liệu. |
| Quyết định | Chưa chốt target operational database ở ADR. MongoDB là hiện trạng / candidate có nguồn từ SRS và repo, cần reviewer xác nhận theo ADR-OQ-05. |
| Hệ quả | DB Design phải giữ `TBD` ở các chi tiết phụ thuộc engine nếu target database chưa được xác nhận, đặc biệt transaction, atomic update, index, TTL, migration và reporting. |
| Nguồn | SRS DP-01, OQ-14, OQ-15, `TECH-STACK.md`, ADR-OQ-05 |

### ADR-004. Cache / queue / lock target cho rebuild

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Deferred |
| Bối cảnh | Repo hiện có Redis + Bull; SRS DP-04 yêu cầu Redis hoặc lock service tương đương cho seat locking, chống double booking và chống spam thanh toán. |
| Quyết định | Chưa chốt target cache / queue / lock. Redis + Bull là hiện trạng / candidate, không phải baseline đã chọn. |
| Hệ quả | LLD và DB Design phải chốt rõ SeatHold lock strategy, queue engine, retry, dead-letter, timeout và monitoring trước khi code luồng booking/payment. |
| Nguồn | SRS DP-04, `TECH-STACK.md`, ADR-OQ-05 |

### ADR-005. Payment flow dùng escrow trước payout Operator

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Proposed |
| Bối cảnh | Managed marketplace cần bảo đảm giao dịch giữa User và Operator. |
| Quyết định | Payment thành công ghi vào escrow ledger của Platform, payout cho Operator theo T+N sau đối soát. |
| Hệ quả | Cần ledger, commission, payout, reconciliation và audit đầy đủ. |
| Nguồn | SRS MQ-01 |

### ADR-006. Payment/notification/storage dùng adapter boundary

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Proposed |
| Bối cảnh | Provider cụ thể chưa được chốt trong SRS. |
| Quyết định | Dùng adapter boundary cho payment, email, SMS, push, object storage. |
| Hệ quả | Giảm vendor lock-in; cần contract adapter rõ ở LLD/API. |
| Nguồn | HLD-DEC-04, HLD-DEC-05, HLD-DEC-14 |

### ADR-007. Mobile dùng một codebase Expo cho User và Employee

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Proposed |
| Bối cảnh | SRS đã chốt mobile app dùng chung codebase cho User và Employee. |
| Quyết định | Expo app dùng chung, tách session, navigation, UI và quyền theo actor. |
| Hệ quả | Cần kiểm soát rõ role-based route và secure storage. |
| Nguồn | SRS OQ-10 |

### ADR-008. Admin là arbiter cuối cùng trong dispute

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Proposed |
| Bối cảnh | Tranh chấp refund/chất lượng dịch vụ cần bên quyết định cuối cùng. |
| Quyết định | Admin Platform là arbiter cuối cùng, có thể quyết định refund đơn phương khi đủ căn cứ. |
| Hệ quả | Cần audit, reason, notification Operator, evidence workflow và permission nghiêm ngặt. |
| Nguồn | SRS MQ-03 |

### ADR-009. Khung đánh giá tech stack cho rebuild tài liệu

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Proposed |
| Bối cảnh | Rebuild tài liệu đang diễn ra trước khi code Backend V1. `TECH-STACK.md` mô tả hiện trạng repo, SRS DP-01..04 mô tả dependency đang được ghi trong SRS, còn target tech stack cho implementation cần người duyệt xác nhận sau khi HLD / LLD / DB / API / Security đủ rõ. |
| Quyết định | ADR này KHÔNG chọn tech stack target. ADR này chỉ định cách ghi nhận hiện trạng, candidate, tiêu chí đánh giá và câu hỏi mở để reviewer chốt bằng ADR riêng hoặc cập nhật ADR này sang `Accepted`. |
| Hệ quả | Tránh biến hiện trạng repo thành quyết định V1 một cách ngầm định. Các tài liệu downstream được phép tham chiếu capability cần có, nhưng không được coi framework / database / queue / deployment target là đã chốt nếu chưa có quyết định `Accepted` hoặc SRS đã chốt rõ. |
| Nguồn | SRS DP-01..04, `TECH-STACK.md`, HLD §14, PROJECT-STATE §4-7 |

#### Quy tắc ghi nhận tech stack trong giai đoạn rebuild

| Quy tắc | Nội dung |
| ------- | -------- |
| Tách hiện trạng và target | Stack đang có trong repo chỉ là `hiện trạng repo`, không tự động trở thành target implementation. |
| Tách ràng buộc và lựa chọn | SRS/HLD có thể nêu capability bắt buộc như lock, queue, realtime, audit, file storage; công nghệ cụ thể phải được chốt bằng ADR hoặc quyết định reviewer. |
| Không dùng baseline để chọn stack | Không đặt tên `Baseline V1` cho bảng candidate vì dễ hiểu nhầm là đã chọn. |
| Candidate phải có tiêu chí | Mỗi candidate cần được đánh giá theo khả năng đáp ứng SRS, độ phức tạp rebuild, rủi ro vận hành, khả năng test và chi phí migration. |
| Downstream giữ TBD khi chưa chốt | LLD / DB / API / Security / Deployment phải dùng `TBD` / `OPEN QUESTION` nếu target tech stack chưa được xác nhận. |

#### Candidate / hiện trạng cần reviewer xác nhận

| Nhóm | Hiện trạng repo / nguồn đang có | Trạng thái target | Cần chốt trước code Backend V1 |
| ---- | ------------------------------- | ----------------- | ------------------------------ |
| Monorepo | npm workspaces, TypeScript shared config trong `TECH-STACK.md` | Chưa tái xác nhận target | Giữ npm workspaces hay đổi package manager; pin Node.js, npm và `packageManager`. |
| Backend framework | Repo hiện có NestJS + TypeScript; SRS DP-01 đang ghi Backend NestJS | Chưa tái xác nhận target | Giữ NestJS hay mở lại lựa chọn; nếu giữ, chốt version policy, module convention và test strategy. |
| Backend data access | Repo hiện có Mongoose + MongoDB; SRS DP-01 / OQ-14 / OQ-15 đang ghi MongoDB cho audit/reporting | Cần reviewer xác nhận có giữ quyết định SRS hay mở lại | DB Design phải chốt schema, index, transaction / atomic update, migration, retention và reporting strategy. |
| Cache / lock / queue | Repo hiện có Redis + Bull; SRS DP-04 yêu cầu Redis hoặc lock service tương đương | Chưa tái xác nhận target | Chốt SeatHold lock dùng Redis, MongoDB atomic update, service khác hoặc kết hợp; chốt queue engine và retry model. |
| Realtime | Repo hiện có Socket.IO | Chưa tái xác nhận target | Chốt realtime transport, event scope, auth handshake và fallback khi mất kết nối. |
| Auth / session | Repo hiện có Passport/JWT; SRS chốt email OTP cho User | Chưa chốt chi tiết | Chốt Bearer token hay cookie, TTL, refresh, revoke, re-auth, Admin/Operator MFA và secure storage. |
| Validation / DTO | Repo hiện có class-validator, class-transformer và shared packages | Chưa tái xác nhận target | Chốt contract source of truth: API Spec, generated client, shared DTO hay schema-first. |
| API documentation | Repo hiện có `@nestjs/swagger` | Chưa tái xác nhận target | Chốt vai trò Swagger: generated reference, không thay thế API Spec đã review. |
| Payment | SRS đã chốt VNPay Sandbox là provider đầu tiên qua adapter | Đã có quyết định nghiệp vụ; implementation còn TBD | Callback / webhook, signature, idempotency, reconciliation và secret handling. |
| Notification | SRS chốt email OTP; SMS/push chỉ giữ adapter cho tương lai | Chưa chốt provider chi tiết | Provider email, template, retry, consent/preference, mobile token registry nếu bật push. |
| Object storage | HLD đang ghi S3-compatible adapter cho file; repo chưa có target implementation rõ | Cần reviewer xác nhận lại trong rebuild | Có giữ S3-compatible/MinIO/AWS S3 hay mở lại provider; chốt metadata, signed URL, retention, access audit, type/size scan. |
| Routing | Repo / context đang có OSRM service | Chưa tái xác nhận target | Chốt OSRM hay provider khác, timeout, fallback, data refresh và outage behavior. |
| Logging / observability | Repo hiện có Winston; monitoring stack chưa chốt | Chưa chốt target | Chốt log format, correlation id, redaction, metrics, tracing, alert và retention. |
| Rate limiting / HTTP hardening | Repo hiện có `@nestjs/throttler`, Helmet | Chưa tái xác nhận target | Chốt rule cho login, OTP, search, hold, payment, lookup và upload. |
| Background jobs | Repo hiện có Bull / scheduler | Chưa tái xác nhận target | Chốt job record, lock, retry, checkpoint, dead-letter và manual rerun. |
| Frontend web | Repo hiện có Next.js, React, Ant Design, Tailwind, React Query | Chưa tái xác nhận target | Chốt có giữ stack hiện tại không sau UI/UX Flow và API contract. |
| Mobile | SRS OQ-10 đã chốt một codebase Expo cho User / Employee; repo hiện có Expo / React Native | Cần reviewer xác nhận có giữ quyết định SRS hay mở lại | Offline/sync Employee, secure storage, notification permission và release/update policy. |
| Shared packages | Repo có `shared-types` và `api-client` | Chưa tái xác nhận target | Chốt ownership enum/DTO/error code và cơ chế generate/sync giữa FE/BE/Mobile. |
| Local services | Docker Compose có MongoDB, Redis, OSRM, Mongo Express, Redis Commander | Chưa tái xác nhận target | Chốt service cần giữ cho local dev, image tag, seed data và parity với staging. |
| Deployment target | Chưa có target production | OPEN QUESTION | Chốt VPS/Docker host/cloud container/platform, secret manager, monitoring/alert stack trước staging/production. |

---

## 6. Open Questions / TBD

| ID | Câu hỏi | Tác động |
| -- | ------- | -------- |
| ADR-OQ-01 | ADR nào đã được người duyệt chính thức chấp nhận? | Trạng thái ADR |
| ADR-OQ-02 | Có cần tách ADR theo từng file riêng khi số lượng tăng không? | Quản lý tài liệu |
| ADR-OQ-03 | Node/npm/Docker image có cần pin cứng bằng ADR không? | Deployment |
| ADR-OQ-04 | Production deployment target, secret manager, monitoring/logging/alert stack chốt theo ADR nào? | Deployment / Operation |
| ADR-OQ-05 | Giữ SRS DP-01..03 / `TECH-STACK.md` hiện tại làm target implementation, hay mở lại lựa chọn tech stack sau khi HLD/LLD/DB/API/Security đủ rõ? | Điều kiện vào code Backend V1 |
