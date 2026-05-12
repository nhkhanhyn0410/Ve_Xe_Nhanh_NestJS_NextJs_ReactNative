# PROJECT-STATE

Live state of the managed marketplace project. Agents must consult this file before writing or editing any SDLC document. Update this file after every documentation change that affects status, decisions or blockers.

Last updated: 12/05/2026.

## 1. SDLC document status

| Code   | Document                                  | Path                                                  | Version | Status   | Owner                    |
| ------ | ----------------------------------------- | ----------------------------------------------------- | ------- | -------- | ------------------------ |
| 00     | Quy chuẩn SDLC cho lập trình viên         | `vi/SDLC/00-quy-chuan-cho-lap-trinh-vien.md`          | v1.0    | Draft    | Nguyễn Hồng Khanh        |
| 00-AI  | Quy chuẩn SDLC cho AI agent (Vietnamese)  | `vi/agent/00-quy-chuan-cho-ai-agent.md`               | v1.0    | Draft    | Nguyễn Hồng Khanh        |
| 00b-EN | SDLC Standards for AI agent (English)     | `en/agent/00-standard-for-ai-agent.md`                | v1.0    | Draft    | Nguyễn Hồng Khanh        |
| 01     | SRS - Software Requirements Specification | `vi/SDLC/01-srs-he-thong-dat-ve-xe-khach.md`          | v1.19   | Approved | Nguyễn Hồng Khanh + team |
| 02     | HLD - High Level Design                   | `vi/SDLC/02-hld-he-thong-dat-ve-xe-khach.md`          | v1.7    | Draft    | AI Agent                 |
| 03     | LLD - Low Level Design                    | `vi/SDLC/03-lld-he-thong-dat-ve-xe-khach.md`          | v0.1    | Draft    | AI Agent                 |
| 04     | Database Design                           | `vi/SDLC/04-database-design.md`                       | v0.1    | Draft    | AI Agent                 |
| 05     | API Specification                         | `vi/SDLC/05-api-specification.md`                     | v0.1    | Draft    | AI Agent                 |
| 06     | UI / UX Flow Specification                | `vi/SDLC/06-ui-ux-flow-specification.md`              | v0.1    | Draft    | AI Agent                 |
| 07     | Security & Permission Design              | `vi/SDLC/07-security-permission-design.md`            | v0.1    | Draft    | AI Agent                 |
| 08     | Test Plan & Acceptance Criteria           | `vi/SDLC/08-test-plan-acceptance-criteria.md`         | v0.1    | Draft    | AI Agent                 |
| 09     | Deployment & Operation Standard           | `vi/SDLC/09-deployment-operation-standard.md`         | v0.1    | Draft    | AI Agent                 |
| 10     | Architecture Decision Record              | `vi/SDLC/10-architecture-decision-record.md`          | v0.1    | Draft    | AI Agent                 |
| 11     | Project Task Breakdown                    | `vi/SDLC/11-project-task-breakdown.md`                | v0.1    | Draft    | AI Agent                 |
| 12     | Release Notes & Change Log                | `vi/SDLC/12-release-notes-change-log.md` (not created) | —       | —        | —                        |

Status legend per `00 §3.2`: `Writing` / `Draft` / `Review` / `Approved` / `Deprecated` / `Superseded`.

## 2. Strategic decisions

Code rewrite strategy = **Phương án A (full rewrite)** confirmed on 11/05/2026.

- Current backend code under `apps/backend/src/modules/` is treated as legacy skeleton.
- Target backend layout follows three service layers — see `@context/DOMAIN-MAP §1`.
- Approximate impact: ~10% reused, ~20% migrated with breaking changes, ~70% net new.
- Migration plan is not required since rewrite path is chosen; `DOMAIN-MAP` defines target state only.

## 3. Closed decisions log (OQ + MQ)

All 25 questions raised during SRS authoring are now closed. See SRS §21 for full text. Quick index:

| ID range  | Topic                                                                                | Status            |
| --------- | ------------------------------------------------------------------------------------ | ----------------- |
| OQ-01..03 | State enums (Trip, Booking, Payment) align with SRS                                  | Closed 05/05/2026 |
| OQ-04     | Employee with `TICKET_STAFF` / `DRIVER` / `SUPPORT_STAFF` roles                      | Closed 05/05/2026 |
| OQ-05     | Payment gateway = VNPay Sandbox first                                                | Closed 11/05/2026 |
| OQ-06     | Seat hold = 10 minutes, platform-wide for v1                                         | Closed 11/05/2026 |
| OQ-07     | Pay-first flow only for v1; PENDING_CONFIRMATION kept in enum                        | Closed 11/05/2026 |
| OQ-08     | Fare is a separate collection; booking snapshots fare; no segment fare in v1         | Closed 11/05/2026 |
| OQ-09     | Email OTP for v1; SMS via adapter for future                                         | Closed 11/05/2026 |
| OQ-10     | Mobile = single Expo codebase, actor-split UI / session                              | Closed 10/05/2026 |
| OQ-11     | Phone mask = first digit + last 3 (`0*** *** 789`)                                   | Closed 11/05/2026 |
| OQ-12     | VND only, Vietnamese only for v1                                                     | Closed 11/05/2026 |
| OQ-13     | Cancel / refund = Platform default + Operator override (admin approved); snapshot    | Closed 11/05/2026 |
| OQ-14     | Audit log in MongoDB same cluster, append-only                                       | Closed 11/05/2026 |
| OQ-15     | Reporting via MongoDB aggregation + async jobs                                       | Closed 11/05/2026 |
| OQ-16     | Escrow payout T+3, no minimum threshold, bank transfer with admin manual confirm     | Closed 11/05/2026 |
| OQ-17     | Price ceiling / floor = warning only, no auto-block                                  | Closed 10/05/2026 |
| OQ-18     | Default commission 5%; per-Operator override; no auto-tier                           | Closed 11/05/2026 |
| OQ-19     | KYC = business reg, transport license, representative ID, bank info                  | Closed 11/05/2026 |
| OQ-20     | Platform brand = neutral marketplace; operator name remains primary signal           | Closed 11/05/2026 |
| MQ-01..05 | Marketplace model decisions (escrow, pricing autonomy, arbiter, commission, model B) | Closed 05/05/2026 |

## 4. Open Questions raised after SRS Approval

SRS v1.19 has no remaining open SRS-level questions. Questions below were raised after SRS approval during HLD / LLD / DB / API / Security / Test work.

| ID        | Question | Raised by | Raised on | Impact | Status |
| --------- | -------- | --------- | --------- | ------ | ------ |
| HLD-OQ-01 | ĐÃ CHỐT: object/file storage dùng S3-compatible adapter; production baseline AWS S3 private bucket, local/dev dùng MinIO. Binary không lưu trong MongoDB; DB chỉ lưu metadata/object key. | AI Agent | 12/05/2026 | Ảnh hưởng DB file metadata, signed URL API, IAM, retention, security scan, backup và cost. | Closed 12/05/2026 |
| HLD-OQ-02 | Chọn provider SMS / push và xác định SMS / push transactional có bắt buộc cho V1 launch hay chỉ giữ adapter. | AI Agent | 12/05/2026 | Ảnh hưởng Notification API, mobile token registry, template, retry và consent/preference. | Open |
| HLD-OQ-03 | Chốt production deployment target, secret manager, monitoring/logging/alert stack và incident runbook baseline. | AI Agent | 12/05/2026 | Ảnh hưởng Deployment Standard, observability, backup/restore và production readiness. | Open |
| HLD-OQ-04 | Chốt mức hỗ trợ offline/sync cho Employee: chỉ read cache manifest, hay cho queue thao tác check-in/journey/incident. | AI Agent | 12/05/2026 | Ảnh hưởng Mobile LLD, idempotency, conflict resolution, test mất mạng và operation policy. | Open |

## 5. Blockers

Concrete blockers preventing a document from reaching `Review` or `Approved`.

| Document | Blocker | Owner | Since |
| -------- | ------- | ----- | ----- |
| 02-HLD | v1.7 đã đồng bộ mục 1-18 theo SRS v1.19 và DOMAIN-MAP; HLD-OQ-01 đã chốt S3-compatible object storage; còn cần người duyệt xác nhận và xử lý / chấp nhận HLD-OQ-02..04 trước khi các tài liệu DB/API/Security/Deployment chốt chi tiết. | AI Agent | 12/05/2026 |
| 04-Database Design | Chưa đủ collection / index / TTL / idempotency / ledger / audit-retention để triển khai dữ liệu V1. | AI Agent | 12/05/2026 |
| 05-API Specification | Chưa đủ contract request/response/error/webhook/realtime cho FE/BE/Mobile tích hợp V1. | AI Agent | 12/05/2026 |
| 07-Security & Permission Design | Chưa đủ rule chi tiết cho RBAC, tenant boundary, Guest lookup, masking, audit và thao tác nhạy cảm. | AI Agent | 12/05/2026 |
| 08-Test Plan | Chưa chuyển AC-01..AC-35 của SRS v1.19 thành test case / test data / entry-exit criteria cụ thể. | AI Agent | 12/05/2026 |
| 11-Project Task Breakdown | Còn rủi ro / task dependency cũ trước khi SRS §13..§21 được chốt; chưa đủ làm backlog V1. | AI Agent | 12/05/2026 |
| 12-Release Notes & Change Log | Chưa tạo file theo danh mục SDLC. | AI Agent | 12/05/2026 |

## 6. Known doc / structure issues to clean up

| Issue | Action proposed | Status |
| ----- | --------------- | ------ |
| `vi/agent/01a.md` is empty and unnamed | Delete file or replace with a named agent-context document when needed. | Pending |
| SDLC docs 03..11 are v0.1 skeletons; 02-HLD v1.7 has synced §1..§18 but remains Draft pending reviewer confirmation and HLD-OQ-02..04 handling | Continue rewrite / review in dependency order: 04-DB → 05-API → 07-Security → 08-Test → 09-Deployment → 11-Task Breakdown. | Pending |
| `vi/agent/` is intended to hold AI-tailored abridged SDLC; only standard exists | When a coding agent needs abridged SRS / HLD, ask user to author them. | Pending |

## 7. Recent change log (latest first)

| Date       | Change                                                                                                   | Author           |
| ---------- | -------------------------------------------------------------------------------------------------------- | ---------------- |
| 12/05/2026 | Closed HLD-OQ-01 in HLD v1.7: object/file storage uses S3-compatible adapter, AWS S3 production baseline and MinIO for local/dev. | AI Agent |
| 12/05/2026 | Updated HLD to v1.6 and DOMAIN-MAP §3: mobile passenger app is User-only; Guest checkout / lookup remains Web Marketplace only. | AI Agent |
| 12/05/2026 | Updated HLD to v1.5: split Web Operator auth and Web Employee auth in §6.2 to clarify actor/session boundary. | AI Agent |
| 12/05/2026 | Rewrote HLD §6..§18 into v1.4 based on SRS v1.19 and DOMAIN-MAP; recorded HLD-OQ-01..04 for storage, SMS/push, deployment/observability and Employee offline/sync. | AI Agent |
| 12/05/2026 | Reviewed HLD table of contents into v1.3; kept §1..§5 baseline and retained necessary HLD sections for §6..§19. | AI Agent |
| 12/05/2026 | Synced HLD §1..§5 into v1.2: metadata, input priority, scope baseline, SRS decision baseline and architecture handoff. | AI Agent |
| 12/05/2026 | Rewrote HLD §5 architecture overview against SRS v1.19 decisions; HLD remains Draft pending remaining stale sections. | AI Agent |
| 12/05/2026 | Synced context files with SRS v1.19: corrected AI-agent path, blockers, stale SRS v1.15 references and next-document priorities. | AI Agent |
| 12/05/2026 | SRS v1.19 completed through §20, with §21 Decisions Log and §22 appendix kept as supporting sections. | AI Agent + Khanh |
| 12/05/2026 | SRS v1.18 wrote §16 main business flows. | AI Agent + Khanh |
| 12/05/2026 | SRS v1.16..v1.17 finalized §14 Business Rules, §15 permissions and review fixes for first 15 sections. | AI Agent + Khanh |
| 11/05/2026 | Created `context/GLOSSARY.md`, `context/DOMAIN-MAP.md`, `context/PROJECT-STATE.md`                       | AI Agent         |
| 11/05/2026 | AGENT.md updated to managed-marketplace positioning and added context references in task flows A / C / D | AI Agent         |
| 11/05/2026 | SRS v1.15 published; 5 cosmetic edits closed; all 25 OQ / MQ closed                                      | AI Agent + Khanh |
| 11/05/2026 | SRS v1.14: removed sections 19 / 21 / 23, finalised §13 use cases, locked all OPs                        | AI Agent + Khanh |
| 11/05/2026 | SDLC docs 02–11 v0.1 skeletons created                                                                   | AI Agent         |
