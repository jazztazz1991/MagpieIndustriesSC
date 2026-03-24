Run the full verification pipeline for the client project:

1. Run TypeScript type-checking: `cd client && npx tsc --noEmit`
2. Run all unit tests: `cd client && npx vitest run`

Report results clearly:
- If type-check fails, show the errors and suggest fixes
- If tests fail, show which tests failed and why
- If both pass, give a short "all clear" confirmation with test count

IMPORTANT: The dev server must NOT be running when you do this (EPERM file lock errors). If you see EPERM errors, tell the user to stop the dev server first.
