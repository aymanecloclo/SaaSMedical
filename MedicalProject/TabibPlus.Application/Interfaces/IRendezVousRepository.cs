using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Interfaces
{
    public interface IRendezVousRepository
    {
        Task<TabibPlus.Core.Entities.RendezVous?> GetByIdAsync(int id);
        Task<IEnumerable<TabibPlus.Core.Entities.RendezVous>> GetByPraticienAsync(
            int praticienId, DateTime date);
        Task<IEnumerable<TabibPlus.Core.Entities.RendezVous>> GetByPraticienRangeAsync(
            int praticienId, DateTime dateDebut, DateTime dateFinExclusive);
        Task<bool> CreneauEstLibreAsync(
            int praticienId, DateTime dateHeure);
        Task AddAsync(TabibPlus.Core.Entities.RendezVous rdv);
        Task UpdateAsync(TabibPlus.Core.Entities.RendezVous rdv);
        Task<(int RdvAujourdhui, int RdvCeMois, int NbPatientsUniques, int RdvTermines)>
            GetStatsAsync(int praticienId);
    }
}
