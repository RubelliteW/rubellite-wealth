#!/usr/bin/env bash
# Push the Rubellite Wealth website to github.com/RubelliteW/rubellite-wealth
# Usage:  GITHUB_TOKEN=ghp_your_token_here bash push-to-github.sh
set -euo pipefail

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERROR: set GITHUB_TOKEN first:"
  echo "  GITHUB_TOKEN=ghp_xxx bash push-to-github.sh"
  exit 1
fi

USER="RubelliteW"
REPO="rubellite-wealth"

echo ">> Creating repo $USER/$REPO (skips if it already exists)..."
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO\",\"private\":false,\"description\":\"Rubellite Wealth Management website\"}"

echo ">> Adding remote and pushing main..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${GITHUB_TOKEN}@github.com/${USER}/${REPO}.git"
git push -u origin main

# scrub token from remote config afterwards
git remote set-url origin "https://github.com/${USER}/${REPO}.git"
echo ">> Done: https://github.com/${USER}/${REPO}"
