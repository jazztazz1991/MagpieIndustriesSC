# Magpie Industries — Feature Roadmap

## Admin Dashboard
- [ ] Create admin dashboard page (`/admin`)
- [ ] Site-wide admin role (separate from org roles)
- [ ] Admin ability to grant/revoke admin status to users
- [ ] Admin user search and management interface
- [ ] Admin overview: user count, org count, active reports

## Issue & Bug Reporting
- [ ] `Report` Prisma model (type: BUG | DATA_ISSUE, status: OPEN | IN_PROGRESS | RESOLVED | CLOSED)
- [ ] Users can report bugs from any page (floating report button)
- [ ] Users can report data issues on specific items (crafts, missions, etc.)
- [ ] Report detail page with status tracking
- [ ] Admin report queue with filters (type, status, date)
- [ ] Admin ability to update report status and add notes

## Feature Suggestions
- [ ] `Suggestion` Prisma model (status: PENDING | UNDER_REVIEW | PLANNED | DECLINED)
- [ ] Users can submit feature suggestions
- [ ] Users can upvote existing suggestions
- [ ] Suggestion board page with sorting (newest, most upvoted)
- [ ] Admin ability to update suggestion status
- [ ] Admin response/notes on suggestions

## Craft & Mission Recipe Management (Admin)
- [ ] Admin CRUD for craft recipes (items, quantities, requirements)
- [ ] Admin CRUD for mission recipes (objectives, rewards, difficulty)
- [ ] Version history / audit log for recipe changes
- [ ] Bulk import/export for recipe data
- [ ] Preview mode before publishing changes

## Testing Debt
- [ ] Unit tests for org guides routes
- [ ] Unit tests for org announcements routes
- [ ] Unit tests for org activity routes
- [ ] E2E tests for guides pages (create, edit, delete, markdown rendering)
- [ ] E2E tests for announcements
- [ ] E2E tests for calendar view
- [ ] E2E tests for org dashboard settings (MOTD, permissions)
