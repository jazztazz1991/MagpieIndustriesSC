## HARD RULE: TEST-FIRST (NON-NEGOTIABLE)

- Any new or modified **domain or application logic MUST include unit tests**
- If logic is added without tests, CI WILL FAIL
- If behavior changes, tests MUST be updated first or alongside the change
- Do NOT proceed with implementation if you cannot describe the test
- Tests use **vitest** (not jest). Config is at `client/vitest.config.ts`

If tests are missing:
- STOP
- Generate tests
- Then continue

**Scope:** This applies to `client/src/domain/` logic and shared utilities. Data extraction scripts (`scripts/generators/`) do not require unit tests unless they contain reusable logic (like `scripts/lib/localization.ts`).

## E2E TESTS

- Any new or modified **client-side page or interactive flow** SHOULD include E2E test coverage in `e2e/`
- E2E tests use Playwright (`@playwright/test`)
- E2E tests MUST assert observable user behavior (visible text, navigation, interactions)
- Mock external API calls with `page.route()` to keep tests deterministic
- This applies to `client/src/app/` pages only — not scripts, generators, or standalone tools
