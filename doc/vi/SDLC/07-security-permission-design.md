# 07. Security & Permission Design - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| Tên tài liệu | Security & Permission Design     |
| Mã tài liệu  | 07-security-permission-design    |
| Dự án        | Hệ thống đặt vé xe khách         |
| Phiên bản    | v0.1                             |
| Trạng thái   | Draft                            |
| Người viết   | AI Agent                         |
| Người duyệt  | Nguyễn Hồng Khanh                |
| Ngày tạo     | 11/05/2026                       |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                         |
| --------- | ---------- | -------------- | ----------------------------------------- |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp Security & Permission Design |

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Actor và trust boundary
5. Authentication
6. Authorization và tenant boundary
7. Permission matrix mức cao
8. Sensitive action control
9. Data protection
10. Audit, logging và monitoring
11. Threat control
12. Open Questions / TBD

---

## 3. Giới thiệu

Tài liệu này mô tả thiết kế bảo mật và phân quyền cho hệ thống. Đây là nguồn bắt buộc trước khi triển khai chức năng có quyền, dữ liệu cá nhân, vé, ghế, thanh toán, hoàn tiền, payout, KYC hoặc audit.

---

## 4. Actor và trust boundary

| Actor | Trust level | Boundary |
| ----- | ----------- | -------- |
| Guest | Public/untrusted | Chỉ public data và ticket lookup có xác minh |
| User | Authenticated user | Chỉ dữ liệu của chính mình |
| Operator | Tenant admin | Chỉ dữ liệu thuộc Operator |
| Employee | Tenant scoped worker | Chỉ dữ liệu theo Operator, role và assignment |
| Admin | Platform privileged | Toàn hệ thống theo RBAC, audit bắt buộc |
| External provider | Third party | Chỉ qua adapter/webhook đã verify |

---

## 5. Authentication

| Actor | Cơ chế | Rule |
| ----- | ----- | ---- |
| User | Email/phone + password/OTP theo policy TBD | Có reset password public theo xác minh |
| Operator | Username/password được cấp | Không dùng luồng User public |
| Employee | Username/password do Operator cấp | Operator quản lý trạng thái tài khoản |
| Admin | Admin account nội bộ | Không tự đăng ký public, reset qua quy trình vận hành |
| Guest | Không login | Re-auth/OTP/email/phone verify cho thao tác nhạy cảm |

### 5.1. Session policy

| Nội dung | Rule nháp |
| -------- | --------- |
| Access token TTL | TBD |
| Refresh token TTL | TBD |
| Multi-device limit | TBD |
| Force logout | Khi tài khoản bị khóa, mật khẩu reset, quyền bị thu hồi hoặc phát hiện rủi ro |
| Login history | Ghi actor, thời điểm, thiết bị/IP nếu có, kết quả |

---

## 6. Authorization và tenant boundary

| Boundary | Rule |
| -------- | ---- |
| User ownership | `userId` trong resource phải khớp actor hoặc quyền admin hợp lệ |
| Operator tenant | Mọi query Operator/Employee phải filter theo `operatorId` |
| Employee assignment | Employee chỉ xem/chỉnh chuyến hoặc passenger list được phân công hoặc được cấp quyền |
| Admin scope | Admin quyền cao nhưng thao tác nhạy cảm cần permission, re-auth và audit |
| Public catalog | Chỉ dữ liệu đã được phép public mới trả qua API Guest |

---

## 7. Permission matrix mức cao

| Chức năng | Guest | User | Operator | Employee | Admin |
| --------- | ----- | ---- | -------- | -------- | ----- |
| Search trip | Có | Có | Có trong phạm vi | Không | Có |
| Create booking | TBD | Có | Có thể hỗ trợ nếu được phép | Không | Có thể hỗ trợ |
| Payment | Không | Có | Không trực tiếp | Không | Giám sát/đối soát |
| Cancel/refund request | Không | Vé của mình | Vé thuộc Operator theo policy | Không | Có |
| Vehicle/SeatMap | Không | Không | Có trong tenant | Xem nếu được phân công | Giám sát/toàn hệ thống |
| Check-in | Không | Không | Xem kết quả | Có theo assignment | Giám sát |
| KYC Operator | Không | Không | Hồ sơ của mình | Không | Duyệt/quản lý |
| Policy/commission/payout | Không | Không | Xem phần liên quan | Không | Cấu hình |
| Audit log | Không | Không | Log của tenant nếu được cấp | Không | Có |

---

## 8. Sensitive action control

| Thao tác | Kiểm soát bắt buộc |
| -------- | ------------------ |
| Refund thủ công | Admin permission, re-auth, reason, audit, notification Operator |
| Payout / payout policy | Admin permission, re-auth, reason, audit |
| Đổi bank account Operator | Operator/Admin permission, re-auth, verification, audit |
| Đổi trip đã bán vé | Operator/Admin permission, reason, notification, audit |
| Khóa Operator/User/Employee | Permission, reason, audit, session revoke |
| Đổi policy hủy/giữ ghế/commission | Admin permission, effective date, audit, không áp ngược booking cũ |
| Xem/export dữ liệu cá nhân | Permission, masking, purpose, audit nếu nhạy cảm |

---

## 9. Data protection

| Dữ liệu | Kiểm soát |
| ------- | --------- |
| Password | Hash an toàn, không log plaintext |
| OTP/token | Không log plaintext, TTL ngắn |
| Số điện thoại/email | Mask khi không cần đầy đủ |
| Payment data | Không lưu dữ liệu thẻ nhạy cảm; chỉ lưu mã giao dịch/provider metadata cần thiết |
| KYC document | Object storage private, signed URL/permission, audit access |
| QR token | Không đoán được, lưu hash hoặc token an toàn theo thiết kế DB |
| Audit log | Không chứa secret/plaintext nhạy cảm |

---

## 10. Audit, logging và monitoring

| Nhóm | Rule |
| ---- | ---- |
| AuditLog | Actor, actor type, action, target, before/after masked, reason, result, time, IP/device nếu có |
| Security log | Login fail, suspicious access, tenant violation, rate limit hit |
| Payment log | Callback, reconciliation, refund, payout, không log payload nhạy cảm |
| Alert | Payment callback lỗi, seat lock lỗi, tenant violation, provider down |

---

## 11. Threat control

| Threat | Kiểm soát |
| ------ | --------- |
| IDOR | Backend ownership check, tenant filter, test case bắt buộc |
| NoSQL Injection | DTO validation, query whitelist, không truyền filter raw |
| XSS | Escape/sanitize nội dung user-generated, CSP TBD |
| CSRF | Nếu dùng cookie session, cần CSRF token; nếu Bearer token, cần token storage policy |
| Brute force login/OTP | Rate limit, lock tạm, monitoring |
| Double booking | Atomic seat hold, idempotency, state validation |
| Payment spoofing | Verify signature, amount, transaction id, provider status |
| QR forgery | QR token random, server-side validation |

---

## 12. Open Questions / TBD

| ID | Câu hỏi | Tác động |
| -- | ------- | -------- |
| SEC-OQ-01 | Web dùng Bearer token hay cookie session? | CSRF/token storage |
| SEC-OQ-02 | Có bật MFA cho Admin/Operator ở v1 không? | Auth flow |
| SEC-OQ-03 | Mask số điện thoại cụ thể theo rule nào? | UI/API/report |
| SEC-OQ-04 | KYC document lưu provider nào? | Object storage security |
| SEC-OQ-05 | AuditLog lưu bao lâu và ai được export? | Compliance/operation |
