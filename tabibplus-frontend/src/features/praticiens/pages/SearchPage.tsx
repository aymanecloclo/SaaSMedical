import { useState, useMemo } from "react";
import {
  Loader2,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useSearchPraticiens } from "../hooks/useSearchPraticiens";
import { PraticienCard } from "../components/PraticienCard";
import { SearchFiltersPanel } from "../components/SearchFilters";
import type { SearchFilters, SortOption } from "../type";

export function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({ page: 1 });
  const [sort, setSort] = useState<SortOption>("note");

  const { data, isLoading, isError } = useSearchPraticiens(filters);
  console.log(data);
  // Tri côté front — s'applique uniquement aux praticiens de la page actuelle
  const praticiensTries = useMemo(() => {
    if (!data?.items) return [];
    const copie = [...data.items];
    switch (sort) {
      case "prix_asc":
        return copie.sort((a, b) => a.honoraires - b.honoraires);
      case "prix_desc":
        return copie.sort((a, b) => b.honoraires - a.honoraires);
      case "note":
      default:
        return copie.sort((a, b) => b.noteMoyenne - a.noteMoyenne);
    }
  }, [data, sort]);

  // Changer un filtre remet toujours à la page 1
  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleReset = () => {
    setFilters({ page: 1 });
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      {/* Barre de recherche libre */}
      <div className="mb-6 relative">
        <Search
          size={20}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Rechercher par nom, spécialité, ville..."
          value={filters.motCle ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              motCle: e.target.value || undefined,
              page: 1,
            }))
          }
          className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>
      {/* Layout : sidebar + résultats */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <SearchFiltersPanel
          filters={filters}
          onChange={handleFiltersChange}
          sort={sort}
          onSortChange={setSort}
          onReset={handleReset}
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

          {!isLoading && !isError && data && (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {data.totalCount} praticien{data.totalCount > 1 ? "s" : ""}{" "}
                trouvé
                {data.totalCount > 1 ? "s" : ""}
                {data.totalPages > 1 && (
                  <span className="ml-1 text-gray-400">
                    — page {data.page} sur {data.totalPages}
                  </span>
                )}
              </p>

              {praticiensTries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
                  Aucun praticien ne correspond à vos critères.
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 ">
                    {praticiensTries.map((p) => (
                      <PraticienCard key={p.id} praticien={p} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {data.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        onClick={() => goToPage(data.page - 1)}
                        disabled={data.page <= 1}
                        className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={16} /> Précédent
                      </button>

                      <div className="flex gap-1">
                        {Array.from(
                          { length: data.totalPages },
                          (_, i) => i + 1,
                        )
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === data.totalPages ||
                              Math.abs(p - data.page) <= 1,
                          )
                          .map((p, idx, arr) => (
                            <span key={p} className="flex items-center">
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span className="px-1 text-gray-400">…</span>
                              )}
                              <button
                                onClick={() => goToPage(p)}
                                className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
                                  p === data.page
                                    ? "bg-primary text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {p}
                              </button>
                            </span>
                          ))}
                      </div>

                      <button
                        onClick={() => goToPage(data.page + 1)}
                        disabled={data.page >= data.totalPages}
                        className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Suivant <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
