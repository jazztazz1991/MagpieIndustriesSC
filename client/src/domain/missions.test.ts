import { describe, it, expect } from "vitest";
import {
  crewToSeatAssignments,
  seatFillCount,
  missionStatusLabel,
  missionStatusColor,
  type MissionCrew,
} from "./missions";

describe("crewToSeatAssignments", () => {
  it("filters out crew without a seatId", () => {
    const crew: MissionCrew[] = [
      { id: "1", userId: "u1", username: "Percy", position: "Pilot", seatId: "seat_pilot" },
      { id: "2", userId: "u2", username: "Cody", position: "Gunner", seatId: null },
      { id: "3", userId: "u3", username: "Sam", position: "Cargo" }, // no seatId key
      { id: "4", userId: "u4", username: "Alex", position: "Copilot", seatId: "seat_copilot" },
    ];
    expect(crewToSeatAssignments(crew)).toEqual([
      { seatId: "seat_pilot", username: "Percy" },
      { seatId: "seat_copilot", username: "Alex" },
    ]);
  });

  it("returns empty when no crew has seatIds", () => {
    const crew: MissionCrew[] = [
      { id: "1", userId: "u1", username: "Percy", position: "Free" },
    ];
    expect(crewToSeatAssignments(crew)).toEqual([]);
  });
});

describe("seatFillCount", () => {
  it("calculates fill percentage", () => {
    expect(seatFillCount(5, 3)).toEqual({ filled: 3, total: 5, pct: 60 });
    expect(seatFillCount(8, 8)).toEqual({ filled: 8, total: 8, pct: 100 });
    expect(seatFillCount(4, 0)).toEqual({ filled: 0, total: 4, pct: 0 });
  });

  it("caps filled at total even when overassigned", () => {
    expect(seatFillCount(3, 5)).toEqual({ filled: 3, total: 3, pct: 100 });
  });

  it("handles zero-seat ships", () => {
    expect(seatFillCount(0, 0)).toEqual({ filled: 0, total: 0, pct: 0 });
  });
});

describe("missionStatusLabel", () => {
  it("returns readable labels", () => {
    expect(missionStatusLabel("PLANNING")).toBe("Planning");
    expect(missionStatusLabel("ACTIVE")).toBe("Active");
    expect(missionStatusLabel("COMPLETED")).toBe("Completed");
    expect(missionStatusLabel("CANCELLED")).toBe("Cancelled");
  });
});

describe("missionStatusColor", () => {
  it("returns distinct colors per status", () => {
    const colors = new Set([
      missionStatusColor("PLANNING"),
      missionStatusColor("ACTIVE"),
      missionStatusColor("COMPLETED"),
      missionStatusColor("CANCELLED"),
    ]);
    expect(colors.size).toBe(4);
  });
});
