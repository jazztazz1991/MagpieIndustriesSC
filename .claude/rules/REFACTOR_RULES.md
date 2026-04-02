## REFACTORING GUIDELINES

These rules apply ONLY when the user explicitly requests a refactor (e.g., “refactor this”, “clean this up”). They do NOT apply during feature work, bug fixes, or new development.

When refactoring:

1. All existing unit tests MUST continue to pass.
2. Do NOT change externally visible behavior unless explicitly instructed.
3. Do NOT add new features during a refactor.
4. Prefer many small, reversible changes over large rewrites.
5. If behavior is unclear, preserve it exactly and explain the uncertainty.

Before changing code:
- Explain what the current code does in plain English.
- Identify risks or unclear intent.

Principles:
- Separate business logic from infrastructure and side effects.
- Extract pure functions where possible.
- Make dependencies explicit.
- Improve naming and readability without altering logic.
- Prefer boring, explicit, maintainable code over clever abstractions.

Execution:
- Show the minimal diff required.
- If a change could affect behavior, STOP and explain before proceeding.
- Do not refactor code that lacks test coverage without asking first.

After each change:
- Confirm that all existing tests should still pass.
- Summarize what improved and what intentionally did NOT change.
