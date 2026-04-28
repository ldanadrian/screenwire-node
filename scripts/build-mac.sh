#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"

bash "$SCRIPT_DIR/build-swift.sh"
cd "$ROOT"
node_modules/.bin/node-gyp rebuild
cp build/Release/screenwire.node builds/macos/screenwire.node
echo "Done: builds/macos/screenwire.node"
