-- CreateTable
CREATE TABLE "wikelo_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wikelo_groups_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "wikelo_groups_inviteCode_key" ON "wikelo_groups"("inviteCode");
CREATE INDEX "wikelo_groups_ownerId_idx" ON "wikelo_groups"("ownerId");

-- CreateTable
CREATE TABLE "wikelo_group_members" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wikelo_group_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "wikelo_group_members_groupId_userId_key" ON "wikelo_group_members"("groupId", "userId");

-- CreateTable
CREATE TABLE "wikelo_contribution_log" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "newTotal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wikelo_contribution_log_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "wikelo_contribution_log_projectId_createdAt_idx" ON "wikelo_contribution_log"("projectId", "createdAt");
CREATE INDEX "wikelo_contribution_log_userId_createdAt_idx" ON "wikelo_contribution_log"("userId", "createdAt");

-- AlterTable wikelo_projects
ALTER TABLE "wikelo_projects" ADD COLUMN IF NOT EXISTS "displayName" TEXT;
ALTER TABLE "wikelo_projects" ADD COLUMN IF NOT EXISTS "groupId" TEXT;
ALTER TABLE "wikelo_projects" ADD COLUMN IF NOT EXISTS "priority" INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS "wikelo_projects_groupId_status_idx" ON "wikelo_projects"("groupId", "status");

-- AddForeignKeys
ALTER TABLE "wikelo_groups" ADD CONSTRAINT "wikelo_groups_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wikelo_group_members" ADD CONSTRAINT "wikelo_group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "wikelo_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wikelo_group_members" ADD CONSTRAINT "wikelo_group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wikelo_projects" ADD CONSTRAINT "wikelo_projects_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "wikelo_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "wikelo_contribution_log" ADD CONSTRAINT "wikelo_contribution_log_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "wikelo_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wikelo_contribution_log" ADD CONSTRAINT "wikelo_contribution_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
