# 03. Low Level Design - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                                     |
| ------------ | ------------------------------------------- |
| Tên tài liệu | Low Level Design - Hệ thống đặt vé xe khách |
| Mã tài liệu  | 03-lld-he-thong-dat-ve-xe-khach             |
| Dự án        | Hệ thống đặt vé xe khách                    |
| Phiên bản    | v0.1                                        |
| Trạng thái   | Draft                                       |
| Người viết   | AI Agent                                    |
| Người duyệt  | Nguyễn Hồng Khanh                           |
| Ngày tạo     | 11/05/2026                                  |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                              |
| --------- | ---------- | -------------- | ---------------------------------------------- |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp LLD từ SRS, HLD và context repo   |

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Nguyên tắc thiết kế chi tiết
5. Cấu trúc module backend
6. Thiết kế use case trọng yếu
7. Validation và error handling
8. State handling
9. Audit và logging
10. Open Questions / TBD

---

## 3. Giới thiệu

### 3.1. Mục đích

Tài liệu này mô tả thiết kế chi tiết mức module/service cho các nghiệp vụ trọng yếu trong hệ thống. LLD dùng làm đầu vào trực tiếp cho lập trình viên trước khi triển khai code.

### 3.2. Tài liệu tham chiếu

| Tài liệu | Vai trò |
| -------- | ------- |
| `01-srs-he-thong-dat-ve-xe-khach.md` | Yêu cầu hệ thống |
| `02-hld-he-thong-dat-ve-xe-khach.md` | Kiến trúc tổng quan và module boundary |
| `04-database-design.md` | Collection, index, transaction, migration |
| `05-api-specification.md` | API contract |
| `07-security-permission-design.md` | Auth, RBAC, audit, threat control |

---

## 4. Nguyên tắc thiết kế chi tiết

| ID | Nguyên tắc |
| -- | ---------- |
| LLD-PRIN-01 | Controller không chứa business logic chính; controller chỉ nhận request, gọi guard/pipe/DTO và chuyển vào service. |
| LLD-PRIN-02 | Mỗi service method nghiệp vụ phải truy vết được về FR/UC/BR tương ứng trong SRS. |
| LLD-PRIN-03 | Mọi thao tác tạo/sửa tiền, vé, ghế, policy, quyền hoặc dữ liệu tenant phải kiểm RBAC, ownership và audit. |
| LLD-PRIN-04 | Payment callback, refund callback, seat hold và job retry phải idempotent. |
| LLD-PRIN-05 | Dữ liệu theo Operator phải filter theo `operatorId` tại service/repository, không chỉ ở UI. |

---

## 5. Cấu trúc module backend

### 5.1. Pattern chung

| Thành phần | Vai trò |
| ---------- | ------- |
| `*.controller.ts` | HTTP endpoint, guard, pipe, DTO, response mapping |
| `*.service.ts` | Use case orchestration, validation nghiệp vụ, transaction/lock boundary |
| `*.repository.ts` | Truy vấn MongoDB, atomic update, index-aware query |
| `schemas/*.schema.ts` | Mongoose schema, index, enum, soft delete |
| `dto/*.dto.ts` | Request validation và response shape |
| `processors/*.processor.ts` | Bull queue processor nếu module có job nền |
| `events/*.event.ts` | Event nội bộ cho notification, audit, realtime |

### 5.2. Module chi tiết

| Module | Service chính | Trách nhiệm LLD | Rủi ro cần kiểm |
| ------ | ------------- | --------------- | --------------- |
| Auth | `AuthService`, `SessionService` | Login, refresh, logout, revoke session, actor-specific auth flow | brute force, token leak, sai actor portal |
| Users | `UserProfileService` | Hồ sơ User, passenger profile, ownership | IDOR, dữ liệu cá nhân |
| Operators | `OperatorProfileService`, `KycService` | KYC, profile, bank account, status history | KYC giả, sửa tài khoản nhận tiền |
| Employees | `EmployeeAccountService`, `AssignmentService` | Employee account, role, assignment, access scope | Employee xem sai chuyến |
| Transport | `VehicleService`, `SeatMapService`, `RouteService`, `TripService` | Vehicle, seat map, route, trip, fare, open/lock sale | thay xe/sơ đồ ghế sau khi có vé |
| Booking | `SeatHoldService`, `BookingService`, `TicketService` | Hold seat, booking snapshot, ticket, QR token | bán trùng ghế, ticket giả |
| Payment | `PaymentService`, `RefundService`, `EscrowLedgerService`, `PayoutService` | Payment, refund, escrow, commission, payout | callback trùng, hoàn tiền trùng |
| Promotion | `PromotionService`, `PromotionRuleService` | Rule, validation, redemption, snapshot | dùng sai mã, dùng trùng |
| Support | `SupportTicketService`, `DisputeCaseService`, `ReviewService` | Support, complaint, review, dispute workflow | thiếu bằng chứng, dispute sai state |
| Notification | `NotificationService`, `DeliveryService`, `PreferenceService` | Event, channel delivery, retry, preference | gửi lỗi, tắt thông báo bắt buộc |
| Reporting | `ReportService`, `ExportJobService` | Dashboard, async export | truy vấn lớn làm chậm hệ thống |
| Audit | `AuditService` | Ghi audit log cho thao tác nhạy cảm | thiếu log, log lộ dữ liệu nhạy cảm |

---

## 6. Thiết kế use case trọng yếu

### 6.1. Seat hold

| Bước | Xử lý |
| ---- | ----- |
| 1 | Validate trip đang mở bán, chưa hết thời gian bán online, seat thuộc `TripSeat`. |
| 2 | Kiểm tra seat chưa `BOOKED`, chưa `BLOCKED`, chưa có hold còn hiệu lực. |
| 3 | Tạo hold bằng atomic update hoặc Redis lock + DB state update theo Database Design. |
| 4 | Gắn hold với actor/session, danh sách seat, TTL, idempotency key nếu có. |
| 5 | Khi TTL hết hạn, job nền giải phóng hold nếu chưa tạo booking/payment hợp lệ. |

### 6.2. Create booking

| Bước | Xử lý |
| ---- | ----- |
| 1 | Validate SeatHold còn hiệu lực và thuộc actor/session. |
| 2 | Validate passenger info, contact, pickup/dropoff, fare, promotion. |
| 3 | Tính tổng tiền và lưu snapshot bắt buộc: trip, operator, route, fare, policy, promotion. |
| 4 | Tạo booking `PENDING_PAYMENT` hoặc `PENDING_CONFIRMATION` nếu luồng thanh toán sau được chốt. |
| 5 | Ghi state history và audit/operation log nếu có thao tác nhạy cảm. |

### 6.3. Payment callback

| Bước | Xử lý |
| ---- | ----- |
| 1 | Verify signature, provider transaction id, amount, booking id, status. |
| 2 | Kiểm idempotency theo provider transaction id và payment id. |
| 3 | Nếu success hợp lệ, cập nhật payment, booking, seat, escrow ledger và ticket trigger. |
| 4 | Nếu lệch trạng thái hoặc callback trễ, chuyển `RECONCILING` và không phát hành ticket khi chưa đủ căn cứ. |
| 5 | Gửi notification và ghi audit/state history. |

### 6.4. Check-in ticket

| Bước | Xử lý |
| ---- | ----- |
| 1 | Employee đăng nhập, được phân công hoặc có quyền check-in chuyến. |
| 2 | Hệ thống xác thực QR token server-side, không tin dữ liệu encode trong QR. |
| 3 | Validate ticket `VALID`, đúng trip, chưa `CHECKED_IN`, chưa `CANCELLED`, chưa `REFUNDED`. |
| 4 | Cập nhật ticket/passenger status và tạo `CheckInEvent`. |
| 5 | Đồng bộ realtime cho Operator/Admin và ghi operation log. |

---

## 7. Validation và error handling

| Nhóm lỗi | Error code gợi ý | Ghi chú |
| -------- | ---------------- | ------- |
| Auth | `AUTH_INVALID_CREDENTIALS`, `AUTH_ACCOUNT_LOCKED`, `AUTH_SESSION_EXPIRED` | Không tiết lộ tài khoản có tồn tại hay không |
| Permission | `PERMISSION_DENIED`, `TENANT_SCOPE_VIOLATION` | Dùng cho Operator/Employee/Admin |
| Seat | `SEAT_NOT_AVAILABLE`, `SEAT_HOLD_EXPIRED`, `SEAT_HOLD_CONFLICT` | Không giả định giữ ghế thành công khi lock lỗi |
| Booking | `BOOKING_EXPIRED`, `BOOKING_INVALID_STATE`, `BOOKING_SNAPSHOT_CHANGED` | Cần hướng xử lý cho client |
| Payment | `PAYMENT_INVALID_CALLBACK`, `PAYMENT_AMOUNT_MISMATCH`, `PAYMENT_RECONCILING` | Không ghi tiền trùng |
| Refund | `REFUND_POLICY_DENIED`, `REFUND_ALREADY_PROCESSED`, `REFUND_RECONCILING` | Audit bắt buộc |
| Ticket | `TICKET_INVALID`, `TICKET_ALREADY_CHECKED_IN`, `TICKET_REVOKED` | QR xác thực server-side |

---

## 8. State handling

| State group | Nguồn chuẩn | LLD cần chốt |
| ----------- | ----------- | ------------ |
| Trip | SRS §17.1 | Transition hợp lệ, actor được phép đổi state |
| Seat | SRS §17.2 | Atomic update, hold TTL, block/manual inventory |
| Booking | SRS §17.3 | Transition khi payment success/fail/expire/refund |
| Ticket | SRS §17.4 | Transition khi issue/check-in/no-show/refund |
| Payment | SRS §17.5 | Callback idempotency và reconciliation |
| Refund | SRS §17.6 | Manual/auto refund state machine |
| DisputeCase | SRS §17.7 | Evidence, timeout, escalation, final decision |

---

## 9. Audit và logging

| Sự kiện | Bắt buộc audit | Dữ liệu cần lưu |
| ------- | -------------- | --------------- |
| Đổi bank account Operator | Có | actor, operatorId, before/after masked, reason |
| Refund thủ công | Có | adminId, booking/payment/refund id, amount, reason |
| Đổi policy/commission/payout | Có | before/after, effective date, actor |
| Đổi trip đã có vé bán | Có | tripId, affected bookings, reason |
| Khóa/mở khóa tài khoản | Có | target actor, actor thực hiện, reason |
| Check-in | Operation log | employeeId, tripId, ticketId, result |

---

## 10. Open Questions / TBD

| ID | Câu hỏi | Tác động |
| -- | ------- | -------- |
| LLD-OQ-01 | SeatHold dùng Redis lock, MongoDB atomic update hay kết hợp? | Booking implementation |
| LLD-OQ-02 | Có hỗ trợ `PENDING_CONFIRMATION` trong v1 không? | Booking/payment state |
| LLD-OQ-03 | Payment provider đầu tiên là gì? | Callback verification |
| LLD-OQ-04 | QR token rotate/revoke policy cụ thể ra sao? | Ticket/check-in |
| LLD-OQ-05 | AuditLog lưu cùng MongoDB hay storage riêng? | Audit implementation |
