# n8n Local Stack

Minimal Docker Compose setup for self-hosting the n8n Community Edition alongside this repo. Everything needed to boot the service lives in this folder so CLI tools can find it quickly.

## Quick Start (SQLite / single process)
1. Copy the environment template and generate a fresh encryption key:
   ```bash
   cd infra/n8n
   cp .env.example .env
   openssl rand -base64 32
   ```
   Paste the key into `N8N_ENCRYPTION_KEY` inside `.env`. Update the Basic Auth credentials before exposing the editor.
2. Decide on execution mode:
   - `EXECUTIONS_MODE=regular` keeps everything inside the main n8n container (fine for quick tests).
   - `EXECUTIONS_MODE=queue` enables Redis + a dedicated worker for long-running, parallel jobs.
3. Launch the stack from anywhere in the repo:
   ```bash
   npm run n8n:up
   ```
   The helper script inspects `EXECUTIONS_MODE` and adds the queue profile automatically when needed.
4. Open the editor at `http://localhost:5678` (or the host/port you set). Use the Basic Auth credentials from `.env`.
5. Shut it down when you are finished:
   ```bash
   npm run n8n:down
   ```

## Data & Backups
- Docker named volumes store state:
  - `n8n_data` → workflows, credentials, logs.
  - `postgres_data` → Postgres database (if enabled).
  - `redis_data` → Redis queue metadata.
- Snapshot volumes with `docker compose run --rm -v volume_name:/data ...` or bind-mount them temporarily when you need off-site backups.

## Queue Mode Details
- `EXECUTIONS_MODE=queue` spins up a second `n8n-worker` container plus Redis. The worker processes tasks in the background so the main UI stays responsive even during 20–30 hour runs.
- Scale out by cloning the worker definition with a new service name and (optionally) the `queue` profile.
- Keep `N8N_ENCRYPTION_KEY` stable: both UI and worker containers share credentials via the same volume.

## Database Options
- The compose file starts Postgres by default and expects `DB_TYPE=postgresdb`. This is the recommended setup for long-running automations and multi-agent task tracking.
- To fall back to SQLite, change `DB_TYPE=sqlite` and set `EXECUTIONS_MODE=regular` unless you add your own external Postgres. The Postgres container can stay running but won’t be used.

## Going Beyond Localhost
- Add a reverse proxy (Traefik, Caddy, or Nginx) in the same Compose project before exposing n8n publicly. Set `N8N_HOST` to your domain and `WEBHOOK_URL` to the HTTPS URL so triggers work.
- For unattended runs, wire an alert workflow (email/Slack/SMS) to the `Workflow > Error` trigger and monitor Redis/Postgres health using your preferred tooling.
- Leave the host machine powered/connected and make sure Docker restarts on boot so the queue keeps consuming jobs while you’re away.

Refer to the official docs for additional environment flags and scaling patterns: https://docs.n8n.io/hosting/installation/server-setups/docker-compose/
