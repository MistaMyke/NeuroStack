## 2025-09-20

### Added
- `POST /contact` endpoint in `@cpa/backend` with shared-schema validation and in-memory capture for future persistence.
- Frontend contact form submission workflow that calls the API, surfaces validation feedback, and uses the shared UI button component.
- Contact form now performs live validation with per-field errors and disables submit until all required data is valid.
- Frontend contact submissions fall back to the current origin when the configured API host is container-only, ensuring local Docker traffic reaches the backend.
- Contact API now fires an email notification (via Nodemailer) when new requests are saved; configure SMTP credentials through the new EMAIL_* env vars.
- Added staff-only endpoints (`GET/PATCH/POST /staff/contact-requests`) protected by access code + allowlisted emails, including status updates and internal notes persisted via the new `ContactRequestNote` table.
- Introduced `/staff/contact` admin dashboard in the frontend for reviewing requests, updating statuses, and recording notes (temporary email+code gate stored in localStorage until full auth ships).
- Prisma schema + migration scaffolding for persisting contact requests to Postgres, along with dockerized Postgres service for local dev.

### Changed
- Backend TypeScript configuration now targets CommonJS to simplify testing and workspace interop.

### Testing
- `pnpm test --filter @cpa/backend`
- `pnpm --filter @cpa/frontend lint`
- `pnpm --filter @cpa/backend run prisma:generate`
