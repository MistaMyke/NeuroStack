#!/bin/sh
set -euo pipefail

if [ -n "${PNPM_STORE_PATH:-}" ]; then
  pnpm config set store-dir "$PNPM_STORE_PATH"
fi

if [ -f pnpm-lock.yaml ]; then
  pnpm install --frozen-lockfile
else
  pnpm install
fi

exec "$@"
