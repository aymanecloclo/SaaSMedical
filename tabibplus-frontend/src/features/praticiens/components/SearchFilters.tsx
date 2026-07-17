import {
  SlidersHorizontal,
  RotateCcw,
  Video,
  Sparkles,
} from "lucide-react";
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

export function SearchFiltersPanel({
  filters,
  onChange,
  sort,
  onSortChange,
  onReset,
}: Props) {
  const { data: specialites } = useSpecialites();
  const { data: villes } = useVilles();

  const selectClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium transition-all duration-300 outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10";

  return (
    <aside className="sticky top-24 w-full rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:w-80 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 p-6 text-white">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
              <SlidersHorizontal size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Filtres
              </h2>

              <p className="text-sm text-cyan-100">
                Trouvez votre médecin idéal
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="rounded-xl bg-white/15 p-3 transition hover:bg-white/25"
          >
            <RotateCcw size={18} />
          </button>

        </div>

      </div>

      {/* Body */}

      <div className="space-y-5 p-6">

        {/* Specialité */}

        <div className="rounded-2xl border border-slate-200 p-4 transition hover:border-cyan-400 hover:shadow-md">

          <label className="flex items-center gap-2 font-semibold text-slate-700">
            <Sparkles size={16} className="text-cyan-600" />
            Spécialité
          </label>

          <select
            className={selectClass}
            value={filters.specialite ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                specialite: e.target.value || undefined,
              })
            }
          >
            <option value="">Toutes les spécialités</option>

            {specialites?.map((s) => (
              <option key={s.id} value={s.nom}>
                {s.nom}
              </option>
            ))}
          </select>

        </div>

        {/* Ville */}

        <div className="rounded-2xl border border-slate-200 p-4 transition hover:border-cyan-400 hover:shadow-md">

          <label className="font-semibold text-slate-700">
            Ville
          </label>

          <select
            className={selectClass}
            value={filters.ville ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                ville: e.target.value || undefined,
              })
            }
          >
            <option value="">Toutes les villes</option>

            {villes?.map((v) => (
              <option key={v.id} value={v.nom}>
                {v.nom}
              </option>
            ))}
          </select>

        </div>

        {/* Secteur */}

        <div className="rounded-2xl border border-slate-200 p-4 transition hover:border-cyan-400 hover:shadow-md">

          <label className="font-semibold text-slate-700">
            Secteur
          </label>

          <select
            className={selectClass}
            value={filters.secteur ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                secteur: e.target.value || undefined,
              })
            }
          >
            <option value="">Tous les secteurs</option>

            {SECTEURS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

        </div>

        {/* Téléconsultation */}

        <div className="rounded-2xl border border-slate-200 p-4 transition hover:border-cyan-400 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>

              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <Video size={18} className="text-cyan-600" />
                Téléconsultation
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Afficher uniquement les médecins disponibles en ligne
              </p>

            </div>

            <button
              onClick={() =>
                onChange({
                  ...filters,
                  teleconsult: !filters.teleconsult,
                })
              }
              className={`relative h-7 w-14 rounded-full transition ${
                filters.teleconsult
                  ? "bg-cyan-600"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  filters.teleconsult
                    ? "left-8"
                    : "left-1"
                }`}
              />
            </button>

          </div>

        </div>

        {/* Tri */}

        <div className="rounded-2xl border border-slate-200 p-4 transition hover:border-cyan-400 hover:shadow-md">

          <label className="font-semibold text-slate-700">
            Trier les résultats
          </label>

          <select
            className={selectClass}
            value={sort}
            onChange={(e) =>
              onSortChange(e.target.value as SortOption)
            }
          >
            <option value="note">
              ⭐ Meilleure note
            </option>

            <option value="prix_asc">
              💰 Prix croissant
            </option>

            <option value="prix_desc">
              💎 Prix décroissant
            </option>

          </select>

        </div>

      </div>
    </aside>
  );
}