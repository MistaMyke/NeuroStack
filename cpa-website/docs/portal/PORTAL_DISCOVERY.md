# Client Portal Discovery

_Last updated: February 25, 2026_

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
  - AI chatbot on public site + portal for FAQ/general guidance only.
  - No PII accepted; bot redirects to secure portal or staff ticket.
  - Async messaging thread per engagement with staff notifications.
  - Email/SMS notifications optional; messages stored for compliance.

## 3. Non-Functional Requirements
- Handle PII/financial data per IRS Pub 4557 guidelines.
- Enforce MFA or magic-link auth with automatic session expiry.
- Encrypt at rest (S3 with SSE) and in transit (HTTPS only).
- Retain data per firm policy; allow export upon client request.
- AI chat data handling: no PII, minimal retention, audit logging on escalations.

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
- **AI chatbot:** managed API default, grounded on curated FAQ + website content.
- **Audit logging:** define schema for access logs and staff actions.
- **Staff tooling:** admin UI needed for status updates and secure messaging.

## 7. Hosting & Deployment Model
- **Cloud-first:** managed app + DB in cloud; office just uses browser access.
- **Hybrid:** cloud app + office network/VPN + local cache/NAS for redundancy.
- **On-prem primary:** higher ops burden; only if required by policy or cost.
- **Decision factors:** budget, in-office internet reliability, internal IT capacity, compliance constraints.

## 8. Data Storage, Backups, and Retention
- **Database:** managed Postgres with point-in-time recovery.
- **Files:** S3-compatible object storage + presigned URLs + virus scanning.
- **Backups:** daily snapshots, weekly archives, and periodic restore tests.
- **Retention:** align with tax record retention policy (TBD).
- **Data residency:** US-only by default (TBD).

## 9. Security, Compliance, and Audit
- **Auth:** MFA or passkeys; session timeouts; secure account recovery.
- **Encryption:** TLS in transit; at-rest encryption; define key ownership.
- **Audit logs:** every file access, download, and status change.
- **Malware scanning:** scan uploads; quarantine failures.
- **Least privilege:** staff roles and approval gates for sensitive actions.

## 10. Identity, Accounts, and Support
- **Onboarding:** invite-only vs self-signup (decision).
- **Account linking:** connect portal accounts to existing client records.
- **Recovery:** support workflow for locked accounts and device changes.
- **Roles:** admin, reviewer, support; document permissions and approval flows.

## 11. Office/Hybrid Hardware Plan (Draft)
- **Network:** business firewall/router + segmented VLANs; guest Wi-Fi separated.
- **Core hardware:** small server or NAS for local cache/backups; UPS.
- **Endpoint security:** managed AV/EDR on office workstations.
- **Remote access:** VPN with MFA; avoid direct port forwarding.
- **Backups:** 3-2-1 rule (local + offsite + cloud), test restores quarterly.
- **Monitoring:** uptime, backup, and storage alerts.

## 12. Staff/Admin Dashboard Outline
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

## 13. Inputs Needed
- Preferred payment processor (Venmo, CashApp, Stripe, CPACharge, etc).
- Hosting preference (cloud-only, hybrid, or on-prem primary).
- Expected volume of concurrent portal users (current guess: 1-5).
- Expected document volume and max file sizes.
- SLA for responding to client messages (target windows and escalation).
- Compliance targets (SOC 2, FTC Safeguards, IRS Pub 4557, etc).
- Office constraints (existing hardware, static IP, internet upload speed).
- Budget range and desired launch timeline.

## 14. Discovery Questions (Detailed)
### Business Goals & Success
- What are the top 3 outcomes the portal must deliver in year 1?
- What business metrics define success (reduced phone calls, faster turnaround, fewer missing docs, payment collection rate)?
- Which services will the portal support at launch (tax prep, bookkeeping, payroll, notices)?
- Any seasonal peaks that affect rollout timing?

### Users & Roles
- Who are the primary users (individuals, small business owners, staff, partners)?
- What roles are needed (client, client admin, staff, reviewer, owner)?
- How many staff accounts at launch? Future growth expectations?
- Do clients need multiple users per business account?

### Access & Onboarding
- Invite-only or self-signup? Who approves new accounts?
- Required identity verification steps (phone, email, ID)?
- Account recovery flow (lost access, changed email)?
- Do you need client agreements/consent before access?

### Portal Features & Workflows
- Required features for MVP vs. nice-to-have?
- What status stages do you want visible to clients?
- What is the typical document request workflow today?
- Do you want task checklists per engagement?
- Should clients be able to upload multiple files per request?

### Document Handling
- Typical document types (PDF, XLS/XLSX, images, scans)?
- Maximum file sizes and total per engagement?
- Virus scanning requirements and quarantine handling?
- How long should documents be retained after completion?
- Should clients be able to delete uploads?

### Payments & Billing
- What payment methods are required (ACH, card, Venmo, CashApp, check)?
- Who handles payment disputes or chargebacks?
- Do you need invoices or receipts automatically emailed?
- Should balances be tracked inside the portal or external only?

### Messaging & Support
- Should clients message staff through the portal?
- Required response time expectations (SLA)?
- What escalation path is acceptable (ticket, email, call)?
- Should staff be notified via email/SMS/Slack?

### AI Chatbot
- What topics should the bot answer? (FAQ only vs. broader guidance)
- What sources should it use (curated FAQ, website content, internal docs)?
- How should it handle sensitive info (block, warn, redirect)?
- When should it create a staff ticket automatically?
- Should the bot be available on the public site, portal, or both?

### Integrations & Data Migration
- Any integrations needed at launch (ATX exports, CRM, accounting tools)?
- Will you import existing client data? If yes, from where and how?
- Do you need CSV import/export tools for staff?

### Compliance & Legal
- Which compliance frameworks must be met (IRS Pub 4557, FTC Safeguards, SOC 2)?
- Is there a WISP already in place or do we draft one?
- Data residency requirements (US-only, state-specific)?
- Required legal docs (privacy policy, terms, consent)?
- Incident response expectations (who owns, how fast to notify)?

### Security & Privacy
- MFA requirement for staff and clients?
- Passwordless vs. password-based auth preferences?
- Audit logging scope (logins, downloads, status changes)?
- Access controls for sensitive documents (e.g., returns)?
- Retention and deletion rules for logs?

### Hosting & Infrastructure
- Cloud provider preference (AWS, GCP, Azure)?
- Hybrid expectations (NAS, VPN, local cache)?
- Office internet reliability and upload speed?
- Backup cadence and restore testing requirements?
- Monitoring and alerting expectations?

### Operations & Support
- Who will administer the portal day-to-day?
- Do you need staff training or SOPs?
- Who handles user support tickets?
- Desired reporting (weekly activity summaries, usage stats)?

### Timeline & Budget
- Desired launch window for MVP and pilot?
- Budget range for initial build and monthly ops?
- Any licensing or vendor constraints?

### Branding & UX
- Preferred tone for portal and chatbot messaging?
- Accessibility requirements (WCAG 2.2 AA)?
- Do you want the portal to match the marketing site look and feel?

_Add notes or decisions directly in this doc as they’re made._
