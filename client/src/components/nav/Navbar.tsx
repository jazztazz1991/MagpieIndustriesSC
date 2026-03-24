"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

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
          <Link href="/tools/mining">Mining</Link>
          <Link href="/tools/mining-locations">Where to Mine</Link>
          <Link href="/tools/salvage">Salvage</Link>
          <Link href="/tools/refinery">Refinery</Link>
          <Link href="/tools/trade">Trade</Link>
          <Link href="/tools/loadout">Loadout</Link>
          <Link href="/tools/profit">Profit</Link>
          <Link href="/ships">Ships</Link>
          <Link href="/guides/wikelo">Wikelo</Link>
          <Link href="/locations">Locations</Link>
          <Link href="/guides/beginner">Guide</Link>
          <Link href="/community/friends">Community</Link>
          <Link href="/orgs">Orgs</Link>
          <Link href="/recruitment">Recruit</Link>
          <Link href="/suggestions">Suggest</Link>
          <Link href="/reports">Reports</Link>
          {user?.isAdmin && <Link href="/admin">Admin</Link>}
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
          <Link href="/tools/mining" onClick={closeMenu}>Mining</Link>
          <Link href="/tools/mining-locations" onClick={closeMenu}>Where to Mine</Link>
          <Link href="/tools/salvage" onClick={closeMenu}>Salvage</Link>
          <Link href="/tools/refinery" onClick={closeMenu}>Refinery</Link>
          <Link href="/tools/trade" onClick={closeMenu}>Trade</Link>
          <Link href="/tools/loadout" onClick={closeMenu}>Loadout</Link>
          <Link href="/tools/profit" onClick={closeMenu}>Profit</Link>
          <Link href="/ships" onClick={closeMenu}>Ships</Link>
          <Link href="/guides/wikelo" onClick={closeMenu}>Wikelo</Link>
          <Link href="/locations" onClick={closeMenu}>Locations</Link>
          <Link href="/guides/beginner" onClick={closeMenu}>Guide</Link>
          <Link href="/community/friends" onClick={closeMenu}>Community</Link>
          <Link href="/orgs" onClick={closeMenu}>Orgs</Link>
          <Link href="/recruitment" onClick={closeMenu}>Recruit</Link>
          <Link href="/suggestions" onClick={closeMenu}>Suggest</Link>
          <Link href="/reports" onClick={closeMenu}>Reports</Link>
          {user?.isAdmin && <Link href="/admin" onClick={closeMenu}>Admin</Link>}

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
