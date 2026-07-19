using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;
using TabibPlus.Infrastructure.Data;

namespace TabibPlus.Infrastructure.Repositories
{
    public class RendezVousRepository : IRendezVousRepository
    {
        private readonly TabibPlusDbContext _db;

        public RendezVousRepository(TabibPlusDbContext db)
            => _db = db;

        public async Task<RendezVous?> GetByIdAsync(int id)
            => await _db.RendezVous
                .Include(r => r.Patient)
                .Include(r => r.Praticien)
                .FirstOrDefaultAsync(r => r.Id == id);

        public async Task<IEnumerable<RendezVous>>
            GetByPraticienAsync(int praticienId, DateTime date)
            => await _db.RendezVous
                .Include(r => r.Patient)
                .Where(r =>
                    r.PraticienId == praticienId &&
                    r.DateHeure.Date == date.Date &&
                    r.Statut != "Annule")
                .OrderBy(r => r.DateHeure)
                .ToListAsync();

        public async Task<IEnumerable<RendezVous>>
            GetByPraticienRangeAsync(int praticienId, DateTime dateDebut, DateTime dateFinExclusive)
            => await _db.RendezVous
                .Include(r => r.Patient)
                .Where(r =>
                    r.PraticienId == praticienId &&
                    r.DateHeure.Date >= dateDebut.Date &&
                    r.DateHeure.Date < dateFinExclusive.Date &&
                    r.Statut != "Annule")
                .OrderBy(r => r.DateHeure)
                .ToListAsync();

        public async Task<IEnumerable<RendezVous>>
            GetByPatientAsync(int patientId, bool aVenir)
        {
            var maintenant = DateTime.Now;

            var baseQuery = _db.RendezVous
                .Include(r => r.Praticien)
                    .ThenInclude(p => p.Specialite)
                .Include(r => r.Praticien)
                    .ThenInclude(p => p.Cabinet)
                        .ThenInclude(c => c.Ville)
                .Where(r => r.PatientId == patientId);

            if (aVenir)
            {
                return await baseQuery
                    .Where(r => r.DateHeure >= maintenant && r.Statut != "Annule")
                    .OrderBy(r => r.DateHeure)
                    .ToListAsync();
            }

            return await baseQuery
                .Where(r => r.DateHeure < maintenant || r.Statut == "Termine" || r.Statut == "Annule")
                .OrderByDescending(r => r.DateHeure)
                .ToListAsync();
        }

        public async Task<bool> CreneauEstLibreAsync(
            int praticienId, DateTime dateHeure)
            => !await _db.RendezVous.AnyAsync(r =>
                r.PraticienId == praticienId &&
                r.DateHeure == dateHeure &&
                r.Statut != "Annule");

        public async Task AddAsync(RendezVous rdv)
        {
            _db.RendezVous.Add(rdv);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(RendezVous rdv)
        {
            rdv.ModifieLe = DateTime.UtcNow;
            _db.RendezVous.Update(rdv);
            await _db.SaveChangesAsync();
        }

        public async Task<(int RdvAujourdhui, int RdvCeMois, int NbPatientsUniques, int RdvTermines)>
            GetStatsAsync(int praticienId)
        {
            var aujourdhui = DateTime.Today;
            var debutMois = new DateTime(aujourdhui.Year, aujourdhui.Month, 1);

            var rdvAujourdhui = await _db.RendezVous
                .CountAsync(r => r.PraticienId == praticienId
                    && r.DateHeure.Date == aujourdhui
                    && r.Statut != "Annule");

            var rdvCeMois = await _db.RendezVous
                .CountAsync(r => r.PraticienId == praticienId
                    && r.DateHeure >= debutMois
                    && r.Statut != "Annule");

            var nbPatientsUniques = await _db.RendezVous
                .Where(r => r.PraticienId == praticienId)
                .Select(r => r.PatientId)
                .Distinct()
                .CountAsync();

            var rdvTermines = await _db.RendezVous
                .CountAsync(r => r.PraticienId == praticienId && r.Statut == "Termine");

            return (rdvAujourdhui, rdvCeMois, nbPatientsUniques, rdvTermines);
        }
    }
}
