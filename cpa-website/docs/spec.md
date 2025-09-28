# Project Spec (Living Document)

## 1) Overview
Goal: Deliver a marketing experience for VH Tax + Accounting with a guided contact intake flow and light staff tooling so leads move from web form submission into a review queue that the team can action quickly.

Non-goals:
- Building a full-featured CRM or scheduling portal.
- Implementing native mobile apps.
- Managing billing, invoices, or payments within this codebase.

## 2) Interfaces

### Public API (Express @ apps/backend)
- `GET /health` → `200 { status: "ok" }` for uptime probes.
- `POST /contact`
  - Request body: `{ name: string; email: string; phone?: string; reason?: string; message: string }` validated by `@cpa/shared-types/contactRequestSchema`.
  - Success: `202 { status: "received" }` and queues email notification; transient notifier failures are logged but do not block the response.
  - Errors:
    - `400 { error: "invalid_request", fieldErrors, formErrors }` when validation fails.
    - `500 { error: "unable_to_process" }` for persistence or notifier failures.
### Staff API (Express guarded routes)
- Requires headers `x-staff-email` and `x-staff-access`, validated against `STAFF_ALLOWED_EMAILS` and `STAFF_ACCESS_CODE`.
- `GET /staff/contact-requests?status=ALL|RECEIVED|IN_PROGRESS|COMPLETED|ARCHIVED`
  - Response: `200 { results: ContactRequest[] }`.
  - `503` if staff access is not configured.
- `PATCH /staff/contact-requests/:id`
  - Body `{ status: ContactStatus }`.
  - `200 { status }` on success; `400` for invalid status; `404` if not found.
- `POST /staff/contact-requests/:id/notes`
  - Body `{ body: string }` (≥2 chars).
  - `201 { note }` on success; `400` invalid note; `404` not found.
### Frontend (Next.js @ apps/frontend)
- Static marketing pages (`/`, `/about`, `/services`, `/services/[slug]`, `/portal`) backed by Tailwind design system.
- Contact CTA directs to phone/email today; future iterations may POST to `/contact` via fetch.
- Shared metadata, FAQs, and services definitions live under `src/lib`.
### Shared Packages
- `@cpa/shared-types` exposes Zod schemas/DTOs for API validation.
- `@cpa/ui-library` provides reusable React UI primitives used across pages.

## 3) Data Model
- `ContactRequest`: `id`, `name`, `email`, optional `phone`/`reason`, `message`, `status` (enum `RECEIVED | IN_PROGRESS | COMPLETED | ARCHIVED`), timestamps, and relation to `ContactRequestNote`.
- `ContactRequestNote`: `id`, `contactRequestId`, `staffEmail`, `body`, `createdAt`; cascades on request deletion.
- PostgreSQL connection string supplied via `DATABASE_URL`; Prisma migrations govern schema evolution.

## 4) Acceptance Tests
- Submitting a valid contact request persists the record and returns `202`.
- Invalid contact payload returns `400` with field-level errors from Zod.
- Staff list endpoint returns `503` when access headers are unset but env vars are missing.
- Staff list endpoint returns filtered results when provided valid credentials and `status` query.
- Updating contact status to an invalid value rejects with `400`.
- Adding a staff note with short/empty body rejects with `400`.
- Adding a staff note with valid credentials returns `201` including the note payload.
- Frontend renders essential firm metadata (phone, address, services) without runtime errors in production build.
- Frontend JSON-LD schema embeds firm contact information on the home page.
