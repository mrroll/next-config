#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

IFS=$'\n\t'

__DIR="$(cd "$(git rev-parse --show-toplevel)" >/dev/null 2>&1 && pwd)"
cd "${__DIR}"

yarn install --frozen-lockfile

yarn build

# Try to do an update.
npm publish --access=public || true
