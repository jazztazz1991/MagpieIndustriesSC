"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "./treasury.module.css";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  description: string;
  recordedBy: string;
  createdAt: string;
}

interface TreasuryData {
  balance: number;
  transactions: Transaction[];
  totalDeposits: number;
  totalWithdrawals: number;
}

export default function TreasuryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const { user, loading: authLoading } = useAuth();

  const [orgId, setOrgId] = useState<string>("");
  const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [txType, setTxType] = useState<"deposit" | "withdrawal">("deposit");
  const [txAmount, setTxAmount] = useState("");
  const [txDescription, setTxDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ id: string }>(`/api/orgs/${slug}`).then((res) => {
      if (res.success && res.data) setOrgId(res.data.id);
    });
  }, [slug]);

  useEffect(() => {
    if (!orgId) return;
    fetchTreasury();
  }, [orgId]);

  async function fetchTreasury() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<TreasuryData>(`/api/orgs/${orgId}/treasury`);
    if (res.success && res.data) {
      setTreasuryData(res.data);
    } else {
      setError(res.error || "Failed to load treasury data");
    }
    setLoading(false);
  }

  async function handleRecordTransaction(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const amount = parseFloat(txAmount);
    if (isNaN(amount) || amount <= 0) {
      setSubmitError("Amount must be a positive number");
      setSubmitting(false);
      return;
    }

    const res = await apiFetch(`/api/orgs/${orgId}/treasury`, {
      method: "POST",
      body: JSON.stringify({
        type: txType,
        amount,
        description: txDescription,
      }),
    });

    if (res.success) {
      setTxType("deposit");
      setTxAmount("");
      setTxDescription("");
      await fetchTreasury();
    } else {
      setSubmitError(res.error || "Failed to record transaction");
    }
    setSubmitting(false);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatAmount(amount: number): string {
    return amount.toLocaleString("en-US");
  }

  if (authLoading || (!orgId && !error)) {
    return (
      <div className={styles.treasuryPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.treasuryPage}>
        <div className={styles.emptyState}>Sign in to manage treasury.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.treasuryPage}>
        <Link href={`/orgs/${slug}`} className={styles.backLink}>
          &larr; Back to Org
        </Link>
        <div className={styles.loading}>Loading treasury...</div>
      </div>
    );
  }

  const maxBar =
    treasuryData
      ? Math.max(treasuryData.totalDeposits, treasuryData.totalWithdrawals, 1)
      : 1;

  return (
    <div className={styles.treasuryPage}>
      <Link href={`/orgs/${slug}`} className={styles.backLink}>
        &larr; Back to Org
      </Link>

      <h1 className={styles.title}>Treasury</h1>

      {error && <div className={styles.error}>{error}</div>}

      {treasuryData && (
        <>
          <div className={styles.balanceCard}>
            <div className={styles.balanceLabel}>Current Balance</div>
            <div className={styles.balanceAmount}>
              {formatAmount(treasuryData.balance)} aUEC
            </div>
          </div>

          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <div className={styles.summaryBars}>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>Deposits</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFillDeposit}
                    style={{
                      width: `${(treasuryData.totalDeposits / maxBar) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.barValue}>
                  {formatAmount(treasuryData.totalDeposits)} aUEC
                </span>
              </div>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>Withdrawals</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFillWithdrawal}
                    style={{
                      width: `${(treasuryData.totalWithdrawals / maxBar) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.barValue}>
                  {formatAmount(treasuryData.totalWithdrawals)} aUEC
                </span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Record Transaction</h2>
            <form className={styles.txForm} onSubmit={handleRecordTransaction}>
              <div className={styles.formGroup}>
                <label htmlFor="tx-type">Type</label>
                <select
                  id="tx-type"
                  className={styles.select}
                  value={txType}
                  onChange={(e) =>
                    setTxType(e.target.value as "deposit" | "withdrawal")
                  }
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tx-amount">Amount (aUEC)</label>
                <input
                  id="tx-amount"
                  type="number"
                  min="1"
                  step="1"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                  placeholder="Enter amount"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tx-desc">Description</label>
                <input
                  id="tx-desc"
                  type="text"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  required
                  placeholder="What is this transaction for?"
                  maxLength={200}
                />
              </div>
              {submitError && <div className={styles.error}>{submitError}</div>}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? "Recording..." : "Record Transaction"}
              </button>
            </form>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Transaction History</h2>
            {treasuryData.transactions.length === 0 ? (
              <div className={styles.emptyState}>
                No transactions recorded yet.
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treasuryData.transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{formatDate(tx.createdAt)}</td>
                        <td>
                          <span
                            className={
                              tx.type === "deposit"
                                ? styles.typeDeposit
                                : styles.typeWithdrawal
                            }
                          >
                            {tx.type === "deposit" ? "Deposit" : "Withdrawal"}
                          </span>
                        </td>
                        <td
                          className={
                            tx.type === "deposit"
                              ? styles.amountDeposit
                              : styles.amountWithdrawal
                          }
                        >
                          {tx.type === "deposit" ? "+" : "-"}
                          {formatAmount(tx.amount)} aUEC
                        </td>
                        <td>{tx.description}</td>
                        <td>{tx.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
