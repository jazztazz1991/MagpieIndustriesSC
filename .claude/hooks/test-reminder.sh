#!/bin/bash
# Hook: PostToolUse Edit/Write
# Reminds about tests when domain logic files are modified.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | sed 's/"file_path":"//;s/"$//' 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

NORM_PATH=$(echo "$FILE_PATH" | sed 's|\\|/|g')

# Domain logic files need tests
if echo "$NORM_PATH" | grep -q "client/src/domain/.*\.ts$" && ! echo "$NORM_PATH" | grep -q "\.test\."; then
  echo '{"additionalContext":"REMINDER: You modified a domain logic file. Ensure unit tests exist and pass (vitest) for this change."}'
  exit 0
fi

# New component files need RTL tests
if echo "$NORM_PATH" | grep -q "client/src/components/.*\.tsx$" && ! echo "$NORM_PATH" | grep -q "\.test\."; then
  echo '{"additionalContext":"REMINDER: You modified a component file. If JSX was extracted or a new component created, add RTL tests."}'
  exit 0
fi

exit 0
