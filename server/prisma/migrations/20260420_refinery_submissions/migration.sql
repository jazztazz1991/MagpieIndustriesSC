-- CreateEnum
CREATE TYPE "RefinerySubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "refinery_submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stationName" TEXT NOT NULL,
    "oreName" TEXT NOT NULL,
    "bonusPct" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "RefinerySubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refinery_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "refinery_submissions_status_idx" ON "refinery_submissions"("status");

-- CreateIndex
CREATE INDEX "refinery_submissions_stationName_oreName_idx" ON "refinery_submissions"("stationName", "oreName");

-- AddForeignKey
ALTER TABLE "refinery_submissions" ADD CONSTRAINT "refinery_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
