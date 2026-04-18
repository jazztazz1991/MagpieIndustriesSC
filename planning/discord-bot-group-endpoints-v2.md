# Discord Bot Group Endpoints (Phase 2)

## Summary

Add 4 new endpoints to `server/src/routes/discord-bot.ts` to support
new `/wikelo` slash commands in the MagpieDiscordBot repo.

## Endpoints

### 1. `GET /groups/:groupId/detail/:discordId`

Full group detail for `/wikelo group info` and `/wikelo group project <name>`.

- Requires linked account + group membership
- Returns id, name, inviteCode, ownerId, ownerName, memberCount,
  members array (with `isOwner`), projects array (with status + materials)
- Status converted from `IN_PROGRESS`/`COMPLETED`/`ABANDONED` to lowercase
- Projects ordered by priority asc

### 2. `GET /groups/:groupId/log/:discordId?limit=20`

Activity log mirroring the web "Activity Log" tab.

- Optional `?limit=N` (default 20, max 50)
- Returns array of { username, projectName, itemName, delta, newTotal, createdAt }
- Sorted newest-first
- Uses `displayName || name` for projectName

### 3. `GET /groups/:groupId/contributions/:discordId`

Net contributions per member — mirrors "Who Has What" tab.

- Aggregates `WikeloContributionLog` by user + item
- Returns `{ members: [{ username, items: [{ itemName, netTotal }] }] }`
- Items sorted with natural sort
- Members sorted alphabetically by username
- Includes items with non-zero net (can be negative)

### 4. `POST /groups/:groupId/leave`

Leave a group via Discord.

- Body: `{ discordId }`
- Returns `{ groupName }` on success
- Specific error string "Owner cannot leave — delete the group instead"
  so the bot can tailor the message

## Implementation notes

- All use `requireBotAuth` middleware
- Reuse `naturalCompare` logic (inline or import from shared lib if available server-side)
- For natural sort on server: inline helper (we don't share client sort utilities)

## Files Modified

- `server/src/routes/discord-bot.ts` — add 4 handlers

## Checklist

- [ ] Add `/groups/:groupId/detail/:discordId` endpoint
- [ ] Add `/groups/:groupId/log/:discordId` endpoint
- [ ] Add `/groups/:groupId/contributions/:discordId` endpoint
- [ ] Add `/groups/:groupId/leave` endpoint
- [ ] Type-check server
