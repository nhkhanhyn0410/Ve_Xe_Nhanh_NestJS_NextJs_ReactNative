# PROJECT-STATE

Live state of the managed marketplace project. Agents must consult this file before writing or editing any SDLC document. Update this file after every documentation change that affects status, decisions or blockers.

Last updated: 11/05/2026.

## 1. SDLC document status

| Code   | Document                                  | Path                                                                                    | Version | Status   | Owner                    |
| ------ | ----------------------------------------- | --------------------------------------------------------------------------------------- | ------- | -------- | ------------------------ |
| 00     | Quy chuẩn SDLC cho lập trình viên         | `vi/SDLC/00-quy-chuan-cho-lap-trinh-vien.md`                                            | v1.0    | Draft    | Nguyễn Hồng Khanh        |
| 00     | Quy chuẩn SDLC cho AI agent (Vietnamese)  | currently misplaced at `vi/SDLC/00-quy-chuan-cho-ai-agent.md`; should be at `vi/agent/` | v1.0    | Draft    | Nguyễn Hồng Khanh        |
| 00b-EN | SDLC Standards for AI agent (English)     | `en/agent/00-standard-for-ai-agent.md`                                                  | v1.0    | Draft    | Nguyễn Hồng Khanh        |
| 01     | SRS - Software Requirements Specification | `vi/SDLC/01-srs-he-thong-dat-ve-xe-khach.md`                                            | v1.19   | Approved | Nguyễn Hồng Khanh + team |
| 02     | HLD - High Level Design                   | `vi/SDLC/02-hld-he-thong-dat-ve-xe-khach.md`                                            | v0.1    | Draft    | AI Agent                 |
| 03     | LLD - Low Level Design                    | `vi/SDLC/03-lld-he-thong-dat-ve-xe-khach.md`                                            | v0.1    | Draft    | AI Agent                 |
| 04     | Database Design                           | `vi/SDLC/04-database-design.md`                                                         | v0.1    | Draft    | AI Agent                 |
| 05     | API Specification                         | `vi/SDLC/05-api-specification.md`                                                       | v0.1    | Draft    | AI Agent                 |
| 06     | UI / UX Flow Specification                | `vi/SDLC/06-ui-ux-flow-specification.md`                                                | v0.1    | Draft    | AI Agent                 |
| 07     | Security & Permission Design              | `vi/SDLC/07-security-permission-design.md`                                              | v0.1    | Draft    | AI Agent                 |
| 08     | Test Plan & Acceptance Criteria           | `vi/SDLC/08-test-plan-acceptance-criteria.md`                                           | v0.1    | Draft    | AI Agent                 |
| 09     | Deployment & Operation Standard           | `vi/SDLC/09-deployment-operation-standard.md`                                           | v0.1    | Draft    | AI Agent                 |
| 10     | Architecture Decision Record              | `vi/SDLC/10-architecture-decision-record.md`                                            | v0.1    | Draft    | AI Agent                 |
| 11     | Project Task Breakdown                    | `vi/SDLC/11-project-task-breakdown.md`                                                  | v0.1    | Draft    | AI Agent                 |
| 12     | Release Notes & Change Log                | not yet created                                                                         | —       | —        | —                        |

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

Open Questions discovered during HLD / LLD / DB / API / Security / Test work go here. Empty at SRS v1.15.

| ID  | Question | Raised by | Raised on | Impact | Status |
| --- | -------- | --------- | --------- | ------ | ------ |
| —   | —        | —         | —         | —      | —      |

## 5. Blockers

Concrete blockers preventing a document from reaching `Review` or `Approved`. Empty at the moment.

| Document | Blocker | Owner | Since |
| -------- | ------- | ----- | ----- |
| —        | —       | —     | —     |

## 6. Known doc / structure issues to clean up

| Issue                                                                                    | Action proposed                                                       | Status  |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------- |
| `vi/SDLC/00-quy-chuan-cho-ai-agent.md` is placed under `vi/SDLC/` instead of `vi/agent/` | Move file to `vi/agent/00-quy-chuan-cho-ai-agent.md`                  | Pending |
| `vi/agent/01a.md` is empty and unnamed                                                   | Delete file                                                           | Pending |
| SDLC docs 03-LLD, 04-DB, 07-Security, 09-Deploy lack marketplace context                 | Review v0.1 drafts and align with SRS v1.15                           | Pending |
| HLD v0.1 was written before `DOMAIN-MAP` existed                                         | Review HLD against new `DOMAIN-MAP` and SRS v1.15                     | Pending |
| `vi/agent/` is intended to hold AI-tailored abridged SDLC; only standard exists          | When a coding agent needs abridged SRS / HLD, ask user to author them | Pending |

## 7. Recent change log (latest first)

| Date       | Change                                                                                                   | Author           |
| ---------- | -------------------------------------------------------------------------------------------------------- | ---------------- |
| 11/05/2026 | Created `context/GLOSSARY.md`, `context/DOMAIN-MAP.md`, `context/PROJECT-STATE.md`                       | AI Agent         |
| 11/05/2026 | AGENT.md updated to managed-marketplace positioning and added context references in task flows A / C / D | AI Agent         |
| 11/05/2026 | SRS v1.15 published; 5 cosmetic edits closed; all 25 OQ / MQ closed                                      | AI Agent + Khanh |
| 11/05/2026 | SRS v1.14: removed sections 19 / 21 / 23, finalised §13 use cases, locked all OPs                        | AI Agent + Khanh |
| 11/05/2026 | SDLC docs 02–11 v0.1 skeletons created                                                                   | AI Agent         |
