# Portal MVP Plan — Cloud-First with Hybrid Roadmap + Client AI Chatbot

## Summary
Build a secure client portal MVP in the existing Next.js/Express monorepo with invite-only access, document exchange, status tracking, and payments. Add a client-facing AI chatbot on the public site and portal, grounded on curated FAQs plus website content, with strict no-PII handling and staff ticket escalation. Launch on managed cloud services with compliance-grade controls. Define a hybrid phase that adds office NAS backups and VPN access without moving primary hosting on-prem.

## Goals & Success Criteria
- Clients log in via email magic link and upload/download documents.
- Staff can manage client accounts, view/upload documents, and update engagement status.
- Payments can be collected via a single primary provider (decision gate), with Venmo/CashApp as fallback.
- Audit logs capture access/download actions.
- AI chatbot answers FAQ/general guidance and escalates to staff when needed.
- Meets IRS Pub 4557 + FTC Safeguards baseline; design aligned with future SOC 2.

## Scope
In scope (MVP):
- Auth (invite-only magic link) via managed provider.
- Client dashboard: doc upload/download, status view, payment link.
- Staff admin: invite users, manage docs, update status.
- File storage with presigned URLs + malware scanning.
- Audit logging.
- Basic notifications (email).
- AI chatbot on public site + portal.

Out of scope (MVP):
- Personalized AI (no account-specific or PII answers).
- Real-time live chat.
- Automated ATX sync.
- On-prem app hosting.

## Architecture (Cloud-First)
- Frontend: Next.js app under `apps/frontend`.
- Backend API: Express under `apps/backend`.
- Auth: Managed provider (Auth0/Clerk-style) with magic links.
- DB: Managed Postgres (PITR enabled).
- Files: S3-compatible object storage with SSE + presigned URLs.
- Virus scanning: async scan pipeline (worker/Lambda + ClamAV).
- AI: Managed API model; prompt + retrieval over curated FAQ and website content.

## AI Chatbot Design
- Placement: public site + portal.
- Scope: FAQ + general guidance only.
- Knowledge base: curated FAQ + selected website pages.
- PII policy: do not accept PII; detect and warn; redirect to secure portal or staff.
- Escalation: create staff ticket/email when bot can’t answer.
- Tone: friendly, conversational; explicit disclaimers against tax advice.

## Hybrid Roadmap (Phase 2)
- Office NAS with encrypted backups of file storage (scheduled sync).
- Site-to-site VPN or client VPN for staff access to internal tools.
- Local cache only; no on-prem app hosting in Phase 2.

## Product Flows
1) Invite: Staff creates client → email magic link → user completes profile.
2) Upload: Client uploads doc → stored → scanned → status update.
3) Download: Client accesses completed docs → audit log on access.
4) Status: Staff updates engagement status (Received → Reviewing → Ready → Filed).
5) Payments: Client sees balance + “Pay Now” link → external checkout.
6) AI: Client asks question → bot retrieves FAQ/site content → answer + escalation option.

## Data Model (New or Extended)
- User (id, email, role, status)
- ClientProfile (user_id, name, phone, address, firm_ref)
- Engagement (client_id, status, tax_year, notes)
- Document (engagement_id, uploader_id, filename, mime, size, storage_key, scan_status)
- AuditLog (user_id, action, entity_type, entity_id, created_at)
- PaymentRecord (client_id, provider, amount, status, external_ref)
- AiConversation (session_id, channel, last_intent, created_at)
- AiTicket (session_id, user_id/email, summary, created_at, status)

## API/Interface Changes
- Auth integration endpoints (callback, session).
- `POST /api/clients/invite`
- `GET /api/clients/:id`
- `POST /api/engagements/:id/documents` (presigned URL)
- `GET /api/engagements/:id/documents`
- `POST /api/engagements/:id/status`
- `POST /api/payments/create-link`
- `GET /api/audit` (staff only)
- `POST /api/ai/chat` (public + portal, no PII)
- `POST /api/ai/ticket` (escalation)

## Vendor Decision Gate (Payments)
- Decision checkpoint before implementation: evaluate Stripe vs CPACharge vs Venmo/CashApp fallback.
- Criteria: PCI scope, reconciliation, ACH support, fees, client preference.

## Security & Compliance Controls
- MFA or magic-link + short sessions.
- TLS everywhere, at-rest encryption.
- Audit log required for doc access.
- Malware scanning before file is visible to client/staff.
- WISP + incident response checklist documented in `docs/portal/SECURITY.md`.
- AI data handling: no PII; log redaction; retention limits.

## Testing & Validation
- Unit tests: auth guards, permissions, audit logging, AI PII filter.
- Integration tests: document upload + scan flow; presigned URLs.
- Security tests: access control (client vs staff), expired links.
- AI tests: FAQ retrieval accuracy; PII detection; escalation ticket creation.
- Manual checks: 100MB file upload, download, status updates.
- Compliance check: WISP review, access logging verified.

## Rollout Plan
- Phase 0: Finalize vendor choices + infra setup.
- Phase 1: MVP build + internal testing with seeded clients.
- Phase 2: Limited pilot (5–10 clients).
- Phase 3: Full rollout + hybrid backup setup.

## Documentation Updates (Required)
- Update `docs/portal/PORTAL_DISCOVERY.md` with AI scope decisions.
- Expand `docs/portal/SECURITY.md` with AI data handling + WISP details.
- Add `docs/portal/RUNBOOK.md` with ops/start/backup procedures.
- Log decisions in `docs/portal/DECISIONS.md`.

## Assumptions & Defaults
- Cloud-first MVP; hybrid only in Phase 2.
- Managed auth provider is acceptable.
- Managed AI API default (review before launch).
- No PII accepted by chatbot.
- File size limit 100MB.
- Medium scale (50–500 clients).
- Budget target ≤ $5k for MVP infra and tooling.
