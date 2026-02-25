# Portal Decisions

_No decisions recorded yet. Add decisions here as they are made._

## 2026-02-25 - MVP AI Chatbot Scope
- Decision: Launch a client-facing AI chatbot on the public site + portal for FAQ/general guidance only, with no PII allowed.
- Rationale: Reduces risk while offering quick answers; keeps account-specific requests in the secure portal.
- Consequences: Requires PII detection/redaction and escalation flow; avoids personalized responses in MVP.
- Date: 2026-02-25

## 2026-02-25 - Hosting Model for MVP
- Decision: Cloud-first MVP with a hybrid (NAS + backups + VPN) roadmap.
- Rationale: Faster launch and lower operational overhead while preserving an office-ready path.
- Consequences: On-prem hosting deferred; backups and VPN are Phase 2.
- Date: 2026-02-25

## 2026-02-25 - Local Demo Stack
- Decision: Use a local Docker demo stack (Postgres + MinIO + mock payments + demo auth) for previews without paid services.
- Rationale: Enables progress demos and iteration before committing to vendor costs or office hardware.
- Consequences: Demo-only auth; data is not production-ready; requires migration to real vendors later.
- Date: 2026-02-25

## Template
- Decision:
- Rationale:
- Consequences:
- Date:
