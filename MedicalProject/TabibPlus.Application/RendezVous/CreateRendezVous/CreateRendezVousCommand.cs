using System;

namespace TabibPlus.Application.RendezVous.CreateRendezVous
{
    public record CreateRendezVousCommand(
        int PatientId,
        int PraticienId,
        int CabinetId,
        DateTime DateHeure,
        int DureeMinutes,
        string Motif,
        bool EstTeleconsultation,
        string Source
    );
}