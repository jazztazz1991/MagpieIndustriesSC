export interface ActivityConfig {
  name: string;
  profitPerRun: number;
  timePerRunMin: number;
  investmentCost: number;
}

export interface SimulationResult {
  activity: string;
  profitPerHour: number;
  runsToBreakEven: number;
  hoursToBreakEven: number;
  profitAfterHours: number;
  dailyProfit: number;
}

export function simulateProfit(
  config: ActivityConfig,
  hoursPerDay: number,
  totalDays: number,
): SimulationResult {
  const runsPerHour = 60 / config.timePerRunMin;
  const profitPerHour = config.profitPerRun * runsPerHour;
  const runsToBreakEven =
    config.investmentCost > 0
      ? Math.ceil(config.investmentCost / config.profitPerRun)
      : 0;
  const hoursToBreakEven =
    config.investmentCost > 0 ? config.investmentCost / profitPerHour : 0;
  const totalHours = hoursPerDay * totalDays;
  const profitAfterHours = profitPerHour * totalHours - config.investmentCost;
  const dailyProfit = profitPerHour * hoursPerDay;

  return {
    activity: config.name,
    profitPerHour: Math.round(profitPerHour),
    runsToBreakEven,
    hoursToBreakEven: Math.round(hoursToBreakEven * 10) / 10,
    profitAfterHours: Math.round(profitAfterHours),
    dailyProfit: Math.round(dailyProfit),
  };
}

export function compareActivities(
  configs: ActivityConfig[],
  hoursPerDay: number,
  totalDays: number,
): SimulationResult[] {
  return configs
    .map((c) => simulateProfit(c, hoursPerDay, totalDays))
    .sort((a, b) => b.profitPerHour - a.profitPerHour);
}
