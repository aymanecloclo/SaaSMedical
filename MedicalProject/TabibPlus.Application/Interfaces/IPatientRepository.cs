using System.Collections.Generic;
using System.Threading.Tasks;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Interfaces
{
    public interface IPatientRepository
    {
        Task<Patient?> GetByIdAsync(int id);
        Task<IEnumerable<Patient>> SearchAsync(string? query);
        Task AddAsync(Patient patient);
        Task UpdateAsync(Patient patient);
        Task DeleteAsync(int id);
    }
}