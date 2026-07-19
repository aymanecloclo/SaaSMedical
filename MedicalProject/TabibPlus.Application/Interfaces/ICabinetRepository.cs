using System.Threading.Tasks;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Interfaces
{
    public interface ICabinetRepository
    {
        Task<int> AddAsync(Cabinet cabinet);
        Task<Cabinet?> GetByIdAsync(int id);
    }
}
