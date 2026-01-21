#!/usr/bin/env bash
set -euo pipefail

if [[ $# -gt 0 ]]; then
  payload="$1"
else
  payload="$(cat)"
fi

if [[ -z "$payload" ]]; then
  echo "Usage: $0 '[{"title":"..."}]'" >&2
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/agent-lib.sh"

postgres_psql -tA -v tasks="${payload}" <<'SQL'
SELECT json_agg(t)
FROM agent_insert_tasks(:'tasks'::jsonb) AS t;
SQL
