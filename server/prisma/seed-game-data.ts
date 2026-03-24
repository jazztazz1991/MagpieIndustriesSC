import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding game data...");

  // --- Ores ---
  const ores = [
    { name: "Quantanium", abbrev: "QUAN", type: "ROCK" as const, valuePerSCU: 88000, instability: 850, resistance: 60, description: "Extremely volatile and valuable. Highest aUEC/SCU. Explodes if you take too long — mine fast or die.", sortOrder: 3 },
    { name: "Bexalite", abbrev: "BEX", type: "ROCK" as const, valuePerSCU: 44000, instability: 620, resistance: 72, description: "High value, high resistance. Tough to crack without power gadgets.", sortOrder: 6 },
    { name: "Taranite", abbrev: "TARA", type: "ROCK" as const, valuePerSCU: 35000, instability: 450, resistance: 55, description: "Solid high-tier ore. Less dangerous than Quantanium, still very profitable.", sortOrder: 5 },
    { name: "Gold", abbrev: "GOLD", type: "METAL" as const, valuePerSCU: 28000, instability: 180, resistance: 35, description: "Valuable metal. Low instability makes it safe to mine. Good consistent income.", sortOrder: 8 },
    { name: "Laranite", abbrev: "LARA", type: "METAL" as const, valuePerSCU: 27500, instability: 200, resistance: 40, description: "Premium metal. Slightly tougher than Gold but very profitable.", sortOrder: 10 },
    { name: "Agricium", abbrev: "AGRI", type: "METAL" as const, valuePerSCU: 25000, instability: 220, resistance: 42, description: "High-grade agricultural metal. Good value and moderate difficulty.", sortOrder: 12 },
    { name: "Hephaestanite", abbrev: "HEPH", type: "ROCK" as const, valuePerSCU: 22000, instability: 380, resistance: 50, description: "Mid-high value ore with moderate instability. Manageable for experienced miners.", sortOrder: 13 },
    { name: "Diamond", abbrev: "DIAM", type: "GEM" as const, valuePerSCU: 20000, instability: 150, resistance: 30, description: "Precious gem. Low instability, easy to mine. Consistent profit.", sortOrder: 7 },
    { name: "Beryl", abbrev: "BERL", type: "GEM" as const, valuePerSCU: 4300, instability: 80, resistance: 15, description: "Common gem. Low value per SCU but very safe and easy to mine.", sortOrder: 11 },
    { name: "Titanium", abbrev: "TITA", type: "METAL" as const, valuePerSCU: 8000, instability: 100, resistance: 25, description: "Industrial metal. Decent value filler ore. Easy to crack.", sortOrder: 16 },
    { name: "Tungsten", abbrev: "TUNG", type: "METAL" as const, valuePerSCU: 3800, instability: 90, resistance: 22, description: "Common industrial metal. Low value but abundant.", sortOrder: 15 },
    { name: "Copper", abbrev: "COPP", type: "METAL" as const, valuePerSCU: 6100, instability: 60, resistance: 15, description: "Base metal. Common filler in most rocks.", sortOrder: 21 },
    { name: "Aluminium", abbrev: "ALUM", type: "METAL" as const, valuePerSCU: 1200, instability: 30, resistance: 10, description: "Very common low-value metal. Usually not worth targeting.", sortOrder: 22 },
    { name: "Corundum", abbrev: "CORU", type: "GEM" as const, valuePerSCU: 2500, instability: 70, resistance: 18, description: "Semi-precious mineral. Low value filler.", sortOrder: 20 },
    { name: "Hadanite", abbrev: "HADA", type: "GEM" as const, valuePerSCU: 15000, instability: 0, resistance: 0, description: "Hand-mineable gem found on cave walls. ROC or hand tool only. No ship mining.", sortOrder: 25 },
    { name: "Inert Material", abbrev: "INER", type: "ROCK" as const, valuePerSCU: 0, instability: 0, resistance: 0, description: "Worthless filler. Takes up cargo space. Avoid if possible.", sortOrder: 25 },
    { name: "Riccite", abbrev: "RICC", type: "ROCK" as const, valuePerSCU: 1500, instability: 120, resistance: 20, description: "Low-value ore. Common in many rock types.", sortOrder: 0 },
    { name: "Stilmenite", abbrev: "STIL", type: "ROCK" as const, valuePerSCU: 1800, instability: 140, resistance: 22, description: "Low-value ore. Slightly better than Riccite.", sortOrder: 1 },
    { name: "Savirite", abbrev: "SAVR", type: "ROCK" as const, valuePerSCU: 2000, instability: 160, resistance: 25, description: "Low-mid value ore.", sortOrder: 2 },
    { name: "Lindelite", abbrev: "LIND", type: "ROCK" as const, valuePerSCU: 3000, instability: 200, resistance: 30, description: "Mid-low value ore with moderate instability.", sortOrder: 4 },
    { name: "Borase", abbrev: "BORS", type: "ROCK" as const, valuePerSCU: 35000, instability: 500, resistance: 58, description: "High value ore similar to Taranite. High instability.", sortOrder: 9 },
    { name: "Torinite", abbrev: "TORI", type: "ROCK" as const, valuePerSCU: 3500, instability: 180, resistance: 28, description: "Mid-tier ore with moderate stats.", sortOrder: 18 },
    { name: "Quartz", abbrev: "QUAR", type: "GEM" as const, valuePerSCU: 1800, instability: 50, resistance: 12, description: "Common mineral. Very easy to mine, low value.", sortOrder: 19 },
    { name: "Iron", abbrev: "IRON", type: "METAL" as const, valuePerSCU: 800, instability: 20, resistance: 8, description: "Most common metal. Very low value.", sortOrder: 17 },
    { name: "Tin", abbrev: "TIN", type: "METAL" as const, valuePerSCU: 1000, instability: 25, resistance: 10, description: "Common soft metal. Low value.", sortOrder: 23 },
    { name: "Ice", abbrev: "ICE", type: "ROCK" as const, valuePerSCU: 300, instability: 10, resistance: 5, description: "Frozen water. Very low value. Abundant in ice fields.", sortOrder: 14 },
    { name: "Silicate", abbrev: "SILI", type: "ROCK" as const, valuePerSCU: 200, instability: 5, resistance: 3, description: "Near-worthless silicate minerals.", sortOrder: 24 },
  ];

  for (const ore of ores) {
    await prisma.gameOre.upsert({
      where: { name: ore.name },
      update: ore,
      create: ore,
    });
  }
  console.log(`  Seeded ${ores.length} ores`);

  // --- Mining Lasers ---
  const lasers = [
    { name: "Lawson", size: 0, price: 4950, optimumRange: 0, maxRange: 0, minPower: 16, minPowerPct: 0.2, maxPower: 80, extractPower: 4, moduleSlots: 0, resistance: -40, instability: 30, optimalChargeRate: 0, optimalChargeWindow: 40, inertMaterials: 0, description: "Basic size-0 mining laser. Good resistance reduction with moderate instability increase." },
    { name: "Helix 0", size: 0, price: 8500, optimumRange: 8, maxRange: 18, minPower: 15, minPowerPct: 15, maxPower: 100, extractPower: 5, moduleSlots: 1, resistance: 0, instability: 0, optimalChargeRate: 20, optimalChargeWindow: -40, inertMaterials: 0, description: "High-power size-0 laser with a module slot. Boosts charge rate but narrows the window." },
    { name: "Klein S0", size: 0, price: 0, optimumRange: 5, maxRange: 15, minPower: 16, minPowerPct: 20, maxPower: 80, extractPower: 4, moduleSlots: 0, resistance: -40, instability: 30, optimalChargeRate: 0, optimalChargeWindow: 40, inertMaterials: 0, description: "Stable size-0 laser. Same stats as Lawson." },
    { name: "Hofstede S0", size: 0, price: 5750, optimumRange: 8, maxRange: 18, minPower: 16, minPowerPct: 20, maxPower: 80, extractPower: 4, moduleSlots: 0, resistance: -40, instability: 30, optimalChargeRate: 20, optimalChargeWindow: 40, inertMaterials: 0, description: "Balanced size-0 laser with good resistance reduction and charge rate boost." },
    { name: "Arbor S0", size: 0, price: 5150, optimumRange: 5, maxRange: 15, minPower: 16, minPowerPct: 20, maxPower: 80, extractPower: 3, moduleSlots: 0, resistance: 0, instability: -40, optimalChargeRate: 0, optimalChargeWindow: 0, inertMaterials: 0, description: "Stable size-0 laser. Reduces instability by 40%." },
    { name: "Drak Pitman", size: 1, price: 0, optimumRange: 40, maxRange: 45, minPower: 630, minPowerPct: 20, maxPower: 3150, extractPower: 1295, moduleSlots: 2, resistance: 25, instability: 35, optimalChargeRate: -40, optimalChargeWindow: 40, inertMaterials: -40, description: "Stock Drake laser. High max power but increases resistance and instability." },
    { name: "Lancet MH1", size: 1, price: 23000, optimumRange: 30, maxRange: 90, minPower: 504, minPowerPct: 20, maxPower: 2520, extractPower: 1850, moduleSlots: 1, resistance: 0, instability: -10, optimalChargeRate: 40, optimalChargeWindow: -60, inertMaterials: -30, description: "Long range laser with high extraction power." },
    { name: "Arbor MH1", size: 1, price: 1500, optimumRange: 60, maxRange: 180, minPower: 189, minPowerPct: 5, maxPower: 1890, extractPower: 1850, moduleSlots: 1, resistance: 25, instability: -35, optimalChargeRate: 0, optimalChargeWindow: 40, inertMaterials: -30, description: "Stock Prospector laser. Very long range, very stable." },
    { name: "Hofstede-S1", size: 1, price: 12750, optimumRange: 45, maxRange: 135, minPower: 105, minPowerPct: 5, maxPower: 2100, extractPower: 1295, moduleSlots: 1, resistance: -30, instability: 10, optimalChargeRate: 20, optimalChargeWindow: 60, inertMaterials: -30, description: "Balanced laser with strong resistance reduction and wide charge window." },
    { name: "Klein-S1", size: 1, price: 10150, optimumRange: 45, maxRange: 135, minPower: 378, minPowerPct: 17, maxPower: 2220, extractPower: 2220, moduleSlots: 0, resistance: -45, instability: 35, optimalChargeRate: 0, optimalChargeWindow: 20, inertMaterials: -30, description: "Best resistance reduction at size 1. No module slots." },
    { name: "Impact I", size: 1, price: 57000, optimumRange: 45, maxRange: 135, minPower: 420, minPowerPct: 20, maxPower: 2100, extractPower: 2775, moduleSlots: 2, resistance: 10, instability: -10, optimalChargeRate: -40, optimalChargeWindow: 20, inertMaterials: -30, description: "Highest extraction power at size 1. Two module slots." },
    { name: "Helix I", size: 1, price: 100000, optimumRange: 15, maxRange: 45, minPower: 630, minPowerPct: 20, maxPower: 3150, extractPower: 1850, moduleSlots: 2, resistance: -30, instability: 0, optimalChargeRate: 0, optimalChargeWindow: -40, inertMaterials: -30, description: "Highest max power at size 1. Short range but strong resistance reduction." },
    { name: "Lancet MH2", size: 2, price: 23500, optimumRange: 45, maxRange: 135, minPower: 900, minPowerPct: 25, maxPower: 3600, extractPower: 2590, moduleSlots: 2, resistance: 0, instability: -10, optimalChargeRate: 40, optimalChargeWindow: -60, inertMaterials: -40, description: "Long range size-2 laser. High charge rate but very narrow window." },
    { name: "Hofstede-S2", size: 2, price: 12000, optimumRange: 60, maxRange: 180, minPower: 336, minPowerPct: 10, maxPower: 3360, extractPower: 1295, moduleSlots: 2, resistance: -30, instability: 10, optimalChargeRate: 20, optimalChargeWindow: 60, inertMaterials: -40, description: "Balanced size-2 laser. Widest charge window." },
    { name: "Klein-S2", size: 2, price: 10150, optimumRange: 60, maxRange: 180, minPower: 720, minPowerPct: 20, maxPower: 3600, extractPower: 2775, moduleSlots: 1, resistance: -45, instability: 35, optimalChargeRate: 0, optimalChargeWindow: 20, inertMaterials: -40, description: "Best resistance reduction at size 2." },
    { name: "Impact II", size: 2, price: 57750, optimumRange: 60, maxRange: 180, minPower: 840, minPowerPct: 25, maxPower: 3360, extractPower: 3145, moduleSlots: 3, resistance: 10, instability: -10, optimalChargeRate: -40, optimalChargeWindow: 20, inertMaterials: -40, description: "Highest extraction power at size 2. Three module slots." },
    { name: "Helix II", size: 2, price: 108000, optimumRange: 30, maxRange: 90, minPower: 1020, minPowerPct: 25, maxPower: 4080, extractPower: 2590, moduleSlots: 3, resistance: -30, instability: 0, optimalChargeRate: 0, optimalChargeWindow: -40, inertMaterials: -30, description: "Highest max power at size 2. Three module slots." },
    { name: "Arbor MH2", size: 2, price: 1500, optimumRange: 90, maxRange: 270, minPower: 480, minPowerPct: 5, maxPower: 2400, extractPower: 2590, moduleSlots: 2, resistance: 25, instability: -35, optimalChargeRate: 0, optimalChargeWindow: 40, inertMaterials: -40, description: "Longest range at size 2. Very stable." },
  ];

  for (const laser of lasers) {
    await prisma.gameMiningLaser.upsert({
      where: { name: laser.name },
      update: laser,
      create: laser,
    });
  }
  console.log(`  Seeded ${lasers.length} mining lasers`);

  // --- Mining Modules (Active + Passive + Gadgets) ---
  const modules = [
    // Active
    { name: "Brandt", category: "ACTIVE" as const, price: 2250, duration: 60, uses: 5, miningLaserPower: 135, laserInstability: 0, resistance: 15, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: -30, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Boosts laser power to 135% and reduces shatter damage by 30%." },
    { name: "Forel", category: "ACTIVE" as const, price: 1950, duration: 60, uses: 6, miningLaserPower: 0, laserInstability: 0, resistance: 15, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: -60, shatterDamage: 0, extractionLaserPower: 150, inertMaterials: 0, clusterModifier: 0, description: "Massively boosts extraction laser power to 150%." },
    { name: "Lifeline", category: "ACTIVE" as const, price: 800, duration: 15, uses: 3, miningLaserPower: 0, laserInstability: -20, resistance: -15, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 60, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Emergency stabilizer. Reduces instability and resistance but increases shatter damage." },
    { name: "Optimum", category: "ACTIVE" as const, price: 3000, duration: 60, uses: 5, miningLaserPower: 85, laserInstability: -10, resistance: 0, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: -80, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Safe mining module. Reduces overcharge rate by 80%." },
    { name: "Rime", category: "ACTIVE" as const, price: 1100, duration: 20, uses: 10, miningLaserPower: 85, laserInstability: 0, resistance: -25, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: -10, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Reduces resistance by 25%. 10 uses makes it very versatile." },
    { name: "Stampede", category: "ACTIVE" as const, price: 1400, duration: 30, uses: 6, miningLaserPower: 135, laserInstability: -10, resistance: 0, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: -10, extractionLaserPower: 85, inertMaterials: 0, clusterModifier: 0, description: "Power boost to 135% with reduced instability. Great for cracking tough rocks." },
    { name: "Surge", category: "ACTIVE" as const, price: 1400, duration: 15, uses: 7, miningLaserPower: 150, laserInstability: 10, resistance: -15.5, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Maximum power boost to 150%. Short burst for tough rocks." },
    { name: "Torpid", category: "ACTIVE" as const, price: 1950, duration: 60, uses: 5, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 0, optimalChargeRate: 60, overchargeRate: -60, shatterDamage: 40, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Boosts optimal charge rate by 60%. Precision mining module." },
    // Passive
    { name: "FLTR", category: "PASSIVE" as const, price: 6000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 85, inertMaterials: -20, clusterModifier: 0, description: "Filters out 20% of inert materials." },
    { name: "FLTR-L", category: "PASSIVE" as const, price: 18000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 90, inertMaterials: -23, clusterModifier: 0, description: "Filters out 23% of inert materials." },
    { name: "FLTR-XL", category: "PASSIVE" as const, price: 60000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 95, inertMaterials: -24, clusterModifier: 0, description: "Filters out 24% of inert materials. Best filtration." },
    { name: "Focus", category: "PASSIVE" as const, price: 4000, duration: 0, uses: 0, miningLaserPower: 85, laserInstability: 0, resistance: 0, optimalChargeWindow: 30, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Widens optimal charge window by 30%." },
    { name: "Focus II", category: "PASSIVE" as const, price: 12000, duration: 0, uses: 0, miningLaserPower: 90, laserInstability: 0, resistance: 0, optimalChargeWindow: 37, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Widens optimal charge window by 37%." },
    { name: "Focus III", category: "PASSIVE" as const, price: 40000, duration: 0, uses: 0, miningLaserPower: 95, laserInstability: 0, resistance: 0, optimalChargeWindow: 40, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Widens optimal charge window by 40%. Best focus module." },
    { name: "Rieger", category: "PASSIVE" as const, price: 6000, duration: 0, uses: 0, miningLaserPower: 115, laserInstability: 0, resistance: 0, optimalChargeWindow: -10, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Boosts laser power to 115%." },
    { name: "Rieger-C2", category: "PASSIVE" as const, price: 18000, duration: 0, uses: 0, miningLaserPower: 120, laserInstability: 0, resistance: 0, optimalChargeWindow: -3, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Boosts laser power to 120%." },
    { name: "Rieger-C3", category: "PASSIVE" as const, price: 60000, duration: 0, uses: 0, miningLaserPower: 125, laserInstability: 0, resistance: 0, optimalChargeWindow: -1, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Boosts laser power to 125%. Best power module." },
    { name: "Torrent", category: "PASSIVE" as const, price: 4000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: -10, optimalChargeRate: 30, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Boosts optimal charge rate by 30%." },
    { name: "Torrent II", category: "PASSIVE" as const, price: 12000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: -3, optimalChargeRate: 35, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Boosts optimal charge rate by 35%." },
    { name: "Torrent III", category: "PASSIVE" as const, price: 40000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: -1, optimalChargeRate: 45, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Boosts optimal charge rate by 45%. Best charge rate module." },
    { name: "Vaux", category: "PASSIVE" as const, price: 2000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 0, optimalChargeRate: -20, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 115, inertMaterials: 0, clusterModifier: 0, description: "Boosts extraction power to 115%." },
    { name: "Vaux-C2", category: "PASSIVE" as const, price: 6000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 0, optimalChargeRate: -15, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 120, inertMaterials: 0, clusterModifier: 0, description: "Boosts extraction power to 120%." },
    { name: "Vaux-C3", category: "PASSIVE" as const, price: 20000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 0, optimalChargeRate: -5, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 125, inertMaterials: 0, clusterModifier: 0, description: "Boosts extraction power to 125%. Best extraction module." },
    { name: "XTR", category: "PASSIVE" as const, price: 2000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 15, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 85, inertMaterials: -5, clusterModifier: 0, description: "Widens charge window by 15% and filters 5% inert materials." },
    { name: "XTR-L", category: "PASSIVE" as const, price: 6000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 22, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 90, inertMaterials: -6, clusterModifier: 0, description: "Widens charge window by 22% and filters 6% inert materials." },
    { name: "XTR-XL", category: "PASSIVE" as const, price: 20000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 0, optimalChargeWindow: 25, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 95, inertMaterials: -6, clusterModifier: 0, description: "Widens charge window by 25% and filters 6% inert materials. Best XTR." },
    // Gadgets
    { name: "Optimax", category: "GADGET" as const, price: 27000, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: -25, resistance: -30, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 60, description: "Reduces instability by 25% and resistance by 30%. Boosts cluster by 60%." },
    { name: "Okunis", category: "GADGET" as const, price: 23250, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: 0, resistance: 50, optimalChargeWindow: 100, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: -20, clusterModifier: 0, description: "Doubles optimal charge window and reduces inert materials by 20%." },
    { name: "Sabir", category: "GADGET" as const, price: 13815, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: -50, resistance: 50, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 15, inertMaterials: 0, clusterModifier: 0, description: "Halves instability but increases resistance by 50%." },
    { name: "Stalwart", category: "GADGET" as const, price: 20190, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: -35, resistance: -30, optimalChargeWindow: 50, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 30, description: "Reduces instability by 35% and resistance by 30%." },
    { name: "Boremax", category: "GADGET" as const, price: 12750, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: -70, resistance: 10, optimalChargeWindow: 0, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 30, description: "Massive instability reduction of 70%." },
    { name: "Waveshift", category: "GADGET" as const, price: 19125, duration: 0, uses: 0, miningLaserPower: 0, laserInstability: -35, resistance: 100, optimalChargeWindow: -30, optimalChargeRate: 0, overchargeRate: 0, shatterDamage: 0, extractionLaserPower: 0, inertMaterials: 0, clusterModifier: 0, description: "Reduces instability by 35% but doubles resistance." },
  ];

  for (const mod of modules) {
    await prisma.gameMiningModule.upsert({
      where: { name: mod.name },
      update: mod,
      create: mod,
    });
  }
  console.log(`  Seeded ${modules.length} mining modules`);

  // --- Mining Ships ---
  const ships = [
    { name: "Prospector", manufacturer: "MISC", size: "small", cargoSCU: 32, miningTurrets: 1, crewMin: 1, crewMax: 1, isVehicle: false, description: "Solo mining ship. One size 1 mining laser. 32 SCU ore capacity." },
    { name: "MOLE", manufacturer: "ARGO", size: "medium", cargoSCU: 96, miningTurrets: 3, crewMin: 1, crewMax: 4, isVehicle: false, description: "Multi-crew mining ship. Three size 1 mining lasers. 96 SCU across 3 saddle bags." },
    { name: "ROC", manufacturer: "Greycat Industrial", size: "small", cargoSCU: 0.8, miningTurrets: 1, crewMin: 1, crewMax: 1, isVehicle: true, description: "Ground mining vehicle for hand-mineable gems." },
    { name: "ROC-DS", manufacturer: "Greycat Industrial", size: "small", cargoSCU: 1.6, miningTurrets: 2, crewMin: 1, crewMax: 2, isVehicle: true, description: "Dual-seat ROC variant with two mining arms." },
  ];

  for (const ship of ships) {
    await prisma.gameMiningShip.upsert({
      where: { name: ship.name },
      update: ship,
      create: ship,
    });
  }
  console.log(`  Seeded ${ships.length} mining ships`);

  // --- Rock Signatures ---
  const rockSigs = [
    { name: "Shale Deposit", baseRU: 1730, maxMultiples: 18 },
    { name: "Felsic Deposit", baseRU: 1770, maxMultiples: 18 },
    { name: "Obsidian Deposit", baseRU: 1790, maxMultiples: 18 },
    { name: "Atacamite Deposit", baseRU: 1800, maxMultiples: 18 },
    { name: "Quartzite Deposit", baseRU: 1820, maxMultiples: 18 },
    { name: "Gneiss Deposit", baseRU: 1840, maxMultiples: 18 },
    { name: "Granite Deposit", baseRU: 1920, maxMultiples: 18 },
    { name: "Igneous Deposit", baseRU: 1950, maxMultiples: 18 },
    { name: "Ice Type", baseRU: 1660, maxMultiples: 8 },
    { name: "Asteroid C Type", baseRU: 1700, maxMultiples: 8 },
    { name: "Asteroid S Type", baseRU: 1720, maxMultiples: 8 },
    { name: "Asteroid M Type", baseRU: 1850, maxMultiples: 8 },
    { name: "Asteroid Q Type", baseRU: 1870, maxMultiples: 8 },
    { name: "Asteroid E Type", baseRU: 1900, maxMultiples: 8 },
    { name: "Asteroid P Type", baseRU: 1750, maxMultiples: 8 },
  ];

  for (const sig of rockSigs) {
    await prisma.gameRockSignature.upsert({
      where: { name: sig.name },
      update: sig,
      create: sig,
    });
  }
  console.log(`  Seeded ${rockSigs.length} rock signatures`);

  // --- Refinery Methods ---
  const refineryMethods = [
    { name: "Dinyx Solventation", yieldMultiplier: 0.85, relativeTime: 9, relativeCost: 1, description: "Highest yield tier. Slowest but cheapest." },
    { name: "Ferron Exchange", yieldMultiplier: 0.85, relativeTime: 8, relativeCost: 2, description: "Highest yield tier. Slightly faster than Dinyx." },
    { name: "Pyrometric Chromalysis", yieldMultiplier: 0.85, relativeTime: 6, relativeCost: 3, description: "Highest yield tier. Fastest of the top-tier methods." },
    { name: "Thermonatic Deposition", yieldMultiplier: 0.73, relativeTime: 7, relativeCost: 1, description: "Mid yield tier. Slow but cheap." },
    { name: "Electrostarolysis", yieldMultiplier: 0.73, relativeTime: 5, relativeCost: 2, description: "Mid yield tier. Moderate speed and cost." },
    { name: "Gaskin Process", yieldMultiplier: 0.73, relativeTime: 3, relativeCost: 3, description: "Mid yield tier. Fast but expensive." },
    { name: "Kazen Winnowing", yieldMultiplier: 0.60, relativeTime: 4, relativeCost: 1, description: "Low yield tier. Moderate speed, cheapest." },
    { name: "Cormack Method", yieldMultiplier: 0.60, relativeTime: 2, relativeCost: 2, description: "Low yield tier. Fast at moderate cost." },
    { name: "XCR Reaction", yieldMultiplier: 0.60, relativeTime: 1, relativeCost: 3, description: "Low yield tier. Fastest method available." },
  ];

  for (const method of refineryMethods) {
    await prisma.gameRefineryMethod.upsert({
      where: { name: method.name },
      update: method,
      create: method,
    });
  }
  console.log(`  Seeded ${refineryMethods.length} refinery methods`);

  // --- Refinery Stations ---
  const stations = [
    { name: "Green Glade Station", location: "HUR-L1", bonuses: { Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2, Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4 } },
    { name: "Faithful Dream Station", location: "HUR-L2", bonuses: { Quantanium: 2, Gold: 1, Taranite: -3, Laranite: -1, Agricium: -2, Beryl: 1, Copper: -3 } },
    { name: "Ambitious Dream Station", location: "CRU-L1", bonuses: { Gold: -6, Bexalite: -6, Laranite: -8, Hephaestanite: -2, Beryl: 7, Titanium: -1, Tungsten: 2, Iron: 2, Corundum: 7 } },
    { name: "Wide Forest Station", location: "ARC-L1", bonuses: { Quantanium: 3, Taranite: -6, Laranite: -2, Hephaestanite: -4, Beryl: 7, Titanium: 5, Quartz: 11, Iron: 1, Corundum: -4, Aluminium: -5 } },
    { name: "Lively Pathway Station", location: "ARC-L2", bonuses: { Quantanium: 3, Gold: 7, Bexalite: 2, Borase: 2, Titanium: 3, Tungsten: -6, Copper: 6, Corundum: -3 } },
    { name: "Faint Glen Station", location: "ARC-L4", bonuses: { Taranite: 5, Gold: -4, Agricium: -4, Beryl: -4, Titanium: -2, Tungsten: -5, Copper: -4, Corundum: -9, Aluminium: -3 } },
    { name: "Shallow Frontier Station", location: "MIC-L1", bonuses: { Gold: 1, Agricium: 8, Laranite: 2, Beryl: -6, Copper: 4, Corundum: 2, Aluminium: 7 } },
    { name: "Long Forest Station", location: "MIC-L2", bonuses: { Quantanium: 1, Gold: 9, Bexalite: 9, Borase: -3, Laranite: -1, Titanium: 6, Tungsten: 9, Copper: 2, Corundum: 6 } },
    { name: "Modern Icarus Station", location: "MIC-L5", bonuses: { Borase: 9, Hephaestanite: 8, Bexalite: 12, Beryl: 7, Titanium: 13, Iron: 8 } },
    { name: "Pyro Gate", location: "Pyro", bonuses: { Gold: -6, Laranite: -8, Hephaestanite: -2, Titanium: -1, Tungsten: 2, Iron: 2, Corundum: 7, Aluminium: -5 } },
    { name: "Magnus Gate", location: "Magnus", bonuses: { Quantanium: 3, Taranite: -6, Laranite: -2, Hephaestanite: -4, Beryl: 7, Titanium: 5, Quartz: 11, Iron: 1, Corundum: -4, Aluminium: -5 } },
    { name: "Terra Gate", location: "Terra", bonuses: { Gold: 1, Agricium: 8, Laranite: 2, Beryl: -6, Copper: 4, Corundum: 2, Aluminium: 7 } },
    { name: "Pyro Orbituary", location: "Pyro", bonuses: { Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2, Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4 } },
    { name: "Pyro Checkmate", location: "Pyro", bonuses: { Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2, Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4 } },
    { name: "Ruin Station", location: "Pyro", bonuses: { Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2, Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4 } },
    { name: "Stanton Gateway", location: "Pyro", bonuses: { Quantanium: 2, Gold: -3, Bexalite: -2, Borase: 1, Laranite: 2, Agricium: -8, Tungsten: 4, Iron: -5, Copper: -5, Corundum: -5, Aluminium: -4 } },
  ];

  for (const station of stations) {
    await prisma.gameRefineryStation.upsert({
      where: { name: station.name },
      update: station,
      create: station,
    });
  }
  console.log(`  Seeded ${stations.length} refinery stations`);

  // --- Mining Locations ---
  const locations = [
    { name: "Aberdeen", type: "moon", parentBody: "Hurston", gravity: "low", atmosphere: true, danger: "medium", ores: ["Agricium", "Aluminium", "Corundum", "Gold", "Hephaestanite", "Quartz"], notes: "Toxic atmosphere. Good for Agricium." },
    { name: "Arial", type: "moon", parentBody: "Hurston", gravity: "low", atmosphere: true, danger: "high", ores: ["Agricium", "Bexalite", "Laranite", "Aluminium", "Copper"], notes: "Extremely hot. Best for Bexalite and Laranite." },
    { name: "Ita", type: "moon", parentBody: "Hurston", gravity: "low", atmosphere: true, danger: "medium", ores: ["Aluminium", "Copper", "Gold", "Tungsten", "Diamond"], notes: "Cold moon. Decent for Gold and Diamond." },
    { name: "Magda", type: "moon", parentBody: "Hurston", gravity: "low", atmosphere: true, danger: "medium", ores: ["Aluminium", "Beryl", "Gold", "Hephaestanite", "Titanium"], notes: "Good mid-tier mining for Hephaestanite." },
    { name: "Cellin", type: "moon", parentBody: "Crusader", gravity: "low", atmosphere: false, danger: "low", ores: ["Agricium", "Aluminium", "Copper", "Gold", "Taranite", "Titanium"], notes: "No atmosphere. Taranite and Agricium deposits." },
    { name: "Daymar", type: "moon", parentBody: "Crusader", gravity: "low", atmosphere: true, danger: "low", ores: ["Aluminium", "Beryl", "Copper", "Gold", "Hadanite"], notes: "Popular for ROC mining Hadanite." },
    { name: "Yela", type: "moon", parentBody: "Crusader", gravity: "low", atmosphere: true, danger: "low", ores: ["Agricium", "Aluminium", "Beryl", "Corundum", "Diamond", "Gold", "Taranite"], notes: "Ice moon. Good variety. Popular for Taranite." },
    { name: "Lyria", type: "moon", parentBody: "ArcCorp", gravity: "low", atmosphere: true, danger: "medium", ores: ["Agricium", "Aluminium", "Gold", "Hadanite", "Laranite", "Taranite"], notes: "Good Hadanite spots for ROC mining." },
    { name: "Wala", type: "moon", parentBody: "ArcCorp", gravity: "low", atmosphere: true, danger: "low", ores: ["Aluminium", "Copper", "Gold", "Titanium", "Tungsten"], notes: "Good for beginners." },
    { name: "Calliope", type: "moon", parentBody: "microTech", gravity: "low", atmosphere: true, danger: "low", ores: ["Agricium", "Aluminium", "Copper", "Gold", "Laranite"], notes: "Good Laranite deposits. Peaceful." },
    { name: "Clio", type: "moon", parentBody: "microTech", gravity: "low", atmosphere: true, danger: "medium", ores: ["Agricium", "Aluminium", "Gold", "Quantanium", "Taranite"], notes: "One of the few surface locations for Quantanium." },
    { name: "Euterpe", type: "moon", parentBody: "microTech", gravity: "low", atmosphere: true, danger: "low", ores: ["Aluminium", "Beryl", "Copper", "Gold", "Hephaestanite"], notes: "Decent Hephaestanite." },
    { name: "Aaron Halo", type: "asteroid_belt", parentBody: "Stanton (system)", gravity: "none", atmosphere: false, danger: "high", ores: ["Quantanium", "Bexalite", "Taranite", "Laranite", "Agricium", "Gold", "Titanium", "Hephaestanite", "Diamond"], notes: "THE spot for Quantanium. Highest density of valuable ores." },
  ];

  for (const loc of locations) {
    await prisma.gameMiningLocation.upsert({
      where: { name: loc.name },
      update: loc,
      create: loc,
    });
  }
  console.log(`  Seeded ${locations.length} mining locations`);

  console.log("Game data seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
