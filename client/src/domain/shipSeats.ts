export type SeatRole =
  | "pilot"
  | "copilot"
  | "turret"
  | "mining"
  | "engineer"
  | "missile"
  | "crew";

export interface ShipSeat {
  id: string;          // stable hardpoint-derived ID, e.g. "seat_pilot"
  role: SeatRole;
  label: string;       // human-friendly label, e.g. "Pilot", "Front Mining Cab"
}

export interface ShipLayout {
  shipName: string;
  seats: ShipSeat[];
}

const ROLE_PRIORITY: Record<SeatRole, number> = {
  pilot: 0,
  copilot: 1,
  engineer: 2,
  mining: 3,
  turret: 4,
  missile: 5,
  crew: 6,
};

/**
 * Convert a hardpoint fragment like "front_left" into "Front Left".
 */
export function prettifyFragment(s: string): string {
  return s
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
}

interface SeatPattern {
  regex: RegExp;
  role: SeatRole;
  labelFrom: (match: RegExpMatchArray) => string;
}

const PATTERNS: SeatPattern[] = [
  { regex: /^hardpoint_seat_pilot$/, role: "pilot", labelFrom: () => "Pilot" },
  { regex: /^hardpoint_seat_copilot$/, role: "copilot", labelFrom: () => "Copilot" },
  {
    regex: /^hardpoint_seat_copilot_(.+)$/,
    role: "copilot",
    labelFrom: (m) => `${prettifyFragment(m[1])} Copilot`,
  },
  {
    regex: /^hardpoint_seat_turret_?(.*)$/,
    role: "turret",
    labelFrom: (m) => (m[1] ? `${prettifyFragment(m[1])} Turret` : "Turret"),
  },
  {
    regex: /^hardpoint_seat_torpedo_console$/,
    role: "missile",
    labelFrom: () => "Torpedo Console",
  },
  {
    regex: /^hardpoint_seat_engineering$/,
    role: "engineer",
    labelFrom: () => "Engineer",
  },
  {
    regex: /^hardpoint_seat_captain$/,
    role: "crew",
    labelFrom: () => "Captain",
  },
  {
    regex: /^hardpoint_seat_atc$/,
    role: "crew",
    labelFrom: () => "ATC",
  },
  {
    regex: /^hardpoint_mining_cab_(.+)$/,
    role: "mining",
    labelFrom: (m) => `${prettifyFragment(m[1])} Mining Cab`,
  },
  {
    regex: /^hardpoint_(?:.+_)?engineer_console$/,
    role: "engineer",
    labelFrom: (m) => {
      const inner = m[0].replace(/^hardpoint_/, "").replace(/_engineer_console$/, "");
      if (!inner) return "Engineer Console";
      return `${prettifyFragment(inner)} Engineer`;
    },
  },
  {
    regex: /^hardpoint_(?:.+_)?missile_(?:operator|console)$/,
    role: "missile",
    labelFrom: (m) => {
      const inner = m[0].replace(/^hardpoint_/, "").replace(/_missile_(operator|console)$/, "");
      if (!inner) return "Missile Operator";
      return `${prettifyFragment(inner)} Missile`;
    },
  },
  // Generic turret: hardpoint_turret or hardpoint_turret_<name>
  {
    regex: /^hardpoint_turret(?:_(.+))?$/,
    role: "turret",
    labelFrom: (m) => (m[1] ? `${prettifyFragment(m[1])} Turret` : "Turret"),
  },
  // Generic named seat: hardpoint_seat_<name> — fallback to "crew"
  {
    regex: /^hardpoint_seat_(.+)$/,
    role: "crew",
    labelFrom: (m) => prettifyFragment(m[1]),
  },
];

/**
 * Determine whether a hardpoint name should be skipped entirely.
 * Access hardpoints are ladders/doors to seats; dashboards/consoles are passive props.
 */
function isAccessOnly(hardpointName: string): boolean {
  return (
    hardpointName.includes("_access") ||
    hardpointName.includes("seataccess") ||
    hardpointName.endsWith("_dashboard") ||
    hardpointName.includes("_console_") // e.g. hardpoint_turret_console_01 on Reclaimer (cosmetic)
  );
}

/**
 * Try to classify a hardpoint name as a seat.
 * Returns null if the hardpoint is not a seat (or is an access-only entry).
 */
export function classifyHardpoint(hardpointName: string): ShipSeat | null {
  if (isAccessOnly(hardpointName)) return null;
  for (const pattern of PATTERNS) {
    const match = hardpointName.match(pattern.regex);
    if (match) {
      return {
        id: hardpointName.replace(/^hardpoint_/, ""),
        role: pattern.role,
        label: pattern.labelFrom(match),
      };
    }
  }
  return null;
}

/**
 * Given a list of hardpoint names for a ship, derive the seat layout.
 * Deduplicates by seat id and sorts by role priority + label.
 */
export function extractSeats(hardpointNames: string[]): ShipSeat[] {
  const seen = new Set<string>();
  const seats: ShipSeat[] = [];
  for (const name of hardpointNames) {
    const seat = classifyHardpoint(name);
    if (!seat || seen.has(seat.id)) continue;
    seen.add(seat.id);
    seats.push(seat);
  }
  seats.sort((a, b) => {
    const rp = ROLE_PRIORITY[a.role] - ROLE_PRIORITY[b.role];
    if (rp !== 0) return rp;
    return a.label.localeCompare(b.label);
  });
  return seats;
}

/**
 * Group seats by role, preserving internal order.
 */
export function groupSeatsByRole(seats: ShipSeat[]): Array<{ role: SeatRole; seats: ShipSeat[] }> {
  const groups = new Map<SeatRole, ShipSeat[]>();
  for (const seat of seats) {
    (groups.get(seat.role) || groups.set(seat.role, []).get(seat.role)!).push(seat);
  }
  return Array.from(groups.entries())
    .map(([role, s]) => ({ role, seats: s }))
    .sort((a, b) => ROLE_PRIORITY[a.role] - ROLE_PRIORITY[b.role]);
}

/**
 * Human-readable label for a role.
 */
export function roleLabel(role: SeatRole): string {
  switch (role) {
    case "pilot": return "Pilot";
    case "copilot": return "Copilot";
    case "turret": return "Turrets";
    case "mining": return "Mining";
    case "engineer": return "Engineering";
    case "missile": return "Missiles";
    case "crew": return "Crew";
  }
}
