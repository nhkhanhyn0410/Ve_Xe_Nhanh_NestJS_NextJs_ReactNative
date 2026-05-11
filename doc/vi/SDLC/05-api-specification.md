# 05. API Specification - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| Tên tài liệu | API Specification                |
| Mã tài liệu  | 05-api-specification             |
| Dự án        | Hệ thống đặt vé xe khách         |
| Phiên bản    | v0.1                             |
| Trạng thái   | Draft                            |
| Người viết   | AI Agent                         |
| Người duyệt  | Nguyễn Hồng Khanh                |
| Ngày tạo     | 11/05/2026                       |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                         |
| --------- | ---------- | -------------- | ----------------------------------------- |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp API Specification            |

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Quy ước API
5. Auth và permission
6. Response và error format
7. Endpoint groups
8. Idempotency
9. Pagination, filtering, sorting
10. Webhook và realtime API
11. Open Questions / TBD

---

## 3. Giới thiệu

Tài liệu này mô tả API contract mức nháp cho frontend, mobile và backend. Chi tiết request/response DTO sẽ được hoàn thiện sau khi Database Design và LLD ổn định.

---

## 4. Quy ước API

| Quy ước | Giá trị nháp |
| ------- | ------------ |
| Base path | `/api/v1` |
| Format | JSON |
| Auth | Bearer token hoặc cơ chế session/token được chốt trong Security Design |
| Timezone hiển thị | `Asia/Ho_Chi_Minh` |
| Time lưu trữ | UTC |
| Currency | VND |
| Naming | camelCase cho JSON field |
| Idempotency header | `Idempotency-Key` cho thao tác payment/refund/booking nhạy cảm |
| Correlation header | `X-Request-Id` nếu client/gateway cung cấp |

---

## 5. Auth và permission

| Actor | Auth flow | Ghi chú |
| ----- | --------- | ------- |
| Guest | Không cần token cho public search/detail; xác minh bổ sung cho ticket lookup nhạy cảm | Guest checkout TBD |
| User | Email/phone auth theo SRS | Có refresh/session policy |
| Operator | Username/password được cấp | Không dùng public User login |
| Employee | Username/password do Operator cấp | Scope theo operatorId và assignment |
| Admin | Admin account nội bộ | Không tự đăng ký public |

---

## 6. Response và error format

### 6.1. Response thành công

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "TBD"
  }
}
```

### 6.2. Response lỗi

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_EXPIRED",
    "message": "Booking da het han thanh toan",
    "details": {}
  },
  "meta": {
    "requestId": "TBD"
  }
}
```

### 6.3. Nhóm error code

| Prefix | Nhóm lỗi |
| ------ | -------- |
| `AUTH_*` | Đăng nhập, session, token |
| `PERMISSION_*` | RBAC, ownership, tenant boundary |
| `VALIDATION_*` | Input/DTO không hợp lệ |
| `SEAT_*` | Chọn ghế, giữ ghế, xung đột ghế |
| `BOOKING_*` | Booking state/snapshot |
| `PAYMENT_*` | Payment, callback, reconciliation |
| `REFUND_*` | Refund policy/state |
| `TICKET_*` | Ticket, QR, check-in |
| `OPERATOR_*` | KYC, profile, status |
| `SYSTEM_*` | Provider lỗi, bảo trì, lỗi không phân loại |

---

## 7. Endpoint groups

### 7.1. Auth

| Method | Path | Actor | Mục đích |
| ------ | ---- | ----- | -------- |
| POST | `/auth/register` | User | Đăng ký User |
| POST | `/auth/login` | User | Đăng nhập User |
| POST | `/auth/operator/login` | Operator, Employee | Đăng nhập Operator/Employee |
| POST | `/auth/admin/login` | Admin | Đăng nhập Admin |
| POST | `/auth/refresh` | Authenticated | Refresh token |
| POST | `/auth/logout` | Authenticated | Logout |
| POST | `/auth/re-auth` | Authenticated | Xác thực lại thao tác nhạy cảm |

### 7.2. Marketplace

| Method | Path | Actor | Mục đích |
| ------ | ---- | ----- | -------- |
| GET | `/trips/search` | User, Guest | Tìm kiếm chuyến |
| GET | `/trips/{tripId}` | User, Guest | Xem chi tiết chuyến |
| GET | `/operators/{operatorId}/public-profile` | User, Guest | Xem profile Operator |
| POST | `/seat-holds` | User | Giữ ghế |
| DELETE | `/seat-holds/{holdId}` | User | Hủy hold |
| POST | `/bookings` | User | Tạo booking |
| GET | `/bookings/{bookingId}` | User | Xem booking |
| POST | `/bookings/{bookingId}/payments` | User | Tạo payment |
| GET | `/tickets/{ticketId}` | User | Xem vé |
| POST | `/guest/ticket-lookup` | Guest | Tra cứu vé khách vãng lai |

### 7.3. Operator OS

| Method | Path | Actor | Mục đích |
| ------ | ---- | ----- | -------- |
| GET/PUT | `/operator/profile` | Operator | Xem/cập nhật hồ sơ |
| POST | `/operator/kyc-documents` | Operator | Upload hồ sơ KYC |
| GET | `/operator/finance/escrow` | Operator | Xem escrow balance |
| GET/POST/PUT | `/operator/vehicles` | Operator | Quản lý vehicle |
| GET/POST/PUT | `/operator/seat-maps` | Operator | Quản lý seat map |
| GET/POST/PUT | `/operator/routes` | Operator | Quản lý route |
| GET/POST/PUT | `/operator/trips` | Operator | Quản lý trip |
| GET | `/operator/bookings` | Operator | Xem booking/ticket thuộc Operator |
| GET/POST/PUT | `/operator/employees` | Operator | Quản lý Employee |

### 7.4. Employee operations

| Method | Path | Actor | Mục đích |
| ------ | ---- | ----- | -------- |
| GET | `/employee/assignments` | Employee | Xem nhiệm vụ/chuyến được phân công |
| GET | `/employee/trips/{tripId}/passengers` | Employee | Xem danh sách hành khách |
| POST | `/employee/tickets/verify` | Employee | Xác thực QR/mã vé |
| POST | `/employee/check-ins` | Employee | Check-in hành khách |
| POST | `/employee/trips/{tripId}/status` | Employee | Cập nhật trạng thái chuyến |
| POST | `/employee/incidents` | Employee | Báo cáo sự cố |

### 7.5. Admin

| Method | Path | Actor | Mục đích |
| ------ | ---- | ----- | -------- |
| GET | `/admin/dashboard` | Admin | Dashboard tổng quan |
| GET/PUT | `/admin/operators/{operatorId}/kyc` | Admin | Duyệt/từ chối/yêu cầu bổ sung KYC |
| GET/POST/PUT | `/admin/catalog/*` | Admin | Catalog chuẩn |
| GET/POST/PUT | `/admin/policies` | Admin | Policy hủy/giữ ghế/dữ liệu |
| GET/POST/PUT | `/admin/commission-rules` | Admin | Commission rule |
| GET | `/admin/payments` | Admin | Giám sát payment |
| POST | `/admin/refunds/{refundId}/manual-decision` | Admin | Refund thủ công |
| GET/PUT | `/admin/disputes` | Admin | Dispute workflow |
| GET | `/admin/audit-logs` | Admin | Truy xuất audit |

---

## 8. Idempotency

| API | Idempotency bắt buộc | Key |
| --- | -------------------- | --- |
| `POST /seat-holds` | Có | actor/session + trip + seats hoặc client key |
| `POST /bookings` | Có | SeatHold id + client key |
| `POST /bookings/{id}/payments` | Có | booking id + method + client key |
| Payment callback | Có | provider transaction id |
| Refund request | Có | booking/payment/refund id + reason |
| Ticket issuance | Có | booking item id |

---

## 9. Pagination, filtering, sorting

| Quy ước | Giá trị nháp |
| ------- | ------------ |
| Pagination | `page`, `limit` hoặc cursor cho dữ liệu lớn |
| Sorting | `sortBy`, `sortOrder` |
| Filtering | Query params theo từng endpoint |
| Max limit | TBD |
| Export lớn | Async job, không trả file lớn trực tiếp nếu vượt ngưỡng |

---

## 10. Webhook và realtime API

| Loại | Path / event | Ghi chú |
| ---- | ------------ | ------- |
| Payment callback | `/webhooks/payment/{provider}` | Verify signature, idempotent |
| Refund callback | `/webhooks/refund/{provider}` | Provider-dependent, TBD |
| Socket event | `booking.updated` | User/Operator |
| Socket event | `trip.operation.updated` | Operator/Admin |
| Socket event | `employee.assignment.updated` | Employee |
| Socket event | `dispute.updated` | User/Operator/Admin |

---

## 11. Open Questions / TBD

| ID | Câu hỏi | Tác động |
| -- | ------- | -------- |
| API-OQ-01 | Auth token lưu/cấp qua Bearer hay cookie cho web? | FE/API/Security |
| API-OQ-02 | Guest checkout có nằm trong v1 không? | Booking API |
| API-OQ-03 | Provider payment đầu tiên là gì? | Webhook contract |
| API-OQ-04 | Chuẩn pagination dùng page hay cursor cho từng list? | API consistency |
| API-OQ-05 | Error code chính thức có cần versioning không? | FE/Mobile handling |
