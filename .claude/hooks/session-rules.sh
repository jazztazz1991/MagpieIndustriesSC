#!/bin/bash
# Hook: SessionStart (startup/resume/compact)
# Re-injects key project rules into context so they survive compaction.

cat << 'RULES'
ACTIVE PROJECT RULES — follow these at all times:

1. TEST-FIRST: New/modified domain logic (client/src/domain/) MUST have vitest unit tests. Run tests before considering work done.
2. PLANNING: New features require a plan file in planning/ approved by the user BEFORE writing code.
3. ARCHITECTURE: App Router lives at client/src/app/ — never create a root-level app/ directory. Domain logic in src/domain/ only.
4. RTL: When extracting JSX into new components, add RTL tests.
5. NO DESTRUCTIVE GIT: Never force push, reset --hard, or delete branches without explicit approval.
6. REFACTOR MODE: Only applies when user explicitly asks to refactor. During feature work, just build.
7. GLOBAL STYLES: client/src/app/layout.tsx imports globals.css — never remove this.
8. API SECURITY: No public APIs without auth, no raw DB objects, validate input, fail closed.
RULES
