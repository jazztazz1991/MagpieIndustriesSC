## HARD RULE: PLANNING BEFORE CODE (NON-NEGOTIABLE)

Before writing ANY code for a new feature, bug fix, or non-trivial change:

1. **Create a plan file** in the `planning/` folder at the project root
2. The file MUST be named descriptively based on what the plan is for (e.g., `dealership-wishlist-feature.md`, `fix-purchase-race-condition.md`)
3. The plan MUST be reviewed and approved by the user BEFORE any code is written
4. **DO NOT** begin implementation until the user explicitly approves the plan

### Plan file format:
- Clear description of what is being done and why
- Technical approach and key decisions
- Files that will be created or modified
- A **checklist at the end** of every task in the plan, using markdown checkboxes:
  - `- [ ]` for not done
  - `- [x]` for done
- Update the checklist as tasks are completed so the user can follow progress

### Example:
```
# Wishlist Feature

## Summary
Allow customers to wishlist items at dealerships...

## Approach
...

## Files
...

## Checklist
- [ ] Create Prisma migration
- [ ] Create domain model
- [ ] Create service + tests
- [ ] Create API routes
- [ ] Create UI component + RTL tests
- [ ] Integrate into page
- [ ] Run all tests
```

If you skip planning:
- STOP
- Create the plan
- Wait for approval
- Then continue
