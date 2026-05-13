# 05. API Specification - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính        | Giá trị                  |
| ----------------- | ------------------------ |
| Tên tài liệu      | API Specification        |
| Mã tài liệu       | 05-api-specification     |
| Dự án             | Hệ thống đặt vé xe khách |
| Phiên bản         | v1.1                     |
| Trạng thái        | Draft                    |
| Người viết        | AI Agent                 |
| Người duyệt       | Nguyễn Hồng Khanh        |
| Ngày tạo          | 11/05/2026               |
| Cập nhật gần nhất | 13/05/2026               |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật              | Nội dung thay đổi                                                                                                                                                                                   |
| --------- | ---------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.1      | 13/05/2026 | AI Agent, Nguyễn Hồng Khanh | Đóng API-OP-01..05: chốt auth/session transport, realtime WebSocket + polling fallback, VNPay Sandbox mapping, notification V1 baseline và API contract publication policy                          |
| v1.0      | 13/05/2026 | AI Agent, Nguyễn Hồng Khanh | Viết lại toàn bộ API Specification từ các tài liệu Approved 01/02/03/04; bổ sung quy ước contract, endpoint catalog, DTO summary, idempotency, webhook, realtime event, error code và API-OP-01..05 |
| v0.1      | 11/05/2026 | AI Agent                    | Tạo bản nháp API Specification                                                                                                                                                                      |

### 1.3. Trạng thái sử dụng

Tài liệu này ở trạng thái `Draft`. Nội dung v1.1 đã đóng các API-OP phát sinh trong v1.0 và đủ làm nền review contract API cho Web Marketplace, Web Operator OS, Web Admin và Mobile User / Employee, nhưng chưa được dùng làm nguồn sinh OpenAPI / SDK chính thức cho đến khi được chuyển sang `Review` / `Approved`.

Tài liệu này KHÔNG dựa vào source code hiện tại. Các endpoint bên dưới là contract logic cho Backend V1, được rút từ tài liệu Approved: SRS v1.20, HLD v1.13, LLD v1.2 và Database Design v1.4, cộng với quyết định reviewer ngày 13/05/2026 để đóng API-OP-01..05. Các chi tiết ngoài API vẫn cần tài liệu nhận tương ứng, nhưng không còn API-OP mở trong tài liệu này.

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Nguồn đầu vào và phạm vi API
5. Baseline quyết định API
6. Quy ước chung
7. Actor, auth và scope
8. Response, pagination và error format
9. Header, idempotency và concurrency
10. DTO summary và field contract
11. Endpoint catalog - IAM, session và verification
12. Endpoint catalog - Marketplace checkout
13. Endpoint catalog - User account, ticket và notification
14. Endpoint catalog - Operator onboarding và resource
15. Endpoint catalog - Operator trip, booking và finance
16. Endpoint catalog - Employee operations
17. Endpoint catalog - Support, complaint, dispute và review
18. Endpoint catalog - Admin governance
19. File, attachment và report export API
20. Webhook, callback và external adapter API
21. Realtime event contract
22. Background job, reconciliation và audit API
23. Security, privacy và logging constraint
24. Traceability, rủi ro và OP đã xử lý
25. Phụ lục

---

## 3. Giới thiệu

### 3.1. Mục đích

Tài liệu này định nghĩa API contract mức thiết kế cho hệ thống đặt vé xe khách V1. API contract phải giúp các nhóm Web, Mobile, Backend, Test và Security thống nhất:

- Endpoint group theo actor và service layer.
- Request / response shape ở mức logical DTO.
- Header, idempotency, pagination, error code và realtime event.
- Contract webhook / callback cho payment và job đối soát.
- Boundary dữ liệu cá nhân, tenant, permission và audit.

### 3.2. Định vị API

Backend là điểm kiểm soát cuối cùng cho xác thực, RBAC, tenant boundary, trạng thái ghế, booking, ticket, payment, refund, payout và audit. Client chỉ hiển thị / gửi lệnh; mọi rule ảnh hưởng tiền, ghế, vé, quyền, dữ liệu cá nhân hoặc trạng thái vận hành phải được backend kiểm tra lại.

API V1 phục vụ bốn client surface:

| Client surface  | Actor chính    | Phạm vi API                                                                                      |
| --------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| Web Marketplace | User, Guest    | Search, trip detail, hold, booking, payment, ticket, guest lookup, support, complaint, review    |
| Web Operator OS | Operator       | Onboarding, KYC, resource, route, trip, fare, booking, employee, finance, support, report        |
| Web Admin       | Admin          | KYC, catalog, policy, commission, payout, payment/refund/reconciliation, dispute, audit, report  |
| Mobile app      | User, Employee | User booking/ticket/notification; Employee assignment, manifest, check-in, journey log, incident |

### 3.3. Ngoài phạm vi

| Ngoài phạm vi v1.0                                    | Lý do                                                                              |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Source code controller / DTO class cụ thể             | Tài liệu này không dựa vào code.                                                   |
| OpenAPI generator, Swagger setup, SDK generation tool | API publication policy đã chốt ở §6.5; framework/tool cụ thể vẫn theo ADR backend. |
| Source code controller / DTO class cụ thể             | Tài liệu này không dựa vào code.                                                   |
| External Operator API / hybrid integration            | Ngoài phạm vi V1 theo SRS/HLD.                                                     |
| SMS OTP                                               | SRS chốt ngoài phạm vi V1; chỉ giữ adapter boundary cho notification tương lai.    |
| Payment provider production ngoài VNPay Sandbox       | SRS chốt VNPay Sandbox là provider đầu tiên.                                       |
| Public object bucket cho file private                 | DB Design cấm public-read cho KYC, dispute, incident evidence và report export.    |

---

## 4. Nguồn đầu vào và phạm vi API

### 4.1. Nguồn được dùng

| Nguồn                                      | Trạng thái | Cách dùng trong API Spec                                                            |
| ------------------------------------------ | ---------- | ----------------------------------------------------------------------------------- |
| `01-srs-he-thong-dat-ve-xe-khach.md` v1.20 | Approved   | Nguồn yêu cầu chức năng, actor, business rule, use case, state, AC.                 |
| `02-hld-he-thong-dat-ve-xe-khach.md` v1.13 | Approved   | Nguồn client/backend boundary, adapter, event/job, integration handoff.             |
| `03-lld-he-thong-dat-ve-xe-khach.md` v1.2  | Approved   | Nguồn module logical, command/query, idempotency, use case trọng yếu.               |
| `04-database-design.md` v1.4               | Approved   | Nguồn field contract, snapshot, retention, file policy, DB transaction/idempotency. |
| `context/GLOSSARY.md`                      | Context    | Chuẩn hóa thuật ngữ Việt/Anh và tên entity kỹ thuật.                                |
| `context/DOMAIN-MAP.md`                    | Context    | Định vị service layer, actor, module group và state enum target.                    |
| `context/PROJECT-STATE.md`                 | Context    | Trạng thái tài liệu, quyết định đã đóng và blocker còn lại.                         |

### 4.2. Quy tắc xử lý mâu thuẫn

| Tình huống                                                            | Cách xử lý                                                                     |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| SRS mâu thuẫn tài liệu sau                                            | Ưu tiên SRS nếu SRS đã Approved; ghi OP nếu cần chỉnh tài liệu downstream.     |
| HLD/LLD/DB đã chốt chi tiết từ SRS                                    | Dùng chi tiết đã Approved để cụ thể hóa API contract.                          |
| Chi tiết thuộc Security/ADR/Deployment đã có quyết định liên quan API | Dùng quyết định đã đóng trong v1.1 và trỏ sang tài liệu nhận.                  |
| Cần endpoint để thực hiện FR/UC đã Approved                           | Được thiết kế ở mức logical contract, nhưng không gắn framework/code hiện tại. |
| Cần thêm actor/module/luồng mới                                       | Không thêm; dừng ở OP.                                                         |

---

## 5. Baseline quyết định API

| ID        | Quyết định baseline                                                                                                                                | Nguồn                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| API-BL-01 | Base path logic của REST API là `/api/v1`; endpoint table trong tài liệu này là contract V1.                                                       | HLD §7, LLD §14.2         |
| API-BL-02 | JSON dùng `camelCase`; timestamp dùng UTC ISO-8601; hiển thị theo `Asia/Ho_Chi_Minh` ở client.                                                     | SRS §8.2, DB §9.1         |
| API-BL-03 | Tiền tệ V1 chỉ dùng `VND`; amount field dùng integer VND, không dùng floating point.                                                               | SRS OQ-12, DB §9.2        |
| API-BL-04 | Actor flow tách riêng: User, Guest, Operator, Employee, Admin; Operator/Employee/Admin không dùng public User auth flow.                           | SRS FR-IAM, HLD §6.2      |
| API-BL-05 | Guest checkout nằm trong V1 cho Web Marketplace; mobile passenger app không có Guest checkout / lookup baseline.                                   | SRS BR-21, HLD §6.2       |
| API-BL-06 | SeatHold TTL mặc định V1 là 10 phút cấp Platform; API hold trả `expiresAt` từ server.                                                              | SRS OQ-06, DB §12.2       |
| API-BL-07 | Passenger checkout là pay-first; booking tạo từ SeatHold hợp lệ ở trạng thái `PENDING_PAYMENT`.                                                    | SRS OQ-07, DB §14         |
| API-BL-08 | Payment provider đầu tiên là VNPay Sandbox qua adapter; callback/webhook phải verify và idempotent.                                                | SRS OQ-05, HLD §13        |
| API-BL-09 | Payment success phải cập nhật booking/payment/seat/ticket/escrow nhất quán; callback lệch vào reconciliation/manual review.                        | SRS BR-27..30, DB §12     |
| API-BL-10 | Booking/ticket/payment/refund/payout/audit production không hard delete; API chỉ expose cancel/archive/deactivate theo policy.                     | SRS §17, DB §18           |
| API-BL-11 | File private dùng S3-compatible storage qua signed URL; DB/API chỉ quản lý metadata, object key, scan status và access URL ngắn hạn.               | HLD-OQ-01, DB §16         |
| API-BL-12 | Notification bắt buộc về bảo mật, vé, payment, đổi/hủy chuyến và dispute không được tắt hoàn toàn.                                                 | SRS BR-52, LLD §8.13      |
| API-BL-13 | Employee offline chỉ nhận queued operational actions giới hạn cho check-in/no-show/journey log/incident; không queue payment/refund/payout/policy. | HLD-OQ-04, LLD §9.10      |
| API-BL-14 | Report lớn chạy async job, trả job/export metadata; không trả file lớn trực tiếp trên request nóng.                                                | SRS OQ-15, HLD §12        |
| API-BL-15 | Auth API V1 dùng Bearer access token qua `Authorization`; refresh/session transport theo Security Design v0.3.                                     | API-OP-01 closed          |
| API-BL-16 | Realtime V1 dùng WebSocket endpoint `/realtime`, auth handshake bằng Bearer hoặc guest realtime token; fallback là REST polling.                   | API-OP-02 closed, ADR-010 |
| API-BL-17 | VNPay Sandbox mapping dùng `vnp_TxnRef = paymentCode`, amount provider bằng `amountVnd * 100`, success khi response/status đều `00`.               | API-OP-03 closed          |
| API-BL-18 | Notification V1 dùng email + in-app baseline; SMS/push giữ adapter nhưng không bật transactional launch nếu không mở lại scope.                    | API-OP-04 closed          |
| API-BL-19 | API Spec đã review là source contract nghiệp vụ; OpenAPI 3.1 là derived artifact, SDK client sinh từ OpenAPI sau khi contract được review.         | API-OP-05 closed, ADR-011 |

---

## 6. Quy ước chung

### 6.1. Transport và format

| Quy ước            | Contract                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| Base path          | `/api/v1`                                                                                                 |
| Primary format     | JSON UTF-8                                                                                                |
| Multipart upload   | Không upload binary trực tiếp qua business API; dùng upload intent + signed URL, sau đó confirm metadata. |
| Timestamp          | UTC ISO-8601, ví dụ `2026-05-13T08:30:00Z`.                                                               |
| Business date      | `YYYY-MM-DD`, diễn giải theo timezone Việt Nam nếu là ngày đi/chạy báo cáo.                               |
| Currency           | `VND`.                                                                                                    |
| ID nội bộ          | Field `id` hoặc `<entity>Id`; không dùng thay mã public nếu không cần.                                    |
| Mã public/đối soát | `bookingCode`, `ticketCode`, `paymentCode`, `refundCode`, `payoutCode`, `supportCode`, `disputeCode`.     |
| Version record     | Field `version` BẮT BUỘC với record cần conditional update hoặc optimistic concurrency.                   |
| Masking            | API mặc định trả dữ liệu đã mask nếu actor không có quyền xem đầy đủ.                                     |

### 6.2. Naming

| Loại        | Quy ước                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| JSON field  | `camelCase`.                                                            |
| Enum value  | `UPPER_SNAKE_CASE`, theo SRS §17 nếu là state nghiệp vụ.                |
| Query param | `camelCase`.                                                            |
| Path param  | `{entityId}` hoặc `{entityCode}` tùy use case; lookup public dùng code. |
| Error code  | `PREFIX_UPPER_SNAKE_CASE`.                                              |
| Event name  | `domain.resource.action`, ví dụ `booking.status.updated`.               |

### 6.3. HTTP method

| Method   | Ý nghĩa trong API này                                                      |
| -------- | -------------------------------------------------------------------------- |
| `GET`    | Đọc dữ liệu theo scope, không tạo side effect nghiệp vụ.                   |
| `POST`   | Tạo command, action, state transition, request export, callback, verify.   |
| `PATCH`  | Cập nhật một phần record hoặc state với guard/version/reason khi cần.      |
| `PUT`    | Thay thế cấu hình/version khi contract yêu cầu đầy đủ payload.             |
| `DELETE` | Release / deactivate / revoke logic; không hard delete dữ liệu rủi ro cao. |

### 6.4. Không dùng API để vượt boundary

API KHÔNG ĐƯỢC:

- Cho Operator gửi `operatorId` client-side để đọc tenant khác.
- Cho Employee thao tác ngoài assignment scope.
- Cho Guest tra cứu bằng số điện thoại/email đơn lẻ không kèm booking/ticket code.
- Trả raw OTP, token, password, QR raw secret hoặc provider sensitive payload.
- Xác nhận KYC/dispute/incident attachment khi file chưa upload thành công hoặc chưa qua scan gate theo policy.
- Phát hành ticket từ client request trực tiếp; ticket issuance là hậu xử lý của payment success / confirmation hợp lệ.

---

## 7. Actor, auth và scope

### 7.1. Actor context chuẩn

| Field context    | Bắt buộc khi                    | Ghi chú                                                              |
| ---------------- | ------------------------------- | -------------------------------------------------------------------- |
| `actorType`      | Mọi request không public        | `User`, `Guest`, `Operator`, `Employee`, `Admin`, `System`.          |
| `actorId`        | Actor đăng nhập                 | Guest có thể dùng `guestSessionId` hoặc verified guest context.      |
| `operatorId`     | Operator, Employee, tenant data | Resolve từ account/assignment, không lấy client làm source of truth. |
| `roleCodes`      | Operator, Employee, Admin       | Employee chỉ có `TICKET_STAFF`, `DRIVER`, `SUPPORT_STAFF` ở V1.      |
| `assignmentIds`  | Employee operation              | Bắt buộc cho manifest/check-in/trip status/journey/incident.         |
| `requestId`      | Mọi request/job/callback        | Gateway hoặc hệ thống sinh nếu client không gửi.                     |
| `idempotencyKey` | Mutation rủi ro cao             | Header/command/provider event.                                       |

### 7.2. Auth surface

| Actor    | Auth / verification contract                                                                                                                | Không được                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Guest    | Public search/detail không cần login; checkout dùng guest session; lookup/sensitive action dùng booking/ticket code + contact verification. | Không có lịch sử tài khoản lâu dài; không review V1.                  |
| User     | Đăng ký/đăng nhập bằng email hoặc số điện thoại; email OTP là baseline xác minh V1.                                                         | Không truy cập booking/ticket của User khác.                          |
| Operator | Đăng nhập bằng username/password được cấp; thao tác trong tenant.                                                                           | Không dùng public User login/reset; không xem tenant khác.            |
| Employee | Đăng nhập bằng tài khoản Operator cấp; scope theo role và assignment.                                                                       | Không thao tác payment/refund/payout/policy.                          |
| Admin    | Đăng nhập bằng Admin account nội bộ; quyền theo RBAC.                                                                                       | Không tự đăng ký public; reset password qua quy trình vận hành/audit. |
| System   | Callback/job/internal event có trust boundary riêng.                                                                                        | Không bỏ qua idempotency/audit khi ảnh hưởng tiền/vé.                 |

### 7.3. Session TTL baseline

| Actor                  | TTL baseline từ DB Design                   | Ghi chú API                                                                      |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------------------------------- |
| User                   | 30 ngày refresh/session                     | API phải hỗ trợ refresh, revoke, multi-device theo policy.                       |
| Operator               | 14 ngày                                     | Session gắn tenant, force logout khi khóa Operator/account.                      |
| Employee               | 7 ngày                                      | Session gắn operator và assignment scope; revoke khi role/assignment bị thu hồi. |
| Admin                  | 12 giờ                                      | Thao tác nhạy cảm cần re-auth theo policy.                                       |
| Guest checkout session | 2 giờ hoặc đến khi booking/payment terminal | Sau expiry chỉ lookup bằng booking/ticket code + contact verification.           |

### 7.4. Sensitive action challenge

API phải hỗ trợ bước yêu cầu và xác minh lại trước thao tác nhạy cảm. Cơ chế chính xác của token/challenge/MFA được chốt ở Security Design, nhưng contract logic tối thiểu gồm:

| Action group                     | Actor            | Verification tối thiểu                                         |
| -------------------------------- | ---------------- | -------------------------------------------------------------- |
| Cancel/refund passenger          | User, Guest      | Ownership/verified guest + re-auth/OTP nếu policy yêu cầu.     |
| Manual refund / dispute decision | Admin            | RBAC + reason + re-auth nếu policy yêu cầu + audit.            |
| Confirm payout paid              | Admin            | RBAC finance + ledger/payout check + reason/proof + audit.     |
| Change Operator bank account     | Operator, Admin  | Re-auth + reason + audit + versioned bank account snapshot.    |
| Change trip after sale           | Operator, Admin  | Permission + tenant + reason + impact analysis + notification. |
| View full phone / export PII     | Authorized actor | Purpose + scope + audit/export log.                            |

---

## 8. Response, pagination và error format

### 8.1. Success envelope

Tất cả response business API NÊN dùng envelope thống nhất:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_01HZX...",
    "serverTime": "2026-05-13T08:30:00Z"
  }
}
```

Với command bất đồng bộ:

```json
{
  "success": true,
  "data": {
    "jobId": "job_123",
    "status": "PENDING"
  },
  "meta": {
    "requestId": "req_01HZX...",
    "accepted": true
  }
}
```

### 8.2. Error envelope

```json
{
  "success": false,
  "error": {
    "code": "SEAT_HOLD_CONFLICT",
    "message": "Seat is no longer available",
    "details": {
      "seatCodes": ["A01"]
    },
    "retryable": false
  },
  "meta": {
    "requestId": "req_01HZX...",
    "serverTime": "2026-05-13T08:30:00Z"
  }
}
```

Quy tắc:

- `message` là safe message, không lộ secret, stack trace, provider raw payload hoặc PII ngoài quyền.
- `details` chỉ chứa dữ liệu client cần để sửa input hoặc hiển thị recovery flow.
- `retryable` chỉ `true` khi gọi lại cùng idempotency key an toàn.
- Error cho login/lookup không được tiết lộ account/code tồn tại khi không có quyền biết.

### 8.3. HTTP status mapping

| HTTP status                | Dùng cho                                                               |
| -------------------------- | ---------------------------------------------------------------------- |
| `200 OK`                   | Query thành công, command idempotent trả lại kết quả đã có.            |
| `201 Created`              | Tạo resource mới thành công.                                           |
| `202 Accepted`             | Command/job/callback đã nhận và xử lý async.                           |
| `204 No Content`           | Logout/release/deactivate không cần body.                              |
| `400 Bad Request`          | DTO invalid, field thiếu/sai format.                                   |
| `401 Unauthorized`         | Chưa auth hoặc session/token invalid/expired.                          |
| `403 Forbidden`            | Auth hợp lệ nhưng thiếu quyền/tenant/assignment.                       |
| `404 Not Found`            | Không tìm thấy hoặc không được tiết lộ resource tồn tại.               |
| `409 Conflict`             | State conflict, idempotency conflict, version mismatch, seat conflict. |
| `410 Gone`                 | Hold/booking/payment/link đã hết hạn và không còn dùng được.           |
| `422 Unprocessable Entity` | Business rule không thỏa dù DTO hợp lệ.                                |
| `423 Locked`               | Resource đang bị lock/on hold/manual review.                           |
| `429 Too Many Requests`    | Rate limit login/OTP/search/hold/lookup/upload.                        |
| `500`                      | Lỗi hệ thống không phân loại, message safe.                            |
| `503`                      | Provider/service tạm không khả dụng hoặc maintenance.                  |

### 8.4. Pagination

| Dạng list                              | Contract                                                               |
| -------------------------------------- | ---------------------------------------------------------------------- |
| List nhỏ / admin table thường          | `page`, `limit`, `sortBy`, `sortOrder`.                                |
| Audit, notification, event/job log lớn | Cursor pagination: `cursor`, `limit`, `sortOrder`.                     |
| Max `limit` mặc định                   | `50`; endpoint có thể cho tối đa `100` nếu không chứa PII/export nặng. |
| Export lớn                             | Dùng report/export job, không tăng `limit` để tải toàn bộ.             |

Response list:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "requestId": "req_01HZX...",
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 125,
      "hasNext": true,
      "nextCursor": null
    }
  }
}
```

### 8.5. Error code prefix

| Prefix           | Nhóm lỗi                                                       |
| ---------------- | -------------------------------------------------------------- |
| `AUTH_*`         | Đăng ký, đăng nhập, session, re-auth, OTP.                     |
| `PERMISSION_*`   | RBAC, tenant boundary, ownership, assignment.                  |
| `VALIDATION_*`   | DTO, enum, range, field format, file type/size.                |
| `RATE_LIMIT_*`   | Login, OTP, search, hold, lookup, upload.                      |
| `IDEMPOTENCY_*`  | Duplicate key, request digest mismatch, replay unsafe.         |
| `SEAT_*`         | Availability, hold, release, conflict, expiry.                 |
| `TRIP_*`         | Trip status, sale window, change/cancel, impact.               |
| `BOOKING_*`      | Booking creation, snapshot, status, expiry.                    |
| `PAYMENT_*`      | Payment create, callback, provider, reconciling.               |
| `TICKET_*`       | Ticket view, QR, check-in, invalid state.                      |
| `REFUND_*`       | Refund request, policy, manual review, provider result.        |
| `PAYOUT_*`       | Eligibility, hold, transfer, confirmation.                     |
| `OPERATOR_*`     | KYC, profile, bank account, operator status.                   |
| `CATALOG_*`      | StopPoint, route catalog, policy version.                      |
| `PROMOTION_*`    | Promotion rule, scope, redemption, usage limit.                |
| `SUPPORT_*`      | Ticket/complaint/case message.                                 |
| `DISPUTE_*`      | Dispute state, evidence, decision.                             |
| `FILE_*`         | Upload intent, scan, signed URL, retention.                    |
| `NOTIFICATION_*` | Preference, delivery, retry, mandatory channel.                |
| `JOB_*`          | Async job, rerun, checkpoint, manual review.                   |
| `SYSTEM_*`       | Provider/service unavailable, maintenance, unknown safe error. |

---

## 9. Header, idempotency và concurrency

### 9.1. Header chuẩn

| Header               | Bắt buộc                          | Ý nghĩa                                                                           |
| -------------------- | --------------------------------- | --------------------------------------------------------------------------------- |
| `X-Request-Id`       | NÊN                               | Client/gateway correlation id; server sinh nếu thiếu.                             |
| `Authorization`      | Với authenticated API             | Logical auth credential; format/storage chốt ở Security Design.                   |
| `Idempotency-Key`    | Với mutation rủi ro cao           | Chống retry tạo trùng.                                                            |
| `If-Match`           | Với update cần `version`          | Optimistic concurrency, giá trị là version hiện tại hoặc ETag logic.              |
| `X-Guest-Session-Id` | Với guest checkout trước xác minh | Guest session tạm cho hold/booking/payment.                                       |
| `X-Actor-Surface`    | NÊN                               | `web_marketplace`, `web_operator`, `web_admin`, `mobile_user`, `mobile_employee`. |
| `X-Client-Version`   | NÊN với mobile                    | Phục vụ compatibility và incident/debug.                                          |

### 9.2. Idempotency matrix

| Nghiệp vụ             | Endpoint chính                             | TTL record                    | Conflict behavior                                                     |
| --------------------- | ------------------------------------------ | ----------------------------- | --------------------------------------------------------------------- |
| SeatHold              | `POST /seat-holds`                         | 24 giờ                        | Cùng digest trả hold hiện có; khác digest trả `IDEMPOTENCY_CONFLICT`. |
| Create booking        | `POST /bookings`                           | 24 giờ                        | Cùng input trả booking đã tạo; snapshot mismatch bị từ chối.          |
| Create payment        | `POST /bookings/{bookingId}/payments`      | 24 tháng                      | Trả payment còn hợp lệ; không tạo mới nếu booking terminal.           |
| Payment callback      | `POST /webhooks/payments/vnpay`            | 24 tháng                      | Apply state transition một lần; lệch vào reconciliation.              |
| Ticket issuance       | Internal/system command                    | Theo booking/ticket retention | Không tạo trùng ticket/QR cho cùng passenger/seat item.               |
| Refund request        | `POST /refunds` hoặc booking/ticket action | 24 tháng                      | Trả refund hiện có hoặc conflict nếu state đã đổi.                    |
| Notification delivery | Internal/job command                       | 90 ngày                       | Không gửi trùng notification bắt buộc cùng event.                     |
| Payout candidate      | Job/admin action                           | 24 tháng                      | Không tạo payout trùng checkpoint/kỳ.                                 |
| Offline operation     | `POST /employee/offline-operations:sync`   | 30 ngày                       | Apply một lần; conflict nếu base version/assignment không còn hợp lệ. |
| Report export         | `POST /reports/*/exports`                  | Theo job scope                | Trả job hiện có nếu cùng actor/filter/digest còn hiệu lực.            |

### 9.3. Concurrency và version

| Nhóm resource                    | Rule API                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------- |
| Trip, SeatMap, Route, FareRule   | Update yêu cầu `version` hoặc `If-Match`; trip đã bán vé cần reason/impact.     |
| TripSeat / SeatHold              | Client không update trực tiếp; dùng command hold/release/block/check-in.        |
| Policy, CommissionRule           | Create new version hoặc deactivate; không sửa ngược version đã snapshot.        |
| Booking, Ticket, Payment, Refund | State transition qua command/action; không update tùy ý.                        |
| Support/Dispute                  | Reply/state change cần actor/scope/reason khi đổi state.                        |
| Attachment                       | Metadata confirm cần status `PENDING` và checksum/contentType/size khớp intent. |

---

## 10. DTO summary và field contract

### 10.1. Field chung trong response

| Field                      | Áp dụng                  | Ghi chú                                                            |
| -------------------------- | ------------------------ | ------------------------------------------------------------------ |
| `id`                       | Mọi resource             | Internal immutable id.                                             |
| `code` hoặc `<entity>Code` | Resource public/đối soát | Dùng cho lookup, support, reconciliation.                          |
| `status`                   | Resource có state        | Theo enum SRS §17.                                                 |
| `version`                  | Resource mutable         | Dùng optimistic concurrency.                                       |
| `createdAt`, `updatedAt`   | Mọi resource             | UTC.                                                               |
| `createdBy`, `updatedBy`   | Mutation by actor        | Actor reference safe, không chứa secret.                           |
| `operatorId`               | Tenant data              | Có thể bị ẩn nếu actor không cần thấy, nhưng backend luôn enforce. |

### 10.2. Marketplace DTO

| DTO                    | Field tối thiểu                                                                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TripSearchRequest`    | `originStopPointId`, `destinationStopPointId`, `departureDate`, `passengerCount`, `filters`, `sort`.                                                                        |
| `TripSearchItem`       | `tripId`, `operatorSnapshot`, `routeSummary`, `departureAt`, `arrivalAt`, `vehicleType`, `amenities`, `minFareVnd`, `availableSeatCount`, `scorecardSummary`, `saleStatus`. |
| `TripDetail`           | `tripId`, `tripCode`, `operatorPublicProfile`, `routeStops`, `pickupOptions`, `dropoffOptions`, `seatMap`, `fareOptions`, `refundPolicySummary`, `saleWindow`, `version`.   |
| `SeatHoldRequest`      | `tripId`, `seatCodes`, `pickupStopId`, `dropoffStopId`, `passengerCount`, `clientKey`.                                                                                      |
| `SeatHoldResponse`     | `seatHoldId`, `status`, `tripId`, `seatCodes`, `expiresAt`, `serverTime`, `version`.                                                                                        |
| `CreateBookingRequest` | `seatHoldId`, `passengers`, `contact`, `pickupStopId`, `dropoffStopId`, `promotionCode`, `note`, `clientKey`.                                                               |
| `BookingSummary`       | `bookingId`, `bookingCode`, `status`, `amountSnapshot`, `tripSnapshot`, `seatSnapshots`, `passengerSnapshots`, `policySnapshot`, `expiresAt`.                               |
| `CreatePaymentRequest` | `method`, `provider`, `returnUrl`, `clientKey`.                                                                                                                             |
| `PaymentResponse`      | `paymentId`, `paymentCode`, `status`, `amountVnd`, `currency`, `provider`, `redirectUrl`, `expiresAt`.                                                                      |
| `TicketView`           | `ticketId`, `ticketCode`, `status`, `qrDisplayPayload`, `tripSnapshot`, `seatSnapshot`, `passengerSnapshot`, `pickupDropoff`, `operatorContact`.                            |

### 10.3. Operator DTO

| DTO                        | Field tối thiểu                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `OperatorProfile`          | `operatorId`, `publicName`, `legalName`, `logoAttachmentId`, `hotline`, `email`, `address`, `description`, `status`, `kycStatus`, `version`. |
| `KycDocumentIntentRequest` | `documentType`, `contentType`, `size`, `checksum`.                                                                                           |
| `BankAccountChangeRequest` | `bankName`, `accountNumber`, `accountHolder`, `branch`, `reason`, `verificationChallengeId`.                                                 |
| `VehicleRequest`           | `plateNumber`, `vehicleTypeId`, `amenityIds`, `status`, `description`, `version`.                                                            |
| `SeatMapRequest`           | `name`, `vehicleTypeId`, `layout`, `seatCodes`, `version`.                                                                                   |
| `RouteRequest`             | `originStopPointId`, `destinationStopPointId`, `routeStops`, `estimatedDurationMinutes`, `version`.                                          |
| `TripRequest`              | `routeId`, `vehicleId`, `seatMapId`, `departureAt`, `arrivalAt`, `saleCloseAt`, `pickupDropoffConfig`, `fareRuleId`, `version`.              |
| `TripChangeRequest`        | `changeType`, `patch`, `reason`, `expectedVersion`, `notifyAffectedPassengers`.                                                              |
| `EmployeeRequest`          | `username`, `displayName`, `roleCodes`, `status`, `assignmentScope`.                                                                         |
| `AssignmentRequest`        | `employeeId`, `tripId`, `roleInTrip`, `startAt`, `endAt`.                                                                                    |

### 10.4. Admin DTO

| DTO                           | Field tối thiểu                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `KycDecisionRequest`          | `decision`, `reason`, `requiredSupplements`, `verificationChallengeId`.                        |
| `CatalogItemRequest`          | `type`, `name`, `code`, `parentId`, `status`, `metadata`, `effectiveAt`.                       |
| `PolicyVersionRequest`        | `policyType`, `versionName`, `effectiveFrom`, `rules`, `reason`.                               |
| `CommissionRuleRequest`       | `scope`, `operatorId`, `percent`, `effectiveFrom`, `effectiveTo`, `reason`.                    |
| `PayoutDecisionRequest`       | `decision`, `reason`, `bankTransferReference`, `proofAttachmentId`, `verificationChallengeId`. |
| `ManualRefundDecisionRequest` | `decision`, `amountVnd`, `reason`, `evidenceIds`, `verificationChallengeId`.                   |
| `DisputeDecisionRequest`      | `decision`, `reason`, `refundAmountVnd`, `evidenceIds`, `nextStatus`.                          |
| `ReportExportRequest`         | `reportType`, `dateRange`, `filters`, `format`, `includeSensitiveFields`, `reason`.            |

### 10.5. Attachment DTO

| DTO                         | Field tối thiểu                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `CreateUploadIntentRequest` | `purpose`, `ownerType`, `ownerId`, `contentType`, `size`, `checksum`, `fileName`.                                                |
| `UploadIntentResponse`      | `attachmentId`, `uploadUrl`, `method`, `headers`, `expiresAt`, `maxSize`, `allowedContentTypes`.                                 |
| `ConfirmUploadRequest`      | `attachmentId`, `objectKey`, `checksum`, `size`, `contentType`.                                                                  |
| `AttachmentMetadata`        | `attachmentId`, `purpose`, `ownerType`, `ownerId`, `status`, `scanStatus`, `contentType`, `size`, `retentionClass`, `createdAt`. |
| `DownloadUrlResponse`       | `attachmentId`, `downloadUrl`, `expiresAt`, `contentType`, `size`, `scanStatus`.                                                 |

File API phải dùng allowlist và size limit từ DB §16: PDF/JPEG/PNG/WebP tối đa 10 MB cho KYC/support/dispute/incident; CSV/XLSX/PDF tối đa 100 MB cho report export.

---

## 11. Endpoint catalog - IAM, session và verification

### 11.1. Auth endpoint

| Method   | Path                                 | Actor              | Request                                              | Response                                             | Trace                 |
| -------- | ------------------------------------ | ------------------ | ---------------------------------------------------- | ---------------------------------------------------- | --------------------- |
| `POST`   | `/auth/users/register`               | Guest/User         | Email/phone, profile tối thiểu, verification payload | User account/session pending hoặc active theo policy | FR-IAM-01             |
| `POST`   | `/auth/users/login`                  | User               | Email/phone + credential/OTP flow                    | Session response + actor context                     | FR-IAM-02a            |
| `POST`   | `/auth/users/password-reset/request` | User               | Email/phone                                          | Accepted safe response                               | FR-IAM-03a            |
| `POST`   | `/auth/users/password-reset/confirm` | User               | Reset token/OTP + new credential                     | Session revoked/updated result                       | FR-IAM-03a            |
| `POST`   | `/auth/operators/login`              | Operator           | Username/password                                    | Session response + operator context                  | FR-IAM-02c            |
| `POST`   | `/auth/employees/login`              | Employee           | Username/password                                    | Session response + employee role/assignment summary  | FR-IAM-02c, FR-EMP-01 |
| `POST`   | `/auth/admin/login`                  | Admin              | Admin credential                                     | Session response + admin permission summary          | FR-IAM-02b            |
| `POST`   | `/auth/sessions/refresh`             | Authenticated      | Refresh credential                                   | New session/access credential                        | FR-IAM-13..14         |
| `POST`   | `/auth/sessions/logout`              | Authenticated      | Current session                                      | `204` or logout result                               | FR-IAM-15             |
| `GET`    | `/auth/sessions`                     | Authenticated      | Query current actor sessions                         | List active sessions                                 | FR-IAM-15             |
| `DELETE` | `/auth/sessions/{sessionId}`         | Owner/Admin scoped | Session id                                           | Revoked result                                       | FR-IAM-15..16         |

### 11.2. Verification và re-auth

| Method | Path                                                    | Actor                        | Mục đích                                                           | Trace            |
| ------ | ------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------ | ---------------- |
| `POST` | `/verification/guest-ticket-lookup`                     | Guest                        | Verify booking/ticket code + contact để mở guest context           | FR-MKT-12, UC-35 |
| `POST` | `/verification/sensitive-actions`                       | Authenticated/verified Guest | Tạo challenge cho thao tác nhạy cảm                                | FR-IAM-10        |
| `POST` | `/verification/sensitive-actions/{challengeId}/confirm` | Authenticated/verified Guest | Xác nhận challenge trước cancel/refund/bank/payout/manual decision | BR-35, BR-37     |
| `POST` | `/verification/email-otp/request`                       | User/Guest                   | Request email OTP cho flow được phép                               | OQ-09            |
| `POST` | `/verification/email-otp/confirm`                       | User/Guest                   | Confirm OTP theo challenge                                         | OQ-09            |

`API-OP-01` chờ Security Design chốt credential transport, refresh token/cookie/Bearer, MFA và re-auth token shape. Endpoint logical ở trên không quyết định storage/token implementation.

---

## 12. Endpoint catalog - Marketplace checkout

### 12.1. Public catalog, search và detail

| Method | Path                                  | Actor       | Query / Request chính                                                                         | Response chính                       | Trace                |
| ------ | ------------------------------------- | ----------- | --------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------- |
| `GET`  | `/catalog/provinces`                  | Public      | Search/filter active                                                                          | Province list                        | FR-ADM-04            |
| `GET`  | `/catalog/wards`                      | Public      | `provinceId`, search                                                                          | Ward list                            | FR-ADM-04            |
| `GET`  | `/catalog/stop-points`                | Public      | origin/destination search, active only                                                        | StopPoint list                       | FR-MKT-01, BR-38     |
| `GET`  | `/catalog/vehicle-types`              | Public      | Active only                                                                                   | VehicleType list                     | FR-MKT-03            |
| `GET`  | `/catalog/amenities`                  | Public      | Active only                                                                                   | Amenity list                         | FR-MKT-03            |
| `GET`  | `/marketplace/trips/search`           | User, Guest | `originStopPointId`, `destinationStopPointId`, `departureDate`, `passengerCount`, filter/sort | TripSearchItem list                  | FR-MKT-01..04, BR-22 |
| `GET`  | `/marketplace/trips/{tripId}`         | User, Guest | Trip id                                                                                       | TripDetail with seat map/fare/policy | FR-MKT-05, UC-03     |
| `GET`  | `/marketplace/operators/{operatorId}` | User, Guest | Operator id                                                                                   | Public profile + scorecard           | FR-MKT-06, FR-NSR-15 |

Search/detail response chỉ là availability hiện tại để hiển thị. `POST /seat-holds` phải kiểm tra lại trạng thái ghế và sale window.

### 12.2. SeatHold

| Method   | Path                       | Actor               | Request                              | Response                                   | Error trọng yếu                                                                         |
| -------- | -------------------------- | ------------------- | ------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `POST`   | `/seat-holds`              | User, Guest session | `SeatHoldRequest`, `Idempotency-Key` | `SeatHoldResponse` với `expiresAt` 10 phút | `SEAT_NOT_AVAILABLE`, `SEAT_HOLD_CONFLICT`, `TRIP_NOT_FOR_SALE`, `IDEMPOTENCY_CONFLICT` |
| `GET`    | `/seat-holds/{seatHoldId}` | Hold owner          | Hold id                              | Hold status/expiresAt/seat list            | `PERMISSION_DENIED`, `SEAT_HOLD_EXPIRED`                                                |
| `DELETE` | `/seat-holds/{seatHoldId}` | Hold owner          | Hold id                              | Released status                            | `SEAT_HOLD_ALREADY_CONSUMED`, `SEAT_HOLD_EXPIRED`                                       |

Rule:

- Hold là all-or-nothing theo danh sách ghế.
- Hold chỉ cho trip đang `OPEN_FOR_SALE`, chưa hết sale window, seat không `BOOKED`/`BLOCKED`/active hold của actor khác.
- Guest hold phải gắn guest session Web Marketplace.

### 12.3. Booking và promotion apply

| Method   | Path                                    | Actor                                             | Request                                             | Response                                           | Trace                   |
| -------- | --------------------------------------- | ------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------- | ----------------------- |
| `POST`   | `/bookings`                             | User, Guest session                               | `CreateBookingRequest`, `Idempotency-Key`           | `BookingSummary` status `PENDING_PAYMENT`          | UC-05, BR-21, BR-24..26 |
| `GET`    | `/bookings/{bookingId}`                 | Owner/User, verified Guest, scoped Operator/Admin | Booking id                                          | Booking detail theo scope/masking                  | FR-MKT-11, UC-07        |
| `POST`   | `/bookings/{bookingId}/promotion:apply` | Booking owner                                     | `promotionCode`, current booking version            | Repriced booking preview/snapshot candidate        | FR-PROM-05              |
| `DELETE` | `/bookings/{bookingId}/promotion`       | Booking owner                                     | Current booking version                             | Booking preview without promotion                  | FR-PROM-05..06          |
| `POST`   | `/bookings/{bookingId}:cancel`          | User, verified Guest, Admin                       | Ticket ids optional, reason, verification challenge | Cancel/refund eligibility result or refund request | UC-08, BR-06..07        |

Booking create phải consume SeatHold còn `ACTIVE`, lưu snapshot trip/Operator/route/stop/seat/fare/promotion/refund policy/passenger/contact/amount và không áp policy mới ngược về booking cũ.

### 12.4. Payment

| Method | Path                                   | Actor                        | Request                                   | Response                                         | Trace     |
| ------ | -------------------------------------- | ---------------------------- | ----------------------------------------- | ------------------------------------------------ | --------- |
| `POST` | `/bookings/{bookingId}/payments`       | Booking owner                | `CreatePaymentRequest`, `Idempotency-Key` | `PaymentResponse`, redirect URL nếu provider cần | FR-BTP-07 |
| `GET`  | `/payments/{paymentId}`                | Owner, scoped Operator/Admin | Payment id                                | Payment status safe view                         | FR-BTP-17 |
| `GET`  | `/bookings/{bookingId}/payment-status` | Booking owner                | Booking id                                | Latest payment/booking status                    | HLD §6.5  |
| `POST` | `/payments/{paymentId}:cancel`         | Booking owner/System         | Reason                                    | Cancelled/unchanged status                       | BR-27     |

Không tạo payment mới nếu booking đã `EXPIRED`, `CANCELLED`, `PAID`, `CONFIRMED` hoặc không còn hold/payment deadline hợp lệ. Callback provider không đi qua client; client chỉ đọc trạng thái đã được backend xác minh.

### 12.5. Ticket và Guest lookup

| Method | Path                              | Actor                                                      | Request                          | Response                           | Trace        |
| ------ | --------------------------------- | ---------------------------------------------------------- | -------------------------------- | ---------------------------------- | ------------ |
| `GET`  | `/tickets/{ticketId}`             | User owner, verified Guest, scoped Operator/Admin/Employee | Ticket id                        | `TicketView` theo scope            | FR-BTP-11    |
| `GET`  | `/tickets/by-code/{ticketCode}`   | Verified Guest/User/Employee scoped                        | Ticket code + verification/scope | Ticket safe view                   | UC-35, UC-20 |
| `GET`  | `/bookings/by-code/{bookingCode}` | Verified Guest/User/Admin                                  | Booking code + verified contact  | Booking safe view                  | UC-35        |
| `POST` | `/tickets/{ticketId}:cancel`      | User, verified Guest, Admin                                | Reason, verification challenge   | Cancel/refund result               | UC-08        |
| `GET`  | `/tickets/{ticketId}/qr-display`  | Ticket owner/verified Guest                                | Ticket id                        | QR display payload, not raw secret | BR-29        |

QR token phải không đoán được, verify server-side và không được log raw secret.

---

## 13. Endpoint catalog - User account, ticket và notification

| Method   | Path                                 | Actor | Mục đích                                           | Trace            |
| -------- | ------------------------------------ | ----- | -------------------------------------------------- | ---------------- |
| `GET`    | `/users/me`                          | User  | Xem profile cá nhân                                | FR-IAM-11        |
| `PATCH`  | `/users/me`                          | User  | Cập nhật profile trong phạm vi được phép           | FR-IAM-11        |
| `GET`    | `/users/me/bookings`                 | User  | Lịch sử booking/ticket/payment/refund              | FR-MKT-11        |
| `GET`    | `/users/me/passengers`               | User  | Danh sách passenger info thường dùng               | FR-MKT-13        |
| `POST`   | `/users/me/passengers`               | User  | Tạo passenger info thường dùng                     | FR-MKT-13        |
| `PATCH`  | `/users/me/passengers/{passengerId}` | User  | Cập nhật passenger info                            | FR-MKT-13        |
| `DELETE` | `/users/me/passengers/{passengerId}` | User  | Deactivate passenger info                          | FR-MKT-13        |
| `GET`    | `/users/me/notifications`            | User  | Xem notification/in-app delivery                   | FR-NSR-01..05    |
| `GET`    | `/users/me/notification-preferences` | User  | Xem preference không bắt buộc                      | FR-NSR-14        |
| `PUT`    | `/users/me/notification-preferences` | User  | Cập nhật preference; mandatory không tắt hoàn toàn | BR-52            |
| `POST`   | `/reviews`                           | User  | Gửi review khi ticket hợp lệ và trip completed     | FR-NSR-10, BR-18 |
| `GET`    | `/reviews/me`                        | User  | Xem review đã gửi                                  | FR-NSR-10        |

Guest không có `/users/me/*` và không được gửi review trong V1.

---

## 14. Endpoint catalog - Operator onboarding và resource

### 14.1. Operator profile, KYC và bank account

| Method  | Path                                             | Actor    | Mục đích                                | Trace                |
| ------- | ------------------------------------------------ | -------- | --------------------------------------- | -------------------- |
| `POST`  | `/operators/onboarding/profile`                  | Operator | Gửi hồ sơ tham gia nền tảng             | FR-OPR-01..02        |
| `GET`   | `/operator/profile`                              | Operator | Xem hồ sơ Operator của mình             | FR-OPR-02, FR-OPR-05 |
| `PATCH` | `/operator/profile`                              | Operator | Cập nhật hồ sơ, không tự đổi status KYC | FR-OPR-02            |
| `POST`  | `/operator/kyc-documents/upload-intents`         | Operator | Tạo signed upload URL cho KYC           | FR-OPR-03, DB §16    |
| `POST`  | `/operator/kyc-documents/{attachmentId}:confirm` | Operator | Confirm upload metadata KYC             | FR-OPR-03            |
| `GET`   | `/operator/kyc-documents`                        | Operator | Xem hồ sơ KYC và scan status            | FR-OPR-05            |
| `POST`  | `/operator/bank-accounts/change-requests`        | Operator | Gửi yêu cầu tạo/đổi tài khoản nhận tiền | FR-OPR-04, BR-37     |
| `GET`   | `/operator/bank-accounts`                        | Operator | Xem bank account masked/snapshot        | FR-OPR-04            |

### 14.2. Vehicle, seat map, route và StopPoint proposal

| Method  | Path                                        | Actor    | Mục đích                                  | Trace            |
| ------- | ------------------------------------------- | -------- | ----------------------------------------- | ---------------- |
| `GET`   | `/operator/vehicles`                        | Operator | List vehicle tenant-scoped                | FR-OPS-01        |
| `POST`  | `/operator/vehicles`                        | Operator | Tạo vehicle                               | FR-OPS-01..02    |
| `GET`   | `/operator/vehicles/{vehicleId}`            | Operator | Xem vehicle                               | FR-OPS-01        |
| `PATCH` | `/operator/vehicles/{vehicleId}`            | Operator | Cập nhật vehicle với version              | FR-OPS-02        |
| `POST`  | `/operator/vehicles/{vehicleId}:set-status` | Operator | Đổi trạng thái vận hành có reason nếu cần | BR-14            |
| `GET`   | `/operator/seat-maps`                       | Operator | List seat map                             | FR-OPS-03        |
| `POST`  | `/operator/seat-maps`                       | Operator | Tạo seat map                              | FR-OPS-03        |
| `PATCH` | `/operator/seat-maps/{seatMapId}`           | Operator | Cập nhật seat map với version             | BR-20            |
| `GET`   | `/operator/routes`                          | Operator | List route tenant-scoped                  | FR-OPS-04        |
| `POST`  | `/operator/routes`                          | Operator | Tạo route từ catalog stop points          | FR-OPS-04        |
| `PATCH` | `/operator/routes/{routeId}`                | Operator | Cập nhật route với version                | FR-OPS-04        |
| `POST`  | `/operator/stop-point-proposals`            | Operator | Đề xuất StopPoint mới                     | FR-OPS-05, BR-38 |
| `GET`   | `/operator/stop-point-proposals`            | Operator | Theo dõi proposal của mình                | FR-OPS-05        |

Resource Operator luôn tenant-scoped; server resolve `operatorId` từ session, không tin `operatorId` client gửi.

---

## 15. Endpoint catalog - Operator trip, booking và finance

### 15.1. Trip, fare và inventory

| Method  | Path                                             | Actor    | Mục đích                                                 | Trace                   |
| ------- | ------------------------------------------------ | -------- | -------------------------------------------------------- | ----------------------- |
| `GET`   | `/operator/trips`                                | Operator | List/filter trip thuộc nhà xe                            | FR-OPS-06..10           |
| `POST`  | `/operator/trips`                                | Operator | Tạo trip draft                                           | FR-OPS-06               |
| `GET`   | `/operator/trips/{tripId}`                       | Operator | Xem trip detail vận hành                                 | FR-OPS-06               |
| `PATCH` | `/operator/trips/{tripId}`                       | Operator | Cập nhật trip chưa/đã bán với version; đã bán cần reason | FR-OPS-11               |
| `POST`  | `/operator/trips/{tripId}:open-for-sale`         | Operator | Mở bán sau validate route/vehicle/seat map/fare/KYC      | FR-OPS-10, BR-36, BR-39 |
| `POST`  | `/operator/trips/{tripId}:lock-sale`             | Operator | Khóa bán tạm thời có reason                              | FR-OPS-10               |
| `POST`  | `/operator/trips/{tripId}:cancel`                | Operator | Hủy chuyến, impact analysis, notification/refund path    | BR-10..12               |
| `POST`  | `/operator/trips/{tripId}:analyze-change-impact` | Operator | Preview affected bookings/tickets/holds/payments         | LLD §9.9                |
| `GET`   | `/operator/fare-rules`                           | Operator | List fare rule                                           | FR-OPS-08               |
| `POST`  | `/operator/fare-rules`                           | Operator | Tạo fare rule VND                                        | FR-OPS-08, BR-40        |
| `PATCH` | `/operator/fare-rules/{fareRuleId}`              | Operator | Cập nhật bằng version/effective time                     | BR-40                   |
| `POST`  | `/operator/trips/{tripId}/seats:block`           | Operator | Block ghế thủ công/bán ngoài kênh                        | FR-OPS-13, BR-42        |
| `POST`  | `/operator/trips/{tripId}/seats:release-block`   | Operator | Release ghế blocked nếu hợp lệ                           | FR-OPS-13               |

### 15.2. Operator booking, manifest và employee

| Method   | Path                                       | Actor    | Mục đích                                      | Trace             |
| -------- | ------------------------------------------ | -------- | --------------------------------------------- | ----------------- |
| `GET`    | `/operator/bookings`                       | Operator | Xem booking/ticket theo trip/ngày/status/kênh | FR-OPS-14         |
| `GET`    | `/operator/bookings/{bookingId}`           | Operator | Xem booking thuộc tenant với masking          | FR-OPS-14, BR-08  |
| `GET`    | `/operator/trips/{tripId}/manifest`        | Operator | Xem/export manifest theo quyền                | FR-OPS-15         |
| `POST`   | `/operator/trips/{tripId}/manifest:export` | Operator | Request export async                          | FR-OPS-15, DB §17 |
| `GET`    | `/operator/employees`                      | Operator | List Employee thuộc tenant                    | FR-IAM-05, UC-16  |
| `POST`   | `/operator/employees`                      | Operator | Tạo Employee account/role                     | UC-16             |
| `PATCH`  | `/operator/employees/{employeeId}`         | Operator | Update role/status, revoke session nếu cần    | FR-IAM-08, BR-43  |
| `POST`   | `/operator/employees/{employeeId}:lock`    | Operator | Khóa Employee với reason                      | FR-IAM-08         |
| `GET`    | `/operator/assignments`                    | Operator | List assignment                               | FR-EMP-03         |
| `POST`   | `/operator/assignments`                    | Operator | Phân công Employee vào trip/nhiệm vụ          | BR-13             |
| `DELETE` | `/operator/assignments/{assignmentId}`     | Operator | Hủy assignment nếu hợp lệ                     | BR-13             |

### 15.3. Operator finance, promotion, report

| Method  | Path                                             | Actor    | Mục đích                                  | Trace            |
| ------- | ------------------------------------------------ | -------- | ----------------------------------------- | ---------------- |
| `GET`   | `/operator/finance/escrow-ledger`                | Operator | Xem escrow ledger thuộc nhà xe            | FR-OPR-07        |
| `GET`   | `/operator/finance/commission`                   | Operator | Xem commission áp dụng và lịch sử         | FR-OPR-08        |
| `GET`   | `/operator/finance/payouts`                      | Operator | Xem payout/eligibility/history            | FR-OPR-07..09    |
| `POST`  | `/operator/finance/payout-requests`              | Operator | Yêu cầu payout sớm nếu policy cho phép    | FR-OPR-09, BR-34 |
| `GET`   | `/operator/reconciliation`                       | Operator | Xem đối soát giao dịch thuộc tenant       | FR-BTP-17        |
| `GET`   | `/operator/promotions`                           | Operator | List promotion thuộc tenant               | FR-PROM-04       |
| `POST`  | `/operator/promotions`                           | Operator | Tạo promotion nếu Platform cho phép       | FR-PROM-03..04   |
| `PATCH` | `/operator/promotions/{promotionId}`             | Operator | Cập nhật/tạm dừng/kết thúc theo guardrail | BR-46            |
| `GET`   | `/operator/promotions/{promotionId}/performance` | Operator | Hiệu quả promotion trong tenant           | FR-PROM-07       |
| `GET`   | `/operator/reports/dashboard`                    | Operator | Báo cáo vận hành/tài chính dashboard      | FR-NSR-12        |
| `POST`  | `/operator/reports/exports`                      | Operator | Request export async                      | AC-30            |

---

## 16. Endpoint catalog - Employee operations

### 16.1. Assignment, manifest và check-in

| Method | Path                                           | Actor             | Mục đích                                   | Trace            |
| ------ | ---------------------------------------------- | ----------------- | ------------------------------------------ | ---------------- |
| `GET`  | `/employee/assignments`                        | Employee          | Xem nhiệm vụ/chuyến được phân công         | FR-EMP-03        |
| `GET`  | `/employee/trips/{tripId}`                     | Employee assigned | Xem chi tiết chuyến vận hành               | FR-EMP-04        |
| `GET`  | `/employee/trips/{tripId}/manifest`            | Employee assigned | Xem danh sách khách, phone masked mặc định | FR-EMP-05, BR-19 |
| `GET`  | `/employee/trips/{tripId}/manifest:search`     | Employee assigned | Tìm khách bằng tên/phone được phép/mã vé   | FR-EMP-06        |
| `POST` | `/employee/tickets:verify`                     | Employee assigned | Verify QR/mã vé server-side                | FR-EMP-07, BR-29 |
| `POST` | `/employee/check-ins`                          | Employee assigned | Check-in ticket/passenger, idempotent      | FR-EMP-08, BR-44 |
| `POST` | `/employee/check-ins/{checkInId}:mark-no-show` | Employee assigned | Ghi no-show nếu policy cho phép            | FR-EMP-08        |

### 16.2. Trip operation, journey log, incident và offline sync

| Method | Path                                                          | Actor             | Mục đích                                                            | Trace                |
| ------ | ------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------- | -------------------- |
| `POST` | `/employee/trips/{tripId}:update-operation-status`            | Employee assigned | Cập nhật BOARDING/DEPARTED/IN_PROGRESS/COMPLETED/INCIDENT theo role | FR-EMP-09            |
| `POST` | `/employee/trips/{tripId}/journey-logs`                       | Employee assigned | Ghi nhật trình chuyến                                               | FR-EMP-10            |
| `POST` | `/employee/incidents`                                         | Employee assigned | Báo cáo sự cố                                                       | FR-EMP-11            |
| `POST` | `/employee/incidents/{incidentId}/attachments/upload-intents` | Employee assigned | Tạo upload intent attachment sự cố                                  | FR-EMP-11, DB §16    |
| `POST` | `/employee/offline-operations:sync`                           | Employee          | Sync queued check-in/no-show/journey/incident                       | HLD-OQ-04, LLD §9.10 |
| `GET`  | `/employee/offline-operations/{localOperationId}`             | Employee          | Xem kết quả sync/conflict                                           | LLD §9.10            |

Offline operation payload tối thiểu: `localOperationId`, `operationType`, `baseVersion`, `occurredAt`, `tripId`, `ticketId` nếu có, `assignmentId`, safe payload và idempotency key. Server quyết định accept/reject/conflict.

---

## 17. Endpoint catalog - Support, complaint, dispute và review

### 17.1. Support và complaint

| Method | Path                                   | Actor                                 | Mục đích                                                  | Trace            |
| ------ | -------------------------------------- | ------------------------------------- | --------------------------------------------------------- | ---------------- |
| `GET`  | `/support/tickets`                     | User, verified Guest, Operator, Admin | List ticket theo scope                                    | FR-NSR-06..08    |
| `POST` | `/support/tickets`                     | User, verified Guest                  | Tạo support ticket gắn booking/ticket/payment/trip nếu có | FR-NSR-06, BR-49 |
| `GET`  | `/support/tickets/{ticketId}`          | Scoped actors                         | Xem ticket và lịch sử                                     | FR-NSR-09        |
| `POST` | `/support/tickets/{ticketId}/messages` | Scoped actors                         | Gửi message/attachment ref                                | FR-NSR-09        |
| `POST` | `/support/tickets/{ticketId}:close`    | Owner/Admin                           | Đóng ticket nếu policy cho phép                           | SRS §17.11       |
| `POST` | `/complaints`                          | User, verified Guest                  | Tạo complaint                                             | FR-NSR-06        |
| `GET`  | `/complaints/{complaintId}`            | Scoped actors                         | Xem complaint                                             | FR-NSR-07..08    |

### 17.2. Dispute

| Method | Path                                            | Actor                                  | Mục đích                                                    | Trace            |
| ------ | ----------------------------------------------- | -------------------------------------- | ----------------------------------------------------------- | ---------------- |
| `POST` | `/disputes`                                     | Admin, System, scoped User/Guest entry | Tạo DisputeCase từ support/complaint/booking/ticket/payment | FR-DSP-01        |
| `GET`  | `/disputes`                                     | User, verified Guest, Operator, Admin  | List dispute theo scope                                     | FR-DSP-\*        |
| `GET`  | `/disputes/{disputeId}`                         | Scoped actors                          | Xem dispute detail/evidence/status                          | FR-DSP-02..04    |
| `POST` | `/disputes/{disputeId}/responses`               | User, verified Guest, Operator         | Gửi phản hồi/minh chứng                                     | FR-DSP-04        |
| `POST` | `/disputes/{disputeId}/evidence/upload-intents` | Scoped actors                          | Tạo upload intent evidence                                  | DB §16           |
| `POST` | `/disputes/{disputeId}:request-evidence`        | Admin                                  | Yêu cầu minh chứng, đặt deadline                            | FR-DSP-03        |
| `POST` | `/disputes/{disputeId}:transition`              | Admin/System                           | Đổi state có reason                                         | FR-DSP-05, BR-50 |
| `POST` | `/disputes/{disputeId}:decide`                  | Admin                                  | Quyết định refund/no refund/đổi vé/adjustment               | FR-DSP-06, BR-51 |

### 17.3. Review và scorecard

| Method | Path                                     | Actor       | Mục đích                                         | Trace                |
| ------ | ---------------------------------------- | ----------- | ------------------------------------------------ | -------------------- |
| `POST` | `/reviews`                               | User        | Tạo review nếu ticket hợp lệ/trip completed      | FR-NSR-10, BR-18     |
| `GET`  | `/operators/{operatorId}/reviews`        | Public/User | Xem review public hợp lệ                         | FR-MKT-06            |
| `POST` | `/operator/reviews/{reviewId}/responses` | Operator    | Phản hồi review thuộc nhà xe nếu policy cho phép | FR-OPR-10            |
| `GET`  | `/operators/{operatorId}/scorecard`      | Public/User | Xem scorecard public                             | FR-NSR-11, FR-NSR-15 |

Guest không tạo review trong V1.

---

## 18. Endpoint catalog - Admin governance

### 18.1. Admin dashboard, account và Operator governance

| Method | Path                                                             | Actor | Mục đích                                      | Trace            |
| ------ | ---------------------------------------------------------------- | ----- | --------------------------------------------- | ---------------- |
| `GET`  | `/admin/dashboard`                                               | Admin | Dashboard tổng quan theo quyền                | FR-ADM-01        |
| `GET`  | `/admin/accounts`                                                | Admin | Giám sát User/Operator/Employee/Admin account | FR-ADM-02        |
| `POST` | `/admin/accounts/{accountId}:lock`                               | Admin | Khóa tài khoản có reason, force logout        | FR-IAM-08, BR-57 |
| `POST` | `/admin/accounts/{accountId}:unlock`                             | Admin | Mở khóa có reason                             | FR-IAM-08        |
| `GET`  | `/admin/operators`                                               | Admin | List/filter Operator/KYC/status               | FR-ADM-03        |
| `GET`  | `/admin/operators/{operatorId}`                                  | Admin | Xem Operator detail/KYC/bank/account          | FR-ADM-03        |
| `POST` | `/admin/operators/{operatorId}/kyc:decide`                       | Admin | Approve/reject/request supplement/lock        | FR-ADM-03, BR-36 |
| `POST` | `/admin/operators/{operatorId}:lock`                             | Admin | Khóa Operator có reason/audit                 | BR-16            |
| `POST` | `/admin/operators/{operatorId}:unlock`                           | Admin | Mở khóa Operator                              | BR-16            |
| `POST` | `/admin/operators/{operatorId}/bank-accounts/{requestId}:decide` | Admin | Duyệt/từ chối đổi bank account                | BR-37            |

### 18.2. Catalog, policy, commission và promotion

| Method  | Path                                              | Actor | Mục đích                             | Trace          |
| ------- | ------------------------------------------------- | ----- | ------------------------------------ | -------------- |
| `GET`   | `/admin/catalog/{catalogType}`                    | Admin | List catalog chuẩn                   | FR-ADM-04      |
| `POST`  | `/admin/catalog/{catalogType}`                    | Admin | Tạo catalog item/version             | FR-ADM-04      |
| `PATCH` | `/admin/catalog/{catalogType}/{itemId}`           | Admin | Update/deactivate catalog item       | BR-38          |
| `GET`   | `/admin/stop-point-proposals`                     | Admin | List proposal từ Operator            | FR-ADM-05      |
| `POST`  | `/admin/stop-point-proposals/{proposalId}:decide` | Admin | Duyệt/từ chối StopPoint proposal     | FR-ADM-05      |
| `GET`   | `/admin/policies`                                 | Admin | List policy versions                 | FR-ADM-06      |
| `POST`  | `/admin/policies`                                 | Admin | Tạo policy version mới               | BR-07          |
| `POST`  | `/admin/policies/{policyId}:activate`             | Admin | Activate theo effective time         | FR-ADM-06      |
| `GET`   | `/admin/commission-rules`                         | Admin | List commission rules                | FR-ADM-07      |
| `POST`  | `/admin/commission-rules`                         | Admin | Tạo default/override commission rule | BR-31          |
| `PATCH` | `/admin/commission-rules/{ruleId}`                | Admin | Deactivate/update future rule        | BR-31          |
| `GET`   | `/admin/promotions`                               | Admin | List Platform/Operator promotions    | FR-ADM-12      |
| `POST`  | `/admin/promotions`                               | Admin | Tạo Platform promotion               | FR-PROM-01..02 |
| `POST`  | `/admin/promotions/{promotionId}:pause`           | Admin | Tạm dừng promotion                   | FR-PROM-02     |

### 18.3. Payment, refund, payout và reconciliation

| Method | Path                                              | Actor | Mục đích                                    | Trace            |
| ------ | ------------------------------------------------- | ----- | ------------------------------------------- | ---------------- |
| `GET`  | `/admin/payments`                                 | Admin | Giám sát payment/filter/reconciling         | FR-ADM-10        |
| `GET`  | `/admin/payments/{paymentId}`                     | Admin | Payment detail + safe callback history      | FR-BTP-17        |
| `POST` | `/admin/payments/{paymentId}:reconcile`           | Admin | Chạy/đưa vào reconciliation                 | UC-32            |
| `GET`  | `/admin/refunds`                                  | Admin | Giám sát refund                             | FR-ADM-10        |
| `POST` | `/admin/refunds/{refundId}:manual-decision`       | Admin | Duyệt/từ chối/mark result thủ công          | FR-BTP-14, BR-35 |
| `GET`  | `/admin/escrow-ledger`                            | Admin | Search ledger theo booking/payment/operator | BR-17, BR-30     |
| `GET`  | `/admin/payouts`                                  | Admin | List payout candidate/status                | FR-ADM-08        |
| `POST` | `/admin/payouts/{payoutId}:review`                | Admin | Review/hold/ready transfer                  | BR-32..33        |
| `POST` | `/admin/payouts/{payoutId}:confirm-bank-transfer` | Admin | Xác nhận đã chuyển khoản, proof/reference   | BR-32            |
| `POST` | `/admin/payouts/{payoutId}:mark-failed`           | Admin | Đánh dấu failed/on hold có reason           | BR-33            |
| `POST` | `/admin/reconciliation/jobs`                      | Admin | Tạo job đối soát payment/refund/payout      | UC-32            |

### 18.4. Content, notification, audit và report

| Method | Path                                                 | Actor | Mục đích                                                                | Trace     |
| ------ | ---------------------------------------------------- | ----- | ----------------------------------------------------------------------- | --------- |
| `GET`  | `/admin/content/reviews`                             | Admin | Kiểm duyệt review/nội dung vi phạm                                      | FR-ADM-13 |
| `POST` | `/admin/content/reviews/{reviewId}:moderate`         | Admin | Hide/approve/flag có reason                                             | AC-29     |
| `GET`  | `/admin/notifications/deliveries`                    | Admin | Giám sát delivery/retry/failure                                         | FR-NSR-03 |
| `POST` | `/admin/notifications/deliveries/{deliveryId}:retry` | Admin | Retry delivery nếu an toàn                                              | BR-54     |
| `GET`  | `/admin/audit-logs`                                  | Admin | Search audit log theo actor/action/target/time                          | FR-ADM-16 |
| `GET`  | `/admin/audit-logs/{auditLogId}`                     | Admin | Audit detail masked theo quyền                                          | UC-30     |
| `GET`  | `/admin/reports/dashboard`                           | Admin | Báo cáo toàn hệ thống                                                   | FR-NSR-13 |
| `POST` | `/admin/reports/exports`                             | Admin | Request report export async                                             | FR-ADM-17 |
| `GET`  | `/admin/integrations/status`                         | Admin | Trạng thái provider/payment/notification/storage/routing ở mức vận hành | FR-ADM-15 |
| `POST` | `/admin/system/maintenance`                          | Admin | Cấu hình trạng thái bảo trì/thông báo liên quan                         | FR-ADM-14 |

---

## 19. File, attachment và report export API

### 19.1. Upload intent flow

| Bước | API                                                                                            | Quy tắc                                                                        |
| ---- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1    | `POST /files/upload-intents` hoặc endpoint scoped như `/operator/kyc-documents/upload-intents` | Kiểm actor, purpose, owner, content type, size, checksum.                      |
| 2    | Client upload binary tới signed URL                                                            | Upload URL TTL mặc định 15 phút.                                               |
| 3    | `POST /files/{attachmentId}:confirm-upload`                                                    | Confirm object key/checksum/size/contentType.                                  |
| 4    | Scan gate xử lý                                                                                | Private file chỉ đọc được khi `scanStatus = CLEAN` hoặc Admin quarantine role. |
| 5    | `GET /files/{attachmentId}/download-url`                                                       | Private download signed URL TTL mặc định 5 phút; report export 10 phút.        |

### 19.2. Generic file endpoints

| Method | Path                                   | Actor                   | Mục đích                                           |
| ------ | -------------------------------------- | ----------------------- | -------------------------------------------------- |
| `POST` | `/files/upload-intents`                | Authenticated scoped    | Tạo upload intent cho purpose được phép.           |
| `POST` | `/files/{attachmentId}:confirm-upload` | Uploader/scoped service | Confirm metadata sau upload.                       |
| `GET`  | `/files/{attachmentId}`                | Scoped actors           | Xem metadata attachment.                           |
| `GET`  | `/files/{attachmentId}/download-url`   | Scoped actors           | Lấy signed download URL khi `scanStatus` cho phép. |
| `POST` | `/files/{attachmentId}:quarantine`     | Admin/System            | Quarantine/reject file có reason.                  |

`purpose` hợp lệ gồm `KYC_DOCUMENT`, `SUPPORT_ATTACHMENT`, `DISPUTE_EVIDENCE`, `INCIDENT_EVIDENCE`, `REPORT_EXPORT`, `PUBLIC_ASSET`. API không expose public-read cho file private.

### 19.3. Report export

| Method | Path                                       | Actor                      | Mục đích                                 |
| ------ | ------------------------------------------ | -------------------------- | ---------------------------------------- |
| `POST` | `/operator/reports/exports`                | Operator                   | Tạo export thuộc tenant.                 |
| `POST` | `/admin/reports/exports`                   | Admin                      | Tạo export toàn hệ thống theo quyền.     |
| `GET`  | `/reports/exports/{exportId}`              | Request owner/Admin scoped | Xem trạng thái export/job/file metadata. |
| `GET`  | `/reports/exports/{exportId}/download-url` | Request owner/Admin scoped | Signed URL 10 phút nếu export ready.     |

Report export object giữ 30 ngày; metadata/export audit giữ 24 tháng.

---

## 20. Webhook, callback và external adapter API

### 20.1. Payment callback

| Method | Path                                    | Caller                                  | Contract                                                                            | Trace            |
| ------ | --------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------- | ---------------- |
| `POST` | `/webhooks/payments/vnpay`              | VNPay Sandbox / Payment adapter ingress | Nhận callback, verify signature/source, normalize, idempotency, dispatch processing | OQ-05, FR-BTP-08 |
| `GET`  | `/payments/{paymentId}/provider-return` | User/Guest browser return               | Landing/read-only flow để client reload payment status từ backend                   | HLD §6.5         |

Callback handler phải:

- Verify chữ ký/source theo provider.
- Kiểm `paymentId`, `bookingId`, amount VND, provider transaction id và status.
- Lưu digest/safe payload, không lưu raw sensitive payload.
- Apply state transition idempotent.
- Đưa vào `RECONCILING` khi callback trễ, trùng, lệch amount/status hoặc booking state không khớp.

`API-OP-03` cần reviewer/Security/Payment integration chốt exact VNPay parameter mapping, secret rotation, return URL và callback allowlist.

### 20.2. Refund và bank payout callback

| Integration              | API V1 contract                                                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Refund provider callback | Chưa chốt provider-specific callback ngoài payment adapter; refund result có thể do job/Admin cập nhật. Nếu provider callback được bật, phải dùng idempotency và safe payload như payment. |
| Bank payout channel      | V1 là chuyển khoản ngân hàng trực tiếp, Admin xác nhận thủ công qua `/admin/payouts/{payoutId}:confirm-bank-transfer`; không có bank webhook baseline.                                     |

### 20.3. Notification, storage và routing adapter API

Các adapter này không expose public webhook baseline trong API V1. Delivery result, scan result hoặc routing failure được ghi qua internal trusted command/job với audit/safe payload. Nếu triển khai provider webhook thật, phải mở OP riêng hoặc cập nhật API Spec sau review.

---

## 21. Realtime event contract

### 21.1. Nguyên tắc realtime

- Realtime event chỉ giúp client invalidate/update UI; state cuối cùng phải query được qua REST API.
- Event payload tối thiểu, có scope người nhận, không chứa PII/tài chính ngoài quyền.
- Event transport, auth handshake và fallback khi mất kết nối chưa được ADR/Security chốt; ghi `API-OP-02`.
- Client không được dùng event như bằng chứng thanh toán/ticket nếu chưa reload API state.

### 21.2. Event envelope

```json
{
  "eventId": "evt_123",
  "eventName": "booking.status.updated",
  "occurredAt": "2026-05-13T08:30:00Z",
  "scope": {
    "actorType": "User",
    "actorId": "user_123",
    "operatorId": null
  },
  "data": {
    "resourceType": "Booking",
    "resourceId": "booking_123",
    "status": "CONFIRMED",
    "version": 4
  },
  "meta": {
    "requestId": "req_01HZX..."
  }
}
```

### 21.3. Event catalog

| Event                            | Người nhận                                   | Data tối thiểu                                                        | Trace     |
| -------------------------------- | -------------------------------------------- | --------------------------------------------------------------------- | --------- |
| `seat-hold.status.updated`       | Hold owner, Operator scoped nếu cần          | `seatHoldId`, `tripId`, `seatCodes`, `status`, `expiresAt`, `version` | UC-04     |
| `trip-seat.availability.updated` | User/Guest session, Operator                 | `tripId`, `seatCodes`, `statusSummary`, `version`                     | BR-01     |
| `booking.status.updated`         | User/Guest verified, Operator scoped         | `bookingId`, `bookingCode`, `status`, `version`                       | UC-05..07 |
| `payment.status.updated`         | User/Guest, Operator, Admin                  | `paymentId`, `paymentCode`, `status`, `bookingId`                     | UC-06     |
| `ticket.issued`                  | User/Guest, Operator                         | `ticketId`, `ticketCode`, `bookingId`, `status`                       | UC-07     |
| `refund.status.updated`          | User/Guest, Operator, Admin                  | `refundId`, `refundCode`, `status`, `amountVnd` if allowed            | UC-08     |
| `trip.operation.updated`         | Operator, Employee assigned, Admin           | `tripId`, `status`, `reasonCategory`, `version`                       | UC-21     |
| `employee.assignment.updated`    | Employee                                     | `assignmentId`, `tripId`, `status`, `version`                         | UC-18     |
| `manifest.updated`               | Operator, Employee assigned, Admin if needed | `tripId`, `manifestVersion`, `changeSummary`                          | UC-19     |
| `check-in.status.updated`        | Operator, Employee assigned                  | `tripId`, `ticketId`, `checkInStatus`, `version`                      | UC-20     |
| `support.status.updated`         | Scoped case participants                     | `supportTicketId`, `status`, `version`                                | UC-09     |
| `dispute.status.updated`         | Scoped participants                          | `disputeId`, `status`, `deadlineAt`, `version`                        | UC-27     |
| `notification.delivery.updated`  | Actor owner/Admin                            | `notificationId`, `deliveryStatus`, `channel`                         | UC-31     |
| `job.status.updated`             | Admin/request owner                          | `jobId`, `jobType`, `status`, `resultSummary`                         | UC-32     |

---

## 22. Background job, reconciliation và audit API

### 22.1. Job API

| Method | Path                                     | Actor                      | Mục đích                                  |
| ------ | ---------------------------------------- | -------------------------- | ----------------------------------------- |
| `GET`  | `/jobs/{jobId}`                          | Request owner/Admin scoped | Xem trạng thái job.                       |
| `GET`  | `/admin/jobs`                            | Admin                      | List/filter job theo type/status/scope.   |
| `POST` | `/admin/jobs/{jobId}:rerun`              | Admin                      | Chạy lại job theo checkpoint/idempotency. |
| `POST` | `/admin/jobs/{jobId}:mark-manual-review` | Admin/System               | Đưa job vào manual review có reason.      |

Job state dùng enum SRS: `PENDING`, `RUNNING`, `SUCCEEDED`, `PARTIAL`, `FAILED`, `RETRYING`, `MANUAL_REVIEW`.

### 22.2. Reconciliation API

| Method | Path                                                   | Actor | Mục đích                                      |
| ------ | ------------------------------------------------------ | ----- | --------------------------------------------- |
| `GET`  | `/admin/reconciliation-records`                        | Admin | List record payment/refund/payout lệch.       |
| `GET`  | `/admin/reconciliation-records/{recordId}`             | Admin | Detail safe payload, internal/provider state. |
| `POST` | `/admin/reconciliation-records/{recordId}:resolve`     | Admin | Resolve bằng quyết định có reason/audit.      |
| `POST` | `/admin/reconciliation-records/{recordId}:rerun-check` | Admin | Chạy lại kiểm tra provider/ledger.            |

### 22.3. Audit API

Audit query chỉ dành cho Admin có quyền. API phải hỗ trợ filter tối thiểu:

| Filter                   | Ghi chú                                      |
| ------------------------ | -------------------------------------------- |
| `actorType`, `actorId`   | Ai thao tác.                                 |
| `action`                 | Loại action, ví dụ `REFUND_MANUAL_DECISION`. |
| `targetType`, `targetId` | Đối tượng tác động.                          |
| `operatorId`             | Tenant liên quan nếu có.                     |
| `from`, `to`             | Khoảng thời gian UTC.                        |
| `result`                 | Success/denied/failed.                       |
| `requestId`              | Correlation.                                 |

Audit export là thao tác nhạy cảm, phải có reason, scope, masking và audit ngược.

---

## 23. Security, privacy và logging constraint

| ID         | Constraint API                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| API-SEC-01 | Mọi endpoint không public phải qua auth/session/verified guest context.                                                 |
| API-SEC-02 | Mọi endpoint tenant data phải enforce `operatorId` từ context, không tin client gửi.                                    |
| API-SEC-03 | Employee endpoint phải enforce role và assignment scope.                                                                |
| API-SEC-04 | Guest lookup phải dùng booking/ticket code + contact verification; không lookup broad theo phone/email.                 |
| API-SEC-05 | Response cho Employee mặc định mask phone/PII theo policy.                                                              |
| API-SEC-06 | Không log plaintext password, OTP, session token, QR raw secret, provider secret, payment sensitive payload.            |
| API-SEC-07 | Mutation ảnh hưởng tiền/vé/ghế/refund/payout/policy/trip đã bán phải có idempotency và audit/operation log phù hợp.     |
| API-SEC-08 | File private chỉ readable khi scan `CLEAN`, trừ Admin quarantine role.                                                  |
| API-SEC-09 | Error không được leak resource tồn tại khi actor không có quyền.                                                        |
| API-SEC-10 | Rate limit bắt buộc cho login, OTP, search, hold, payment creation, guest lookup, upload và support/dispute attachment. |

---

## 24. Traceability, rủi ro và Open Points

### 24.1. Traceability nhanh

| API area                          | FR/UC/BR chính                                                | Endpoint group |
| --------------------------------- | ------------------------------------------------------------- | -------------- |
| Identity/session                  | FR-IAM-01..16, UC-01                                          | §11            |
| Search/detail                     | FR-MKT-01..06, UC-02..03, BR-22..23                           | §12.1          |
| SeatHold/booking/payment/ticket   | FR-MKT-07..12, FR-BTP-01..11, UC-04..07, BR-01..05, BR-21..30 | §12.2..12.5    |
| Cancel/refund                     | FR-BTP-12..14, UC-08, BR-06..07, BR-35                        | §12.3, §18.3   |
| Operator onboarding/resource/trip | FR-OPR-01..11, FR-OPS-01..15, UC-10..16, BR-36..43            | §14, §15       |
| Employee operation                | FR-EMP-01..13, UC-18..22, BR-43..45                           | §16            |
| Support/dispute/review            | FR-NSR-06..11, FR-DSP-01..08, UC-09, UC-27, BR-49..51         | §17            |
| Admin governance                  | FR-ADM-01..17, UC-23..30                                      | §18            |
| File/report export                | HLD-OQ-01, DB §16..18, AC-30                                  | §19            |
| Webhook/reconciliation/job        | FR-BTP-08..17, UC-31..32, BR-17, BR-27..30, BR-62..63         | §20, §22       |
| Realtime                          | HLD §12, LLD §7.5                                             | §21            |

### 24.2. Rủi ro API còn lại

| ID          | Rủi ro                                                                                | Mức     | Giảm thiểu trong API Spec                                                                     |
| ----------- | ------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------- |
| API-RISK-01 | Endpoint checkout thiếu idempotency gây bán trùng ghế hoặc tạo trùng booking/payment. | Rất cao | `Idempotency-Key` bắt buộc cho hold/booking/payment/refund/job; error `IDEMPOTENCY_CONFLICT`. |
| API-RISK-02 | Guest lookup leak dữ liệu vé/booking.                                                 | Rất cao | Lookup bằng code + contact verification; không broad lookup; rate limit; masking.             |
| API-RISK-03 | Payment callback trễ/trùng/lệch làm phát hành vé sai.                                 | Rất cao | Verify signature/amount/transaction, idempotent, `RECONCILING` khi lệch.                      |
| API-RISK-04 | Operator/Employee vượt tenant hoặc assignment.                                        | Rất cao | Actor context server-side; `operatorId` không lấy từ client; endpoint scoped riêng.           |
| API-RISK-05 | File private bị đọc trước scan hoặc URL sống quá lâu.                                 | Cao     | Upload/download signed URL TTL từ DB; scan gate; no public-read.                              |
| API-RISK-06 | Realtime event chứa PII hoặc bị client coi là source of truth.                        | Cao     | Payload tối thiểu; REST là source of truth; OP chốt transport/auth.                           |
| API-RISK-07 | Auth transport chưa chốt khiến FE/Mobile triển khai lệch.                             | Cao     | Ghi `API-OP-01`, không hard-code cookie/Bearer trong contract final.                          |

### 24.3. Open Points cần reviewer giải quyết

| ID        | Quyết định xử lý                                                                                                           | Tác động                                                            | Owner đề xuất                | Trạng thái       |
| :-------- | :------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ | :--------------------------- | :--------------- |
| API-OP-01 | ĐÃ CHỐT: Chốt ở Security Design; API Spec giữ logical `Authorization`/session credential và endpoint verification như §11. | FE/Mobile auth, CSRF/CORS, secure storage, refresh/revoke tests.    | Security + Reviewer          | Close 13/05/2026 |
| API-OP-02 | ĐÃ CHỐT: Chốt bằng ADR/Security/API revision; hiện chỉ chốt event envelope và event catalog logic.                         | Web/Mobile realtime client, scaling, reconnect, authorization.      | ADR + Security + Reviewer    | Close 13/05/2026 |
| API-OP-03 | ĐÃ CHỐT: Payment integration spec cần bổ sung provider-specific appendix trước code payment.                               | Payment callback, reconciliation, security review, test sandbox.    | Backend/Payment + Security   | Close 13/05/2026 |
| API-OP-04 | ĐÃ CHỐT: Giữ API preference/delivery generic; chốt provider/template ở Notification/API revision hoặc Security/Operation.  | Mobile push, email delivery, retry budget, consent/preference test. | Product/Operation + Reviewer | Close 13/05/2026 |
| API-OP-05 | ĐÃ CHỐT: Chốt sau ADR backend framework/tooling; tài liệu này là source contract review trước mắt.                         | FE/Mobile integration workflow, contract test, CI validation.       | Tech Lead + Reviewer         | Close 13/05/2026 |

---

## 25. Phụ lục

### 25.1. State enum API phải dùng

API response `status` cho state nghiệp vụ phải bám các enum đã chốt:

- `Trip`: `DRAFT`, `OPEN_FOR_SALE`, `SOLD_OUT`, `LOCKED`, `BOARDING`, `DEPARTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `INCIDENT`.
- `TripSeat`: `AVAILABLE`, `HOLDING`, `BOOKED`, `CHECKED_IN`, `BLOCKED`.
- `SeatHold`: `ACTIVE`, `CONSUMED`, `RELEASED`, `EXPIRED`.
- `Booking`: `PENDING_PAYMENT`, `PENDING_CONFIRMATION`, `PAID`, `CONFIRMED`, `PARTIALLY_CANCELLED`, `CANCELLED`, `EXPIRED`, `REFUND_PENDING`, `REFUNDED`, `REFUND_FAILED`.
- `Ticket`: `VALID`, `CANCELLED`, `CHECKED_IN`, `NO_SHOW`, `USED`, `REFUNDED`.
- `Payment`: `INITIATED`, `PROCESSING`, `SUCCESS`, `FAILED`, `EXPIRED`, `CANCELLED`, `RECONCILING`.
- `Refund`: `REQUESTED`, `APPROVED`, `PROCESSING`, `SUCCESS`, `FAILED`, `REJECTED`.
- `Payout`: `PENDING_REVIEW`, `ON_HOLD`, `READY_TO_TRANSFER`, `TRANSFERRING`, `PAID`, `FAILED`, `CANCELLED`.
- `Support/Complaint`: `OPEN`, `TRIAGED`, `WAITING_USER`, `WAITING_OPERATOR`, `IN_PROGRESS`, `ESCALATED_TO_DISPUTE`, `RESOLVED`, `CLOSED`.
- `DisputeCase`: `OPEN`, `WAITING_USER_EVIDENCE`, `WAITING_OPERATOR_RESPONSE`, `UNDER_REVIEW`, `ESCALATED`, `RESOLVED_REFUND`, `RESOLVED_NO_REFUND`, `CLOSED`.
- `NotificationDelivery`: `PENDING`, `SENT`, `FAILED`, `RETRYING`, `SKIPPED`.
- `BackgroundJob`: `PENDING`, `RUNNING`, `SUCCEEDED`, `PARTIAL`, `FAILED`, `RETRYING`, `MANUAL_REVIEW`.

### 25.2. Endpoint path index rút gọn

| Layer                | Prefix chính                                                                        |
| -------------------- | ----------------------------------------------------------------------------------- |
| Public / Marketplace | `/catalog/*`, `/marketplace/*`, `/seat-holds`, `/bookings`, `/payments`, `/tickets` |
| User                 | `/users/me/*`, `/reviews`, `/support/*`, `/disputes/*` scoped                       |
| Operator OS          | `/operator/*`                                                                       |
| Employee             | `/employee/*`                                                                       |
| Admin                | `/admin/*`                                                                          |
| File                 | `/files/*` và endpoint upload intent scoped                                         |
| Webhook              | `/webhooks/*`                                                                       |
| Job/report           | `/jobs/*`, `/reports/exports/*`, `/admin/jobs/*`                                    |
