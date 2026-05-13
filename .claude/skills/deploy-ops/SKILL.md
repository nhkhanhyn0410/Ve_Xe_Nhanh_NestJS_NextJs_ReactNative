---
name: deploy-ops
description: Load when setting up local development, CI pipelines, or staging environments for the backend; configuring environment variables and secrets; running MongoDB migrations or seed packages; setting up VNPay sandbox or provider mocks; implementing observability (structured logging, metrics, alerts); or preparing release checklists and rollback procedures.
---

# Deployment & Operation Standard — Index

**Source of truth:** `doc/SDLC/09-deployment-operation-standard.md` (v1.0, Draft)

**Trạng thái:** v1.0 đủ cho local/CI/staging Backend V1. Production deployment target, secret manager cụ thể, monitoring stack cụ thể và RPO/RTO chính thức vẫn cần reviewer/DevOps chốt — xem `PROJECT-STATE §5`.

## When to read what

| Task | Đọc section này |
|------|----------------|
| Environment matrix (local / CI / staging / prod) | §6 Environment baseline |
| Config và secret management | §7 Configuration và secret |
| Local development setup (MongoDB local replica set, env) | §8 Local development standard |
| CI pipeline và test automation | §9 CI và test automation standard |
| Staging setup, gate, promotion criteria | §10 Staging standard |
| Production readiness checklist | §11 Production readiness standard |
| MongoDB migration / index creation / seed runbook | §12 Database migration, index và seed |
| VNPay sandbox, email mock, storage mock setup | §13 Provider sandbox, mock và external callback |
| Logging, metric, alert baseline | §14 Observability, logging, metric và alert |
| Backup và restore procedure | §15 Backup, restore và retention operation |
| Release process, migration safety, rollback | §16 Release, rollback và migration safety |
| Incident runbook baseline | §17 Incident runbook baseline |
| Pre-release operation checklist | §18 Operation checklist |

## Top-level catalog

**Environment matrix:**
| Env | DB | Provider | Secret source |
|-----|----|---------|--------------|
| Local | MongoDB local replica set | Mock / MinIO | `.env.local` (gitignored) |
| CI | MongoDB test container (replica set) | Mock | CI secret store |
| Staging | MongoDB staging replica set | Sandbox (VNPay / email sandbox) | Staging secret store |
| Production | MongoDB production replica set | Live | Production secret manager (ADR-OP-03 — TBD) |

**Open blockers (production):**
- Production cloud/hosting target chưa chốt (ADR-OP-03)
- Secret manager production chưa chốt (ADR-OP-03)
- Monitoring stack production chưa chốt (ADR-OP-03)
- Node.js / npm / Docker image version chưa pin (ADR-OP-04)

**Migration safety order:**
1. Check replica set availability
2. Check index creation không conflict với write path đang chạy
3. Run migration (idempotent)
4. Verify index manifest
5. Run smoke checklist

## Invariants (luôn áp dụng)

- Secret KHÔNG được commit vào repo; mỗi env dùng secret store riêng. `Ops §7`
- MongoDB local/CI PHẢI hỗ trợ transaction (replica set). `DB-OP-01, Ops §12`
- Provider callback URL trong sandbox KHÔNG được trùng với production. `Ops §13`
- Log KHÔNG được chứa PII / token / secret dạng plain text. `Security §11, Ops §14`
- Smoke checklist phải pass và evidence được lưu sau mỗi deploy lên staging. `ART-009, Ops §18`
- Migration phải idempotent — re-run không thay đổi kết quả. `Ops §16`

## Cross-references

- Skills liên quan: `database-design` (migration/seed schema), `test-plan` (CI test requirements, evidence), `task-adr` (M0 artifact có owner trước khi code, M8 hardening)
- `doc/agent/02-backend-v1-artifact-index.md` — ART-005 (DB migration/index manifest), ART-006 (seed package), ART-009 (smoke checklist)
