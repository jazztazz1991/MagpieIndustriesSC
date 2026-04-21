"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

export interface SidebarSection {
  key: string;
  label: string;
  href: string;
  icon?: string;
  group?: string;
}

interface SidebarProps {
  slug: string;
  sections?: SidebarSection[];
  isOwner?: boolean;
}

const DEFAULT_SECTIONS: SidebarSection[] = [
  { key: "overview", label: "Overview", href: "", icon: "🏠" },
  { key: "missions", label: "Missions", href: "missions", icon: "🎯", group: "Operations" },
  { key: "fleet", label: "Fleet", href: "fleet", icon: "🚀", group: "Operations" },
  { key: "calendar", label: "Calendar", href: "calendar", icon: "📅", group: "Operations" },
  { key: "recruitment", label: "Recruitment", href: "recruitment", icon: "📣", group: "People" },
  { key: "treasury", label: "Treasury", href: "treasury", icon: "💰", group: "Admin" },
  { key: "guides", label: "Guides", href: "guides", icon: "📖", group: "Admin" },
];

export function Sidebar({ slug, sections = DEFAULT_SECTIONS, isOwner }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (section: SidebarSection): boolean => {
    const target = section.href ? `/orgs/${slug}/${section.href}` : `/orgs/${slug}`;
    if (section.href === "") return pathname === target;
    return pathname === target || pathname.startsWith(target + "/");
  };

  const grouped = sections.reduce<Record<string, SidebarSection[]>>((acc, s) => {
    const key = s.group || "";
    (acc[key] ||= []).push(s);
    return acc;
  }, {});

  const activeSection = sections.find((s) => isActive(s));

  return (
    <aside className={styles.sidebarWrap} aria-label="Organization navigation">
      <button
        type="button"
        className={styles.mobileHeader}
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
      >
        <span>{activeSection?.label || "Menu"}</span>
        <span className={`${styles.toggleIcon} ${mobileOpen ? styles.open : ""}`}>▾</span>
      </button>

      <nav className={`${styles.sidebar} ${!mobileOpen ? styles.sidebarHidden : ""}`}>
        {Object.entries(grouped).map(([group, items], idx) => (
          <div key={group || `g${idx}`}>
            {group && <div className={styles.sectionLabel}>{group}</div>}
            {items.map((section) => (
              <Link
                key={section.key}
                href={section.href ? `/orgs/${slug}/${section.href}` : `/orgs/${slug}`}
                className={`${styles.link} ${isActive(section) ? styles.linkActive : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {section.icon && <span className={styles.icon}>{section.icon}</span>}
                {section.label}
              </Link>
            ))}
            {idx < Object.keys(grouped).length - 1 && <div className={styles.divider} />}
          </div>
        ))}
        {isOwner && (
          <>
            <div className={styles.divider} />
            <Link
              href={`/orgs/${slug}/dashboard`}
              className={`${styles.link} ${pathname.endsWith("/dashboard") ? styles.linkActive : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className={styles.icon}>⚙️</span>
              Settings
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
