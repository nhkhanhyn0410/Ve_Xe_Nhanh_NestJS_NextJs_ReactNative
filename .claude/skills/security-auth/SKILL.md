---
name: security-auth
description: Load when implementing authentication guards, session management, RBAC permission checks, tenant boundary enforcement (operatorId filter), sensitive action re-authentication (MFA/password confirm), PII data masking, signed URL access control, webhook signature verification (VNPay HMAC), or audit logging for any feature in the bus ticket booking backend.
---

# Security & Permission Design — Index

**Source of truth:** `doc/SDLC/07-security-permission-design.md` (v1.0, Approved)

## When to read what

| Task | Đọc section này |
|------|----------------|
| Actor trust level và session context per actor | §5 Trust boundary và actor context |
| Session / token transport, TTL, refresh, revoke | §6 Authentication, session và credential transport |
| Guard implementation, RBAC scope per actor | §7 Authorization, RBAC và scope guard |
| Permission matrix — actor × action × resource | §8 Permission matrix Backend V1 |
| Sensitive action (payment, refund, payout, KYC, admin) | §9 Sensitive action, re-auth và MFA |
| Guest verification trước thao tác nhạy cảm | §10 Guest verification và anti-enumeration |
| PII masking (phone, email, CCCD) | §11 Data protection, masking và secret handling |
| File access control, signed URL TTL | §12 File, attachment và signed URL security |
| Webhook signature, HMAC verify, realtime scope | §13 External provider, webhook và realtime security |
| Audit log schema và retention | §14 Audit, security logging và retention |
| Rate limit, brute force, abuse control | §15 Rate limit, abuse control và threat control |
| Security acceptance baseline (phải pass trước release) | §16 Security acceptance baseline cho backend |

## Top-level catalog

**Session transport:**
| Actor | Access token | Refresh token |
|-------|-------------|--------------|
| User / Operator / Employee (Web) | Bearer header | HttpOnly Secure SameSite=Lax cookie + CSRF |
| User / Employee (Mobile) | Bearer header | Secure storage |
| Admin | Bearer header + MFA bắt buộc | HttpOnly cookie |
| Guest | Guest session token (short TTL) | Không có refresh |

**RBAC model:**
- Role assignment: `User`, `Operator`, `Employee` (TICKET_STAFF / DRIVER / SUPPORT_STAFF), `Admin`
- Tenant scope: mọi Operator-owned resource bắt buộc kiểm `operatorId` match
- Assignment scope: Employee chỉ thao tác trip đã được assign
- Object ownership: User chỉ thao tác booking / ticket của mình

**PII masking rules:**
- Phone: `0*** *** 789` (first digit + last 3). `SRS OQ-11`
- Email: mask local-part trừ 2 ký tự đầu
- CCCD / Passport: mask giữa, giữ 2 đầu + 2 cuối

## Invariants (luôn áp dụng)

- Backend là điểm quyết định cuối cùng cho auth / RBAC / tenant — không delegate về client. `Security §3.1`
- Admin phải dùng MFA cho mọi session. `Security §9, API-OP-01`
- Guest không có long-term session; phải verify email/phone cho thao tác nhạy cảm. `Security §10, SRS UC-35`
- Audit log PHẢI ghi cho: login/logout, sensitive action, state change tiền/ghế/vé, admin decision. `Security §14`
- File URL phải là signed URL có TTL — không expose permanent public URL. `Security §12, ADR-014`
- Webhook callback từ VNPay phải verify HMAC-SHA512 signature trước khi xử lý. `Security §13, API §20`
- Log KHÔNG được chứa PII / token / secret dạng plain text. `Security §11`

## Cross-references

- Skills liên quan: `api-contract` (auth header, scope per endpoint), `database-design` (session TTL, audit schema), `test-plan` (security test suite §10 — IDOR, RBAC, rate limit)
- `doc/SDLC/11-project-task-breakdown.md §8.2` — TASK-IAM-* cho implementation order IAM/Security
