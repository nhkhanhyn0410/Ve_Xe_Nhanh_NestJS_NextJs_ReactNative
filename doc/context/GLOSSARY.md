# GLOSSARY

Bilingual (English ↔ Vietnamese) glossary for the managed marketplace project. Source of truth for naming consistency across SRS, HLD, LLD, DB Design, API Spec, code identifiers and conversations.

Rules:

- Vietnamese SDLC documents (`vi/SDLC/*`) use the Vietnamese term.
- Code, API and database identifiers use the English term.
- When in doubt, the English term wins for technical artifacts.

## 1. Actors

| English  | Vietnamese        | Definition                                                                                                                        |
| -------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| User     | Người dùng        | Passenger who has an account on the platform; can buy, manage and review tickets.                                                 |
| Guest    | Khách vãng lai    | Passenger who has not logged in or has no account; uses guest session for browsing, holding seats, booking, paying and lookup.    |
| Operator | Nhà xe            | Transport business onboarded onto the platform; owns and runs vehicles, routes, trips, fares and employees within its own tenant. |
| Employee | Nhân viên nhà xe  | Operator-internal staff with role `TICKET_STAFF`, `DRIVER` or `SUPPORT_STAFF`; logs in via operator-issued credentials.            |
| Admin    | Admin toàn hệ thống | Platform administrator running the marketplace; final arbiter for disputes; manages KYC, policy, commission, payout.            |
| Platform | Nền tảng          | The marketplace operator itself; not a transport company; provides Marketplace / Operator OS / Platform admin layers.             |

## 2. Service layers

| English             | Vietnamese        | Definition                                                                                       |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| Marketplace layer   | Lớp marketplace   | Passenger-facing surface: search, booking, payment, ticket, review, complaint, dispute, lookup.  |
| Operator OS layer   | Lớp Operator OS   | Operator and employee toolset: profile, finance, vehicle, route, trip, fare, employee, manifest. |
| Platform admin layer| Lớp Platform admin| Platform governance: KYC, catalog, policy, commission, payout, monitoring, audit, moderation.    |

## 3. Domain entities

| English                | Vietnamese                 | Definition                                                                                            |
| ---------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------- |
| Vehicle                | Phương tiện                | A physical bus owned by an Operator; carries plate, type, amenities, seat map.                        |
| VehicleType            | Loại phương tiện           | Standardized vehicle category (e.g. seater, sleeper, limousine, cabin).                               |
| Seat                   | Ghế / giường               | A seat or berth slot defined within a SeatMap.                                                        |
| SeatMap                | Sơ đồ ghế                  | Layout describing seats / berths of a Vehicle.                                                        |
| Route                  | Tuyến đường                | A logical route between two endpoints, composed of ordered RouteStops.                                |
| StopPoint              | Điểm đón / trả             | A pickup or drop-off location in the platform catalog.                                                |
| Trip                   | Chuyến xe                  | A concrete operating instance of a Route on a specific date / time, served by a Vehicle and crew.     |
| TripStop               | Điểm dừng của chuyến       | An ordered stop within a Trip.                                                                        |
| TripSeat               | Ghế của chuyến             | A seat allocation for a specific Trip, with its own status lifecycle.                                 |
| Fare / FareRule        | Giá vé / quy tắc giá vé    | Pricing rules per route, trip, seat type, segment or time window.                                     |
| Booking                | Đơn đặt vé                 | A purchase order placed by User or Guest; may contain one or more Tickets and a policy snapshot.      |
| PassengerInfo          | Thông tin hành khách       | Per-passenger information captured in a Booking.                                                      |
| Ticket                 | Vé điện tử                 | An electronic ticket representing one passenger on one seat of one Trip; carries a QR token.          |
| SeatHold               | Bản giữ ghế                | A time-bound, atomic hold on one or more seats during checkout; v1 default TTL is 10 minutes at Platform level. |
| Payment                | Giao dịch thanh toán       | A payment intent / record for a Booking; v1 integrates VNPay Sandbox first through a payment adapter. |
| Refund                 | Giao dịch hoàn tiền        | A refund record linked to a Booking / Ticket / Payment; processed by policy, Admin action or dispute decision. |
| EscrowLedger           | Sổ cái escrow              | Append-only ledger tracking incoming, held, refunded and paid-out amounts owed to an Operator.        |
| Commission / CommissionRule | Hoa hồng / quy tắc hoa hồng | Platform-defined percentage / fee taken on each successful ticket sale.                       |
| Payout                 | Khoản chi trả cho nhà xe   | A scheduled transfer from Platform escrow to Operator bank account on cycle T+3 after trip completion; v1 uses direct bank transfer with Admin manual confirmation. |
| Promotion              | Khuyến mãi                 | A discount campaign with rules, validity window, usage limits; can be Platform-level or Operator-level. |
| PromotionRedemption    | Lượt áp dụng khuyến mãi    | Snapshot record created when a Promotion is applied to a Booking.                                     |
| Review                 | Đánh giá                   | A passenger review of a completed trip / Operator; subject to moderation policy.                      |
| OperatorScorecard      | Điểm chất lượng nhà xe     | Aggregated quality metric for an Operator (rating, cancel rate, complaint rate, on-time, no-show).    |
| SupportTicket / Complaint | Phiếu hỗ trợ / khiếu nại| A support or complaint case created by User or verified Guest.                                        |
| DisputeCase            | Hồ sơ tranh chấp           | A formal dispute with its own state machine; Platform admin is final arbiter (MQ-03).                 |
| Notification           | Thông báo                  | An outbound message via email, SMS, push or in-app channels.                                          |
| NotificationPreference | Cấu hình nhận thông báo    | Per-actor preference for non-mandatory notifications; mandatory ones cannot be fully disabled.        |
| AuditLog               | Nhật ký kiểm toán          | Append-only log of sensitive actions: actor, time, action, target, before / after, reason.            |
| KycDocument            | Hồ sơ KYC                  | Legal document submitted by an Operator during onboarding; verified by Admin.                         |
| PolicySnapshot         | Bản chụp chính sách        | Snapshot of policy values applied to a Booking at creation time; never overwritten retroactively.     |

## 4. Cross-cutting and technical terms

| English          | Vietnamese                       | Definition                                                                                              |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Tenant           | Phạm vi nhà xe                   | Data isolation boundary keyed by `operatorId`; Operator A cannot read Operator B's data.                |
| RBAC             | Phân quyền theo vai trò          | Role-Based Access Control; primary authorization mechanism.                                             |
| Snapshot         | Bản chụp dữ liệu                 | Immutable copy of pricing, policy, route or trip data stored on a Booking; protects against retroactive change. |
| Idempotency      | Tính bất biến khi gọi lặp        | Property that retried operations (callbacks, jobs, refunds) produce the same result without duplicates. |
| Idempotency key  | Khóa idempotency                 | A unique reference attached to a callback / job to prevent duplicate processing.                        |
| TTL              | Thời gian tồn tại                | Time-to-live for SeatHold and similar short-lived resources.                                            |
| OTP              | Mật khẩu một lần                 | One-Time Password for sensitive verification flows.                                                     |
| Guest session    | Phiên khách vãng lai             | Short-lived session used by Guest for seat hold, booking, payment and ticket lookup without a registered account. |
| QR token         | Mã QR vé                         | Server-verifiable, non-guessable token embedded in QR code used for ticket check-in.                    |
| Manifest         | Danh sách hành khách             | Per-trip passenger list shown to Employee for boarding and check-in.                                    |
| Adjustment       | Điều chỉnh giao dịch             | A manual financial correction in escrow ledger; always audited.                                         |
| Reconciliation   | Đối soát giao dịch               | Process of matching internal state with payment provider state and external bank transfers.             |
| Escrow           | Tiền giữ hộ của Platform         | Funds held by Platform between successful payment and payout to the Operator.                           |
| KYC              | Xác minh hồ sơ nhà xe            | Know-Your-Customer process; gate for Operator going public on the marketplace.                          |
| VNPay Sandbox    | Môi trường thử nghiệm VNPay      | First payment gateway environment for v1 integration and testing; no real-money transaction in SRS scope. |

## 5. Document and process labels

| English | Vietnamese          | Definition                                                                  |
| ------- | ------------------- | --------------------------------------------------------------------------- |
| FR      | Yêu cầu chức năng   | Functional Requirement; carries a stable ID and traces into design / tests. |
| NFR     | Yêu cầu phi chức năng | Non-Functional Requirement.                                                |
| BR      | Quy tắc nghiệp vụ   | Business Rule.                                                              |
| UC      | Trường hợp sử dụng  | Use Case.                                                                   |
| AC      | Tiêu chí nghiệm thu | Acceptance Criteria.                                                        |
| OQ      | Câu hỏi mở          | Open Question. Either still open or marked as decided.                      |
| MQ      | Câu hỏi marketplace | Marketplace-strategic decision question; subset of OQ but tracked separately.|
| ADR     | Bản ghi quyết định kiến trúc | Architecture Decision Record.                                       |
