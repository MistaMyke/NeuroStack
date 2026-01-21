#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${ROOT_DIR}/infra/n8n/.env"
COMPOSE_DIR="${ROOT_DIR}/infra/n8n"

_env_get() {
  local key="$1" default="${2:-}"
  if [[ -f "$ENV_FILE" ]]; then
    python - "$key" "$default" "$ENV_FILE" <<'PY'
import sys, pathlib
key, default, env_path = sys.argv[1:4]
value = default
for line in pathlib.Path(env_path).read_text().splitlines():
    if not line or line.lstrip().startswith('#') or '=' not in line:
        continue
    k, v = line.split('=', 1)
    if k.strip() == key:
        value = v.strip().strip('"').strip("'")
        break
sys.stdout.write(value)
PY
  else
    printf '%s' "$default"
  fi
}

compose_exec() {
  (cd "$COMPOSE_DIR" && docker compose "$@")
}

postgres_psql() {
  local user db
  user=$(_env_get DB_POSTGRESDB_USER "n8n")
  db=$(_env_get DB_POSTGRESDB_DATABASE "n8n")
  (cd "$COMPOSE_DIR" && docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U "$user" -d "$db" "$@")
}

agent_take_task() {
  local agent="$1" output
  output=$(postgres_psql -tA -v agent="${agent}" <<'SQL'
SELECT row_to_json(t)
FROM agent_take_task(:'agent') AS t
LIMIT 1;
SQL
)
  if [[ -z "$output" ]]; then
    printf '{}'
  else
    printf '%s' "$output"
  fi
}

agent_update_task() {
  local id="$1"
  local status="$2"
  local result_json="${3:-null}"
  local error_text="${4:-null}"
  postgres_psql -tA -v id="${id}" -v status="${status}" -v result="${result_json}" -v error="${error_text}" <<'SQL'
SELECT row_to_json(agent_update_task_result(:'id', :'status', CASE WHEN :'result' = 'null' THEN NULL ELSE :'result'::jsonb END, CASE WHEN :'error' = 'null' THEN NULL ELSE :'error' END));
SQL
}
