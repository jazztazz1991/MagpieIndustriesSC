"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import type { Ore, RockSignature } from "@/data/mining";
import type { MiningLaser } from "@/data/mining-lasers";
import type { MiningModule, MiningGadget } from "@/data/mining-gadgets";
import type { MiningShip } from "@/data/mining-ships";
import type { RefineryMethod, RefineryStation } from "@/data/refinery";
import type { MiningLocation } from "@/data/mining-locations";

// Static fallback imports
import { ores as staticOres, scannerOreOrder as staticScannerOrder, rockSignatures as staticRockSigs } from "@/data/mining";
import { miningLasers as staticLasers } from "@/data/mining-lasers";
import { activeModules as staticActive, passiveModules as staticPassive, miningGadgets as staticGadgets } from "@/data/mining-gadgets";
import { miningShips as staticShips } from "@/data/mining-ships";
import { refineryMethods as staticMethods, refineryStations as staticStations } from "@/data/refinery";
import { miningLocations as staticLocations } from "@/data/mining-locations";

export interface GameData {
  ores: Ore[];
  scannerOreOrder: string[];
  rockClasses: string[];
  rockSignatures: RockSignature[];
  lasers: MiningLaser[];
  activeModules: MiningModule[];
  passiveModules: MiningModule[];
  gadgets: MiningGadget[];
  ships: MiningShip[];
  refineryMethods: RefineryMethod[];
  refineryStations: RefineryStation[];
  locations: MiningLocation[];
}

// API response shape from /api/game-data/all
interface ApiGameData {
  ores: ApiOre[];
  lasers: ApiLaser[];
  modules: ApiModule[];
  ships: ApiShip[];
  rockSignatures: ApiRockSig[];
  refineryMethods: ApiRefineryMethod[];
  refineryStations: ApiRefineryStation[];
  locations: ApiLocation[];
}

interface ApiOre { id: string; name: string; abbrev: string; type: string; valuePerSCU: number; instability: number; resistance: number; description: string; sortOrder: number; }
interface ApiLaser { id: string; name: string; size: number; price: number; optimumRange: number; maxRange: number; minPower: number; minPowerPct: number; maxPower: number; extractPower: number; moduleSlots: number; resistance: number; instability: number; optimalChargeRate: number; optimalChargeWindow: number; inertMaterials: number; description: string; }
interface ApiModule { id: string; name: string; category: string; price: number; duration: number; uses: number; miningLaserPower: number; laserInstability: number; resistance: number; optimalChargeWindow: number; optimalChargeRate: number; overchargeRate: number; shatterDamage: number; extractionLaserPower: number; inertMaterials: number; clusterModifier: number; description: string; }
interface ApiShip { id: string; name: string; manufacturer: string; size: string; cargoSCU: number; miningTurrets: number; crewMin: number; crewMax: number; isVehicle: boolean; description: string; }
interface ApiRockSig { id: string; name: string; baseRU: number; maxMultiples: number; }
interface ApiRefineryMethod { id: string; name: string; yieldMultiplier: number; relativeTime: number; relativeCost: number; description: string; }
interface ApiRefineryStation { id: string; name: string; location: string; bonuses: Record<string, number>; }
interface ApiLocation { id: string; name: string; type: string; parentBody: string; gravity: string; atmosphere: boolean; danger: string; ores: string[]; notes: string; }

function mapApiToGameData(api: ApiGameData): GameData {
  const ores: Ore[] = api.ores.map((o) => ({
    name: o.name,
    abbrev: o.abbrev,
    type: o.type.toLowerCase() as Ore["type"],
    valuePerSCU: o.valuePerSCU,
    instability: o.instability,
    resistance: o.resistance,
    description: o.description,
  }));

  const scannerOreOrder = api.ores
    .filter((o) => o.abbrev !== "HADA") // Hadanite is hand-mined, not in scanner
    .map((o) => o.abbrev);

  const rockSignatures: RockSignature[] = api.rockSignatures.map((r) => ({
    name: r.name,
    baseRU: r.baseRU,
    maxMultiples: r.maxMultiples,
  }));

  const lasers: MiningLaser[] = api.lasers.map((l) => ({
    name: l.name,
    size: l.size as MiningLaser["size"],
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

  const activeModules: MiningModule[] = api.modules
    .filter((m) => m.category === "ACTIVE")
    .map((m) => ({
      name: m.name,
      type: "active" as const,
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
    }));

  const passiveModules: MiningModule[] = api.modules
    .filter((m) => m.category === "PASSIVE")
    .map((m) => ({
      name: m.name,
      type: "passive" as const,
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
    }));

  const gadgets: MiningGadget[] = api.modules
    .filter((m) => m.category === "GADGET")
    .map((m) => ({
      name: m.name,
      type: "gadget" as const,
      price: m.price,
      laserInstability: m.laserInstability,
      resistance: m.resistance,
      optimalChargeWindow: m.optimalChargeWindow,
      optimalChargeRate: m.optimalChargeRate,
      extractionLaserPower: m.extractionLaserPower,
      inertMaterials: m.inertMaterials,
      clusterModifier: m.clusterModifier,
      description: m.description,
    }));

  const ships: MiningShip[] = api.ships.map((s) => ({
    name: s.name,
    manufacturer: s.manufacturer,
    size: s.size as MiningShip["size"],
    cargoSCU: s.cargoSCU,
    miningTurrets: s.miningTurrets,
    crewMin: s.crewMin,
    crewMax: s.crewMax,
    isVehicle: s.isVehicle,
    description: s.description,
  }));

  const refineryMethods: RefineryMethod[] = api.refineryMethods.map((m) => ({
    name: m.name,
    yieldMultiplier: m.yieldMultiplier,
    relativeTime: m.relativeTime,
    relativeCost: m.relativeCost,
    description: m.description,
  }));

  const refineryStations: RefineryStation[] = api.refineryStations.map((s) => ({
    name: s.name,
    location: s.location,
    bonuses: s.bonuses,
  }));

  const locations: MiningLocation[] = api.locations.map((l) => ({
    name: l.name,
    type: l.type as MiningLocation["type"],
    parentBody: l.parentBody,
    gravity: l.gravity as MiningLocation["gravity"],
    atmosphere: l.atmosphere,
    danger: l.danger as MiningLocation["danger"],
    ores: l.ores,
    notes: l.notes,
  }));

  return {
    ores,
    scannerOreOrder,
    rockClasses: rockSignatures.map((r) => r.name),
    rockSignatures,
    lasers,
    activeModules,
    passiveModules,
    gadgets,
    ships,
    refineryMethods,
    refineryStations,
    locations,
  };
}

const STATIC_FALLBACK: GameData = {
  ores: staticOres,
  scannerOreOrder: staticScannerOrder,
  rockClasses: staticRockSigs.map((r) => r.name),
  rockSignatures: staticRockSigs,
  lasers: staticLasers,
  activeModules: staticActive,
  passiveModules: staticPassive,
  gadgets: staticGadgets,
  ships: staticShips,
  refineryMethods: staticMethods,
  refineryStations: staticStations,
  locations: staticLocations,
};

export function useGameData(): { data: GameData; loading: boolean; error: string | null } {
  const [data, setData] = useState<GameData>(STATIC_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiFetch<ApiGameData>("/api/game-data/all");
    if (res.success && res.data) {
      setData(mapApiToGameData(res.data));
    } else {
      setError(res.error || "Failed to fetch game data");
      // Keep static fallback data
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
}
