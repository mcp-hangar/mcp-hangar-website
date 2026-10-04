#!/usr/bin/env bash
# Re-pin @mcp-hangar/docs to the current head of mcp-hangar/docs main.
#
# Shared by rebuild-docs.yml (the nightly docs bump) and sync-core-version.yml
# (the release bump), so the two cannot drift into two ways of moving one pin.
#
# Nothing here touches pnpm-lock.yaml by hand. Moving the specifier in
# packages/site/package.json is what makes pnpm re-resolve a github:
# dependency; `pnpm install --lockfile-only` then writes the lockfile entry.
# (An earlier version deleted the lock entry with regexes and trusted pnpm to
# restore it; under pnpm 11 it answered "Already up to date" and wrote nothing,
# which is how #228 sat broken.)
#
# Needs `pnpm install` to have run. A pin that is already current is a no-op.
set -euo pipefail

latest=$(git ls-remote https://github.com/mcp-hangar/docs.git main | cut -f1)
[ -n "$latest" ] || { echo "could not read docs main"; exit 1; }

current=$(node -p "require('./packages/site/package.json').dependencies['@mcp-hangar/docs']")
echo "current: $current"
echo "latest:  github:mcp-hangar/docs#$latest"

if [ "$current" = "github:mcp-hangar/docs#$latest" ]; then
  echo "Docs pin is already current."
  exit 0
fi

node -e "
  const fs = require('fs');
  const file = 'packages/site/package.json';
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  pkg.dependencies['@mcp-hangar/docs'] = 'github:mcp-hangar/docs#' + process.argv[1];
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
" "$latest"

pnpm install --lockfile-only
grep -m1 -A2 "'@mcp-hangar/docs':" pnpm-lock.yaml
