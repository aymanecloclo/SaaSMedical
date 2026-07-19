import { useState, useEffect } from "react";
import { Clock, Save } from "lucide-react";
import {
  useMesPlagesHoraires,
  useUpdatePlagesHoraires,
} from "../hooks/useDashboard";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { JOURS_SEMAINE } from "../types";
import type { PlageHoraireJour } from "../types";

function creerHorairesParDefaut(): PlageHoraireJour[] {
  return JOURS_SEMAINE.map((j) => ({
    jourSemaine: j.valeur,
    heureDebut: "09:00",
    heureFin: "17:00",
    actif: false,
  }));
}

export function HorairesEditor() {
  const { data: plagesExistantes, isLoading } = useMesPlagesHoraires();
  const updateMutation = useUpdatePlagesHoraires();

  const [horaires, setHoraires] = useState<PlageHoraireJour[]>(creerHorairesParDefaut());

  useEffect(() => {
    if (plagesExistantes) {
      const base = creerHorairesParDefaut();
      const fusion = base.map((jourDefaut) => {
        const existant = plagesExistantes.find((p) => p.jourSemaine === jourDefaut.jourSemaine);
        return existant
          ? { ...existant, actif: true }
          : jourDefaut;
      });
      setHoraires(fusion);
    }
  }, [plagesExistantes]);

  const toggleJour = (jourSemaine: number) => {
    setHoraires((prev) =>
      prev.map((h) =>
        h.jourSemaine === jourSemaine ? { ...h, actif: !h.actif } : h
      )
    );
  };

  const updateHeure = (jourSemaine: number, champ: "heureDebut" | "heureFin", valeur: string) => {
    setHoraires((prev) =>
      prev.map((h) =>
        h.jourSemaine === jourSemaine ? { ...h, [champ]: valeur } : h
      )
    );
  };

  const handleEnregistrer = () => {
    const actifsUniquement = horaires.filter((h) => h.actif);
    updateMutation.mutate(actifsUniquement);
  };

  if (isLoading) {
    return (
      <Card>
        <p className="text-center text-gray-400">Chargement...</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Clock size={18} /> Mes horaires de travail
      </h2>

      <div className="space-y-3">
        {JOURS_SEMAINE.map((jour) => {
          const h = horaires.find((x) => x.jourSemaine === jour.valeur)!;
          return (
            <div
              key={jour.valeur}
              className={`flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row sm:items-center sm:justify-between ${
                h.actif ? "border-primary/30 bg-primary/5" : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleJour(jour.valeur)}
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
                    h.actif ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      h.actif ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
                <span className={`w-20 font-medium ${h.actif ? "text-gray-900" : "text-gray-400"}`}>
                  {jour.label}
                </span>
              </div>

              {h.actif && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={h.heureDebut}
                    onChange={(e) => updateHeure(jour.valeur, "heureDebut", e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                  />
                  <span className="text-gray-400">à</span>
                  <input
                    type="time"
                    value={h.heureFin}
                    onChange={(e) => updateHeure(jour.valeur, "heureFin", e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <Button onClick={handleEnregistrer} isLoading={updateMutation.isPending}>
          <Save size={16} /> Enregistrer mes horaires
        </Button>
      </div>
    </Card>
  );
}
