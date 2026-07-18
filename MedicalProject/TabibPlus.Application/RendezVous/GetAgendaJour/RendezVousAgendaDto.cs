using System;

namespace TabibPlus.Application.RendezVous.GetAgendaJour
{
    public record PatientAgendaDto(
        int Id,
        string Nom,
        string Prenom,
        string Telephone,
        string? Allergies
    );

    public record RendezVousAgendaDto(
        int Id,
        DateTime DateHeure,
        int DureeMinutes,
        string Motif,
        string Statut,
        bool EstTeleconsultation,
        string Source,
        PatientAgendaDto Patient
    );
}
