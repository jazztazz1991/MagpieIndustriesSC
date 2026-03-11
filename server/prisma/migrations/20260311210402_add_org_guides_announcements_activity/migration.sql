-- CreateEnum
CREATE TYPE "GuideCategory" AS ENUM ('RANKS', 'OPERATIONS', 'TREASURY', 'RULES', 'GENERAL');

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "orgId" TEXT;

-- AlterTable
ALTER TABLE "orgs" ADD COLUMN     "motd" TEXT;

-- CreateTable
CREATE TABLE "org_guides" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "GuideCategory" NOT NULL DEFAULT 'GENERAL',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_announcements" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "org_guides_orgId_category_sortOrder_idx" ON "org_guides"("orgId", "category", "sortOrder");

-- CreateIndex
CREATE INDEX "org_announcements_orgId_createdAt_idx" ON "org_announcements"("orgId", "createdAt");

-- CreateIndex
CREATE INDEX "activities_orgId_createdAt_idx" ON "activities"("orgId", "createdAt");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_guides" ADD CONSTRAINT "org_guides_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_guides" ADD CONSTRAINT "org_guides_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_announcements" ADD CONSTRAINT "org_announcements_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_announcements" ADD CONSTRAINT "org_announcements_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
