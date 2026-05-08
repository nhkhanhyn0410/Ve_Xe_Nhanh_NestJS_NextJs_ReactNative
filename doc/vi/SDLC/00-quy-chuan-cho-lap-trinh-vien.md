# 00. Quy chuẩn SDLC cho lập trình viên - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                                                      |
| ------------ | ------------------------------------------------------------ |
| Tên tài liệu | Quy chuẩn SDLC cho lập trình viên - Hệ thống đặt vé xe khách |
| Mã tài liệu  | 00a-quy-chuan-cho-lap-trinh-vien                             |
| Dự án        | Hệ thống đặt vé xe khách                                     |
| Phiên bản    | v1.0                                                         |
| Trạng thái   | Draft                                                        |
| Người viết   | AI Agent                                                     |
| Người duyệt  | Nguyễn Hồng Khanh                                            |
| Ngày tạo     | 04/05/2026                                                   |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật    | Nội dung thay đổi                                                                      |
| --------- | ---------- | ----------------- | -------------------------------------------------------------------------------------- |
| v1.0      | 04/05/2026 | Nguyễn Hồng Khanh | Tách từ tài liệu `00-quy-chuan-xay-dung-he-thong-sdlc.md`, giữ phần cho lập trình viên |

---

## 2. Chuẩn nền

Dự án dùng hai chuẩn cố định làm nền và không tự phát minh chuẩn mới:

| Mã chuẩn                | Vai trò trong dự án                                                            |
| ----------------------- | ------------------------------------------------------------------------------ |
| ISO/IEC/IEEE 15289:2019 | Xác định loại tài liệu, mục đích, đối tượng và nội dung bắt buộc của tài liệu. |
| ISO/IEC/IEEE 29148:2018 | Xác định cách viết, kiểm tra và quản lý yêu cầu hệ thống/phần mềm.             |

Các quy định riêng của dự án (mã tài liệu, danh mục file, trạng thái tài liệu, checklist) là phần **tailoring nội bộ**, không được mâu thuẫn với hai chuẩn nền trên.

KHÔNG ĐƯỢC ghi rằng dự án đã được chứng nhận ISO/IEC/IEEE nếu chưa có hoạt động đánh giá/chứng nhận độc lập.

Thuật ngữ bắt buộc dùng thống nhất trong toàn bộ tài liệu SDLC:

| Từ khóa       | Ý nghĩa                                                              |
| ------------- | -------------------------------------------------------------------- |
| BẮT BUỘC      | Phải tuân thủ. Nếu không tuân thủ thì tài liệu/code không đạt chuẩn. |
| KHÔNG ĐƯỢC    | Bị cấm, trừ khi có quyết định cập nhật tài liệu `00`.                |
| NÊN           | Khuyến nghị mạnh. Nếu không làm phải có lý do rõ ràng.               |
| CÓ THỂ        | Được phép áp dụng khi phù hợp, không bắt buộc.                       |
| TBD           | Thông tin chưa xác định.                                             |
| ASSUMPTION    | Giả định tạm thời, phải xác nhận sau.                                |
| OPEN QUESTION | Câu hỏi cần làm rõ trước khi duyệt hoặc triển khai.                  |
| RISK          | Rủi ro cần được theo dõi hoặc xử lý.                                 |
| DECISION      | Quyết định đã chốt.                                                  |

---

## 3. Danh mục tài liệu SDLC

### 3.1. Danh mục tài liệu

| Mã tài liệu             | Tên tài liệu                              | Loại theo ISO/IEC/IEEE 15289 | Tên file chuẩn                        | Vai trò                                                                       | Trạng thái tối thiểu trước khi code                         |
| ----------------------- | ----------------------------------------- | ---------------------------- | ------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------- | --- |
| 00                      | Quy chuẩn SDLC cho lập trình viên         | Policy / Procedure           | `00-quy-chuan-cho-lap-trinh-vien.md`  | Quy định cách lập trình viên dùng tài liệu SDLC làm nguồn triển khai          | Approved                                                    |     |
| 01                      | Software Requirements Specification - SRS | Specification                | `01-srs-he-thong-dat-ve-xe-khach.md`  | Mô tả yêu cầu hệ thống theo ISO/IEC/IEEE 29148                                | Approved đối với phần sẽ triển khai                         |
| 02                      | High Level Design - HLD                   | Description / Specification  | `02-hld-he-thong-dat-ve-xe-khach.md`  | Mô tả kiến trúc tổng quan, boundary, module, integration, deployment overview | Approved đối với module sẽ triển khai                       |
| 03                      | Low Level Design - LLD                    | Description / Specification  | `03-lld-he-thong-dat-ve-xe-khach.md`  | Thiết kế chi tiết module/service, logic, state, validation, error handling    | Approved đối với module sẽ code                             |
| 04                      | Database Design                           | Description / Specification  | `04-database-design.md`               | Thiết kế dữ liệu, ERD, table, constraint, index, migration, transaction       | Approved trước khi tạo migration                            |
| 05                      | API Specification                         | Specification                | `05-api-specification.md`             | API contract, auth, permission, request/response, error, idempotency          | Approved trước khi FE/BE tích hợp                           |
| 06                      | UI/UX Flow Specification                  | Description / Specification  | `06-ui-ux-flow-specification.md`      | User flow, screen state, form state                                           |
| validation, error state | Review hoặc Approved trước khi code UI    |
| 07                      | Security & Permission Design              | Specification / Procedure    | `07-security-permission-design.md`    | Authentication, authorization, RBAC, ownership, audit, threat control         | Approved trước khi code chức năng có quyền/dữ liệu nhạy cảm |
| 08                      | Test Plan & Acceptance Criteria           | Plan / Specification         | `08-test-plan-acceptance-criteria.md` | Test strategy, test case, acceptance criteria, traceability                   | Approved trước khi nghiệm thu                               |
| 09                      | Deployment & Operation Standard           | Procedure / Plan             | `09-deployment-operation-standard.md` | Environment, build, deploy, logging, monitoring, backup, rollback             | Approved trước staging/production                           |
| 10                      | Architecture Decision Record - ADR        | Record                       | `10-architecture-decision-record.md`  | Ghi quyết định kỹ thuật quan trọng, lý do, lựa chọn, hệ quả                   | Cập nhật liên tục                                           |
| 11                      | Project Task Breakdown                    | Plan / Record                | `11-project-task-breakdown.md`        | Chia task từ tài liệu thành output, dependency, DoD                           | Cập nhật liên tục                                           |
| 12                      | Release Notes & Change Log                | Report / Record              | `12-release-notes-change-log.md`      | Ghi nhận thay đổi theo phiên bản phát hành                                    | Cập nhật khi release                                        |

### 3.2. Trạng thái tài liệu

| Trạng thái | Ý nghĩa                                      | Được dùng để code?                                        |
| ---------- | -------------------------------------------- | --------------------------------------------------------- |
| Writing    | Đang soạn thảo lần đầu                       | Không                                                     |
| Draft      | Đã có nội dung nhưng chưa đủ tin cậy         | Không, trừ prototype có kiểm soát                         |
| Review     | Đang được kiểm tra                           | Có thể chuẩn bị task, chưa chốt implementation quan trọng |
| Approved   | Đã được duyệt                                | Có                                                        |
| Deprecated | Không còn dùng                               | Không                                                     |
| Superseded | Đã được thay thế bởi tài liệu/quyết định mới | Không, phải theo nguồn thay thế                           |

Không được chuyển tài liệu sang `Approved` nếu còn `TBD`, `ASSUMPTION` hoặc `OPEN QUESTION` ở phần ảnh hưởng trực tiếp đến code.

---

## 4. Quy chuẩn chung cho mọi tài liệu SDLC

### 4.1. Cấu trúc đầu tài liệu

Mọi tài liệu SDLC chính thức BẮT BUỘC có các phần sau:

1. Thông tin tài liệu (Metadata + Lịch sử thay đổi).
2. Mục lục.
3. Giới thiệu (mục đích, đối tượng đọc, phạm vi, tài liệu tham chiếu).
4. Nội dung chính.
5. Open Questions / TBD nếu còn.
6. Phụ lục nếu cần.

### 4.2. Metadata bắt buộc

Metadata mỗi tài liệu BẮT BUỘC có đúng các trường sau, theo thứ tự:

| Thuộc tính   | Bắt buộc | Quy định                                                      |
| ------------ | -------- | ------------------------------------------------------------- |
| Tên tài liệu | Có       | Đúng tên trong danh mục SDLC ở mục 3.1                        |
| Mã tài liệu  | Có       | Trùng với tên file không có `.md`                             |
| Dự án        | Có       | Hệ thống đặt vé xe khách                                      |
| Phiên bản    | Có       | Dạng `vMAJOR.MINOR`                                           |
| Trạng thái   | Có       | Writing / Draft / Review / Approved / Deprecated / Superseded |
| Người viết   | Có       | Cá nhân, nhóm hoặc công cụ tạo nội dung                       |
| Người duyệt  | Có       | Người chịu trách nhiệm phê duyệt                              |
| Ngày tạo     | Có       | Dạng `DD/MM/YYYY`                                             |

### 4.3. Lịch sử thay đổi

Mỗi tài liệu BẮT BUỘC có bảng lịch sử thay đổi với đúng 4 cột:

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi |
| --------- | ---------- | -------------- | ----------------- |
| v1.0      | DD/MM/YYYY | Tên            | Mô tả ngắn        |

Không được sửa tài liệu đã `Approved` mà không tăng phiên bản hoặc ghi lịch sử thay đổi.

### 4.4. Quy chuẩn trình bày

| Thành phần         | Quy chuẩn                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Định dạng file     | Markdown `.md`                                                                                                                                     |
| Tên file           | `NN-ten-tai-lieu-kebab-case.md`, trong đó `NN` là số thứ tự 2 chữ số, tên không dấu, chữ thường, phân tách bằng dấu gạch ngang                     |
| Ngôn ngữ chính     | Tiếng Việt kỹ thuật, rõ nghĩa, không dùng văn nói                                                                                                  |
| Thuật ngữ kỹ thuật | Giữ thuật ngữ tiếng Anh phổ biến khi dịch làm mất nghĩa: API, service, module, endpoint, transaction, idempotency, migration, deployment, rollback |
| Cấu trúc tiêu đề   | Dùng số mục rõ ràng: `## 1.`, `### 1.1.`, `#### 1.1.1.`                                                                                            |
| Bảng               | Dùng bảng Markdown cho metadata, yêu cầu, API, DB, test case, permission matrix                                                                    |
| Sơ đồ              | Ưu tiên Mermaid để có thể version control cùng tài liệu                                                                                            |
| Mức bắt buộc       | Dùng thống nhất `BẮT BUỘC`, `KHÔNG ĐƯỢC`, `NÊN`, `CÓ THỂ`                                                                                          |
| Nội dung chưa chắc | Ghi rõ `TBD`, `ASSUMPTION`, `OPEN QUESTION`, `RISK`                                                                                                |

---

## 5. Quy chuẩn cho lập trình viên

### 5.1. Nguyên tắc sử dụng tài liệu để lập trình

Lập trình viên BẮT BUỘC xem tài liệu SDLC là nguồn triển khai chính thức. Không được triển khai chức năng dựa trên ghi chú thô, prompt, mô tả miệng hoặc giả định cá nhân nếu nội dung đó chưa được chuẩn hóa vào tài liệu SDLC hoặc task được duyệt.

Thứ tự ưu tiên khi triển khai:

| Ưu tiên | Nguồn                              | Quy định                                                 |
| ------- | ---------------------------------- | -------------------------------------------------------- |
| 1       | `00a-quy-chuan-cho-lap-trinh-vien` | Quy chuẩn cao nhất về tài liệu và cách sử dụng tài liệu  |
| 2       | ADR đã Approved                    | Quyết định kỹ thuật có hiệu lực                          |
| 3       | Tài liệu SDLC Approved             | Nguồn triển khai theo từng lĩnh vực                      |
| 4       | Task đã được duyệt                 | Phạm vi công việc cụ thể                                 |
| 5       | Draft / ghi chú / prompt           | Chỉ dùng tham khảo, không dùng làm nguồn code chính thức |

### 5.2. Điều kiện được phép code

Lập trình viên chỉ được code một chức năng chính thức khi có đủ:

1. Yêu cầu liên quan trong `01-SRS` hoặc task được dẫn về `01-SRS`.
2. Thiết kế liên quan trong `02-HLD` hoặc `03-LLD` nếu chức năng có logic nghiệp vụ đáng kể.
3. Database design trong `04-Database Design` nếu có thay đổi schema hoặc transaction.
4. API contract trong `05-API Specification` nếu có giao tiếp client/server hoặc service/service.
5. Security/permission rule trong `07-Security & Permission Design` nếu có phân quyền, dữ liệu nhạy cảm hoặc thao tác tài chính.
6. Acceptance criteria hoặc test case trong `08-Test Plan`.
7. Task triển khai trong `11-Project Task Breakdown`.

Nếu thiếu một trong các phần trên, lập trình viên phải đánh dấu `BLOCKED` hoặc tạo `OPEN QUESTION`, không tự quyết định nghiệp vụ.

### 5.3. Quy chuẩn triển khai bắt buộc

| Nhóm            | Quy định cho lập trình viên                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement     | Mỗi đoạn code nghiệp vụ phải dẫn được về một yêu cầu hoặc task trong tài liệu SDLC.                                                           |
| Backend         | Không đặt business logic chính trong controller/route handler. Phải tách validation, use case/service, repository/infrastructure khi phù hợp. |
| Frontend        | Không chỉ kiểm rule ở UI. UI kiểm để tăng trải nghiệm; backend vẫn phải kiểm lại.                                                             |
| API             | Không thay đổi request/response/error contract nếu chưa cập nhật `05-API Specification`.                                                      |
| Database        | Không tạo/sửa bảng, cột, index, constraint nếu chưa cập nhật `04-Database Design` và migration.                                               |
| Security        | Mọi thao tác có quyền phải kiểm role và ownership ở backend.                                                                                  |
| Booking/Payment | Luồng giữ ghế, đặt vé, thanh toán, hoàn tiền, check-in phải có transaction/idempotency/state validation/audit phù hợp.                        |
| Logging         | Không log plaintext dữ liệu nhạy cảm như token, mật khẩu, OTP, thông tin thanh toán nhạy cảm.                                                 |
| Error handling  | Lỗi nghiệp vụ phải có error code ổn định và message phù hợp cho client.                                                                       |
| Testing         | Chức năng nghiệp vụ quan trọng phải có test case hoặc checklist nghiệm thu rõ.                                                                |

### 5.4. Definition of Done cho code

Một task code chỉ được xem là xong khi đạt đủ:

1. Có nguồn yêu cầu hoặc task ID rõ ràng.
2. Code đúng API, database, security và design đã duyệt.
3. Không phá vỡ contract hiện có nếu không có migration hoặc breaking-change note.
4. Có unit/integration/E2E test, hoặc lý do rõ ràng nếu chưa thể tự động hóa.
5. Đã xử lý loading/error/empty/permission state nếu có UI.
6. Đã xử lý audit và logging đối với thao tác nhạy cảm.
7. Đã cập nhật tài liệu liên quan nếu implementation làm thay đổi thiết kế, API, DB hoặc rule.
8. Pull request có mô tả, phạm vi, test evidence và checklist review.

### 5.5. Quy tắc dừng triển khai

Lập trình viên BẮT BUỘC dừng hoặc yêu cầu làm rõ nếu gặp một trong các trường hợp:

1. Yêu cầu mâu thuẫn giữa SRS, HLD, LLD, API hoặc Database Design.
2. Yêu cầu chưa có tiêu chí nghiệm thu nhưng ảnh hưởng nghiệp vụ chính.
3. Luồng liên quan tiền, vé, ghế, hoàn tiền hoặc phân quyền chưa có state/transaction/audit rõ.
4. API hoặc database cần thay đổi nhưng chưa có tài liệu tương ứng.
5. AI agent sinh nội dung có vẻ suy diễn nghiệp vụ nhưng không có nguồn rõ ràng.

---

## 6. Phụ lục

### 6.1. Module nghiệp vụ trọng yếu

| Module                       | Ghi chú kiểm soát                                           |
| ---------------------------- | ----------------------------------------------------------- |
| Identity & Access Management | Auth, role, session, password, OTP, token                   |
| User Portal                  | Tìm kiếm, đặt vé, quản lý vé, hủy vé, đánh giá              |
| Operator Portal              | Quản lý nhà xe, xe, tuyến, chuyến, đơn vé, tài xế           |
| Driver App/Portal            | Lịch chuyến, danh sách khách, check-in, trạng thái chuyến   |
| Admin Portal                 | Quản trị nền tảng, cấu hình, thanh toán, khiếu nại, báo cáo |
| Booking Service              | Giữ ghế, booking, ticket, trạng thái vé                     |
| Payment Service              | Cổng thanh toán, callback, đối soát, hoàn tiền              |
| Notification Service         | Email, SMS, push, in-app notification                       |
| Reporting Service            | Dashboard, báo cáo, xuất dữ liệu                            |
| Audit Service                | Audit log, truy vết thao tác nhạy cảm                       |
| Support Service              | Ticket hỗ trợ, khiếu nại, phản hồi                          |

### 6.2. Rủi ro kỹ thuật phải kiểm soát trong code

| Rủi ro                              | Mức độ     | Chuẩn kiểm soát bắt buộc                                            |
| ----------------------------------- | ---------- | ------------------------------------------------------------------- |
| Bán trùng ghế                       | Rất cao    | Transaction, lock, unique constraint, idempotency, state validation |
| Callback thanh toán trễ hoặc trùng  | Cao        | Verify signature, idempotency, reconciliation job, audit log        |
| Hoàn tiền trùng                     | Cao        | Refund state machine, idempotency key, audit log                    |
| Lộ dữ liệu hành khách               | Rất cao    | RBAC, ownership check, data masking, log hygiene                    |
| Nhà xe truy cập dữ liệu nhà xe khác | Rất cao    | Backend ownership check                                             |
| Tài xế xem sai chuyến               | Cao        | Assignment check ở backend                                          |
| Chuyến thay đổi sau khi đã bán vé   | Cao        | Notification, audit, policy xử lý ghế/vé                            |
| Báo cáo làm chậm hệ thống chính     | Trung bình | Async reporting, cache, read model hoặc reporting database nếu cần  |

### 6.3. Kết luận chuẩn cho code

Một pull request chỉ được xem là đạt chuẩn khi chứng minh được hai điều:

1. **Đúng chuẩn nền và tài liệu SDLC**: code phù hợp với SRS, HLD, LLD, API, Database, Security đã Approved.
2. **Đúng kiểm chứng**: có test case, acceptance criteria hoặc checklist review xác minh được.

Nếu thiếu một trong hai điều trên, chưa được xem là sẵn sàng merge vào main.
