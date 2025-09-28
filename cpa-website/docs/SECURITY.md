## 2025-09-20 — Contact Submission Endpoint

- The new `POST /contact` route validates name, email, phone (optional), reason, and message via the shared Zod schema before enqueuing.
- Phone input is limited to digits, spaces, parentheses, plus, and hyphen characters to prevent malformed data entering downstream systems.
- Submissions are buffered in-memory only; no data is persisted across restarts. Hook into an external queue or notification service before launch to avoid data loss.
- Frontend requests rely on `NEXT_PUBLIC_API_URL`; deployers must ensure this value points at an HTTPS origin and that CORS is restricted if the site is hosted on a separate domain.
- Email notifications use SMTP credentials supplied via environment variables—store Gmail app passwords or provider API keys in the secrets manager for production. Rotate and audit usage regularly.
- Staff dashboard currently uses an access code + allowlisted emails. Treat `STAFF_ACCESS_CODE` like a secret and rotate it when team changes; once full auth lands, replace this temporary gate with the production magic-link workflow.
