/**
 * Seeds the hosted database with game data from the client static data files.
 *
 * This reads directly from client/src/data/ so the seed always matches
 * whatever the sync script (scripts/sync-mining-data.ts) last produced.
 *
 * Usage:
 *   cd server && npx tsx prisma/seed-game-data.ts
 */

import { PrismaClient } from "@prisma/client";

// Import directly from client data files — single source of truth
import { ores, scannerOreOrder, rockSignatures } from "../../client/src/data/mining";
import { miningLasers } from "../../client/src/data/mining-lasers";
import { activeModules, passiveModules, miningGadgets } from "../../client/src/data/mining-gadgets";
import { miningShips } from "../../client/src/data/mining-ships";
import { refineryMethods, refineryStations } from "../../client/src/data/refinery";
import { miningLocations } from "../../client/src/data/mining-locations";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding game data from client static files...\n");

  // --- Ores ---
  const oreData = ores.map((o, i) => ({
    name: o.name,
    abbrev: o.abbrev,
    type: o.type.toUpperCase() as "ROCK" | "GEM" | "METAL",
    valuePerSCU: o.valuePerSCU,
    instability: o.instability,
    resistance: o.resistance,
    description: o.description,
    sortOrder: scannerOreOrder.indexOf(o.abbrev) >= 0 ? scannerOreOrder.indexOf(o.abbrev) : i + 100,
  }));

  for (const ore of oreData) {
    await prisma.gameOre.upsert({
      where: { name: ore.name },
      update: ore,
      create: ore,
    });
  }
  console.log(`  Seeded ${oreData.length} ores`);

  // --- Mining Lasers ---
  const laserData = miningLasers.map((l) => ({
    name: l.name,
    size: l.size,
    price: l.price,
    optimumRange: l.optimumRange,
    maxRange: l.maxRange,
    minPower: l.minPower,
    minPowerPct: l.minPowerPct,
    maxPower: l.maxPower,
    extractPower: l.extractPower,
    moduleSlots: l.moduleSlots,
    resistance: l.resistance,
    instability: l.instability,
    optimalChargeRate: l.optimalChargeRate,
    optimalChargeWindow: l.optimalChargeWindow,
    inertMaterials: l.inertMaterials,
    description: l.description,
  }));

  for (const laser of laserData) {
    await prisma.gameMiningLaser.upsert({
      where: { name: laser.name },
      update: laser,
      create: laser,
    });
  }
  console.log(`  Seeded ${laserData.length} mining lasers`);

  // --- Mining Modules (Active + Passive + Gadgets) ---
  const moduleData = [
    ...activeModules.map((m) => ({
      name: m.name,
      category: "ACTIVE" as const,
      price: m.price,
      duration: m.duration,
      uses: m.uses,
      miningLaserPower: m.miningLaserPower,
      laserInstability: m.laserInstability,
      resistance: m.resistance,
      optimalChargeWindow: m.optimalChargeWindow,
      optimalChargeRate: m.optimalChargeRate,
      overchargeRate: m.overchargeRate,
      shatterDamage: m.shatterDamage,
      extractionLaserPower: m.extractionLaserPower,
      inertMaterials: m.inertMaterials,
      clusterModifier: m.clusterModifier,
      description: m.description,
    })),
    ...passiveModules.map((m) => ({
      name: m.name,
      category: "PASSIVE" as const,
      price: m.price,
      duration: m.duration,
      uses: m.uses,
      miningLaserPower: m.miningLaserPower,
      laserInstability: m.laserInstability,
      resistance: m.resistance,
      optimalChargeWindow: m.optimalChargeWindow,
      optimalChargeRate: m.optimalChargeRate,
      overchargeRate: m.overchargeRate,
      shatterDamage: m.shatterDamage,
      extractionLaserPower: m.extractionLaserPower,
      inertMaterials: m.inertMaterials,
      clusterModifier: m.clusterModifier,
      description: m.description,
    })),
    ...miningGadgets.map((g) => ({
      name: g.name,
      category: "GADGET" as const,
      price: g.price,
      duration: 0,
      uses: 0,
      miningLaserPower: 0,
      laserInstability: g.laserInstability,
      resistance: g.resistance,
      optimalChargeWindow: g.optimalChargeWindow,
      optimalChargeRate: g.optimalChargeRate,
      overchargeRate: 0,
      shatterDamage: 0,
      extractionLaserPower: g.extractionLaserPower,
      inertMaterials: g.inertMaterials,
      clusterModifier: g.clusterModifier,
      description: g.description,
    })),
  ];

  for (const mod of moduleData) {
    await prisma.gameMiningModule.upsert({
      where: { name: mod.name },
      update: mod,
      create: mod,
    });
  }
  console.log(`  Seeded ${moduleData.length} mining modules`);

  // --- Mining Ships ---
  const shipData = miningShips.map((s) => ({
    name: s.name,
    manufacturer: s.manufacturer,
    size: s.size,
    cargoSCU: s.cargoSCU,
    miningTurrets: s.miningTurrets,
    crewMin: s.crewMin,
    crewMax: s.crewMax,
    isVehicle: s.isVehicle ?? false,
    description: s.description,
  }));

  for (const ship of shipData) {
    await prisma.gameMiningShip.upsert({
      where: { name: ship.name },
      update: ship,
      create: ship,
    });
  }
  console.log(`  Seeded ${shipData.length} mining ships`);

  // --- Rock Signatures ---
  const rockSigData = rockSignatures.map((r) => ({
    name: r.name,
    baseRU: r.baseRU,
    maxMultiples: r.maxMultiples,
  }));

  for (const sig of rockSigData) {
    await prisma.gameRockSignature.upsert({
      where: { name: sig.name },
      update: sig,
      create: sig,
    });
  }
  console.log(`  Seeded ${rockSigData.length} rock signatures`);

  // --- Refinery Methods ---
  const methodData = refineryMethods.map((m) => ({
    name: m.name,
    yieldMultiplier: m.yieldMultiplier,
    relativeTime: m.relativeTime,
    relativeCost: m.relativeCost,
    description: m.description,
  }));

  for (const method of methodData) {
    await prisma.gameRefineryMethod.upsert({
      where: { name: method.name },
      update: method,
      create: method,
    });
  }
  console.log(`  Seeded ${methodData.length} refinery methods`);

  // --- Refinery Stations ---
  const stationData = refineryStations.map((s) => ({
    name: s.name,
    location: s.location,
    bonuses: s.bonuses,
  }));

  for (const station of stationData) {
    await prisma.gameRefineryStation.upsert({
      where: { name: station.name },
      update: station,
      create: station,
    });
  }
  console.log(`  Seeded ${stationData.length} refinery stations`);

  // --- Mining Locations ---
  const locationData = miningLocations.map((l) => ({
    name: l.name,
    type: l.type,
    parentBody: l.parentBody,
    gravity: l.gravity,
    atmosphere: l.atmosphere,
    danger: l.danger,
    ores: l.ores,
    notes: l.notes,
  }));

  for (const loc of locationData) {
    await prisma.gameMiningLocation.upsert({
      where: { name: loc.name },
      update: loc,
      create: loc,
    });
  }
  console.log(`  Seeded ${locationData.length} mining locations`);

  console.log("\nGame data seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
