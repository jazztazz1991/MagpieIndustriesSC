# Wikelo Contract Tracker

## Summary
Per-user tracker for Wikelo contracts. User selects a contract (e.g., Idris-P), sees the required materials auto-populated from extracted data, and tracks collected quantities. Data persists in the database tied to the logged-in user.

## How It Works
1. User navigates to Wikelo Tracker page
2. Clicks "New Project" → selects a contract from the extracted wikelo.ts data
3. Requirements auto-populate (e.g., 50 Wikelo Favor, 50 Polaris Bit, 50 Carinite, etc.)
4. User adjusts quantity targets if needed (some contracts have variable amounts)
5. User updates collected amounts via +/- buttons or direct input
6. Progress bars show per-material and overall completion
7. Reputation tier gate shown if contract requires specific tier

## Data Flow
- Contract definitions: `client/src/data/wikelo.ts` (extracted from DataForge)
- User progress: Database (`WikeloProject` + `WikeloProjectMaterial` tables)
- API: authenticated CRUD endpoints for projects

## Database Schema

```prisma
model WikeloProject {
  id          String                  @id @default(cuid())
  userId      String
  contractId  String                  // matches contract.id from wikelo.ts
  name        String                  // display name (e.g., "Idris-P")
  status      WikeloProjectStatus     @default(IN_PROGRESS)
  createdAt   DateTime                @default(now())
  updatedAt   DateTime                @updatedAt
  user        User                    @relation(fields: [userId], references: [id], onDelete: Cascade)
  materials   WikeloProjectMaterial[]

  @@index([userId, status])
  @@map("wikelo_projects")
}

model WikeloProjectMaterial {
  id          String         @id @default(cuid())
  projectId   String
  itemName    String
  required    Int
  collected   Int            @default(0)
  project     WikeloProject  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, itemName])
  @@map("wikelo_project_materials")
}

enum WikeloProjectStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}
```

## API Endpoints (all authenticated)
- `GET /api/wikelo/projects` — list user's projects
- `POST /api/wikelo/projects` — create project from contract ID
- `PATCH /api/wikelo/projects/:id/materials/:itemName` — update collected amount
- `PATCH /api/wikelo/projects/:id` — update status
- `DELETE /api/wikelo/projects/:id` — delete project

## UI Components
- **Project List Page** (`/tools/wikelo-tracker`) — shows all user's active/completed projects with overall progress
- **Project Detail Page** (`/tools/wikelo-tracker/[id]`) — material checklist with progress bars, +/- controls, reputation gate banner

## UI Details (matching screenshot)
- Contract name as header with status badge (In Progress / Completed)
- Reputation tier gate banner (green box: "Very Best Customer Required")
- Overall progress bar with percentage + material count
- Material list: each row has name, progress bar (orange/green), collected/required count, +/- buttons
- Materials tab active by default

## Files to Create
- `server/prisma/schema.prisma` — add models
- `server/prisma/migrations/` — migration
- `server/src/routes/wikelo.ts` — API routes
- `client/src/app/tools/wikelo-tracker/page.tsx` — project list
- `client/src/app/tools/wikelo-tracker/[id]/page.tsx` — project detail
- `client/src/domain/wikeloTracker.ts` — progress calculation logic (already exists partially)

## Files to Modify
- `server/src/index.ts` — register wikelo routes
- `client/src/components/nav/Navbar.tsx` — add nav link

## Checklist
- [ ] Add Prisma models and migration
- [ ] Create API routes with auth middleware
- [ ] Create project list page
- [ ] Create project detail page with material tracking
- [ ] Add progress calculation tests
- [ ] Wire up API calls from client
- [ ] Add nav link
- [ ] Run all tests
