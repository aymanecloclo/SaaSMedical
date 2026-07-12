import { useNavigate } from "react-router-dom";
import { MapPin, Star, Briefcase, ShieldCheck, Video, Check } from "lucide-react";
import type { Praticien } from "../types";

export function PraticienCard({ praticien }: { praticien: Praticien }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/praticiens/${praticien.id}`)}
      className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start gap-4">
        {/* Avatar : photo si dispo, sinon initiales */}
        {praticien.photoProfil ? (
          <img
            src={praticien.photoProfil}
            alt={praticien.nomComplet}
            className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-lg font-bold text-white">
            {praticien.prenom?.[0]}{praticien.nom?.[0]}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900">{praticien.nomComplet}</h3>
          <p className="text-sm font-medium text-primary">{praticien.specialite}</p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {praticien.ville}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={13} /> {praticien.anneesExperience} ans
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} /> {praticien.secteur}
            </span>
            {praticien.accepteTeleconsult && (
              <span className="flex items-center gap-1 text-accent">
                <Video size={13} /> Téléconsult
              </span>
            )}
          </div>

          {praticien.accepteNouveauxPatients && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
              <Check size={12} /> Nouveaux patients
            </span>
          )}
        </div>

        {/* Colonne droite : note + prix */}
        <div className="flex flex-col items-end gap-2">
          {praticien.nombreAvis > 0 && (
            <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-600">
              <Star size={14} className="fill-amber-500 text-amber-500" />
              {praticien.noteMoyenne.toFixed(1)}
              <span className="font-normal text-amber-500/70">({praticien.nombreAvis})</span>
            </div>
          )}
          <span className="text-sm font-semibold text-gray-700">{praticien.honoraires} DH</span>
        </div>
      </div>
    </div>
  );
}