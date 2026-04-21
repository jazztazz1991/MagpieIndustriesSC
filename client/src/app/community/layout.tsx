"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./community.module.css";
import toolStyles from "../tools/tools.module.css";

const navItems = [
  { href: "/community/feed", label: "Feed" },
  { href: "/community/orgs", label: "Orgs" },
  { href: "/community/events", label: "Events" },
  { href: "/community/groups", label: "Groups" },
  { href: "/community/friends", label: "Friends" },
];

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={toolStyles.page}>
      <h1 className={toolStyles.title}>Community</h1>
      <p className={toolStyles.subtitle}>
        Connect with other Star Citizen players
      </p>

      <nav className={styles.communityNav}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
