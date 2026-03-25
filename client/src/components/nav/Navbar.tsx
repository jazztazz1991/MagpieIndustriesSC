"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: DropdownItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Tools",
    items: [
      { label: "Mining Calculator", href: "/tools/mining" },
      { label: "Where to Mine", href: "/tools/mining-locations" },
      { label: "Salvage", href: "/tools/salvage" },
      { label: "Refinery", href: "/tools/refinery" },
      { label: "Trade", href: "/tools/trade" },
      { label: "Loadout", href: "/tools/loadout" },
      { label: "Profit", href: "/tools/profit" },
      { label: "Notepad", href: "/tools/notepad" },
    ],
  },
  {
    label: "Database",
    items: [
      { label: "Ships", href: "/ships" },
      { label: "Locations", href: "/locations" },
      { label: "Wikelo", href: "/guides/wikelo" },
    ],
  },
  {
    label: "Guides",
    items: [
      { label: "Beginner Guide", href: "/guides/beginner" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Friends", href: "/community/friends" },
      { label: "Orgs", href: "/orgs" },
      { label: "Recruitment", href: "/recruitment" },
    ],
  },
  {
    label: "Feedback",
    items: [
      { label: "Suggestions", href: "/suggestions" },
      { label: "Bug Reports", href: "/reports" },
    ],
  },
];

function Dropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        className={styles.dropdownToggle}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {group.label}
        <span className={styles.chevron} aria-hidden="true" />
      </button>
      {open && (
        <div className={styles.dropdownMenu}>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.dropdownItem}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Magpie Industries
        </Link>

        <div className={styles.links}>
          {NAV_GROUPS.map((group) => (
            <Dropdown key={group.label} group={group} />
          ))}
          {user?.isAdmin && <Link href="/admin" className={styles.adminLink}>Admin</Link>}
        </div>

        <button
          className={styles.searchBtn}
          onClick={() =>
            document.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: true,
                bubbles: true,
              }),
            )
          }
          aria-label="Search (Ctrl+K)"
        >
          Search
          <kbd className={styles.kbd}>Ctrl+K</kbd>
        </button>

        <div className={styles.auth}>
          {user ? (
            <>
              <Link href="/profile" className={styles.username}>
                {user.username}
              </Link>
              <button onClick={logout} className={styles.btn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className={styles.btn}>
                Sign In
              </Link>
              <Link href="/auth/signup" className={styles.btnPrimary}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className={styles.menuToggle}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      {menuOpen && (
        <div className={`${styles.mobileMenu} ${styles.mobileMenuOpen}`}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className={styles.mobileGroup}>
              <div className={styles.mobileGroupLabel}>{group.label}</div>
              {group.items.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          {user?.isAdmin && (
            <div className={styles.mobileGroup}>
              <Link href="/admin" onClick={closeMenu}>Admin</Link>
            </div>
          )}

          <div className={styles.mobileAuth}>
            {user ? (
              <>
                <Link href="/profile" className={styles.username} onClick={closeMenu}>
                  {user.username}
                </Link>
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className={styles.btn}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className={styles.btn} onClick={closeMenu}>
                  Sign In
                </Link>
                <Link href="/auth/signup" className={styles.btnPrimary} onClick={closeMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
