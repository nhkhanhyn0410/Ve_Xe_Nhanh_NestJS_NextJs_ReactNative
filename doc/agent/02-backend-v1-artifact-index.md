# Backend V1 Artifact Index

Danh mục artifact cần tạo khi bắt đầu Backend V1. Artifact là sản phẩm derived từ tài liệu SDLC, không thay thế tài liệu nguồn.

## 1. Quy tắc

- Source chính: `05-api-specification`, `04-database-design`, `07-security-permission-design`, `08-test-plan-acceptance-criteria`, `09-deployment-operation-standard`, `10-architecture-decision-record`, `11-project-task-breakdown`.
- Artifact phải có owner, source trace, cách validate và nơi dùng.
- Nếu artifact mâu thuẫn tài liệu Approved, sửa tài liệu hoặc ghi OP trước khi code tiếp.

## 2. Artifact bắt buộc trước backend core

| ID | Artifact | Source | Owner | Dùng cho | Validate |
| -- | -------- | ------ | ----- | -------- | -------- |
| ART-001 | OpenAPI 3.1 derived contract | API §6..§25 | BE/QA | FE/Mobile/API tests/SDK | Contract test khớp API Spec. |
| ART-002 | Shared enum manifest | SRS §17, API §25.1 | BE | BE/FE/Mobile state mapping | Enum không lệch SRS. |
| ART-003 | Error code catalog | API §8.5, Security §18 | BE/QA | API error handling | P0 flow có stable error. |
| ART-004 | Permission matrix manifest | Security §8 | BE/Security | Guards/tests/admin UI | Negative tests pass. |
| ART-005 | DB migration/index manifest | DB §11..§19 | BE/DB | Migration/CI/staging | Replica set/index check pass. |
| ART-006 | Seed package V1 | DB §19.2, Test §6.2 | BE/QA/Admin Ops | Local/CI/staging/UAT | Checksum/version/review metadata. |
| ART-007 | Provider mock contract | API §20, Test §11.3 | BE/QA | VNPay/email/storage/routing tests | Success/fail/duplicate/mismatch covered. |
| ART-008 | Job catalog | HLD §12, DB §17 | BE/QA | Worker/scheduler tests | Lock/checkpoint/retry/manual review test. |
| ART-009 | Smoke checklist | 09 §16.3 | QA/DevOps | Post-deploy/staging | Smoke evidence saved. |
| ART-010 | Critical evidence checklist | Test §15.2 | QA | Release gate | Evidence complete for P0. |

## 3. Artifact theo milestone

| Milestone | Artifact cần sẵn |
| --------- | ---------------- |
| M0 | ART-001..010 có owner và location dự kiến. |
| M1 | ART-005, ART-006, ART-008 đủ để chạy foundation/integration. |
| M2 | ART-004, ART-003 đủ để test IAM/Security. |
| M3 | ART-006 mở rộng Operator/Catalog/Transport fixture. |
| M4 | ART-005/006/008 có SeatHold/Booking fixture và concurrency cases. |
| M5 | ART-007 có VNPay success/fail/duplicate/wrong signature/amount mismatch. |
| M6 | ART-006 có Employee assignment/offline/support fixtures. |
| M7 | ART-006/008/010 có refund/payout/dispute/report/export fixtures. |
| M8 | ART-009/010 complete cho staging/release candidate. |

## 4. Output location đề xuất

| Artifact | Location đề xuất |
| -------- | ---------------- |
| OpenAPI | `docs` hoặc `packages` area do reviewer chốt khi code. |
| Shared enum/error | Shared package hoặc generated artifact do ADR-010/013 chốt. |
| DB migration/index manifest | Backend migration folder hoặc docs artifact folder do reviewer chốt. |
| Seed package | Backend seed folder, có metadata/checksum. |
| Provider mock | Backend test/support folder, không dùng secret thật. |
| Smoke/evidence checklist | QA/operation artifact theo 09/08. |

Không tạo location cụ thể trong source ở bước tài liệu này vì AGENT cấm chỉnh source under `apps/` hoặc `packages/`.

