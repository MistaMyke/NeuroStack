# NeuroStack CPA Monorepo

This monorepo hosts the marketing frontend (Next.js), the API backend (Express), and shared packages used across the stack. Development is designed to run under Docker so you do not need a local Node.js toolchain.

## Prerequisites

- Docker Engine 24+
- Docker Compose v2 (bundled with Docker Desktop / modern Docker Engine installs)

## First-Time Setup

If you previously ran installs on the host, clear them so Docker can manage the dependencies:

```bash
rm -rf node_modules apps/**/node_modules packages/**/node_modules
```

Then start the dev stack:

```bash
docker compose -f infra/docker/docker-compose.dev.yml up --build
```

The compose stack builds two images (frontend and backend), installs dependencies inside container-owned `node_modules` volumes, and starts the dev servers with hot reload. Source code changes on the host are mounted into the containers.

> **Note:** If you see `address already in use` for port `3000` or `4001`, stop the process currently bound to that port (e.g. `lsof -i :4001`) or update the host port mapping in `infra/docker/docker-compose.dev.yml`.

## Available Services

- Frontend: <http://localhost:3000>
- Backend health check: <http://localhost:4001/health>

The frontend container expects the backend to be reachable at `http://backend:4000` (configured via `NEXT_PUBLIC_API_URL`).

## Useful Commands

Inside the running containers you can execute the usual workspace scripts. For example, to open a shell in the backend container:

```bash
docker compose -f infra/docker/docker-compose.dev.yml exec backend sh
```

Then run commands such as `pnpm run test` or `pnpm run lint`.

To stop the stack and remove the dependency volumes:

```bash
docker compose -f infra/docker/docker-compose.dev.yml down -v
```

## Project Structure

- `apps/frontend/` – Next.js app with Tailwind.
- `apps/backend/` – Express API with Jest tests.
- `packages/` – Shared TypeScript packages (ESLint config, shared DTOs, UI library).
- `infra/docker/` – Dockerfiles, compose file, and entrypoints.
- `docs/` – Repository guidelines and operational docs.
