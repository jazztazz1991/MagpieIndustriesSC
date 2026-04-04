-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "WikeloProjectStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE "wikelo_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "WikeloProjectStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wikelo_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wikelo_project_materials" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "required" INTEGER NOT NULL,
    "collected" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "wikelo_project_materials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wikelo_projects_userId_status_idx" ON "wikelo_projects"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "wikelo_project_materials_projectId_itemName_key" ON "wikelo_project_materials"("projectId", "itemName");

-- AddForeignKey
ALTER TABLE "wikelo_projects" ADD CONSTRAINT "wikelo_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wikelo_project_materials" ADD CONSTRAINT "wikelo_project_materials_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "wikelo_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
