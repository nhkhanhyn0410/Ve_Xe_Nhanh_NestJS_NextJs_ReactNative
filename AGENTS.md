# AGENTS.md

Hệ thống đặt vé xe khách — managed marketplace ba bên (Passenger / Guest, Operator / Employee, Platform Admin).
Source of truth cho mọi rule nghiệp vụ: `doc/SDLC/`. Load skill phù hợp theo từng task.

## Quy tắc tuyệt đối

Xem đầy đủ tại `doc/agent/00-quy-chuan-cho-ai-agent.md` §B1-B4 và `doc/AGENT.md` §6.

| Rule                                                                                       | Nguồn (line)                   |
| ------------------------------------------------------------------------------------------ | ------------------------------ |
| KHÔNG viết hoặc chỉnh sửa source code dưới `apps/` hoặc `packages/`                        | `agent/00:L51`, `AGENT.md:L90` |
| KHÔNG tự chuyển trạng thái tài liệu sang `Approved`                                        | `agent/00:L52`, `AGENT.md:L91` |
| KHÔNG mở rộng scope (module/actor/luồng/công nghệ mới) khi chưa có reviewer confirm        | `agent/00:L53-55`              |
| KHÔNG phát minh business rule, actor, technology — dùng `TBD`/`ASSUMPTION`/`OPEN QUESTION` | `agent/00:L65`, `AGENT.md:L93` |
| Khi người dùng yêu cầu chỉnh tài liệu: sửa trực tiếp, không tạo bản song song              | `agent/00:L67`                 |
| Thuật ngữ phải nhất quán: một tên cho mỗi actor/module/entity/state/error                  | `agent/00:L68`                 |
| Sau khi chỉnh tài liệu, cập nhật `doc/context/PROJECT-STATE.md`                            | `AGENT.md:L65`                 |

Tiêu chí đầu ra không đạt (8 lỗi): xem `doc/agent/00-quy-chuan-cho-ai-agent.md §B4`.

## Bản đồ tài liệu

| Cần làm gì                                           | File                                           | Skill                 |
| ---------------------------------------------------- | ---------------------------------------------- | --------------------- |
| FR / UC / BR / AC / state model                      | `doc/SDLC/01-srs-he-thong-dat-ve-xe-khach.md`  | `system-requirements` |
| Module boundary, integration, data ownership         | `doc/SDLC/02-hld-he-thong-dat-ve-xe-khach.md`  | `high-level-design`   |
| Application service, state, adapter, implement order | `doc/SDLC/03-lld-he-thong-dat-ve-xe-khach.md`  | `low-level-design`    |
| Schema, migration, index, SeatHold, idempotency      | `doc/SDLC/04-database-design.md`               | `database-design`     |
| Endpoint, DTO, error code, webhook, realtime         | `doc/SDLC/05-api-specification.md`             | `api-contract`        |
| UI flow, screen state (skeleton — chờ hoàn thiện)    | `doc/SDLC/06-ui-ux-flow-specification.md`      | —                     |
| Guard, RBAC, tenant, session, PII, audit             | `doc/SDLC/07-security-permission-design.md`    | `security-auth`       |
| Test suite, AC-01..35, seed data, release gate       | `doc/SDLC/08-test-plan-acceptance-criteria.md` | `test-plan`           |
| Environment, CI, migration/seed, sandbox, release    | `doc/SDLC/09-deployment-operation-standard.md` | `deploy-ops`          |
| ADR-001..016 — tech decisions                        | `doc/SDLC/10-architecture-decision-record.md`  | `task-adr`            |
| Task backlog M0-M8, dependency, DoR/DoD              | `doc/SDLC/11-project-task-breakdown.md`        | `task-adr`            |
| Trạng thái tài liệu, blocker, open question          | `doc/context/PROJECT-STATE.md`                 | — (load trực tiếp)    |
| Module ↔ entity ↔ actor ↔ target folder              | `doc/context/DOMAIN-MAP.md`                    | — (load trực tiếp)    |
| Thuật ngữ thống nhất                                 | `doc/context/GLOSSARY.md`                      | — (load trực tiếp)    |

## Trạng thái tài liệu (nguồn: `PROJECT-STATE.md §1`, cập nhật 13/05/2026)

| Mã  | Tài liệu       | Version | Trạng thái      |
| --- | -------------- | ------- | --------------- |
| 01  | SRS            | v1.20   | Approved        |
| 02  | HLD            | v1.13   | Approved        |
| 03  | LLD            | v1.2    | Approved        |
| 04  | DB Design      | v1.4    | Approved        |
| 05  | API Spec       | v1.1    | Approved        |
| 06  | UI/UX Flow     | v0.1    | Draft — blocked |
| 07  | Security       | v1.0    | Approved        |
| 08  | Test Plan      | v1.0    | Approved        |
| 09  | Deployment     | v1.0    | Draft           |
| 10  | ADR            | v1.0    | Draft           |
| 11  | Task Breakdown | v1.0    | Draft           |

Lưu ý: §1.3 trong các file 04/05/07/08 ghi "Draft" nhưng PROJECT-STATE là source authoritative — các file đó đã Approved.

## Quy trình implement 1 task

1. Load skill `task-adr` → xác định Task ID, Source, Dependency, DoR.
2. Kiểm tra `doc/context/PROJECT-STATE.md §4..§5` — blocker và open question hiện tại.
3. Load skill tương ứng với `Source` field của task.
4. Load `security-auth` nếu task có auth / guard / RBAC / tenant / PII / audit.
5. Load `database-design` nếu task có schema / migration / query.
6. Implement. Không mở rộng scope. Ghi `TBD` nếu thiếu thông tin.
7. Load `test-plan` → viết test trace về AC.
8. Cập nhật `doc/context/PROJECT-STATE.md` nếu có quyết định mới.

Chi tiết quy trình tại `doc/agent/00-quy-chuan-cho-ai-agent.md §B3`.

## Commands

```bash
# Chưa có automation script — điền sau khi pin runtime theo ADR-OP-04.
# build:     TBD
# test:      TBD
# migrate:   TBD
# seed:      TBD
npm run format
npm run lint:fix
npm run lint
```

## Forbidden actions

- Viết hoặc sửa source code dưới `apps/` hoặc `packages/`.
- Chuyển trạng thái tài liệu sang `Approved`.
- Tạo tài liệu song song khi được yêu cầu sửa file hiện tại.
- Thêm technology, actor, module, business rule mới mà không có reviewer confirm.
- Dùng source code hiện tại làm source of truth (repo là legacy skeleton — full rewrite).
- 8 lỗi output bị từ chối: `doc/agent/00-quy-chuan-cho-ai-agent.md §B4`.
