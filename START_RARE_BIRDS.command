#!/bin/zsh

cd -- "$(dirname -- "$0")"

clear
echo "Rare Birds of North East Scotland"
echo "=================================="

if ! command -v node >/dev/null 2>&1; then
  echo
  echo "Node.js is not installed yet."
  echo "The official download page will now open."
  echo
  echo "1. Download the LTS macOS Installer (.pkg)."
  echo "2. Run the installer using its default options."
  echo "3. Double-click this file again."
  echo
  open "https://nodejs.org/en/download"
  read "?Press Return to close this window..."
  exit 1
fi

node scripts/demo.mjs
status=$?

if [[ $status -ne 0 ]]; then
  echo
  echo "The demo stopped because of an error."
  read "?Press Return to close this window..."
fi

exit $status
