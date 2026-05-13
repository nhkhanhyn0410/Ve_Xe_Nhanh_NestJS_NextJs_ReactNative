# 06. UI/UX Flow Specification - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| Tên tài liệu | UI/UX Flow Specification         |
| Mã tài liệu  | 06-ui-ux-flow-specification      |
| Dự án        | Hệ thống đặt vé xe khách         |
| Phiên bản    | v0.1                             |
| Trạng thái   | Draft                            |
| Người viết   | AI Agent                         |
| Người duyệt  | Nguyễn Hồng Khanh                |
| Ngày tạo     | 11/05/2026                       |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                         |
| --------- | ---------- | -------------- | ----------------------------------------- |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp UI/UX Flow Specification     |

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Kênh giao diện
5. Information architecture
6. Flow hành khách
7. Flow Operator
8. Flow Employee
9. Flow Admin
10. Screen state và validation
11. Open Questions / TBD

---

## 3. Giới thiệu

Tài liệu này mô tả luồng màn hình, trạng thái giao diện, form validation và xử lý lỗi ở mức UX. Thiết kế visual chi tiết, component spec và wireframe/pixel spec sẽ được phát triển sau khi flow được duyệt.

---

## 4. Kênh giao diện

| Kênh | Actor | Mục tiêu |
| ---- | ----- | -------- |
| Web public portal | User, Guest | Search, trip detail, booking, payment, ticket lookup |
| Web operator portal | Operator | Quản lý profile, vehicle, route, trip, booking, employee, finance |
| Web admin portal | Admin | KYC, catalog, policy, payment, dispute, report, audit |
| Mobile app - User mode | User | Booking/ticket/notification/support trên mobile |
| Mobile app - Employee mode | Employee | Check-in, trip status, passenger list, incident report |

---

## 5. Information architecture

| Portal | Nhóm navigation chính |
| ------ | --------------------- |
| Public/User | Search, Trip detail, Booking stepper, Payment result, My tickets, Support, Profile, Notification settings |
| Operator | Dashboard, Profile/KYC, Vehicles, Seat maps, Routes, Trips, Bookings, Employees, Finance, Reports, Support |
| Employee | Assigned trips, Passenger list, QR scan, Trip status, Journey log, Incidents, Profile |
| Admin | Dashboard, Operators/KYC, Users, Catalog, Policy, Payments/Refunds, Disputes, Promotions, Reports, Audit, Integrations |

---

## 6. Flow hành khách

### 6.1. Search -> booking -> ticket

| Bước | Màn hình | Trạng thái chính |
| ---- | -------- | ---------------- |
| 1 | Search form | default, invalid input, loading |
| 2 | Search result | loading, empty, result, filter/sort active, stale availability |
| 3 | Trip detail | loading, unavailable, open for sale, seat map loaded |
| 4 | Seat selection | available/holding/booked/blocked, hold timer, hold conflict |
| 5 | Passenger/contact form | valid, invalid, promotion valid/invalid |
| 6 | Booking summary | price snapshot, policy confirmation, expired hold |
| 7 | Payment redirect/result | processing, success, failed, reconciling |
| 8 | Ticket detail | valid, cancelled, checked-in, refunded |

### 6.2. Hủy vé / hoàn tiền

| Bước | Màn hình | Ghi chú |
| ---- | -------- | ------- |
| 1 | Ticket detail | Hiển thị chính sách hủy snapshot |
| 2 | Cancel/refund preview | Số tiền hoàn dự kiến, phí, lý do đủ/không đủ điều kiện |
| 3 | Confirmation | Re-auth nếu cần |
| 4 | Refund status | requested, processing, success, failed, rejected |

### 6.3. Support / complaint / review

| Bước | Màn hình | Ghi chú |
| ---- | -------- | ------- |
| 1 | Support center | Chọn booking/ticket/trip liên quan |
| 2 | Create ticket | Loại vấn đề, mô tả, attachment |
| 3 | Ticket thread | Trao đổi, trạng thái, yêu cầu bổ sung |
| 4 | Review form | Chỉ sau khi trip completed và ticket hợp lệ |

---

## 7. Flow Operator

| Flow | Màn hình chính | Ghi chú |
| ---- | -------------- | ------- |
| KYC onboarding | Profile, KYC documents, bank account, status tracker | Chờ Admin duyệt |
| Vehicle/SeatMap | Vehicle list, vehicle form, seat map editor | Không sửa tùy tiện khi đã gắn trip có vé |
| Route/StopPoint | Route list, route form, stop point proposal | StopPoint mới cần Admin duyệt |
| Trip/Fare | Trip calendar/list, trip form, fare form, open/lock sale | Thay đổi trip đã bán vé cần lý do |
| Booking/Ticket | Booking list, passenger list, export | Mask dữ liệu cá nhân theo quyền |
| Employee | Employee list, role, assignment | Role: TICKET_STAFF, DRIVER, SUPPORT_STAFF |
| Finance | Escrow, commission, payout, reconciliation | Dữ liệu chỉ thuộc Operator |

---

## 8. Flow Employee

| Flow | Màn hình chính | Ghi chú |
| ---- | -------------- | ------- |
| Xem nhiệm vụ | Assigned trips | Chỉ chuyến được phân công |
| Xem khách | Passenger list | Search theo tên/mã vé/số điện thoại được phép |
| Check-in | QR scanner / manual code | Xác thực server-side |
| Cập nhật chuyến | Trip status | Chỉ role/quyền phù hợp |
| Báo sự cố | Incident form | Loại sự cố, mức độ, mô tả, attachment |
| Offline/sync | Pending sync state | Chính sách conflict TBD |

---

## 9. Flow Admin

| Flow | Màn hình chính | Ghi chú |
| ---- | -------------- | ------- |
| KYC Operator | Pending KYC list, KYC detail, decision modal | Approve/reject/request more info |
| Catalog/policy | Catalog list, policy editor, effective date | Thay đổi policy cần audit |
| Payment/refund | Transaction list, detail, refund decision | Re-auth và audit |
| Dispute | Dispute queue, evidence view, decision | Admin là arbiter cuối cùng theo SRS |
| Content/review moderation | Review/content list | Ẩn/duyệt/từ chối theo policy |
| Report | Dashboard, filter, export job | Dữ liệu lớn async |
| Audit | Audit search, detail, export | Mask dữ liệu nhạy cảm |

---

## 10. Screen state và validation

| Loại state | Bắt buộc xử lý |
| ---------- | -------------- |
| Loading | Skeleton/spinner phù hợp, không khóa toàn app nếu chỉ refresh một panel |
| Empty | Thông báo rõ, có hướng hành động kế tiếp |
| Error | Message rõ, không lộ dữ liệu nhạy cảm, có retry nếu phù hợp |
| Permission denied | Hiển thị không đủ quyền, không lộ dữ liệu bị chặn |
| Stale data | Yêu cầu reload/xác nhận lại khi giá/ghế/policy thay đổi |
| Form invalid | Báo lỗi tại field, không chỉ báo lỗi tổng quát |
| Offline mobile | Hiển thị pending sync, retry và cảnh báo dữ liệu chưa đồng bộ |

---

## 11. Open Questions / TBD

| ID | Câu hỏi | Tác động |
| -- | ------- | -------- |
| UX-OQ-01 | Guest checkout có trong v1 không? | Public booking flow |
| UX-OQ-02 | Web dùng token storage hay cookie session? | Auth UX và Security |
| UX-OQ-03 | Seat map editor dùng grid tự do hay template theo vehicle type? | Operator UI |
| UX-OQ-04 | Offline check-in cho Employee có cho phép xác nhận khi chưa gọi server không? | Mobile flow và risk |
| UX-OQ-05 | Brand positioning marketplace trung lập hay Platform brand nổi bật? | Public UI |
