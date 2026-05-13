# PROJECT-STATE

Live state of the managed marketplace project. Agents must consult this file before writing or editing any SDLC document. Update this file after every documentation change that affects status, decisions or blockers.

Last updated: 13/05/2026.

## 1. SDLC document status

| Code  | Document                                  | Path                                                | Version | Status   | Owner                              |
| ----- | ----------------------------------------- | --------------------------------------------------- | ------- | -------- | ---------------------------------- |
| 00    | Quy chuẩn SDLC cho lập trình viên         | `SDLC/00-quy-chuan-cho-lap-trinh-vien.md`           | v1.0    | Approved | Nguyễn Hồng Khanh                  |
| 00-AI | Quy chuẩn SDLC cho AI agent               | `agent/00-quy-chuan-cho-ai-agent.md`                | v1.0    | Approved | Nguyễn Hồng Khanh                  |
| 01-AI | Backend V1 Implementation Guide           | `agent/01-backend-v1-implementation-guide.md`       | v1.0    | Draft    | AI Agent                           |
| 02-AI | Backend V1 Artifact Index                 | `agent/02-backend-v1-artifact-index.md`             | v1.0    | Draft    | AI Agent                           |
| 01    | SRS - Software Requirements Specification | `SDLC/01-srs-he-thong-dat-ve-xe-khach.md`           | v1.20   | Approved | AI Agent, Nguyễn Hồng Khanh + team |
| 02    | HLD - High Level Design                   | `SDLC/02-hld-he-thong-dat-ve-xe-khach.md`           | v1.13   | Approved | AI Agent, Nguyễn Hồng Khanh        |
| 03    | LLD - Low Level Design                    | `SDLC/03-lld-he-thong-dat-ve-xe-khach.md`           | v1.2    | Approved | AI Agent, Nguyễn Hồng Khanh        |
| 04    | Database Design                           | `SDLC/04-database-design.md`                        | v1.4    | Approved | AI Agent , Nguyễn Hồng Khanh       |
| 05    | API Specification                         | `SDLC/05-api-specification.md`                      | v1.1    | Approved | AI Agent , Nguyễn Hồng Khanh       |
| 06    | UI / UX Flow Specification                | `SDLC/06-ui-ux-flow-specification.md`               | v0.1    | Draft    | AI Agent                           |
| 07    | Security & Permission Design              | `SDLC/07-security-permission-design.md`             | v1.0    | Approved | AI Agent , Nguyễn Hồng Khanh       |
| 08    | Test Plan & Acceptance Criteria           | `SDLC/08-test-plan-acceptance-criteria.md`          | v1.0    | Approved | AI Agent , Nguyễn Hồng Khanh       |
| 09    | Deployment & Operation Standard           | `SDLC/09-deployment-operation-standard.md`          | v1.0    | Approved | AI Agent , Nguyễn Hồng Khanh       |
| 10    | Architecture Decision Record              | `SDLC/10-architecture-decision-record.md`           | v1.0    | Approved | AI Agent , Nguyễn Hồng Khanh       |
| 11    | Project Task Breakdown                    | `SDLC/11-project-task-breakdown.md`                 | v1.0    | Draft    | AI Agent                           |
| 12    | Release Notes & Change Log                | `SDLC/12-release-notes-change-log.md` (not created) | —       | —        | —                                  |

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

SRS v1.20 has no remaining open SRS-level questions. Questions below were raised after SRS approval during HLD / LLD / DB / API / Security / Test work.

| ID        | Question                                                                                                                                                                  | Raised by | Raised on  | Impact                                                                                         | Status            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- | ---------------------------------------------------------------------------------------------- | ----------------- |
| HLD-OQ-01 | ĐÃ CHỐT: object/file storage dùng S3-compatible qua FileStorageProvider; production AWS S3 private bucket, local/dev MinIO; DB chỉ lưu metadata/object key.               | AI Agent  | 12/05/2026 | Ảnh hưởng DB file metadata, signed URL API, IAM, retention, security scan, backup và cost.     | Closed 12/05/2026 |
| HLD-OQ-02 | ĐÃ CHỐT PHẠM VI: V1 chỉ giữ adapter cho SMS / push; chưa chốt provider cụ thể và SMS OTP vẫn ngoài phạm vi v1.                                                            | AI Agent  | 12/05/2026 | Ảnh hưởng Notification API, mobile token registry, template, retry và consent/preference.      | Closed 12/05/2026 |
| HLD-OQ-03 | ĐÃ XỬ LÝ Ở TẦNG HLD: production deployment target, secret manager, monitoring/logging/alert stack và incident runbook chuyển xuống `09-deployment-operation-standard.md`. | AI Agent  | 12/05/2026 | Không chặn HLD/DB Design; chặn staging/production nếu tài liệu 09 chưa chốt.                   | Closed 12/05/2026 |
| HLD-OQ-04 | ĐÃ CHỐT: Employee offline dùng read cache manifest + queued operational actions có giới hạn cho check-in / no-show / journey log / incident; không full offline sync.     | AI Agent  | 12/05/2026 | Ảnh hưởng Mobile LLD, idempotency, conflict resolution, test mất mạng và operation policy.     | Closed 12/05/2026 |
| ADR-OQ-05 | ĐÃ CHỐT: mở lại lựa chọn tech stack sau khi HLD/LLD/DB/API/Security đủ rõ; hiện trạng repo không tự động là target implementation.                                        | AI Agent  | 12/05/2026 | Ảnh hưởng ADR-002..004/007, Database/API/Security/Deployment và điều kiện vào code Backend V1. | Closed 12/05/2026 |
| LLD-OP-01 | ĐÃ CHỐT: mở lại lựa chọn tech stack sau khi DB/API/Security đủ rõ; hiện trạng repo không tự động là target implementation.                                                | AI Agent  | 12/05/2026 | Ảnh hưởng folder/file pattern, framework convention, test strategy và điều kiện vào code.      | Closed 12/05/2026 |
| LLD-OP-02 | ĐÃ CHỐT: SeatHold dùng DB-authoritative hybrid; DB giữ invariant cuối cùng, lock service nếu có chỉ hỗ trợ giảm contention.                                               | AI Agent  | 12/05/2026 | Ảnh hưởng trực tiếp chống bán trùng ghế, booking/payment consistency và concurrency test.      | Closed 12/05/2026 |
| LLD-OP-03 | ĐÃ CHỐT: Employee offline dùng read cache manifest + queued operational actions có giới hạn cho check-in / no-show / journey log / incident.                              | AI Agent  | 12/05/2026 | Ảnh hưởng Mobile LLD, local queue, conflict handling và test mất mạng.                         | Closed 12/05/2026 |
| LLD-OP-04 | ĐÃ CHỐT: object/file storage dùng S3-compatible qua FileStorageProvider; production AWS S3 private bucket, local/dev MinIO; DB metadata/object key only.                  | AI Agent  | 12/05/2026 | Ảnh hưởng KYC, attachment, incident evidence, report export, signed URL và retention.          | Closed 12/05/2026 |
| LLD-OP-05 | ĐÃ CHỐT: session/token/re-auth/rate limit chi tiết chốt ở Security Design theo actor, không mở thêm actor/flow ở LLD.                                                     | AI Agent  | 12/05/2026 | Ảnh hưởng Security Design, API contract, mobile secure storage và sensitive actions.           | Closed 12/05/2026 |
| LLD-OP-06 | ĐÃ CHỐT: email provider/template workflow chốt ở Notification/API; SMS/push giữ adapter theo HLD-OQ-02, không bật transactional ở V1 nếu reviewer không mở lại scope.     | AI Agent  | 12/05/2026 | Ảnh hưởng Notification API, retry, template và consent/preference.                             | Closed 12/05/2026 |
| DB-OP-01  | ĐÃ CHỐT: operational database V1 dùng MongoDB replica set; dùng transaction, conditional update, unique/partial index và TTL index theo DB Design v1.4.                   | AI Agent  | 13/05/2026 | Migration phải kiểm replica set, index và transaction support trước khi chạy.                  | Closed 13/05/2026 |
| DB-OP-02  | ĐÃ CHỐT: ledger V1 dùng append-only typed ledger entry; không triển khai double-entry accounting trong V1.                                                                | AI Agent  | 13/05/2026 | Finance/Legal nếu cần báo cáo kế toán chuẩn sẽ dùng view/export từ ledger.                     | Closed 13/05/2026 |
| DB-OP-03  | ĐÃ CHỐT: retention/file scan/signed URL/content type/size/object lifecycle dùng baseline DB Design v1.4.                                                                  | AI Agent  | 13/05/2026 | Security/Operation có thể siết chặt, không được yếu hơn baseline.                              | Closed 13/05/2026 |
| DB-OP-04  | ĐÃ CHỐT: session TTL, idempotency retention và provider callback safe payload retention dùng baseline DB Design v1.4.                                                     | AI Agent  | 13/05/2026 | Security Design triển khai chi tiết token/re-auth dựa trên baseline này.                       | Closed 13/05/2026 |
| DB-OP-05  | ĐÃ CHỐT: catalog seed V1 dùng Admin Ops seed package có source metadata, checksum, review record và version; không phụ thuộc runtime vào nguồn ngoài.                     | AI Agent  | 13/05/2026 | Admin Ops phải cung cấp seed package đầu tiên trước migration staging.                         | Closed 13/05/2026 |
| API-OP-01 | ĐÃ CHỐT: API V1 dùng Bearer access token; Web refresh dùng HttpOnly Secure SameSite=Lax cookie + CSRF; Mobile refresh dùng secure storage; Admin MFA bắt buộc.            | AI Agent  | 13/05/2026 | Security Design v1.0 đã cụ thể hóa TTL, refresh/revoke, re-auth challenge và sensitive action. | Closed 13/05/2026 |
| API-OP-02 | ĐÃ CHỐT: Realtime V1 dùng WebSocket `/realtime`, auth bằng Bearer hoặc guest realtime token, server-authorized topics và REST polling fallback.                           | AI Agent  | 13/05/2026 | Web/Mobile realtime client phải dùng REST làm source of truth và test reconnect/revoke scope.  | Closed 13/05/2026 |
| API-OP-03 | ĐÃ CHỐT: VNPay Sandbox mapping dùng `vnp_TxnRef = paymentCode`, `vnp_Amount = amountVnd * 100`, HMAC-SHA512 signature, success code/status `00`.                          | AI Agent  | 13/05/2026 | Payment test phải bao phủ success, duplicate, wrong signature, amount mismatch và reconciling. | Closed 13/05/2026 |
| API-OP-04 | ĐÃ CHỐT: Notification V1 bật email + in-app baseline; SMS/push giữ adapter nhưng không bật transactional launch nếu không mở lại scope.                                   | AI Agent  | 13/05/2026 | Test Plan v1.0 dùng adapter mock/sandbox cho email/in-app và kiểm SMS/push disabled.           | Closed 13/05/2026 |
| API-OP-05 | ĐÃ CHỐT: API Specification đã review là source contract nghiệp vụ; OpenAPI 3.1 là artifact derived; SDK sinh từ OpenAPI sau review.                                       | AI Agent  | 13/05/2026 | Contract test phải đối chiếu API Spec trước, OpenAPI/SDK sau khi artifact được tạo.            | Closed 13/05/2026 |
| ADR-OP-01 | CẦN REVIEWER CHỐT: ADR-010 đề xuất Backend framework target là NestJS + TypeScript modular monolith.                                                                      | AI Agent  | 13/05/2026 | Chặn source rewrite chính thức nếu reviewer chưa accept hoặc risk-accept.                      | Open              |
| ADR-OP-02 | CẦN REVIEWER CHỐT: ADR-011 đề xuất Redis-compatible backend + Bull/BullMQ-compatible queue adapter nếu giữ SRS DP-01.                                                     | AI Agent  | 13/05/2026 | Chặn worker/queue implementation cụ thể nếu reviewer chưa accept hoặc chọn thay thế.           | Open              |
| ADR-OP-03 | Production deployment target, secret manager, monitoring/logging/alert stack và RPO/RTO chính thức chưa chốt.                                                             | AI Agent  | 13/05/2026 | Không chặn local/CI/staging backend; chặn production release.                                  | Open              |
| ADR-OP-04 | Exact Node.js/npm/package manager/Docker image version chưa chốt.                                                                                                         | AI Agent  | 13/05/2026 | Chặn CI reproducibility chính thức; cần đóng khi bắt đầu implementation environment.           | Open              |
| ADR-OP-05 | Email provider production cụ thể chưa chốt; V1 hiện có email/in-app baseline và sandbox/mock cho test.                                                                    | AI Agent  | 13/05/2026 | Không chặn backend local/CI/staging; chặn transactional email production.                      | Open              |

## 5. Blockers

Concrete blockers preventing a document from reaching `Review` or `Approved`.

| Document                      | Blocker                                                                                                                                                          | Owner           | Since            |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------- |
| 06-UI / UX Flow Specification | v0.1 còn skeleton; chưa đủ screen flow, state, validation và error/empty/loading state theo API/Security/Test mới.                                               | AI Agent        | 13/05/2026       |
| 09-Deployment & Operation     | v1.0 đã đủ local/CI/staging Backend V1; production deployment target, secret manager, monitoring stack và RPO/RTO vẫn cần reviewer/DevOps chốt trước production. | DevOps/Reviewer | 13/05/2026       |
| 10-ADR                        | ADR v1.0 đã chốt lại phần có nguồn Approved; ADR-010/011 framework/queue vẫn `Proposed` và cần reviewer accept hoặc risk-accept trước source rewrite chính thức. | Reviewer        | Close 13/05/2026 |
| 11-Project Task Breakdown     | v1.0 đủ backlog handoff Backend V1; issue tracker, owner cụ thể, ADR-010/011 và runtime/package versions vẫn cần chốt để chuyển task sang `Ready`.               | Reviewer/PM     | Close 13/05/2026 |
| 12-Release Notes & Change Log | Chưa tạo file theo danh mục SDLC.                                                                                                                                | AI Agent        | 12/05/2026       |

## 6. Known doc / structure issues to clean up

| Issue                                                                                                                                                                        | Action proposed                                                                                                                       | Status              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `agent/01a.md` was empty and unnamed                                                                                                                                         | Replaced with `agent/01-backend-v1-implementation-guide.md` and `agent/02-backend-v1-artifact-index.md`.                              | Resolved 13/05/2026 |
| `04-database-design.md` and `05-api-specification.md` metadata are Approved but their §1.3 status text still says Draft; `05` also has stale API-OP wording in some sections | Run a focused doc hygiene pass on 04/05 to align §1.3 and remove stale OP references without changing approved contract meaning.      | Pending             |
| SDLC doc 06 remains incomplete; docs 09/11 are now v1.0 Draft handoff documents                                                                                              | Continue downstream rewrite/review in dependency order: 06-UI/UX; then reviewer closes ADR/OPS/TASK OP for Backend V1 implementation. | Pending             |
| `agent/` is intended to hold AI-tailored abridged SDLC                                                                                                                       | Backend V1 guide and artifact index now exist; more abridged agent docs can be added only when needed.                                | Partial             |

## 7. Recent change log (latest first)

| Date       | Change                                                                                                                                                                                                                                            | Author           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 13/05/2026 | Rewrote ADR 10 to v1.0 handoff: accepted decisions backed by Approved docs, proposed Backend framework/queue/runtime decisions, API/OpenAPI artifact policy, storage/realtime/observability/deployment OP split.                                  | AI Agent         |
| 13/05/2026 | Rewrote Deployment & Operation Standard 09 to v1.0 for Backend V1 local/CI/staging: environment matrix, config/secret, migration/index/seed, provider sandbox/mock, observability, backup, release, rollback and incident baseline.               | AI Agent         |
| 13/05/2026 | Rewrote Project Task Breakdown 11 to v1.0: Backend V1 milestones M0..M8, task dependencies, artifact tasks, security/test/operation tasks, DoR/DoD, start/staging/production gates and open points.                                               | AI Agent         |
| 13/05/2026 | Replaced empty `agent/01a.md` with Backend V1 Implementation Guide and added Backend V1 Artifact Index for coding-agent handoff.                                                                                                                  | AI Agent         |
| 13/05/2026 | Rewrote Security & Permission Design to v1.0 from Approved SRS/HLD/LLD/DB/API: auth/session transport, RBAC, tenant/assignment guard, Guest verification, sensitive action, masking, file security, webhook/realtime security and audit baseline. | AI Agent         |
| 13/05/2026 | Rewrote Test Plan & Acceptance Criteria to v1.0 from Approved SRS/HLD/LLD/DB/API and Security v1.0: mapped AC-01..AC-35 to backend test suites, P0/P1 gates, seed data, evidence, security, concurrency, reliability and exit criteria.           | AI Agent         |
| 13/05/2026 | Closed API-OP-01..05 in project state: auth/session transport, realtime WebSocket contract, VNPay Sandbox mapping, notification V1 baseline and API contract publication policy are now treated as closed downstream decisions.                   | AI Agent + Khanh |
| 13/05/2026 | Rewrote API Specification to v1.0 from Approved SRS v1.20, HLD v1.13, LLD v1.2 and DB Design v1.4; added endpoint catalog, DTO summary, response/error/idempotency conventions, webhook/realtime/job contracts and API-OP-01..05.                 | AI Agent         |
| 13/05/2026 | Closed DB-OP-01..05 in Database Design v1.4: MongoDB replica set target, append-only typed ledger, retention/storage baseline, session/idempotency/callback retention and Admin Ops catalog seed package; ADR-003 moved to Accepted in ADR v0.5.  | AI Agent + Khanh |
| 13/05/2026 | Rewrote Database Design to v1.3 from Approved SRS v1.20, HLD v1.13 and LLD v1.2; added logical record-set catalog, field contracts, indexes, SeatHold DB-authoritative design, idempotency, ledger, storage metadata, retention and DB-OP-01..05. | AI Agent         |
| 12/05/2026 | Cleaned Approved baseline docs 01/02/03: SRS v1.20, HLD v1.13 and LLD v1.2 now align on SeatHold DB-authoritative hybrid, Employee offline, object storage and downstream handoff wording.                                                        | AI Agent + Khanh |
| 12/05/2026 | Closed LLD-OP-02..04 and synced related docs: SeatHold DB-authoritative hybrid, Employee offline limited queued operations, S3-compatible storage with AWS S3/MinIO baseline.                                                                     | AI Agent         |
| 12/05/2026 | Rewrote LLD to v1.0 from SRS v1.19, HLD v1.11 and DOMAIN-MAP; added LLD-OP-01..06 and synced DOMAIN-MAP object storage status with HLD-OQ-01 / ADR-009.                                                                                           | AI Agent         |
| 12/05/2026 | Reworked ADR-009: removed Tech Stack Baseline V1 as a selected baseline; ADR now records tech stack evaluation framework/candidates, sets ADR-002..004 to Deferred and reopens object storage target selection.                                   | AI Agent         |
| 12/05/2026 | Moved Tech Stack Baseline V1 from HLD into ADR-009; updated HLD to v1.10 as a reference consumer and ADR 10 to v0.2.                                                                                                                              | AI Agent         |
| 12/05/2026 | Updated HLD to v1.9: added Tech Stack Baseline V1 for reviewer adjustment, synced S3-compatible storage baseline and closed SMS/push provider choice as adapter-only for V1.                                                                      | AI Agent         |
| 12/05/2026 | Updated HLD to v1.8 after review: fixed version mismatch, mobile User-only wording, S3-compatible storage baseline and HLD-OQ statuses.                                                                                                           | AI Agent         |
| 12/05/2026 | Closed HLD-OQ-01 in HLD v1.7: object/file storage uses S3-compatible adapter, AWS S3 production baseline and MinIO for local/dev.                                                                                                                 | AI Agent         |
| 12/05/2026 | Updated HLD to v1.6 and DOMAIN-MAP §3: mobile passenger app is User-only; Guest checkout / lookup remains Web Marketplace only.                                                                                                                   | AI Agent         |
| 12/05/2026 | Updated HLD to v1.5: split Web Operator auth and Web Employee auth in §6.2 to clarify actor/session boundary.                                                                                                                                     | AI Agent         |
| 12/05/2026 | Rewrote HLD §6..§18 into v1.4 based on SRS v1.19 and DOMAIN-MAP; recorded HLD-OQ-01..04 for storage, SMS/push, deployment/observability and Employee offline/sync.                                                                                | AI Agent         |
| 12/05/2026 | Reviewed HLD table of contents into v1.3; kept §1..§5 baseline and retained necessary HLD sections for §6..§19.                                                                                                                                   | AI Agent         |
| 12/05/2026 | Synced HLD §1..§5 into v1.2: metadata, input priority, scope baseline, SRS decision baseline and architecture handoff.                                                                                                                            | AI Agent         |
| 12/05/2026 | Rewrote HLD §5 architecture overview against SRS v1.19 decisions; HLD remains Draft pending remaining stale sections.                                                                                                                             | AI Agent         |
| 12/05/2026 | Synced context files with SRS v1.19: corrected AI-agent path, blockers, stale SRS v1.15 references and next-document priorities.                                                                                                                  | AI Agent         |
| 12/05/2026 | SRS v1.19 completed through §20, with §21 Decisions Log and §22 appendix kept as supporting sections.                                                                                                                                             | AI Agent + Khanh |
| 12/05/2026 | SRS v1.18 wrote §16 main business flows.                                                                                                                                                                                                          | AI Agent + Khanh |
| 12/05/2026 | SRS v1.16..v1.17 finalized §14 Business Rules, §15 permissions and review fixes for first 15 sections.                                                                                                                                            | AI Agent + Khanh |
| 11/05/2026 | Created `context/GLOSSARY.md`, `context/DOMAIN-MAP.md`, `context/PROJECT-STATE.md`                                                                                                                                                                | AI Agent         |
| 11/05/2026 | AGENT.md updated to managed-marketplace positioning and added context references in task flows A / C / D                                                                                                                                          | AI Agent         |
| 11/05/2026 | SRS v1.15 published; 5 cosmetic edits closed; all 25 OQ / MQ closed                                                                                                                                                                               | AI Agent + Khanh |
| 11/05/2026 | SRS v1.14: removed sections 19 / 21 / 23, finalised §13 use cases, locked all OPs                                                                                                                                                                 | AI Agent + Khanh |
| 11/05/2026 | SDLC docs 02–11 v0.1 skeletons created                                                                                                                                                                                                            | AI Agent         |
| AI Agent   |
