export type DataSourceMode = "static" | "api";

// Configuration - defaults to static, can be switched to API when backend is ready
export const DATA_SOURCE_MODE: DataSourceMode = "static";

export const API_ENDPOINTS = {
  ships: "/api/ships",
  locations: "/api/locations",
  commodities: "/api/trade/commodities",
  ores: "/api/mining/ores",
} as const;
