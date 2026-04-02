-- AlterTable: Remove old columns from game_rock_signatures, add rarity
ALTER TABLE "game_rock_signatures" DROP COLUMN IF EXISTS "baseRU";
ALTER TABLE "game_rock_signatures" DROP COLUMN IF EXISTS "maxMultiples";
ALTER TABLE "game_rock_signatures" ADD COLUMN IF NOT EXISTS "rarity" TEXT NOT NULL DEFAULT 'common';

-- AlterTable: Add fpsOres to game_mining_locations
ALTER TABLE "game_mining_locations" ADD COLUMN IF NOT EXISTS "fpsOres" JSONB NOT NULL DEFAULT '[]';
