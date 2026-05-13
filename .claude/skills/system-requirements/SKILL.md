---
name: system-requirements
description: Load when implementing any feature of the bus ticket marketplace, checking business rules, understanding actor permissions (User/Guest/Operator/Employee/Admin), verifying state models (Trip/Booking/Payment/Ticket), tracing a task to its FR/UC/BR/AC source, or when terms like 'business rule', 'use case', 'acceptance criteria', or actor behavior appear in the task.
---

# Software Requirements Specification — Index

**Source of truth:** `doc/SDLC/01-srs-he-thong-dat-ve-xe-khach.md` (v1.20, Approved)

## When to read what

| Task | Đọc section này |
|------|----------------|
| Hiểu định vị sản phẩm và 3 lớp dịch vụ | §4 Tổng quan hệ thống |
| Xác định actor và quyền cơ bản | §7 Actor và vai trò |
| Kiểm tra functional requirement cụ thể | §10 Functional Requirements (FR-IAM/MKT/BTP/OPR/OPS/EMP/ADM/NSR/DSP) |
| Hiểu use case chi tiết cho luồng cụ thể | §13 Use Case chi tiết (UC-01..UC-35) |
| Xác nhận business rule | §14 Business Rules (BR-01..BR-64) |
| Kiểm tra ma trận phân quyền | §15 Phân quyền chức năng |
| Hiểu luồng end-to-end | §16 Luồng nghiệp vụ chính |
| State machine của entity quan trọng | §17 Trạng thái dữ liệu quan trọng |
| Acceptance criteria nghiệm thu | §19 Tiêu chí nghiệm thu (AC-01..AC-35) |
| Quyết định đã chốt (OQ/MQ) | §21 Quyết định đã chốt |

## Top-level catalog

**Actors:**
- `User` — hành khách đăng ký, dùng web và mobile
- `Guest` — hành khách chưa đăng ký, web-only; có thể hold seat / book / pay / lookup ticket
- `Operator` — nhà xe: tạo trip, vehicle, fare, quản lý employee
- `Employee` — nhân viên nhà xe: `TICKET_STAFF`, `DRIVER`, `SUPPORT_STAFF`
- `Admin` — quản trị platform: KYC, catalog, policy, dispute, payout
- `System` — job tự động: SeatHold expire, payment reconcile, payout trigger

**FR groups:**
`FR-IAM-*` (auth/session) · `FR-MKT-*` (marketplace) · `FR-BTP-*` (booking/ticket/payment) · `FR-OPR-*` (operator) · `FR-OPS-*` (operations) · `FR-EMP-*` (employee) · `FR-PROM-*` (promotion) · `FR-ADM-*` (admin) · `FR-NSR-*` (notification/support/review) · `FR-DSP-*` (dispute)

**V1 anchors — không được mở lại:**

| Topic | Anchor | Nguồn |
|-------|--------|-------|
| Checkout model | Guest web-only; Mobile = User-only | `HLD v1.13, SRS §6` |
| Payment | VNPay Sandbox; adapter boundary bắt buộc | `OQ-05, BR-63` |
| SeatHold | TTL 10 phút, platform-wide | `OQ-06, BR-02` |
| Checkout flow | Pay-first; PENDING_CONFIRMATION giữ enum nhưng không dùng public checkout | `OQ-07, BR-04` |
| Payout | T+3, admin manual confirm, direct bank transfer | `OQ-16, BR-32..33` |
| Commission | Default 5%, admin override | `OQ-18, BR-31` |

## Invariants (luôn áp dụng)

- Platform không sở hữu xe, không thuê tài xế, không vận hành chuyến trực tiếp. `SRS §4, MQ-05`
- Mỗi Booking phải snapshot fare tại thời điểm mua. `SRS §14 BR-40..41, OQ-08`
- Mỗi Booking phải snapshot refund policy tại thời điểm tạo. `SRS §14 BR-07, OQ-13`
- Guest phải xác minh email/phone trước thao tác nhạy cảm (lookup, cancel). `SRS §13 UC-35`
- SeatHold chỉ 1 ghế mỗi lần; User tối đa 6 ghế/booking. `SRS §14 BR-02..03`
- Admin là arbiter cuối cùng trong dispute. `SRS MQ-03, BR-51`
- Audit log là append-only. `SRS BR-58..59, OQ-14`

## Cross-references

- Skills liên quan: `low-level-design` (implement UC), `security-auth` (BR §15 permissions), `database-design` (state enum → collection), `api-contract` (endpoint per UC)
- `doc/context/DOMAIN-MAP.md §6` — state enum alignment cho tất cả entity
- `doc/context/GLOSSARY.md` — thuật ngữ nhất quán bắt buộc
