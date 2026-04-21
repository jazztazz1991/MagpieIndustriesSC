-- AlterTable
ALTER TABLE "crew_assignments" ADD COLUMN "seatId" TEXT;
ALTER TABLE "crew_assignments" ADD COLUMN "notes" TEXT;

-- CreateIndex
CREATE INDEX "crew_assignments_operationShipId_seatId_idx" ON "crew_assignments"("operationShipId", "seatId");
