#!/bin/zsh -l
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo 'Node.js 22.13 or newer is required.'
  read -k 1
  exit 1
fi
open 'http://localhost:4310'
node server.mjs
