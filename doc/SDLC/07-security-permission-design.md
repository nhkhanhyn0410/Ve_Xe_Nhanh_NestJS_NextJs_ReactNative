# 07. Security & Permission Design - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| Tên tài liệu      | Security & Permission Design  |
| Mã tài liệu       | 07-security-permission-design |
| Dự án             | Hệ thống đặt vé xe khách      |
| Phiên bản         | v1.0                          |
| Trạng thái        | Draft                         |
| Người viết        | AI Agent, Nguyễn Hồng Khanh   |
| Người duyệt       | Nguyễn Hồng Khanh             |
| Ngày tạo          | 11/05/2026                    |
| Cập nhật gần nhất | 13/05/2026                    |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                                                                                                                                    |
| --------- | ---------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0      | 13/05/2026 | AI Agent       | Viết lại toàn bộ Security & Permission Design từ tài liệu Approved 01/02/03/04/05; chốt baseline backend V1 cho auth, RBAC, tenant, data protection. |
| v0.2      | 12/05/2026 | AI Agent       | Đồng bộ quyết định S3-compatible object storage từ HLD/LLD.                                                                                          |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp Security & Permission Design.                                                                                                           |

### 1.3. Trạng thái sử dụng

Tài liệu này ở trạng thái `Draft`. Nội dung v1.0 đủ chi tiết để làm baseline review và chuẩn bị triển khai Backend V1 cho các chức năng có xác thực, phân quyền, dữ liệu cá nhân, thanh toán, vé, hoàn tiền, payout, KYC, attachment, audit và provider callback. Theo quy chuẩn SDLC, tài liệu vẫn cần người duyệt chuyển trạng thái trước khi được xem là nguồn triển khai chính thức.

Tài liệu này KHÔNG dựa vào source code hiện tại. Nguồn thiết kế là các tài liệu SDLC đã `Approved` theo `PROJECT-STATE`: SRS v1.20, HLD v1.13, LLD v1.2, Database Design v1.4 và API Specification v1.1, cộng với context chính thức `GLOSSARY`, `DOMAIN-MAP` và `PROJECT-STATE`.

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Nguồn đầu vào và baseline bảo mật
5. Trust boundary và actor context
6. Authentication, session và credential transport
7. Authorization, RBAC và scope guard
8. Permission matrix Backend V1
9. Sensitive action, re-auth và MFA
10. Guest verification và anti-enumeration
11. Data protection, masking và secret handling
12. File, attachment và signed URL security
13. External provider, webhook và realtime security
14. Audit, security logging và retention
15. Rate limit, abuse control và threat control
16. Security acceptance baseline cho backend
17. Traceability, rủi ro và OP
18. Phụ lục

---

## 3. Giới thiệu

### 3.1. Mục đích

Tài liệu này chuyển các yêu cầu bảo mật, phân quyền và bảo vệ dữ liệu đã chốt trong SRS/HLD/LLD/DB/API thành rule triển khai cho Backend V1. Backend là điểm quyết định cuối cùng cho authentication, RBAC, tenant boundary, assignment scope, ownership, state policy, dữ liệu nhạy cảm, audit và provider callback.

### 3.2. Đối tượng đọc

| Đối tượng       | Mục đích đọc                                                                  |
| --------------- | ----------------------------------------------------------------------------- |
| Backend dev     | Triển khai guard, session, policy, service, audit và security test.           |
| QA / Security   | Viết test RBAC, IDOR, Guest lookup, rate limit, webhook, masking và audit.    |
| Frontend/Mobile | Hiểu contract token, re-auth, permission error và dữ liệu được phép hiển thị. |
| Người duyệt     | Kiểm tra baseline bảo mật không vượt phạm vi tài liệu Approved.               |

### 3.3. Phạm vi

Trong phạm vi:

- Actor boundary: `Guest`, `User`, `Operator`, `Employee`, `Admin`, `System`, external provider.
- Session/token baseline, refresh/revoke/force logout và multi-device policy.
- RBAC, tenant boundary theo `operatorId`, assignment scope và object ownership.
- Permission matrix theo nhóm chức năng Backend V1.
- Sensitive action challenge, Admin MFA, Operator bank-account verification, Guest verification.
- Masking dữ liệu cá nhân, QR/token/OTP/secret handling, file private, signed URL và scan gate.
- Security logging, audit retention, rate limit, threat controls và test baseline.

Ngoài phạm vi:

| Ngoài phạm vi                                          | Tài liệu / owner nhận                      |
| ------------------------------------------------------ | ------------------------------------------ |
| UI screen flow, form state, copy lỗi                   | `06-ui-ux-flow-specification.md`           |
| Test case chi tiết, test data và exit criteria         | `08-test-plan-acceptance-criteria.md`      |
| Deployment target, secret manager, WAF/CDN, monitoring | `09-deployment-operation-standard.md`      |
| Framework guard class, middleware, decorator cụ thể    | Implementation task / code review          |
| Tư vấn pháp lý về dữ liệu cá nhân, vận tải, hóa đơn    | Legal / compliance review trước production |

---

## 4. Nguồn đầu vào và baseline bảo mật

### 4.1. Nguồn được dùng

| Nguồn                                      | Trạng thái | Cách dùng trong tài liệu này                                                                 |
| ------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------- |
| `01-srs-he-thong-dat-ve-xe-khach.md` v1.20 | Approved   | Actor, FR-IAM, NFR-SEC/PRIV/AUDIT, BR, permission matrix, AC và decisions log.               |
| `02-hld-he-thong-dat-ve-xe-khach.md` v1.13 | Approved   | Actor boundary, authorization stack, integration boundary, realtime/job/security handoff.    |
| `03-lld-he-thong-dat-ve-xe-khach.md` v1.2  | Approved   | Request pipeline, actor context, PermissionService, GuestVerification, error/audit behavior. |
| `04-database-design.md` v1.4               | Approved   | Session TTL, retention, idempotency, file policy, audit retention và DB security fields.     |
| `05-api-specification.md` v1.1             | Approved   | Auth surface, headers, endpoint scope, API-SEC constraints, realtime và webhook contract.    |
| `context/GLOSSARY.md`                      | Context    | Thuật ngữ actor/entity/tenant/audit/notification thống nhất.                                 |
| `context/DOMAIN-MAP.md`                    | Context    | Mapping service layer, module group, actor client và target state enum.                      |
| `context/PROJECT-STATE.md`                 | Context    | Trạng thái tài liệu, quyết định đóng và blocker sau SRS.                                     |

### 4.2. Quy tắc xử lý mâu thuẫn nguồn

| Tình huống                                                  | Cách xử lý                                                                                     |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| SRS chốt nghiệp vụ, HLD/LLD/DB/API chốt chi tiết downstream | Giữ nghĩa nghiệp vụ của SRS, dùng tài liệu sau để cụ thể hóa guard, session, retention và API. |
| Tài liệu Approved mâu thuẫn với code hiện tại               | Không dùng code làm nguồn; ghi OP nếu mâu thuẫn làm chặn thiết kế.                             |
| API/DB có chi tiết bảo mật nhưng chưa có policy vận hành    | Security Design lấy baseline không yếu hơn API/DB; phần vận hành chuyển sang tài liệu `09`.    |
| Thiếu provider cụ thể cho email/SMS/push/monitoring         | Dùng adapter boundary; không chốt vendor mới trong tài liệu này.                               |

### 4.3. Baseline bảo mật V1

| ID        | Baseline                                                                                                                               | Nguồn                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| SEC-BL-01 | Backend là nơi enforce cuối cùng cho auth, RBAC, tenant, assignment, state, payment, refund, payout, audit và dữ liệu cá nhân.         | SRS §15, HLD §5.2, API §3.2      |
| SEC-BL-02 | Actor flow tách riêng: User/Guest, Operator, Employee, Admin; Operator/Employee/Admin không dùng public User auth/reset.               | SRS FR-IAM-02..03, API §7        |
| SEC-BL-03 | API V1 dùng Bearer access token qua `Authorization`; refresh/session credential tách theo Web/Mobile.                                  | API-BL-15                        |
| SEC-BL-04 | Web refresh credential dùng HttpOnly Secure SameSite=Lax cookie scoped refresh endpoint và refresh endpoint yêu cầu CSRF token.        | API-OP-01 closure                |
| SEC-BL-05 | Mobile refresh credential lưu trong secure storage của OS; chỉ gửi tới refresh endpoint, không log, không đưa vào query string.        | API-OP-01 closure                |
| SEC-BL-06 | Refresh/session TTL: User 30 ngày, Operator 14 ngày, Employee 7 ngày, Admin 12 giờ; Guest checkout session 2 giờ hoặc đến terminal.    | DB §12.2                         |
| SEC-BL-07 | Admin MFA bắt buộc cho Admin login và thao tác nhạy cảm; Operator login chưa bắt buộc MFA toàn cục ở V1.                               | API-OP-01 closure, SRS FR-IAM-10 |
| SEC-BL-08 | Email OTP là baseline xác minh User/Guest V1; SMS OTP ngoài phạm vi V1.                                                                | SRS OQ-09                        |
| SEC-BL-09 | Phone masking mặc định giữ 1 số đầu và 3 số cuối, ví dụ `0*** *** 789`; mở đầy đủ cần quyền, mục đích và log.                          | SRS OQ-11, BR-19                 |
| SEC-BL-10 | AuditLog append-only trong MongoDB cùng cluster, giữ tối thiểu 10 năm; security event giữ tối thiểu 12 tháng.                          | SRS OQ-14, DB §18.1              |
| SEC-BL-11 | File private dùng S3-compatible storage, private bucket, signed URL ngắn hạn, scan gate, allowlist type/size và no public-read.        | HLD-OQ-01, DB §16                |
| SEC-BL-12 | VNPay callback phải verify chữ ký/source, amount, transaction id, payment state và xử lý idempotent; callback lệch vào reconciliation. | API-BL-17, LLD §8.8              |
| SEC-BL-13 | Realtime V1 dùng WebSocket `/realtime`; event payload tối thiểu và server-authorized topic; REST API vẫn là source of truth.           | API-BL-16, HLD §12               |

---

## 5. Trust boundary và actor context

### 5.1. Trust boundary

| Boundary           | Actor / caller                        | Trust level         | Rule bắt buộc                                                                               |
| ------------------ | ------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| Public anonymous   | Guest chưa có session                 | Untrusted           | Chỉ public catalog/search/detail; rate limit; không trả PII.                                |
| Guest session      | Guest checkout                        | Low trust           | Chỉ hold/booking/payment trong guest session; lookup sau expiry cần code + contact verify.  |
| Authenticated User | User đăng nhập                        | Authenticated owner | Chỉ dữ liệu của chính mình; thao tác nhạy cảm cần verification nếu policy yêu cầu.          |
| Tenant Operator    | Operator                              | Tenant admin        | Chỉ dữ liệu `operatorId` của mình; không quản trị dữ liệu Platform toàn cục.                |
| Tenant Employee    | Employee                              | Scoped worker       | Chỉ theo `operatorId`, role, permission và assignment; mặc định dữ liệu hành khách bị mask. |
| Platform Admin     | Admin                                 | Privileged internal | Theo RBAC; thao tác nhạy cảm bắt buộc MFA/re-auth, reason và audit.                         |
| System job         | Scheduler/worker/internal event       | Internal controlled | Chỉ chạy từ event/job hợp lệ, có idempotency, checkpoint, lock và safe payload.             |
| External provider  | VNPay/email/storage/routing/bank flow | Third party         | Chỉ qua adapter/webhook đã verify; không có quyền truy cập dữ liệu nội bộ ngoài contract.   |

### 5.2. Actor context chuẩn

Backend phải normalize actor context trước khi vào application service.

| Field context     | Bắt buộc khi                       | Nguồn server-side                      | Rule security                                                                 |
| ----------------- | ---------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| `actorType`       | Mọi request không public           | Session, verified guest, job/callback  | Chỉ dùng giá trị `User`, `Guest`, `Operator`, `Employee`, `Admin`, `System`.  |
| `actorId`         | Actor đăng nhập                    | Session store                          | Không lấy actor id từ request body làm nguồn quyết định.                      |
| `guestSessionId`  | Guest checkout / verified guest    | Guest session hoặc verification result | Không dùng như tài khoản dài hạn.                                             |
| `operatorId`      | Operator/Employee/tenant data      | Account, assignment, resource owner    | Client gửi `operatorId` chỉ là filter hỗ trợ; backend resolve và enforce lại. |
| `roleCodes`       | Operator/Employee/Admin            | Permission store                       | Employee role V1 chỉ gồm `TICKET_STAFF`, `DRIVER`, `SUPPORT_STAFF`.           |
| `permissionCodes` | Admin/Operator/Employee action     | Permission store                       | Dùng cho guard cấp action/resource.                                           |
| `assignmentIds`   | Employee operation                 | Assignment module                      | Bắt buộc cho manifest/check-in/journey/incident.                              |
| `requestId`       | Mọi request/job/callback           | Gateway/server                         | Dùng correlation log; server sinh nếu client thiếu.                           |
| `idempotencyKey`  | Mutation rủi ro cao                | Header/command/provider event          | Bắt buộc với hold, booking, payment, refund, payout, notification, job.       |
| `surface`         | Web/Mobile/Admin/Operator/Employee | Header safe hoặc server route          | Dùng để logging/rate limit; không dùng thay permission.                       |

### 5.3. Account status gate

Mọi request authenticated phải qua account status gate trước RBAC:

| Trạng thái / tình huống             | Hành vi bắt buộc                                           |
| ----------------------------------- | ---------------------------------------------------------- |
| Account bị khóa / disabled          | Từ chối request; revoke toàn bộ active session liên quan.  |
| Mật khẩu/credential bị cấp lại      | Revoke session cũ; yêu cầu đăng nhập lại.                  |
| Quyền/role/assignment bị thu hồi    | Re-evaluate ở request kế tiếp; revoke nếu scope không còn. |
| Operator bị khóa hoặc KYC không đạt | Chặn mở bán public, tạo trip public và action nhạy cảm.    |
| Admin permission thay đổi           | Session phải phản ánh quyền mới hoặc yêu cầu refresh lại.  |
| Dấu hiệu rủi ro bảo mật             | Force logout hoặc yêu cầu re-auth/MFA theo policy.         |

---

## 6. Authentication, session và credential transport

### 6.1. Auth flow theo actor

| Actor    | Login / verification V1                                                                            | Reset / recovery                                                                      | Điều cấm                                                                  |
| -------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Guest    | Không login; dùng guest session khi hold/booking/payment; lookup bằng code + contact verification. | Không có account recovery; sau session hết hạn dùng ticket/booking lookup.            | Không tạo lịch sử tài khoản dài hạn; không broad lookup bằng phone/email. |
| User     | Đăng ký/đăng nhập bằng email hoặc số điện thoại; email OTP là baseline xác minh V1.                | User được request/confirm reset qua cơ chế xác minh dành cho hành khách.              | Không xem booking/ticket của User khác.                                   |
| Operator | Đăng nhập username/password được cấp qua Operator OS.                                              | Không reset qua public User flow; cấp lại theo người có thẩm quyền và audit.          | Không gửi public reset OTP như User.                                      |
| Employee | Đăng nhập username/password do Operator cấp; account gắn Operator, role và assignment.             | Operator có quyền khóa/mở/cấp lại theo tenant; thao tác có audit.                     | Không dùng session Operator; không tự nâng quyền.                         |
| Admin    | Đăng nhập bằng Admin account nội bộ; MFA bắt buộc.                                                 | Không public reset; cấp lại bởi Admin có thẩm quyền hoặc quy trình vận hành có audit. | Không tự đăng ký public; không bỏ MFA cho login production.               |
| System   | Job/callback/internal command dùng trust boundary riêng, idempotency và source verification.       | Không áp dụng.                                                                        | Không chạy job ảnh hưởng tiền/vé nếu thiếu lock/checkpoint.               |

### 6.2. Token và session baseline

| Nội dung                   | Baseline V1                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Access credential          | Bearer access token trong `Authorization: Bearer <accessToken>`.                                                       |
| Access token TTL           | User/Operator/Employee: 15 phút; Admin: 10 phút.                                                                       |
| Web refresh credential     | HttpOnly, Secure, SameSite=Lax cookie, scoped path cho refresh endpoint; không accessible từ JavaScript.               |
| CSRF cho Web refresh       | `POST /auth/sessions/refresh` từ Web phải gửi `X-CSRF-Token`; token CSRF không được nằm trong HttpOnly refresh cookie. |
| Mobile refresh credential  | Lưu trong OS secure storage; chỉ gửi khi gọi refresh endpoint; không đưa vào query, deep link hoặc log.                |
| Refresh/session TTL        | User 30 ngày; Operator 14 ngày; Employee 7 ngày; Admin 12 giờ.                                                         |
| Guest checkout session TTL | 2 giờ hoặc đến khi booking/payment terminal, tùy mốc nào đến trước.                                                    |
| Revoked session metadata   | Giữ tối thiểu 12 tháng theo DB retention.                                                                              |
| Multi-device               | Backend phải lưu session theo device/client metadata và hỗ trợ xem/revoke session theo quyền.                          |
| Force logout               | Bắt buộc khi account khóa, credential reset, quyền thu hồi, Operator khóa hoặc phát hiện rủi ro.                       |

### 6.3. Session response tối thiểu

Session response không được trả refresh credential trong JSON nếu kênh Web dùng cookie.

| Field                  | Bắt buộc | Ghi chú                                                                   |
| ---------------------- | -------- | ------------------------------------------------------------------------- |
| `accessToken`          | Có       | Không log plaintext; TTL ngắn theo §6.2.                                  |
| `accessTokenExpiresAt` | Có       | UTC ISO-8601.                                                             |
| `actor`                | Có       | `actorType`, `actorId`, display safe fields.                              |
| `operatorId`           | Khi có   | Với Operator/Employee.                                                    |
| `roleCodes`            | Khi có   | Employee/Admin/Operator permission surface.                               |
| `permissionSummary`    | NÊN      | Tóm tắt quyền để client hiển thị; backend vẫn quyết định lại mỗi request. |
| `mfaRequired`          | Khi cần  | Admin login hoặc challenge chưa hoàn tất.                                 |
| `sessionId`            | Có       | Dùng quản lý/revoke session.                                              |

### 6.4. Password, OTP và challenge secret

| Secret / credential     | Rule bắt buộc                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| Password                | Chỉ lưu hash an toàn có salt; không lưu plaintext; không log password hoặc password fragment.     |
| OTP                     | Email OTP baseline V1; chỉ lưu hash/reference; không log plaintext; rate limit request/confirm.   |
| Reset token             | Không đưa vào log, analytics, query public; token hết hạn phải bị từ chối.                        |
| Access/refresh token    | Không lưu plaintext trong audit/log/report; nếu cần revoke/lookup thì lưu hash/reference.         |
| Re-auth challenge token | Có `challengeId`, `challengeType`, `expiresAt`, `allowedAttempts`, `status`; không dùng lại.      |
| QR raw secret           | Không log; DB lưu hash/reference; QR display payload không chứa dữ liệu đủ để giả vé.             |
| Provider secret         | Chỉ nằm trong secret manager/deployment config; không nằm trong DB, source docs runtime hoặc log. |

---

## 7. Authorization, RBAC và scope guard

### 7.1. Authorization stack

Backend phải áp dụng stack theo thứ tự dưới đây cho mọi API không public:

1. Normalize request/callback/job context.
2. Xác thực session hoặc verified guest context.
3. Kiểm account/session status và revoke state.
4. Kiểm RBAC/permission code.
5. Kiểm tenant boundary `operatorId`.
6. Kiểm assignment scope với Employee.
7. Kiểm object ownership với User/Guest.
8. Kiểm business state/policy.
9. Ghi audit/operation/security log nếu action nhạy cảm hoặc bị từ chối đáng ghi nhận.

### 7.2. Scope guard bắt buộc

| Guard                     | Áp dụng cho                                               | Rule                                                                                              |
| ------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `AuthenticatedGuard`      | Mọi authenticated endpoint                                | Access token còn hạn, session chưa revoke, account active.                                        |
| `VerifiedGuestGuard`      | Guest ticket lookup, cancel/refund/support/dispute        | Booking/ticket code + contact đã verify; scope chỉ trong booking/ticket đó.                       |
| `AdminPermissionGuard`    | Admin governance, refund, payout, policy, audit, report   | Admin có permission code phù hợp; sensitive action cần MFA/re-auth challenge hợp lệ.              |
| `OperatorTenantGuard`     | Operator OS, finance, trip, booking, employee, report     | Resource phải thuộc `operatorId` của session hoặc là dữ liệu public/catalog được phép.            |
| `EmployeeAssignmentGuard` | Manifest, check-in, journey log, incident, offline sync   | Employee thuộc Operator, có role/permission và assignment hợp lệ tại thời điểm thao tác.          |
| `UserOwnershipGuard`      | User profile, booking, ticket, passenger, review, support | `userId` của resource khớp actor hoặc actor có Admin scope hợp lệ.                                |
| `PublicDataGuard`         | Public catalog/search/profile/review                      | Chỉ trả dữ liệu đã public, active và không chứa PII/private policy.                               |
| `SystemJobGuard`          | Worker, scheduler, internal command                       | Job hợp lệ, lock/checkpoint/idempotency; không dùng để bypass permission của Admin-triggered job. |
| `ProviderCallbackGuard`   | VNPay webhook/callback                                    | Verify signature/source, amount, transaction, idempotency và safe payload.                        |

### 7.3. Permission code model

Tài liệu này không chốt tên class/code cụ thể, nhưng backend phải có permission code ổn định theo nhóm sau:

| Nhóm permission        | Ví dụ action logical                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `IAM_*`                | Lock/unlock account, revoke session, manage Admin permission.                                |
| `OPERATOR_PROFILE_*`   | Update Operator profile, submit KYC, change bank account.                                    |
| `CATALOG_POLICY_*`     | Manage catalog, stop point proposal, policy version, commission rule.                        |
| `TRIP_INVENTORY_*`     | Manage vehicle/route/trip/fare, open/lock/cancel sale, block seat.                           |
| `BOOKING_TICKET_*`     | View booking/ticket by scope, export manifest, cancel booking by policy.                     |
| `PAYMENT_FINANCE_*`    | View payment/refund/ledger/payout, reconcile, confirm payout, manual refund.                 |
| `EMPLOYEE_OPERATION_*` | View assignment/manifest, verify ticket, check-in, no-show, update trip operation, incident. |
| `SUPPORT_DISPUTE_*`    | Manage support/complaint/dispute, request evidence, decide dispute.                          |
| `NOTIFICATION_*`       | View delivery, retry delivery, update non-mandatory preference.                              |
| `REPORT_AUDIT_*`       | Request export, include sensitive fields, search audit, export audit.                        |

Permission code chỉ là một lớp kiểm soát. Với tenant data, có permission nhưng sai `operatorId` vẫn phải bị từ chối.

---

## 8. Permission matrix Backend V1

### 8.1. Ma trận theo nhóm chức năng

| Nhóm chức năng                     | Guest                       | User                    | Operator                         | Employee                         | Admin                        | System                   |
| ---------------------------------- | --------------------------- | ----------------------- | -------------------------------- | -------------------------------- | ---------------------------- | ------------------------ |
| Public catalog/search/trip detail  | Có                          | Có                      | Có                               | Theo nhiệm vụ                    | Có                           | Hệ thống lọc public      |
| Guest checkout                     | Có bằng guest session       | Không áp dụng           | Không                            | Không                            | Hỗ trợ ngoại lệ              | Tạo hold/booking/payment |
| User account/profile               | Không                       | Dữ liệu của mình        | Không                            | Không                            | Theo quyền                   | Revoke khi cần           |
| Booking/ticket passenger           | Booking đã verify           | Booking/ticket của mình | Thuộc tenant                     | Theo assignment/manifest         | Theo RBAC                    | State transition hợp lệ  |
| Cancel/refund request              | Sau verify + challenge      | Vé của mình + challenge | Hỗ trợ trong tenant theo policy  | Không                            | Manual/arbiter theo RBAC     | Tính policy, tạo refund  |
| Operator onboarding/KYC            | Không                       | Không                   | Hồ sơ của mình                   | Không                            | Duyệt/từ chối/khóa           | Kiểm trạng thái mở bán   |
| Bank account Operator              | Không                       | Không                   | Submit change + re-auth/OTP      | Không                            | Review/override theo RBAC    | Snapshot/audit           |
| Vehicle/route/trip/fare/inventory  | Không                       | Không                   | Thuộc tenant                     | Xem/cập nhật theo assignment     | Giám sát/khóa theo RBAC      | Validate/open/search     |
| Employee account/assignment        | Không                       | Không                   | Quản lý Employee tenant          | Xem nhiệm vụ của mình            | Giám sát phục vụ audit       | Revoke khi role đổi      |
| Manifest/check-in/journey/incident | Không                       | Không                   | Xem thuộc tenant                 | Thực hiện theo role/assignment   | Giám sát theo RBAC           | Operation log/sync       |
| Payment/refund/escrow/payout       | Booking đã verify           | Giao dịch của mình      | Tài chính thuộc tenant           | Không                            | Giám sát/reconcile/confirm   | Callback/job/ledger      |
| Support/complaint/dispute          | Case đã verify              | Case của mình           | Case thuộc tenant                | Chỉ sự cố vận hành nếu liên quan | Phân xử cuối cùng            | State/job/notification   |
| Review/scorecard                   | Không gửi review            | Review hợp lệ của mình  | Phản hồi thuộc tenant nếu được   | Không                            | Moderation                   | Recalculate scorecard    |
| Notification preference            | Không có preference dài hạn | Non-mandatory của mình  | Non-mandatory của tenant/account | Non-mandatory của mình           | Template/delivery theo quyền | Mandatory delivery/retry |
| Report/export                      | Không                       | Dữ liệu của mình nếu có | Report tenant                    | Không                            | Report toàn hệ thống         | Async export job         |
| Audit log                          | Không                       | Không                   | Tenant log nếu được cấp quyền    | Không                            | Search/export theo RBAC      | Append-only write        |

### 8.2. Employee role matrix

| Chức năng Employee                        | `TICKET_STAFF`  | `DRIVER` | `SUPPORT_STAFF` | Điều kiện bắt buộc                               |
| ----------------------------------------- | --------------- | -------- | --------------- | ------------------------------------------------ |
| Đăng nhập app/portal Employee             | Có              | Có       | Có              | Account active, thuộc đúng Operator.             |
| Xem nhiệm vụ/lịch chuyến                  | Có              | Có       | Có              | Chỉ assignment còn hiệu lực.                     |
| Xem chi tiết chuyến/xe/điểm đón trả       | Có              | Có       | Có              | Theo assignment/tenant.                          |
| Xem manifest                              | Có              | Có       | Theo phân quyền | Phone mặc định mask.                             |
| Tìm hành khách trong manifest             | Có              | Có       | Theo phân quyền | Không được dò ngoài trip/assignment.             |
| Verify QR/mã vé                           | Có              | Có       | Theo phân quyền | Server-side verify; ticket thuộc trip được giao. |
| Check-in/no-show                          | Có              | Có       | Theo phân quyền | Idempotent operation log.                        |
| Cập nhật trạng thái chuyến                | Theo phân quyền | Có       | Theo phân quyền | `DRIVER` là role chính.                          |
| Journey log                               | Theo phân quyền | Có       | Theo phân quyền | Gắn trip/Employee/Operator.                      |
| Incident report/attachment                | Theo phân quyền | Có       | Có              | Attachment theo file policy và scan gate.        |
| Payment/refund/payout/policy/bank account | Không           | Không    | Không           | Luôn từ chối ở backend.                          |

### 8.3. Admin permission baseline

Admin có phạm vi toàn hệ thống nhưng không đồng nghĩa toàn quyền không điều kiện. Backend phải tách tối thiểu các nhóm quyền Admin sau:

| Nhóm Admin       | Quyền chính                                                                       | Sensitive control                 |
| ---------------- | --------------------------------------------------------------------------------- | --------------------------------- |
| Account/KYC      | Lock/unlock account, approve/reject KYC, request supplement, view account status. | Reason + audit; MFA cho lock/KYC. |
| Catalog/Policy   | Manage catalog, policy version, commission rule, maintenance state.               | Reason + effective time + audit.  |
| Finance          | Payment/refund/payout/reconciliation, manual refund, confirm bank transfer.       | MFA + reason/proof + audit.       |
| Trust/Safety     | Support, complaint, dispute, moderation, evidence review.                         | Reason + audit; MFA nếu refund.   |
| Reporting/Audit  | Dashboard, export, audit log search/export, include sensitive fields.             | Purpose/scope + audit ngược.      |
| System Operation | Integration status, job rerun, manual review, notification retry.                 | Job lock/checkpoint + audit.      |

---

## 9. Sensitive action, re-auth và MFA

### 9.1. Sensitive action groups

| Thao tác nhạy cảm                            | Actor được phép              | Challenge bắt buộc                                                                  | Audit/log bắt buộc                                    |
| -------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Hủy vé/yêu cầu hoàn tiền passenger           | User, verified Guest, Admin  | User/Guest: email OTP hoặc re-auth theo policy; Admin: MFA/re-auth nếu override.    | Ticket/refund state history; notification bắt buộc.   |
| Refund thủ công/refund đơn phương            | Admin Finance/Trust          | Admin MFA + permission + reason + evidence.                                         | Audit bắt buộc, Operator/User notification.           |
| Dispute decision có tác động tiền/vé         | Admin Trust/Finance          | Admin MFA nếu refund/adjustment; reason/evidence.                                   | Dispute audit, refund/ledger audit nếu có.            |
| Confirm payout paid                          | Admin Finance                | Admin MFA + ledger check + bank snapshot + proof/reference.                         | Payout audit và notification Operator.                |
| Mark payout failed/on hold/cancelled         | Admin Finance                | Re-auth/MFA theo policy; reason.                                                    | Payout audit, reconciliation nếu lệch.                |
| Đổi tài khoản nhận tiền Operator             | Operator, Admin              | Operator: password re-auth + email OTP; Admin: MFA + reason.                        | Audit, bank account snapshot, cảnh báo gần kỳ payout. |
| Đổi policy/commission/payout policy          | Admin Catalog/Policy/Finance | Admin MFA/re-auth + reason + effective time.                                        | Audit; không áp ngược booking cũ.                     |
| Khóa/mở khóa Operator/User/Employee/Admin    | Admin; Operator với Employee | Reason; Admin action cần MFA nếu ảnh hưởng Platform/Operator; Operator cần re-auth. | Audit; force logout nếu khóa hoặc thu hồi quyền.      |
| Sửa/hủy chuyến đã có vé bán                  | Operator, Admin              | Reason + impact analysis; re-auth nếu policy đánh dấu rủi ro cao.                   | Operation/audit log, notification bắt buộc.           |
| Xem full phone/export PII/manifest nhạy cảm  | Actor có quyền rõ ràng       | Purpose + scope; re-auth nếu export nhạy cảm hoặc Admin policy yêu cầu.             | Access/export log; dữ liệu mask nếu không cần full.   |
| Chạy lại job payment/refund/payout/reconcile | Admin Operation/Finance      | Permission + reason + job checkpoint.                                               | Job log + audit nếu Admin-triggered.                  |
| Retry notification bắt buộc                  | Admin Operation/System       | Permission hoặc system retry policy.                                                | Delivery log; idempotency key.                        |

### 9.2. Challenge contract

Sensitive action challenge dùng API `/verification/sensitive-actions` và `/verification/sensitive-actions/{challengeId}/confirm` theo API §11.2.

| Field                | Rule                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `challengeId`        | Opaque id, không đoán được, unique.                                                         |
| `challengeType`      | `EMAIL_OTP`, `PASSWORD_REAUTH`, `ADMIN_MFA`, hoặc challenge tương đương đã cấu hình.        |
| `actorContext`       | Actor id/type, session id, surface, operatorId nếu có.                                      |
| `actionType`         | Nhóm action nhạy cảm, ví dụ `MANUAL_REFUND`, `PAYOUT_CONFIRM`, `BANK_ACCOUNT_CHANGE`.       |
| `targetRef`          | Target type/id/code đã scope; không chứa dữ liệu nhạy cảm thừa.                             |
| `expiresAt`          | UTC; backend từ chối challenge hết hạn.                                                     |
| `allowedAttempts`    | Phải có giới hạn; vượt giới hạn chuyển `FAILED` và ghi security log.                        |
| `status`             | `PENDING`, `VERIFIED`, `FAILED`, `EXPIRED`, `CONSUMED`.                                     |
| `verificationToken`  | Nếu phát token sau verify, chỉ dùng một lần cho đúng action/target/session và hết hạn ngắn. |
| `reason` / `purpose` | Bắt buộc với refund, payout, policy, lock account, trip change, full PII/export.            |

### 9.3. MFA policy

| Actor    | MFA V1                                                                                      |
| -------- | ------------------------------------------------------------------------------------------- |
| Admin    | Bắt buộc khi login và khi xác nhận thao tác nhạy cảm.                                       |
| Operator | Không bắt buộc MFA toàn cục ở V1; bank account change yêu cầu password re-auth + email OTP. |
| Employee | Không bắt buộc MFA ở V1; thao tác bị giới hạn bằng role/assignment và operation log.        |
| User     | Email OTP dùng cho đăng ký/đăng nhập/xác minh theo policy; sensitive action có OTP khi cần. |
| Guest    | Email/contact verification cho lookup và sensitive action; không có MFA dài hạn.            |

---

## 10. Guest verification và anti-enumeration

### 10.1. Guest session lifecycle

| Giai đoạn                | Security rule                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| Public search/detail     | Không cần session; rate limit theo IP/device/fingerprint an toàn.                                     |
| Create SeatHold          | Cần guest session Web Marketplace; hold gắn `guestSessionId`.                                         |
| Create booking/payment   | Booking gắn contact snapshot; payment chỉ cho booking trong session còn hợp lệ hoặc đã verify.        |
| Session hết hạn          | Không dùng session cũ để thao tác; Guest phải lookup bằng booking/ticket code + contact verification. |
| Booking/payment terminal | Guest checkout session kết thúc; tiếp tục thao tác qua verified guest context.                        |

### 10.2. Lookup và verification rule

| Nội dung             | Rule bắt buộc                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Lookup key           | Booking code hoặc ticket code + contact đã lưu; không lookup rộng bằng phone/email đơn lẻ.      |
| Sai code/contact     | Trả lỗi chung; không tiết lộ code tồn tại hay contact sai.                                      |
| Verified guest scope | Chỉ cho booking/ticket/case liên quan đến verification; không tạo lịch sử toàn bộ theo contact. |
| Sensitive action     | Cancel/refund/support/dispute evidence cần challenge bổ sung nếu policy yêu cầu.                |
| Rate limit           | Bắt buộc theo code/contact/IP/device; vượt ngưỡng ghi security log và khóa tạm theo policy.     |
| Notification         | Chỉ gửi qua contact đã lưu trong booking; không gửi dữ liệu ngoài booking/ticket đã verify.     |

### 10.3. Anti-enumeration response

| Context                | Response behavior                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Guest lookup sai       | Một error chung như `BOOKING_NOT_FOUND_OR_FORBIDDEN` hoặc equivalent.               |
| User login sai         | Không phân biệt email/phone không tồn tại và sai credential trong response public.  |
| Reset password request | Trả accepted safe response nếu input hợp lệ format.                                 |
| Tenant violation       | Không tiết lộ resource thuộc Operator khác có tồn tại.                              |
| Ticket verify sai      | Employee nhận kết quả không hợp lệ; không expose QR secret hoặc dữ liệu ngoài trip. |

---

## 11. Data protection, masking và secret handling

### 11.1. Phân loại dữ liệu

| Loại dữ liệu               | Ví dụ                                                   | Control bắt buộc                                                    |
| -------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| Public data                | Catalog active, trip public, Operator profile public    | Chỉ trả record active/public; không PII/private policy.             |
| Tenant data                | Vehicle, trip, booking, finance, employee của Operator  | Enforce `operatorId`; index/filter theo tenant; audit khi export.   |
| Passenger PII              | Họ tên, phone, email, passenger note, lịch sử chuyến    | Data minimization, masking theo scope, no public leak, log hygiene. |
| Financial data             | Payment/refund/escrow/payout/bank account               | RBAC, audit, idempotency, no hard delete, masked bank display.      |
| Legal/KYC/evidence file    | KYC, dispute evidence, incident evidence                | Private object, signed URL, scan gate, retention 10 năm theo DB.    |
| Secret/auth data           | Password, OTP, token, refresh credential, QR raw secret | Hash/reference, no plaintext log/audit/report.                      |
| Provider sensitive payload | VNPay secret, callback raw sensitive fields             | Verify, redacted safe payload/digest; no secret log.                |
| Audit/security log         | Actor/action/target/before-after masked                 | Append-only, retention, access controlled, no secret plaintext.     |

### 11.2. Masking baseline

| Field / dữ liệu              | Default display                                                            | Khi nào được mở đầy đủ                                                |
| ---------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Passenger phone              | `0*** *** 789` theo SRS OQ-11.                                             | Actor có quyền vận hành hợp lệ + purpose; log access/export.          |
| Email                        | Mask local-part/domain một phần, ví dụ `n***@example.com` nếu cần display. | Actor owner hoặc Admin/Operator/Employee có quyền và purpose.         |
| Bank account number          | Chỉ hiển thị phần cuối hoặc masked snapshot.                               | Admin Finance/Operator owner trong flow bank/payout có re-auth/audit. |
| Passenger name trên manifest | Hiển thị theo nhu cầu check-in; không export ngoài scope.                  | Export manifest theo quyền và audit nếu gồm PII.                      |
| Payment provider transaction | Hiển thị mã đối soát safe.                                                 | Không hiển thị provider secret/raw sensitive payload.                 |
| Audit before/after           | Mask field nhạy cảm theo role người xem.                                   | Full raw secret không được hiển thị trong mọi trường hợp.             |
| QR display payload           | Chỉ dùng để hiển thị/scan vé hợp lệ.                                       | Raw secret không được log hoặc export.                                |

### 11.3. Log hygiene

KHÔNG ĐƯỢC ghi plaintext các giá trị sau vào application log, audit log, job log, analytics, crash report hoặc report export:

- Password, password reset token, OTP.
- Access token, refresh token, CSRF token, MFA secret.
- QR raw token/secret.
- Provider hash secret, signing secret, callback secret.
- Dữ liệu thanh toán nhạy cảm không cần thiết.
- Full bank account nếu không có masking/purpose.
- Attachment signed URL private sau khi đã cấp cho client.

Log được phép lưu safe references: internal id, business code, hash/digest, masked identifier, result, error code, provider transaction id safe, request id và actor context đã mask.

### 11.4. Notification privacy

| Rule       | Nội dung                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------- |
| NTF-SEC-01 | Notification không chứa token, OTP sau khi dùng, password, QR raw secret, provider secret.     |
| NTF-SEC-02 | Với Guest, chỉ gửi tới contact trong booking và chỉ chứa dữ liệu thuộc booking/ticket đó.      |
| NTF-SEC-03 | Mandatory notification không tắt hoàn toàn; preference chỉ áp dụng non-mandatory notification. |
| NTF-SEC-04 | Retry notification bắt buộc phải idempotent theo event/recipient/channel/template version.     |
| NTF-SEC-05 | SMS/push transactional không bật trong V1 launch nếu không có review scope mới.                |

---

## 12. File, attachment và signed URL security

### 12.1. File policy baseline

| Nhóm file                          | Rule security                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| KYC document                       | Private object; owner Operator/Admin; scan gate; signed URL; retention KYC legal.                 |
| Support/complaint/dispute evidence | Private object; scoped case participants; scan gate; no public-read.                              |
| Incident evidence                  | Private object; scoped Operator/Employee/Admin; scan gate.                                        |
| Report export                      | Private object; download URL ngắn hạn; metadata/export audit giữ theo DB retention.               |
| Public asset/logo                  | Chỉ public nếu đã được kiểm duyệt/policy cho phép; không dùng bucket private evidence làm public. |

### 12.2. Signed URL và scan gate

| Nội dung                | Baseline từ DB Design v1.4                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Upload signed URL TTL   | 15 phút.                                                                                 |
| Download signed URL TTL | 5 phút cho private file.                                                                 |
| Report export URL TTL   | 10 phút.                                                                                 |
| Pending upload cleanup  | Pending upload chưa confirm sau 24 giờ bị cleanup.                                       |
| Report export object    | Giữ object 30 ngày; metadata/export audit giữ 24 tháng.                                  |
| Allowlist               | PDF, JPEG, PNG, WebP cho KYC/support/dispute/incident; CSV, XLSX, PDF cho report export. |
| Size limit              | 10 MB/file cho KYC/support/dispute/incident; 100 MB/file cho report export.              |
| Scan status             | `PENDING`, `CLEAN`, `REJECTED`, `FAILED`, `QUARANTINED`.                                 |
| Read private file       | Chỉ khi `scanStatus = CLEAN`, trừ Admin quarantine role được phép xử lý quarantine.      |

### 12.3. Attachment access control

| Access context | Rule                                                                               |
| -------------- | ---------------------------------------------------------------------------------- |
| Uploader       | Được confirm upload nếu owner/scope khớp và intent còn hạn.                        |
| Operator       | Chỉ attachment thuộc tenant hoặc case/trip/booking thuộc Operator.                 |
| Employee       | Chỉ incident/manifest attachment thuộc assignment; không xem KYC/bank evidence.    |
| User/Guest     | Chỉ attachment thuộc support/dispute/booking đã sở hữu hoặc verify.                |
| Admin          | Theo RBAC; quarantine/evidence/report export cần audit.                            |
| Public         | Không đọc file private; public asset phải qua flow riêng và không chứa PII/secret. |

---

## 13. External provider, webhook và realtime security

### 13.1. VNPay callback security

| Control                | Rule                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| Signature verification | Loại bỏ `vnp_SecureHash` và `vnp_SecureHashType`, sort params, verify HMAC-SHA512 bằng secret.   |
| Transaction mapping    | `vnp_TxnRef` map `paymentCode`; `vnp_Amount` phải bằng `amountVnd * 100`.                        |
| Success condition      | Chỉ success khi signature hợp lệ, `vnp_ResponseCode = "00"`, `vnp_TransactionStatus = "00"`.     |
| State validation       | Payment/booking tồn tại, amount khớp, state cho phép success; mismatch vào `RECONCILING`.        |
| Idempotency            | Theo provider + providerTransactionId + paymentId + payload digest; không issue ticket trùng.    |
| Safe payload           | Lưu digest lâu dài và safe/redacted payload 24 tháng; không lưu raw sensitive payload.           |
| Secret rotation        | Secret nằm trong secret/deployment config; hỗ trợ active + next secret trong giai đoạn rotation. |
| Logging                | Không log hash secret, raw secret hoặc payload nhạy cảm; chỉ log masked/safe result.             |

### 13.2. External adapter boundary

| Adapter             | Security rule                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| PaymentProvider     | Verify callback/source/status/amount; provider status map vào state nội bộ; retry idempotent.  |
| EmailProvider       | Không log OTP; template biến phải allowlist; delivery status safe.                             |
| SmsProvider         | Adapter giữ sẵn nhưng SMS OTP ngoài V1; nếu bật sau phải cập nhật Security/API/Test.           |
| PushProvider        | Push transactional không bật V1 launch; token registry public API không nằm trong baseline V1. |
| FileStorageProvider | Private object, signed URL, scan gate, content type/size allowlist.                            |
| RoutingProvider     | Timeout/fallback; không dùng dữ liệu routing lỗi để bypass booking validation.                 |
| BankPayoutChannel   | V1 manual bank transfer; Admin confirm với proof/reference; không có bank webhook baseline.    |

### 13.3. Realtime security

| Nội dung            | Rule                                                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint            | `/realtime` theo API-BL-16.                                                                                                                                     |
| Auth handshake      | Bearer access token hoặc guest realtime token ngắn hạn đã được backend cấp sau verification/hold.                                                               |
| Topic authorization | Server quyết định topic được subscribe; client không được tự subscribe topic tùy ý.                                                                             |
| Topic logical       | `user.{userId}`, `guest-session.{guestSessionId}`, `operator.{operatorId}`, `employee.{employeeId}`, `admin.{scope}`, `trip.{tripId}.operation`, `job.{jobId}`. |
| Payload             | Tối thiểu, không chứa PII/tài chính ngoài quyền; event chỉ dùng invalidate/update UI.                                                                           |
| Source of truth     | REST API vẫn là nguồn state cuối cùng cho booking/payment/ticket/refund/payout.                                                                                 |
| Fallback            | REST polling/refetch khi mất kết nối; không giảm security khi fallback.                                                                                         |
| Revocation          | Khi session/role/assignment bị revoke, realtime connection/subscription phải bị đóng hoặc giảm scope.                                                           |

---

## 14. Audit, security logging và retention

### 14.1. Audit bắt buộc

| Sự kiện / action                            | Log type                 | Field tối thiểu                                                              |
| ------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| Login fail, account lock, session revoke    | Security log             | actor type, identifier masked, result, reason, IP/device nếu có, requestId.  |
| Admin login/MFA success/fail                | Security log             | adminId masked/safe, result, method, device/IP, requestId.                   |
| Re-auth/sensitive challenge fail            | Security log             | actor, actionType, targetRef safe, result, attempt count.                    |
| KYC decision                                | Audit                    | adminId, operatorId, decision, reason, document refs safe.                   |
| Bank account change                         | Audit                    | actor, operatorId, before/after masked, reason, challenge result.            |
| Policy/commission/payout policy change      | Audit                    | adminId, policy/rule id, before/after, effective time, reason.               |
| Trip open/lock/cancel/change after sale     | Audit/operation log      | actor, operatorId, tripId, before/after, reason, affected count.             |
| SeatHold conflict bất thường                | Operational/security log | tripId, seat codes, actor/session safe, requestId.                           |
| Payment callback state change               | Payment log + audit      | paymentId, provider transaction, amount, status, payload digest, result.     |
| Manual refund/dispute decision              | Audit                    | adminId, booking/payment/refund/dispute refs, amount, reason, evidence refs. |
| Payout confirm/hold/failed                  | Audit                    | adminId, payoutId, amount, bank snapshot ref, proof/reference, result.       |
| View full phone / export PII / audit export | Access/export audit      | actor, target scope, reason, fields accessed/exported, masking mode.         |
| Check-in/no-show/offline sync               | Operation log            | employeeId, tripId, ticketId, assignmentId, source online/offline, result.   |
| Job rerun/reconciliation                    | Job log + audit          | actor/system, job type, scope, checkpoint, result, error summary safe.       |

### 14.2. Retention baseline

| Dữ liệu / log                                          | Retention baseline                                                                     |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Booking, Ticket, Payment, Refund, EscrowLedger, Payout | Không hard delete production; giữ tối thiểu 10 năm; archive lạnh sau 24 tháng nếu cần. |
| AuditLog                                               | Append-only; giữ tối thiểu 10 năm; không hard delete production.                       |
| KYC, BankAccount, Dispute, Attachment evidence         | Giữ tối thiểu 10 năm sau Operator offboard hoặc case đóng, tùy mốc muộn hơn.           |
| SupportTicket / Complaint / CaseMessage                | Giữ tối thiểu 5 năm sau khi case đóng.                                                 |
| Session revoked metadata                               | 12 tháng.                                                                              |
| Login/security event                                   | Tối thiểu 12 tháng.                                                                    |
| NotificationDelivery                                   | 18 tháng.                                                                              |
| Provider callback safe payload                         | Digest theo payment event; safe/redacted payload 24 tháng.                             |
| Report export metadata/audit                           | Metadata/export audit 24 tháng; object private 30 ngày.                                |

### 14.3. Audit access policy

| Actor    | Quyền audit                                                                                |
| -------- | ------------------------------------------------------------------------------------------ |
| Guest    | Không truy cập audit.                                                                      |
| User     | Không truy cập audit; chỉ thấy trạng thái nghiệp vụ của mình.                              |
| Operator | Có thể xem log tenant nếu được cấp quyền rõ ràng; không thấy dữ liệu Operator khác.        |
| Employee | Không truy cập audit.                                                                      |
| Admin    | Search/export audit theo RBAC; export là sensitive action cần reason và audit ngược.       |
| System   | Chỉ append audit/job/security log; không đọc export nếu không qua Admin/System job hợp lệ. |

---

## 15. Rate limit, abuse control và threat control

### 15.1. Rate limit bắt buộc

| Nhóm endpoint / action             | Rule                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| Login User/Operator/Employee/Admin | Rate limit theo identifier + IP/device; lock tạm khi fail vượt ngưỡng policy.        |
| OTP request/confirm                | Rate limit request và attempt; không cho brute force.                                |
| Guest ticket lookup                | Rate limit theo code/contact/IP/device; response chống enumeration.                  |
| Search trip                        | Rate limit public traffic; ưu tiên chống scraping và tải peak.                       |
| SeatHold                           | Rate limit theo actor/session/IP/trip; chống hold ghế hàng loạt.                     |
| Create payment                     | Rate limit theo booking/session; không tạo payment trùng bằng retry mù.              |
| Support/dispute attachment upload  | Rate limit theo actor/case; kiểm size/type trước upload intent.                      |
| Admin sensitive action             | Rate limit challenge/MFA attempt; ghi security log khi fail.                         |
| Provider callback                  | Không rate limit kiểu public làm mất callback hợp lệ; dùng verify/idempotency/queue. |

### 15.2. Threat controls

| Threat                         | Control bắt buộc                                                                      | Test trace      |
| ------------------------------ | ------------------------------------------------------------------------------------- | --------------- |
| IDOR / object ownership bypass | Ownership/tenant/assignment guard ở backend; error không leak resource.               | 08 Security     |
| Tenant data leak               | `operatorId` resolve server-side; repository query phải tenant-scoped.                | 08 Tenant       |
| Employee over-scope            | Assignment guard; phone mask; operation log; deny payment/refund/payout/policy.       | 08 Employee     |
| Guest enumeration              | Code + contact verification, generic errors, rate limit.                              | 08 Guest        |
| CSRF refresh                   | Web refresh cookie HttpOnly/Secure/SameSite=Lax + `X-CSRF-Token`.                     | 08 Auth         |
| Token theft                    | Short access TTL, refresh revoke, mobile secure storage, no token in URL/log.         | 08 Auth         |
| Brute force login/OTP          | Rate limit, lock tạm, security log, safe response.                                    | 08 Auth         |
| NoSQL Injection                | DTO validation, whitelist filter/sort, không truyền raw query từ client.              | 08 Security     |
| XSS/content injection          | Sanitize/escape user-generated content; notification/template variables allowlist.    | 08 Security     |
| Double booking                 | DB-authoritative SeatHold, transaction, idempotency, concurrency test.                | 08 Booking      |
| Payment spoof/replay           | VNPay signature/amount/status verify, idempotency, reconciliation.                    | 08 Payment      |
| QR forgery/replay              | Non-guessable token, hash/reference, server-side verification, single check-in state. | 08 Ticket       |
| File malware/private leak      | Signed URL, scan gate, allowlist, private bucket, access audit.                       | 08 File         |
| Notification data leak         | Template variable allowlist, recipient scope, no secret/PII outside quyền.            | 08 Notification |
| Job duplicate processing       | Lock, checkpoint, idempotency, manual review on mismatch.                             | 08 Job          |

---

## 16. Security acceptance baseline cho backend

Backend V1 chỉ được xem là đạt baseline security khi thỏa các điều kiện sau:

| ID        | Điều kiện nghiệm thu security                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| SEC-AC-01 | Mọi endpoint không public yêu cầu auth hoặc verified guest context; public endpoint không trả PII.                  |
| SEC-AC-02 | User không đọc/ghi booking, ticket, profile, passenger, support, review của User khác.                              |
| SEC-AC-03 | Operator không đọc/ghi dữ liệu Operator khác, kể cả khi sửa `operatorId` trong request.                             |
| SEC-AC-04 | Employee chỉ thao tác manifest/check-in/journey/incident theo role và assignment; payment/refund/payout luôn deny.  |
| SEC-AC-05 | Admin action nhạy cảm yêu cầu permission, MFA/re-auth, reason và audit.                                             |
| SEC-AC-06 | Guest lookup sai code/contact không leak resource tồn tại và bị rate limit khi thử nhiều lần.                       |
| SEC-AC-07 | Session refresh/revoke/force logout hoạt động theo TTL và account status.                                           |
| SEC-AC-08 | Web refresh endpoint có CSRF control; mobile refresh credential không xuất hiện trong log/query/deep link.          |
| SEC-AC-09 | Phone/passenger PII mặc định mask đúng policy; full PII access/export có purpose và audit.                          |
| SEC-AC-10 | VNPay callback giả mạo, sai signature, sai amount, replay hoặc provider status lệch không phát hành ticket.         |
| SEC-AC-11 | Ticket QR invalid/replay/already checked-in bị từ chối server-side.                                                 |
| SEC-AC-12 | Private file không đọc được trước scan `CLEAN`; signed URL hết hạn đúng baseline.                                   |
| SEC-AC-13 | Notification mandatory không bị tắt bởi preference và retry không gửi trùng cùng event.                             |
| SEC-AC-14 | Job rerun/reconciliation có lock/checkpoint/idempotency và audit nếu Admin trigger.                                 |
| SEC-AC-15 | Audit log không chứa plaintext password, OTP, token, QR raw secret, provider secret hoặc payment sensitive payload. |

---

## 17. Traceability, rủi ro và OP

### 17.1. Traceability nhanh

| Security topic               | Nguồn chính                                  | Section tài liệu này |
| ---------------------------- | -------------------------------------------- | -------------------- |
| Actor/auth boundary          | SRS FR-IAM, HLD §11, API §7                  | §5, §6               |
| Session TTL và retention     | DB §12.2, DB §18.1, API §7.3                 | §6, §14              |
| RBAC/tenant/assignment       | SRS §15, HLD §11.2, LLD §7.2, API-SEC-02..03 | §7, §8               |
| Sensitive action/re-auth/MFA | SRS FR-IAM-10, BR-57, HLD §11.3, API §7.4    | §9                   |
| Guest lookup                 | SRS BR-21, BR-60..61, LLD §8.2, API-SEC-04   | §10                  |
| Masking/PII/export           | SRS OQ-11, BR-19, BR-56, NFR-PRIV, DB §9.3   | §11, §14             |
| File/private attachment      | HLD-OQ-01, LLD §11.3, DB §16                 | §12                  |
| VNPay callback               | SRS OQ-05, LLD §8.8, API-BL-17               | §13.1                |
| Realtime/WebSocket           | HLD §12, API-BL-16                           | §13.3                |
| Audit/log retention          | SRS OQ-14, BR-58..59, DB §18.1               | §14                  |
| Threat/test baseline         | SRS RSK, AC-34, LLD §14.4                    | §15, §16             |

### 17.2. Rủi ro còn lại

| ID          | Rủi ro                                                                | Mức        | Giảm thiểu                                                                                   |
| ----------- | --------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| SEC-RISK-01 | Tài liệu 09 chưa chốt secret manager/WAF/monitoring stack production. | Cao        | 07 chốt rule ứng dụng; 09 phải chốt hạ tầng trước staging/production.                        |
| SEC-RISK-02 | Provider email cụ thể chưa chốt có thể ảnh hưởng OTP/delivery SLA.    | Trung bình | Dùng EmailProvider adapter; test bằng mock/sandbox; provider cụ thể thuộc Operation/ADR.     |
| SEC-RISK-03 | Admin MFA implementation chưa chốt vendor.                            | Trung bình | Security contract yêu cầu MFA; implementation chọn cơ chế trong task/ADR nhưng không bỏ MFA. |
| SEC-RISK-04 | Legal/privacy review có thể siết retention hoặc masking hơn baseline. | Trung bình | Security/Operation/Legal được phép siết chặt, không được yếu hơn baseline trong DB/07.       |
| SEC-RISK-05 | Realtime topic authorization sai có thể leak state cross-tenant.      | Cao        | Server-authorized topic, payload tối thiểu, test tenant/revoke/reconnect trong 08.           |

### 17.3. Open Points

Không còn Security Open Point chặn Backend V1 trong phạm vi tài liệu này. Các lựa chọn vendor/hạ tầng production như secret manager, MFA provider, WAF/CDN, monitoring/logging stack và incident runbook thuộc `09-deployment-operation-standard.md` hoặc ADR vận hành tương ứng.

---

## 18. Phụ lục

### 18.1. Error code security phải có

| Nhóm lỗi   | Error code logical tối thiểu                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| Auth       | `AUTH_INVALID_CREDENTIALS`, `AUTH_ACCOUNT_LOCKED`, `AUTH_SESSION_EXPIRED`, `AUTH_REAUTH_REQUIRED`, `AUTH_MFA_REQUIRED` |
| Permission | `PERMISSION_DENIED`, `TENANT_SCOPE_VIOLATION`, `ASSIGNMENT_SCOPE_VIOLATION`                                            |
| Guest      | `BOOKING_NOT_FOUND_OR_FORBIDDEN`, `GUEST_VERIFICATION_REQUIRED`, `GUEST_VERIFICATION_FAILED`                           |
| Rate limit | `RATE_LIMITED`, `OTP_RATE_LIMITED`, `LOOKUP_RATE_LIMITED`                                                              |
| File       | `FILE_ACCESS_DENIED`, `FILE_SCAN_PENDING`, `FILE_SCAN_REJECTED`, `SIGNED_URL_EXPIRED`                                  |
| Payment    | `PAYMENT_INVALID_CALLBACK`, `PAYMENT_AMOUNT_MISMATCH`, `PAYMENT_RECONCILING`                                           |
| Sensitive  | `SENSITIVE_CHALLENGE_REQUIRED`, `SENSITIVE_CHALLENGE_EXPIRED`, `SENSITIVE_CHALLENGE_FAILED`                            |

### 18.2. Thuật ngữ permission

- `RBAC`: kiểm quyền theo role/permission code.
- `Tenant boundary`: phạm vi dữ liệu theo `operatorId`.
- `Assignment scope`: phạm vi chuyến/nhiệm vụ Employee được giao.
- `Object ownership`: quan hệ sở hữu trực tiếp như `userId`, `guestSessionId`, case participant.
- `Sensitive action`: thao tác ảnh hưởng tiền, vé, ghế, policy, quyền, PII hoặc audit.
