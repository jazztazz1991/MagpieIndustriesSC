"use client";

import styles from "./LoadingSkeleton.module.css";

interface LoadingSkeletonProps {
  variant?: "card" | "table" | "text" | "grid";
  count?: number;
}

export default function LoadingSkeleton({
  variant = "card",
  count = 3,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "grid") {
    return (
      <div className={styles.grid}>
        {items.map((i) => (
          <div
            key={i}
            className={`${styles.skeleton} ${styles.gridCard}`}
            role="status"
            aria-label="Loading"
          />
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={styles.container} role="status" aria-label="Loading">
        <div className={`${styles.skeleton} ${styles.tableHeader}`} />
        {items.map((i) => (
          <div
            key={i}
            className={`${styles.skeleton} ${styles.tableRow}`}
          />
        ))}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={styles.container} role="status" aria-label="Loading">
        {items.map((i) => {
          const widthClass =
            i % 3 === 0
              ? styles.textLineFull
              : i % 3 === 1
                ? styles.textLineMedium
                : styles.textLineShort;
          return (
            <div
              key={i}
              className={`${styles.skeleton} ${styles.textLine} ${widthClass}`}
            />
          );
        })}
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={styles.container} role="status" aria-label="Loading">
      {items.map((i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${styles.card}`}
        />
      ))}
    </div>
  );
}
