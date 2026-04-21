/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AssignMemberModal } from "./AssignMemberModal";
import type { ShipSeat } from "@/domain/shipSeats";

vi.mock("./AssignMemberModal.module.css", () => ({
  default: new Proxy({}, { get: (_target, prop) => String(prop) }),
}));

const seat: ShipSeat = { id: "seat_pilot", role: "pilot", label: "Pilot" };
const members = [
  { userId: "u1", username: "Percy", alreadyAssigned: false },
  { userId: "u2", username: "Cody", alreadyAssigned: true },
  { userId: "u3", username: "Alex", alreadyAssigned: false },
];

describe("AssignMemberModal", () => {
  it("renders the seat label in the header", () => {
    render(<AssignMemberModal seat={seat} members={members} onAssign={vi.fn()} onUnassign={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole("heading", { name: /Assign to Pilot/ })).toBeInTheDocument();
  });

  it("lists all members", () => {
    render(<AssignMemberModal seat={seat} members={members} onAssign={vi.fn()} onUnassign={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Percy/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cody/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Alex/ })).toBeInTheDocument();
  });

  it("filters members by the search input", () => {
    render(<AssignMemberModal seat={seat} members={members} onAssign={vi.fn()} onUnassign={vi.fn()} onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("Filter members..."), { target: { value: "per" } });
    expect(screen.getByRole("button", { name: /Percy/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cody/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Alex/ })).toBeNull();
  });

  it("calls onAssign when a member is clicked", async () => {
    const onAssign = vi.fn().mockResolvedValue(undefined);
    render(<AssignMemberModal seat={seat} members={members} onAssign={onAssign} onUnassign={vi.fn()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Percy/ }));
    expect(onAssign).toHaveBeenCalledWith("u1");
  });

  it("shows an Unassign button only when a member is currently assigned", () => {
    const { rerender } = render(<AssignMemberModal seat={seat} members={members} onAssign={vi.fn()} onUnassign={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByText(/Unassign/)).toBeNull();

    rerender(<AssignMemberModal seat={seat} members={members} currentAssigneeUserId="u1" onAssign={vi.fn()} onUnassign={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText(/Unassign/)).toBeInTheDocument();
  });

  it("shows 'Current' tag next to the currently assigned member and disables that row", () => {
    render(<AssignMemberModal seat={seat} members={members} currentAssigneeUserId="u1" onAssign={vi.fn()} onUnassign={vi.fn()} onClose={vi.fn()} />);
    const percyRow = screen.getByRole("button", { name: /Percy.*Current/i });
    expect(percyRow).toBeDisabled();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<AssignMemberModal seat={seat} members={members} onAssign={vi.fn()} onUnassign={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<AssignMemberModal seat={seat} members={members} onAssign={vi.fn()} onUnassign={vi.fn()} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
