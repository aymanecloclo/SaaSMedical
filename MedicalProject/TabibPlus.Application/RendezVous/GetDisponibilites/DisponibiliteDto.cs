using System;

namespace TabibPlus.Application.RendezVous.GetDisponibilites
{
    public record DisponibiliteDto(
        DateTime DateHeure,
        string Heure,
        bool Libre
    );
}