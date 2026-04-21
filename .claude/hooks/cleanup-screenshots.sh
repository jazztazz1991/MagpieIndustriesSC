#!/usr/bin/env bash
# When the screenshots/ folder exceeds 1GB, delete everything not modified today.
# Runs at SessionStart.

set -eo pipefail
DIR="${CLAUDE_PROJECT_DIR:-.}/screenshots"
[ -d "$DIR" ] || exit 0

# du -sk returns size in KB on Git Bash/MSYS, multiply to get bytes
SIZE_KB=$(du -sk "$DIR" 2>/dev/null | awk '{print $1}' || echo 0)
SIZE_BYTES=$((SIZE_KB * 1024))
LIMIT_BYTES=1073741824  # 1 GB

if [ "$SIZE_BYTES" -gt "$LIMIT_BYTES" ]; then
  TODAY=$(date +%Y-%m-%d)
  # Delete any file not modified on or after 00:00 today
  find "$DIR" -type f ! -newermt "$TODAY" -delete 2>/dev/null || true
  echo "[cleanup-screenshots] size was $((SIZE_BYTES / 1024 / 1024)) MB — cleaned pre-$TODAY files" >&2
fi
