using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Interfaces
{
    public interface IPraticienRepository
    {
        Task<Praticien?> GetByIdAsync(int id);
        Task<IEnumerable<Praticien>> SearchAsync(
            string? specialite,
            string? ville,
            string? secteur,
            bool? teleconsult,
            bool? disponibleAujourdhui,
            string? motCle);
        Task<IEnumerable<Praticien>> GetByCabinetAsync(int cabinetId);
        Task AddAsync(Praticien praticien);
        Task UpdateAsync(Praticien praticien);
        Task<IEnumerable<DateTime>> GetDisponibilitesAsync(
            int praticienId, DateTime date);
        Task<IEnumerable<PlageHoraire>> GetPlagesHorairesAsync(int praticienId);
        Task RemplacerPlagesHorairesAsync(int praticienId, IEnumerable<PlageHoraire> plages);
    }
}
