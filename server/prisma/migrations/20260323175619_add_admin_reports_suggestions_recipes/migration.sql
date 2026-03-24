-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('BUG', 'DATA_ISSUE');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'PLANNED', 'DECLINED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pageUrl" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestions" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestion_votes" (
    "id" TEXT NOT NULL,
    "suggestionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suggestion_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "craft_recipes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "outputItem" TEXT NOT NULL,
    "outputQty" INTEGER NOT NULL DEFAULT 1,
    "difficulty" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "craft_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "craft_ingredients" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "craft_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_recipes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "missionType" TEXT NOT NULL,
    "difficulty" TEXT,
    "minPlayers" INTEGER NOT NULL DEFAULT 1,
    "maxPlayers" INTEGER,
    "estimatedPay" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_objectives" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mission_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_rewards" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" TEXT,

    CONSTRAINT "mission_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reports_status_createdAt_idx" ON "reports"("status", "createdAt");

-- CreateIndex
CREATE INDEX "suggestions_status_createdAt_idx" ON "suggestions"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "suggestion_votes_suggestionId_userId_key" ON "suggestion_votes"("suggestionId", "userId");

-- CreateIndex
CREATE INDEX "craft_recipes_category_idx" ON "craft_recipes"("category");

-- CreateIndex
CREATE INDEX "mission_recipes_missionType_idx" ON "mission_recipes"("missionType");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestion_votes" ADD CONSTRAINT "suggestion_votes_suggestionId_fkey" FOREIGN KEY ("suggestionId") REFERENCES "suggestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestion_votes" ADD CONSTRAINT "suggestion_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "craft_ingredients" ADD CONSTRAINT "craft_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "craft_recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_objectives" ADD CONSTRAINT "mission_objectives_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission_recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_rewards" ADD CONSTRAINT "mission_rewards_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission_recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
