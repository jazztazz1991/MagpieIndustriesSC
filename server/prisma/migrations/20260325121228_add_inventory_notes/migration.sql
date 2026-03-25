-- CreateTable
CREATE TABLE "inventory_notes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "sellCount" INTEGER NOT NULL DEFAULT 0,
    "keepCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_notes_userId_createdAt_idx" ON "inventory_notes"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "inventory_notes" ADD CONSTRAINT "inventory_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
