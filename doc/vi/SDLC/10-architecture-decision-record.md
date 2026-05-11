# 10. Architecture Decision Record - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| Tên tài liệu | Architecture Decision Record - ADR |
| Mã tài liệu  | 10-architecture-decision-record  |
| Dự án        | Hệ thống đặt vé xe khách         |
| Phiên bản    | v0.1                             |
| Trạng thái   | Draft                            |
| Người viết   | AI Agent                         |
| Người duyệt  | Nguyễn Hồng Khanh                |
| Ngày tạo     | 11/05/2026                       |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                         |
| --------- | ---------- | -------------- | ----------------------------------------- |
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
| Trạng thái | Proposed / Accepted / Superseded / Deprecated |
| Bối cảnh | Vấn đề cần quyết định |
| Quyết định | Phương án được chọn |
| Hệ quả | Tác động tích cực/tiêu cực |
| Nguồn | SRS/HLD/OQ liên quan |

AI Agent không tự chuyển ADR sang `Accepted` nếu chưa có người duyệt xác nhận.

---

## 4. Danh sách quyết định

| ID | Tiêu đề | Trạng thái | Nguồn |
| -- | ------- | ---------- | ----- |
| ADR-001 | Managed marketplace là mô hình sản phẩm v1 | Proposed | SRS MQ-05 |
| ADR-002 | Backend v1 dùng modular monolith NestJS | Proposed | HLD-DEC-01 |
| ADR-003 | MongoDB là operational database chính | Proposed | Tech Stack / HLD |
| ADR-004 | Redis dùng cho cache, queue và seat hold support | Proposed | Tech Stack / HLD |
| ADR-005 | Payment flow dùng escrow trước payout Operator | Proposed | SRS MQ-01 |
| ADR-006 | Payment/notification/storage dùng adapter boundary | Proposed | HLD-DEC-03 |
| ADR-007 | Mobile dùng một codebase Expo cho User và Employee | Proposed | SRS OQ-10 |
| ADR-008 | Admin là arbiter cuối cùng trong dispute | Proposed | SRS MQ-03 |

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

### ADR-002. Backend v1 dùng modular monolith NestJS

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Proposed |
| Bối cảnh | Repo hiện có một backend NestJS với module pattern. Microservice sẽ tăng chi phí vận hành khi chưa cần. |
| Quyết định | V1 triển khai modular monolith, chia module rõ và tách boundary để có thể mở rộng sau. |
| Hệ quả | Đơn giản deploy/vận hành; cần discipline về module boundary để tránh coupling. |
| Nguồn | HLD-DEC-01 |

### ADR-003. MongoDB là operational database chính

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Proposed |
| Bối cảnh | Tech stack hiện dùng NestJS + Mongoose + MongoDB. |
| Quyết định | MongoDB là database vận hành chính trong v1. |
| Hệ quả | Cần thiết kế index/transaction/atomic update kỹ cho booking, payment, report. |
| Nguồn | TECH-STACK, HLD |

### ADR-004. Redis dùng cho cache, queue và seat hold support

| Trường | Nội dung |
| ------ | -------- |
| Trạng thái | Proposed |
| Bối cảnh | Seat hold, cache search, Bull queue và retry job cần Redis hoặc lock service tương đương. |
| Quyết định | Redis dùng cho cache/lock/queue support. |
| Hệ quả | Redis trở thành hạ tầng trọng yếu; cần monitoring và fallback policy. |
| Nguồn | SRS DP-04, HLD |

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
| Nguồn | HLD-DEC-03 |

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

---

## 6. Open Questions / TBD

| ID | Câu hỏi | Tác động |
| -- | ------- | -------- |
| ADR-OQ-01 | ADR nào đã được người duyệt chính thức chấp nhận? | Trạng thái ADR |
| ADR-OQ-02 | Có cần tách ADR theo từng file riêng khi số lượng tăng không? | Quản lý tài liệu |
| ADR-OQ-03 | Node/npm/Docker image có cần pin cứng bằng ADR không? | Deployment |
