# Wikelo Shared Projects

## Summary
Allow multiple users to collaborate on Wikelo contract projects. Users create Groups, invite members via code, start projects within groups, and track contributions with a receipt log.

## Concepts

### Group
A named collection of users working together. Has an invite code for joining.
- Owner: the creator, can manage members and projects
- Members: can add/remove item counts on any project in the group
- Each group has its own shopping list (aggregated across all group projects)

### Project (same as current, but belongs to group OR user)
- Personal projects: same as today, single user
- Group projects: belong to a group, all members can contribute
- Projects have a custom display name (e.g., "Percy's Polaris", "Jazz's Idris Run #2")
- Default name = contract name, editable by owner

### Project Priority (within a group)
- Groups have a configurable project priority order
- When adding items from the group shopping list (or Discord), items fill the highest-priority project first
- Owner can drag/reorder projects to set priority
- Example: if "Percy's Polaris" is priority 1 and "Jazz's Idris" is priority 2, adding Wikelo Favor fills Percy's project first

### Contribution Log
A receipt-style log of every add/remove action. Separate from the progress view.
- Who, what item, how many, when
- Viewable per-project or per-group

## UI Flow

### Tracker Page — Two Tabs
```
[ Personal ] [ Shared Groups ]
```

**Personal tab** (existing): user's own projects, personal shopping list

**Shared Groups tab**:
- List of groups the user belongs to (created or joined)
- "Create Group" button → name input
- Each group card shows: name, member count, project count, overall progress
- Click group → Group detail page

### Group Detail Page (`/tools/wikelo-tracker/group/[id]`)
- Group name + invite code (copy button)
- Member list with owner badge
- "Leave Group" / "Remove Member" (owner only)
- Projects list (same card layout as personal)
- "New Project" button (same contract picker)
- Group shopping list (aggregated across all group projects, collapsible)
- Group shopping list has conversion materials (MG Scrip for Favor, Quantanium for Bits)

### Project Detail Page (updated)
- Same as current but shows "Group: [name]" badge if it's a group project
- All group members can +/- items
- "Receipt Log" tab/section showing contribution history

### Receipt Log View
- Chronological list of contributions
- Each entry: `[timestamp] [username] added/removed [quantity] [item] on [project]`
- Filterable by user, item, project
- Accessible from group page or project detail

## Database Schema

```prisma
model WikeloGroup {
  id         String              @id @default(cuid())
  name       String
  inviteCode String              @unique
  ownerId    String
  createdAt  DateTime            @default(now())
  updatedAt  DateTime            @updatedAt
  owner      User                @relation("ownedWikeloGroups", fields: [ownerId], references: [id], onDelete: Cascade)
  members    WikeloGroupMember[]
  projects   WikeloProject[]     // projects can optionally belong to a group

  @@index([ownerId])
  @@map("wikelo_groups")
}

model WikeloGroupMember {
  id        String      @id @default(cuid())
  groupId   String
  userId    String
  joinedAt  DateTime    @default(now())
  group     WikeloGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([groupId, userId])
  @@map("wikelo_group_members")
}

model WikeloContributionLog {
  id        String        @id @default(cuid())
  projectId String
  userId    String
  itemName  String
  delta     Int           // positive = added, negative = removed
  newTotal  Int           // collected count after this change
  createdAt DateTime      @default(now())
  project   WikeloProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([projectId, createdAt])
  @@index([userId, createdAt])
  @@map("wikelo_contribution_log")
}

// Update existing WikeloProject to optionally belong to a group
model WikeloProject {
  // ... existing fields ...
  displayName String?        // custom name like "Percy's Polaris" (default = contract name)
  groupId     String?        // null = personal, set = group project
  priority    Int            @default(0) // lower = higher priority for item distribution
  group       WikeloGroup?   @relation(fields: [groupId], references: [id])
  contributions WikeloContributionLog[]
}
```

## API Endpoints

### Group Management (authenticated)
- `POST /api/wikelo/groups` — create group (name)
- `GET /api/wikelo/groups` — list user's groups
- `GET /api/wikelo/groups/:id` — group detail with members + projects
- `POST /api/wikelo/groups/:id/join` — join via invite code
- `DELETE /api/wikelo/groups/:id/members/:userId` — remove member (owner) or leave (self)
- `DELETE /api/wikelo/groups/:id` — delete group (owner only)

### Group Projects (authenticated, must be group member)
- `POST /api/wikelo/groups/:id/projects` — create project in group
- `PATCH /api/wikelo/groups/:groupId/projects/:projectId/materials/:materialId` — update material (any member)

### Contribution Log
- `GET /api/wikelo/groups/:id/log` — group-wide contribution history
- `GET /api/wikelo/projects/:id/log` — per-project contribution history

### Discord Bot Commands
- `/wikelo group create <name>` — create a group, get invite code
- `/wikelo group join <code>` — join a group
- `/wikelo group status` — show group shopping list
- `/wikelo group add <item> <quantity>` — add items to group projects
- `/wikelo group projects` — list group projects
- `/wikelo group log` — recent contribution activity

## Pages
- `/tools/wikelo-tracker` — updated with Personal/Shared tabs
- `/tools/wikelo-tracker/group/[id]` — group detail + projects + shopping list
- `/tools/wikelo-tracker/group/[id]/log` — contribution receipt log
- `/tools/wikelo-tracker/[id]` — project detail (updated to support group context)

## Invite Code Format
- 8-character alphanumeric: `MAGPIE-XXXX` or just random `a1b2c3d4`
- Generated on group creation
- Owner can regenerate code (invalidates old one)

## Checklist
- [ ] Add Prisma models (WikeloGroup, WikeloGroupMember, WikeloContributionLog)
- [ ] Add groupId, displayName, priority to WikeloProject
- [ ] Create migration
- [ ] Build group CRUD API endpoints
- [ ] Build group project endpoints with member auth
- [ ] Build contribution logging on material updates
- [ ] Build contribution log API
- [ ] Update tracker page with Personal/Shared tabs
- [ ] Build group detail page
- [ ] Build group shopping list
- [ ] Build receipt/contribution log UI
- [ ] Update existing material update to log contributions (personal projects too)
- [ ] Add project rename UI (edit display name)
- [ ] Add project priority reorder UI (drag or up/down arrows)
- [ ] Update item distribution to respect project priority order
- [ ] Build Discord bot group commands
- [ ] Run all tests
