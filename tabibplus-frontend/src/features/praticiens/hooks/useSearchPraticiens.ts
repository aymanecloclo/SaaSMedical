import { useQuery } from "@tanstack/react-query";
import { searchPraticiens } from "../api/praticiensApi";
import type { SearchFilters } from "../type";

export function useSearchPraticiens(filters: SearchFilters) {
  return useQuery({
    queryKey: ["praticiens", filters],
    queryFn: () => searchPraticiens(filters),
  });
}
