using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.RendezVous.GetPraticienStats
{
    public class GetPraticienStatsHandler
    {
        private readonly IRendezVousRepository _repo;

        public GetPraticienStatsHandler(IRendezVousRepository repo)
            => _repo = repo;

        public async Task<PraticienStatsDto> Handle(GetPraticienStatsQuery query)
        {
            var stats = await _repo.GetStatsAsync(query.PraticienId);

            return new PraticienStatsDto(
                stats.RdvAujourdhui,
                stats.RdvCeMois,
                stats.NbPatientsUniques,
                stats.RdvTermines
            );
        }
    }
}
