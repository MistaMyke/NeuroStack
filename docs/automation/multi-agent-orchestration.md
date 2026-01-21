# Multi-Agent Orchestration Overview

This document captures how the local n8n instance will coordinate Codex/Claude agents for unattended multi-hour runs.

## Components
- **Postgres (`agent_tasks`)** – source of truth for task lifecycle and metadata.
- **Shell scripts (`scripts/agent-*.sh`)** – lightweight API for agents and n8n to pull/update tasks.
- **n8n Planner Workflow** – high-level orchestration: monitors backlog, generates new tickets, routes assignments, notifies humans.
- **n8n Executor Workflow** – polls for work, invokes CLI agents (Codex/Claude), enforces guardrails/tests, writes results back.
- **Alert Workflow** – watches for stalled tasks/heartbeats and pushes notifications (email/Slack/SMS).

## Planner Workflow ("Planner: Backlog Manager")
**Trigger:** Cron (every 5 min) + manual button.

**Nodes:**
1. **Cron / Manual Trigger** – entry point.
2. **Execute Command – `List Pending`**
   - Command: `bash scripts/agent-list-tasks.sh pending`
   - Parses JSON to determine workload.
3. **IF – `Backlog Healthy?`**
   - Condition: pending count ≥ desired threshold (configurable).
4. **HTTP Request – `Fetch Roadmap Update` (Claude/Codex)**
   - Sends current project context (docs/spec, open tickets) and asks for new tasks if backlog low.
5. **Function – `Normalize Tasks`**
   - Converts LLM response to array of task objects `{title, description, priority, assignee}`.
6. **Execute Command – `Insert Tasks`**
   - Calls new helper script `bash scripts/agent-insert-task.sh` with JSON payload.
7. **Execute Command – `Assign Existing`**
   - Runs `bash scripts/agent-update-task.sh <id> assigned '{"assignee":"junior-backend"}'` for backlog items needing routing.
8. **Slack/Email Node – `Planner Summary`**
   - Optional: send daily plan to you with queue stats.

**Outputs:** queue refreshed with right mix of backend/frontend tasks, plus human-readable summary.

## Executor Workflow ("Executor: Junior Backend/Frontend Loop")
**Trigger:** Interval (e.g., every 2 min) or Webhook.

**Shared Nodes:**
1. **Cron/Webhook Trigger** – one workflow per agent (`junior-backend`, `junior-frontend`).
2. **Execute Command – `Pick Task`**
   - Command: `bash scripts/agent-pick-task.sh <agent>`.
   - If `{}` → optionally sleep / exit.
3. **IF – `Task Found?`**
   - Guard against empty response.
4. **Function – `Prepare Prompt`**
   - Extracts task id/title/description into environment variables.
5. **Execute Command – `Run Agent`**
   - Example command: `codex_junior_backend <<< "$TASK_PROMPT"` (or call a wrapper script that pipes JSON to the CLI).
   - Use `Continue On Fail` to capture non-zero exit codes.
6. **Execute Command – `Update Task`**
   - On success: `bash scripts/agent-update-task.sh <id> completed '<json result>'`.
   - On failure: same command with `failed` and error payload (stderr captured from previous node).
7. **Slack/Email – `Execution Report`**
   - Optional: message with status snapshot.

**Queue Mode Consideration:** run these workflows in Queue execution so long tasks don't block others.

## Alert Workflow ("Agent Watchdog")
**Trigger:** Cron every 10 minutes.

**Logic:**
1. Query Postgres for tasks stuck in `assigned` > X minutes or `failed` without follow-up.
2. Query Postgres for agents without heartbeat (store heartbeats via `agent_update_task` or separate table).
3. Send Slack/email/Signal with actionable summary.
4. Optionally auto-requeue stale tasks by setting status back to `pending`.

## Helper Script Additions
To support uploads from n8n without raw SQL in workflow nodes, add:
- `scripts/agent-insert-task.sh` — accepts JSON array of tasks and inserts via Postgres function.
- `scripts/agent-heartbeat.sh` — records heartbeat per agent (future).

## Next Steps
1. Implement `agent-insert-task.sh` and optional `agent-heartbeat.sh` helper scripts.
2. Build Planner workflow in n8n using the node layout above; export JSON to `infra/n8n/workflows/planner.json`.
3. Duplicate the Executor workflow for backend and frontend agents; export to `infra/n8n/workflows/executor-<agent>.json`.
4. Configure alert workflow once planner/executor are stable.
5. Run dry-run in queue mode, monitor volumes/logs, tweak thresholds.
