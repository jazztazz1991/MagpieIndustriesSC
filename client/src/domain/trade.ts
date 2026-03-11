import type { TradeRoute } from "@/data/trade";
import { tradeLocations } from "@/data/trade";

export function findTradeRoutes(): TradeRoute[] {
  const routes: TradeRoute[] = [];

  for (const buyLoc of tradeLocations) {
    for (const sellEntry of buyLoc.sells) {
      for (const sellLoc of tradeLocations) {
        if (buyLoc.name === sellLoc.name) continue;
        const buyEntry = sellLoc.buys.find(
          (b) => b.commodity === sellEntry.commodity
        );
        if (buyEntry && buyEntry.price > sellEntry.price) {
          routes.push({
            from: buyLoc.name,
            to: sellLoc.name,
            commodity: sellEntry.commodity,
            buyPrice: sellEntry.price,
            sellPrice: buyEntry.price,
            profitPerSCU: Math.round((buyEntry.price - sellEntry.price) * 100) / 100,
          });
        }
      }
    }
  }

  return routes.sort((a, b) => b.profitPerSCU - a.profitPerSCU);
}
