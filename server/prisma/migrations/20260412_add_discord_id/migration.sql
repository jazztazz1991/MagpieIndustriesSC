-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "discordId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_discordId_key" ON "users"("discordId");
