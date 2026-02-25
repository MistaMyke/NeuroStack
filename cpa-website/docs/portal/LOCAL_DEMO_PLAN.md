# Local Demo Portal Plan (Zero-Cost)

## Purpose
Provide a full portal demo without paid services or office hardware by running everything locally via Docker.

## Demo Stack
- Postgres (existing)
- MinIO (S3-compatible storage)
- Backend demo auth + mock payments
- Frontend demo pages

## Demo Flow
1) Visit `/demo` and choose client or staff role.
2) Demo session is issued via cookie.
3) Upload/download documents through MinIO.
4) Simulate a payment (no real charges).

## Services
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4001`
- MinIO console: `http://localhost:9001`

## Swap-In Path
- Replace MinIO with S3.
- Replace demo auth with managed auth provider.
- Replace mock payments with Stripe/CPACharge.
