namespace TabibPlus.Application.RendezVous.GetPraticienStats
{
    public record PraticienStatsDto(
        int RdvAujourdhui,
        int RdvCeMois,
        int NbPatientsUniques,
        int RdvTermines
    );
}
