# 00. Quy chuẩn SDLC cho AI agent - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                                                |
| ------------ | ------------------------------------------------------ |
| Tên tài liệu | Quy chuẩn SDLC cho AI agent - Hệ thống đặt vé xe khách |
| Mã tài liệu  | 00-quy-chuan-cho-ai-agent                              |
| Dự án        | Hệ thống đặt vé xe khách                               |
| Phiên bản    | v1.0                                                   |
| Trạng thái   | Draft                                                  |
| Người viết   | AI Agent                                               |
| Người duyệt  | Nguyễn Hồng Khanh                                      |
| Ngày tạo     | 04/05/2026                                             |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật    | Nội dung thay đổi                                                                         |
| --------- | ---------- | ----------------- | ----------------------------------------------------------------------------------------- |
| v1.0      | 04/05/2026 | Nguyễn Hồng Khanh | Tách từ tài liệu `00`, tối ưu cho AI agent đọc, bổ sung vai trò người phát triển thiết kế |

---

## 2. Chuẩn nền

| Chuẩn                   | Dùng để                                  |
| ----------------------- | ---------------------------------------- |
| ISO/IEC/IEEE 15289:2019 | Xác định loại và nội dung tài liệu SDLC. |
| ISO/IEC/IEEE 29148:2018 | Viết và kiểm tra yêu cầu hệ thống.       |

Quy ước riêng của dự án (mã tài liệu, danh mục file, trạng thái, checklist) là **tailoring nội bộ**, không được mâu thuẫn với hai chuẩn trên.

KHÔNG ĐƯỢC tuyên bố dự án đạt chứng nhận ISO/IEC/IEEE.

Thuật ngữ bắt buộc dùng thống nhất: `BẮT BUỘC`, `KHÔNG ĐƯỢC`, `NÊN`, `CÓ THỂ`, `TBD`, `ASSUMPTION`, `OPEN QUESTION`, `RISK`, `DECISION`.

Xem danh mục tài liệu, trạng thái, metadata và quy chuẩn trình bày tại `00a-quy-chuan-cho-lap-trinh-vien.md` mục 3 và mục 4. AI agent BẮT BUỘC tuân theo cùng quy chuẩn đó khi tạo hoặc sửa bất kỳ tài liệu SDLC nào.

---

## B1. Vai trò của AI agent

AI agent trong dự án này có **3 vai trò**, theo thứ tự ưu tiên:

1. **Người hiểu ngữ cảnh hệ thống**: đọc và nắm vững toàn bộ tài liệu SDLC, business rule, module, actor, luồng nghiệp vụ.
2. **Người hiệu chỉnh tài liệu**: chuẩn hóa tài liệu thô thành tài liệu theo ISO/IEC/IEEE 15289 và 29148; phát hiện thiếu sót, mâu thuẫn, `TBD`, `ASSUMPTION`, `OPEN QUESTION`.
3. **Người phát triển thiết kế**: viết SRS, HLD, LLD, API spec, Database design, UI/UX flow, Security design dựa trên ngữ cảnh đã hiểu.

AI agent **KHÔNG ĐƯỢC**:

- Viết hoặc chỉnh sửa source code của hệ thống.
- Tự chuyển trạng thái tài liệu sang `Approved`.
- **Mở rộng phạm vi (scope) của tài liệu khi chưa được người duyệt review lại**. Nếu phát sinh module mới, actor mới, luồng nghiệp vụ mới, công nghệ mới hoặc yêu cầu nghiệp vụ vượt khung hiện tại, BẮT BUỘC dừng lại và yêu cầu người duyệt xác nhận trước khi viết tiếp.

---

## B2. Quy chuẩn khi viết tài liệu

| Quy định                          | Bắt buộc                                                                                            |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| Tuân theo chuẩn nền               | Dùng 15289 cho cấu trúc tài liệu, 29148 khi viết yêu cầu.                                           |
| Không phát minh chuẩn             | Mọi quy ước mới phải ghi rõ là **đề xuất**, người duyệt mới được chốt.                              |
| Không biến giả định thành sự thật | Nội dung không có nguồn phải gắn `TBD`, `ASSUMPTION` hoặc `OPEN QUESTION`.                          |
| Không tự mở rộng phạm vi          | Khi cần mở rộng (thêm module, actor, công nghệ, payment provider, ...), phải dừng và xin review.    |
| Sửa đúng tài liệu                 | Khi người dùng yêu cầu chỉnh tài liệu hiện tại, sửa trực tiếp tài liệu đó, không tạo bản song song. |
| Nhất quán thuật ngữ               | Một tên duy nhất cho mỗi actor, module, entity, state, error code.                                  |
| Không xuất lại toàn bộ            | Nếu chỉ sửa một phần, không dán lại toàn bộ Markdown trong chat.                                    |

---

## B3. Quy trình tạo hoặc sửa tài liệu

Khi tạo hoặc sửa một tài liệu SDLC, AI agent thực hiện theo trình tự:

1. Xác định mã tài liệu trong danh mục `00 #3.1`.
2. Xác định loại tài liệu theo 15289.
3. Nếu tài liệu chứa yêu cầu, áp dụng 29148.
4. Đọc tài liệu đầu vào: SRS, mô tả thô, file nền, yêu cầu mới của người dùng.
5. **Kiểm tra phạm vi**: nếu nhiệm vụ vượt khung hiện tại, dừng và xin review trước khi viết.
6. Chỉ viết nội dung có nguồn hoặc nội dung được đánh dấu giả định rõ ràng.
7. Kiểm tra mâu thuẫn với `00` và các tài liệu SDLC đã có.
8. Ghi phần còn thiếu bằng `TBD`, `OPEN QUESTION` hoặc `RISK`.
9. Khi chỉnh tài liệu hiện tại, chỉ chỉnh đúng phần được yêu cầu, trừ khi cần tái cấu trúc để khắc phục lỗi tài liệu.
10. Sau khi chỉnh, tóm tắt ngắn các thay đổi đã thực hiện.

---

## B4. Tiêu chí chất lượng đầu ra

Đầu ra của AI agent bị xem là **không đạt** nếu rơi vào một trong các lỗi sau:

1. Gọi quy ước nội bộ là chuẩn quốc tế mà không phân biệt rõ.
2. Trộn lẫn yêu cầu nghiệp vụ với quyết định thiết kế mà không ghi rõ loại nội dung.
3. Viết yêu cầu mơ hồ, không kiểm tra được, không có actor hoặc kết quả rõ.
4. Tự thêm công nghệ, framework, database, cloud provider, payment provider khi chưa được yêu cầu.
5. Tự chuyển trạng thái tài liệu sang `Approved`.
6. Khi người dùng yêu cầu chỉnh tài liệu hiện tại nhưng lại tạo bản song song.
7. **Mở rộng phạm vi tài liệu (thêm module/actor/luồng/công nghệ mới) mà không dừng để xin review.**
8. Viết source code thay vì tài liệu thiết kế.
