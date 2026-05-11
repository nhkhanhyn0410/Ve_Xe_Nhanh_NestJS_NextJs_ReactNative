# 09. Deployment & Operation Standard - Hệ thống đặt vé xe khách

## 1. Thông tin tài liệu

### 1.1. Metadata

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| Tên tài liệu | Deployment & Operation Standard  |
| Mã tài liệu  | 09-deployment-operation-standard |
| Dự án        | Hệ thống đặt vé xe khách         |
| Phiên bản    | v0.1                             |
| Trạng thái   | Draft                            |
| Người viết   | AI Agent                         |
| Người duyệt  | Nguyễn Hồng Khanh                |
| Ngày tạo     | 11/05/2026                       |

### 1.2. Lịch sử thay đổi

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                         |
| --------- | ---------- | -------------- | ----------------------------------------- |
| v0.1      | 11/05/2026 | AI Agent       | Tạo bản nháp Deployment & Operation Standard |

---

## 2. Mục lục

1. Thông tin tài liệu
2. Mục lục
3. Giới thiệu
4. Môi trường
5. Build và release
6. Configuration và secret
7. Database và migration
8. Observability
9. Backup và restore
10. Rollback và incident
11. Operation checklist
12. Open Questions / TBD

---

## 3. Giới thiệu

Tài liệu này quy định triển khai và vận hành hệ thống từ local, staging đến production. Đây là bản nháp, chưa thay thế runbook production chính thức.

---

## 4. Môi trường

| Môi trường | Mục đích | Yêu cầu tối thiểu |
| ---------- | -------- | ----------------- |
| Local | Dev và test thủ công | Docker Compose, MongoDB, Redis, OSRM local |
| CI | Typecheck, lint, test tự động | Cài npm workspace, cache dependency, chạy test |
| Staging | E2E, UAT, provider sandbox | HTTPS, env riêng, seed data kiểm thử |
| Production | Vận hành thật | HTTPS, backup, monitoring, alert, secret management |

---

## 5. Build và release

| Thành phần | Build command nháp | Ghi chú |
| ---------- | ------------------ | ------- |
| Backend | `npm run build --workspace apps/backend` | Cần xác nhận script thực tế |
| Frontend | `npm run build --workspace apps/frontend` | Next.js build |
| Mobile | Expo/EAS build TBD | Cần quy trình release mobile riêng |
| Packages | Build theo workspace nếu có script | Shared types/api client |

### 5.1. Release checklist

| Bước | Kiểm tra |
| ---- | -------- |
| REL-01 | SRS/HLD/API/DB/Security liên quan đã Review/Approved theo phạm vi release |
| REL-02 | Typecheck, lint, unit/integration/E2E critical pass |
| REL-03 | Migration đã review và có rollback plan |
| REL-04 | Env var/secret đã cấu hình đúng môi trường |
| REL-05 | Backup trước deploy production |
| REL-06 | Smoke test sau deploy |

---

## 6. Configuration và secret

| Nhóm config | Ví dụ | Rule |
| ----------- | ----- | ---- |
| Database | MongoDB URI | Không commit secret thật |
| Redis/Queue | Redis host/password | Env theo môi trường |
| JWT/Auth | JWT secret, refresh secret | Rotate policy TBD |
| Payment | Provider key, webhook secret | Chỉ staging/production secret store |
| Notification | SMS/email/push key | Không log secret |
| OSRM | Endpoint | Có fallback/error handling |
| Object storage | Bucket/key/secret | TBD provider |

---

## 7. Database và migration

| Quy định | Nội dung |
| -------- | -------- |
| Migration review | Schema/index/enum thay đổi phải review cùng DB Design |
| Backward compatibility | Không deploy API dùng field mới trước khi migration sẵn sàng |
| Seed data | Catalog/admin seed cần tách môi trường |
| Rollback | Migration phá vỡ dữ liệu cần rollback hoặc forward-fix plan |
| Backup | Backup trước migration production |

---

## 8. Observability

| Nhóm | Chỉ số/log cần theo dõi |
| ---- | ----------------------- |
| API | Latency, error rate, status code, request id |
| Auth | Login fail, lock, suspicious activity |
| Booking | SeatHold success/fail, hold expiry, booking conversion |
| Payment | Callback success/fail, duplicate callback, reconciling count |
| Refund/Payout | Refund failed, payout failed, ledger mismatch |
| Queue | Job count, retry count, dead job, processing latency |
| Notification | Delivery success/fail/retry per channel |
| DB | Query latency, index usage, connection pool |
| Redis | Memory, eviction, connection, lock failure |

---

## 9. Backup và restore

| Dữ liệu | Chính sách nháp |
| ------- | --------------- |
| MongoDB | Backup định kỳ, kiểm restore định kỳ trước production |
| KYC/attachment/report file | Backup theo object storage provider TBD |
| Env/secret | Không backup trong repo; quản lý bằng secret manager TBD |
| Audit log | Ưu tiên retention dài, archive policy TBD |

---

## 10. Rollback và incident

### 10.1. Rollback

| Tình huống | Cách xử lý nháp |
| ---------- | --------------- |
| Backend deploy lỗi | Rollback image/version trước, giữ migration nếu backward compatible |
| Frontend lỗi | Rollback build/static release trước |
| Migration lỗi | Restore hoặc forward-fix theo migration plan |
| Payment callback lỗi | Bật maintenance nếu cần, chạy reconciliation job |
| Notification lỗi | Queue retry, không chặn ticket lookup |

### 10.2. Incident priority

| Mức | Ví dụ |
| --- | ----- |
| P0 | Bán trùng ghế, ghi nhận tiền sai, lộ dữ liệu cá nhân lớn |
| P1 | Payment callback lỗi diện rộng, không check-in được diện rộng |
| P2 | Notification lỗi, report chậm, search chậm cục bộ |
| P3 | Lỗi UI nhỏ, dữ liệu phụ không cập nhật |

---

## 11. Operation checklist

| Checklist | Tần suất |
| --------- | -------- |
| Kiểm trạng thái payment/reconciliation | Hằng ngày |
| Kiểm dead jobs queue | Hằng ngày |
| Kiểm backup success | Hằng ngày |
| Kiểm audit/security anomaly | Hằng tuần hoặc theo alert |
| Kiểm restore drill | Định kỳ TBD |
| Kiểm dependency/security update | Định kỳ TBD |

---

## 12. Open Questions / TBD

| ID | Câu hỏi | Tác động |
| -- | ------- | -------- |
| OPS-OQ-01 | Production deploy target là VPS, Docker host, cloud container hay platform khác? | Deployment plan |
| OPS-OQ-02 | Secret manager dùng gì? | Security/operation |
| OPS-OQ-03 | Monitoring stack dùng gì? | Alert/runbook |
| OPS-OQ-04 | Backup/restore RPO/RTO mục tiêu là bao nhiêu? | DR plan |
| OPS-OQ-05 | Mobile release quy trình App Store/Play Store ra sao? | Release plan |
