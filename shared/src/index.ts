// Shared types for Magpie Industries SC
// These are the canonical API response shapes.
// Both client and server MUST import from here — never define inline duplicates.

// ─── Base Types ──────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  rsiHandle?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: string;
  username: string;
  rsiHandle?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  role: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type UserRole =
  | "visitor"
  | "registered"
  | "group_member"
  | "org_member"
  | "org_leader"
  | "admin";

// ─── Friend Types ────────────────────────────────────────────────────

export type FriendStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendStatus;
  createdAt: string;
  requester: PublicUser;
  addressee: PublicUser;
}

// ─── Group Types ─────────────────────────────────────────────────────

export type GroupRole = "MEMBER" | "OFFICER" | "LEADER";

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  owner: PublicUser;
  memberCount: number;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  userId: string;
  role: GroupRole;
  joinedAt: string;
  user: PublicUser;
}

export interface GroupDetail extends Group {
  members: GroupMember[];
  events: EventSummary[];
}

// ─── Event Types ─────────────────────────────────────────────────────

export type RSVPStatus = "GOING" | "MAYBE" | "NOT_GOING";

export interface EventSummary {
  id: string;
  title: string;
  eventType: string;
  startsAt: string;
  endsAt?: string | null;
  creatorId: string;
  creator: PublicUser;
  attendeeCount: number;
}

export interface EventDetail extends EventSummary {
  description?: string | null;
  groupId: string;
  group: { id: string; name: string };
  attendees: { userId: string; status: RSVPStatus; user: PublicUser }[];
  createdAt: string;
}

// ─── Activity Types ──────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  userId: string;
  type: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  user: PublicUser;
}

// ─── Comment Types ───────────────────────────────────────────────────

export interface Comment {
  id: string;
  userId: string;
  guidePath: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: PublicUser;
}

// ─── Org Types ───────────────────────────────────────────────────────

export type ShipStatus = "ACTIVE" | "DESTROYED" | "LOANED" | "IN_REPAIR";
export type OperationStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type OperationType = "mining" | "salvage" | "cargo" | "combat" | "security" | "mixed";
export type TransactionType = "DEPOSIT" | "WITHDRAWAL";

export interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  spectrumId?: string | null;
  logoUrl?: string | null;
  isPublic: boolean;
  owner: PublicUser;
  memberCount: number;
  createdAt: string;
}

export interface OrgRole {
  id: string;
  name: string;
  rank: number;
  permissions: string[];
}

export interface OrgMemberInfo {
  id: string;
  userId: string;
  user: PublicUser;
  role?: OrgRole | null;
  joinedAt: string;
}

export interface OrgDetail extends OrgSummary {
  bannerUrl?: string | null;
  ownerId: string;
  members: OrgMemberInfo[];
  roles: OrgRole[];
  updatedAt: string;
  myRole?: OrgRole | null;
  isMember: boolean;
}

// ─── Org Member List DTO (GET /api/orgs/:id/members) ─────────────────

export interface OrgMemberDTO {
  id: string;       // user id
  username: string;
  avatarUrl: string | null;
  role: { id: string; name: string; rank: number } | null;
  joinedAt: string;
}

// ─── Fleet Types (DTOs matching server responses) ────────────────────

export interface FleetShipDTO {
  id: string;
  shipId: string;
  shipName: string;
  nickname?: string | null;
  status: ShipStatus;
  createdAt: string;
  owner: PublicUser;
}

// ─── Operation Types (DTOs matching server responses) ────────────────

/** GET /api/orgs/:orgId/operations — list item */
export interface OperationSummaryDTO {
  id: string;
  title: string;
  operationType: string;
  status: OperationStatus;
  startsAt: string | null;
  endsAt: string | null;
  creator: PublicUser;
  shipCount: number;
  crewCount: number;
  createdAt: string;
}

/** Crew member within an operation ship */
export interface OperationCrewDTO {
  id: string;
  userId: string;
  username: string;
  position: string;
  seatId?: string | null;
  notes?: string | null;
}

/** Ship within an operation detail */
export interface OperationShipDTO {
  id: string;
  shipId: string;
  shipName: string;
  nickname: string | null;
  crew: OperationCrewDTO[];
}

/** GET /api/orgs/:orgId/operations/:id — full detail */
export interface OperationDetailDTO {
  id: string;
  title: string;
  description: string | null;
  operationType: string;
  status: OperationStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creatorUsername: string;
  ships: OperationShipDTO[];
}

// ─── Treasury Types ──────────────────────────────────────────────────

export interface TreasuryTransactionInfo {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string | null;
  user: PublicUser;
  createdAt: string;
}

export interface TreasurySummary {
  balance: number;
  transactions: TreasuryTransactionInfo[];
}

// ─── Recruitment Types ───────────────────────────────────────────────

export interface RecruitmentPostInfo {
  id: string;
  orgId: string;
  org: OrgSummary;
  title: string;
  description: string;
  requirements?: string | null;
  isOpen: boolean;
  createdAt: string;
}

// ─── Org Guide Types ────────────────────────────────────────────────

export type GuideCategory = "RANKS" | "OPERATIONS" | "TREASURY" | "RULES" | "GENERAL";

export interface OrgGuideDTO {
  id: string;
  title: string;
  content: string;
  category: GuideCategory;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string };
}

export type OrgGuidesByCategory = Partial<Record<GuideCategory, OrgGuideDTO[]>>;

// ─── Org Announcement Types ─────────────────────────────────────────

export interface OrgAnnouncementDTO {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string };
}

// ─── Org Activity Types ─────────────────────────────────────────────

export interface OrgActivityDTO {
  id: string;
  userId: string;
  type: string;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; username: string };
}

// ─── Report Types ───────────────────────────────────────────────────

export type ReportType = "BUG" | "DATA_ISSUE";
export type ReportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface ReportDTO {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  status: ReportStatus;
  pageUrl: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string };
}

// ─── Suggestion Types ───────────────────────────────────────────────

export type SuggestionStatus = "PENDING" | "UNDER_REVIEW" | "PLANNED" | "DECLINED";

export interface SuggestionDTO {
  id: string;
  title: string;
  description: string;
  status: SuggestionStatus;
  adminNotes: string | null;
  voteCount: number;
  hasVoted: boolean;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string };
}

// ─── Craft Recipe Types ─────────────────────────────────────────────

export interface CraftIngredientDTO {
  id: string;
  item: string;
  quantity: number;
}

export interface CraftRecipeDTO {
  id: string;
  name: string;
  description: string | null;
  category: string;
  outputItem: string;
  outputQty: number;
  difficulty: string | null;
  notes: string | null;
  ingredients: CraftIngredientDTO[];
  createdAt: string;
  updatedAt: string;
}

// ─── Mission Recipe Types ───────────────────────────────────────────

export interface MissionObjectiveDTO {
  id: string;
  description: string;
  sortOrder: number;
  isOptional: boolean;
}

export interface MissionRewardDTO {
  id: string;
  rewardType: string;
  description: string;
  quantity: string | null;
}

export interface MissionRecipeDTO {
  id: string;
  name: string;
  description: string | null;
  missionType: string;
  difficulty: string | null;
  minPlayers: number;
  maxPlayers: number | null;
  estimatedPay: string | null;
  location: string | null;
  notes: string | null;
  objectives: MissionObjectiveDTO[];
  rewards: MissionRewardDTO[];
  createdAt: string;
  updatedAt: string;
}

// ─── Admin Types ────────────────────────────────────────────────────

export interface AdminUserDTO {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  role: string;
  createdAt: string;
}

export interface AdminStatsDTO {
  userCount: number;
  orgCount: number;
  openReports: number;
  pendingSuggestions: number;
  craftRecipeCount: number;
  missionRecipeCount: number;
}

// ─── Deprecated aliases (keep temporarily for backward compat) ───────
// TODO: Remove these once all consumers use the DTO types above
/** @deprecated Use FleetShipDTO */
export type FleetShipInfo = FleetShipDTO;
/** @deprecated Use OperationSummaryDTO */
export type OperationSummary = OperationSummaryDTO;
/** @deprecated Use OperationShipDTO */
export type OperationShipInfo = OperationShipDTO;
/** @deprecated Use OperationCrewDTO */
export type CrewAssignmentInfo = OperationCrewDTO;
/** @deprecated Use OperationDetailDTO */
export type OperationDetail = OperationDetailDTO;
