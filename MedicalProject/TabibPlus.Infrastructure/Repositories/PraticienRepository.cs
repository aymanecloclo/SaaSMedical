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
	public class PraticienRepository : IPraticienRepository
	{
		private readonly TabibPlusDbContext _db;

		public PraticienRepository(TabibPlusDbContext db)
			=> _db = db;

		public async Task<Praticien?> GetByIdAsync(int id)
			=> await _db.Praticiens
				.Include(p => p.User)
                .Include(p => p.Cabinet!.Ville)
                .Include(p => p.Specialite)
                .Include(p => p.Photos)
				.Include(p => p.PlagesHoraires)
				.FirstOrDefaultAsync(p => p.Id == id
					&& p.ProfilValide);

        public async Task<IEnumerable<Praticien>> SearchAsync(
    string? specialite,
    string? ville,
    string? secteur,
    bool? teleconsult,
    bool? disponibleAujourdhui,
    string? motCle)
        {
            var q = _db.Praticiens
                .Include(p => p.Cabinet!.Ville)
                .Include(p => p.Specialite)
                .Include(p => p.Photos)
                .Where(p => p.ProfilValide
                    && p.AccepteNouveauxPatients);

            if (!string.IsNullOrWhiteSpace(specialite))
                q = q.Where(p =>
                    p.Specialite != null &&
                    p.Specialite.NomFr.ToLower()
                        .Contains(specialite.ToLower()));

            if (!string.IsNullOrWhiteSpace(ville))
                q = q.Where(p =>
                    p.Cabinet.Ville != null &&
                    p.Cabinet.Ville.NomFr.ToLower()
                        .Contains(ville.ToLower()));

            if (!string.IsNullOrWhiteSpace(secteur))
                q = q.Where(p => p.Secteur == secteur);

            if (teleconsult == true)
                q = q.Where(p => p.AccepteTeleconsult);

            // NOUVEAU — recherche libre sur plusieurs champs à la fois
            if (!string.IsNullOrWhiteSpace(motCle))
            {
                var mot = motCle.ToLower().Trim();
                q = q.Where(p =>
                    p.Nom.ToLower().Contains(mot) ||
                    p.Prenom.ToLower().Contains(mot) ||
                    (p.Specialite != null && p.Specialite.NomFr.ToLower().Contains(mot)) ||
                    (p.Cabinet.Ville != null && p.Cabinet.Ville.NomFr.ToLower().Contains(mot)) ||
                    (p.Bio != null && p.Bio.ToLower().Contains(mot))
                );
            }

            return await q
                .OrderByDescending(p => p.NoteMoyenne)
                .ThenByDescending(p => p.NombreAvis)
                .ToListAsync();
        }

        public async Task AddAsync(Praticien praticien)
		{
			_db.Praticiens.Add(praticien);
			await _db.SaveChangesAsync();
		}

		public async Task UpdateAsync(Praticien praticien)
		{
			_db.Praticiens.Update(praticien);
			await _db.SaveChangesAsync();
		}

		public async Task<IEnumerable<DateTime>>
			GetDisponibilitesAsync(int praticienId, DateTime date)
		{
			var praticien = await _db.Praticiens
				.Include(p => p.PlagesHoraires)
				.FirstOrDefaultAsync(p => p.Id == praticienId);

			if (praticien == null)
				return Enumerable.Empty<DateTime>();

			// Jour de la semaine (1=Lundi...6=Samedi)
			int jour = (int)date.DayOfWeek == 0
				? 7 : (int)date.DayOfWeek;

			var plage = praticien.PlagesHoraires
				.FirstOrDefault(p =>
					p.JourSemaine == jour && p.Actif);

			if (plage == null)
				return Enumerable.Empty<DateTime>();

			// Générer les créneaux
			var creneaux = new List<DateTime>();
			var courant = date.Date + plage.HeureDebut;
			var fin = date.Date + plage.HeureFin;

			while (courant.AddMinutes(
				praticien.DureeRdvDefaut) <= fin)
			{
				creneaux.Add(courant);
				courant = courant.AddMinutes(
					praticien.DureeRdvDefaut);
			}

			return creneaux;
		}
	}
}