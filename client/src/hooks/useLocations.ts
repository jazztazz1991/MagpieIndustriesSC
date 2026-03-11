import { useDataSource } from "./useDataSource";
import { locations, type Location } from "@/data/locations";
import { API_ENDPOINTS } from "@/lib/dataSource";

export function useLocations() {
  return useDataSource<Location[]>(locations, API_ENDPOINTS.locations);
}
