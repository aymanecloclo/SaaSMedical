import { SlidersHorizontal, Video } from "lucide-react";
import { useSpecialites, useVilles } from "../../auth/hooks/useReferences";
import type { SearchFilters, SortOption } from "../types";

interface Props {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

const SECTEURS = ["CNOPS", "CNSS", "Libre", "CNOPS_CNSS"];

export function SearchFiltersPanel({ filters, onChange, sort, onSortChange, onReset }: Props) {
  const { data: specialites } = useSpecialites();
  const { data: villes } = useVilles();

  const selectClass =
    "w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

  return (
    <aside className="w-full flex-shrink-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:w-72">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal size={18} /> Filtres
        </h2>
        <button onClick={onReset} className="text-xs text-primary hover:underline">
          Réinitialiser
        </button>
      </div>

      <div className="space-y-4">
        {/* Spécialité */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Spécialité</label>
          <select
            className={selectClass}
            value={filters.specialite ?? ""}
            onChange={(e) => onChange({ ...filters, specialite: e.target.value || undefined })}
          >
            <option value="">Toutes</option>
            {specialites?.map((s) => (
              <option key={s.id} value={s.nom}>{s.nom}</option>
            ))}
          </select>
        </div>

        {/* Ville */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Ville</label>
          <select
            className={selectClass}
            value={filters.ville ?? ""}
            onChange={(e) => onChange({ ...filters, ville: e.target.value || undefined })}
          >
            <option value="">Toutes</option>
            {villes?.map((v) => (
              <option key={v.id} value={v.nom}>{v.nom}</option>
            ))}
          </select>
        </div>

        {/* Secteur */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Secteur</label>
          <select
            className={selectClass}
            value={filters.secteur ?? ""}
            onChange={(e) => onChange({ ...filters, secteur: e.target.value || undefined })}
          >
            <option value="">Tous</option>
            {SECTEURS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Téléconsultation */}
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5">
          <span className="flex items-center gap-2 text-sm text-gray-700">
            <Video size={16} className="text-accent" /> Téléconsultation
          </span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            checked={filters.teleconsult ?? false}
            onChange={(e) => onChange({ ...filters, teleconsult: e.target.checked || undefined })}
          />
        </label>

        {/* Tri */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Trier par</label>
          <select
            className={selectClass}
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="note">Meilleure note</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
          </select>
        </div>
      </div>
    </aside>
  );
}