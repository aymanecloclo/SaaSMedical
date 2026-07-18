import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  Briefcase,
  ShieldCheck,
  Video,
  Check,
  Languages,
  GraduationCap,
  Phone,
  ArrowLeft,
  Calendar,
  Loader2,
} from "lucide-react";
import { getImageUrl } from "../../../lib/getImageUrl";
import { usePraticien } from "../hooks/usePraticien";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export function PraticienProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: praticien, isLoading, isError } = usePraticien(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-primary">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (isError || !praticien) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Praticien introuvable.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-primary hover:underline"
        >
          Retour à la recherche
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Retour */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
      >
        <ArrowLeft size={16} /> Retour à la recherche
      </button>

      {/* En-tête */}
      <Card className="mb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Avatar */}
          {praticien.photoProfil ? (
            <img
              src={getImageUrl(praticien.photoProfil)} alt={praticien.nomComplet}
            
              className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white">
              {praticien.nomComplet
                .split(" ")
                .slice(-2)
                .map((m) => m[0])
                .join("")}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {praticien.nomComplet}
            </h1>
            <p className="font-medium text-primary">{praticien.specialite}</p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={15} /> {praticien.ville}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={15} /> {praticien.anneesExperience} ans
                d'expérience
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={15} /> {praticien.secteur}
              </span>
              {praticien.nombreAvis > 0 && (
                <span className="flex items-center gap-1 text-amber-600">
                  <Star size={15} className="fill-amber-500 text-amber-500" />
                  {praticien.noteMoyenne.toFixed(1)} ({praticien.nombreAvis}{" "}
                  avis)
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              {praticien.accepteNouveauxPatients && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                  <Check size={12} /> Nouveaux patients
                </span>
              )}
              {praticien.accepteTeleconsult && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-600">
                  <Video size={12} /> Téléconsultation
                </span>
              )}
            </div>
          </div>

          {/* Prix */}
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {praticien.honoraires} DH
            </p>
            <p className="text-xs text-gray-400">consultation</p>
          </div>
        </div>

        {/* CTA réservation */}
        <Button
          className="mt-6"
          onClick={() => navigate(`/praticiens/${praticien.id}/reserver`)}
        >
          <Calendar size={18} /> Prendre rendez-vous
        </Button>
      </Card>

      {/* Détails */}
      <div className="grid gap-6 sm:grid-cols-2">
        {praticien.bio && (
          <Card className="sm:col-span-2">
            <h2 className="mb-2 font-semibold text-gray-900">À propos</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              {praticien.bio}
            </p>
          </Card>
        )}

        <Card>
          <h2 className="mb-3 font-semibold text-gray-900">Informations</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-gray-400" /> {praticien.adresse}
              , {praticien.ville}
            </li>
            {praticien.langues && (
              <li className="flex items-center gap-2">
                <Languages size={15} className="text-gray-400" />{" "}
                {praticien.langues}
              </li>
            )}
            {praticien.telephone && (
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-gray-400" />{" "}
                {praticien.telephone}
              </li>
            )}
          </ul>
        </Card>

        {praticien.diplomes && (
          <Card>
            <h2 className="mb-3 font-semibold text-gray-900">Diplômes</h2>
            <p className="flex items-start gap-2 text-sm text-gray-600">
              <GraduationCap
                size={15}
                className="mt-0.5 flex-shrink-0 text-gray-400"
              />
              {praticien.diplomes}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
