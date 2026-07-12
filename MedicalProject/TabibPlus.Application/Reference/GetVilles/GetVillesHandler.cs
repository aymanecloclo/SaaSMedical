using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.Reference.GetVilles
{
    public class GetVillesHandler
    {
        private readonly IVilleRepository _repo;

        public GetVillesHandler(IVilleRepository repo)
            => _repo = repo;

        public async Task<IEnumerable<VilleDto>> Handle()
        {
            var villes = await _repo.GetAllAsync();
            return villes.Select(v => new VilleDto(v.Id, v.NomFr, v.Region));
        }
    }
}