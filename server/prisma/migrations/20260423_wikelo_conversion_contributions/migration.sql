-- CreateEnum
CREATE TYPE "WikeloConversionMaterial" AS ENUM ('MG_SCRIP', 'QUANTANIUM');

-- CreateTable
CREATE TABLE "wikelo_conversion_contributions" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "material" "WikeloConversionMaterial" NOT NULL,
    "delta" INTEGER NOT NULL,
    "newTotal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wikelo_conversion_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wikelo_conversion_contributions_groupId_material_createdAt_idx" ON "wikelo_conversion_contributions"("groupId", "material", "createdAt");

-- CreateIndex
CREATE INDEX "wikelo_conversion_contributions_userId_createdAt_idx" ON "wikelo_conversion_contributions"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "wikelo_conversion_contributions" ADD CONSTRAINT "wikelo_conversion_contributions_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "wikelo_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wikelo_conversion_contributions" ADD CONSTRAINT "wikelo_conversion_contributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
