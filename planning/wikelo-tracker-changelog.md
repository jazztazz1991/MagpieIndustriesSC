# Wikelo Tracker — Recent Changes

## Shared Groups

- Create and join groups via invite code
- Group detail page with members list, invite code, and (for non-owners) a leave button
- Owners cannot leave; they must delete the group
- Groups have their own projects separate from personal projects
- Personal tab shows only personal projects (filtered by `groupId: null`)

## Project Management

- Custom project names (e.g. "Percy's Polaris") via `displayName` field
- Drag-and-drop reorder for both personal and group projects (priority)
- Group detail shows projects in the same card grid layout as personal
- Click a group project card to expand material controls below the grid
- Delete buttons on personal projects; leave button on groups

## Contribution Tracking

- Every material add/remove writes a `WikeloContributionLog` entry (user, item, delta, newTotal)
- "Activity Log" tab on group detail shows chronological history
- "Who Has What" tab aggregates net contributions per member per item
  - Alternating row backgrounds and dotted leader lines for readability
  - Items sorted with natural sort (RCMBNT-XTL-1, -2, -3)

## Shopping List

- Aggregates in-progress project materials across the group (or personal)
- Collapsible panel showing overall progress and remaining totals
- +/-/+5/+10 buttons to add/remove items directly from the list
- Distribution logic: fills each project to its required amount before spilling to the next (priority order)
- "Copy for Discord" button on personal list

### Conversion Materials

- Shows MG Scrip needed for Wikelo Favors (50 scrip = 1 favor)
- Shows Quantanium needed for Polaris Bits (24 SCU = 1 bit)
- Group shopping list includes tracked "Have" counts with +/- controls
  - Persists per group in localStorage
  - Turns green when you have enough

## Race Condition Fix

- Previously: two users adding to the same material could lose an update
  (both read `5`, both send `6`, result stays at `6` instead of `7`)
- Now: clients send a `delta` instead of an absolute `collected` value
- Server performs atomic increment inside a transaction:
  `collected = GREATEST(0, collected + delta)`
- Server still accepts `collected` as fallback for backwards compatibility (Discord bot)

## Sorting

- Added natural sort utility (`client/src/lib/sort.ts`)
- Alphabetical with numeric segments sorted numerically
- Applied to: personal/group shopping lists, project material lists, contributions view

## Discord Bot Integration

- Bot API endpoints for personal projects (link, add, status, projects)
- Bot API endpoints for groups (create, join, list, status, add)
- Separate `/add-items` endpoints take `quantity` and handle distribution server-side
- `requireBotAuth` middleware with shared secret

## API Endpoints Added

### Personal (`/api/wikelo`)
- `PATCH /projects/:id` — unified update (displayName, status, priority)
- `POST /projects/reorder` — priority reorder
- `GET /projects/:id/log` — contribution history
- `PATCH /projects/:id/materials/:materialId` — now accepts `{ delta }` or `{ collected }`

### Groups (`/api/wikelo/groups`)
- `GET /` — list user's groups
- `POST /` — create group
- `GET /:id` — group detail
- `POST /join` — join via invite code
- `DELETE /:id/members/:memberId` — leave or remove member
- `DELETE /:id` — delete group (owner only)
- `POST /:id/projects` — create group project
- `PATCH /:groupId/projects/:projectId` — update displayName/status/priority
- `POST /:groupId/projects/reorder` — priority reorder
- `PATCH /:groupId/projects/:projectId/materials/:materialId` — delta/collected update
- `GET /:id/log` — group-wide contribution history
- `GET /:groupId/projects/:projectId/log` — per-project contribution history
- `GET /:id/shopping-list` — aggregated shopping list
- `GET /:id/contributions` — net contributions per member (Who Has What)

## Schema Additions

- `WikeloGroup` (name, inviteCode, ownerId)
- `WikeloGroupMember` (groupId, userId, joinedAt)
- `WikeloContributionLog` (projectId, userId, itemName, delta, newTotal, createdAt)
- `WikeloProject` gained `displayName`, `groupId`, `priority` fields
