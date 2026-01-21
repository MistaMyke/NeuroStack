#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/agent-lib.sh"

status_filter="${1:-}"

if [[ -n "$status_filter" ]]; then
  postgres_psql -tA -v status="$status_filter" <<'SQL'
SELECT COALESCE(json_agg(t), '[]'::json)
FROM (
  SELECT *
  FROM agent_tasks
  WHERE status = :'status'
  ORDER BY priority DESC, created_at ASC
) AS t;
SQL
else
  postgres_psql -tA <<'SQL'
SELECT COALESCE(json_agg(t), '[]'::json)
FROM (
  SELECT *
  FROM agent_tasks
  ORDER BY priority DESC, created_at ASC
) AS t;
SQL
fi
