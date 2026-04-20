export interface CommodityPriceRow {
  commodityName: string;
  terminalName: string;
  locationName: string;
  priceBuy: number;   // price terminal pays when player sells to it
  priceSell: number;  // price terminal charges when player buys from it
  scuBuy: number;     // quantity terminal wants to buy
  scuSell: number;    // stock terminal has to sell
  dateModified?: string;
}

export interface HaulingRoute {
  commodityName: string;
  buyTerminalName: string;
  buyLocationName: string;
  buyPrice: number;       // price player pays per SCU
  buyStock: number;       // SCU available to buy
  sellTerminalName: string;
  sellLocationName: string;
  sellPrice: number;      // price player receives per SCU
  sellDemand: number;     // SCU terminal will buy
  profitPerScu: number;
  profitPerRun: number;   // profit over min(buyStock, sellDemand, cargoCapacity)
  runScu: number;         // actual SCU you can haul this run
}

/**
 * Compute the best hauling route per commodity given a list of price rows
 * and the player's cargo capacity.
 *
 * "Best" means: cheapest terminal selling the commodity + highest-paying
 * terminal buying it. Terminals with 0 stock or 0 demand are skipped.
 */
export function findBestRoutes(
  prices: CommodityPriceRow[],
  cargoCapacity: number
): HaulingRoute[] {
  const byCommodity = new Map<string, CommodityPriceRow[]>();
  for (const row of prices) {
    if (!row.commodityName) continue;
    const bucket = byCommodity.get(row.commodityName) || [];
    bucket.push(row);
    byCommodity.set(row.commodityName, bucket);
  }

  const routes: HaulingRoute[] = [];

  for (const [commodityName, rows] of byCommodity) {
    // Terminals that sell to the player (have stock and a sell price)
    const sellers = rows.filter((r) => r.priceSell > 0 && r.scuSell > 0);
    // Terminals that buy from the player (have demand and a buy price)
    const buyers = rows.filter((r) => r.priceBuy > 0 && r.scuBuy > 0);

    if (sellers.length === 0 || buyers.length === 0) continue;

    const cheapestSeller = sellers.reduce((a, b) => (a.priceSell <= b.priceSell ? a : b));
    const highestBuyer = buyers.reduce((a, b) => (a.priceBuy >= b.priceBuy ? a : b));

    const profitPerScu = highestBuyer.priceBuy - cheapestSeller.priceSell;
    if (profitPerScu <= 0) continue;

    // If the cheapest seller and highest buyer are the same terminal, skip —
    // that's a glitch, not a route.
    if (
      cheapestSeller.terminalName === highestBuyer.terminalName &&
      cheapestSeller.locationName === highestBuyer.locationName
    ) {
      continue;
    }

    const runScu = Math.min(
      cheapestSeller.scuSell,
      highestBuyer.scuBuy,
      cargoCapacity
    );

    routes.push({
      commodityName,
      buyTerminalName: cheapestSeller.terminalName,
      buyLocationName: cheapestSeller.locationName,
      buyPrice: cheapestSeller.priceSell,
      buyStock: cheapestSeller.scuSell,
      sellTerminalName: highestBuyer.terminalName,
      sellLocationName: highestBuyer.locationName,
      sellPrice: highestBuyer.priceBuy,
      sellDemand: highestBuyer.scuBuy,
      profitPerScu,
      profitPerRun: profitPerScu * runScu,
      runScu,
    });
  }

  // Sort by profit per run descending
  return routes.sort((a, b) => b.profitPerRun - a.profitPerRun);
}

/**
 * Filter routes by minimum profit per SCU.
 */
export function filterByMinProfit(routes: HaulingRoute[], minProfitPerScu: number): HaulingRoute[] {
  return routes.filter((r) => r.profitPerScu >= minProfitPerScu);
}

/**
 * Filter routes to those starting at a specific location (substring match).
 */
export function filterByStart(routes: HaulingRoute[], startLocation: string): HaulingRoute[] {
  if (!startLocation) return routes;
  const q = startLocation.toLowerCase();
  return routes.filter((r) => r.buyLocationName.toLowerCase().includes(q));
}
