#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <task-id> <status> [result-json] [error-text]" >&2
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/agent-lib.sh"

id="$1"
status="$2"
result_json="${3:-null}"
error_text="${4:-null}"

printf '%s\n' "$(agent_update_task "$id" "$status" "$result_json" "$error_text")"
