/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FleetBuilder from "./FleetBuilder";
import type { MiningShip } from "@/data/mining-ships";
import type { MiningLaser } from "@/data/mining-lasers";
import type { MiningModule } from "@/data/mining-gadgets";

// Mock CSS modules
vi.mock("./FleetBuilder.module.css", () => ({
  default: new Proxy({}, { get: (_target, prop) => String(prop) }),
}));
vi.mock("./LoadoutBuilder.module.css", () => ({
  default: new Proxy({}, { get: (_target, prop) => String(prop) }),
}));

// Mock localStorage
const mockStorage: Record<string, string> = {};
beforeEach(() => {
  Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => mockStorage[key] ?? null);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation((key, val) => {
    mockStorage[key] = val;
  });
});

// --- Fixtures ---

const ships: MiningShip[] = [
  {
    name: "Prospector",
    manufacturer: "MISC",
    size: "small",
    cargoSCU: 32,
    miningTurrets: 1,
    crewMin: 1,
    crewMax: 1,
    description: "",
  },
  {
    name: "MOLE",
    manufacturer: "ARGO",
    size: "medium",
    cargoSCU: 96,
    miningTurrets: 3,
    crewMin: 1,
    crewMax: 4,
    description: "",
  },
];

const lasers: MiningLaser[] = [
  {
    name: "Arbor S1",
    size: 1,
    price: 5000,
    optimumRange: 30,
    maxRange: 120,
    minPower: 120,
    minPowerPct: 10,
    maxPower: 1200,
    extractPower: 600,
    moduleSlots: 2,
    resistance: -20,
    instability: 15,
    optimalChargeRate: 10,
    optimalChargeWindow: 30,
    inertMaterials: -20,
    description: "",
  },
];

const activeModules: MiningModule[] = [];
const passiveModules: MiningModule[] = [];

describe("FleetBuilder", () => {
  it("renders with one ship by default", () => {
    const onChange = vi.fn();
    render(
      <FleetBuilder
        ships={ships}
        lasers={lasers}
        activeModules={activeModules}
        passiveModules={passiveModules}
        onFleetChange={onChange}
      />
    );

    expect(screen.getByText("Fleet Loadout")).toBeInTheDocument();
    expect(screen.getByText("Ship 1")).toBeInTheDocument();
    expect(screen.getByText("+ Add Ship")).toBeInTheDocument();
  });

  it("shows fleet summary with ship count, heads, and cargo", () => {
    render(
      <FleetBuilder
        ships={ships}
        lasers={lasers}
        activeModules={activeModules}
        passiveModules={passiveModules}
        onFleetChange={vi.fn()}
      />
    );

    // Default ship is Prospector (1 head, 32 SCU)
    // Summary line contains all three stats
    expect(screen.getByText(/1 ship · 1 head · 32 SCU/)).toBeInTheDocument();
  });

  it("adds a second ship when Add Ship is clicked", () => {
    render(
      <FleetBuilder
        ships={ships}
        lasers={lasers}
        activeModules={activeModules}
        passiveModules={passiveModules}
        onFleetChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("+ Add Ship"));

    expect(screen.getByText("Ship 1")).toBeInTheDocument();
    expect(screen.getByText("Ship 2")).toBeInTheDocument();
    expect(screen.getByText(/2 ships/)).toBeInTheDocument();
  });

  it("removes a ship when remove button is clicked", () => {
    render(
      <FleetBuilder
        ships={ships}
        lasers={lasers}
        activeModules={activeModules}
        passiveModules={passiveModules}
        onFleetChange={vi.fn()}
      />
    );

    // Add a second ship
    fireEvent.click(screen.getByText("+ Add Ship"));
    expect(screen.getByText("Ship 2")).toBeInTheDocument();

    // Remove ship 2
    const removeButtons = screen.getAllByLabelText(/Remove ship/);
    fireEvent.click(removeButtons[removeButtons.length - 1]);

    expect(screen.queryByText("Ship 2")).not.toBeInTheDocument();
    expect(screen.getByText(/1 ship/)).toBeInTheDocument();
  });

  it("does not show remove button when only one ship exists", () => {
    render(
      <FleetBuilder
        ships={ships}
        lasers={lasers}
        activeModules={activeModules}
        passiveModules={passiveModules}
        onFleetChange={vi.fn()}
      />
    );

    expect(screen.queryByLabelText(/Remove ship/)).not.toBeInTheDocument();
  });

  it("calls onFleetChange with resolved heads from all ships", () => {
    const onChange = vi.fn();
    render(
      <FleetBuilder
        ships={ships}
        lasers={lasers}
        activeModules={activeModules}
        passiveModules={passiveModules}
        onFleetChange={onChange}
      />
    );

    // Should have been called with initial fleet (1 ship, 1 head)
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    const [loadouts, resolved] = lastCall;
    expect(loadouts).toHaveLength(1);
    expect(resolved).toHaveLength(1); // Prospector has 1 head
    expect(resolved[0].laser.name).toBe("Arbor S1");
  });

  it("collapses and expands ship details", () => {
    render(
      <FleetBuilder
        ships={ships}
        lasers={lasers}
        activeModules={activeModules}
        passiveModules={passiveModules}
        onFleetChange={vi.fn()}
      />
    );

    // Head cards should be visible (expanded by default)
    expect(screen.getByText("Head 1")).toBeInTheDocument();

    // Click the header to collapse
    fireEvent.click(screen.getByText("Ship 1"));

    // Head cards should no longer be visible
    expect(screen.queryByText("Head 1")).not.toBeInTheDocument();
    // Collapsed summary shows ship name
    expect(screen.getByText(/Prospector/)).toBeInTheDocument();
  });
});
