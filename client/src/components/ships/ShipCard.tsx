import { Ship } from "@/data/ships";
import styles from "@/app/ships/ships.module.css";

export interface ShipCardProps {
  ship: Ship;
  expanded: boolean;
  onToggle: () => void;
}

export default function ShipCard({ ship, expanded, onToggle }: ShipCardProps) {
  return (
    <div
      className={`${styles.card} ${expanded ? styles.cardExpanded : ""}`}
      onClick={onToggle}
      role="button"
      aria-expanded={expanded}
    >
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.shipName}>{ship.name}</h3>
          <p className={styles.shipMeta}>
            {ship.manufacturer} &middot; {ship.role}
          </p>
        </div>
        <span className={`${styles.sizeTag} ${styles[`size_${ship.size}`]}`}>
          {ship.size}
        </span>
      </div>

      <div className={styles.quickStats}>
        <div>
          <span className={styles.statLabel}>Crew</span>
          <span>
            {ship.crew.min}
            {ship.crew.max > ship.crew.min ? `–${ship.crew.max}` : ""}
          </span>
        </div>
        <div>
          <span className={styles.statLabel}>Cargo</span>
          <span>{ship.cargoSCU} SCU</span>
        </div>
        <div>
          <span className={styles.statLabel}>SCM</span>
          <span>{ship.speed.scm} m/s</span>
        </div>
        <div>
          <span className={styles.statLabel}>Price</span>
          <span>
            {ship.buyPriceAUEC
              ? `${(ship.buyPriceAUEC / 1000).toFixed(0)}k`
              : "N/A"}
          </span>
        </div>
      </div>

      {expanded && (
        <div className={styles.details}>
          <p>{ship.description}</p>
          <div className={styles.detailStats}>
            <span>
              Max Speed: <strong>{ship.speed.max} m/s</strong>
            </span>
            {ship.buyPriceAUEC && (
              <span>
                In-game: <strong>{ship.buyPriceAUEC.toLocaleString()} aUEC</strong>
              </span>
            )}
            {ship.pledgeUSD && (
              <span>
                Pledge: <strong>${ship.pledgeUSD}</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
