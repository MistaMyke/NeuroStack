# Repository Guidelines

## Project Structure & Module Organization
- `apps/frontend/` – Next.js + Tailwind UI. Place pages under `src/pages`, shared view logic in `src/components`, domain hooks/utilities in `src/lib`.
- `apps/backend/` – Express API. Route handlers live in `src/routes`, business logic in `src/services`, DB access in `src/db`, and cross-cutting helpers in `src/middleware` and `src/utils`.
- `packages/` – Shared TypeScript libraries. Use `shared-types` for DTOs/Zod schemas, `ui-library` for reusable components, and `eslint-config` for lint presets.
- `docs/` – Living documentation (`AGENTS.md`, `CHANGELOG.md`, Postman exports under `api-tests/`).
- `infra/` – Dockerfiles, Terraform stacks, deploy scripts, and operational runbooks.

## Build, Test, and Development Commands
```bash
pnpm install                # Install workspace dependencies
pnpm dev --filter frontend  # Run frontend dev server (port 3000)
pnpm dev --filter backend   # Start API with hot reload (port 4000)
pnpm build                  # Build all workspaces
pnpm test --filter backend  # Run backend Jest + Supertest suite
pnpm lint                   # Apply shared ESLint config across apps/packages
```
Prefix commands with `pnpm --filter <target>` when you need to scope to a single package.

## Coding Style & Naming Conventions
- TypeScript everywhere; prefer explicit return types on exported functions.
- Use 2-space indentation, Prettier defaults, single quotes, and trailing commas.
- Components: PascalCase (`ClientDashboard.tsx`); hooks/utilities: camelCase (`useInvoiceUpload.ts`).
- Maintain domain-driven folders (e.g., `src/services/leads/LeadService.ts`).

## Testing Guidelines
- Backend: Jest + Supertest for API contracts; name files `*.spec.ts` alongside source.
- Frontend: Playwright smoke tests under `apps/frontend/tests/`; story-driven component checks in Storybook when added.
- Aim for 80% statement coverage on critical modules; document exceptions in `docs/CHANGELOG.md`.
- Record manual test notes and Postman updates in `docs/api-tests/`.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`). Scope to package when helpful (`feat(frontend):`).
- Keep commits focused (≤ 300 LOC touched). Include migration IDs or ticket refs in the body when relevant.
- Pull requests must include: summary, testing notes (command outputs or screenshots), linked Linear/Jira issue, and rollout considerations.

## Security & Configuration Tips
- Never commit real secrets; populate `.env.example` with placeholder keys whenever new config is required.
- Enforce least-privilege IAM in `infra/terraform/` and document changes in `docs/SECURITY.md`.
- Rotate API keys before releases; note expiry and owner in PR descriptions.
