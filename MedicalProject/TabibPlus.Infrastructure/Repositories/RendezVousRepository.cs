using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
    }
}