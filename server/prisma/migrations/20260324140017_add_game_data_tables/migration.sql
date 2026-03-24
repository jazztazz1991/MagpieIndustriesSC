-- CreateEnum
CREATE TYPE "ModuleCategory" AS ENUM ('ACTIVE', 'PASSIVE', 'GADGET');

-- CreateEnum
CREATE TYPE "OreType" AS ENUM ('ROCK', 'GEM', 'METAL');

-- CreateTable
CREATE TABLE "game_ores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbrev" TEXT NOT NULL,
    "type" "OreType" NOT NULL,
    "valuePerSCU" INTEGER NOT NULL,
    "instability" DOUBLE PRECISION NOT NULL,
    "resistance" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_ores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_mining_lasers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "optimumRange" INTEGER NOT NULL,
    "maxRange" INTEGER NOT NULL,
    "minPower" INTEGER NOT NULL,
    "minPowerPct" DOUBLE PRECISION NOT NULL,
    "maxPower" INTEGER NOT NULL,
    "extractPower" INTEGER NOT NULL,
    "moduleSlots" INTEGER NOT NULL,
    "resistance" DOUBLE PRECISION NOT NULL,
    "instability" DOUBLE PRECISION NOT NULL,
    "optimalChargeRate" DOUBLE PRECISION NOT NULL,
    "optimalChargeWindow" DOUBLE PRECISION NOT NULL,
    "inertMaterials" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_mining_lasers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_mining_modules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ModuleCategory" NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "miningLaserPower" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "laserInstability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "resistance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "optimalChargeWindow" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "optimalChargeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overchargeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shatterDamage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extractionLaserPower" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "inertMaterials" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clusterModifier" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_mining_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_mining_ships" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "cargoSCU" DOUBLE PRECISION NOT NULL,
    "miningTurrets" INTEGER NOT NULL,
    "crewMin" INTEGER NOT NULL,
    "crewMax" INTEGER NOT NULL,
    "isVehicle" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_mining_ships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_rock_signatures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseRU" INTEGER NOT NULL,
    "maxMultiples" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_rock_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_refinery_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "yieldMultiplier" DOUBLE PRECISION NOT NULL,
    "relativeTime" INTEGER NOT NULL,
    "relativeCost" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_refinery_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_refinery_stations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "bonuses" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_refinery_stations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_mining_locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parentBody" TEXT NOT NULL,
    "gravity" TEXT NOT NULL,
    "atmosphere" BOOLEAN NOT NULL,
    "danger" TEXT NOT NULL,
    "ores" JSONB NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_mining_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_ores_name_key" ON "game_ores"("name");

-- CreateIndex
CREATE UNIQUE INDEX "game_ores_abbrev_key" ON "game_ores"("abbrev");

-- CreateIndex
CREATE UNIQUE INDEX "game_mining_lasers_name_key" ON "game_mining_lasers"("name");

-- CreateIndex
CREATE INDEX "game_mining_lasers_size_idx" ON "game_mining_lasers"("size");

-- CreateIndex
CREATE UNIQUE INDEX "game_mining_modules_name_key" ON "game_mining_modules"("name");

-- CreateIndex
CREATE INDEX "game_mining_modules_category_idx" ON "game_mining_modules"("category");

-- CreateIndex
CREATE UNIQUE INDEX "game_mining_ships_name_key" ON "game_mining_ships"("name");

-- CreateIndex
CREATE UNIQUE INDEX "game_rock_signatures_name_key" ON "game_rock_signatures"("name");

-- CreateIndex
CREATE UNIQUE INDEX "game_refinery_methods_name_key" ON "game_refinery_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "game_refinery_stations_name_key" ON "game_refinery_stations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "game_mining_locations_name_key" ON "game_mining_locations"("name");
