export type MissionStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface MissionCrew {
  id: string;
  userId: string;
  username: string;
  position: string;
  seatId?: string | null;
  notes?: string | null;
}

export interface MissionShip {
  id: string;
  shipId: string;
  shipName: string;
  nickname: string | null;
  crew: MissionCrew[];
}

export interface MissionDetail {
  id: string;
  title: string;
  description: string | null;
  operationType: string;
  status: MissionStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creatorUsername: string;
  ships: MissionShip[];
}

/**
 * Convert a MissionShip.crew array into SeatAssignment pairs for the
 * SeatLayout component, filtering out crew without a seatId.
 */
export function crewToSeatAssignments(crew: MissionCrew[]): Array<{ seatId: string; username: string }> {
  return crew
    .filter((c): c is MissionCrew & { seatId: string } => !!c.seatId)
    .map((c) => ({ seatId: c.seatId, username: c.username }));
}

/**
 * Count how many seats are filled out of available.
 */
export function seatFillCount(totalSeats: number, assignedCount: number): { filled: number; total: number; pct: number } {
  const filled = Math.min(assignedCount, totalSeats);
  const pct = totalSeats > 0 ? Math.round((filled / totalSeats) * 100) : 0;
  return { filled, total: totalSeats, pct };
}

/**
 * Status → human-friendly label.
 */
export function missionStatusLabel(status: MissionStatus): string {
  switch (status) {
    case "PLANNING": return "Planning";
    case "ACTIVE": return "Active";
    case "COMPLETED": return "Completed";
    case "CANCELLED": return "Cancelled";
  }
}

/**
 * Status → color hex for badges.
 */
export function missionStatusColor(status: MissionStatus): string {
  switch (status) {
    case "PLANNING": return "#60a5fa";   // blue
    case "ACTIVE": return "#4ade80";     // green
    case "COMPLETED": return "#9ca3af";  // gray
    case "CANCELLED": return "#f87171";  // red
  }
}
