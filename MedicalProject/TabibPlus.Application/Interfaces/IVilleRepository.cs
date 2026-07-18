using System.Collections.Generic;
using System.Threading.Tasks;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Interfaces
{
    public interface IVilleRepository
    {
        Task<IEnumerable<Ville>> GetAllAsync();
        Task<Ville?> GetByIdAsync(int id);
    }
}