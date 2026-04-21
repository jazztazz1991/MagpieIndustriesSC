import { describe, it, expect } from "vitest";
import {
  classifyHardpoint,
  extractSeats,
  prettifyFragment,
  groupSeatsByRole,
  roleLabel,
} from "./shipSeats";

describe("prettifyFragment", () => {
  it("splits on underscores and title-cases", () => {
    expect(prettifyFragment("front_left")).toBe("Front Left");
    expect(prettifyFragment("TURRET_REAR")).toBe("Turret Rear");
    expect(prettifyFragment("top")).toBe("Top");
  });

  it("handles empty and single words", () => {
    expect(prettifyFragment("")).toBe("");
    expect(prettifyFragment("pilot")).toBe("Pilot");
  });
});

describe("classifyHardpoint", () => {
  it("identifies pilot and copilot", () => {
    expect(classifyHardpoint("hardpoint_seat_pilot")).toMatchObject({ role: "pilot", label: "Pilot" });
    expect(classifyHardpoint("hardpoint_seat_copilot")).toMatchObject({ role: "copilot", label: "Copilot" });
  });

  it("identifies turret seats with positional label", () => {
    expect(classifyHardpoint("hardpoint_seat_turret_front_left")).toMatchObject({
      role: "turret",
      label: "Front Left Turret",
    });
    expect(classifyHardpoint("hardpoint_seat_turret_rear")).toMatchObject({
      role: "turret",
      label: "Rear Turret",
    });
    expect(classifyHardpoint("hardpoint_seat_turret_top")).toMatchObject({
      role: "turret",
      label: "Top Turret",
    });
  });

  it("identifies mining cabs", () => {
    expect(classifyHardpoint("hardpoint_mining_cab_front")).toMatchObject({
      role: "mining",
      label: "Front Mining Cab",
    });
    expect(classifyHardpoint("hardpoint_mining_cab_left")).toMatchObject({
      role: "mining",
      label: "Left Mining Cab",
    });
  });

  it("identifies engineer consoles with location", () => {
    expect(classifyHardpoint("hardpoint_cargo_bay_engineer_console")).toMatchObject({
      role: "engineer",
      label: "Cargo Bay Engineer",
    });
    expect(classifyHardpoint("hardpoint_component_room_left_engineer_console")).toMatchObject({
      role: "engineer",
      label: "Component Room Left Engineer",
    });
  });

  it("skips access-only hardpoints", () => {
    expect(classifyHardpoint("hardpoint_seat_access_pilot")).toBeNull();
    expect(classifyHardpoint("hardpoint_seat_access_turret_front_left")).toBeNull();
    expect(classifyHardpoint("hardpoint_mining_cab_front_access")).toBeNull();
    expect(classifyHardpoint("hardpoint_seataccess_pilot")).toBeNull();
    expect(classifyHardpoint("hardpoint_turret_seataccess")).toBeNull();
    expect(classifyHardpoint("hardpoint_seat_drone_left_dashboard")).toBeNull();
    expect(classifyHardpoint("hardpoint_turret_console_01")).toBeNull();
  });

  it("classifies Polaris-specific seats", () => {
    expect(classifyHardpoint("hardpoint_seat_captain")).toMatchObject({ role: "crew", label: "Captain" });
    expect(classifyHardpoint("hardpoint_seat_atc")).toMatchObject({ role: "crew", label: "ATC" });
    expect(classifyHardpoint("hardpoint_seat_torpedo_console")).toMatchObject({ role: "missile", label: "Torpedo Console" });
    expect(classifyHardpoint("hardpoint_seat_turretseatleft")).toMatchObject({ role: "turret" });
  });

  it("classifies Caterpillar-specific seats", () => {
    expect(classifyHardpoint("hardpoint_seat_engineering")).toMatchObject({ role: "engineer", label: "Engineer" });
    expect(classifyHardpoint("hardpoint_seat_support_left")).toMatchObject({ role: "crew", label: "Support Left" });
    expect(classifyHardpoint("hardpoint_seat_tractorbeam_left")).toMatchObject({ role: "crew" });
    expect(classifyHardpoint("hardpoint_turret_top")).toMatchObject({ role: "turret", label: "Top Turret" });
    expect(classifyHardpoint("hardpoint_turret_bottom")).toMatchObject({ role: "turret", label: "Bottom Turret" });
  });

  it("classifies a nameless hardpoint_turret as generic Turret", () => {
    expect(classifyHardpoint("hardpoint_turret")).toMatchObject({ role: "turret", label: "Turret" });
  });

  it("classifies Constellation-style copilot_left/right", () => {
    expect(classifyHardpoint("hardpoint_seat_copilot_left")).toMatchObject({ role: "copilot", label: "Left Copilot" });
    expect(classifyHardpoint("hardpoint_seat_copilot_right")).toMatchObject({ role: "copilot", label: "Right Copilot" });
  });

  it("returns null for non-seat hardpoints", () => {
    expect(classifyHardpoint("hardpoint_weapon_mining")).toBeNull();
    expect(classifyHardpoint("hardpoint_controller_flight")).toBeNull();
    expect(classifyHardpoint("hardpoint_cargo_grid")).toBeNull();
    expect(classifyHardpoint("hardpoint_shield")).toBeNull();
  });

  it("uses hardpoint name (without prefix) as stable ID", () => {
    expect(classifyHardpoint("hardpoint_seat_pilot")?.id).toBe("seat_pilot");
    expect(classifyHardpoint("hardpoint_seat_turret_rear")?.id).toBe("seat_turret_rear");
  });
});

describe("extractSeats", () => {
  it("builds a seat layout from a Hammerhead-like ship", () => {
    const hardpoints = [
      "hardpoint_seat_pilot",
      "hardpoint_seat_copilot",
      "hardpoint_seat_turret_front_left",
      "hardpoint_seat_turret_front_right",
      "hardpoint_seat_turret_back_left",
      "hardpoint_seat_turret_back_right",
      "hardpoint_seat_turret_rear",
      "hardpoint_seat_turret_top",
      "hardpoint_seat_access_pilot",  // skipped
      "hardpoint_weapon_mining",       // skipped
      "hardpoint_cargo_bay_engineer_console",
    ];
    const seats = extractSeats(hardpoints);

    expect(seats.map((s) => s.label)).toEqual([
      "Pilot",
      "Copilot",
      "Cargo Bay Engineer",
      "Back Left Turret",
      "Back Right Turret",
      "Front Left Turret",
      "Front Right Turret",
      "Rear Turret",
      "Top Turret",
    ]);
  });

  it("builds a MOLE-like layout (pilot, copilot, 3 mining cabs)", () => {
    const hardpoints = [
      "hardpoint_seat_pilot",
      "hardpoint_seat_copilot",
      "hardpoint_mining_cab_front",
      "hardpoint_mining_cab_left",
      "hardpoint_mining_cab_right",
      "hardpoint_mining_cab_front_access",  // skipped
      "hardpoint_weapon_mining",             // skipped
    ];
    const seats = extractSeats(hardpoints);

    expect(seats.map((s) => ({ role: s.role, label: s.label }))).toEqual([
      { role: "pilot", label: "Pilot" },
      { role: "copilot", label: "Copilot" },
      { role: "mining", label: "Front Mining Cab" },
      { role: "mining", label: "Left Mining Cab" },
      { role: "mining", label: "Right Mining Cab" },
    ]);
  });

  it("deduplicates repeated hardpoints", () => {
    const seats = extractSeats(["hardpoint_seat_pilot", "hardpoint_seat_pilot"]);
    expect(seats).toHaveLength(1);
  });

  it("returns empty for ships with no recognizable seats", () => {
    expect(extractSeats(["hardpoint_weapon_1", "hardpoint_shield"])).toEqual([]);
  });
});

describe("groupSeatsByRole", () => {
  it("groups seats by role in priority order", () => {
    const seats = extractSeats([
      "hardpoint_seat_pilot",
      "hardpoint_seat_turret_rear",
      "hardpoint_mining_cab_front",
      "hardpoint_seat_copilot",
    ]);
    const groups = groupSeatsByRole(seats);
    expect(groups.map((g) => g.role)).toEqual(["pilot", "copilot", "mining", "turret"]);
    expect(groups[0].seats).toHaveLength(1);
    expect(groups[2].seats[0].label).toBe("Front Mining Cab");
  });
});

describe("roleLabel", () => {
  it("returns plural-friendly group labels", () => {
    expect(roleLabel("turret")).toBe("Turrets");
    expect(roleLabel("mining")).toBe("Mining");
    expect(roleLabel("pilot")).toBe("Pilot");
  });
});
