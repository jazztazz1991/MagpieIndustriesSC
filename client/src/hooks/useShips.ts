import { useDataSource } from "./useDataSource";
import { ships, type Ship } from "@/data/ships";
import { API_ENDPOINTS } from "@/lib/dataSource";

export function useShips() {
  return useDataSource<Ship[]>(ships, API_ENDPOINTS.ships);
}
