#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [[ ! -f .env ]]; then
  echo "Missing .env file. Copy .env.example and fill in your secrets." >&2
  exit 1
fi

# Determine whether to enable queue profile based on EXECUTIONS_MODE value
exec_mode=$(grep -E '^EXECUTIONS_MODE=' .env | tail -1 | cut -d'=' -f2- | tr -d '"' | tr '[:upper:]' '[:lower:]' || true)
if [[ "$exec_mode" == "queue" ]]; then
  compose_args=(--profile queue up -d)
else
  compose_args=(up -d)
fi

docker compose "${compose_args[@]}"
