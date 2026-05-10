# 01. Software Requirements Specification - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                                                        |
| ------------ | -------------------------------------------------------------- |
| Tên tài liệu | Software Requirements Specification - Hệ thống đặt vé xe khách |
| Mã tài liệu  | 01-srs-he-thong-dat-ve-xe-khach                                |
| Dự án        | Hệ thống đặt vé xe khách                                       |
| Phiên bản    | v1.9                                                           |
| Trạng thái   | Draft                                                          |
| Người viết   | Nguyễn Hồng Khanh, Nguyễn Xuân Trường, Lê Võ Thanh Uy          |
| Người duyệt  | Nguyễn Hồng Khanh                                              |
| Ngày tạo     | 05/05/2026                                                     |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật              | Nội dung thay đổi                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------- | ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0      | 05/05/2026 | AI Agent, Nguyễn Hồng Khanh | Tạo bản đầu từ tài liệu ý tưởng `he-thong-dat-ve-xe-khach.md` và đối chiếu với code backend hiện có                                                                                                                                                                                                                                                                                                                       |
| v1.1      | 08/05/2026 | Nguyễn Hồng Khanh           | Hiệu chỉnh 7.4 bỏ Tài xế (Drive) thay bằng Nhân viên nhà xe (Employee) và hiệu chỉnh một số điểm.                                                                                                                                                                                                                                                                                                                         |
| v1.2      | 10/05/2026 | AI Agent, Nguyễn Hồng Khanh | Chốt OQ-01..04 (state enum + Employee) và đồng bộ FR: §10.1 cập nhật `FR-AUTH-04`, §10.3 cập nhật `FR-OP-13..15` và thêm `FR-OP-21..23`, §10.4 đổi tên thành "Nhân viên nhà xe (Employee)" và đổi prefix `FR-DRIVER-*` → `FR-EMP-*` (18 FR có cột Role áp dụng), §10.5 thêm `FR-ADMIN-21..22`, §24 đánh dấu OQ-01..04 đã chốt                                                                                             |
| v1.3      | 10/05/2026 | AI Agent, Nguyễn Hồng Khanh | Chốt MQ-01..05 (định vị marketplace). Tái cấu trúc §4 (6 mục con: định vị, vai trò 3 bên, mô hình doanh thu, 3 lớp dịch vụ, boundary, kiến trúc triển khai), §5 (4 nhóm mục tiêu: sản phẩm, nền tảng, tin cậy / compliance, vận hành), §6 (4 nhóm phạm vi: Marketplace layer, Operator OS layer, Platform admin layer, Ngoài phạm vi). §24 ghi nhận MQ-01..05 đã chốt và bổ sung OQ-16..20 phái sinh từ marketplace model |
| v1.4      | 10/05/2026 | Nguyễn Xuân Trường          | Hiệu chỉnh mục 7 Actor và vai trò theo cấu trúc thống nhất; làm rõ quan hệ giữa Người dùng, Nhà xe, Admin toàn hệ thống và Nhân viên nhà xe trong mô hình marketplace; cập nhật Employee gồm 3 role `TICKET_STAFF`, `DRIVER`, `SUPPORT_STAFF` và gom nhóm quyền của nhân viên nhà xe theo chức năng vận hành.                                                                                                             |
| v1.5      | 10/05/2026 | AI Agent, Lê Võ Thanh Uy    | liệt kê các giả định, ràng buộc, phụ thuộc cần có.                                                                                                                                                                                                                                                                                                                                                                        |
| v1.6      | 10/05/2026 | Nguyễn Hồng Khanh           | Hiệu chỉnh lỗi định dạng file thủ công, Điều chỉnh mục 6.2 sửa role cho Employee còn lỗi ở phiên bản trước đó                                                                                                                                                                                                                                                                                                             |
| v1.7      | 10/05/2026 | AI Agent, Nguyễn Hồng Khanh | Hiệu chỉnh mục 9 Mô hình dữ liệu mức cao theo định vị managed marketplace, bổ sung nhóm dữ liệu escrow / payout / policy / audit và làm rõ boundary dữ liệu theo Operator.                                                                                                                                                                                                                                                |
| v1.8      | 10/05/2026 | AI Agent, Nguyễn Hồng Khanh | Hiệu chỉnh mục 10 Functional Requirements để phù hợp managed marketplace, Operator OS, Platform admin, Employee role model, Vehicle model, escrow / payout, policy snapshot, audit và data isolation theo Operator.                                                                                                                                                                                                       |
| v1.9      | 10/05/2026 | AI Agent, Nguyễn Hồng Khanh | Hiệu chỉnh mục 11 Non-Functional Requirements và mục 12 Use Case tổng quan để đồng bộ với managed marketplace, Operator OS, Employee role model, Vehicle model, escrow / payout, audit và các FR mới ở mục 10.                                                                                                                                                                                                            |

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Tổng quan hệ thống
5. Mục tiêu hệ thống
6. Phạm vi chức năng
7. Actor và vai trò
8. Giả định, ràng buộc, phụ thuộc
9. Mô hình dữ liệu mức cao
10. Functional Requirements
11. Non-Functional Requirements
12. Use Case tổng quan
13. Use Case chi tiết
14. Business Rules
15. Phân quyền chức năng
16. Luồng nghiệp vụ chính
17. Trạng thái dữ liệu quan trọng
18. Thông báo hệ thống
19. Báo cáo và thống kê
20. Tiêu chí nghiệm thu
21. Module triển khai
22. Rủi ro và biện pháp giảm thiểu
23. Trạng thái triển khai hiện tại
24. Open Questions / TBD
25. Phụ lục

---

## 3. Giới thiệu

### 3.1. Mục đích tài liệu

Tài liệu này mô tả yêu cầu phần mềm cho hệ thống đặt vé xe khách trực tuyến. Tài liệu là nguồn chính thức cho thiết kế, lập trình, kiểm thử và nghiệm thu hệ thống. Tài liệu được viết theo ISO/IEC/IEEE 29148:2018, tailoring nội bộ theo `00a-quy-chuan-cho-lap-trinh-vien.md`.

### 3.2. Đối tượng đọc

| Đối tượng      | Mục đích đọc                                         |
| -------------- | ---------------------------------------------------- |
| Lập trình viên | Hiểu yêu cầu để triển khai backend, frontend, mobile |
| Kiến trúc sư   | Cơ sở để viết HLD, LLD, Database Design, API Spec    |
| QA / Tester    | Cơ sở để viết Test Plan và Acceptance Criteria       |
| Quản lý dự án  | Lập kế hoạch task, ưu tiên module, theo dõi tiến độ  |
| Người duyệt    | Xác nhận tài liệu phù hợp với mục tiêu nghiệp vụ     |

### 3.3. Phạm vi tài liệu

Tài liệu mô tả: phạm vi hệ thống, actor, mô hình dữ liệu mức cao, yêu cầu chức năng (FR), yêu cầu phi chức năng (NFR), use case tổng quan và chi tiết, business rule, phân quyền, luồng nghiệp vụ chính, trạng thái dữ liệu, thông báo, báo cáo, tiêu chí nghiệm thu, gợi ý module triển khai và rủi ro.

Tài liệu KHÔNG mô tả: chi tiết kiến trúc kỹ thuật (xem `02-hld-...`), thiết kế chi tiết module (xem `03-lld-...`), schema database cụ thể (xem `04-database-design.md`), contract API cụ thể (xem `05-api-specification.md`).

### 3.4. Tài liệu tham chiếu

#### 3.4.1. Tham chiếu chính

Các tài liệu cung cấp quy chuẩn chung và phương pháp luận cho dự án.

| Mã                      | Tên                                     | Vai trò                                |
| :---------------------- | :-------------------------------------- | :------------------------------------- |
| ISO/IEC/IEEE 15289:2019 | Content of life-cycle information items | Chuẩn nền cho cấu trúc tài liệu        |
| ISO/IEC/IEEE 29148:2018 | Requirements engineering                | Chuẩn nền cho viết và kiểm tra yêu cầu |
| 00                      | Quy chuẩn SDLC cho lập trình viên       | Quy chuẩn nội bộ cao nhất              |

#### 3.4.2. Tham chiếu phụ

Các tài liệu cụ thể liên quan đến nghiệp vụ và hiện trạng kỹ thuật của dự án.

| Mã                             | Tên                            | Vai trò                                    |
| :----------------------------- | :----------------------------- | :----------------------------------------- |
| `he-thong-dat-ve-xe-khach.md`  | Tài liệu ý tưởng nghiệp vụ     | Nguồn nghiệp vụ ban đầu                    |
| `context/PROJECT-STRUCTURE.md` | Cấu trúc thư mục code hiện tại | Đối chiếu với code backend/frontend/mobile |
| `context/TECH-STACK.md`        | Tech stack đang sử dụng        | Ràng buộc kỹ thuật                         |

### 3.5. Định nghĩa và viết tắt

| Thuật ngữ | Định nghĩa                                                |
| --------- | --------------------------------------------------------- |
| FR        | Functional Requirement - yêu cầu chức năng                |
| NFR       | Non-Functional Requirement - yêu cầu phi chức năng        |
| BR        | Business Rule - quy tắc nghiệp vụ                         |
| UC        | Use Case - trường hợp sử dụng                             |
| AC        | Acceptance Criteria - tiêu chí nghiệm thu                 |
| RBAC      | Role-Based Access Control - phân quyền theo vai trò       |
| OTP       | One-Time Password - mã xác thực một lần                   |
| QR        | Quick Response code - mã vạch hai chiều dùng để check-in  |
| Operator  | Nhà xe - đơn vị vận hành dịch vụ xe khách                 |
| Trip      | Chuyến xe cụ thể theo ngày giờ                            |
| Route     | Tuyến đường giữa hai điểm đầu cuối                        |
| StopPoint | Điểm đón hoặc điểm trả khách                              |
| Booking   | Đơn đặt vé, có thể chứa nhiều ticket                      |
| Ticket    | Vé điện tử cho một ghế của một hành khách trên một chuyến |

---

## 4. Tổng quan hệ thống

### 4.1. Định vị nền tảng

Hệ thống là một **managed marketplace** kết nối ba bên: **hành khách**, **nhà xe (Operator)** và **nền tảng (Platform)**. Platform không sở hữu xe, không thuê tài xế, không trực tiếp vận hành chuyến đi. Platform cung cấp công nghệ, kênh phân phối, hệ thống thanh toán và cơ chế đảm bảo tin cậy giữa hành khách và nhà xe.

```text
Hành khách (User)        Nhà xe (Operator) + Nhân viên (Employee)
        |                            |
        |                            |
        +--------- Platform ---------+
                       |
             (Admin toàn hệ thống)
```

### 4.2. Vai trò ba bên trong giao dịch

| Bên            | Vai trò trong giao dịch vận tải                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hành khách     | Bên mua dịch vụ vận tải. Trả tiền cho Platform thông qua cổng thanh toán.                                                                                           |
| Nhà xe         | Bên cung cấp dịch vụ vận tải. Sở hữu xe, tuyến, chuyến và chịu trách nhiệm vận hành. Hợp đồng vận tải là giữa hành khách và nhà xe.                                 |
| Platform       | Trung gian công nghệ và thanh toán. Giữ tiền của hành khách trong tài khoản escrow đến khi chuyến hoàn thành, sau đó chuyển cho nhà xe theo chu kỳ T+N (xem MQ-01). |
| Admin Platform | Người vận hành nền tảng. Phê duyệt nhà xe (KYC), cấu hình chính sách, là **arbiter cuối cùng** trong tranh chấp (xem MQ-03).                                        |

### 4.3. Mô hình doanh thu

Platform thu **commission % trên mỗi giao dịch vé bán thành công** (xem MQ-04). Tỷ lệ commission cấu hình được per-Operator hoặc theo tier. Có thể bổ sung service fee phụ thu hành khách ở các phiên bản sau. Subsidy cho promotion (Platform bù tiền) chưa hỗ trợ ở v1.

### 4.4. Ba lớp dịch vụ Platform cung cấp

Platform là một **managed marketplace** (xem MQ-05) gồm 3 lớp dịch vụ:

| Lớp                  | Vai trò                                                                                                                                                                                                                                                                                                                        | Người dùng chính    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| Marketplace layer    | Tìm kiếm, đặt vé, thanh toán, vé điện tử, đánh giá, khiếu nại, dispute resolution, public catalog                                                                                                                                                                                                                              | Hành khách          |
| Operator OS layer    | Bộ công cụ vận hành cho nhà xe: hồ sơ nhà xe, xe và sơ đồ ghế, tuyến và điểm đón/trả, chuyến, giá vé, đơn vé, tài chính (escrow balance, payout, đối soát), nhân viên và phân quyền nội bộ, app/portal cho nhân viên (lịch chuyến, danh sách hành khách, soát vé QR, nhật trình xe, báo cáo vận hành, sự cố), analytics nhà xe | Operator + Employee |
| Platform admin layer | Quản trị nền tảng: KYC nhà xe, cấu hình commission và payout, kiểm duyệt nội dung và đánh giá, dispute resolution, audit log, báo cáo toàn hệ thống, cấu hình danh mục chuẩn (tỉnh thành, bến xe, điểm dừng, loại xe, tiện ích)                                                                                                | Admin Platform      |

### 4.5. Boundary của Platform

Platform **CÓ trách nhiệm**: cung cấp công nghệ, xử lý thanh toán, giữ escrow, payout cho Operator, dispute resolution, kiểm duyệt nội dung, KYC nhà xe, audit log, đảm bảo an toàn dữ liệu hành khách.

Platform **KHÔNG trực tiếp** sở hữu xe, vận hành tuyến, ký hợp đồng lao động với tài xế, bảo dưỡng xe, chịu trách nhiệm chất lượng vận tải (đó là trách nhiệm của Operator).

### 4.6. Kiến trúc triển khai

Hệ thống gồm 3 ứng dụng client và 1 backend:

| Client              | Đối tượng                                   |
| ------------------- | ------------------------------------------- |
| Web user portal     | Hành khách (Marketplace layer)              |
| Web operator portal | Operator (Operator OS layer)                |
| Web admin portal    | Admin Platform (Platform admin layer)       |
| Mobile app (Expo)   | Hành khách + Employee (soát vé, nhật trình) |

Backend: NestJS 11 + MongoDB (mongoose) + Redis (ioredis) + Bull queue + Socket.IO + JWT + Helmet + OSRM. Chi tiết tại `context/TECH-STACK.md`.

---

## 5. Mục tiêu hệ thống

### 5.1. Mục tiêu sản phẩm

- Số hóa quy trình đặt vé xe khách từ tìm kiếm, đặt chỗ, thanh toán đến check-in.
- Giảm tình trạng đặt trùng ghế, sai thông tin chuyến, sai thông tin hành khách.
- Cung cấp trải nghiệm đặt vé nhanh, minh bạch, an toàn cho hành khách.
- Cung cấp bộ Operator OS đầy đủ giúp nhà xe nhỏ và vừa số hóa hoàn toàn việc vận hành mà không cần phần mềm thứ ba.
- Cung cấp app / portal cho Employee để soát vé QR, ghi nhật trình, báo cáo lộ trình, sự cố theo thời gian thực.

### 5.2. Mục tiêu nền tảng (marketplace)

- Onboard nhà xe đa dạng quy mô vào nền tảng theo quy trình KYC chuẩn.
- Tăng GMV (gross merchandise value — tổng giá trị vé bán qua nền tảng) và take rate (% commission trung bình).
- Giữ chân Operator qua chất lượng Operator OS và minh bạch tài chính (escrow balance, lịch sử payout, đối soát).
- Cung cấp catalog tuyến / nhà xe / chuyến chuẩn hóa để hành khách so sánh và chọn lựa.
- Đảm bảo tin cậy giao dịch hai chiều: hành khách an tâm vì có Platform bảo đảm, nhà xe an tâm vì payout đúng hạn và data isolation chặt.

### 5.3. Mục tiêu tin cậy và compliance

- Mọi giao dịch tài chính có log đầy đủ, đối soát được theo mã giao dịch, truy vết từ booking - payment - escrow - payout / refund.
- Đảm bảo data isolation giữa các Operator (Operator A không thấy data Operator B trong bất kỳ tình huống nào).
- Audit log cho mọi thao tác nhạy cảm của Admin và Operator.
- KYC nhà xe theo chuẩn nội bộ và quy định pháp luật áp dụng cho dịch vụ vận tải hành khách.
- Platform có quyền kiểm tra và chặn giá vé vượt khung trần / sàn theo quy định pháp luật vào các dịp quan trọng (xem MQ-02).

### 5.4. Mục tiêu vận hành

- Hỗ trợ hệ thống đặt vé sẵn sàng cao trong các dịp cao điểm (lễ, Tết).
- Báo cáo doanh thu, tỷ lệ lấp đầy ghế, hiệu suất tuyến, chất lượng dịch vụ và scorecard nhà xe đầy đủ ở 2 cấp độ: Operator và Platform.
- Dispute resolution rõ ràng: thời gian xử lý, các mức leo thang, trách nhiệm các bên.

---

## 6. Phạm vi chức năng

### 6.1. Trong phạm vi — Marketplace layer (cho hành khách)

- Đăng ký, đăng nhập, xác thực, quản lý hồ sơ hành khách.
- Tìm kiếm chuyến xe theo điểm đi, điểm đến, ngày đi, số lượng khách.
- Lọc / sắp xếp theo nhà xe, giờ khởi hành, giá vé, loại xe, tiện ích, điểm đón / trả, đánh giá.
- Xem chi tiết chuyến: nhà xe, loại xe, tiện ích, điểm đón / trả, sơ đồ ghế, giá vé, chính sách hủy.
- Xem profile nhà xe: thông tin, đánh giá, scorecard, tuyến tiêu biểu.
- Chọn ghế, giữ ghế tạm thời, đặt vé.
- Áp dụng mã giảm giá nếu thỏa điều kiện.
- Thanh toán qua cổng thanh toán tích hợp; tiền được giữ ở **escrow account của Platform** đến khi chuyến hoàn thành.
- Phát hành vé điện tử có mã vé / QR code.
- Quản lý lịch sử đặt vé, hủy vé, yêu cầu hoàn tiền theo chính sách.
- Đánh giá chuyến đi / nhà xe sau khi chuyến hoàn thành.
- Tạo và theo dõi khiếu nại / yêu cầu hỗ trợ.
- Nhận thông báo (email / SMS / push / in-app) cho các sự kiện quan trọng.

### 6.2. Trong phạm vi — Operator OS layer (cho nhà xe và nhân viên)

**Quản lý hồ sơ và tài chính nhà xe:**

- Đăng ký nhà xe, gửi hồ sơ KYC (giấy phép, hợp đồng, tài khoản nhận tiền) và chờ admin phê duyệt.
- Quản lý hồ sơ doanh nghiệp: tên, logo, mô tả, hotline, email, địa chỉ.
- Xem **escrow balance** (số tiền Platform đang giữ thuộc về Operator), lịch sử payout, lịch sử commission, đối soát giao dịch.
- Yêu cầu payout sớm (nếu Platform hỗ trợ) hoặc nhận theo chu kỳ T+N tự động.

**Quản lý hạ tầng vận tải (Operator tự quản lý trong tenant của mình):**

- Quản lý phương tiện: danh sách xe, biển số, loại xe, sơ đồ ghế, tiện ích.
- Quản lý tuyến đường: tạo tuyến, gắn vào catalog điểm đón / trả chuẩn của Platform.
- Quản lý chuyến xe: tạo chuyến theo ngày giờ, lịch lặp lại, gán xe, gán nhân viên (Employee có role DRIVER), mở / khóa bán.
- Cấu hình giá vé: theo tuyến / chuyến / loại ghế / thời điểm / chặng. Operator tự định giá theo kê khai pháp luật, Platform có thể cảnh báo hoặc chặn nếu vượt khung trần / sàn áp dụng (MQ-02).
- Tạo chương trình khuyến mãi của riêng nhà xe (nếu được Platform cho phép).

**Quản lý nhân viên (Operator OS, không phải Platform admin):**

- **Tạo và quản trị tài khoản:** Tạo mới, cập nhật thông tin, khóa hoặc mở khóa tài khoản Employee thuộc phạm vi quản lý của nhà xe.
- **Gán vai trò hệ thống:** Phân định quyền hạn cho Employee theo 3 nhóm role chính:
  - `TICKET_STAFF`: Nhân viên bán vé và điều phối khách.
  - `DRIVER`: Tài xế vận hành chuyến xe.
  - `SUPPORT_STAFF`: Nhân viên hỗ trợ và phụ xe.
- **Phân quyền chi tiết:** Thiết lập quyền hạn chuyên sâu cho Employee dựa trên role đã gán và phạm vi công việc cụ thể.
- **Điều động nhân sự:** Phân công nhân viên có role `DRIVER` trực tiếp vào danh sách vận hành các chuyến xe.

**Quản lý đơn vé và vận hành:**

- Xem danh sách booking / ticket thuộc nhà xe theo chuyến / ngày / trạng thái.
- Xác nhận đơn nếu dùng phương thức thanh toán sau (nếu mở).
- Xử lý yêu cầu hủy / đổi vé trong phạm vi quyền được Platform cấu hình.
- Phản hồi đánh giá và khiếu nại của hành khách.
- Xem nhật trình xe và báo cáo vận hành mà Employee gửi về (lộ trình thực tế, sự cố, chi phí phát sinh).

**App / Portal cho Employee:**

- Đăng nhập theo phân quyền Operator cấp.
- Xem lịch chuyến / công việc được phân công.
- Xem chi tiết chuyến và danh sách hành khách (số điện thoại có thể được mask).
- Soát vé QR / nhập mã vé để check-in hành khách (nếu role DRIVER hoặc được phân quyền).
- Cập nhật trạng thái chuyến và trạng thái hành khách.
- Ghi nhật trình xe và báo cáo vận hành đầy đủ (lộ trình thực tế, thời gian, điểm dừng, chi phí, tình trạng xe / hành khách).
- Báo cáo sự cố (tai nạn, hỏng xe, kẹt xe, trễ giờ, khách không hợp tác).
- Đồng bộ realtime hoặc khi có mạng nếu offline.

**Báo cáo nhà xe:**

- Doanh thu theo ngày / tuần / tháng / tuyến / chuyến / xe.
- Tỷ lệ lấp đầy ghế, tỷ lệ hủy, tỷ lệ hoàn tiền.
- Hiệu suất Employee theo chuyến được phân công.
- Đánh giá trung bình và phản hồi khách hàng.

### 6.3. Trong phạm vi — Platform admin layer

- KYC: phê duyệt, từ chối, yêu cầu bổ sung, khóa / mở khóa nhà xe.
- Quản lý tài khoản người dùng và tài khoản admin nội bộ.
- Giám sát Employee toàn hệ thống (read-only) phục vụ kiểm duyệt và audit (`FR-ADM-02`, `FR-ADM-16`).
- Cấu hình **commission engine**: % commission mặc định, override per-Operator hoặc theo tier.
- Cấu hình **payout policy**: chu kỳ T+N, ngưỡng tối thiểu, kênh chuyển tiền.
- Cấu hình danh mục chuẩn: tỉnh / thành, bến xe, điểm đón / trả, loại xe, tiện ích.
- Cấu hình chính sách: phí nền tảng, phí hủy vé, chính sách hoàn tiền, thời gian giữ ghế, thời gian cho phép hủy vé.
- Kiểm tra và áp khung giá trần / sàn theo quy định pháp luật vào các dịp quan trọng (MQ-02).
- Giám sát giao dịch thanh toán, escrow, payout, refund.
- Xử lý hoàn tiền thủ công khi cần; **Platform có quyền refund đơn phương** với tư cách arbiter cuối cùng (MQ-03), thao tác này phải có audit log và thông báo Operator.
- Quản lý khiếu nại và dispute resolution: phân công, theo dõi, đóng ticket, leo thang.
- Kiểm duyệt đánh giá, nội dung vi phạm, banner, FAQ, nội dung tĩnh.
- Quản lý chương trình khuyến mãi cấp Platform.
- Cấu hình trạng thái bảo trì hệ thống.
- Xem trạng thái tích hợp: cổng thanh toán, SMS, email, push notification.
- Khóa chuyến / nhà xe khi vi phạm nghiêm trọng.
- Xem báo cáo toàn hệ thống và audit log.

### 6.4. Ngoài phạm vi phiên bản đầu

- API integration cho Operator lớn đã có hệ thống vận hành riêng (mô hình hybrid C — chưa hỗ trợ ở v1).
- Subsidy promotion (Platform bù tiền cho khuyến mãi).
- Tối ưu lộ trình bằng AI theo thời gian thực.
- Bán vé liên tuyến phức tạp có trung chuyển nhiều chặng giữa nhiều nhà xe.
- Quản lý bảo dưỡng xe chuyên sâu.
- Quản lý lương, chấm công, hợp đồng lao động của Employee (Platform không thuê tài xế của Operator).
- Tích hợp thiết bị IoT trên xe ở mức phần cứng (GPS, OBD).
- Multi-currency, multi-language ở phiên bản đầu.
- Tự nghiên cứu / phát hành dịch vụ vận tải dưới brand của Platform (Platform là marketplace, không phải hãng vận tải).

---

## 7. Actor và vai trò

### 7.1. Người dùng (User)

**Mô tả actor:** Người dùng là khách hàng / hành khách sử dụng nền tảng để tìm kiếm chuyến xe, đặt vé, thanh toán, nhận vé điện tử và theo dõi các giao dịch liên quan đến hành trình của mình.

**Phạm vi trách nhiệm:** Người dùng chịu trách nhiệm cung cấp thông tin đặt vé và thông tin hành khách chính xác, thực hiện thanh toán theo phương thức được hỗ trợ, xuất trình vé hợp lệ khi lên xe và tuân thủ chính sách hủy / hoàn tiền của hệ thống, nhà xe và nền tảng.

**Quyền hạn / chức năng chính:** Người dùng có thể đăng ký, đăng nhập, cập nhật hồ sơ cá nhân, tìm kiếm / lọc / xem chi tiết chuyến xe, chọn ghế, đặt vé, thanh toán, xem vé điện tử và lịch sử đặt vé, hủy vé hoặc yêu cầu hoàn tiền theo chính sách, đánh giá chuyến đi và gửi khiếu nại / yêu cầu hỗ trợ.

**Giới hạn quyền / quan hệ với actor khác:** Người dùng chỉ được truy cập dữ liệu tài khoản, booking, ticket, đánh giá và khiếu nại của chính mình. Người dùng không có quyền quản lý dữ liệu vận hành của nhà xe, dữ liệu nhân viên nhà xe hoặc cấu hình quản trị nền tảng.

### 7.2. Nhà xe (Operator)

**Mô tả actor:** Nhà xe là đơn vị vận tải cung cấp dịch vụ xe khách trên nền tảng. Nhà xe sở hữu và vận hành xe, tuyến, chuyến, nhân sự vận hành, giá vé và chất lượng dịch vụ vận tải trong phạm vi doanh nghiệp của mình.

**Phạm vi trách nhiệm:** Nhà xe chịu trách nhiệm đăng ký / duy trì hồ sơ doanh nghiệp hợp lệ, quản lý hạ tầng vận tải, cấu hình tuyến / chuyến / giá vé, tổ chức nhân sự vận hành, thực hiện chuyến đi, xử lý nghiệp vụ đơn vé thuộc nhà xe và phối hợp giải quyết phản hồi / khiếu nại của hành khách.

**Quyền hạn / chức năng chính:** Nhà xe có thể quản lý hồ sơ nhà xe, xe, sơ đồ ghế, tiện ích, tuyến đường, điểm đón / trả, chuyến xe, giá vé, chương trình khuyến mãi nếu được cho phép, danh sách booking / ticket thuộc nhà xe, doanh thu / đối soát, báo cáo vận hành và tài khoản nhân viên nhà xe. Nhà xe có quyền tạo, cập nhật, khóa / mở khóa tài khoản Employee, gán role phù hợp và phân công nhân viên cho chuyến hoặc công việc cụ thể.

**Giới hạn quyền / quan hệ với actor khác:** Nhà xe chỉ được xem và quản lý dữ liệu thuộc phạm vi nhà xe của mình; không được truy cập dữ liệu của nhà xe khác hoặc cấu hình quản trị toàn hệ thống. Hoạt động của nhà xe chịu sự phê duyệt, giám sát và chính sách vận hành của Admin toàn hệ thống.

### 7.3. Admin toàn hệ thống (Admin)

**Mô tả actor:** Admin toàn hệ thống là vai trò quản trị nền tảng, đại diện cho Platform trong việc vận hành, kiểm soát và giám sát toàn bộ hệ thống đặt vé xe khách.

**Phạm vi trách nhiệm:** Admin chịu trách nhiệm phê duyệt và giám sát nhà xe, cấu hình chính sách nền tảng, quản lý danh mục chuẩn, giám sát giao dịch thanh toán / escrow / payout / refund, xử lý tranh chấp, kiểm duyệt nội dung, quản lý rủi ro vận hành và bảo đảm khả năng truy vết thông qua audit log.

**Quyền hạn / chức năng chính:** Admin có thể quản lý tài khoản người dùng, nhà xe và tài khoản admin nội bộ; phê duyệt, từ chối, khóa hoặc mở khóa nhà xe; cấu hình danh mục hệ thống, chính sách phí, chính sách hủy / hoàn tiền, commission và payout; giám sát giao dịch, doanh thu, hoàn tiền, khiếu nại, báo cáo vi phạm, báo cáo toàn hệ thống và nhật ký thao tác. Admin có thể xem / giám sát dữ liệu Employee toàn hệ thống phục vụ kiểm duyệt, xử lý vi phạm, khiếu nại và audit.

**Giới hạn quyền / quan hệ với actor khác:** Admin có quyền truy cập toàn hệ thống nhưng các thao tác nhạy cảm phải được phân quyền, xác thực và ghi audit log. Admin không trực tiếp sở hữu xe, vận hành chuyến đi hoặc thay thế trách nhiệm vận tải của nhà xe; việc can thiệp vào dữ liệu vận hành phải tuân theo chính sách nền tảng.

### 7.4. Nhân viên nhà xe (Employee)

**Mô tả actor:** Nhân viên nhà xe là tài khoản nhân sự thuộc một nhà xe cụ thể, do nhà xe tạo và quản lý trong Operator OS. Employee được sử dụng để thực hiện các tác vụ vận hành chuyến đi, soát vé, hỗ trợ hành khách và ghi nhận thông tin vận hành theo quyền được cấp.

Employee gồm ba role chuẩn:

- `TICKET_STAFF`: nhân viên vé / soát vé, phụ trách kiểm tra vé, xác nhận hành khách và hỗ trợ thông tin lên xe trong phạm vi được phân công.
- `DRIVER`: tài xế, phụ trách điều khiển phương tiện, cập nhật trạng thái chuyến, ghi nhận nhật trình và báo cáo tình huống phát sinh trong quá trình di chuyển.
- `SUPPORT_STAFF`: nhân viên hỗ trợ, phụ trách hỗ trợ vận hành, tiếp nhận thông tin sự cố, phối hợp với nhà xe / hành khách và theo dõi các nhiệm vụ hỗ trợ được giao.

**Phạm vi trách nhiệm:** Employee thực hiện công việc theo nhà xe, role và chuyến / nhiệm vụ được phân công. Mỗi Employee phải gắn với một Operator; dữ liệu hiển thị cho Employee được giới hạn theo tenant nhà xe, phạm vi công việc và chính sách bảo vệ dữ liệu cá nhân.

**Quyền hạn / chức năng chính:**

- **Quản lý tài khoản cá nhân:** đăng nhập vào cổng / ứng dụng dành cho nhân viên nhà xe, xem thông tin cá nhân, trạng thái tài khoản và cập nhật thông tin trong phạm vi được phép.
- **Thực hiện nhiệm vụ được phân công:** xem lịch chuyến hoặc công việc được giao, xem chi tiết xe, biển số, tuyến, giờ đi, điểm đón / trả và ghi chú vận hành liên quan.
- **Xác nhận hành khách:** xem danh sách hành khách trong phạm vi được phân quyền, tìm hành khách theo tên / số điện thoại / mã vé, quét QR hoặc nhập mã vé để xác nhận hành khách lên xe và cập nhật trạng thái hành khách. Nhóm chức năng này áp dụng chính cho `TICKET_STAFF` và `DRIVER`, hoặc `SUPPORT_STAFF` nếu được nhà xe phân quyền hỗ trợ.
- **Cập nhật trạng thái chuyến đi:** cập nhật trạng thái chuyến như chuẩn bị, đang đón khách, đang chạy, tạm dừng, hoàn thành hoặc gặp sự cố. `DRIVER` là role chịu trách nhiệm chính; các role khác chỉ thực hiện khi được nhà xe phân quyền rõ ràng.
- **Ghi nhận nhật trình và báo cáo sự cố:** ghi nhận lộ trình thực tế, thời gian di chuyển, điểm dừng, tình trạng xe, tình trạng hành khách, chi phí phát sinh nếu có; xử lý ban đầu và báo cáo các tình huống như tai nạn, hư hỏng xe, chậm chuyến, thay đổi lộ trình, sự cố kỹ thuật hoặc vấn đề phát sinh trong quá trình vận hành.

**Giới hạn quyền / quan hệ với actor khác:** Employee không được quản lý hồ sơ nhà xe, cấu hình giá vé, cấu hình chính sách, xử lý payout / refund hoặc xem dữ liệu ngoài phạm vi được phân công. Nhà xe là actor quản lý trực tiếp tài khoản, role và phân quyền của Employee. Admin toàn hệ thống có thể giám sát dữ liệu Employee để phục vụ kiểm duyệt, xử lý vi phạm, khiếu nại và audit, nhưng việc quản lý vận hành hằng ngày thuộc trách nhiệm của nhà xe.

## 8. Giả định, ràng buộc, phụ thuộc

### 8.1. Giả định

| ID    | Giả định                                                                                                                                          | Ý nghĩa đối với hệ thống                                                                                                                     |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| AS-01 | Hệ thống v1 vận hành theo mô hình managed marketplace: Platform không sở hữu xe, không trực tiếp chạy chuyến, không thuê tài xế.                  | Nhà xe chịu trách nhiệm vận tải thực tế; Platform chịu trách nhiệm công nghệ, thanh toán, kiểm soát giao dịch, dữ liệu và hỗ trợ tranh chấp. |
| AS-02 | Mỗi nhà xe phải được KYC và được Admin phê duyệt trước khi mở bán công khai.                                                                      | Không cho nhà xe chưa xác minh tạo chuyến bán vé cho hành khách.                                                                             |
| AS-03 | Mỗi chuyến xe thuộc đúng một nhà xe, dùng một xe cụ thể hoặc một cấu hình xe tương đương đã được nhà xe khai báo.                                 | Tất cả booking, vé, doanh thu, check-in và khiếu nại phải truy vết được về Operator.                                                         |
| AS-04 | Một tuyến có điểm đầu, điểm cuối và có thể có nhiều điểm đón / trả trung gian như bến xe, văn phòng, trạm dừng, điểm dọc đường.                   | Search và booking phải cho khách chọn đúng điểm đón / trả hợp lệ theo chuyến.                                                                |
| AS-05 | Hành khách có thể đặt một hoặc nhiều ghế / giường trong cùng một booking; mỗi ghế / giường phát hành một ticket riêng hoặc một ticket item riêng. | Booking là đơn giao dịch; Ticket là quyền lên xe của từng hành khách / từng ghế.                                                             |
| AS-06 | Chọn ghế là chức năng bắt buộc trong luồng đặt vé online, tương tự các hệ thống nhà xe lớn.                                                       | Không nên chỉ đặt theo số lượng khách nếu hệ thống muốn tránh tranh chấp vị trí ghế.                                                         |
| AS-07 | Ghế được giữ tạm thời trong thời gian cấu hình, khuyến nghị 5 đến 15 phút, trước khi thanh toán thành công.                                       | Cần Redis lock / TTL để chống bán trùng ghế và tự giải phóng ghế khi khách bỏ dở thanh toán.                                                 |
| AS-08 | V1 cần ít nhất một phương thức thanh toán online có callback / webhook xác nhận kết quả.                                                          | Có thể bắt đầu với VNPay, MoMo, ZaloPay hoặc cổng ngân hàng; provider cụ thể vẫn là Open Question.                                           |
| AS-09 | Vé điện tử được phát hành sau khi thanh toán thành công hoặc sau khi nhà xe xác nhận nếu có luồng thanh toán sau.                                 | Vé phải có mã vé / QR code, thông tin chuyến, ghế, điểm đón / trả và trạng thái hiện tại.                                                    |
| AS-10 | Hệ thống cần hỗ trợ khách không đăng nhập tra cứu vé bằng mã vé / số điện thoại / email, nhưng thao tác nhạy cảm vẫn cần xác minh.                | Phù hợp hành vi thực tế của khách mua vé nhanh nhưng vẫn bảo vệ dữ liệu cá nhân.                                                             |
| AS-11 | Nhà xe có thể thay đổi giờ chạy, xe, tài xế, điểm đón / trả hoặc hủy chuyến khi có sự cố vận hành.                                                | Mọi thay đổi sau khi đã bán vé phải có thông báo cho khách và có lịch sử audit.                                                              |
| AS-12 | Chính sách hủy / đổi / hoàn tiền có thể khác nhau theo nhà xe, tuyến, thời điểm trước giờ khởi hành, loại vé và chương trình khuyến mãi.          | Không hard-code một công thức hoàn tiền duy nhất; cần policy engine có thể cấu hình.                                                         |
| AS-13 | Check-in được thực hiện bằng QR code / mã vé bởi Employee được phân quyền, thường là tài xế, phụ xe hoặc nhân viên bến / văn phòng.               | App / portal nhân viên phải hoạt động được trong điều kiện mạng yếu và đồng bộ lại khi có mạng.                                              |
| AS-14 | Hệ thống v1 chỉ phục vụ thị trường Việt Nam, tiền tệ VND, ngôn ngữ chính tiếng Việt, múi giờ mặc định Asia/Ho_Chi_Minh.                           | Giảm phạm vi xử lý đa tiền tệ, đa ngôn ngữ, thuế quốc tế ở phiên bản đầu.                                                                    |
| AS-15 | Dữ liệu tỉnh thành, bến xe, văn phòng, trạm dừng và tọa độ có thể được chuẩn hóa bởi Platform nhưng nhà xe có quyền đề xuất bổ sung.              | Tránh trùng dữ liệu địa điểm và giúp search / routing ổn định.                                                                               |
| AS-16 | Platform cần có kênh hỗ trợ khách hàng tối thiểu: ticket hỗ trợ trong hệ thống, email, hotline hoặc thông tin liên hệ nhà xe.                     | Website có thể hoạt động thật chỉ khi khách có nơi xử lý sai vé, đổi hủy, trễ chuyến, thanh toán lỗi.                                        |
| AS-17 | Doanh thu vé online được ghi nhận qua Payment, giữ theo escrow của Platform, sau đó payout cho Operator theo chu kỳ T+N.                          | Cần phân biệt tiền khách đã trả, tiền còn giữ, tiền đã hoàn và tiền đã thanh toán cho nhà xe.                                                |
| AS-18 | Hóa đơn / chứng từ thanh toán có thể chưa tự động hóa đầy đủ ở v1 nhưng hệ thống phải lưu dữ liệu để tra cứu và đối soát.                         | Cần mã booking, mã payment, mã hoàn tiền, thông tin người mua và lịch sử giao dịch.                                                          |
| AS-19 | Nhà xe có thể vẫn bán vé qua nhiều kênh khác ngoài Platform như quầy vé, tổng đài, đại lý hoặc nhân viên điều phối.                               | Nếu mở bán đa kênh, Platform phải có cơ chế nhập / khóa ghế thủ công hoặc đồng bộ tồn ghế để tránh overbooking.                              |
| AS-20 | Mỗi chuyến cần có thời điểm ngừng bán online trước giờ khởi hành, có thể cấu hình theo nhà xe / tuyến.                                            | Tránh khách đặt sát giờ khi nhà xe đã chốt danh sách hành khách hoặc xe đã rời điểm đón.                                                     |
| AS-21 | Một số hành khách có thể không lên xe dù vé hợp lệ.                                                                                               | Cần trạng thái `NO_SHOW`, quy trình xử lý ghế trống sau giờ đón và quy định có / không hoàn tiền.                                            |
| AS-22 | Hệ thống cần lưu bằng chứng vận hành cho các tình huống tranh chấp.                                                                               | Cần lưu lịch sử thông báo, log check-in, thay đổi chuyến, ảnh sự cố, nội dung trao đổi hỗ trợ.                                               |
| AS-23 | Mọi cấu hình chính sách quan trọng phải có hiệu lực theo thời gian, không áp dụng ngược cho vé đã bán.                                            | Cần versioning cho chính sách giá, hủy đổi, phí, commission và payout.                                                                       |
| AS-24 | Dữ liệu sản xuất cần được sao lưu, khôi phục và lưu giữ theo chính sách dữ liệu rõ ràng.                                                          | Website bán vé thật cần khả năng khôi phục sau lỗi hệ thống và truy vết giao dịch cũ.                                                        |

### 8.2. Ràng buộc

| ID    | Ràng buộc                                                                                                                               | Quy tắc áp dụng                                                                                              |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| CO-01 | Không bán trùng ghế / giường trên cùng một chuyến.                                                                                      | Seat lock phải dùng cơ chế atomic, có TTL, kiểm tra lại trước khi tạo payment và trước khi phát hành ticket. |
| CO-02 | Không cho thanh toán booking đã hết hạn, đã hủy hoặc đã thanh toán thành công.                                                          | Payment callback phải idempotent để tránh ghi nhận thanh toán trùng.                                         |
| CO-03 | Không phát hành vé nếu payment chưa thành công, trừ luồng thanh toán sau được cấu hình rõ.                                              | Mặc định v1 nên ưu tiên thanh toán online trước để giảm rủi ro giữ ghế ảo.                                   |
| CO-04 | Không cho hủy vé theo luồng thường nếu vé đã check-in, chuyến đã hoàn thành hoặc quá thời hạn hủy.                                      | Các ngoại lệ phải đi qua Admin / dispute flow và có audit log.                                               |
| CO-05 | Không cho nhà xe tự ý sửa thông tin quan trọng của chuyến đã bán vé mà không thông báo khách.                                           | Thay đổi giờ chạy, xe, sơ đồ ghế, điểm đón / trả, hủy chuyến phải tạo event thông báo.                       |
| CO-06 | Nếu đổi xe làm thay đổi sơ đồ ghế, hệ thống phải map lại ghế hoặc yêu cầu xử lý đổi ghế / hoàn tiền.                                    | Tránh trường hợp khách mua ghế A1 nhưng xe thay thế không có A1.                                             |
| CO-07 | Nhà xe chỉ xem và xử lý dữ liệu thuộc tenant của mình.                                                                                  | Mọi query backend cho Operator / Employee phải filter theo `operatorId`.                                     |
| CO-08 | Employee chỉ xem chuyến, danh sách khách và số điện thoại trong phạm vi được phân quyền.                                                | Số điện thoại nên được mask theo policy, chỉ mở đầy đủ khi có lý do vận hành.                                |
| CO-09 | Admin có quyền toàn hệ thống nhưng thao tác nhạy cảm phải có audit log.                                                                 | Áp dụng cho refund thủ công, khóa nhà xe, đổi chính sách giá, sửa booking, đổi trạng thái payment.           |
| CO-10 | Mọi giao dịch tài chính phải có mã tham chiếu duy nhất và trạng thái đối soát.                                                          | Cần mapping booking code, payment code, provider transaction id, refund id, payout id.                       |
| CO-11 | Giá vé phải là VND, không âm, có lịch sử thay đổi và không vượt khung chính sách đã cấu hình.                                           | Giá đã bán trên vé không được thay đổi ngược sau khi thanh toán.                                             |
| CO-12 | Khuyến mãi, voucher và phí dịch vụ phải được tách dòng trong booking total.                                                             | Cần minh bạch giá gốc, giảm giá, phí, số tiền khách trả, số tiền hoàn.                                       |
| CO-13 | Vé điện tử phải có mã duy nhất, QR code không đoán được và có thể xác thực server-side.                                                 | Không chỉ encode thông tin thô trong QR; cần token hoặc mã tra cứu an toàn.                                  |
| CO-14 | Tất cả thời gian lưu trong database nên dùng UTC; hiển thị cho người dùng theo Asia/Ho_Chi_Minh.                                        | Tránh sai giờ khởi hành, giờ hết hạn giữ ghế, giờ hủy vé.                                                    |
| CO-15 | Dữ liệu cá nhân phải được bảo vệ theo nguyên tắc tối thiểu hóa truy cập.                                                                | Họ tên, số điện thoại, email, lịch sử chuyến, payment không được lộ qua public API.                          |
| CO-16 | Website phải hiển thị rõ điều kiện hủy / đổi trước khi khách thanh toán.                                                                | Đây là điều kiện bắt buộc để giảm tranh chấp sau giao dịch.                                                  |
| CO-17 | Search chỉ hiển thị chuyến đang mở bán, còn ghế phù hợp và chưa hết thời gian bán.                                                      | Không hiển thị chuyến DRAFT, LOCKED, CANCELLED, COMPLETED hoặc đã hết chỗ.                                   |
| CO-18 | Chuyến đã khởi hành hoặc đã hoàn thành không được bán thêm vé online.                                                                   | Ngoại lệ bán tại quầy nếu có phải là phạm vi khác và cần chính sách riêng.                                   |
| CO-19 | Hệ thống phải hoạt động ổn định vào dịp cao điểm như lễ, Tết.                                                                           | Cần cache search, rate limit, queue callback và giám sát payment / notification.                             |
| CO-20 | Các chính sách vận tải, giá, hủy vé, hóa đơn và bảo vệ dữ liệu phải tuân thủ pháp luật Việt Nam và hợp đồng giữa Platform với Operator. | SRS không thay thế tư vấn pháp lý; cần rà soát pháp chế trước khi production.                                |
| CO-21 | Nếu nhà xe bán vé ngoài Platform, mọi ghế đã bán ngoài hệ thống phải được khóa hoặc đồng bộ trước khi mở bán online.                    | Không được coi tồn ghế trên Platform là nguồn sự thật duy nhất nếu nhà xe vẫn vận hành đa kênh.              |
| CO-22 | Không cho khách chọn điểm đón / trả không thuộc chuyến hoặc nằm ngoài thời gian phục vụ của chuyến.                                     | Điểm đón / trả phải được validate theo route stop, trip stop, pickup window và cấu hình nhà xe.              |
| CO-23 | Không được thay đổi chính sách hủy / giá / phí đã áp dụng cho booking sau khi khách thanh toán.                                         | Booking phải lưu snapshot chính sách tại thời điểm mua vé.                                                   |
| CO-24 | Không được xóa cứng booking, payment, ticket, refund, audit log trong môi trường production.                                            | Chỉ cho soft delete / archive theo quyền admin và chính sách lưu trữ.                                        |
| CO-25 | Khi chuyến bị hủy bởi nhà xe, hệ thống phải dừng bán ngay và kích hoạt luồng đổi chuyến hoặc hoàn tiền.                                 | Không để khách tiếp tục thanh toán cho chuyến đã hủy hoặc không còn khả năng vận hành.                       |
| CO-26 | Khi notification gửi thất bại, hệ thống phải retry và hiển thị trạng thái gửi cho admin / nhà xe khi cần.                               | Vé vẫn phải tra cứu được trong hệ thống dù email / SMS gửi lỗi.                                              |
| CO-27 | Các thao tác thủ công của admin hoặc nhà xe làm ảnh hưởng tiền / vé / ghế phải ghi rõ người thực hiện, lý do và thời điểm.              | Cần để audit, xử lý khiếu nại và đối soát nội bộ.                                                            |

### 8.3. Phụ thuộc (chưa chính thức)

| ID    | Phụ thuộc                                                                                                         | Mức độ ảnh hưởng                                                                              |
| ----- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| DP-01 | Backend NestJS, MongoDB, Redis, Bull queue, Socket.IO, JWT, Helmet.                                               | Lõi API, lưu dữ liệu, khóa ghế, queue xử lý callback / notification, realtime vận hành.       |
| DP-02 | Frontend Next.js, React, Ant Design, Tailwind, React Query, Zustand.                                              | Web hành khách, operator portal, admin portal.                                                |
| DP-03 | Mobile Expo / React Native.                                                                                       | App hành khách và app / portal nhân viên cho check-in, nhật trình, báo sự cố.                 |
| DP-04 | Redis hoặc lock service tương đương.                                                                              | Bắt buộc cho seat locking, chống double booking và chống spam thanh toán.                     |
| DP-05 | Payment gateway.                                                                                                  | Bắt buộc cho thanh toán online, callback, tra soát giao dịch và hoàn tiền.                    |
| DP-06 | Email / SMS / push notification provider.                                                                         | Bắt buộc để gửi vé điện tử, OTP, nhắc giờ đi, thông báo đổi / hủy chuyến.                     |
| DP-07 | OSRM hoặc dịch vụ bản đồ / routing.                                                                               | Phục vụ tính khoảng cách, thời gian hành trình, gợi ý điểm đón / trả và tuyến trung chuyển.   |
| DP-08 | Dữ liệu địa lý chuẩn: tỉnh thành, bến xe, văn phòng, trạm dừng, tọa độ.                                           | Ảnh hưởng trực tiếp đến search, route, stop point và trải nghiệm đặt vé.                      |
| DP-09 | Quy trình KYC và hợp đồng với nhà xe.                                                                             | Bắt buộc để xác định nhà xe được bán vé, nhận payout và chịu trách nhiệm vận tải.             |
| DP-10 | Chính sách hủy / đổi / hoàn tiền của Platform và từng Operator.                                                   | Bắt buộc trước khi mở bán vì ảnh hưởng số tiền hoàn, dispute và chăm sóc khách hàng.          |
| DP-11 | Cơ chế đối soát, escrow và payout.                                                                                | Bắt buộc để vận hành marketplace có thu commission và trả tiền cho nhà xe.                    |
| DP-12 | Dịch vụ lưu file / object storage.                                                                                | Cần cho giấy tờ KYC, ảnh sự cố, minh chứng khiếu nại, file báo cáo nếu có.                    |
| DP-13 | Công cụ logging, monitoring, alerting.                                                                            | Cần để phát hiện lỗi thanh toán, lỗi giữ ghế, lỗi gửi vé và sự cố vận hành.                   |
| DP-14 | Hạ tầng bảo mật: HTTPS, secret management, backup, phân quyền môi trường.                                         | Bắt buộc trước production để bảo vệ dữ liệu cá nhân và giao dịch tài chính.                   |
| DP-15 | Nội dung pháp lý và vận hành: điều khoản sử dụng, chính sách riêng tư, chính sách hủy đổi, hotline / kênh hỗ trợ. | Bắt buộc để website có thể bán vé thật và xử lý tranh chấp.                                   |
| DP-16 | Cơ chế quản lý tồn ghế đa kênh hoặc quy trình vận hành quầy / tổng đài.                                           | Bắt buộc nếu nhà xe không bán độc quyền qua Platform.                                         |
| DP-17 | Dịch vụ sinh, lưu và xác thực QR code / ticket token.                                                             | Bắt buộc để check-in an toàn và tránh vé giả / vé bị sửa.                                     |
| DP-18 | Reconciliation job cho payment, refund, payout và notification.                                                   | Cần để xử lý callback trễ, giao dịch lệch trạng thái, hoàn tiền treo, gửi thông báo thất bại. |
| DP-19 | Chính sách retention và archive dữ liệu.                                                                          | Cần để biết dữ liệu nào lưu bao lâu, ai được truy cập, khi nào được ẩn / xóa theo quy định.   |
| DP-20 | Quy trình vận hành nội bộ của Operator.                                                                           | Cần chốt ai có quyền mở bán, chốt chuyến, đổi xe, gọi khách, xác nhận no-show và xử lý sự cố. |

---

## 9. Mô hình dữ liệu mức cao

Phần này mô tả mô hình dữ liệu **mức khái niệm** để làm nền cho yêu cầu, HLD, Database Design và API Specification. Đây chưa phải schema database chính thức, chưa quyết định collection/table, index, transaction boundary hoặc cấu trúc migration. Chi tiết thiết kế dữ liệu sẽ được chốt trong `04-database-design.md`.

### 9.1. Nguyên tắc dữ liệu

| ID    | Nguyên tắc                                                                                                | Ý nghĩa thiết kế                                                                                        |
| ----- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| DM-01 | Dữ liệu vận hành nhà xe phải có boundary theo `Operator`.                                                 | Mọi dữ liệu xe, tuyến, chuyến, nhân viên, đơn vé và báo cáo vận hành phải truy vết được về nhà xe.      |
| DM-02 | Ghế trên chuyến là tài nguyên giao dịch, không chỉ là thuộc tính hiển thị.                                | Cần quản lý trạng thái ghế theo từng `Trip`, có cơ chế giữ ghế tạm thời, chống bán trùng và audit.      |
| DM-03 | Booking, ticket, payment, refund, escrow và payout phải truy vết được theo một chuỗi giao dịch duy nhất.  | Cần đối soát được từ đặt vé đến thanh toán, phát hành vé, hoàn tiền và chuyển tiền cho Operator.        |
| DM-04 | Dữ liệu đã áp dụng cho booking phải lưu snapshot tại thời điểm mua.                                       | Giá vé, phí, khuyến mãi, chính sách hủy / hoàn tiền, điểm đón / trả và thông tin chuyến không áp ngược. |
| DM-05 | Dữ liệu cá nhân chỉ được lưu và hiển thị theo nguyên tắc tối thiểu hóa truy cập.                          | Employee, Operator và Admin chỉ xem thông tin hành khách theo quyền và mục đích vận hành hợp lệ.        |
| DM-06 | Thao tác nhạy cảm phải có audit log.                                                                      | Cần lưu người thao tác, thời điểm, lý do, dữ liệu trước / sau và kết quả thao tác.                      |
| DM-07 | Dữ liệu danh mục chuẩn do Platform quản lý, Operator có thể đề xuất hoặc cấu hình trong phạm vi được cấp. | Tránh trùng tỉnh / thành, bến xe, điểm đón / trả, loại xe, tiện ích và hỗ trợ search ổn định.           |

### 9.2. Nhóm thực thể dữ liệu

| Nhóm dữ liệu             | Thực thể khái niệm chính                                                                | Mục đích                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Identity & Access        | `User`, `Admin`, `Operator`, `Employee`, `Role`, `Permission`, `Session`                | Quản lý danh tính, đăng nhập, phân quyền, trạng thái tài khoản và phạm vi truy cập.                    |
| Operator Profile & KYC   | `OperatorProfile`, `KycDocument`, `BankAccount`, `OperatorStatusHistory`                | Quản lý hồ sơ pháp lý, thông tin nhận tiền, trạng thái phê duyệt / khóa / yêu cầu bổ sung của nhà xe.  |
| Location & Catalog       | `Province`, `Ward`, `StopPoint`, `VehicleType`, `Amenity`, `ContentPage`                | Chuẩn hóa dữ liệu địa lý, điểm đón / trả, loại phương tiện, tiện ích và nội dung công khai.            |
| Transport Resource       | `Vehicle`, `SeatMap`, `Seat`, `Route`, `RouteStop`                                      | Quản lý hạ tầng vận tải thuộc Operator: phương tiện, sơ đồ ghế, tuyến và các điểm dừng theo thứ tự.    |
| Trip & Inventory         | `Trip`, `TripStop`, `TripSeat`, `SeatHold`, `Fare`, `FareRule`                          | Quản lý chuyến cụ thể, ghế theo chuyến, giữ ghế, giá vé và điều kiện mở bán.                           |
| Booking & Ticket         | `Booking`, `PassengerInfo`, `Ticket`, `TicketQrToken`, `BookingStatusHistory`           | Quản lý đơn đặt vé, thông tin hành khách, vé điện tử, QR check-in và lịch sử trạng thái.               |
| Payment, Escrow & Payout | `Payment`, `Refund`, `EscrowLedger`, `CommissionRule`, `Payout`, `ReconciliationRecord` | Quản lý thanh toán, hoàn tiền, tiền giữ hộ Platform, commission, chuyển tiền cho Operator và đối soát. |
| Operation & Check-in     | `CheckInEvent`, `JourneyLog`, `IncidentReport`, `EmployeeAssignment`                    | Ghi nhận soát vé, phân công Employee, nhật trình chuyến, sự cố và dữ liệu vận hành thực tế.            |
| Support & Trust          | `SupportTicket`, `Complaint`, `Review`, `DisputeCase`, `Attachment`                     | Quản lý hỗ trợ, khiếu nại, đánh giá, tranh chấp và minh chứng liên quan.                               |
| Notification & Audit     | `Notification`, `NotificationDelivery`, `AuditLog`, `PolicyVersion`, `PolicySnapshot`   | Gửi thông báo, theo dõi trạng thái gửi, lưu audit và quản lý phiên bản chính sách đã áp dụng.          |

### 9.3. Quan hệ dữ liệu chính

- Một `Operator` là tenant nghiệp vụ của nhiều `Vehicle`, `Employee`, `Route`, `Trip`, `Booking`, `Ticket`, báo cáo vận hành và dữ liệu tài chính liên quan.
- Một `Employee` thuộc đúng một `Operator`; role của Employee thuộc tập đã chốt ở §7.4 gồm `TICKET_STAFF`, `DRIVER`, `SUPPORT_STAFF`.
- Một `Vehicle` có một `SeatMap`; `SeatMap` gồm nhiều `Seat`. Trạng thái ghế bán vé phải được quản lý theo `TripSeat` hoặc cấu trúc tương đương trên từng chuyến.
- Một `Route` gồm nhiều `RouteStop`; mỗi `RouteStop` tham chiếu một `StopPoint` chuẩn hoặc điểm được Platform duyệt.
- Một `Trip` là phiên bản vận hành cụ thể của một `Route`, dùng một `Vehicle` hoặc cấu hình xe hợp lệ, có nhiều `TripStop`, nhiều `TripSeat` và có thể gán nhiều `Employee`.
- Một `Fare` hoặc `FareRule` có thể áp dụng theo tuyến, chuyến, loại ghế, chặng, thời điểm hoặc chính sách nhà xe; giá đã áp dụng cho booking phải được lưu snapshot.
- Một `Booking` thuộc một `User` hoặc khách vãng lai, chứa thông tin liên hệ, một hoặc nhiều `PassengerInfo`, một hoặc nhiều `Ticket`, tổng tiền và snapshot chính sách.
- Một `Ticket` gắn với một hành khách, một ghế / giường, một `Trip`, điểm đón, điểm trả và QR token dùng để check-in.
- Một `SeatHold` gắn với ghế trên chuyến, có TTL và phải hết hiệu lực nếu booking hết hạn hoặc thanh toán không thành công.
- Một `Payment` gắn với một `Booking`; khi thanh toán thành công, hệ thống phát hành ticket và ghi nhận dòng tiền vào `EscrowLedger`.
- Một `Refund` gắn với `Booking`, `Ticket` hoặc `Payment` liên quan; hoàn tiền phải cập nhật ledger, trạng thái đối soát và audit log.
- Một `Payout` gom các khoản tiền đủ điều kiện chuyển cho `Operator` sau khi trừ commission, refund, adjustment và các khoản giữ lại nếu có.
- Một `SupportTicket`, `Complaint`, `Review` hoặc `DisputeCase` có thể tham chiếu `User`, `Operator`, `Trip`, `Booking`, `Ticket`, `Payment` và attachment minh chứng.
- Một `Notification` được tạo từ sự kiện nghiệp vụ; mỗi lần gửi qua email / SMS / push / in-app được ghi bằng `NotificationDelivery`.
- Một `AuditLog` phải tham chiếu actor thực hiện, loại actor, hành động, đối tượng bị tác động, dữ liệu trước / sau nếu có và lý do thao tác.

### 9.4. Dữ liệu snapshot bắt buộc

| Ngữ cảnh            | Snapshot cần lưu                                                                                       | Lý do                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Booking             | Thông tin chuyến, nhà xe, tuyến, giờ đi / đến, điểm đón / trả, giá vé, phí, khuyến mãi, chính sách hủy | Tránh thay đổi sau này làm sai quyền lợi của hành khách hoặc doanh thu của Operator. |
| Ticket              | Mã vé, QR token, ghế, hành khách, điểm đón / trả, trạng thái vé, thời điểm phát hành                   | Đảm bảo vé có thể kiểm tra độc lập, chống vé giả và phục vụ check-in.                |
| Payment / Refund    | Provider, mã giao dịch, số tiền, trạng thái, thời điểm callback, dữ liệu đối soát                      | Xử lý callback trễ / trùng, tra soát thanh toán và kiểm toán tài chính.              |
| Escrow / Payout     | Số tiền gốc, commission, số tiền giữ lại, số tiền hoàn, số tiền payout, kỳ payout                      | Minh bạch tài chính giữa Platform và Operator.                                       |
| Policy / Commission | Phiên bản chính sách, thời gian hiệu lực, người cấu hình, phạm vi áp dụng                              | Không áp dụng ngược chính sách mới lên giao dịch cũ.                                 |
| Audit               | Actor, quyền tại thời điểm thao tác, dữ liệu trước / sau, lý do, IP / thiết bị nếu có                  | Truy vết thao tác nhạy cảm, xử lý tranh chấp và đáp ứng yêu cầu kiểm toán.           |

### 9.5. Ghi chú cho Database Design

- `04-database-design.md` BẮT BUỘC chốt collection / table, khóa chính, khóa ngoại hoặc reference, index, unique constraint, soft delete, retention và archive policy.
- `04-database-design.md` BẮT BUỘC xác định cơ chế chống bán trùng ghế: transaction, atomic update, distributed lock, unique constraint hoặc kết hợp các cơ chế này.
- `04-database-design.md` BẮT BUỘC làm rõ mô hình ledger cho escrow, commission, refund và payout trước khi triển khai giao dịch tiền thật.
- `04-database-design.md` BẮT BUỘC định nghĩa rõ dữ liệu nào là dữ liệu chuẩn Platform quản lý và dữ liệu nào là dữ liệu riêng của từng Operator.
- Provider thanh toán, provider SMS / email / push và object storage cụ thể vẫn là `OPEN QUESTION`; mục 9 chỉ xác định nhu cầu dữ liệu, không chốt nhà cung cấp.

---

## 10. Functional Requirements

Phần này mô tả yêu cầu chức năng ở mức SRS. Mỗi yêu cầu phải truy vết được sang thiết kế, API, database, test case và task triển khai. Các yêu cầu liên quan thanh toán, vé, ghế, phân quyền, dữ liệu cá nhân và audit là phạm vi rủi ro cao, không được giản lược khi thiết kế.

### 10.1. Identity, Authentication & Access Control

| ID        | Yêu cầu chức năng                                                                                                                                                                                                                                             | Actor chính                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| FR-IAM-01 | Hệ thống phải cho phép hành khách đăng ký tài khoản bằng số điện thoại hoặc email.                                                                                                                                                                            | Người dùng                    |
| FR-IAM-02 | Hệ thống phải hỗ trợ cơ chế đăng nhập riêng theo từng actor: User đăng nhập bằng số điện thoại / email theo cấu hình xác thực; Admin đăng nhập bằng tài khoản được tạo sẵn trong database; Operator và Employee đăng nhập bằng username và mật khẩu được cấp. | Tất cả actor                  |
| FR-IAM-03 | Hệ thống phải cho phép User tự thực hiện quên mật khẩu / đặt lại mật khẩu có xác minh. Admin, Operator và Employee không được tự đặt lại mật khẩu; các actor này chỉ có thể yêu cầu người có thẩm quyền cấp lại hoặc đặt lại mật khẩu.                        | User, Admin, Nhà xe, Employee |
| FR-IAM-04 | Hệ thống phải quản lý actor chính gồm `User`, `Operator`, `Employee`, `Admin`.                                                                                                                                                                                | Admin                         |
| FR-IAM-05 | Hệ thống phải hỗ trợ role Employee đã chốt gồm `TICKET_STAFF`, `DRIVER`, `SUPPORT_STAFF`.                                                                                                                                                                     | Nhà xe, Employee              |
| FR-IAM-06 | Hệ thống phải kiểm tra RBAC và tenant boundary theo `Operator` cho mọi thao tác của Operator và Employee.                                                                                                                                                     | Hệ thống                      |
| FR-IAM-07 | Hệ thống phải cho phép Admin cấu hình hoặc gán quyền nội bộ cho tài khoản Admin theo phạm vi trách nhiệm.                                                                                                                                                     | Admin                         |
| FR-IAM-08 | Hệ thống phải cho phép khóa, mở khóa hoặc vô hiệu hóa tài khoản theo quyền hạn và ghi lý do thao tác.                                                                                                                                                         | Admin, Nhà xe                 |
| FR-IAM-09 | Hệ thống phải ghi nhận lịch sử đăng nhập, thiết bị, thời điểm và trạng thái đăng nhập cho các actor đã xác thực.                                                                                                                                              | Hệ thống                      |
| FR-IAM-10 | Hệ thống phải yêu cầu xác thực bổ sung cho thao tác nhạy cảm như hoàn tiền, đổi tài khoản nhận tiền, khóa Operator, đổi chính sách.                                                                                                                           | Admin, Nhà xe                 |
| FR-IAM-11 | Hệ thống phải cho phép User xem và cập nhật thông tin cá nhân / hồ sơ tài khoản của chính mình trong phạm vi được phép.                                                                                                                                       | Người dùng                    |
| FR-IAM-12 | Hệ thống phải từ chối truy cập dữ liệu không thuộc quyền sở hữu hoặc phạm vi phân quyền của actor.                                                                                                                                                            | Hệ thống                      |

### 10.2. Marketplace Layer - Hành khách

| ID        | Yêu cầu chức năng                                                                                                                              | Actor chính |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| FR-MKT-01 | Hệ thống phải cho phép hành khách tìm kiếm chuyến theo điểm đi, điểm đến, ngày đi và số lượng khách.                                           | Người dùng  |
| FR-MKT-02 | Hệ thống phải chỉ hiển thị chuyến còn mở bán, còn ghế phù hợp và chưa hết thời gian bán online.                                                | Hệ thống    |
| FR-MKT-03 | Hệ thống phải cho phép lọc kết quả theo Operator, giờ khởi hành, giá vé, loại phương tiện, tiện ích, điểm đón / trả, đánh giá.                 | Người dùng  |
| FR-MKT-04 | Hệ thống phải cho phép sắp xếp kết quả theo giá, giờ đi, đánh giá, thời gian di chuyển hoặc tiêu chí được cấu hình.                            | Người dùng  |
| FR-MKT-05 | Hệ thống phải hiển thị chi tiết chuyến gồm Operator, tuyến, điểm đón / trả, lịch trình, loại phương tiện, sơ đồ ghế, giá vé và chính sách hủy. | Người dùng  |
| FR-MKT-06 | Hệ thống phải hiển thị profile Operator gồm thông tin công khai, đánh giá, scorecard, tuyến tiêu biểu và điều khoản dịch vụ.                   | Người dùng  |
| FR-MKT-07 | Hệ thống phải cho phép hành khách chọn một hoặc nhiều ghế / giường khả dụng trên cùng chuyến.                                                  | Người dùng  |
| FR-MKT-08 | Hệ thống phải cho phép hành khách nhập thông tin hành khách, thông tin liên hệ và ghi chú hợp lệ cho booking.                                  | Người dùng  |
| FR-MKT-09 | Hệ thống phải cho phép hành khách chọn điểm đón và điểm trả hợp lệ theo cấu hình của chuyến.                                                   | Người dùng  |
| FR-MKT-10 | Hệ thống phải cho phép áp dụng mã giảm giá hoặc chương trình khuyến mãi nếu thỏa điều kiện đã cấu hình.                                        | Người dùng  |
| FR-MKT-11 | Hệ thống phải cho phép hành khách xem lịch sử booking, ticket, trạng thái thanh toán, trạng thái hoàn tiền và thông báo liên quan.             | Người dùng  |
| FR-MKT-12 | Hệ thống phải cho phép khách không đăng nhập tra cứu vé bằng thông tin được phép, đồng thời yêu cầu xác minh cho thao tác nhạy cảm.            | Người dùng  |
| FR-MKT-13 | Hệ thống phải cho phép hành khách lưu thông tin hành khách thường dùng để đặt vé nhanh hơn.                                                    | Người dùng  |

### 10.3. Booking, Ticket, Payment & Escrow

| ID        | Yêu cầu chức năng                                                                                                                              | Actor chính       |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| FR-BTP-01 | Hệ thống phải kiểm tra trạng thái ghế theo thời gian thực trước khi cho phép chọn ghế.                                                         | Hệ thống          |
| FR-BTP-02 | Hệ thống phải giữ ghế tạm thời bằng cơ chế có TTL khi hành khách bắt đầu đặt vé.                                                               | Hệ thống          |
| FR-BTP-03 | Hệ thống phải tự động giải phóng ghế khi hết thời gian giữ ghế mà booking chưa thanh toán hoặc chưa được xác nhận hợp lệ.                      | Hệ thống          |
| FR-BTP-04 | Hệ thống phải kiểm tra lại trạng thái ghế trước khi tạo payment và trước khi phát hành ticket.                                                 | Hệ thống          |
| FR-BTP-05 | Hệ thống phải tạo booking với mã booking duy nhất, trạng thái ban đầu phù hợp và snapshot dữ liệu bắt buộc theo §9.4.                          | Hệ thống          |
| FR-BTP-06 | Hệ thống phải tính tổng tiền gồm giá vé, phí, giảm giá, phí hủy dự kiến nếu có và số tiền hành khách phải trả.                                 | Hệ thống          |
| FR-BTP-07 | Hệ thống phải tạo payment cho booking đủ điều kiện và không cho thanh toán booking đã hết hạn, đã hủy hoặc đã thanh toán thành công.           | Hệ thống          |
| FR-BTP-08 | Hệ thống phải xử lý callback / webhook thanh toán theo cơ chế idempotent.                                                                      | Hệ thống          |
| FR-BTP-09 | Hệ thống phải cập nhật trạng thái booking, payment và ghế khi thanh toán thành công, thất bại, hết hạn hoặc cần đối soát.                      | Hệ thống          |
| FR-BTP-10 | Hệ thống phải phát hành ticket điện tử sau khi thanh toán thành công hoặc sau khi booking được xác nhận theo luồng thanh toán sau đã cấu hình. | Hệ thống          |
| FR-BTP-11 | Mỗi ticket phải có mã vé duy nhất, QR token không đoán được, thông tin chuyến, ghế, điểm đón / trả, hành khách và trạng thái ticket.           | Hệ thống          |
| FR-BTP-12 | Hệ thống phải cho phép hủy vé theo chính sách đã áp dụng tại thời điểm booking và không áp chính sách mới ngược về booking cũ.                 | Người dùng, Admin |
| FR-BTP-13 | Hệ thống phải tạo refund request khi vé / booking đủ điều kiện hoàn tiền.                                                                      | Người dùng, Admin |
| FR-BTP-14 | Hệ thống phải cho phép Admin xử lý refund thủ công với lý do, audit log và thông báo bắt buộc cho Operator liên quan.                          | Admin             |
| FR-BTP-15 | Hệ thống phải ghi nhận dòng tiền thanh toán thành công vào escrow ledger của Platform.                                                         | Hệ thống          |
| FR-BTP-16 | Hệ thống phải tính commission theo rule áp dụng và lưu dữ liệu phục vụ payout cho Operator.                                                    | Hệ thống          |
| FR-BTP-17 | Hệ thống phải hỗ trợ đối soát payment, refund, escrow và payout theo mã booking, mã payment, mã provider transaction và Operator.              | Admin, Nhà xe     |
| FR-BTP-18 | Hệ thống phải ghi lịch sử thay đổi trạng thái booking, ticket, payment, refund và ghế.                                                         | Hệ thống          |

### 10.4. Operator Onboarding, Profile & Finance

| ID        | Yêu cầu chức năng                                                                                                           | Actor chính |
| --------- | --------------------------------------------------------------------------------------------------------------------------- | ----------- |
| FR-OPR-01 | Hệ thống phải cho phép Operator đăng ký hồ sơ nhà xe và gửi yêu cầu tham gia nền tảng.                                      | Nhà xe      |
| FR-OPR-02 | Hệ thống phải cho phép Operator khai báo thông tin doanh nghiệp, logo, mô tả, hotline, email, địa chỉ và thông tin liên hệ. | Nhà xe      |
| FR-OPR-03 | Hệ thống phải cho phép Operator tải lên hồ sơ KYC và tài liệu pháp lý theo danh mục Admin cấu hình.                         | Nhà xe      |
| FR-OPR-04 | Hệ thống phải cho phép Operator khai báo và cập nhật tài khoản nhận tiền theo quy trình xác minh bổ sung.                   | Nhà xe      |
| FR-OPR-05 | Hệ thống phải cho phép Operator theo dõi trạng thái KYC: chờ duyệt, được duyệt, bị từ chối, cần bổ sung, bị khóa.           | Nhà xe      |
| FR-OPR-06 | Hệ thống phải chỉ cho phép Operator đã được phê duyệt mở bán công khai.                                                     | Hệ thống    |
| FR-OPR-07 | Hệ thống phải cho phép Operator xem escrow balance, giao dịch đang giữ, giao dịch đã hoàn và giao dịch đủ điều kiện payout. | Nhà xe      |
| FR-OPR-08 | Hệ thống phải cho phép Operator xem lịch sử commission, payout, adjustment và đối soát giao dịch thuộc nhà xe.              | Nhà xe      |
| FR-OPR-09 | Hệ thống phải cho phép Operator gửi yêu cầu payout sớm nếu policy nền tảng cho phép.                                        | Nhà xe      |
| FR-OPR-10 | Hệ thống phải cho phép Operator phản hồi đánh giá, khiếu nại và dispute liên quan đến chuyến / booking thuộc nhà xe.        | Nhà xe      |
| FR-OPR-11 | Hệ thống phải bảo đảm Operator không xem hoặc thao tác dữ liệu thuộc Operator khác.                                         | Hệ thống    |

### 10.5. Operator OS - Resource, Route, Trip & Inventory

| ID        | Yêu cầu chức năng                                                                                                              | Actor chính |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| FR-OPS-01 | Hệ thống phải cho phép Operator quản lý danh sách `Vehicle` thuộc nhà xe.                                                      | Nhà xe      |
| FR-OPS-02 | Hệ thống phải cho phép Operator cấu hình `VehicleType`, tiện ích, biển số, trạng thái vận hành và thông tin mô tả phương tiện. | Nhà xe      |
| FR-OPS-03 | Hệ thống phải cho phép Operator tạo và cập nhật `SeatMap` cho phương tiện hoặc loại phương tiện.                               | Nhà xe      |
| FR-OPS-04 | Hệ thống phải cho phép Operator tạo tuyến, chọn điểm đầu / cuối và gắn các điểm đón / trả theo danh mục chuẩn của Platform.    | Nhà xe      |
| FR-OPS-05 | Hệ thống phải cho phép Operator đề xuất StopPoint mới để Admin duyệt nếu điểm chưa có trong danh mục chuẩn.                    | Nhà xe      |
| FR-OPS-06 | Hệ thống phải cho phép Operator tạo chuyến cụ thể theo tuyến, ngày giờ, phương tiện, giá vé và điểm đón / trả áp dụng.         | Nhà xe      |
| FR-OPS-07 | Hệ thống phải cho phép Operator tạo lịch chuyến lặp lại theo rule được cấu hình.                                               | Nhà xe      |
| FR-OPS-08 | Hệ thống phải cho phép Operator cấu hình fare theo tuyến, chuyến, loại ghế, chặng, thời điểm hoặc policy nhà xe.               | Nhà xe      |
| FR-OPS-09 | Hệ thống phải kiểm tra giá vé theo policy nền tảng và khung trần / sàn nếu đã được Admin cấu hình.                             | Hệ thống    |
| FR-OPS-10 | Hệ thống phải cho phép Operator mở bán, khóa bán, tạm dừng bán hoặc hủy chuyến theo quyền được cấp.                            | Nhà xe      |
| FR-OPS-11 | Hệ thống phải yêu cầu lý do và ghi audit log khi Operator thay đổi thông tin quan trọng của chuyến đã có vé bán.               | Nhà xe      |
| FR-OPS-12 | Hệ thống phải gửi thông báo cho hành khách khi Operator thay đổi giờ chạy, phương tiện, điểm đón / trả hoặc hủy chuyến.        | Hệ thống    |
| FR-OPS-13 | Hệ thống phải cho phép Operator khóa ghế thủ công hoặc đồng bộ ghế bán ngoài Platform nếu vận hành đa kênh.                    | Nhà xe      |
| FR-OPS-14 | Hệ thống phải cho phép Operator xem danh sách booking / ticket theo chuyến, ngày, trạng thái và kênh bán.                      | Nhà xe      |
| FR-OPS-15 | Hệ thống phải cho phép Operator xuất danh sách hành khách theo chuyến trong phạm vi quyền được cấp.                            | Nhà xe      |

### 10.6. Employee App / Portal & Operations

| ID        | Yêu cầu chức năng                                                                                                                       | Role áp dụng              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| FR-EMP-01 | Employee phải đăng nhập vào app / portal nhân viên theo tài khoản do Operator cấp.                                                      | Mọi role                  |
| FR-EMP-02 | Employee phải chỉ xem dữ liệu thuộc Operator của mình và phạm vi công việc được phân quyền.                                             | Mọi role                  |
| FR-EMP-03 | Employee phải xem được lịch chuyến hoặc nhiệm vụ được phân công.                                                                        | Mọi role                  |
| FR-EMP-04 | Employee phải xem được chi tiết chuyến gồm phương tiện, biển số, tuyến, giờ đi, điểm đón / trả và ghi chú vận hành.                     | Mọi role                  |
| FR-EMP-05 | Employee được phân quyền phải xem được danh sách hành khách theo chuyến, trong đó số điện thoại được mask theo policy.                  | `TICKET_STAFF`, `DRIVER`  |
| FR-EMP-06 | Employee được phân quyền phải tìm được hành khách theo tên, số điện thoại được phép xem hoặc mã vé.                                     | `TICKET_STAFF`, `DRIVER`  |
| FR-EMP-07 | Employee được phân quyền phải quét QR hoặc nhập mã vé để xác thực ticket server-side.                                                   | `TICKET_STAFF`, `DRIVER`  |
| FR-EMP-08 | Employee được phân quyền phải cập nhật trạng thái hành khách: chưa lên, đã lên, vắng mặt hoặc cần xử lý.                                | `TICKET_STAFF`, `DRIVER`  |
| FR-EMP-09 | Employee có role `DRIVER` phải cập nhật trạng thái chuyến trong phạm vi chuyến được phân công.                                          | `DRIVER`                  |
| FR-EMP-10 | Employee có role `DRIVER` phải ghi nhận nhật trình chuyến gồm thời điểm thực tế, điểm dừng, tình trạng phương tiện và ghi chú vận hành. | `DRIVER`                  |
| FR-EMP-11 | Employee được phân quyền phải báo cáo sự cố gồm loại sự cố, mức độ ưu tiên, mô tả, thời điểm và attachment nếu có.                      | `DRIVER`, `SUPPORT_STAFF` |
| FR-EMP-12 | Hệ thống phải đồng bộ check-in, nhật trình và báo cáo sự cố về Operator và Admin theo thời gian thực hoặc khi có mạng lại.              | Hệ thống                  |
| FR-EMP-13 | Hệ thống phải ghi audit hoặc operation log cho thao tác check-in, đổi trạng thái chuyến và báo cáo sự cố.                               | Hệ thống                  |

### 10.7. Platform Admin, Catalog, Policy & Trust

| ID        | Yêu cầu chức năng                                                                                                      | Actor chính |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | ----------- |
| FR-ADM-01 | Admin phải xem được dashboard tổng quan toàn hệ thống theo quyền được cấp.                                             | Admin       |
| FR-ADM-02 | Admin phải quản lý tài khoản người dùng, Operator, Employee ở mức giám sát và tài khoản Admin nội bộ.                  | Admin       |
| FR-ADM-03 | Admin phải phê duyệt, từ chối, yêu cầu bổ sung, khóa hoặc mở khóa Operator dựa trên KYC và chính sách nền tảng.        | Admin       |
| FR-ADM-04 | Admin phải quản lý danh mục chuẩn gồm tỉnh / thành, phường / xã, điểm đón / trả, loại phương tiện và tiện ích.         | Admin       |
| FR-ADM-05 | Admin phải duyệt hoặc từ chối đề xuất StopPoint từ Operator.                                                           | Admin       |
| FR-ADM-06 | Admin phải cấu hình policy hủy / đổi / hoàn tiền, thời gian giữ ghế, thời gian ngừng bán online và policy dữ liệu.     | Admin       |
| FR-ADM-07 | Admin phải cấu hình commission mặc định, commission theo Operator hoặc theo tier nếu được áp dụng.                     | Admin       |
| FR-ADM-08 | Admin phải cấu hình payout policy gồm chu kỳ T+N, ngưỡng tối thiểu và trạng thái payout.                               | Admin       |
| FR-ADM-09 | Admin phải cấu hình rule kiểm tra khung giá trần / sàn và quyết định cảnh báo hoặc chặn mở bán theo policy đã duyệt.   | Admin       |
| FR-ADM-10 | Admin phải giám sát payment, refund, escrow, commission, payout và reconciliation toàn hệ thống.                       | Admin       |
| FR-ADM-11 | Admin phải xử lý dispute với vai trò arbiter cuối cùng theo MQ-03, bao gồm quyết định refund đơn phương nếu đủ căn cứ. | Admin       |
| FR-ADM-12 | Admin phải quản lý chương trình khuyến mãi cấp Platform, không bao gồm subsidy promotion ở v1.                         | Admin       |
| FR-ADM-13 | Admin phải kiểm duyệt đánh giá, nội dung vi phạm, banner, FAQ và nội dung tĩnh công khai.                              | Admin       |
| FR-ADM-14 | Admin phải cấu hình trạng thái bảo trì hệ thống và thông báo liên quan.                                                | Admin       |
| FR-ADM-15 | Admin phải xem trạng thái tích hợp payment, notification, routing và các service phụ trợ ở mức vận hành.               | Admin       |
| FR-ADM-16 | Admin phải truy xuất audit log cho thao tác nhạy cảm theo actor, thời gian, module, đối tượng tác động và kết quả.     | Admin       |
| FR-ADM-17 | Admin phải xuất báo cáo theo quyền được cấp, bao gồm báo cáo doanh thu, booking, refund, payout, khiếu nại và audit.   | Admin       |

### 10.8. Notification, Support, Review & Reporting

| ID        | Yêu cầu chức năng                                                                                                                            | Actor chính |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| FR-NSR-01 | Hệ thống phải tạo thông báo cho sự kiện quan trọng: đăng ký, booking, thanh toán, phát hành vé, hủy vé, hoàn tiền, đổi chuyến.               | Hệ thống    |
| FR-NSR-02 | Hệ thống phải gửi thông báo qua các kênh được cấu hình như email, SMS, push hoặc in-app và lưu trạng thái gửi.                               | Hệ thống    |
| FR-NSR-03 | Hệ thống phải retry hoặc đánh dấu lỗi khi gửi thông báo thất bại.                                                                            | Hệ thống    |
| FR-NSR-04 | Hệ thống phải thông báo cho Operator khi có booking mới, yêu cầu hỗ trợ, khiếu nại hoặc sự kiện vận hành liên quan.                          | Hệ thống    |
| FR-NSR-05 | Hệ thống phải thông báo cho Employee khi được phân công chuyến hoặc khi chuyến được thay đổi / hủy.                                          | Hệ thống    |
| FR-NSR-06 | Người dùng phải tạo và theo dõi support ticket liên quan đến vé, chuyến, thanh toán, hoàn tiền hoặc chất lượng dịch vụ.                      | Người dùng  |
| FR-NSR-07 | Operator phải phản hồi support ticket / complaint liên quan đến chuyến hoặc booking thuộc nhà xe.                                            | Nhà xe      |
| FR-NSR-08 | Admin phải phân loại, phân công, theo dõi, leo thang và đóng support ticket / complaint.                                                     | Admin       |
| FR-NSR-09 | Hệ thống phải lưu toàn bộ lịch sử trao đổi, trạng thái xử lý và attachment minh chứng của support ticket / dispute.                          | Hệ thống    |
| FR-NSR-10 | Người dùng phải đánh giá chuyến đi / Operator sau khi chuyến hoàn thành và ticket hợp lệ.                                                    | Người dùng  |
| FR-NSR-11 | Hệ thống phải tính toán và hiển thị chỉ số đánh giá / scorecard Operator theo policy kiểm duyệt.                                             | Hệ thống    |
| FR-NSR-12 | Operator phải xem báo cáo vận hành và tài chính thuộc nhà xe, bao gồm doanh thu, số vé bán, tỷ lệ lấp đầy, hủy / hoàn và hiệu suất Employee. | Nhà xe      |
| FR-NSR-13 | Admin phải xem báo cáo toàn hệ thống theo thời gian, Operator, tuyến, khu vực, phương thức thanh toán, khiếu nại và audit.                   | Admin       |

---

## 11. Non-Functional Requirements

Các yêu cầu phi chức năng dưới đây áp dụng cho toàn bộ hệ thống. Khi một yêu cầu có mốc đo cụ thể chưa được chốt, giá trị trong SRS là baseline tối thiểu để thiết kế và kiểm thử; các mục cần chốt thêm sẽ được đưa vào `OPEN QUESTION`.

### 11.1. Hiệu năng

| ID          | Yêu cầu phi chức năng                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| NFR-PERF-01 | Tìm kiếm chuyến phổ biến phải phản hồi trong tối đa 3 giây ở điều kiện tải bình thường.                                              |
| NFR-PERF-02 | Trang / màn hình chi tiết chuyến phải tải trong tối đa 2 giây ở điều kiện tải bình thường, không tính thời gian tải mạng bất thường. |
| NFR-PERF-03 | Luồng giữ ghế, tạo booking, tạo payment và phát hành ticket phải xử lý được thao tác đồng thời mà không bán trùng ghế.               |
| NFR-PERF-04 | Payment callback / webhook phải được xử lý bất đồng bộ hoặc có cơ chế retry để không làm nghẽn luồng đặt vé chính.                   |
| NFR-PERF-05 | Báo cáo lớn cho Operator và Admin phải chạy bất đồng bộ hoặc qua cơ chế background job khi truy vấn vượt ngưỡng cấu hình.            |
| NFR-PERF-06 | Danh sách hành khách phục vụ check-in phải tải nhanh đủ cho vận hành tại bến / trên phương tiện, kể cả khi mạng yếu.                 |

### 11.2. Tính sẵn sàng và độ tin cậy

| ID           | Yêu cầu phi chức năng                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| NFR-AVAIL-01 | Hệ thống đặt vé nên đạt mức sẵn sàng tối thiểu 99.5% mỗi tháng ở môi trường production.                                    |
| NFR-AVAIL-02 | Khi payment gateway lỗi hoặc callback chậm, hệ thống phải hiển thị trạng thái rõ ràng và cho phép đối soát / kiểm tra lại. |
| NFR-AVAIL-03 | Notification, payment callback, refund, payout và reconciliation job phải có retry hoặc cơ chế xử lý lại có kiểm soát.     |
| NFR-AVAIL-04 | Service phụ trợ bị gián đoạn tạm thời không được làm mất dữ liệu booking, ticket, payment, refund hoặc audit log.          |
| NFR-AVAIL-05 | Hệ thống phải có trạng thái bảo trì và thông báo phù hợp cho User, Operator, Employee và Admin khi cần dừng dịch vụ.       |

### 11.3. Nhất quán giao dịch và dữ liệu

| ID          | Yêu cầu phi chức năng                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| NFR-DATA-01 | Ghế trên chuyến phải có cơ chế nhất quán mạnh tại các điểm quyết định: giữ ghế, tạo booking, thanh toán thành công, phát hành vé. |
| NFR-DATA-02 | Booking phải lưu snapshot dữ liệu bắt buộc theo §9.4 và không bị thay đổi ngược bởi policy / giá / lịch trình mới.                |
| NFR-DATA-03 | Payment, refund, escrow ledger, commission và payout phải có mã tham chiếu duy nhất để đối soát hai chiều.                        |
| NFR-DATA-04 | Callback / webhook thanh toán và hoàn tiền phải idempotent, không ghi nhận trùng tiền hoặc trùng trạng thái.                      |
| NFR-DATA-05 | Dữ liệu vận hành theo Operator phải được cô lập bằng `operatorId` hoặc cơ chế tenant boundary tương đương.                        |

### 11.4. Bảo mật và kiểm soát truy cập

| ID         | Yêu cầu phi chức năng                                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-SEC-01 | Mật khẩu phải được băm bằng thuật toán an toàn, không lưu plaintext.                                                                           |
| NFR-SEC-02 | Giao tiếp giữa client và server phải sử dụng HTTPS ở môi trường staging / production.                                                          |
| NFR-SEC-03 | API nhạy cảm phải kiểm tra xác thực, RBAC và tenant boundary ở backend; không chỉ dựa vào kiểm tra UI.                                         |
| NFR-SEC-04 | Tài khoản Admin, Operator và Employee phải tuân theo cơ chế cấp / đổi / cấp lại mật khẩu đã chốt tại `FR-IAM-02..03`.                          |
| NFR-SEC-05 | Thao tác nhạy cảm như refund, payout, khóa Operator, đổi tài khoản nhận tiền, đổi policy, sửa booking phải yêu cầu quyền phù hợp và audit log. |
| NFR-SEC-06 | Hệ thống phải giới hạn tốc độ request đối với đăng nhập, OTP, tìm kiếm, giữ ghế, tạo payment và tra cứu vé.                                    |
| NFR-SEC-07 | Hệ thống phải kiểm soát rủi ro NoSQL Injection, XSS, CSRF, IDOR và lộ token theo mức phù hợp với kiến trúc triển khai.                         |
| NFR-SEC-08 | QR token trên ticket phải không đoán được và phải xác thực server-side khi check-in.                                                           |

### 11.5. Bảo vệ dữ liệu cá nhân

| ID          | Yêu cầu phi chức năng                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| NFR-PRIV-01 | Chỉ thu thập dữ liệu cá nhân cần thiết cho đặt vé, thanh toán, hỗ trợ, check-in và vận hành chuyến.            |
| NFR-PRIV-02 | User phải xem và cập nhật thông tin cá nhân của chính mình trong phạm vi được phép.                            |
| NFR-PRIV-03 | Operator và Employee chỉ được xem dữ liệu hành khách cần thiết cho chuyến / nhiệm vụ thuộc phạm vi phân quyền. |
| NFR-PRIV-04 | Số điện thoại và dữ liệu cá nhân nhạy cảm phải được mask khi hiển thị không cần đầy đủ.                        |
| NFR-PRIV-05 | Log, audit, báo cáo và export không được chứa plaintext token, mật khẩu, OTP hoặc dữ liệu thanh toán nhạy cảm. |
| NFR-PRIV-06 | Hệ thống phải có chính sách retention, archive, xóa / ẩn dữ liệu theo quy định nội bộ và pháp luật áp dụng.    |

### 11.6. Khả năng mở rộng

| ID           | Yêu cầu phi chức năng                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| NFR-SCALE-01 | Hệ thống phải hỗ trợ mở rộng số lượng User, Operator, Employee, Vehicle, Route, Trip, Booking và Ticket.                  |
| NFR-SCALE-02 | Search, booking, payment, notification, reporting và audit nên có khả năng mở rộng độc lập theo tải nghiệp vụ.            |
| NFR-SCALE-03 | Search chuyến nên dùng index, cache hoặc read model phù hợp để chịu tải cao vào dịp lễ / Tết.                             |
| NFR-SCALE-04 | Notification, reconciliation, báo cáo, payout và xử lý sự kiện vận hành nên xử lý qua queue / background job khi phù hợp. |
| NFR-SCALE-05 | Reporting không được làm chậm luồng đặt vé, thanh toán và check-in chính.                                                 |

### 11.7. Trải nghiệm người dùng và vận hành

| ID        | Yêu cầu phi chức năng                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| NFR-UX-01 | Luồng tìm kiếm, chọn chuyến, chọn ghế, thanh toán và nhận vé phải dễ dùng trên desktop và mobile.                               |
| NFR-UX-02 | User phải thấy rõ giá vé, phí, giảm giá, điểm đón / trả, điều kiện hủy / đổi và số tiền thanh toán trước khi xác nhận.          |
| NFR-UX-03 | Lỗi nghiệp vụ phải có thông điệp rõ ràng, không làm lộ thông tin nhạy cảm và có hướng xử lý tiếp theo.                          |
| NFR-UX-04 | Vé điện tử phải dễ đọc, có mã vé / QR code, thông tin chuyến, ghế, điểm đón / trả và trạng thái vé đầy đủ.                      |
| NFR-UX-05 | Operator portal phải hỗ trợ thao tác lặp lại thường xuyên như mở bán chuyến, xem đơn vé, xuất danh sách khách và đối soát.      |
| NFR-UX-06 | Employee app / portal phải hỗ trợ check-in nhanh, đọc danh sách khách theo điểm đón và ghi nhận sự cố trong điều kiện mạng yếu. |
| NFR-UX-07 | Admin portal phải ưu tiên khả năng lọc, tra cứu, audit và xử lý ngoại lệ thay vì giao diện marketing.                           |

### 11.8. Tương thích và tích hợp

| ID          | Yêu cầu phi chức năng                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-COMP-01 | Website phải tương thích với các trình duyệt phổ biến phiên bản hiện đại.                                                             |
| NFR-COMP-02 | Mobile app phải hỗ trợ Android / iOS theo phạm vi Expo SDK đang dùng trong dự án.                                                     |
| NFR-COMP-03 | Email / SMS / push notification phải hiển thị thông tin cốt lõi đủ rõ khi provider hỗ trợ.                                            |
| NFR-COMP-04 | QR code trên vé phải quét được bằng app / portal Employee trong điều kiện ánh sáng và chất lượng màn hình phổ biến.                   |
| NFR-COMP-05 | Payment gateway, notification provider, routing service và object storage cụ thể không được hard-code vào SRS khi chưa chốt provider. |

### 11.9. Bảo trì, quan sát và vận hành

| ID           | Yêu cầu phi chức năng                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| NFR-MAINT-01 | Mã nguồn cần được tổ chức theo module nghiệp vụ rõ ràng và truy vết được về FR / UC liên quan.                             |
| NFR-MAINT-02 | API cần có contract rõ cho frontend, mobile và service nội bộ; thay đổi breaking phải cập nhật tài liệu tương ứng.         |
| NFR-MAINT-03 | Hệ thống phải có logging, monitoring và alert cho lỗi nghiêm trọng liên quan booking, payment, refund, payout và check-in. |
| NFR-MAINT-04 | Hệ thống phải hỗ trợ cấu hình môi trường dev, staging, production và quản lý secret an toàn.                               |
| NFR-MAINT-05 | Thay đổi policy, commission, payout, catalog, quyền truy cập và cấu hình tích hợp phải có lịch sử thay đổi.                |
| NFR-MAINT-06 | Các background job quan trọng phải có trạng thái, log lỗi và khả năng chạy lại có kiểm soát.                               |

### 11.10. Sao lưu, tuân thủ và kiểm toán

| ID           | Yêu cầu phi chức năng                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| NFR-AUDIT-01 | Dữ liệu booking, ticket, payment, refund, escrow, payout, audit log và KYC phải được ưu tiên sao lưu và phục hồi.                                |
| NFR-AUDIT-02 | Hệ thống phải có quy trình backup, restore và kiểm tra khả năng phục hồi định kỳ trước production.                                               |
| NFR-AUDIT-03 | Audit log phải ghi actor, loại actor, thời gian, IP / thiết bị nếu có, hành động, đối tượng, dữ liệu trước / sau và kết quả.                     |
| NFR-AUDIT-04 | Báo cáo tài chính phải đối soát được theo booking, payment provider transaction, refund, escrow ledger, payout và Operator.                      |
| NFR-AUDIT-05 | Thao tác hoàn tiền, payout, khóa Operator, đổi chính sách, thay đổi chuyến đã bán vé phải truy vết được đầy đủ.                                  |
| NFR-AUDIT-06 | SRS không thay thế tư vấn pháp lý; các yêu cầu về vận tải, giá vé, dữ liệu cá nhân, hóa đơn và thuế phải được rà soát pháp chế trước production. |

---

## 12. Use Case tổng quan

### 12.1. Sơ đồ Use Case

```mermaid
flowchart LR
    User[Người dùng]
    Operator[Nhà xe]
    Admin[Admin toàn hệ thống]
    Employee[Nhân viên nhà xe]
    System[Hệ thống]

    UC01((Đăng nhập / xác thực))
    UC02((Tìm kiếm và so sánh chuyến))
    UC03((Xem chi tiết chuyến / Operator))
    UC04((Chọn ghế và giữ ghế))
    UC05((Tạo booking))
    UC06((Thanh toán))
    UC07((Nhận vé điện tử))
    UC08((Hủy vé / yêu cầu hoàn tiền))
    UC09((Đánh giá / hỗ trợ / khiếu nại))

    UC10((Đăng ký Operator / KYC))
    UC11((Quản lý hồ sơ và tài chính Operator))
    UC12((Quản lý Vehicle / SeatMap))
    UC13((Quản lý route / stop point))
    UC14((Quản lý trip / fare / inventory))
    UC15((Quản lý booking / ticket))
    UC16((Quản lý Employee / phân công))
    UC17((Xem báo cáo Operator))

    UC18((Xem nhiệm vụ được phân công))
    UC19((Xem danh sách hành khách))
    UC20((Check-in ticket))
    UC21((Cập nhật trạng thái chuyến))
    UC22((Ghi nhật trình / báo cáo sự cố))

    UC23((Duyệt KYC / quản lý Operator))
    UC24((Quản lý catalog chuẩn))
    UC25((Cấu hình policy / commission / payout))
    UC26((Giám sát payment / refund / escrow / payout))
    UC27((Xử lý dispute / refund thủ công))
    UC28((Kiểm duyệt nội dung / review))
    UC29((Báo cáo toàn hệ thống))
    UC30((Truy xuất audit log))

    UC31((Gửi notification))
    UC32((Đối soát và retry job))

    User --> UC01
    User --> UC02
    User --> UC03
    User --> UC04
    User --> UC05
    User --> UC06
    User --> UC07
    User --> UC08
    User --> UC09

    Operator --> UC01
    Operator --> UC10
    Operator --> UC11
    Operator --> UC12
    Operator --> UC13
    Operator --> UC14
    Operator --> UC15
    Operator --> UC16
    Operator --> UC17

    Employee --> UC01
    Employee --> UC18
    Employee --> UC19
    Employee --> UC20
    Employee --> UC21
    Employee --> UC22

    Admin --> UC01
    Admin --> UC23
    Admin --> UC24
    Admin --> UC25
    Admin --> UC26
    Admin --> UC27
    Admin --> UC28
    Admin --> UC29
    Admin --> UC30

    System --> UC31
    System --> UC32
```

### 12.2. Danh sách Use Case

| ID    | Use Case                                          | Actor chính          | FR liên quan                                | Mức ưu tiên |
| ----- | ------------------------------------------------- | -------------------- | ------------------------------------------- | ----------- |
| UC-01 | Đăng nhập / xác thực theo actor                   | Tất cả actor         | `FR-IAM-*`                                  | Cao         |
| UC-02 | Tìm kiếm và so sánh chuyến                        | Người dùng           | `FR-MKT-01..04`                             | Cao         |
| UC-03 | Xem chi tiết chuyến và profile Operator           | Người dùng           | `FR-MKT-05..06`                             | Cao         |
| UC-04 | Chọn ghế và giữ ghế                               | Người dùng, Hệ thống | `FR-MKT-07`, `FR-BTP-01..04`                | Cao         |
| UC-05 | Tạo booking                                       | Người dùng, Hệ thống | `FR-MKT-08..10`, `FR-BTP-05..06`            | Cao         |
| UC-06 | Thanh toán booking                                | Người dùng, Hệ thống | `FR-BTP-07..09`                             | Cao         |
| UC-07 | Nhận và xem vé điện tử                            | Người dùng, Hệ thống | `FR-BTP-10..11`                             | Cao         |
| UC-08 | Hủy vé / yêu cầu hoàn tiền                        | Người dùng, Admin    | `FR-BTP-12..14`                             | Cao         |
| UC-09 | Đánh giá, hỗ trợ và khiếu nại                     | Người dùng           | `FR-NSR-06`, `FR-NSR-09..11`                | Trung bình  |
| UC-10 | Đăng ký Operator và gửi hồ sơ KYC                 | Nhà xe               | `FR-OPR-01..05`                             | Cao         |
| UC-11 | Quản lý hồ sơ và tài chính Operator               | Nhà xe               | `FR-OPR-02..09`                             | Cao         |
| UC-12 | Quản lý Vehicle, VehicleType và SeatMap           | Nhà xe               | `FR-OPS-01..03`                             | Cao         |
| UC-13 | Quản lý route, stop point và đề xuất điểm mới     | Nhà xe, Admin        | `FR-OPS-04..05`, `FR-ADM-04..05`            | Cao         |
| UC-14 | Quản lý trip, fare, mở bán và inventory           | Nhà xe               | `FR-OPS-06..13`                             | Cao         |
| UC-15 | Quản lý booking / ticket thuộc Operator           | Nhà xe               | `FR-OPS-14..15`, `FR-OPR-11`                | Cao         |
| UC-16 | Quản lý Employee và phân công nhiệm vụ            | Nhà xe               | `FR-IAM-05..06`, `FR-OPS-15`, `FR-EMP-*`    | Cao         |
| UC-17 | Xem báo cáo Operator                              | Nhà xe               | `FR-NSR-12`                                 | Trung bình  |
| UC-18 | Xem nhiệm vụ được phân công                       | Employee             | `FR-EMP-01..04`                             | Cao         |
| UC-19 | Xem danh sách hành khách                          | Employee             | `FR-EMP-05..06`                             | Cao         |
| UC-20 | Check-in ticket bằng QR / mã vé                   | Employee             | `FR-EMP-07..08`, `FR-BTP-11`                | Cao         |
| UC-21 | Cập nhật trạng thái chuyến                        | Employee             | `FR-EMP-09`                                 | Cao         |
| UC-22 | Ghi nhật trình và báo cáo sự cố                   | Employee             | `FR-EMP-10..13`                             | Cao         |
| UC-23 | Duyệt KYC và quản lý Operator                     | Admin                | `FR-ADM-02..03`, `FR-OPR-06`                | Cao         |
| UC-24 | Quản lý catalog chuẩn                             | Admin                | `FR-ADM-04..05`                             | Cao         |
| UC-25 | Cấu hình policy, commission và payout             | Admin                | `FR-ADM-06..09`                             | Cao         |
| UC-26 | Giám sát payment, refund, escrow, payout          | Admin                | `FR-BTP-15..17`, `FR-ADM-10`                | Cao         |
| UC-27 | Xử lý dispute và refund thủ công                  | Admin                | `FR-BTP-14`, `FR-ADM-11`                    | Cao         |
| UC-28 | Kiểm duyệt nội dung, review và nội dung công khai | Admin                | `FR-ADM-12..13`, `FR-NSR-10..11`            | Trung bình  |
| UC-29 | Xem báo cáo toàn hệ thống                         | Admin                | `FR-ADM-17`, `FR-NSR-13`                    | Trung bình  |
| UC-30 | Truy xuất audit log                               | Admin                | `FR-ADM-16`, `NFR-AUDIT-*`                  | Cao         |
| UC-31 | Gửi notification theo sự kiện nghiệp vụ           | Hệ thống             | `FR-NSR-01..05`                             | Cao         |
| UC-32 | Đối soát và chạy lại job nền                      | Hệ thống, Admin      | `FR-BTP-17`, `NFR-AVAIL-03`, `NFR-MAINT-06` | Cao         |

---

## 13. Use Case chi tiết

Mỗi Use Case dưới đây trình bày: actor, mục tiêu, tiền điều kiện, kích hoạt, hậu điều kiện, ưu tiên, luồng chính và luồng thay thế / ngoại lệ.

### UC-01: Đăng ký tài khoản người dùng

| Thuộc tính     | Nội dung                                         |
| -------------- | ------------------------------------------------ |
| Actor chính    | Người dùng                                       |
| Mục tiêu       | Tạo tài khoản để đặt vé và quản lý vé            |
| Tiền điều kiện | Người dùng chưa có tài khoản hoặc chưa đăng nhập |
| Kích hoạt      | Người dùng chọn chức năng đăng ký                |
| Hậu điều kiện  | Tài khoản được tạo và có thể đăng nhập           |
| Ưu tiên        | Cao                                              |

Luồng chính:

1. Người dùng mở màn hình đăng ký.
2. Người dùng nhập họ tên, số điện thoại / email, mật khẩu.
3. Hệ thống kiểm tra định dạng và trùng lặp thông tin.
4. Hệ thống gửi OTP xác thực nếu được cấu hình.
5. Người dùng nhập OTP.
6. Hệ thống xác thực OTP.
7. Hệ thống tạo tài khoản người dùng.
8. Hệ thống thông báo đăng ký thành công.

Luồng thay thế / ngoại lệ:

- A1: Số điện thoại / email đã tồn tại → hệ thống yêu cầu đăng nhập hoặc dùng thông tin khác.
- A2: OTP sai / hết hạn → hệ thống cho phép gửi lại OTP theo giới hạn.
- A3: Mật khẩu không đạt yêu cầu → hệ thống hiển thị quy tắc mật khẩu.

### UC-02: Đăng nhập hệ thống

| Thuộc tính     | Nội dung                                   |
| -------------- | ------------------------------------------ |
| Actor chính    | Người dùng, Nhà xe, Admin, Tài xế          |
| Mục tiêu       | Truy cập hệ thống theo đúng vai trò        |
| Tiền điều kiện | Actor đã có tài khoản hợp lệ               |
| Kích hoạt      | Actor nhập thông tin đăng nhập             |
| Hậu điều kiện  | Actor vào được giao diện tương ứng vai trò |
| Ưu tiên        | Cao                                        |

Luồng chính:

1. Actor mở màn hình đăng nhập.
2. Actor nhập email / số điện thoại và mật khẩu hoặc OTP.
3. Hệ thống xác thực thông tin.
4. Hệ thống kiểm tra trạng thái tài khoản.
5. Hệ thống xác định vai trò và quyền hạn.
6. Hệ thống chuyển actor đến dashboard / giao diện phù hợp.

Luồng thay thế / ngoại lệ:

- A1: Sai thông tin đăng nhập → hệ thống báo lỗi, đếm số lần sai (`failedLoginAttempts`), khóa tài khoản tạm thời nếu vượt ngưỡng (`lockUntil`).
- A2: Tài khoản bị khóa (`isBlocked = true`) → hệ thống hiển thị lý do và hướng dẫn liên hệ hỗ trợ.
- A3: Actor đăng nhập từ thiết bị lạ → hệ thống yêu cầu xác thực bổ sung nếu bật.

### UC-03: Tìm kiếm chuyến xe

| Thuộc tính     | Nội dung                                       |
| -------------- | ---------------------------------------------- |
| Actor chính    | Người dùng                                     |
| Mục tiêu       | Tìm các chuyến xe phù hợp nhu cầu di chuyển    |
| Tiền điều kiện | Hệ thống có dữ liệu tuyến / chuyến đang mở bán |
| Kích hoạt      | Người dùng nhập điểm đi, điểm đến, ngày đi     |
| Hậu điều kiện  | Danh sách chuyến phù hợp được hiển thị         |
| Ưu tiên        | Cao                                            |

Luồng chính:

1. Người dùng nhập điểm đi, điểm đến, ngày đi, số lượng khách.
2. Người dùng bấm tìm kiếm.
3. Hệ thống kiểm tra dữ liệu đầu vào.
4. Hệ thống tìm các chuyến phù hợp đang mở bán.
5. Hệ thống hiển thị danh sách chuyến gồm nhà xe, giờ đi, giá, số ghế trống, loại xe.
6. Người dùng có thể lọc hoặc sắp xếp kết quả.

Luồng thay thế / ngoại lệ:

- A1: Không có chuyến phù hợp → hệ thống gợi ý ngày gần nhất hoặc tuyến liên quan.
- A2: Điểm đi / điểm đến không hợp lệ → hệ thống yêu cầu chọn từ danh sách hỗ trợ.
- A3: Ngày đi trong quá khứ → hệ thống báo lỗi.

### UC-04: Xem chi tiết chuyến xe

| Thuộc tính     | Nội dung                                            |
| -------------- | --------------------------------------------------- |
| Actor chính    | Người dùng                                          |
| Mục tiêu       | Xem đầy đủ thông tin trước khi đặt vé               |
| Tiền điều kiện | Người dùng đã chọn một chuyến từ danh sách tìm kiếm |
| Kích hoạt      | Người dùng bấm vào chuyến xe                        |
| Hậu điều kiện  | Chi tiết chuyến được hiển thị                       |
| Ưu tiên        | Cao                                                 |

Luồng chính:

1. Người dùng chọn một chuyến xe.
2. Hệ thống hiển thị thông tin nhà xe, loại xe, tiện ích, giờ đi, giờ đến dự kiến.
3. Hệ thống hiển thị điểm đón / trả hợp lệ.
4. Hệ thống hiển thị sơ đồ ghế và trạng thái ghế.
5. Hệ thống hiển thị giá vé, phí, chính sách hủy / hoàn tiền.
6. Người dùng tiếp tục chọn ghế hoặc quay lại danh sách.

Luồng thay thế / ngoại lệ:

- A1: Chuyến vừa bị khóa / hết vé → hệ thống thông báo và không cho đặt.
- A2: Thông tin chuyến thay đổi → hệ thống tải lại dữ liệu mới nhất.

### UC-05: Chọn ghế và giữ ghế

| Thuộc tính     | Nội dung                               |
| -------------- | -------------------------------------- |
| Actor chính    | Người dùng                             |
| Mục tiêu       | Chọn ghế mong muốn và giữ chỗ tạm thời |
| Tiền điều kiện | Chuyến còn mở bán và còn ghế trống     |
| Kích hoạt      | Người dùng chọn ghế trên sơ đồ ghế     |
| Hậu điều kiện  | Ghế được giữ tạm thời cho người dùng   |
| Ưu tiên        | Cao                                    |

Luồng chính:

1. Người dùng xem sơ đồ ghế.
2. Người dùng chọn một hoặc nhiều ghế trống.
3. Hệ thống kiểm tra trạng thái ghế theo thời gian thực.
4. Hệ thống khóa ghế tạm thời cho phiên đặt vé (`HOLDING`).
5. Hệ thống hiển thị bộ đếm thời gian giữ ghế.
6. Người dùng tiếp tục nhập thông tin đặt vé.

Luồng thay thế / ngoại lệ:

- A1: Ghế đã được người khác giữ trước → hệ thống báo ghế không còn khả dụng.
- A2: Hết thời gian giữ ghế → hệ thống giải phóng ghế (chuyển về `AVAILABLE`).
- A3: Người dùng bỏ chọn ghế → hệ thống giải phóng ghế đó.

### UC-06: Đặt vé

| Thuộc tính     | Nội dung                                                   |
| -------------- | ---------------------------------------------------------- |
| Actor chính    | Người dùng                                                 |
| Mục tiêu       | Tạo đơn đặt vé với thông tin hành khách hợp lệ             |
| Tiền điều kiện | Người dùng đã chọn ghế và ghế đang được giữ                |
| Kích hoạt      | Người dùng nhập thông tin hành khách và xác nhận đặt vé    |
| Hậu điều kiện  | Đơn đặt vé được tạo ở trạng thái chờ thanh toán / xác nhận |
| Ưu tiên        | Cao                                                        |

Luồng chính:

1. Người dùng nhập thông tin hành khách.
2. Người dùng chọn điểm đón và điểm trả.
3. Người dùng nhập mã giảm giá nếu có.
4. Hệ thống kiểm tra thông tin và điều kiện mã giảm giá.
5. Hệ thống tính tổng tiền.
6. Người dùng xác nhận đặt vé.
7. Hệ thống tạo booking ở trạng thái `PENDING_PAYMENT` hoặc `PENDING_CONFIRMATION`.
8. Hệ thống chuyển người dùng sang bước thanh toán hoặc chờ xác nhận.

Luồng thay thế / ngoại lệ:

- A1: Thông tin hành khách thiếu / sai định dạng → hệ thống yêu cầu sửa.
- A2: Mã giảm giá không hợp lệ → hệ thống báo lý do và cho tiếp tục không áp mã.
- A3: Ghế hết hạn giữ trước khi xác nhận → hệ thống yêu cầu chọn lại ghế.

### UC-07: Thanh toán vé

| Thuộc tính     | Nội dung                                         |
| -------------- | ------------------------------------------------ |
| Actor chính    | Người dùng                                       |
| Mục tiêu       | Thanh toán đơn vé để nhận vé điện tử             |
| Tiền điều kiện | Booking đã được tạo và còn thời hạn thanh toán   |
| Kích hoạt      | Người dùng chọn phương thức thanh toán           |
| Hậu điều kiện  | Booking được thanh toán thành công hoặc thất bại |
| Ưu tiên        | Cao                                              |

Luồng chính:

1. Người dùng chọn phương thức thanh toán.
2. Hệ thống tạo giao dịch thanh toán (`Payment` ở trạng thái `INITIATED`).
3. Hệ thống chuyển người dùng đến cổng thanh toán hoặc hiển thị hướng dẫn thanh toán.
4. Người dùng hoàn tất thanh toán.
5. Cổng thanh toán gửi kết quả về hệ thống.
6. Hệ thống xác minh chữ ký / kết quả giao dịch.
7. Hệ thống cập nhật booking thành `PAID`.
8. Hệ thống phát hành vé điện tử.
9. Hệ thống gửi thông báo xác nhận cho người dùng.

Luồng thay thế / ngoại lệ:

- A1: Thanh toán thất bại → booking vẫn chờ thanh toán hoặc bị hủy nếu hết hạn.
- A2: Người dùng đóng trang thanh toán → hệ thống cho phép kiểm tra lại trạng thái.
- A3: Callback thanh toán trễ → hệ thống dùng cơ chế đối soát để cập nhật sau.
- A4: Có dấu hiệu thanh toán trùng → hệ thống chỉ ghi nhận một giao dịch hợp lệ và đưa giao dịch còn lại vào xử lý đối soát.

### UC-08: Nhận và xem vé điện tử

| Thuộc tính     | Nội dung                                                |
| -------------- | ------------------------------------------------------- |
| Actor chính    | Người dùng                                              |
| Mục tiêu       | Nhận vé hợp lệ để sử dụng khi lên xe                    |
| Tiền điều kiện | Booking đã thanh toán hoặc đã được xác nhận             |
| Kích hoạt      | Hệ thống phát hành vé hoặc người dùng mở mục vé của tôi |
| Hậu điều kiện  | Người dùng xem được vé điện tử                          |
| Ưu tiên        | Cao                                                     |

Luồng chính: hệ thống tạo mã vé duy nhất, tạo QR code / mã check-in, hiển thị thông tin chuyến / ghế / điểm đón / trả / hành khách, gửi vé qua email / SMS / app nếu được cấu hình. Người dùng lưu hoặc xuất trình vé khi lên xe.

Luồng thay thế: A1 - không gửi được email / SMS thì vé vẫn khả dụng trong tài khoản, ghi nhận lỗi gửi. A2 - người dùng mất kết nối thì có thể mở lại vé trong lịch sử khi có mạng.

### UC-09: Hủy vé và yêu cầu hoàn tiền

| Thuộc tính     | Nội dung                                                               |
| -------------- | ---------------------------------------------------------------------- |
| Actor chính    | Người dùng                                                             |
| Mục tiêu       | Hủy vé và nhận hoàn tiền nếu đủ điều kiện                              |
| Tiền điều kiện | Vé tồn tại, thuộc người dùng và chưa hoàn thành chuyến                 |
| Kích hoạt      | Người dùng chọn hủy vé                                                 |
| Hậu điều kiện  | Vé bị hủy, ghế được giải phóng nếu phù hợp, yêu cầu hoàn tiền được tạo |
| Ưu tiên        | Cao                                                                    |

Luồng chính:

1. Người dùng mở chi tiết vé.
2. Người dùng chọn hủy vé.
3. Hệ thống kiểm tra chính sách hủy theo thời gian khởi hành, nhà xe, loại vé.
4. Hệ thống hiển thị số tiền dự kiến được hoàn và phí hủy nếu có.
5. Người dùng xác nhận hủy.
6. Hệ thống cập nhật vé thành `CANCELLED`.
7. Hệ thống tạo yêu cầu hoàn tiền (`Refund` ở trạng thái `REQUESTED`) nếu đủ điều kiện.
8. Hệ thống gửi thông báo hủy vé / hoàn tiền.

Luồng thay thế: A1 - vé quá thời hạn hủy thì hệ thống từ chối và hiển thị lý do. A2 - vé đã check-in thì không cho hủy thông thường, chuyển sang hỗ trợ. A3 - hoàn tiền thất bại thì đưa vào trạng thái cần xử lý thủ công.

### UC-10: Đánh giá chuyến đi

| Thuộc tính     | Nội dung                                                 |
| -------------- | -------------------------------------------------------- |
| Actor chính    | Người dùng                                               |
| Mục tiêu       | Gửi đánh giá chất lượng sau chuyến đi                    |
| Tiền điều kiện | Chuyến đã hoàn thành và người dùng có vé hợp lệ          |
| Kích hoạt      | Người dùng chọn đánh giá chuyến                          |
| Hậu điều kiện  | Đánh giá được lưu và hiển thị theo chính sách kiểm duyệt |
| Ưu tiên        | Trung bình                                               |

Luồng chính: người dùng mở vé / chuyến đã hoàn thành, chọn số sao, nhập nhận xét, hệ thống kiểm tra nội dung, lưu đánh giá, cập nhật điểm trung bình của nhà xe / chuyến / tuyến.

Luồng thay thế: A1 - nội dung vi phạm thì hệ thống ẩn hoặc chuyển admin kiểm duyệt. A2 - người dùng đã đánh giá trước đó thì cho sửa trong thời gian cho phép hoặc không cho gửi lại.

### UC-11: Gửi khiếu nại / yêu cầu hỗ trợ

| Thuộc tính     | Nội dung                                                       |
| -------------- | -------------------------------------------------------------- |
| Actor chính    | Người dùng                                                     |
| Actor phụ      | Nhà xe, Admin                                                  |
| Mục tiêu       | Gửi vấn đề cần hỗ trợ hoặc khiếu nại                           |
| Tiền điều kiện | Người dùng có tài khoản hoặc cung cấp thông tin liên hệ hợp lệ |
| Kích hoạt      | Người dùng tạo yêu cầu hỗ trợ                                  |
| Hậu điều kiện  | Ticket hỗ trợ được tạo                                         |
| Ưu tiên        | Trung bình                                                     |

Luồng chính: người dùng chọn loại vấn đề, chọn vé / booking liên quan nếu có, nhập mô tả và đính kèm minh chứng, hệ thống tạo ticket hỗ trợ, phân tuyến đến nhà xe hoặc admin, gửi thông báo xác nhận tiếp nhận.

Luồng thay thế: A1 - thiếu thông tin liên hệ thì hệ thống yêu cầu bổ sung. A2 - file đính kèm không hợp lệ thì hệ thống báo lỗi.

### UC-12: Quản lý hồ sơ nhà xe

| Thuộc tính     | Nội dung                                    |
| -------------- | ------------------------------------------- |
| Actor chính    | Nhà xe                                      |
| Actor phụ      | Admin                                       |
| Mục tiêu       | Cập nhật thông tin doanh nghiệp vận tải     |
| Tiền điều kiện | Nhà xe có tài khoản và quyền quản lý hồ sơ  |
| Kích hoạt      | Nhà xe mở trang hồ sơ                       |
| Hậu điều kiện  | Hồ sơ được lưu hoặc gửi chờ admin phê duyệt |
| Ưu tiên        | Cao                                         |

Luồng chính: nhà xe cập nhật tên, logo, mô tả, hotline, email, địa chỉ; tải lên giấy phép hoặc tài liệu pháp lý; cập nhật tài khoản nhận tiền; hệ thống kiểm tra định dạng và lưu hoặc chuyển sang trạng thái chờ duyệt; admin nhận thông báo nếu thay đổi cần phê duyệt.

Luồng thay thế: A1 - thiếu giấy tờ bắt buộc thì hệ thống không cho gửi duyệt. A2 - thay đổi tài khoản nhận tiền thì hệ thống yêu cầu xác thực bổ sung.

### UC-13: Quản lý xe và sơ đồ ghế

| Thuộc tính     | Nội dung                                        |
| -------------- | ----------------------------------------------- |
| Actor chính    | Nhà xe                                          |
| Mục tiêu       | Tạo và quản lý thông tin xe, loại xe, sơ đồ ghế |
| Tiền điều kiện | Nhà xe đã được phê duyệt                        |
| Kích hoạt      | Nhà xe chọn mục quản lý xe                      |
| Hậu điều kiện  | Xe và sơ đồ ghế được lưu để dùng cho chuyến     |
| Ưu tiên        | Cao                                             |

Luồng chính: nhà xe tạo mới xe, nhập biển số, loại xe, số ghế, tiện ích; chọn hoặc tạo sơ đồ ghế; cấu hình mã ghế, tầng, vị trí, loại ghế; hệ thống kiểm tra trùng biển số và lưu.

Luồng thay thế: A1 - biển số đã tồn tại → báo lỗi. A2 - sơ đồ ghế không khớp số ghế → yêu cầu điều chỉnh. A3 - xe đang có chuyến tương lai thì một số thông tin bị hạn chế chỉnh sửa.

### UC-14: Quản lý tuyến đường và điểm đón / trả

| Thuộc tính     | Nội dung                             |
| -------------- | ------------------------------------ |
| Actor chính    | Nhà xe                               |
| Mục tiêu       | Tạo tuyến và cấu hình điểm đón / trả |
| Tiền điều kiện | Nhà xe có quyền quản lý tuyến        |
| Kích hoạt      | Nhà xe mở mục tuyến đường            |
| Hậu điều kiện  | Tuyến có thể được dùng để tạo chuyến |
| Ưu tiên        | Cao                                  |

Luồng chính: nhà xe tạo tuyến mới, chọn tỉnh / thành / điểm đi / điểm đến, thêm các điểm đón / trả theo thứ tự, nhập thời gian dự kiến giữa các điểm, hệ thống kiểm tra dữ liệu và lưu.

Luồng thay thế: A1 - điểm đón / trả chưa có trong danh mục thì gửi đề xuất hoặc admin tạo mới. A2 - trùng tuyến thì cảnh báo để tránh tạo dư thừa.

### UC-15: Tạo và quản lý chuyến xe

| Thuộc tính     | Nội dung                            |
| -------------- | ----------------------------------- |
| Actor chính    | Nhà xe                              |
| Mục tiêu       | Mở bán chuyến xe cụ thể             |
| Tiền điều kiện | Có tuyến, xe, sơ đồ ghế hợp lệ      |
| Kích hoạt      | Nhà xe tạo chuyến xe                |
| Hậu điều kiện  | Chuyến xe được lưu và có thể mở bán |
| Ưu tiên        | Cao                                 |

Luồng chính: nhà xe chọn tuyến, chọn ngày giờ khởi hành, chọn xe, nhập giá vé hoặc chọn bảng giá, cấu hình điểm đón / trả áp dụng cho chuyến, chọn trạng thái mở bán hoặc lưu nháp; hệ thống kiểm tra xung đột lịch xe và tạo chuyến.

Luồng thay thế: A1 - xe đã được gán cho chuyến khác cùng thời gian → báo xung đột. A2 - thiếu giá vé → không cho mở bán. A3 - chuyến đã có vé bán → thay đổi quan trọng cần xác nhận và gửi thông báo cho hành khách.

### UC-16: Cấu hình giá vé

| Thuộc tính     | Nội dung                                  |
| -------------- | ----------------------------------------- |
| Actor chính    | Nhà xe                                    |
| Actor phụ      | Admin                                     |
| Mục tiêu       | Thiết lập giá vé cho tuyến / chuyến / ghế |
| Tiền điều kiện | Nhà xe có tuyến hoặc chuyến hợp lệ        |
| Kích hoạt      | Nhà xe mở chức năng giá vé                |
| Hậu điều kiện  | Giá vé được áp dụng cho đặt vé            |
| Ưu tiên        | Cao                                       |

Luồng chính: nhà xe chọn tuyến hoặc chuyến, nhập giá cơ bản, cấu hình giá theo loại ghế / ngày lễ / khung giờ / chặng, hệ thống kiểm tra giá trong giới hạn và lưu bảng giá, áp dụng cho các chuyến liên quan.

Luồng thay thế: A1 - giá vượt ngưỡng cấu hình thì yêu cầu xác nhận hoặc admin phê duyệt. A2 - chuyến đã có người đặt thì giá mới chỉ áp dụng cho booking mới.

### UC-17: Quản lý đơn đặt vé

| Thuộc tính     | Nội dung                              |
| -------------- | ------------------------------------- |
| Actor chính    | Nhà xe                                |
| Mục tiêu       | Theo dõi và xử lý đơn vé của nhà xe   |
| Tiền điều kiện | Nhà xe có đơn vé phát sinh            |
| Kích hoạt      | Nhà xe mở danh sách đơn vé            |
| Hậu điều kiện  | Đơn vé được xem / cập nhật theo quyền |
| Ưu tiên        | Cao                                   |

Luồng chính: nhà xe lọc đơn theo chuyến / ngày / trạng thái / số điện thoại, hệ thống hiển thị danh sách booking / ticket, nhà xe mở chi tiết, xem thông tin hành khách / ghế / thanh toán / điểm đón / trả, thực hiện hành động được phép (xác nhận / ghi chú / hỗ trợ hủy / xuất danh sách), hệ thống ghi log thao tác.

Luồng thay thế: A1 - nhà xe cố truy cập đơn không thuộc quyền → từ chối. A2 - đơn đã hoàn thành / hủy → hạn chế chỉnh sửa.

### UC-18: Phân công tài xế

| Thuộc tính     | Nội dung                                     |
| -------------- | -------------------------------------------- |
| Actor chính    | Nhà xe                                       |
| Actor phụ      | Tài xế                                       |
| Mục tiêu       | Gán tài xế cho chuyến xe                     |
| Tiền điều kiện | Có tài xế và chuyến xe hợp lệ                |
| Kích hoạt      | Nhà xe chọn phân công tài xế                 |
| Hậu điều kiện  | Tài xế được gán vào chuyến và nhận thông báo |
| Ưu tiên        | Cao                                          |

Luồng chính: nhà xe mở chi tiết chuyến, chọn tài xế chính / phụ, hệ thống kiểm tra lịch tài xế có bị trùng không, nhà xe xác nhận, hệ thống lưu phân công và gửi thông báo cho tài xế.

Luồng thay thế: A1 - tài xế bị trùng lịch → cảnh báo hoặc không cho phân công. A2 - tài xế chưa kích hoạt tài khoản → yêu cầu kích hoạt trước.

### UC-19: Xem báo cáo nhà xe

| Thuộc tính     | Nội dung                             |
| -------------- | ------------------------------------ |
| Actor chính    | Nhà xe                               |
| Mục tiêu       | Theo dõi hiệu quả bán vé và vận hành |
| Tiền điều kiện | Nhà xe có dữ liệu chuyến / booking   |
| Kích hoạt      | Nhà xe mở dashboard báo cáo          |
| Hậu điều kiện  | Báo cáo được hiển thị hoặc xuất file |
| Ưu tiên        | Trung bình                           |

Luồng chính: nhà xe chọn khoảng thời gian, chọn bộ lọc tuyến / chuyến / xe, hệ thống tổng hợp dữ liệu doanh thu / số vé / tỷ lệ lấp đầy / hủy vé, hiển thị biểu đồ và bảng dữ liệu, cho phép xuất báo cáo nếu có quyền.

Luồng thay thế: A1 - dữ liệu quá lớn → tạo báo cáo bất đồng bộ. A2 - không có dữ liệu → hiển thị trạng thái rỗng.

### UC-20: Xem lịch chuyến được phân công

| Thuộc tính     | Nội dung                         |
| -------------- | -------------------------------- |
| Actor chính    | Tài xế                           |
| Mục tiêu       | Biết các chuyến cần thực hiện    |
| Tiền điều kiện | Tài xế đã được nhà xe phân công  |
| Kích hoạt      | Tài xế mở ứng dụng / cổng tài xế |
| Hậu điều kiện  | Lịch chuyến được hiển thị        |
| Ưu tiên        | Cao                              |

Luồng chính: tài xế đăng nhập, mở mục lịch chuyến, hệ thống hiển thị các chuyến được phân công theo ngày, tài xế chọn một chuyến để xem chi tiết (tuyến, xe, giờ đi, điểm đón / trả, ghi chú vận hành).

Luồng thay thế: A1 - tài xế chưa có chuyến → hiển thị thông báo không có lịch. A2 - chuyến bị hủy / đổi → hiển thị trạng thái mới nhất.

### UC-21: Xem danh sách hành khách

| Thuộc tính     | Nội dung                           |
| -------------- | ---------------------------------- |
| Actor chính    | Tài xế                             |
| Mục tiêu       | Nắm danh sách khách cần đón / trả  |
| Tiền điều kiện | Tài xế được phân công chuyến       |
| Kích hoạt      | Tài xế mở chi tiết chuyến          |
| Hậu điều kiện  | Danh sách hành khách được hiển thị |
| Ưu tiên        | Cao                                |

Luồng chính: tài xế chọn chuyến, hệ thống hiển thị danh sách hành khách theo điểm đón, tài xế xem thông tin tên / số điện thoại đã mask theo cấu hình / ghế / điểm đón / trả; có thể tìm kiếm theo tên / số điện thoại / mã vé.

Luồng thay thế: A1 - tài xế không được phân công chuyến → từ chối truy cập. A2 - dữ liệu chưa đồng bộ → cho tải lại danh sách.

### UC-22: Check-in hành khách

| Thuộc tính     | Nội dung                             |
| -------------- | ------------------------------------ |
| Actor chính    | Tài xế                               |
| Actor phụ      | Người dùng                           |
| Mục tiêu       | Xác nhận hành khách đã lên xe        |
| Tiền điều kiện | Hành khách có vé hợp lệ              |
| Kích hoạt      | Tài xế quét QR hoặc nhập mã vé       |
| Hậu điều kiện  | Vé được cập nhật trạng thái check-in |
| Ưu tiên        | Cao                                  |

Luồng chính:

1. Hành khách xuất trình vé điện tử.
2. Tài xế quét QR code hoặc nhập mã vé.
3. Hệ thống kiểm tra mã vé, chuyến, trạng thái vé.
4. Hệ thống hiển thị thông tin hành khách và ghế.
5. Tài xế xác nhận hành khách lên xe.
6. Hệ thống cập nhật vé thành `CHECKED_IN`.
7. Nhà xe có thể thấy trạng thái check-in theo thời gian thực (qua Socket.IO).

Luồng thay thế: A1 - mã vé không hợp lệ → báo lỗi. A2 - vé thuộc chuyến khác → cảnh báo. A3 - vé đã hủy → không cho check-in. A4 - vé đã check-in trước đó → cảnh báo tránh gian lận. A5 - mất mạng → ứng dụng có thể lưu tạm thao tác nếu được thiết kế offline, sau đó đồng bộ lại.

### UC-23: Cập nhật trạng thái chuyến đi

| Thuộc tính     | Nội dung                                             |
| -------------- | ---------------------------------------------------- |
| Actor chính    | Tài xế                                               |
| Actor phụ      | Nhà xe, Người dùng                                   |
| Mục tiêu       | Cập nhật tiến độ thực tế của chuyến                  |
| Tiền điều kiện | Tài xế được phân công chuyến                         |
| Kích hoạt      | Tài xế chọn cập nhật trạng thái                      |
| Hậu điều kiện  | Trạng thái chuyến được cập nhật và thông báo nếu cần |
| Ưu tiên        | Cao                                                  |

Luồng chính: tài xế mở chi tiết chuyến, chọn trạng thái mới (chuẩn bị / đang đón khách / đã khởi hành / đang chạy / hoàn thành), hệ thống kiểm tra thứ tự chuyển trạng thái hợp lệ, lưu trạng thái mới, thông báo cho nhà xe và hành khách nếu trạng thái quan trọng.

Luồng thay thế: A1 - chuyển trạng thái không hợp lệ → từ chối. A2 - chuyến đã hoàn thành / hủy → không cho cập nhật trạng thái vận hành thông thường.

### UC-24: Báo cáo sự cố chuyến đi

| Thuộc tính     | Nội dung                                                   |
| -------------- | ---------------------------------------------------------- |
| Actor chính    | Tài xế                                                     |
| Actor phụ      | Nhà xe, Admin                                              |
| Mục tiêu       | Ghi nhận sự cố trong quá trình vận hành                    |
| Tiền điều kiện | Tài xế đang có chuyến liên quan                            |
| Kích hoạt      | Tài xế chọn báo cáo sự cố                                  |
| Hậu điều kiện  | Sự cố được ghi nhận và gửi thông báo cho bộ phận liên quan |
| Ưu tiên        | Trung bình                                                 |

Luồng chính: tài xế chọn loại sự cố, nhập mô tả / mức độ / ảnh minh chứng, hệ thống ghi nhận thời gian và chuyến liên quan, gửi thông báo cho nhà xe; nếu sự cố nghiêm trọng thì cảnh báo cho admin.

Luồng thay thế: A1 - không có kết nối mạng → lưu nháp cục bộ nếu ứng dụng hỗ trợ. A2 - thiếu mô tả bắt buộc → yêu cầu bổ sung.

### UC-25: Quản lý người dùng

| Thuộc tính     | Nội dung                                          |
| -------------- | ------------------------------------------------- |
| Actor chính    | Admin                                             |
| Mục tiêu       | Kiểm soát tài khoản người dùng trên toàn hệ thống |
| Tiền điều kiện | Admin đã đăng nhập và có quyền quản lý người dùng |
| Kích hoạt      | Admin mở mục người dùng                           |
| Hậu điều kiện  | Thông tin hoặc trạng thái tài khoản được cập nhật |
| Ưu tiên        | Cao                                               |

Luồng chính: admin tìm kiếm người dùng theo tên / số điện thoại / email / trạng thái, hệ thống hiển thị danh sách, admin mở chi tiết, xem thông tin tài khoản / lịch sử booking / khiếu nại, thực hiện hành động được phép (khóa, mở khóa, ghi chú, hỗ trợ cập nhật thông tin), hệ thống ghi audit log.

Luồng thay thế: A1 - admin không đủ quyền → từ chối. A2 - tài khoản đang có giao dịch tranh chấp → cảnh báo trước khi khóa.

### UC-26: Phê duyệt và quản lý nhà xe

| Thuộc tính     | Nội dung                                                  |
| -------------- | --------------------------------------------------------- |
| Actor chính    | Admin                                                     |
| Actor phụ      | Nhà xe                                                    |
| Mục tiêu       | Kiểm soát nhà xe tham gia nền tảng                        |
| Tiền điều kiện | Nhà xe đã gửi hồ sơ đăng ký / phê duyệt                   |
| Kích hoạt      | Admin mở danh sách nhà xe chờ duyệt                       |
| Hậu điều kiện  | Nhà xe được phê duyệt, từ chối, khóa hoặc yêu cầu bổ sung |
| Ưu tiên        | Cao                                                       |

Luồng chính: admin xem danh sách nhà xe chờ duyệt, mở hồ sơ, kiểm tra thông tin doanh nghiệp / giấy phép / tài khoản nhận tiền, chọn phê duyệt hoặc yêu cầu bổ sung, hệ thống cập nhật trạng thái nhà xe / gửi thông báo / ghi audit log.

Luồng thay thế: A1 - hồ sơ không hợp lệ → từ chối và nhập lý do. A2 - cần xác minh thêm → chuyển trạng thái cần bổ sung. A3 - nhà xe vi phạm → khóa tạm thời hoặc vĩnh viễn.

### UC-27: Cấu hình danh mục và chính sách hệ thống

| Thuộc tính     | Nội dung                                  |
| -------------- | ----------------------------------------- |
| Actor chính    | Admin                                     |
| Mục tiêu       | Thiết lập dữ liệu nền và quy tắc vận hành |
| Tiền điều kiện | Admin có quyền cấu hình hệ thống          |
| Kích hoạt      | Admin mở mục cấu hình                     |
| Hậu điều kiện  | Cấu hình mới được áp dụng theo phạm vi    |
| Ưu tiên        | Cao                                       |

Luồng chính: admin chọn nhóm cấu hình (danh mục / phí / hủy vé / hoàn tiền / thời gian giữ ghế), cập nhật giá trị, hệ thống kiểm tra định dạng và phạm vi hợp lệ, admin xác nhận lưu, hệ thống áp dụng cấu hình và ghi audit log.

Luồng thay thế: A1 - cấu hình ảnh hưởng giao dịch đang chạy → cảnh báo. A2 - giá trị không hợp lệ → từ chối lưu.

### UC-28: Quản lý thanh toán và hoàn tiền

| Thuộc tính     | Nội dung                                         |
| -------------- | ------------------------------------------------ |
| Actor chính    | Admin                                            |
| Actor phụ      | Người dùng, Nhà xe                               |
| Mục tiêu       | Giám sát và xử lý giao dịch tài chính            |
| Tiền điều kiện | Có dữ liệu thanh toán / hoàn tiền                |
| Kích hoạt      | Admin mở mục thanh toán                          |
| Hậu điều kiện  | Giao dịch được cập nhật, đối soát hoặc hoàn tiền |
| Ưu tiên        | Cao                                              |

Luồng chính: admin tìm kiếm giao dịch theo mã booking / mã thanh toán / người dùng / nhà xe, hệ thống hiển thị trạng thái, admin xem chi tiết booking / payment / refund, thực hiện đối soát hoặc khởi tạo hoàn tiền, hệ thống yêu cầu xác nhận thao tác nhạy cảm, gửi yêu cầu tới cổng thanh toán hoặc ghi nhận xử lý thủ công, cập nhật trạng thái và ghi audit log.

Luồng thay thế: A1 - không tìm thấy giao dịch → báo không có dữ liệu. A2 - cổng thanh toán từ chối hoàn tiền → ghi nhận lỗi và cho xử lý thủ công. A3 - admin không đủ quyền → từ chối thao tác hoàn tiền.

### UC-29: Quản lý khiếu nại

| Thuộc tính     | Nội dung                                       |
| -------------- | ---------------------------------------------- |
| Actor chính    | Admin                                          |
| Actor phụ      | Người dùng, Nhà xe                             |
| Mục tiêu       | Theo dõi và giải quyết khiếu nại trên nền tảng |
| Tiền điều kiện | Có ticket hỗ trợ / khiếu nại                   |
| Kích hoạt      | Admin mở danh sách khiếu nại                   |
| Hậu điều kiện  | Khiếu nại được xử lý hoặc đóng                 |
| Ưu tiên        | Trung bình                                     |

Luồng chính: admin lọc khiếu nại theo loại / trạng thái / mức độ / nhà xe, mở chi tiết, xem thông tin vé / chuyến / thanh toán và trao đổi liên quan, phản hồi hoặc yêu cầu nhà xe cung cấp thông tin, cập nhật trạng thái xử lý, hệ thống thông báo cho người dùng và nhà xe; khi xử lý xong thì admin đóng ticket.

Luồng thay thế: A1 - cần thêm bằng chứng → chuyển trạng thái chờ bổ sung. A2 - khiếu nại nghiêm trọng → đánh dấu ưu tiên cao và có thể khóa chuyến / nhà xe liên quan.

### UC-30: Xem báo cáo toàn hệ thống

| Thuộc tính     | Nội dung                                 |
| -------------- | ---------------------------------------- |
| Actor chính    | Admin                                    |
| Mục tiêu       | Theo dõi hiệu quả vận hành toàn nền tảng |
| Tiền điều kiện | Hệ thống có dữ liệu vận hành             |
| Kích hoạt      | Admin mở dashboard báo cáo               |
| Hậu điều kiện  | Báo cáo được hiển thị hoặc xuất file     |
| Ưu tiên        | Trung bình                               |

Luồng chính: admin chọn khoảng thời gian, chọn bộ lọc theo nhà xe / tuyến / tỉnh thành / phương thức thanh toán, hệ thống tổng hợp doanh thu / số booking / số vé / tỷ lệ hủy / tỷ lệ hoàn tiền / khiếu nại, hiển thị biểu đồ / bảng / KPI, admin xuất báo cáo nếu có quyền.

Luồng thay thế: A1 - báo cáo quá lớn → tạo file bất đồng bộ và thông báo khi hoàn tất. A2 - admin không đủ quyền xem dữ liệu tài chính → ẩn chỉ số nhạy cảm.

### UC-31: Quản lý audit log

| Thuộc tính     | Nội dung                                    |
| -------------- | ------------------------------------------- |
| Actor chính    | Admin                                       |
| Mục tiêu       | Truy vết thao tác quan trọng trong hệ thống |
| Tiền điều kiện | Admin có quyền xem audit log                |
| Kích hoạt      | Admin mở mục audit log                      |
| Hậu điều kiện  | Nhật ký thao tác được tra cứu               |
| Ưu tiên        | Trung bình                                  |

Luồng chính: admin nhập điều kiện tìm kiếm (người thao tác / thời gian / module / hành động), hệ thống hiển thị danh sách audit log, admin mở chi tiết một log, xem dữ liệu trước / sau / IP / thiết bị / thời gian / kết quả, xuất log nếu có quyền.

Luồng thay thế: A1 - không có dữ liệu phù hợp → hiển thị trạng thái rỗng. A2 - log chứa dữ liệu nhạy cảm → mask một phần theo quyền admin.

---

## 14. Business Rules

| ID    | Quy tắc nghiệp vụ                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------------------- |
| BR-01 | Một ghế trên một chuyến chỉ được bán cho một vé hợp lệ tại một thời điểm.                                         |
| BR-02 | Ghế được giữ tạm thời trong thời gian cấu hình, ví dụ 5–15 phút.                                                  |
| BR-03 | Khi hết thời gian giữ ghế mà booking chưa thanh toán, ghế phải được giải phóng.                                   |
| BR-04 | Vé chỉ được phát hành khi booking đã thanh toán thành công hoặc đã được xác nhận theo phương thức thanh toán sau. |
| BR-05 | Vé đã hủy không được dùng để check-in.                                                                            |
| BR-06 | Vé đã check-in không được hủy theo luồng hủy thông thường.                                                        |
| BR-07 | Việc hoàn tiền phụ thuộc vào thời điểm hủy, chính sách nhà xe và chính sách nền tảng.                             |
| BR-08 | Nhà xe không được xem booking của nhà xe khác.                                                                    |
| BR-09 | Tài xế chỉ được xem chuyến mà mình được phân công.                                                                |
| BR-10 | Thay đổi giờ khởi hành sau khi có vé bán phải gửi thông báo cho hành khách.                                       |
| BR-11 | Chuyến đã hoàn thành không được bán thêm vé.                                                                      |
| BR-12 | Chuyến bị hủy phải dừng bán vé và xử lý hoàn tiền / đổi chuyến theo chính sách.                                   |
| BR-13 | Một tài xế không nên bị phân công vào hai chuyến trùng thời gian.                                                 |
| BR-14 | Một xe không được gán vào hai chuyến trùng thời gian nếu không đủ thời gian quay đầu.                             |
| BR-15 | Mã giảm giá chỉ được áp dụng khi thỏa điều kiện về thời gian / tuyến / nhà xe / giá trị đơn / số lượt dùng.       |
| BR-16 | Admin có thể khóa nhà xe khi phát hiện gian lận, vi phạm chất lượng hoặc có yêu cầu pháp lý.                      |
| BR-17 | Tất cả thao tác liên quan đến tiền phải có mã giao dịch và log.                                                   |
| BR-18 | Đánh giá chỉ được tạo bởi người dùng có vé hợp lệ trên chuyến đã hoàn thành.                                      |
| BR-19 | Thông tin số điện thoại hành khách hiển thị cho tài xế có thể được mask theo chính sách bảo mật.                  |
| BR-20 | Khi thay đổi xe, sơ đồ ghế mới phải được map với vé đã bán hoặc hệ thống phải yêu cầu xử lý đổi ghế.              |

---

## 15. Phân quyền chức năng

| Chức năng           | Người dùng                  | Nhà xe                                  | Tài xế                             | Admin                 |
| ------------------- | --------------------------- | --------------------------------------- | ---------------------------------- | --------------------- |
| Đăng nhập           | Có                          | Có                                      | Có                                 | Có                    |
| Tìm kiếm chuyến     | Có                          | Có thể xem dữ liệu của mình             | Không                              | Có                    |
| Đặt vé              | Có                          | Có thể hỗ trợ tạo đơn nếu được cho phép | Không                              | Có thể hỗ trợ         |
| Thanh toán          | Có                          | Không trực tiếp, trừ cấu hình riêng     | Không                              | Quản lý / đối soát    |
| Xem vé              | Vé của mình                 | Vé thuộc nhà xe                         | Vé thuộc chuyến được phân công     | Toàn hệ thống         |
| Hủy vé              | Vé của mình theo chính sách | Vé thuộc nhà xe theo quyền              | Không                              | Có                    |
| Quản lý chuyến      | Không                       | Chuyến của nhà xe                       | Cập nhật trạng thái được phân công | Toàn hệ thống         |
| Quản lý xe          | Không                       | Xe của nhà xe                           | Xem xe được phân công              | Toàn hệ thống         |
| Quản lý tài xế      | Không                       | Tài xế của nhà xe                       | Không                              | Toàn hệ thống         |
| Check-in hành khách | Không                       | Có thể xem kết quả                      | Có                                 | Có thể xem / giám sát |
| Quản lý nhà xe      | Không                       | Hồ sơ của mình                          | Không                              | Có                    |
| Quản lý người dùng  | Không                       | Không                                   | Không                              | Có                    |
| Quản lý khiếu nại   | Tạo và theo dõi của mình    | Xử lý phần liên quan                    | Gửi sự cố                          | Toàn hệ thống         |
| Báo cáo doanh thu   | Không                       | Dữ liệu của nhà xe                      | Không                              | Toàn hệ thống         |
| Cấu hình hệ thống   | Không                       | Một phần trong phạm vi nhà xe           | Không                              | Có                    |
| Audit log           | Không                       | Log của nhà xe nếu được cấp             | Không                              | Có                    |

---

## 16. Luồng nghiệp vụ chính

### 16.1. Luồng đặt vé thành công

```mermaid
sequenceDiagram
    actor U as Người dùng
    participant S as Hệ thống
    participant P as Cổng thanh toán
    participant O as Nhà xe

    U->>S: Tìm kiếm chuyến
    S-->>U: Danh sách chuyến
    U->>S: Chọn chuyến và ghế
    S->>S: Kiểm tra và giữ ghế
    S-->>U: Ghế được giữ tạm thời
    U->>S: Nhập thông tin hành khách
    S->>S: Tạo booking chờ thanh toán
    U->>P: Thanh toán
    P-->>S: Callback thanh toán thành công
    S->>S: Cập nhật booking PAID
    S->>S: Phát hành vé điện tử
    S-->>U: Gửi vé / QR code
    S-->>O: Cập nhật danh sách hành khách
```

### 16.2. Luồng hủy vé và hoàn tiền

```mermaid
sequenceDiagram
    actor U as Người dùng
    participant S as Hệ thống
    participant P as Cổng thanh toán
    participant A as Admin / Nhà xe

    U->>S: Yêu cầu hủy vé
    S->>S: Kiểm tra chính sách hủy
    S-->>U: Hiển thị phí và số tiền hoàn
    U->>S: Xác nhận hủy
    S->>S: Cập nhật vé CANCELLED
    S->>P: Gửi yêu cầu hoàn tiền
    P-->>S: Kết quả hoàn tiền
    S-->>U: Thông báo kết quả
    S-->>A: Cập nhật báo cáo / đối soát
```

### 16.3. Luồng check-in hành khách

```mermaid
sequenceDiagram
    actor D as Tài xế
    actor U as Người dùng
    participant S as Hệ thống
    participant O as Nhà xe

    U-->>D: Xuất trình vé QR
    D->>S: Quét QR / nhập mã vé
    S->>S: Kiểm tra vé và chuyến
    S-->>D: Hiển thị thông tin hợp lệ
    D->>S: Xác nhận khách lên xe
    S->>S: Cập nhật CHECKED_IN
    S-->>O: Đồng bộ trạng thái hành khách
```

---

## 17. Trạng thái dữ liệu quan trọng

Lưu ý: các state enum dưới đây là **target** theo SRS. Code hiện tại có một số enum khác (xem §23 Trạng thái triển khai và §24 Open Questions).

### 17.1. Trạng thái chuyến xe (Trip)

| Trạng thái    | Mô tả                       |
| ------------- | --------------------------- |
| DRAFT         | Chuyến mới tạo, chưa mở bán |
| OPEN_FOR_SALE | Chuyến đang mở bán          |
| SOLD_OUT      | Chuyến đã hết ghế           |
| LOCKED        | Chuyến bị khóa bán tạm thời |
| BOARDING      | Đang đón khách              |
| DEPARTED      | Đã khởi hành                |
| IN_PROGRESS   | Đang chạy                   |
| COMPLETED     | Đã hoàn thành               |
| CANCELLED     | Đã hủy                      |
| INCIDENT      | Có sự cố                    |

### 17.2. Trạng thái ghế trên chuyến (Seat)

| Trạng thái | Mô tả                      |
| ---------- | -------------------------- |
| AVAILABLE  | Còn trống                  |
| HOLDING    | Đang được giữ tạm thời     |
| BOOKED     | Đã đặt thành công          |
| CHECKED_IN | Hành khách đã lên xe       |
| BLOCKED    | Bị khóa bởi nhà xe / admin |

### 17.3. Trạng thái booking

| Trạng thái           | Mô tả                        |
| -------------------- | ---------------------------- |
| PENDING_PAYMENT      | Chờ thanh toán               |
| PENDING_CONFIRMATION | Chờ nhà xe xác nhận          |
| PAID                 | Đã thanh toán                |
| CONFIRMED            | Đã xác nhận                  |
| PARTIALLY_CANCELLED  | Hủy một phần                 |
| CANCELLED            | Đã hủy toàn bộ               |
| EXPIRED              | Hết hạn thanh toán / giữ ghế |
| REFUND_PENDING       | Chờ hoàn tiền                |
| REFUNDED             | Đã hoàn tiền                 |
| REFUND_FAILED        | Hoàn tiền thất bại           |

### 17.4. Trạng thái ticket

| Trạng thái | Mô tả                       |
| ---------- | --------------------------- |
| VALID      | Vé hợp lệ                   |
| CANCELLED  | Vé đã hủy                   |
| CHECKED_IN | Vé đã check-in              |
| NO_SHOW    | Hành khách không lên xe     |
| USED       | Vé đã sử dụng / xong chuyến |
| REFUNDED   | Vé đã hoàn tiền             |

### 17.5. Trạng thái payment

| Trạng thái  | Mô tả            |
| ----------- | ---------------- |
| INITIATED   | Đã tạo giao dịch |
| PROCESSING  | Đang xử lý       |
| SUCCESS     | Thành công       |
| FAILED      | Thất bại         |
| EXPIRED     | Hết hạn          |
| CANCELLED   | Đã hủy           |
| RECONCILING | Đang đối soát    |

### 17.6. Trạng thái refund

| Trạng thái | Mô tả                |
| ---------- | -------------------- |
| REQUESTED  | Đã yêu cầu hoàn tiền |
| APPROVED   | Đã duyệt             |
| PROCESSING | Đang hoàn tiền       |
| SUCCESS    | Hoàn tiền thành công |
| FAILED     | Hoàn tiền thất bại   |
| REJECTED   | Bị từ chối           |

---

## 18. Thông báo hệ thống

| Sự kiện               | Người nhận         | Kênh gợi ý           | Nội dung chính                          |
| --------------------- | ------------------ | -------------------- | --------------------------------------- |
| Đăng ký thành công    | Người dùng         | Email / SMS / In-app | Xác nhận tài khoản đã tạo               |
| Đặt vé chờ thanh toán | Người dùng         | In-app / Email       | Mã đơn, thời hạn thanh toán             |
| Thanh toán thành công | Người dùng         | Email / SMS / In-app | Vé điện tử, QR code, thông tin chuyến   |
| Thanh toán thất bại   | Người dùng         | In-app               | Lý do thất bại, hướng dẫn thử lại       |
| Nhắc giờ khởi hành    | Người dùng         | Push / SMS           | Giờ đi, điểm đón, biển số nếu có        |
| Chuyến thay đổi giờ   | Người dùng, Tài xế | SMS / Push / In-app  | Giờ mới, hướng dẫn xác nhận             |
| Chuyến bị hủy         | Người dùng, Tài xế | SMS / Push / Email   | Lý do, phương án hoàn tiền / đổi chuyến |
| Có đơn vé mới         | Nhà xe             | In-app / Email       | Thông tin chuyến, số vé, doanh thu      |
| Tài xế được phân công | Tài xế             | Push / In-app        | Chuyến, giờ đi, xe                      |
| Hủy vé thành công     | Người dùng, Nhà xe | In-app / Email       | Vé đã hủy, số tiền hoàn dự kiến         |
| Hoàn tiền thành công  | Người dùng         | Email / SMS / In-app | Số tiền, mã giao dịch hoàn              |
| Có khiếu nại mới      | Nhà xe / Admin     | In-app / Email       | Loại khiếu nại, booking liên quan       |
| Nhà xe được phê duyệt | Nhà xe             | Email / In-app       | Trạng thái hoạt động mới                |

---

## 19. Báo cáo và thống kê

### 19.1. Báo cáo cho nhà xe

- Tổng doanh thu theo ngày / tuần / tháng.
- Doanh thu theo tuyến / chuyến / xe.
- Số vé bán ra.
- Tỷ lệ lấp đầy ghế.
- Tỷ lệ hủy vé và hoàn tiền.
- Danh sách chuyến có doanh thu cao / thấp.
- Hiệu suất tài xế theo chuyến được phân công.
- Đánh giá trung bình và phản hồi khách hàng.

### 19.2. Báo cáo cho admin toàn hệ thống

- Tổng doanh thu toàn nền tảng.
- Doanh thu theo nhà xe / tuyến / khu vực / phương thức thanh toán.
- Số lượng người dùng mới, người dùng hoạt động.
- Số lượng booking / ticket / payment / refund.
- Tỷ lệ thanh toán thành công / thất bại.
- Tỷ lệ hủy vé và hoàn tiền.
- Top nhà xe / tuyến / chuyến theo doanh thu.
- Danh sách nhà xe có nhiều khiếu nại.
- Báo cáo audit log thao tác nhạy cảm.
- Tình trạng tích hợp cổng thanh toán / SMS / email / push notification.

---

## 20. Tiêu chí nghiệm thu

### 20.1. Nhóm người dùng

- Người dùng tìm kiếm được chuyến theo điểm đi, điểm đến, ngày đi.
- Người dùng xem được chi tiết chuyến / điểm đón trả / sơ đồ ghế / giá vé.
- Người dùng chọn ghế và hệ thống không cho bán trùng ghế.
- Người dùng đặt vé và thanh toán thành công.
- Hệ thống phát hành vé điện tử có QR / mã vé.
- Người dùng xem được lịch sử vé.
- Người dùng hủy vé theo chính sách và nhận trạng thái hoàn tiền.

### 20.2. Nhóm nhà xe

- Nhà xe tạo được xe / sơ đồ ghế / tuyến / điểm đón trả / chuyến xe.
- Nhà xe cấu hình được giá vé và mở bán chuyến.
- Nhà xe xem được danh sách booking / ticket thuộc nhà xe.
- Nhà xe phân công được tài xế cho chuyến.
- Nhà xe xem được báo cáo doanh thu và tỷ lệ lấp đầy.

### 20.3. Nhóm tài xế

- Tài xế xem được lịch chuyến được phân công.
- Tài xế xem được danh sách hành khách theo chuyến.
- Tài xế quét QR / mã vé để check-in hành khách.
- Tài xế cập nhật được trạng thái chuyến.
- Tài xế gửi được báo cáo sự cố.

### 20.4. Nhóm admin

- Admin quản lý được người dùng / nhà xe / tài xế.
- Admin phê duyệt / khóa / mở khóa nhà xe.
- Admin cấu hình được danh mục và chính sách hệ thống.
- Admin xem và xử lý được thanh toán / hoàn tiền.
- Admin quản lý được khiếu nại.
- Admin xem được báo cáo toàn hệ thống.
- Admin truy xuất được audit log thao tác nhạy cảm.

---

## 21. Module triển khai

| Module                       | Mô tả                                                     |
| ---------------------------- | --------------------------------------------------------- |
| Identity & Access Management | Đăng nhập, đăng ký, phân quyền, OTP, token, RBAC          |
| User Portal                  | Tìm kiếm chuyến, đặt vé, thanh toán, quản lý vé           |
| Operator Portal              | Quản lý nhà xe, xe, tuyến, chuyến, giá, đơn vé            |
| Driver App / Portal          | Lịch chuyến, danh sách khách, check-in, trạng thái chuyến |
| Admin Portal                 | Quản trị toàn hệ thống, cấu hình, báo cáo, khiếu nại      |
| Booking Service              | Giữ ghế, tạo booking, trạng thái vé                       |
| Payment Service              | Tích hợp cổng thanh toán, callback, đối soát, hoàn tiền   |
| Notification Service         | Email, SMS, push, in-app notification                     |
| Reporting Service            | Dashboard, báo cáo, xuất dữ liệu                          |
| Audit Service                | Nhật ký thao tác, truy vết thay đổi                       |
| Support Service              | Ticket hỗ trợ, khiếu nại, phản hồi                        |
| Search Service               | Index và truy vấn chuyến / tuyến / điểm đón               |
| Routing Service (OSRM)       | Tính khoảng cách, thời gian giữa các điểm dừng            |

---

## 22. Rủi ro và biện pháp giảm thiểu

| Rủi ro                                     | Tác động   | Biện pháp giảm thiểu                                                                |
| ------------------------------------------ | ---------- | ----------------------------------------------------------------------------------- |
| Bán trùng ghế khi nhiều người đặt cùng lúc | Rất cao    | Dùng transaction / lock / idempotency, kiểm tra trạng thái ghế thời gian thực       |
| Callback thanh toán bị trễ hoặc mất        | Cao        | Cơ chế đối soát, retry qua Bull queue, truy vấn lại cổng thanh toán                 |
| Nhà xe nhập sai thông tin chuyến           | Cao        | Quy trình xác nhận, cảnh báo khi thay đổi chuyến đã bán vé, audit log               |
| Tài xế không có mạng khi check-in          | Trung bình | Hỗ trợ cache / offline có kiểm soát, đồng bộ sau khi có mạng                        |
| Lộ dữ liệu cá nhân hành khách              | Rất cao    | RBAC, mask dữ liệu, mã hóa, audit log, giới hạn quyền truy cập                      |
| Khiếu nại hoàn tiền phức tạp               | Trung bình | Chính sách rõ ràng, lưu lịch sử giao dịch, ticket support đầy đủ                    |
| Hệ thống quá tải dịp lễ                    | Cao        | Cache tìm kiếm bằng Redis, queue Bull, autoscaling, throttler, tối ưu MongoDB index |
| Dữ liệu báo cáo chậm                       | Trung bình | Tách reporting, xử lý bất đồng bộ, dùng read model nếu cần                          |

---

## 23. Trạng thái triển khai hiện tại

Phần này ghi nhận **gap giữa SRS (target) và code hiện tại** sau khi đối chiếu với `apps/backend/src/modules/` và `packages/shared-types/src/` (snapshot ngày 05/05/2026).

### 23.1. Module backend đã tồn tại

| Module backend | Trạng thái                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth`         | **Đã có**. Routes: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`. JWT + refresh token + JwtAuthGuard. |
| `users`        | **Đã có schema đầy đủ**. Routes: `GET /users/me`, `PUT /users/me`. Có loyalty point, login attempt tracking, lock cơ chế.                    |

### 23.2. Module backend còn thiếu schema / chưa code

Các module sau **có thư mục nhưng chưa có Mongoose schema** (chỉ có TypeScript interface trong `packages/shared-types/`):

| Module folder | Thực thể liên quan trong SRS | Trạng thái                                                       |
| ------------- | ---------------------------- | ---------------------------------------------------------------- |
| `bookings`    | Booking, Ticket              | Chỉ có interface `IBooking`, `ITicket` — chưa có schema Mongoose |
| `trips`       | Trip, TripStop               | Chỉ có interface `ITrip` — chưa có schema                        |
| `buses`       | Bus, BusType, SeatMap, Seat  | Có enum `BusType` (SEATER, SLEEPER, LIMOUSINE) — chưa có schema  |
| `routes`      | Route                        | Chưa có schema                                                   |
| `stop-points` | StopPoint                    | Chưa có schema                                                   |
| `operators`   | Operator                     | Chưa có schema                                                   |
| `employees`   | Employee (Driver)            | Có enum `EmployeeRole` — chưa có schema                          |
| `admin`       | Admin                        | Chưa có schema                                                   |
| `search`      | (search service)             | Chưa code logic search                                           |
| `osrm`        | (routing service)            | Chưa code wrapper OSRM                                           |
| `redis`       | (cache + lock)               | Module wiring — cần dùng cho seat-lock, search cache             |

### 23.3. Module / thực thể trong SRS chưa có ở code

| Thực thể     | Vai trò trong SRS                                 |
| ------------ | ------------------------------------------------- |
| Fare         | Bảng giá theo tuyến / chuyến / loại ghế           |
| Payment      | Có `IPayment` interface, chưa có schema + service |
| Refund       | Chưa có interface, chưa có schema                 |
| Promotion    | Chưa có                                           |
| Review       | Chưa có                                           |
| Complaint    | Chưa có (Support Service chưa tồn tại)            |
| Notification | Chưa có (Notification Service chưa tồn tại)       |
| AuditLog     | Chưa có (Audit Service chưa tồn tại)              |

### 23.4. State enum: code vs SRS

| Enum           | SRS đề xuất                                                                                                                              | Code hiện tại                                                               | Khớp?         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------- |
| Trip status    | DRAFT, OPEN_FOR_SALE, SOLD_OUT, LOCKED, BOARDING, DEPARTED, IN_PROGRESS, COMPLETED, CANCELLED, INCIDENT                                  | SCHEDULED, BOARDING, IN_TRANSIT, COMPLETED, CANCELLED                       | Khác          |
| Seat status    | AVAILABLE, HOLDING, BOOKED, CHECKED_IN, BLOCKED                                                                                          | (chưa có)                                                                   | Thiếu         |
| Booking status | PENDING_PAYMENT, PENDING_CONFIRMATION, PAID, CONFIRMED, PARTIALLY_CANCELLED, CANCELLED, EXPIRED, REFUND_PENDING, REFUNDED, REFUND_FAILED | PENDING, CONFIRMED, CANCELLED, COMPLETED, EXPIRED, REFUND_PENDING, REFUNDED | Khác một phần |
| Ticket status  | VALID, CANCELLED, CHECKED_IN, NO_SHOW, USED, REFUNDED                                                                                    | VALID, USED, CANCELLED, EXPIRED                                             | Khác một phần |
| Payment status | INITIATED, PROCESSING, SUCCESS, FAILED, EXPIRED, CANCELLED, RECONCILING                                                                  | CREATED, PROCESSING, COMPLETED, FAILED, REFUNDED                            | Khác          |
| Refund status  | REQUESTED, APPROVED, PROCESSING, SUCCESS, FAILED, REJECTED                                                                               | (chưa có)                                                                   | Thiếu         |

### 23.5. Tóm tắt mức độ hoàn thành

| Phạm vi                         | % hoàn thành ước lượng                                            |
| ------------------------------- | ----------------------------------------------------------------- |
| Identity & Access (Auth + User) | ~70% (chưa có RBAC role + admin / operator / driver account flow) |
| Booking core                    | ~5% (chỉ có interface)                                            |
| Payment                         | ~5%                                                               |
| Trip / Bus / Route / Seat       | ~5%                                                               |
| Notification                    | 0%                                                                |
| Audit                           | 0%                                                                |
| Support / Review / Complaint    | 0%                                                                |
| Reporting                       | 0%                                                                |

---

## 24. Open Questions / TBD

| ID        | Câu hỏi                                                                                                                                                                                                                                                                                                                      | Tác động                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ~~OQ-01~~ | **CHỐT (05/05/2026):** dùng tập 10 trạng thái Trip của SRS. Code phải mở rộng từ 5 → 10 trạng thái theo §17.1.                                                                                                                                                                                                               | (đã chốt)                                                                      |
| ~~OQ-02~~ | **CHỐT (05/05/2026):** dùng tập 10 trạng thái Booking của SRS. Code phải bổ sung `PAID`, `PARTIALLY_CANCELLED`, `REFUND_FAILED`, `PENDING_PAYMENT`, `PENDING_CONFIRMATION` theo §17.3.                                                                                                                                       | (đã chốt)                                                                      |
| ~~OQ-03~~ | **CHỐT (05/05/2026):** Payment status chuẩn hóa tên `SUCCESS`. Code phải đổi `COMPLETED` → `SUCCESS` và bổ sung `INITIATED`, `EXPIRED`, `CANCELLED`, `RECONCILING` theo §17.5.                                                                                                                                               | (đã chốt)                                                                      |
| ~~OQ-04~~ | **CHỐT (05/05/2026):** dùng `Employee` với hệ role (DRIVER, phụ xe, điều phối viên, nhân viên hỗ trợ). SRS đã được cập nhật ở §7.4, §10.4 (`FR-EMP-*`), §10.3 (`FR-OP-21..23`), §10.5 (`FR-ADMIN-21..22`).                                                                                                                   | (đã chốt)                                                                      |
| OQ-05     | Cổng thanh toán cụ thể nào sẽ tích hợp đầu tiên (VNPay, MoMo, ZaloPay, Stripe...)?                                                                                                                                                                                                                                           | Ảnh hưởng `05-API Specification`, schema Payment, callback flow                |
| OQ-06     | Thời gian giữ ghế chính thức là bao nhiêu phút? Có cấu hình per nhà xe hay toàn hệ thống?                                                                                                                                                                                                                                    | Ảnh hưởng `Booking` flow, test case chống bán trùng ghế                        |
| OQ-07     | Có hỗ trợ thanh toán sau (`PENDING_CONFIRMATION` flow) trong phiên bản đầu không?                                                                                                                                                                                                                                            | Ảnh hưởng phạm vi `06-UI/UX Flow` và FR-OP-12                                  |
| OQ-08     | Mô hình `Fare`: gắn vào `Route`, `Trip`, hay riêng (lookup table)? Hỗ trợ giá theo chặng (segment-based) ở phiên bản đầu không?                                                                                                                                                                                              | Ảnh hưởng `04-Database Design`                                                 |
| OQ-09     | OTP cho đăng ký / đăng nhập: dùng SMS provider nào? Email OTP hay chỉ SMS?                                                                                                                                                                                                                                                   | Ảnh hưởng FR-AUTH-01, FR-AUTH-02 và Notification Service                       |
| OQ-10     | **CHỐT (10/05/2026):** Mobile app dành cho User và Driver = **hay tách 2 app** .Mobile app dành cho User và Driver dùng chung 1 codebase Expo hay tách 2 app riêng?                                                                                                                                                          |                                                                                |
| OQ-11     | Dữ liệu mask số điện thoại hành khách hiển thị cho tài xế: rule mask cụ thể (mấy số đầu / cuối)?                                                                                                                                                                                                                             | BR-19, NFR-PRIV-04                                                             |
| OQ-12     | Hệ thống có hỗ trợ multi-currency / multi-language ở phiên bản đầu không?                                                                                                                                                                                                                                                    | Ảnh hưởng schema Payment, Fare, UI                                             |
| OQ-13     | Chính sách hủy vé / hoàn tiền: cấu hình per nhà xe hay áp chung toàn nền tảng?                                                                                                                                                                                                                                               | BR-07, FR-ADMIN-07, FR-ADMIN-18                                                |
| OQ-14     | Audit log lưu ở MongoDB cùng cluster hay tách ra storage riêng?                                                                                                                                                                                                                                                              | NFR-AUDIT-01–04                                                                |
| OQ-15     | Reporting dùng aggregation trực tiếp trên MongoDB hay tách read model / data warehouse?                                                                                                                                                                                                                                      | NFR-PERF-05, NFR-SCALE-04                                                      |
| ~~MQ-01~~ | **CHỐT (05/05/2026):** Payment flow = **escrow**. Platform giữ tiền trong escrow account và chuyển cho Operator theo chu kỳ T+N sau khi chuyến hoàn thành. Đã phản ánh trong §4.2, §6.1, §6.2.                                                                                                                               | (đã chốt) — chi tiết N, ngưỡng tối thiểu, kênh chuyển tiền chuyển sang `OQ-16` |
| ~~MQ-02~~ | **CHỐT (05/05/2026):** Operator tự định giá theo những gì đã kê khai với cơ quan nhà nước. Platform có quyền kiểm tra và áp khung giá trần / sàn theo quy định pháp luật vào các dịp quan trọng. Đã phản ánh trong §5.3, §6.2, §6.3.                                                                                         | (đã chốt) — quy tắc cảnh báo / chặn cụ thể chuyển sang `OQ-17`                 |
| ~~MQ-03~~ | **CHỐT (05/05/2026):** Platform là **arbiter cuối cùng** trong tranh chấp. Có quyền refund đơn phương qua đầu Operator, có audit log + thông báo bắt buộc cho Operator. Đã phản ánh trong §4.2, §6.3. Cần cập nhật UC-28, UC-29, BR-16, FR-ADMIN-09 ở phiên bản sau.                                                         | (đã chốt)                                                                      |
| ~~MQ-04~~ | **CHỐT (05/05/2026):** Mô hình thu phí = **commission % mặc định** trên mỗi giao dịch vé bán thành công, cấu hình per-Operator hoặc theo tier. Service fee phụ thu khách + subsidy promotion chưa hỗ trợ ở v1. Đã phản ánh trong §4.3, §6.3.                                                                                 | (đã chốt) — % commission mặc định cụ thể chuyển sang `OQ-18`                   |
| ~~MQ-05~~ | **CHỐT (05/05/2026):** Mô hình marketplace = **B (Managed marketplace)**. Platform cung cấp đủ 3 lớp: Marketplace + Operator OS + Platform admin. Pure marketplace (A) và pure SaaS bị loại. Hybrid (C) — API integration cho Operator lớn — chưa hỗ trợ ở v1, đặt vào §6.4. SRS §4, §5, §6 đã được tái cấu trúc theo MQ-05. | (đã chốt)                                                                      |
| OQ-16     | Escrow payout: chu kỳ T+N cụ thể là bao nhiêu ngày? Có ngưỡng tối thiểu để trigger payout không? Kênh chuyển tiền: chuyển khoản ngân hàng trực tiếp hay qua bên thứ ba?                                                                                                                                                      | Ảnh hưởng `04-Database Design` (Payout collection), Operator OS UI             |
| OQ-17     | **CHỐT (10/05/2026):** Khi giá vé Operator vượt khung trần / sàn pháp luật vào dịp quan trọng = **(Platform chỉ cảnh báo cho Operator)**. Khi giá vé Operator vượt khung trần / sàn pháp luật vào dịp quan trọng: Platform chỉ cảnh báo cho Operator, hay tự động chặn không cho mở bán? Có cần admin duyệt từng trường hợp? | UI Operator                                                                    |
| OQ-18     | Commission % mặc định cho Operator mới onboard là bao nhiêu? Có nhiều tier không và tier theo tiêu chí gì (volume / rating / thâm niên)?                                                                                                                                                                                     | Ảnh hưởng commission engine, báo cáo, Operator dashboard                       |
| OQ-19     | KYC Operator: bộ giấy tờ bắt buộc gồm những gì (giấy phép kinh doanh vận tải, giấy phép kinh doanh, bảo hiểm xe, hợp đồng đại lý ...)?                                                                                                                                                                                       | Ảnh hưởng FR-ADMIN-04, UI onboarding nhà xe                                    |
| OQ-20     | Platform có brand riêng đối với hành khách (giống FlixBus / Vexere) hay chỉ là marketplace trung lập với tên nhà xe nổi bật?                                                                                                                                                                                                 | Ảnh hưởng UI hành khách, công thức tính rating, dispute                        |

---

## 25. Phụ lục

### 25.1. Tài liệu liên quan

- `00-quy-chuan-cho-lap-trinh-vien.md` — Quy chuẩn SDLC.
- `02-hld-he-thong-dat-ve-xe-khach.md` — HLD (sẽ viết).
- `03-lld-he-thong-dat-ve-xe-khach.md` — LLD (sẽ viết).
- `04-database-design.md` — Database Design (sẽ viết).
- `05-api-specification.md` — API Specification (sẽ viết).
- `06-ui-ux-flow-specification.md` — UI/UX Flow (sẽ viết).
- `07-security-permission-design.md` — Security Design (sẽ viết).
- `08-test-plan-acceptance-criteria.md` — Test Plan (sẽ viết).

### 25.2. Quy ước đặt mã

Tài liệu này dùng các prefix sau cho yêu cầu, để tiện truy vết sang HLD / LLD / Test Plan / Task:

- `FR-<MODULE>-NN`: Functional Requirement (ví dụ `FR-BOOK-01`).
- `NFR-<GROUP>-NN`: Non-Functional Requirement (ví dụ `NFR-SEC-01`).
- `BR-NN`: Business Rule (ví dụ `BR-01`).
- `UC-NN`: Use Case (ví dụ `UC-05`).
- `OQ-NN`: Open Question (ví dụ `OQ-01`).
