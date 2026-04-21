export type TreasuryTransactionType = "DEPOSIT" | "WITHDRAWAL";

export interface TreasuryTransaction {
  id: string;
  type: TreasuryTransactionType;
  amount: number;
  description: string | null;
  user: { id: string; username: string };
  createdAt: string;
}

/**
 * Build a running balance series from a chronologically-sorted list of transactions.
 * DEPOSIT adds to balance, WITHDRAWAL subtracts.
 *
 * Returns an array of { createdAt, balance, delta } points, one per transaction,
 * useful for charting or audit trails.
 */
export function runningBalance(
  transactions: TreasuryTransaction[]
): Array<{ id: string; createdAt: string; delta: number; balance: number }> {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  let balance = 0;
  return sorted.map((t) => {
    const delta = t.type === "DEPOSIT" ? t.amount : -t.amount;
    balance += delta;
    return { id: t.id, createdAt: t.createdAt, delta, balance };
  });
}

/**
 * Compute the current total balance from a list of transactions.
 */
export function currentBalance(transactions: TreasuryTransaction[]): number {
  return transactions.reduce((sum, t) => sum + (t.type === "DEPOSIT" ? t.amount : -t.amount), 0);
}

/**
 * Aggregate totals by transaction type.
 */
export function totalsByType(transactions: TreasuryTransaction[]): {
  deposits: number;
  withdrawals: number;
  net: number;
} {
  let deposits = 0;
  let withdrawals = 0;
  for (const t of transactions) {
    if (t.type === "DEPOSIT") deposits += t.amount;
    else withdrawals += t.amount;
  }
  return { deposits, withdrawals, net: deposits - withdrawals };
}

/**
 * Aggregate totals per user (who deposited / withdrew how much).
 */
export function totalsByUser(
  transactions: TreasuryTransaction[]
): Array<{ userId: string; username: string; deposits: number; withdrawals: number; net: number }> {
  const map = new Map<string, { username: string; deposits: number; withdrawals: number }>();
  for (const t of transactions) {
    const entry = map.get(t.user.id) || { username: t.user.username, deposits: 0, withdrawals: 0 };
    if (t.type === "DEPOSIT") entry.deposits += t.amount;
    else entry.withdrawals += t.amount;
    map.set(t.user.id, entry);
  }
  return Array.from(map.entries()).map(([userId, e]) => ({
    userId,
    username: e.username,
    deposits: e.deposits,
    withdrawals: e.withdrawals,
    net: e.deposits - e.withdrawals,
  }));
}

/**
 * Export transactions to CSV string. Suitable for download.
 */
export function transactionsToCSV(transactions: TreasuryTransaction[]): string {
  const header = ["Date", "Type", "Amount", "User", "Description"].join(",");
  const escape = (s: string) => {
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const rows = transactions.map((t) =>
    [
      new Date(t.createdAt).toISOString(),
      t.type,
      t.amount.toString(),
      escape(t.user.username),
      escape(t.description || ""),
    ].join(",")
  );
  return [header, ...rows].join("\n");
}
