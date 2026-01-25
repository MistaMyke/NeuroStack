# NeuroStack Root — Agent Guidelines

## Purpose
NeuroStack is the main working directory for multiple projects (personal + client). Keep changes organized, documented, and easy to resume.

## Repo Map
- `/portfolio` — React + Vite portfolio site.
- `/cpa-website` — CPA monorepo (Next.js frontend + Express backend).
- `/infra/n8n` — Local n8n stack (Docker Compose).
- `/docs` — Project logs, decisions, resources, templates.

## Default Workflow
1) Identify the target project folder.
2) Check or create project docs under `docs/<project>/`.
3) Make changes; keep commits focused.
4) Update `PROJECT_LOG.md` for notable work and `DECISIONS.md` when a choice affects scope, architecture, or workflow.
5) If work touches infrastructure, data, or security, also update `SECURITY.md` or the project runbook.

## Documentation Standards
- Use templates in `docs/templates/project-docs/`.
- For lightweight projects (e.g., portfolio), only require:
  - `PROJECT_LOG.md`
  - `DECISIONS.md`
- For client/security-sensitive projects (e.g., CPA):
  - `PROJECT_LOG.md`, `DECISIONS.md`, `RESOURCES.md`, `SECURITY.md`
- Store detailed runbooks under `docs/<project>/RUNBOOK.md` when needed.

## Run / Dev (Quick Pointers)
- Portfolio: `cd portfolio && npm run dev` (or Docker if preferred).
- CPA: `cd cpa-website && docker compose -f infra/docker/docker-compose.dev.yml up --build` (prefer Docker for consistency).
- n8n: `npm run n8n:up` (from repo root)

## Git Hygiene
- Avoid committing generated artifacts (`.next`, `.vite`, local DBs, build outputs).
- Keep commits small and descriptive; one intent per commit.
- Prefer `main` for active work unless a branch is explicitly needed.

## Safety
- Ask before deleting data, running destructive commands, or changing infra defaults.
- Flag any security/compliance implications early.

## Accessibility & Compliance (When Relevant)
- ADA / WCAG 2.2 AA target for public-facing sites.
- Follow IRS + FTC Safeguards guidance for tax/financial data.
- Document security posture and vendor responsibilities for client-facing systems.
