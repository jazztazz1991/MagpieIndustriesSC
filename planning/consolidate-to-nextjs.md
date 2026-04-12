# Consolidate Server into Next.js

## Summary
Move all Express API routes into Next.js App Router API routes (`client/src/app/api/`). Eliminate the separate server workspace. One build, one deploy, one Render service.

## What Changes

### Route Conversion
Every Express route file → Next.js route handler:
- `server/src/routes/health.ts` → `client/src/app/api/health/route.ts`
- `server/src/routes/auth.ts` → `client/src/app/api/auth/[...path]/route.ts`
- `server/src/routes/friends.ts` → `client/src/app/api/friends/route.ts`
- `server/src/routes/events.ts` → `client/src/app/api/events/route.ts`
- `server/src/routes/groups.ts` → `client/src/app/api/groups/route.ts`
- `server/src/routes/activity.ts` → `client/src/app/api/activity/route.ts`
- `server/src/routes/comments.ts` → `client/src/app/api/comments/route.ts`
- `server/src/routes/orgs.ts` → `client/src/app/api/orgs/[...path]/route.ts`
- `server/src/routes/fleet.ts` → `client/src/app/api/orgs/[orgId]/fleet/route.ts`
- `server/src/routes/operations.ts` → `client/src/app/api/orgs/[orgId]/operations/route.ts`
- `server/src/routes/treasury.ts` → `client/src/app/api/orgs/[orgId]/treasury/route.ts`
- `server/src/routes/recruitment.ts` → `client/src/app/api/recruitment/route.ts`
- `server/src/routes/org-guides.ts` → `client/src/app/api/orgs/[orgId]/guides/route.ts`
- `server/src/routes/org-announcements.ts` → `client/src/app/api/orgs/[orgId]/announcements/route.ts`
- `server/src/routes/org-activity.ts` → `client/src/app/api/orgs/[orgId]/activity/route.ts`
- `server/src/routes/admin.ts` → `client/src/app/api/admin/route.ts`
- `server/src/routes/reports.ts` → `client/src/app/api/reports/route.ts`
- `server/src/routes/suggestions.ts` → `client/src/app/api/suggestions/route.ts`
- `server/src/routes/craft-recipes.ts` → `client/src/app/api/craft-recipes/route.ts`
- `server/src/routes/mission-recipes.ts` → `client/src/app/api/mission-recipes/route.ts`
- `server/src/routes/game-data.ts` → `client/src/app/api/game-data/route.ts`
- `server/src/routes/inventory-notes.ts` → `client/src/app/api/inventory-notes/route.ts`
- `server/src/routes/wikelo.ts` → `client/src/app/api/wikelo/[...path]/route.ts`
- `server/src/routes/prices.ts` → `client/src/app/api/prices/[...path]/route.ts`

### Syntax Conversion (Express → Next.js)
```typescript
// Express:
router.get("/", requireAuth, async (req, res) => {
  res.json({ success: true, data: [] });
});

// Next.js:
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, data: [] });
}
```

### Shared Code Migration
- `server/src/lib/prisma.ts` → `client/src/lib/prisma.ts` (server-only)
- `server/src/middleware/auth.ts` → `client/src/lib/auth.ts` (server-only)
- `server/prisma/` → `prisma/` (project root — Next.js convention)

### Render Config
Single service instead of two:
```yaml
services:
  - type: web
    name: magpie-industries
    runtime: node
    plan: free
    rootDir: .
    buildCommand: |
      npm install --include=dev
      npx prisma generate
      npx prisma migrate deploy
      cd client && npm run build
    startCommand: cd client && npm run start
```

### Client API Calls
`apiFetch` currently prefixes `NEXT_PUBLIC_API_URL` (external server). After migration:
- Remove `NEXT_PUBLIC_API_URL` — API is same origin
- `apiFetch("/api/health")` just works (no cross-origin)

### What Stays the Same
- Prisma schema, migrations, seed script
- All domain logic in `client/src/domain/`
- All page components
- All data files
- Auth flow (JWT-based)

## Risks
- Large diff — touching every route file
- Auth middleware needs careful conversion
- Org routes with nested params (`:orgId`) need Next.js dynamic segments
- Prisma client needs to be server-only (can't import in client components)

## Approach
1. Move Prisma to project root
2. Create shared server utilities (prisma client, auth middleware) in `client/src/lib/`
3. Convert routes one at a time, testing each
4. Update `apiFetch` to remove API URL prefix
5. Update `render.yaml` for single service
6. Remove `server/` workspace
7. Test full deployment

## Checklist
- [ ] Move Prisma schema + migrations to project root
- [ ] Create `client/src/lib/prisma.ts` (server-only)
- [ ] Create `client/src/lib/auth-middleware.ts` (server-only)
- [ ] Convert health route (test the pattern)
- [ ] Convert auth routes
- [ ] Convert all remaining routes
- [ ] Update `apiFetch` to use relative paths
- [ ] Update `render.yaml` for single service
- [ ] Remove server workspace
- [ ] Run all tests
- [ ] Test deployment
