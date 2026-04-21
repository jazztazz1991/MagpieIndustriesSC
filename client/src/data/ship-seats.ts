// Auto-generated from DataForge ship XMLs — run scripts/extract-ship-seats.mjs
// Keys match shipName in client/src/data/ships.ts.

import type { ShipLayout } from "@/domain/shipSeats";

export const shipLayouts: Record<string, ShipLayout> = {
  "Hammerhead": {
    shipName: "Hammerhead",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
      { id: "seat_copilot", role: "copilot", label: "Copilot" },
      { id: "cargo_bay_engineer_console", role: "engineer", label: "Cargo Bay Engineer" },
      { id: "component_room_left_engineer_console", role: "engineer", label: "Component Room Left Engineer" },
      { id: "component_room_right_engineer_console", role: "engineer", label: "Component Room Right Engineer" },
      { id: "seat_captains_quarters", role: "crew", label: "Captains Quarters" },
    ],
  },
  "Reclaimer": {
    shipName: "Reclaimer",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
      { id: "seat_copilot", role: "copilot", label: "Copilot" },
      { id: "turret", role: "turret", label: "Turret" },
      { id: "seat_drone_left", role: "crew", label: "Drone Left" },
      { id: "seat_drone_right", role: "crew", label: "Drone Right" },
      { id: "seat_tractorbeam_left", role: "crew", label: "Tractorbeam Left" },
      { id: "seat_tractorbeam_right", role: "crew", label: "Tractorbeam Right" },
    ],
  },
  "Carrack": {
    shipName: "Carrack",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
      { id: "seat_copilot_l", role: "copilot", label: "L Copilot" },
      { id: "seat_copilot_r", role: "copilot", label: "R Copilot" },
      { id: "turret_back_rear", role: "turret", label: "Back Rear Turret" },
      { id: "turret_left", role: "turret", label: "Left Turret" },
      { id: "turret_remote_turret_controller", role: "turret", label: "Remote Turret Controller Turret" },
      { id: "turret_remote_turret", role: "turret", label: "Remote Turret Turret" },
      { id: "turret_right", role: "turret", label: "Right Turret" },
      { id: "seat_bridge_l", role: "crew", label: "Bridge L" },
      { id: "seat_bridge_r", role: "crew", label: "Bridge R" },
      { id: "seat_drone_l", role: "crew", label: "Drone L" },
      { id: "seat_drone_r", role: "crew", label: "Drone R" },
    ],
  },
  "MOLE": {
    shipName: "MOLE",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
      { id: "seat_copilot", role: "copilot", label: "Copilot" },
      { id: "mining_cab_front", role: "mining", label: "Front Mining Cab" },
      { id: "mining_cab_left", role: "mining", label: "Left Mining Cab" },
      { id: "mining_cab_right", role: "mining", label: "Right Mining Cab" },
    ],
  },
  "Caterpillar": {
    shipName: "Caterpillar",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
      { id: "seat_copilot", role: "copilot", label: "Copilot" },
      { id: "seat_engineering", role: "engineer", label: "Engineer" },
      { id: "turret_bottom", role: "turret", label: "Bottom Turret" },
      { id: "turret_top", role: "turret", label: "Top Turret" },
      { id: "seat_support_left", role: "crew", label: "Support Left" },
      { id: "seat_support_right", role: "crew", label: "Support Right" },
      { id: "seat_tractorbeam_left", role: "crew", label: "Tractorbeam Left" },
      { id: "seat_tractorbeam_right", role: "crew", label: "Tractorbeam Right" },
    ],
  },
  "Cutlass Black": {
    shipName: "Cutlass Black",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
      { id: "turret", role: "turret", label: "Turret" },
    ],
  },
  "Freelancer MAX": {
    shipName: "Freelancer MAX",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
      { id: "seat_copilot", role: "copilot", label: "Copilot" },
      { id: "seat_rear_left", role: "crew", label: "Rear Left" },
      { id: "seat_rear_right", role: "crew", label: "Rear Right" },
    ],
  },
  "Prospector": {
    shipName: "Prospector",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
    ],
  },
  "Constellation Andromeda": {
    shipName: "Constellation Andromeda",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
      { id: "seat_copilot_left", role: "copilot", label: "Left Copilot" },
      { id: "seat_copilot_right", role: "copilot", label: "Right Copilot" },
      { id: "turret_base_lower", role: "turret", label: "Base Lower Turret" },
      { id: "turret_base_upper", role: "turret", label: "Base Upper Turret" },
    ],
  },
  "Polaris": {
    shipName: "Polaris",
    seats: [
      { id: "seat_pilot", role: "pilot", label: "Pilot" },
      { id: "seat_copilot", role: "copilot", label: "Copilot" },
      { id: "turret_lower_front", role: "turret", label: "Lower Front Turret" },
      { id: "turret_remote_bottom", role: "turret", label: "Remote Bottom Turret" },
      { id: "turret_remote_top", role: "turret", label: "Remote Top Turret" },
      { id: "seat_turretseatleft", role: "turret", label: "Seatleft Turret" },
      { id: "seat_turretseatright", role: "turret", label: "Seatright Turret" },
      { id: "turret_side_left", role: "turret", label: "Side Left Turret" },
      { id: "turret_side_right", role: "turret", label: "Side Right Turret" },
      { id: "turret_top_left", role: "turret", label: "Top Left Turret" },
      { id: "turret_top_right", role: "turret", label: "Top Right Turret" },
      { id: "turret_torpedo_camera", role: "turret", label: "Torpedo Camera Turret" },
      { id: "seat_torpedo_console", role: "missile", label: "Torpedo Console" },
      { id: "seat_atc", role: "crew", label: "ATC" },
      { id: "seat_captain", role: "crew", label: "Captain" },
    ],
  },
};

export function getShipLayout(shipName: string): ShipLayout | null {
  return shipLayouts[shipName] || null;
}
