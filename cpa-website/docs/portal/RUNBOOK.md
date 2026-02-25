# Portal Runbook (Draft)

## Dev Start
- `docker compose -f infra/docker/docker-compose.dev.yml up --build`
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4001/health`
- MinIO (S3 demo): `http://localhost:9001` (console)

## AI Chat Endpoints
- `POST /ai/chat` (public + portal)
- `POST /ai/ticket` (escalation)

## Demo Portal Endpoints
- `POST /demo/login` (role: client | staff)
- `GET /demo/me`
- `POST /demo/seed`
- `GET /portal/engagements`
- `POST /portal/engagements/:id/documents/presign`
- `POST /portal/documents/:id/confirm`
- `GET /portal/documents/:id/download`
- `POST /payments/mock/create`
- `POST /payments/mock/complete`

## Env Vars (Backend)
- `AI_PROVIDER=faq|openai`
- `AI_MODEL=gpt-4o-mini`
- `OPENAI_API_KEY=` (optional)
- `DEMO_MODE=true`
- `S3_ENDPOINT=http://localhost:9000`
- `S3_BUCKET=portal-demo`

## Operational Notes
- AI chatbot is FAQ/general guidance only; no PII allowed.
- Escalations create a contact request and send the staff notification email if configured.
- Demo mode uses a cookie-based session and MinIO for local file storage.
