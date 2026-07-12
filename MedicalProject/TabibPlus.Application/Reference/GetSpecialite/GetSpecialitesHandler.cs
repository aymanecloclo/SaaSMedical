using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.Reference.GetSpecialites
{
    public class GetSpecialitesHandler
    {
        private readonly ISpecialiteRepository _repo;

        public GetSpecialitesHandler(ISpecialiteRepository repo)
            => _repo = repo;

        public async Task<IEnumerable<SpecialiteDto>> Handle()
        {
            var specialites = await _repo.GetAllAsync();
            return specialites.Select(s => new SpecialiteDto(s.Id, s.NomFr, s.Categorie));
        }
    }
}