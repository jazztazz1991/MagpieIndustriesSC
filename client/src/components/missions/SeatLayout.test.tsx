/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SeatLayout } from "./SeatLayout";
import type { ShipLayout } from "@/domain/shipSeats";

vi.mock("./SeatLayout.module.css", () => ({
  default: new Proxy({}, { get: (_target, prop) => String(prop) }),
}));

const moleLayout: ShipLayout = {
  shipName: "MOLE",
  seats: [
    { id: "seat_pilot", role: "pilot", label: "Pilot" },
    { id: "seat_copilot", role: "copilot", label: "Copilot" },
    { id: "mining_cab_front", role: "mining", label: "Front Mining Cab" },
    { id: "mining_cab_left", role: "mining", label: "Left Mining Cab" },
    { id: "mining_cab_right", role: "mining", label: "Right Mining Cab" },
  ],
};

describe("SeatLayout", () => {
  it("renders the ship name", () => {
    render(<SeatLayout shipName="MOLE" layout={moleLayout} assignments={[]} />);
    expect(screen.getByRole("heading", { name: "MOLE" })).toBeInTheDocument();
  });

  it("prefers nickname over shipName in the heading", () => {
    render(<SeatLayout shipName="MOLE" layout={moleLayout} assignments={[]} nickname="The Magpie" />);
    expect(screen.getByRole("heading", { name: "The Magpie" })).toBeInTheDocument();
    expect(screen.getByText("MOLE")).toBeInTheDocument();
  });

  it("renders one seat button per seat with correct labels", () => {
    render(<SeatLayout shipName="MOLE" layout={moleLayout} assignments={[]} />);
    expect(screen.getByRole("button", { name: /Pilot \(unassigned\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copilot \(unassigned\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Front Mining Cab \(unassigned\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Left Mining Cab \(unassigned\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Right Mining Cab \(unassigned\)/ })).toBeInTheDocument();
  });

  it("shows assigned username on matching seats", () => {
    render(
      <SeatLayout
        shipName="MOLE"
        layout={moleLayout}
        assignments={[{ seatId: "seat_pilot", username: "Percy" }, { seatId: "mining_cab_front", username: "Cody" }]}
      />
    );
    expect(screen.getByRole("button", { name: /Pilot \(assigned to Percy\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Front Mining Cab \(assigned to Cody\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copilot \(unassigned\)/ })).toBeInTheDocument();
  });

  it("groups seats under role labels", () => {
    const { container } = render(<SeatLayout shipName="MOLE" layout={moleLayout} assignments={[]} />);
    const groupHeaders = Array.from(container.querySelectorAll('[class*="roleLabel"]')).map((el) => el.textContent);
    expect(groupHeaders).toContain("Pilot");
    expect(groupHeaders).toContain("Copilot");
    expect(groupHeaders).toContain("Mining");
  });

  it("calls onSeatClick with the clicked seat", () => {
    const onClick = vi.fn();
    render(<SeatLayout shipName="MOLE" layout={moleLayout} assignments={[]} onSeatClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: /Pilot/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toMatchObject({ id: "seat_pilot", role: "pilot", label: "Pilot" });
  });

  it("disables seat buttons when no onSeatClick provided", () => {
    render(<SeatLayout shipName="MOLE" layout={moleLayout} assignments={[]} />);
    const pilotBtn = screen.getByRole("button", { name: /Pilot/ });
    expect(pilotBtn).toBeDisabled();
  });

  it("falls back gracefully when no layout is available", () => {
    render(<SeatLayout shipName="Unknown Ship" layout={null} assignments={[]} />);
    expect(screen.getByRole("heading", { name: "Unknown Ship" })).toBeInTheDocument();
    expect(screen.getByText(/No seat layout data/)).toBeInTheDocument();
  });
});
