# 01. Software Requirements Specification - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                                                        |
| ------------ | -------------------------------------------------------------- |
| Tên tài liệu | Software Requirements Specification - Hệ thống đặt vé xe khách |
| Mã tài liệu  | 01-srs-he-thong-dat-ve-xe-khach                                |
| Dự án        | Hệ thống đặt vé xe khách                                       |
| Phiên bản    | v1.0                                                           |
| Trạng thái   | Writing                                                        |
| Người viết   | Team                                                           |
| Người duyệt  | Nguyễn Hồng Khanh                                              |
| Ngày tạo     | 27/04/2026                                                     |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật    | Nội dung thay đổi                               |
| --------- | ---------- | ----------------- | ----------------------------------------------- |
| v1.0      | 27/04/2026 | Nguyễn Hồng Khanh | Tạo phiên bản đầu tiên                          |
| v1.1      | 27/04/2026 | Nguyễn Hồng Khanh | Hiệu chỉnh mục lục, thêm phần tài liệu đầu tiên |

### 1.3. Mục lục

1. [Thông tin tài liệu](#1-thông-tin-tài-liệu)
   - [1.1. Metadata](#11-metadata)
   - [1.2. Lịch sử thay đổi](#12-lịch-sử-thay-đổi)
   - [1.3. Mục lục](#13-mục-lục)
2. [Giới thiệu](#2-giới-thiệu)
   - [2.1. Mục đích tài liệu](#21-mục-đích-tài-liệu)
   - [2.2. Đối tượng đọc tài liệu](#22-đối-tượng-đọc-tài-liệu)
   - [2.3. Phạm vi tài liệu](#23-phạm-vi-tài-liệu)
   - [2.4. Tài liệu tham chiếu](#24-tài-liệu-tham-chiếu)
3. [Mục tiêu hệ thống](#3-mục-tiêu-hệ-thống)
4. [Phạm vi hệ thống](#4-phạm-vi-hệ-thống)
   - [4.1. Trong phạm vi](#41-trong-phạm-vi)
   - [4.2. Ngoài phạm vi](#42-ngoài-phạm-vi)
5. [Stakeholders và Actors](#5-stakeholders-và-actors)
   - [5.1. Stakeholders](#51-stakeholders)
   - [5.2. Actors chính](#52-actors-chính)
     - [5.2.1. Người dùng](#521-người-dùng)
     - [5.2.2. Nhà xe](#522-nhà-xe)
     - [5.2.3. Tài xế](#523-tài-xế)
     - [5.2.4. Admin toàn hệ thống](#524-admin-toàn-hệ-thống)
6. [Tổng quan hệ thống](#6-tổng-quan-hệ-thống)
   - [6.1. Mô tả tổng quan](#61-mô-tả-tổng-quan)
   - [6.2. Các phân hệ chính](#62-các-phân-hệ-chính)
   - [6.3. Luồng hoạt động tổng quan](#63-luồng-hoạt-động-tổng-quan)
7. [Giả định, ràng buộc và phụ thuộc](#7-giả-định-ràng-buộc-và-phụ-thuộc)
   - [7.1. Giả định](#71-giả-định)
   - [7.2. Ràng buộc](#72-ràng-buộc)
   - [7.3. Phụ thuộc](#73-phụ-thuộc)
8. [Yêu cầu chức năng - Functional Requirements](#8-yêu-cầu-chức-năng---functional-requirements)
   - [8.1. Authentication & Account](#81-authentication--account)
   - [8.2. Người dùng](#82-người-dùng)
   - [8.3. Nhà xe](#83-nhà-xe)
   - [8.4. Tài xế](#84-tài-xế)
   - [8.5. Admin toàn hệ thống](#85-admin-toàn-hệ-thống)
   - [8.6. Tìm kiếm chuyến xe](#86-tìm-kiếm-chuyến-xe)
   - [8.7. Đặt vé](#87-đặt-vé)
   - [8.8. Thanh toán](#88-thanh-toán)
   - [8.9. Hủy vé và hoàn tiền](#89-hủy-vé-và-hoàn-tiền)
   - [8.10. Thông báo](#810-thông-báo)
   - [8.11. Báo cáo](#811-báo-cáo)
9. [Yêu cầu phi chức năng - Non-Functional Requirements](#9-yêu-cầu-phi-chức-năng---non-functional-requirements)
   - [9.1. Hiệu năng](#91-hiệu-năng)
   - [9.2. Bảo mật](#92-bảo-mật)
   - [9.3. Phân quyền](#93-phân-quyền)
   - [9.4. Tính sẵn sàng](#94-tính-sẵn-sàng)
   - [9.5. Khả năng mở rộng](#95-khả-năng-mở-rộng)
   - [9.6. Khả năng sử dụng](#96-khả-năng-sử-dụng)
   - [9.7. Khả năng bảo trì](#97-khả-năng-bảo-trì)
   - [9.8. Logging và Monitoring](#98-logging-và-monitoring)
   - [9.9. Backup và Recovery](#99-backup-và-recovery)
10. [Quy tắc nghiệp vụ tổng quan](#10-quy-tắc-nghiệp-vụ-tổng-quan)
11. [Use Case tổng quan](#11-use-case-tổng-quan)
12. [Yêu cầu dữ liệu mức khái niệm](#12-yêu-cầu-dữ-liệu-mức-khái-niệm)
13. [Yêu cầu giao diện và tích hợp](#13-yêu-cầu-giao-diện-và-tích-hợp)

- [13.1. Giao diện người dùng](#131-giao-diện-người-dùng)
- [13.2. Giao diện nhà xe](#132-giao-diện-nhà-xe)
- [13.3. Giao diện tài xế](#133-giao-diện-tài-xế)
- [13.4. Giao diện admin](#134-giao-diện-admin)
- [13.5. Tích hợp bên ngoài](#135-tích-hợp-bên-ngoài)

14. [Phân quyền tổng quan](#14-phân-quyền-tổng-quan)
15. [Tiêu chí nghiệm thu tổng quan](#15-tiêu-chí-nghiệm-thu-tổng-quan)
16. [Rủi ro và vấn đề cần làm rõ](#16-rủi-ro-và-vấn-đề-cần-làm-rõ)
17. [Phụ lục](#17-phụ-lục)

- [17.1. Thuật ngữ](#171-thuật-ngữ)
- [17.2. Tài liệu liên quan](#172-tài-liệu-liên-quan)

---

## 2. Giới thiệu

### 2.1. Mục đích tài liệu

### 2.2. Đối tượng đọc tài liệu

### 2.3. Phạm vi tài liệu

### 2.4. Tài liệu tham chiếu

---

## 3. Mục tiêu hệ thống

- Số hóa quy trình đặt vé xe khách từ tìm kiếm, đặt chỗ, thanh toán đến check-in.
- Giảm tình trạng đặt trùng ghế, sai thông tin chuyến, sai thông tin hành khách.
- Tăng khả năng quản lý vận hành cho nhà xe.
- Cho phép admin kiểm soát chất lượng dịch vụ trên toàn nền tảng.
- Cung cấp trải nghiệm đặt vé nhanh, minh bạch, an toàn cho người dùng.
- Cung cấp dữ liệu báo cáo doanh thu, tỷ lệ lấp đầy ghế, hiệu suất tuyến và chất lượng dịch vụ.

---

## 4. Phạm vi hệ thống

### 4.1 Trong phạm vi

- Đăng ký, đăng nhập, xác thực và phân quyền.
- Tìm kiếm chuyến xe theo điểm đi, điểm đến, ngày đi, số lượng khách.
- Xem chi tiết chuyến xe, nhà xe, loại xe, tiện ích, điểm đón/trả, chính sách hủy vé.
- Chọn ghế, giữ ghế tạm thời, đặt vé.
- Thanh toán trực tuyến hoặc thanh toán theo cấu hình của nhà xe/nền tảng.
- Xuất vé điện tử với mã vé/QR code.
- Quản lý lịch sử đặt vé, hủy vé, hoàn tiền.
- Đánh giá chuyến đi/nhà xe.
- Nhà xe quản lý tuyến, chuyến, xe, tài xế, giá vé, khuyến mãi, đơn vé.
- Tài xế xem chuyến được phân công, danh sách hành khách, xác nhận check-in.
- Admin quản lý người dùng, nhà xe, tài xế, nội dung, thanh toán, khiếu nại, báo cáo.
- Thông báo qua email, SMS, push notification hoặc in-app notification.

### 4.2 Ngoài phạm vi phiên bản đầu

- Tối ưu lộ trình bằng AI theo thời gian thực.
- Bán vé liên tuyến phức tạp có trung chuyển nhiều chặng.
- Quản lý bảo dưỡng xe chuyên sâu.
- Quản lý lương, chấm công, hợp đồng lao động của tài xế.
- Tích hợp thiết bị IoT trên xe ở mức phần cứng.

---

## 5. Stakeholders và Actors

### 5.1. Stakeholders

### 5.2. Actors chính

#### 5.2.1. Người dùng

#### 5.2.2. Nhà xe

#### 5.2.3. Tài xế

#### 5.2.4. Admin toàn hệ thống

---

## 6. Tổng quan hệ thống

### 6.1. Mô tả tổng quan

### 6.2. Các phân hệ chính

### 6.3. Luồng hoạt động tổng quan

---

## 7. Giả định, ràng buộc và phụ thuộc

### 7.1. Giả định

### 7.2. Ràng buộc

### 7.3. Phụ thuộc

---

## 8. Yêu cầu chức năng - Functional Requirements

### 8.1. Authentication & Account

### 8.2. Người dùng

### 8.3. Nhà xe

### 8.4. Tài xế

### 8.5. Admin toàn hệ thống

### 8.6. Tìm kiếm chuyến xe

### 8.7. Đặt vé

### 8.8. Thanh toán

### 8.9. Hủy vé và hoàn tiền

### 8.10. Thông báo

### 8.11. Báo cáo

---

## 9. Yêu cầu phi chức năng - Non-Functional Requirements

### 9.1. Hiệu năng

### 9.2. Bảo mật

### 9.3. Phân quyền

### 9.4. Tính sẵn sàng

### 9.5. Khả năng mở rộng

### 9.6. Khả năng sử dụng

### 9.7. Khả năng bảo trì

### 9.8. Logging và Monitoring

### 9.9. Backup và Recovery

---

## 10. Quy tắc nghiệp vụ tổng quan

---

## 11. Use Case tổng quan

---

## 12. Yêu cầu dữ liệu mức khái niệm

---

## 13. Yêu cầu giao diện và tích hợp

### 13.1. Giao diện người dùng

### 13.2. Giao diện nhà xe

### 13.3. Giao diện tài xế

### 13.4. Giao diện admin

### 13.5. Tích hợp bên ngoài

---

## 14. Phân quyền tổng quan

---

## 15. Tiêu chí nghiệm thu tổng quan

---

## 16. Rủi ro và vấn đề cần làm rõ

---

## 17. Phụ lục

### 17.1. Thuật ngữ

### 17.2. Tài liệu liên quan
