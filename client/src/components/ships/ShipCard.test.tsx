/** @vitest-environment jsdom */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ShipCard from "./ShipCard";
import { Ship } from "@/data/ships";

vi.mock("@/app/ships/ships.module.css", () => ({
  default: new Proxy({}, { get: (_target, prop) => String(prop) }),
}));

const mockShip: Ship = {
  name: "Aurora MR",
  manufacturer: "RSI",
  role: "Starter / Light Freight",
  size: "small",
  crew: { min: 1, max: 1 },
  cargoSCU: 6,
  buyPriceAUEC: 186000,
  pledgeUSD: 30,
  speed: { scm: 195, max: 1236 },
  description:
    "RSI's entry-level ship. Versatile starter with basic cargo and combat capability.",
};

const mockShipNoPrices: Ship = {
  name: "Test Ship",
  manufacturer: "Test Mfg",
  role: "Test Role",
  size: "medium",
  crew: { min: 1, max: 4 },
  cargoSCU: 0,
  buyPriceAUEC: null,
  pledgeUSD: null,
  speed: { scm: 200, max: 1000 },
  description: "A test ship with no prices.",
};

describe("ShipCard", () => {
  it("renders ship name and manufacturer", () => {
    render(<ShipCard ship={mockShip} expanded={false} onToggle={vi.fn()} />);

    expect(screen.getByText("Aurora MR")).toBeInTheDocument();
    expect(screen.getByText(/RSI/)).toBeInTheDocument();
    expect(screen.getByText(/Starter \/ Light Freight/)).toBeInTheDocument();
  });

  it("shows quick stats (crew, cargo, SCM, price)", () => {
    render(<ShipCard ship={mockShip} expanded={false} onToggle={vi.fn()} />);

    expect(screen.getByText("Crew")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Cargo")).toBeInTheDocument();
    expect(screen.getByText("6 SCU")).toBeInTheDocument();
    expect(screen.getByText("SCM")).toBeInTheDocument();
    expect(screen.getByText("195 m/s")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("186k")).toBeInTheDocument();
  });

  it("shows crew range when min and max differ", () => {
    const multiCrewShip: Ship = {
      ...mockShip,
      crew: { min: 1, max: 3 },
    };
    render(
      <ShipCard ship={multiCrewShip} expanded={false} onToggle={vi.fn()} />,
    );

    expect(screen.getByText(/1–3/)).toBeInTheDocument();
  });

  it("shows N/A for price when buyPriceAUEC is null", () => {
    render(
      <ShipCard ship={mockShipNoPrices} expanded={false} onToggle={vi.fn()} />,
    );

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("shows expanded details when expanded=true", () => {
    render(<ShipCard ship={mockShip} expanded={true} onToggle={vi.fn()} />);

    expect(screen.getByText(mockShip.description)).toBeInTheDocument();
    expect(screen.getByText(/1236 m\/s/)).toBeInTheDocument();
    expect(screen.getByText(/186,000 aUEC/)).toBeInTheDocument();
    expect(screen.getByText(/\$30/)).toBeInTheDocument();
  });

  it("hides details when expanded=false", () => {
    render(<ShipCard ship={mockShip} expanded={false} onToggle={vi.fn()} />);

    expect(screen.queryByText(mockShip.description)).not.toBeInTheDocument();
    expect(screen.queryByText(/Max Speed/)).not.toBeInTheDocument();
  });

  it("does not show in-game price or pledge in details when null", () => {
    render(
      <ShipCard ship={mockShipNoPrices} expanded={true} onToggle={vi.fn()} />,
    );

    expect(screen.getByText(mockShipNoPrices.description)).toBeInTheDocument();
    expect(screen.queryByText(/aUEC/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pledge/)).not.toBeInTheDocument();
  });

  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<ShipCard ship={mockShip} expanded={false} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("has correct aria-expanded attribute", () => {
    const { rerender } = render(
      <ShipCard ship={mockShip} expanded={false} onToggle={vi.fn()} />,
    );

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    rerender(<ShipCard ship={mockShip} expanded={true} onToggle={vi.fn()} />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("displays the size tag", () => {
    render(<ShipCard ship={mockShip} expanded={false} onToggle={vi.fn()} />);

    expect(screen.getByText("small")).toBeInTheDocument();
  });
});
