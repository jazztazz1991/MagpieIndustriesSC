#!/bin/bash
# Hook: PreToolUse Bash
# Blocks destructive git operations and dangerous commands.

INPUT=$(cat)
CMD=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | sed 's/"command":"//;s/"$//' 2>/dev/null)

# If we can't parse the command, allow it
if [ -z "$CMD" ]; then
  exit 0
fi

# Block git push --force
if echo "$CMD" | grep -qE "git\s+push\s+.*--force|git\s+push\s+-f"; then
  echo "BLOCKED: git push --force is not allowed without explicit user approval." >&2
  exit 2
fi

# Block git reset --hard
if echo "$CMD" | grep -qE "git\s+reset\s+--hard"; then
  echo "BLOCKED: git reset --hard is not allowed without explicit user approval." >&2
  exit 2
fi

# Block rm -rf on project root or dangerous paths
if echo "$CMD" | grep -qE "rm\s+-rf\s+/|rm\s+-rf\s+\.|rm\s+-rf\s+\*"; then
  echo "BLOCKED: Destructive rm -rf command is not allowed." >&2
  exit 2
fi

# Block committing .env files
if echo "$CMD" | grep -qE "git\s+add\s+.*\.env"; then
  echo "BLOCKED: Do not stage .env files. They may contain secrets." >&2
  exit 2
fi

exit 0
