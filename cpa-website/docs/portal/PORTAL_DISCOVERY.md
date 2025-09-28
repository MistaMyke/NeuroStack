# Client Portal Discovery

_Last updated: September 20, 2025_

## 1. Goals & Users
- **Primary users:** existing VH Tax + Accounting clients (individual and business), New client sign up, internal staff for follow-up.
- **Primary goal:** give clients a single hub to exchange documents, settle balances, and get support.

## 2. Core Feature Set (MVP)
- **Document uploads/downloads**
  - Clients upload tax docs (PDF, XLS, images) with virus scanning + size limits(This may need to be a decent limit for larger tax documents.)
  - Staff share completed returns or notices; clients can download with audit trail.
- **Engagement status tracker**
  - Surfaces lifecycle states (e.g., _Received_ → _Reviewing_ → _Ready for Signature_ → _Filed_).
  - Clients see outstanding tasks or requests for more info.
- **Balance & payments**
  - Display current balance, prior payments, and due dates.
  - Integrate with a payment processor (Stripe, Square, or CPACharge) for card/ACH checkout.
- **Secure chat/messages**
  - This should be AI driven, with an option to not use AI for the client if they dont have an API.
  - Async messaging thread per engagement with staff notifications.
  - Email/SMS notifications optional; messages stored for compliance.

## 3. Non-Functional Requirements
- Handle PII/financial data per IRS Pub 4557 guidelines.
- Enforce MFA or magic-link auth with automatic session expiry.
- Encrypt at rest (S3 with SSE) and in transit (HTTPS only).
- Retain data per firm policy; allow export upon client request.

## 4. Integrations & Migration Considerations
- Current prep platform: **ATX** (desktop). Need plan to sync status/balances (manual import vs. eventual automation).
- Payment provider decision pending (Stripe vs. CPACharge).
- Notifications: evaluate Twilio SendGrid for email; SMS optional.

## 5. MVP Scope vs. Iterations
- **Phase 1 (MVP):** auth/login, document exchange, status tracker, balance display (manual entry), payment link out to processor, basic chat.
- **Phase 2:** automate balance sync, integrate with ATX exports, add real-time notifications, surface task checklists.
- **Phase 3:** analytics dashboard, document e-signatures, client onboarding workflow.

## 6. Technical Considerations & Open Questions
- **Authentication:** magic-link
- **Storage:** likely AWS S3 bucket with presigned URLs; explore encryption key management.
- **Chat:** build in-house (Postgres + websockets) or embed a secure provider? (Decision needed.) - {Im genuinely not sure what to do here.}
- **Audit logging:** define schema for access logs and staff actions.
- **Staff tooling:** admin UI needed for status updates and secure messaging.

### Staff/Admin Dashboard Outline
- **Audience:** internal VH Tax + Accounting team members only (no clients).
- **Authentication:** reuse the future portal auth (magic-link) with a `staff` role flag; consider IP allowlisting as an extra layer until the full auth stack is in place.
- **Primary views:**
  1. **Inbox:** table of recent contact requests (name, email, reason, received timestamp, current status). Filters for status, date range, and text search.
  2. **Request detail:** full message, contact info, status history, staff notes, and buttons for quick actions (mark In Progress, Completed, Archive, trigger follow-up email).
  3. **Activity log:** audit trail of status changes and notifications sent.
- **Workflow:**
  - Default new requests to `RECEIVED`.
  - Staff can assign themselves, change status, and add internal notes.
  - Optional follow-up actions: reply via email template, schedule call, or escalate to bookkeeping/tax team.
- **Notifications:** optional Slack/email alerts when a request is assigned or marked urgent.
- **Data model additions:**
  - `ContactRequestAssignment` (request_id, staff_user_id, assigned_at).
  - `ContactRequestNote` (request_id, staff_user_id, note_body, created_at).
  - Extend `ContactRequest` with `priority` (Normal/Urgent) and `lastContactedAt`.
- **MVP UI tech:** Next.js app route under `/staff/contact` guarded by middleware; reuse Tailwind UI components, add server-side pagination via Prisma.
- **Open questions:**
  - Which staff members need access at launch? (List emails for seeding.)
  - Do we need notifications when status stays `RECEIVED` for X hours?
  - Should completed requests auto-archive after a set period?

### Inputs Needed
- Preferred payment processor - Venmo and CashApp
- Expected volume of concurrent portal users? 1-5
- SLA for responding to client messages? - I need a deeper explanation
- Any compliance certifications targeted (e.g., SOC 2)? - Same as above

_Add notes or decisions directly in this doc as they’re made._
