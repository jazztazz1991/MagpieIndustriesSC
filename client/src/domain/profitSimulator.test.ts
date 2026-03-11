import { describe, it, expect } from "vitest";
import {
  simulateProfit,
  compareActivities,
  type ActivityConfig,
} from "./profitSimulator";

describe("simulateProfit", () => {
  const baseConfig: ActivityConfig = {
    name: "Test Mining",
    profitPerRun: 200000,
    timePerRunMin: 40,
    investmentCost: 2000000,
  };

  it("returns correct profitPerHour", () => {
    const result = simulateProfit(baseConfig, 4, 30);
    // 60/40 = 1.5 runs/hr, 200000 * 1.5 = 300000
    expect(result.profitPerHour).toBe(300000);
  });

  it("returns correct runsToBreakEven", () => {
    const result = simulateProfit(baseConfig, 4, 30);
    // ceil(2000000 / 200000) = 10
    expect(result.runsToBreakEven).toBe(10);
  });

  it("returns correct hoursToBreakEven", () => {
    const result = simulateProfit(baseConfig, 4, 30);
    // 2000000 / 300000 = 6.666... rounds to 6.7
    expect(result.hoursToBreakEven).toBe(6.7);
  });

  it("returns 0 break even with zero investment", () => {
    const freeConfig: ActivityConfig = {
      name: "Free Activity",
      profitPerRun: 50000,
      timePerRunMin: 15,
      investmentCost: 0,
    };
    const result = simulateProfit(freeConfig, 4, 30);
    expect(result.runsToBreakEven).toBe(0);
    expect(result.hoursToBreakEven).toBe(0);
  });

  it("returns correct profitAfterHours accounting for investment", () => {
    const result = simulateProfit(baseConfig, 4, 30);
    // totalHours = 4 * 30 = 120, profit = 300000 * 120 - 2000000 = 34000000
    expect(result.profitAfterHours).toBe(34000000);
  });

  it("returns correct dailyProfit", () => {
    const result = simulateProfit(baseConfig, 4, 30);
    // 300000 * 4 = 1200000
    expect(result.dailyProfit).toBe(1200000);
  });
});

describe("compareActivities", () => {
  it("sorts by profitPerHour descending", () => {
    const configs: ActivityConfig[] = [
      {
        name: "Low",
        profitPerRun: 10000,
        timePerRunMin: 30,
        investmentCost: 0,
      },
      {
        name: "High",
        profitPerRun: 100000,
        timePerRunMin: 10,
        investmentCost: 0,
      },
      {
        name: "Mid",
        profitPerRun: 50000,
        timePerRunMin: 20,
        investmentCost: 0,
      },
    ];
    const results = compareActivities(configs, 4, 30);
    expect(results[0].activity).toBe("High");
    expect(results[1].activity).toBe("Mid");
    expect(results[2].activity).toBe("Low");
  });

  it("returns empty array for empty input", () => {
    const results = compareActivities([], 4, 30);
    expect(results).toEqual([]);
  });
});
