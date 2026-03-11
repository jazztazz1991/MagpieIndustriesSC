"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "./dashboard.module.css";

const ALL_PERMISSIONS = [
  "manage_members",
  "manage_roles",
  "manage_fleet",
  "manage_operations",
  "manage_treasury",
  "manage_events",
  "manage_recruitment",
  "manage_guides",
  "manage_announcements",
] as const;

type Permission = (typeof ALL_PERMISSIONS)[number];

const PERMISSION_LABELS: Record<Permission, string> = {
  manage_members: "Manage Members",
  manage_roles: "Manage Roles",
  manage_fleet: "Manage Fleet",
  manage_operations: "Manage Operations",
  manage_treasury: "Manage Treasury",
  manage_events: "Manage Events",
  manage_recruitment: "Manage Recruitment",
  manage_guides: "Manage Guides",
  manage_announcements: "Manage Announcements",
};

interface OrgOwner {
  id: string;
  username: string;
}

interface OrgMember {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: OrgRole | null;
  joinedAt: string;
}

interface OrgRole {
  id: string;
  name: string;
  permissions: Permission[];
}

interface OrgSettings {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  spectrumId: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isPublic: boolean;
  motd: string | null;
  ownerId: string;
  owner: OrgOwner;
  members: OrgMember[];
  roles: OrgRole[];
}

type DashboardSection = "settings" | "roles" | "members";

export default function OrgDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<DashboardSection>("settings");

  // Settings form state
  const [settingsName, setSettingsName] = useState("");
  const [settingsSlug, setSettingsSlug] = useState("");
  const [settingsDesc, setSettingsDesc] = useState("");
  const [settingsIsPublic, setSettingsIsPublic] = useState(false);
  const [settingsSpectrumId, setSettingsSpectrumId] = useState("");
  const [settingsLogoUrl, setSettingsLogoUrl] = useState("");
  const [settingsBannerUrl, setSettingsBannerUrl] = useState("");
  const [settingsMotd, setSettingsMotd] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Role management state
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<Permission[]>([]);
  const [creatingRole, setCreatingRole] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editRolePermissions, setEditRolePermissions] = useState<Permission[]>([]);
  const [savingRole, setSavingRole] = useState(false);

  // Member management state
  const [memberRoleChanges, setMemberRoleChanges] = useState<Record<string, string>>({});
  const [savingMember, setSavingMember] = useState<string | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);

  // Join requests state
  interface JoinRequestItem {
    id: string;
    message: string | null;
    status: string;
    createdAt: string;
    user: { id: string; username: string; avatarUrl: string | null };
  }
  const [joinRequests, setJoinRequests] = useState<JoinRequestItem[]>([]);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchOrg();
  }, [user, authLoading, slug]);

  async function fetchOrg() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<OrgSettings>(`/api/orgs/${slug}`);
    if (res.success && res.data) {
      setOrg(res.data);
      populateSettingsForm(res.data);
      fetchJoinRequests(res.data.id);
    } else {
      setError(res.error || "Failed to load organization");
    }
    setLoading(false);
  }

  async function fetchJoinRequests(orgId: string) {
    const res = await apiFetch<JoinRequestItem[]>(`/api/orgs/${orgId}/join-requests`);
    if (res.success && res.data) {
      setJoinRequests(res.data);
    }
  }

  async function handleJoinRequestAction(requestId: string, action: "approve" | "deny") {
    if (!org) return;
    setProcessingRequest(requestId);
    const res = await apiFetch(`/api/orgs/${org.id}/join-requests/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    });
    if (res.success) {
      await fetchJoinRequests(org.id);
      if (action === "approve") {
        await fetchOrg();
      }
    }
    setProcessingRequest(null);
  }

  function populateSettingsForm(data: OrgSettings) {
    setSettingsName(data.name);
    setSettingsSlug(data.slug);
    setSettingsDesc(data.description || "");
    setSettingsIsPublic(data.isPublic);
    setSettingsSpectrumId(data.spectrumId || "");
    setSettingsLogoUrl(data.logoUrl || "");
    setSettingsBannerUrl(data.bannerUrl || "");
    setSettingsMotd(data.motd || "");
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!org) return;
    setSaving(true);
    setSaveMsg(null);
    setSaveError(null);

    const res = await apiFetch(`/api/orgs/${org.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: settingsName,
        slug: settingsSlug,
        description: settingsDesc || undefined,
        isPublic: settingsIsPublic,
        spectrumId: settingsSpectrumId || undefined,
        logoUrl: settingsLogoUrl || undefined,
        bannerUrl: settingsBannerUrl || undefined,
        motd: settingsMotd || null,
      }),
    });

    if (res.success) {
      setSaveMsg("Settings saved successfully.");
      await fetchOrg();
      if (settingsSlug !== slug) {
        router.replace(`/orgs/${settingsSlug}/dashboard`);
      }
    } else {
      setSaveError(res.error || "Failed to save settings");
    }
    setSaving(false);
  }

  async function handleCreateRole(e: React.FormEvent) {
    e.preventDefault();
    if (!org) return;
    setCreatingRole(true);
    setRoleError(null);

    const res = await apiFetch(`/api/orgs/${org.id}/roles`, {
      method: "POST",
      body: JSON.stringify({
        name: newRoleName,
        rank: 0,
        permissions: newRolePermissions,
      }),
    });

    if (res.success) {
      setNewRoleName("");
      setNewRolePermissions([]);
      await fetchOrg();
    } else {
      setRoleError(res.error || "Failed to create role");
    }
    setCreatingRole(false);
  }

  function startEditRole(role: OrgRole) {
    setEditingRoleId(role.id);
    setEditRolePermissions([...role.permissions]);
  }

  function cancelEditRole() {
    setEditingRoleId(null);
    setEditRolePermissions([]);
  }

  async function handleSaveRolePermissions(roleId: string) {
    if (!org) return;
    setSavingRole(true);
    setRoleError(null);

    const res = await apiFetch(`/api/orgs/${org.id}/roles/${roleId}`, {
      method: "PATCH",
      body: JSON.stringify({ permissions: editRolePermissions }),
    });

    if (res.success) {
      setEditingRoleId(null);
      setEditRolePermissions([]);
      await fetchOrg();
    } else {
      setRoleError(res.error || "Failed to update role");
    }
    setSavingRole(false);
  }

  function togglePermission(
    perm: Permission,
    current: Permission[],
    setter: React.Dispatch<React.SetStateAction<Permission[]>>
  ) {
    if (current.includes(perm)) {
      setter(current.filter((p) => p !== perm));
    } else {
      setter([...current, perm]);
    }
  }

  async function handleChangeMemberRole(memberId: string) {
    if (!org) return;
    const newRole = memberRoleChanges[memberId];
    if (!newRole) return;

    setSavingMember(memberId);
    setMemberError(null);

    const res = await apiFetch(`/api/orgs/${org.id}/members/${memberId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ roleId: newRole || null }),
    });

    if (res.success) {
      setMemberRoleChanges((prev) => {
        const updated = { ...prev };
        delete updated[memberId];
        return updated;
      });
      await fetchOrg();
    } else {
      setMemberError(res.error || "Failed to change member role");
    }
    setSavingMember(null);
  }

  async function handleRemoveMember(memberId: string) {
    if (!org) return;
    if (!confirm("Remove this member from the organization?")) return;

    setMemberError(null);
    const res = await apiFetch(`/api/orgs/${org.id}/members/${memberId}`, {
      method: "DELETE",
    });

    if (res.success) {
      await fetchOrg();
    } else {
      setMemberError(res.error || "Failed to remove member");
    }
  }

  if (authLoading || loading) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.emptyState}>Sign in to access the dashboard.</div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className={styles.dashboardPage}>
        <Link href="/orgs" className={styles.backLink}>
          Back to Organizations
        </Link>
        <div className={styles.emptyState}>{error || "Organization not found"}</div>
      </div>
    );
  }

  if (user.id !== org.ownerId) {
    return (
      <div className={styles.dashboardPage}>
        <Link href={`/orgs/${slug}`} className={styles.backLink}>
          Back to Organization
        </Link>
        <div className={styles.emptyState}>You do not have permission to access this dashboard.</div>
      </div>
    );
  }

  const roleOptions = org.roles || [];

  return (
    <div className={styles.dashboardPage}>
      <Link href={`/orgs/${slug}`} className={styles.backLink}>
        Back to {org.name}
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{org.name} Dashboard</h1>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <Link href={`/orgs/${slug}`} className={styles.quickLink}>
          Organization Profile
        </Link>
        <Link href={`/orgs/${slug}/fleet`} className={styles.quickLink}>Fleet Management</Link>
        <Link href={`/orgs/${slug}/operations`} className={styles.quickLink}>Operations</Link>
        <Link href={`/orgs/${slug}/treasury`} className={styles.quickLink}>Treasury</Link>
        <Link href={`/orgs/${slug}/recruitment`} className={styles.quickLink}>Recruitment</Link>
        <Link href={`/orgs/${slug}/guides`} className={styles.quickLink}>Guides</Link>
      </div>

      {/* Section Nav */}
      <div className={styles.sectionNav}>
        <button
          className={`${styles.sectionNavBtn} ${activeSection === "settings" ? styles.sectionNavActive : ""}`}
          onClick={() => setActiveSection("settings")}
        >
          Settings
        </button>
        <button
          className={`${styles.sectionNavBtn} ${activeSection === "roles" ? styles.sectionNavActive : ""}`}
          onClick={() => setActiveSection("roles")}
        >
          Roles
        </button>
        <button
          className={`${styles.sectionNavBtn} ${activeSection === "members" ? styles.sectionNavActive : ""}`}
          onClick={() => setActiveSection("members")}
        >
          Members
        </button>
      </div>

      {/* Settings Section */}
      {activeSection === "settings" && (
        <form className={styles.settingsForm} onSubmit={handleSaveSettings}>
          <h2 className={styles.sectionTitle}>Organization Settings</h2>

          <div className={styles.formGroup}>
            <label htmlFor="settings-name">Name</label>
            <input
              id="settings-name"
              type="text"
              value={settingsName}
              onChange={(e) => setSettingsName(e.target.value)}
              minLength={3}
              maxLength={50}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="settings-slug">Slug</label>
            <input
              id="settings-slug"
              type="text"
              value={settingsSlug}
              onChange={(e) => setSettingsSlug(e.target.value)}
              minLength={3}
              maxLength={50}
              required
              pattern="[a-z0-9-]+"
              title="Lowercase letters, numbers, and hyphens only"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="settings-desc">Description</label>
            <textarea
              id="settings-desc"
              value={settingsDesc}
              onChange={(e) => setSettingsDesc(e.target.value)}
              maxLength={500}
              placeholder="Organization description"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="settings-spectrum">Spectrum ID</label>
            <input
              id="settings-spectrum"
              type="text"
              value={settingsSpectrumId}
              onChange={(e) => setSettingsSpectrumId(e.target.value)}
              placeholder="RSI Spectrum organization ID"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="settings-logo">Logo URL</label>
            <input
              id="settings-logo"
              type="text"
              value={settingsLogoUrl}
              onChange={(e) => setSettingsLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="settings-banner">Banner URL</label>
            <input
              id="settings-banner"
              type="text"
              value={settingsBannerUrl}
              onChange={(e) => setSettingsBannerUrl(e.target.value)}
              placeholder="https://example.com/banner.png"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="settings-motd">Message of the Day</label>
            <textarea
              id="settings-motd"
              value={settingsMotd}
              onChange={(e) => setSettingsMotd(e.target.value)}
              maxLength={2000}
              placeholder="A message displayed on the org overview page"
            />
          </div>

          <div className={styles.toggleGroup}>
            <label htmlFor="settings-public" className={styles.toggleLabel}>
              <input
                id="settings-public"
                type="checkbox"
                checked={settingsIsPublic}
                onChange={(e) => setSettingsIsPublic(e.target.checked)}
                className={styles.toggleCheckbox}
              />
              <span className={styles.toggleText}>Public Organization</span>
              <span className={styles.toggleHint}>
                Public organizations are visible in the discover list
              </span>
            </label>
          </div>

          {saveError && <div className={styles.error}>{saveError}</div>}
          {saveMsg && <div className={styles.success}>{saveMsg}</div>}

          <div className={styles.formActions}>
            <button type="submit" className={styles.formSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      )}

      {/* Roles Section */}
      {activeSection === "roles" && (
        <div className={styles.rolesSection}>
          <h2 className={styles.sectionTitle}>Role Management</h2>

          {/* Create Role Form */}
          <form className={styles.createRoleForm} onSubmit={handleCreateRole}>
            <h3 className={styles.subsectionTitle}>Create New Role</h3>
            <div className={styles.formGroup}>
              <label htmlFor="role-name">Role Name</label>
              <input
                id="role-name"
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                minLength={2}
                maxLength={30}
                required
                placeholder="Role name"
              />
            </div>
            <div className={styles.permissionsGrid}>
              {ALL_PERMISSIONS.map((perm) => (
                <label key={perm} className={styles.permissionCheckbox}>
                  <input
                    type="checkbox"
                    checked={newRolePermissions.includes(perm)}
                    onChange={() =>
                      togglePermission(perm, newRolePermissions, setNewRolePermissions)
                    }
                  />
                  <span>{PERMISSION_LABELS[perm]}</span>
                </label>
              ))}
            </div>
            {roleError && <div className={styles.error}>{roleError}</div>}
            <button type="submit" className={styles.formSubmit} disabled={creatingRole}>
              {creatingRole ? "Creating..." : "Create Role"}
            </button>
          </form>

          {/* Existing Roles */}
          <h3 className={styles.subsectionTitle}>Existing Roles</h3>
          {(!org.roles || org.roles.length === 0) ? (
            <div className={styles.emptyState}>No custom roles defined yet.</div>
          ) : (
            <div className={styles.roleList}>
              {org.roles.map((role) => (
                <div key={role.id} className={styles.roleCard}>
                  <div className={styles.roleCardHeader}>
                    <span className={styles.roleName}>{role.name}</span>
                    {editingRoleId !== role.id && (
                      <button
                        className={styles.editBtn}
                        onClick={() => startEditRole(role)}
                      >
                        Edit Permissions
                      </button>
                    )}
                  </div>

                  {editingRoleId === role.id ? (
                    <div className={styles.roleEditArea}>
                      <div className={styles.permissionsGrid}>
                        {ALL_PERMISSIONS.map((perm) => (
                          <label key={perm} className={styles.permissionCheckbox}>
                            <input
                              type="checkbox"
                              checked={editRolePermissions.includes(perm)}
                              onChange={() =>
                                togglePermission(perm, editRolePermissions, setEditRolePermissions)
                              }
                            />
                            <span>{PERMISSION_LABELS[perm]}</span>
                          </label>
                        ))}
                      </div>
                      <div className={styles.roleEditActions}>
                        <button
                          className={styles.formSubmit}
                          onClick={() => handleSaveRolePermissions(role.id)}
                          disabled={savingRole}
                        >
                          {savingRole ? "Saving..." : "Save"}
                        </button>
                        <button className={styles.formCancel} onClick={cancelEditRole}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.rolePermissionsList}>
                      {role.permissions.length === 0 ? (
                        <span className={styles.noPermissions}>No permissions</span>
                      ) : (
                        role.permissions.map((perm) => (
                          <span key={perm} className={styles.permissionTag}>
                            {PERMISSION_LABELS[perm] || perm}
                          </span>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Section */}
      {activeSection === "members" && (
        <div className={styles.membersSection}>
          <h2 className={styles.sectionTitle}>Member Management</h2>
          {memberError && <div className={styles.error}>{memberError}</div>}

          {/* Join Requests */}
          {joinRequests.length > 0 && (
            <div className={styles.joinRequestsSection}>
              <h3 className={styles.subsectionTitle}>
                Pending Join Requests ({joinRequests.length})
              </h3>
              <div className={styles.memberList}>
                {joinRequests.map((req) => (
                  <div key={req.id} className={styles.memberRow}>
                    <div className={styles.memberInfo}>
                      {req.user.avatarUrl ? (
                        <img src={req.user.avatarUrl} alt={req.user.username} className={styles.memberAvatar} />
                      ) : (
                        <div className={styles.memberAvatar} />
                      )}
                      <div className={styles.memberDetails}>
                        <span className={styles.memberName}>{req.user.username}</span>
                        {req.message && (
                          <span className={styles.memberRole}>{req.message}</span>
                        )}
                        <span className={styles.memberRole}>
                          Requested {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className={styles.memberActions}>
                      <button
                        className={styles.saveRoleBtn}
                        onClick={() => handleJoinRequestAction(req.id, "approve")}
                        disabled={processingRequest === req.id}
                      >
                        Approve
                      </button>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleJoinRequestAction(req.id, "deny")}
                        disabled={processingRequest === req.id}
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {org.members.length === 0 ? (
            <div className={styles.emptyState}>No members to manage.</div>
          ) : (
            <div className={styles.memberList}>
              {org.members.map((member) => {
                const isOrgOwner = member.id === org.ownerId;
                const pendingRole = memberRoleChanges[member.id];

                return (
                  <div key={member.id} className={styles.memberRow}>
                    <div className={styles.memberInfo}>
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.username}
                          className={styles.memberAvatar}
                        />
                      ) : (
                        <div className={styles.memberAvatar} />
                      )}
                      <div className={styles.memberDetails}>
                        <span className={styles.memberName}>{member.username}</span>
                        <span className={styles.memberRole}>{member.role?.name || "No role"}</span>
                      </div>
                    </div>
                    {!isOrgOwner && (
                      <div className={styles.memberActions}>
                        <select
                          className={styles.roleSelect}
                          value={pendingRole || member.role?.id || ""}
                          onChange={(e) =>
                            setMemberRoleChanges((prev) => ({
                              ...prev,
                              [member.id]: e.target.value,
                            }))
                          }
                        >
                          <option value={member.role?.id || ""}>{member.role?.name || "No role"}</option>
                          {roleOptions
                            .filter((r) => r.id !== (member.role?.id || ""))
                            .map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                        </select>
                        {pendingRole && pendingRole !== (member.role?.id || "") && (
                          <button
                            className={styles.saveRoleBtn}
                            onClick={() => handleChangeMemberRole(member.id)}
                            disabled={savingMember === member.id}
                          >
                            {savingMember === member.id ? "Saving..." : "Apply"}
                          </button>
                        )}
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {isOrgOwner && (
                      <span className={styles.ownerLabel}>Owner</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
