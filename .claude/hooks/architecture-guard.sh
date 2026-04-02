#!/bin/bash
# Hook: PreToolUse Write
# Blocks writes to root-level app/ directory (must be client/src/app/).
# Blocks deletion of layout.tsx (global styles entry point).

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | sed 's/"file_path":"//;s/"$//' 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Normalize path separators
NORM_PATH=$(echo "$FILE_PATH" | sed 's|\\|/|g')

# Block root-level app/ directory (not under client/src/app/)
if echo "$NORM_PATH" | grep -qE "/app/[^/]" && ! echo "$NORM_PATH" | grep -q "client/src/app/"; then
  echo "BLOCKED: App Router files must live under client/src/app/, not root-level app/." >&2
  exit 2
fi

exit 0
