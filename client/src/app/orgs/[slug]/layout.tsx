"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Sidebar } from "@/components/orgs/Sidebar";
import styles from "./layout.module.css";

interface OrgSummary {
  id: string;
  slug: string;
  ownerId: string;
  isMember?: boolean;
  myRole?: { permissions: string[] } | null;
}

export default function OrgSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();
  const [org, setOrg] = useState<OrgSummary | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    apiFetch<OrgSummary>(`/api/orgs/${slug}`).then((res) => {
      if (res.success && res.data) setOrg(res.data);
    });
  }, [user, authLoading, slug]);

  const isOwner = !!(user && org && user.id === org.ownerId);

  return (
    <div className={styles.layout}>
      <Link href="/orgs" className={styles.backLink}>
        ← Back to Organizations
      </Link>
      <div className={styles.grid}>
        <Sidebar slug={slug} isOwner={isOwner} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
