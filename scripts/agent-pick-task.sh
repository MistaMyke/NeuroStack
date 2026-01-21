#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <agent-name>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/agent-lib.sh"

agent="$1"
json=$(agent_take_task "$agent")

if [[ "$json" == "{}" ]]; then
  echo "{}"
  exit 2
fi

printf '%s\n' "$json"
