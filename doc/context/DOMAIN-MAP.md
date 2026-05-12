# DOMAIN-MAP

Mapping between marketplace business concepts (SRS) and codebase artifacts (target state). This file is written for the **rewrite strategy (Phương án A)** confirmed for the marketplace pivot: existing modules under `apps/backend/src/modules/` are treated as **legacy skeletons**, and the target backend layout follows the three service layers.

References:

- `@vi/SDLC/01-srs-he-thong-dat-ve-xe-khach` — SRS v1.19, sections §4, §7, §9, §10, §13, §16, §17, §21
- `@context/PROJECT-STRUCTURE` — current code layout snapshot
- `@context/GLOSSARY` — terminology

## 1. Three layers ↔ Backend module groups (target state)

| Layer                 | Backend module group (target)               | Primary SRS sections | Primary FR group |
| --------------------- | ------------------------------------------- | -------------------- | ---------------- |
| Marketplace layer     | `iam/`, `marketplace/`, `booking/`, `payment/`, `ticket/`, `notification/`, `support/`, `review/`, `dispute/` | §10.1 IAM, §10.2 MKT, §10.3 BTP, §10.9 NSR | `FR-IAM-*`, `FR-MKT-*`, `FR-BTP-*`, `FR-NSR-*`, `FR-DSP-*` |
| Operator OS layer     | `operator/`, `vehicle/`, `route/`, `stop-point/`, `trip/`, `fare/`, `promotion/`, `employee/`, `manifest/`, `finance/` (escrow + payout view) | §10.4 OPR, §10.5 OPS, §10.6 PROM, §10.7 EMP | `FR-OPR-*`, `FR-OPS-*`, `FR-PROM-*`, `FR-EMP-*` |
| Platform admin layer  | `admin/`, `catalog/`, `policy/`, `commission/`, `payout/`, `audit/`, `reporting/`, `search/` | §10.8 ADM, §10.9 NSR (admin parts) | `FR-ADM-*` |
| Cross-cutting         | `common/` (guards, interceptors, pipes), `database/`, `redis/`, `osrm/`, `external/` (payment, sms, email, storage adapters) | §11 NFR, §8 dependencies | `NFR-*` |

Notes:

- Each business module follows the NestJS pattern: `module.ts` + `controller.ts` + `service.ts` + `repository.ts` + `schema.ts` + `dto/`.
- Cross-cutting concerns (auth guard, tenant guard, rate limiter, audit interceptor) live in `common/`.
- External integrations are abstracted under `external/<provider>/` adapters so swapping VNPay, SMS provider or storage is non-breaking.

## 2. Entity groups (SRS §9.2) ↔ Target modules

| Entity group              | Target module(s)                               | Notes                                                                      |
| ------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| Identity & Access         | `iam/` (split: `auth/`, `user/`, `session/`, `role/`) | Owns User, Admin, Operator account, Employee account, Role, Session.       |
| Operator Profile & KYC    | `operator/` + `operator-kyc/`                  | Owns OperatorProfile, KycDocument, BankAccount, OperatorStatusHistory.     |
| Location & Catalog        | `catalog/`                                     | Province, Ward, StopPoint, VehicleType, Amenity, ContentPage.              |
| Transport Resource        | `vehicle/`, `route/`, `stop-point/`            | Vehicle, SeatMap, Seat, Route, RouteStop.                                  |
| Trip & Inventory          | `trip/`, `fare/`, `seat-hold/`                 | Trip, TripStop, TripSeat, SeatHold, Fare, FareRule.                        |
| Booking & Ticket          | `booking/`, `ticket/`                          | Booking, PassengerInfo, Ticket, TicketQrToken, BookingStatusHistory.       |
| Promotion & Campaign      | `promotion/`                                   | Promotion, PromotionRule, PromotionRedemption, PromotionUsageLimit.        |
| Payment, Escrow & Payout  | `payment/`, `refund/`, `escrow/`, `payout/`, `commission/` | Payment, Refund, EscrowLedger, CommissionRule, Payout, ReconciliationRecord. |
| Operation & Check-in      | `manifest/`, `check-in/`, `journey-log/`, `incident/` | CheckInEvent, JourneyLog, IncidentReport, EmployeeAssignment.        |
| Support & Trust           | `support/`, `complaint/`, `review/`, `dispute/`, `scorecard/` | SupportTicket, Complaint, Review, DisputeCase, OperatorScorecard.   |
| Notification & Audit      | `notification/`, `audit/`, `policy/`           | Notification, NotificationDelivery, NotificationPreference, AuditLog, PolicyVersion, PolicySnapshot. |

## 3. Actor ↔ Client app

| Actor    | Primary client                                      | Notes                                                                  |
| -------- | --------------------------------------------------- | ---------------------------------------------------------------------- |
| User     | `apps/frontend` route group `(public)` + `apps/mobile` | Search, booking, ticket, profile, review, complaint. Mobile passenger app requires registered / logged-in User account. |
| Guest    | `apps/frontend` route group `(public)` only             | Web-only guest checkout / lookup: search, hold seat, book, pay, lookup ticket; no long-term history. |
| Operator | `apps/frontend` route group `(operator)` + `(operator-auth)` | Operator OS layer entry.                                          |
| Employee | `apps/mobile` (employee mode) and / or `apps/frontend` operator portal sub-section | Check-in, manifest, status update, journey log, incident.   |
| Admin    | `apps/frontend` route group `(admin)`               | Platform admin layer entry; no mobile app for v1.                      |

## 4. External system actors (SRS §7.6) ↔ Adapter location

| External actor | Backend adapter (target) | Decision reference |
| -------------- | ------------------------ | ------------------ |
| Cổng thanh toán (VNPay) | `external/payment/vnpay/` | `OQ-05`; v1 uses VNPay Sandbox first |
| Dịch vụ thông báo email | `external/notification/email/` | `OQ-09`; v1 uses email OTP / email notification contract |
| Dịch vụ thông báo SMS | `external/notification/sms/` | Adapter boundary only; SMS OTP is outside v1 baseline |
| Push notification | `external/notification/push/` | Adapter boundary only; push provider is not fixed in SRS v1 |
| Dịch vụ định tuyến | `external/routing/osrm/` | Existing folder `modules/osrm/` will be moved here |
| Object storage | `external/storage/` | HLD-OQ-01 closed: use S3-compatible storage through adapter; production baseline AWS S3 private bucket, local/dev MinIO; required for KYC, attachment and report export contracts |
| Bank payout channel | `external/payout/` | `OQ-16`; v1 uses direct bank transfer with Admin manual confirmation |

## 5. Current code vs. target (refactor radar)

Status snapshot at SRS v1.19 / Decision: rewrite (Phương án A):

| Current module folder                    | Target folder(s)                                | Refactor type             |
| ---------------------------------------- | ----------------------------------------------- | ------------------------- |
| `modules/auth/` + `modules/users/`       | `iam/auth/`, `iam/user/`, `iam/session/`, `iam/role/` | Refactor + extend       |
| `modules/admin/` (empty)                 | `admin/`, `policy/`, `commission/`, `payout/`, `audit/`, `reporting/`, `catalog/`, `search/` | Rewrite as multiple modules |
| `modules/bookings/` (interface only)     | `booking/`                                      | Rewrite with schema       |
| `modules/buses/` (enum only)             | `vehicle/`                                      | Rewrite + rename          |
| `modules/employees/` (enum only)         | `employee/`                                     | Rewrite                   |
| `modules/operators/`                     | `operator/`, `operator-kyc/`                    | Rewrite + split           |
| `modules/osrm/`                          | `external/routing/osrm/`                        | Move                      |
| `modules/redis/`                         | `common/redis/` or `database/redis/`            | Move                      |
| `modules/routes/`                        | `route/`                                        | Rewrite                   |
| `modules/search/`                        | `search/`                                       | Rewrite                   |
| `modules/stop-points/`                   | `stop-point/` and `catalog/stop-point/`         | Rewrite + split (Operator-owned vs Platform-catalog) |
| `modules/trips/` (interface only)        | `trip/`, `trip-seat/`, `seat-hold/`             | Rewrite + split           |
| — (not present)                          | `fare/`, `promotion/`, `payment/`, `refund/`, `escrow/`, `payout/`, `commission/`, `notification/`, `support/`, `complaint/`, `review/`, `dispute/`, `scorecard/`, `manifest/`, `check-in/`, `journey-log/`, `incident/`, `audit/`, `policy/`, `catalog/`, `reporting/` | Net new modules |

Approximate impact: ~10% of current code reused, ~20% migrated with breaking changes, ~70% net new.

## 6. State enum alignment

Per `OQ-01..03` decisions, code state enums must align with SRS §17:

| Enum / state group | Target values (SRS §17) | Owning module |
| ------------------ | ----------------------- | ------------- |
| Trip status | DRAFT, OPEN_FOR_SALE, SOLD_OUT, LOCKED, BOARDING, DEPARTED, IN_PROGRESS, COMPLETED, CANCELLED, INCIDENT | `trip/` |
| TripSeat status | AVAILABLE, HOLDING, BOOKED, CHECKED_IN, BLOCKED | `trip-seat/` |
| SeatHold outcome | ACTIVE, CONSUMED, RELEASED, EXPIRED | `seat-hold/` |
| Booking status | PENDING_PAYMENT, PENDING_CONFIRMATION, PAID, CONFIRMED, PARTIALLY_CANCELLED, CANCELLED, EXPIRED, REFUND_PENDING, REFUNDED, REFUND_FAILED | `booking/` |
| Ticket status | VALID, CANCELLED, CHECKED_IN, NO_SHOW, USED, REFUNDED | `ticket/` |
| Payment status | INITIATED, PROCESSING, SUCCESS, FAILED, EXPIRED, CANCELLED, RECONCILING | `payment/` |
| Refund status | REQUESTED, APPROVED, PROCESSING, SUCCESS, FAILED, REJECTED | `refund/` |
| Payout status | PENDING_REVIEW, ON_HOLD, READY_TO_TRANSFER, TRANSFERRING, PAID, FAILED, CANCELLED | `payout/` |
| Support / complaint status | OPEN, TRIAGED, WAITING_USER, WAITING_OPERATOR, IN_PROGRESS, ESCALATED_TO_DISPUTE, RESOLVED, CLOSED | `support/`, `complaint/` |
| Dispute status | OPEN, WAITING_USER_EVIDENCE, WAITING_OPERATOR_RESPONSE, UNDER_REVIEW, ESCALATED, RESOLVED_REFUND, RESOLVED_NO_REFUND, CLOSED | `dispute/` |
| Notification delivery status | PENDING, SENT, FAILED, RETRYING, SKIPPED | `notification/` |
| Background job status | PENDING, RUNNING, SUCCEEDED, PARTIAL, FAILED, RETRYING, MANUAL_REVIEW | `job/`, `reconciliation/`, `reporting/` |

Code shared in `packages/shared-types/` should expose these enums for frontend, mobile and backend.

## 7. Tenant boundary requirements

For every entity owned by an Operator (entity groups 4–11 above except platform catalog), the schema must carry `operatorId` and every query / mutation must enforce tenant filter via guard or repository layer. This is a cross-cutting requirement defined by `FR-OPR-11`, `FR-IAM-06` and `DM-01` (SRS §9.1).

## 8. V1 implementation anchors

These anchors are closed SRS decisions that downstream design documents must not reopen unless the reviewer explicitly changes SRS.

| Topic | V1 anchor | Source |
| ----- | --------- | ------ |
| Marketplace model | Managed marketplace with Marketplace layer, Operator OS layer and Platform admin layer. | `MQ-05` |
| Checkout actor | Guest can hold seats, create booking, pay and lookup ticket via guest session; sensitive actions require verification. | `BR-21`, `UC-04..08`, `UC-35` |
| Payment | VNPay Sandbox is the first payment provider; integration must still use adapter boundary. | `OQ-05`, `BR-63` |
| Seat hold | Default TTL is 10 minutes at Platform level; no per-Operator TTL in v1. | `OQ-06`, `BR-02` |
| Passenger checkout | Pay-first flow is default; `PENDING_CONFIRMATION` is kept for exceptional / future operations, not public checkout. | `OQ-07`, `BR-04` |
| Fare | Fare / FareRule are separate data concepts; booking stores fare snapshot; segment fare is outside baseline v1. | `OQ-08`, `BR-40..41` |
| Refund policy | Platform default policy with Admin-approved Operator override; booking stores policy snapshot. | `OQ-13`, `BR-07` |
| Audit | Audit log is append-only in MongoDB same cluster for v1. | `OQ-14`, `BR-58..59` |
| Reporting | MongoDB aggregation plus async jobs for large reports. | `OQ-15`, `BR-56`, `BR-62` |
| Payout | T+3 after completed trip, no minimum threshold, direct bank transfer, Admin manual confirmation. | `OQ-16`, `BR-32..33` |
| Commission | Default commission is 5% for new Operators; Admin can override by effective rule. | `OQ-18`, `BR-31` |
