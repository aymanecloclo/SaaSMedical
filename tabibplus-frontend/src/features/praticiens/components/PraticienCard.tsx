import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../lib/getImageUrl";
import {
  MapPin,
  Star,
  Briefcase,
  ShieldCheck,
  Video,
  CheckCircle,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import type { Praticien } from "../types";

export function PraticienCard({ praticien }: { praticien: Praticien }) {
  const navigate = useNavigate();
const avatar =
  getImageUrl(praticien.photoProfil) || "/images/default-doctor.jpg";

  return (
    <div
      onClick={() => navigate(`/praticiens/${praticien.id}`)}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-cyan-300
        hover:shadow-2xl
      "
    >
      {/* Image */}

      <div className="relative overflow-hidden">
        <img
          src={avatar}
          alt={praticien.nomComplet}
          className="
            h-60
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-105
          "
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Vérifié */}

        <div className="absolute left-5 top-5 rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white shadow-lg">
          ✓ Vérifié
        </div>

        {/* Note */}

        {praticien.nombreAvis > 0 && (
          <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-white px-3 py-2 shadow-lg">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />

            <span className="font-bold">
              {praticien.noteMoyenne.toFixed(1)}
            </span>

            <span className="text-xs text-slate-500">
              ({praticien.nombreAvis})
            </span>
          </div>
        )}

        {/* Nom */}

        <div className="absolute bottom-5 left-5 text-white">
          <h2 className="text-2xl font-bold">{praticien.nomComplet}</h2>

          <p className="font-medium text-cyan-300">{praticien.specialite}</p>
        </div>
      </div>

      {/* Contenu */}

      <div className="space-y-5 p-6">
        {/* Informations */}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-3">
            <MapPin className="text-cyan-600" size={18} />

            <div>
              <p className="text-xs text-slate-500">Ville</p>

              <p className="font-semibold">{praticien.ville}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-3">
            <Briefcase className="text-cyan-600" size={18} />

            <div>
              <p className="text-xs text-slate-500">Expérience</p>

              <p className="font-semibold">{praticien.anneesExperience} ans</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-3">
            <ShieldCheck className="text-cyan-600" size={18} />

            <div>
              <p className="text-xs text-slate-500">Secteur</p>

              <p className="font-semibold">{praticien.secteur}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-3">
            <CalendarDays className="text-cyan-600" size={18} />

            <div>
              <p className="text-xs text-slate-500">Consultation</p>

              <p className="font-semibold">{praticien.honoraires} DH</p>
            </div>
          </div>
        </div>

        {/* Badges */}

        <div className="flex flex-wrap gap-2">
          {praticien.accepteTeleconsult && (
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <Video size={16} />
              Téléconsultation
            </span>
          )}

          {praticien.accepteNouveauxPatients && (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              <CheckCircle size={16} />
              Nouveaux patients
            </span>
          )}
        </div>

        {/* Bouton */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/praticiens/${praticien.id}`);
          }}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-cyan-600
            to-blue-700
            py-4
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-xl
          "
        >
          Prendre rendez-vous
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
