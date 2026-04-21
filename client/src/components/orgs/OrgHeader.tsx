import styles from "./OrgHeader.module.css";

export interface OrgHeaderData {
  name: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  motd: string | null;
  memberCount: number;
  ownerName?: string;
  isPublic: boolean;
}

interface OrgHeaderProps {
  org: OrgHeaderData;
}

export function OrgHeader({ org }: OrgHeaderProps) {
  const initial = org.name.charAt(0).toUpperCase();

  return (
    <div className={styles.wrap}>
      <div className={styles.banner}>
        {org.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={org.bannerUrl} alt="" className={styles.bannerImg} />
        ) : (
          <div className={styles.bannerPlaceholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.header}>
        <div className={styles.logoWrap}>
          {org.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.logoUrl} alt={`${org.name} logo`} className={styles.logoImg} />
          ) : (
            <div className={styles.logoPlaceholder} aria-hidden="true">{initial}</div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>{org.name}</h1>
          {org.description && <p className={styles.description}>{org.description}</p>}
          <div className={styles.meta}>
            <span>{org.memberCount} member{org.memberCount !== 1 ? "s" : ""}</span>
            {org.ownerName && <span>Owner: {org.ownerName}</span>}
            <span>{org.isPublic ? "Public" : "Private"}</span>
          </div>
        </div>
      </div>

      {org.motd && (
        <div className={styles.motd}>
          <span className={styles.motdBadge}>MOTD</span>{" "}
          {org.motd}
        </div>
      )}
    </div>
  );
}
