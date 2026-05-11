# 08. Test Plan & Acceptance Criteria - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| Tên tài liệu | Test Plan & Acceptance Criteria  |
| Mã tài liệu  | 08-test-plan-acceptance-criteria |
| Dự án        | Hệ thống đặt vé xe khách         |
| Phiên bản    | v0.1                             |
| Trạng thái   | Draft                            |
| Người viết   | AI Agent                         |
| Người duyệt  | Nguyễn Hồng Khanh                |
| Ngày tạo     | 11/05/2026                       |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                         |
| --------- | ---------- | -------------- | ----------------------------------------- |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp Test Plan & Acceptance Criteria |

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Test strategy
5. Test scope
6. Test environment
7. Traceability matrix
8. Acceptance criteria theo nhóm
9. Test case nháp trọng yếu
10. Entry / Exit criteria
11. Open Questions / TBD

---

## 3. Giới thiệu

Tài liệu này mô tả chiến lược kiểm thử, tiêu chí nghiệm thu và test case nháp cho hệ thống. Bản nháp này dùng để chuẩn bị QA trước khi API, DB và UI chi tiết được chốt.

---

## 4. Test strategy

| Cấp độ test | Mục tiêu | Chủ thể chính |
| ----------- | -------- | ------------- |
| Unit test | Kiểm logic service, policy, validation, state transition | Developer |
| Integration test | Kiểm module với database/cache/queue/provider mock | Developer/QA |
| API contract test | Kiểm endpoint, DTO, error code, permission | QA/Developer |
| E2E test | Kiểm luồng user/operator/employee/admin chính | QA |
| Security test | Kiểm auth, RBAC, tenant boundary, IDOR, rate limit | QA/Security |
| Performance test | Search, seat hold, payment callback, report export | QA/DevOps |
| UAT | Người duyệt xác nhận nghiệp vụ | Người duyệt/PO |

---

## 5. Test scope

| Nhóm | Trong scope | Mức ưu tiên |
| ---- | ----------- | ----------- |
| IAM | Đăng ký, đăng nhập, refresh, logout, role, session revoke | Cao |
| Marketplace | Search, filter, trip detail, seat map, booking, ticket | Cao |
| Booking/Payment | SeatHold, create booking, payment callback, refund | Rất cao |
| Operator OS | KYC, vehicle, route, trip, booking list, finance | Cao |
| Employee | Assignment, passenger list, QR check-in, incident report | Cao |
| Admin | KYC approval, policy, payment/refund, dispute, audit | Cao |
| Notification | Event, delivery retry, preference | Trung bình |
| Reporting | Dashboard, filter, async export | Trung bình |

---

## 6. Test environment

| Môi trường | Mục đích | Ghi chú |
| ---------- | -------- | ------- |
| Local | Dev/unit/integration nhanh | MongoDB/Redis/OSRM local |
| CI | Typecheck, lint, unit/integration tự động | Cần seed data ổn định |
| Staging | E2E, provider sandbox, UAT | Cần payment/notification sandbox |
| Production | Smoke test sau deploy | Không dùng dữ liệu giả nhạy cảm |

---

## 7. Traceability matrix

| Nguồn | Test artifact cần có |
| ----- | -------------------- |
| FR-IAM-* | Auth unit/integration/API/security test |
| FR-MKT-* | Search/trip detail/booking UI/API/E2E test |
| FR-BTP-* | SeatHold, payment, ticket, refund integration/E2E test |
| FR-OPR-* | Operator onboarding/finance API/E2E test |
| FR-OPS-* | Vehicle/route/trip/fare/inventory test |
| FR-EMP-* | Employee mobile/API/check-in test |
| FR-ADM-* | Admin portal/API/security/audit test |
| FR-NSR-* | Notification/support/review/reporting test |
| FR-DSP-* | Dispute state machine test |
| NFR-* | Performance, security, availability, privacy test |

---

## 8. Acceptance criteria theo nhóm

| Nhóm | Acceptance criteria nháp |
| ---- | ------------------------ |
| User booking | User tìm chuyến, chọn ghế, tạo booking, thanh toán thành công, nhận ticket QR và xem lại ticket. |
| Seat safety | Hai user không thể mua cùng một ghế trên cùng một chuyến dù thao tác đồng thời. |
| Payment safety | Callback trùng không tạo payment/booking/ticket/ledger trùng. |
| Refund | User/Admin hủy vé đúng policy snapshot, refund state hiển thị rõ, audit được ghi. |
| Operator | Operator chỉ xem/quản lý dữ liệu trong tenant của mình. |
| Employee | Employee chỉ check-in chuyến được phân công và không xem dữ liệu ngoài scope. |
| Admin | Admin xử lý KYC/refund/dispute/policy có re-auth/audit với quyền phù hợp. |
| Notification | Ticket vẫn xem được dù email/SMS/push thất bại; delivery retry được ghi nhận. |
| Reporting | Báo cáo lớn không làm chậm luồng booking/payment/check-in chính. |

---

## 9. Test case nháp trọng yếu

| ID | Test case | Loại test | Ưu tiên |
| -- | --------- | --------- | ------- |
| TC-BOOK-001 | Giữ ghế thành công với SeatHold còn TTL | Integration | Cao |
| TC-BOOK-002 | Hai user giữ cùng ghế đồng thời, chỉ một thành công | Integration/Concurrency | Rất cao |
| TC-BOOK-003 | SeatHold hết hạn tự giải phóng ghế | Integration/Job | Cao |
| TC-PAY-001 | Payment callback success cập nhật booking/payment/ticket/escrow | Integration | Rất cao |
| TC-PAY-002 | Callback trùng không ghi nhận trùng tiền/ticket | Integration | Rất cao |
| TC-REF-001 | Hủy vé trước hạn tạo refund request đúng policy | E2E | Cao |
| TC-SEC-001 | Operator A không xem booking Operator B | Security | Rất cao |
| TC-EMP-001 | Employee check-in ticket hợp lệ được phân công | E2E | Cao |
| TC-EMP-002 | Employee không được check-in chuyến ngoài assignment | Security | Cao |
| TC-ADM-001 | Admin refund thủ công yêu cầu re-auth và ghi audit | E2E/Security | Cao |

---

## 10. Entry / Exit criteria

### 10.1. Entry criteria

| Điều kiện | Trạng thái nháp |
| --------- | --------------- |
| SRS liên quan đã Review/Approved | TBD |
| HLD/LLD/API/DB liên quan đã Review/Approved | TBD |
| Test environment có seed data | TBD |
| Provider sandbox sẵn sàng | TBD |

### 10.2. Exit criteria

| Điều kiện | Quy định |
| --------- | -------- |
| Test case critical pass | 100% critical pass hoặc có quyết định chấp nhận rủi ro |
| High bug | Không còn high severity chưa xử lý |
| Security blocker | Không còn lỗi IDOR/RBAC/payment/seat critical |
| Test evidence | Có log/screenshot/report cho UAT và regression |

---

## 11. Open Questions / TBD

| ID | Câu hỏi | Tác động |
| -- | ------- | -------- |
| TEST-OQ-01 | Bộ test automation ưu tiên backend hay E2E trước? | Kế hoạch QA |
| TEST-OQ-02 | Dùng provider sandbox nào cho payment/notification? | Integration test |
| TEST-OQ-03 | Có yêu cầu performance baseline cụ thể cho seat hold/payment không? | Load test |
| TEST-OQ-04 | UAT data set do ai chuẩn bị? | UAT |
