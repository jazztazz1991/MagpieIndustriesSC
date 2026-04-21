import { describe, it, expect } from "vitest";
import {
  runningBalance,
  currentBalance,
  totalsByType,
  totalsByUser,
  transactionsToCSV,
  type TreasuryTransaction,
} from "./treasury";

const t = (overrides: Partial<TreasuryTransaction> & { amount: number }): TreasuryTransaction => ({
  id: overrides.id ?? "t" + Math.random(),
  type: overrides.type ?? "DEPOSIT",
  amount: overrides.amount,
  description: overrides.description ?? null,
  user: overrides.user ?? { id: "u1", username: "Percy" },
  createdAt: overrides.createdAt ?? new Date("2026-04-20T12:00:00Z").toISOString(),
});

describe("runningBalance", () => {
  it("produces monotonic balance for chronological deposits", () => {
    const series = runningBalance([
      t({ amount: 100, type: "DEPOSIT", createdAt: "2026-04-01T00:00:00Z" }),
      t({ amount: 50, type: "DEPOSIT", createdAt: "2026-04-02T00:00:00Z" }),
      t({ amount: 25, type: "DEPOSIT", createdAt: "2026-04-03T00:00:00Z" }),
    ]);
    expect(series.map((s) => s.balance)).toEqual([100, 150, 175]);
  });

  it("deducts withdrawals", () => {
    const series = runningBalance([
      t({ amount: 100, type: "DEPOSIT", createdAt: "2026-04-01T00:00:00Z" }),
      t({ amount: 30, type: "WITHDRAWAL", createdAt: "2026-04-02T00:00:00Z" }),
    ]);
    expect(series.map((s) => s.balance)).toEqual([100, 70]);
    expect(series[1].delta).toBe(-30);
  });

  it("re-sorts transactions out of order", () => {
    const series = runningBalance([
      t({ id: "b", amount: 50, type: "DEPOSIT", createdAt: "2026-04-02T00:00:00Z" }),
      t({ id: "a", amount: 100, type: "DEPOSIT", createdAt: "2026-04-01T00:00:00Z" }),
    ]);
    expect(series.map((s) => s.id)).toEqual(["a", "b"]);
    expect(series.map((s) => s.balance)).toEqual([100, 150]);
  });
});

describe("currentBalance", () => {
  it("sums deposits minus withdrawals", () => {
    const total = currentBalance([
      t({ amount: 1000, type: "DEPOSIT" }),
      t({ amount: 250, type: "WITHDRAWAL" }),
      t({ amount: 100, type: "DEPOSIT" }),
    ]);
    expect(total).toBe(850);
  });

  it("returns 0 for empty", () => {
    expect(currentBalance([])).toBe(0);
  });
});

describe("totalsByType", () => {
  it("aggregates deposits, withdrawals, net", () => {
    const result = totalsByType([
      t({ amount: 500, type: "DEPOSIT" }),
      t({ amount: 200, type: "DEPOSIT" }),
      t({ amount: 300, type: "WITHDRAWAL" }),
    ]);
    expect(result).toEqual({ deposits: 700, withdrawals: 300, net: 400 });
  });
});

describe("totalsByUser", () => {
  it("groups by user id", () => {
    const result = totalsByUser([
      t({ amount: 100, type: "DEPOSIT", user: { id: "u1", username: "Percy" } }),
      t({ amount: 200, type: "DEPOSIT", user: { id: "u2", username: "Cody" } }),
      t({ amount: 50, type: "WITHDRAWAL", user: { id: "u1", username: "Percy" } }),
    ]);
    const percy = result.find((r) => r.userId === "u1")!;
    expect(percy).toMatchObject({ deposits: 100, withdrawals: 50, net: 50 });
    const cody = result.find((r) => r.userId === "u2")!;
    expect(cody).toMatchObject({ deposits: 200, withdrawals: 0, net: 200 });
  });
});

describe("transactionsToCSV", () => {
  it("produces a CSV header and rows", () => {
    const csv = transactionsToCSV([
      t({ id: "1", amount: 500, type: "DEPOSIT", description: "Mining run", createdAt: "2026-04-20T12:00:00Z" }),
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Date,Type,Amount,User,Description");
    expect(lines[1]).toContain("DEPOSIT");
    expect(lines[1]).toContain("500");
    expect(lines[1]).toContain("Percy");
    expect(lines[1]).toContain("Mining run");
  });

  it("escapes commas and quotes in descriptions", () => {
    const csv = transactionsToCSV([
      t({ id: "1", amount: 100, type: "DEPOSIT", description: 'Mining, "big" run' }),
    ]);
    expect(csv).toContain('"Mining, ""big"" run"');
  });
});
