using System;

namespace TabibPlus.Application.RendezVous.GetDisponibilites
{
    public record GetDisponibilitesQuery(
        int PraticienId,
        DateTime Date
    );
}