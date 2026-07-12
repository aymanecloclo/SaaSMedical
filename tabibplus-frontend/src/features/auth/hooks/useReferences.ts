import { useQuery } from "@tanstack/react-query";
import { getSpecialites, getVilles } from "../api/referenceApi";

export function useSpecialites() {
  return useQuery({
    queryKey: ["specialites"],
    queryFn: getSpecialites,
    staleTime: Infinity,  // données de référence : ne changent jamais, cache permanent
  });
}

export function useVilles() {
  return useQuery({
    queryKey: ["villes"],
    queryFn: getVilles,
    staleTime: Infinity,
  });
}