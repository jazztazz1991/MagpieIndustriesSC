import { describe, it, expect } from "vitest";
import { can, permissionLabel, type OrgMembershipContext } from "./orgPermissions";

const nonMember: OrgMembershipContext = { isMember: false, isOwner: false, role: null };
const memberNoRole: OrgMembershipContext = { isMember: true, isOwner: false, role: null };
const memberRoled: OrgMembershipContext = {
  isMember: true,
  isOwner: false,
  role: { id: "r1", name: "Officer", rank: 2, permissions: ["manage_fleet", "manage_operations"] },
};
const owner: OrgMembershipContext = {
  isMember: true,
  isOwner: true,
  role: { id: "r0", name: "Owner", rank: 0, permissions: [] },
};

describe("can()", () => {
  it("rejects non-members for any permission", () => {
    expect(can(nonMember, "manage_fleet")).toBe(false);
    expect(can(nonMember, "manage_members")).toBe(false);
  });

  it("rejects members with no role", () => {
    expect(can(memberNoRole, "manage_fleet")).toBe(false);
  });

  it("accepts members whose role has the permission", () => {
    expect(can(memberRoled, "manage_fleet")).toBe(true);
    expect(can(memberRoled, "manage_operations")).toBe(true);
  });

  it("rejects members whose role lacks the permission", () => {
    expect(can(memberRoled, "manage_treasury")).toBe(false);
    expect(can(memberRoled, "manage_settings")).toBe(false);
  });

  it("accepts owners for any permission even without role entries", () => {
    expect(can(owner, "manage_fleet")).toBe(true);
    expect(can(owner, "manage_treasury")).toBe(true);
    expect(can(owner, "manage_settings")).toBe(true);
  });
});

describe("permissionLabel", () => {
  it("returns readable labels for all permissions", () => {
    expect(permissionLabel("manage_fleet")).toBe("Manage Fleet");
    expect(permissionLabel("manage_operations")).toBe("Manage Missions");
    expect(permissionLabel("manage_treasury")).toBe("Manage Treasury");
  });
});
