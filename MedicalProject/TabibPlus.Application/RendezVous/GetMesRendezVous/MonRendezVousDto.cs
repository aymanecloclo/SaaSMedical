using System;

namespace TabibPlus.Application.RendezVous.GetMesRendezVous
{
    public record MonRendezVousDto(
        int Id,
        DateTime DateHeure,
        int DureeMinutes,
        string Motif,
        string Statut,
        bool EstTeleconsultation,
        int PraticienId,
        string PraticienNomComplet,
        string? PraticienPhoto,
        string Specialite,
        string Ville,
        decimal Honoraires
    );
}
