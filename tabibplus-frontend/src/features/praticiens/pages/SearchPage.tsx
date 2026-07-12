import { useState, useMemo } from "react";
import { Loader2, Stethoscope } from "lucide-react";
import { useSearchPraticiens } from "../hooks/useSearchPraticiens";
import { PraticienCard } from "../components/PraticienCard";
import { SearchFiltersPanel } from "../components/SearchFilters";
import type { SearchFilters, SortOption } from "../type";

export function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<SortOption>("note");

  const { data: praticiens, isLoading, isError } = useSearchPraticiens(filters);

  // Tri côté front (le backend ne trie pas)
  const praticiensTries = useMemo(() => {
    if (!praticiens) return [];
    const copie = [...praticiens];
    switch (sort) {
      case "prix_asc":
        return copie.sort((a, b) => a.honoraires - b.honoraires);
      case "prix_desc":
        return copie.sort((a, b) => b.honoraires - a.honoraires);
      case "note":
      default:
        return copie.sort((a, b) => b.noteMoyenne - a.noteMoyenne);
    }
  }, [praticiens, sort]);

  return (
    <div>
      {/* Hero compact */}
      <div className="mb-6 rounded-3xl bg-gradient-to-br from-primary to-accent p-6 text-white shadow-lg shadow-primary/20">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Stethoscope size={26} /> Trouvez votre médecin
        </h1>
        <p className="mt-1 text-sm text-white/80">
          Filtrez par spécialité, ville, secteur et réservez en ligne
        </p>
      </div>

      {/* Layout : sidebar + résultats */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <SearchFiltersPanel
          filters={filters}
          onChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          onReset={() => setFilters({})}
        />

        {/* Résultats */}
        <div className="flex-1">
          {isLoading && (
            <div className="flex justify-center py-20 text-primary">
              <Loader2 className="animate-spin" size={32} />
            </div>
          )}

          {isError && (
            <p className="py-20 text-center text-red-500">
              Erreur lors du chargement. Vérifie que l'API tourne.
            </p>
          )}

          {!isLoading && !isError && (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {praticiensTries.length} praticien{praticiensTries.length > 1 ? "s" : ""} trouvé
                {praticiensTries.length > 1 ? "s" : ""}
              </p>

              {praticiensTries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
                  Aucun praticien ne correspond à vos critères.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {praticiensTries.map((p) => (
                    <PraticienCard key={p.id} praticien={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}