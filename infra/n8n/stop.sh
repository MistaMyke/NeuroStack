#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

exec_mode=$(grep -E '^EXECUTIONS_MODE=' .env 2>/dev/null | tail -1 | cut -d'=' -f2- | tr -d '"' | tr '[:upper:]' '[:lower:]' || true)
if [[ "$exec_mode" == "queue" ]]; then
  docker compose --profile queue down
else
  docker compose down
fi
