using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;
using TabibPlus.Infrastructure.Data;

namespace TabibPlus.Infrastructure.Repositories
{
	public class PatientRepository : IPatientRepository
	{
		private readonly TabibPlusDbContext _db;

		public PatientRepository(TabibPlusDbContext db)
			=> _db = db;

		public async Task<Patient?> GetByIdAsync(int id)
			=> await _db.Patients
				.FirstOrDefaultAsync(p => p.Id == id && p.Actif);

		public async Task<IEnumerable<Patient>> SearchAsync(
			string? query)
		{
			var q = _db.Patients.Where(p => p.Actif);

			if (!string.IsNullOrWhiteSpace(query))
			{
				query = query.ToLower();
				q = q.Where(p =>
					p.Nom.ToLower().Contains(query) ||
					p.Prenom.ToLower().Contains(query) ||
					p.Telephone.Contains(query));
			}

			return await q
				.OrderBy(p => p.Nom)
				.ThenBy(p => p.Prenom)
				.ToListAsync();
		}

		public async Task AddAsync(Patient patient)
		{
			_db.Patients.Add(patient);
			await _db.SaveChangesAsync();
		}

		public async Task UpdateAsync(Patient patient)
		{
			patient.ModifieLe = DateTime.UtcNow;
			_db.Patients.Update(patient);
			await _db.SaveChangesAsync();
		}

		public async Task DeleteAsync(int id)
		{
			var patient = await _db.Patients.FindAsync(id);
			if (patient != null)
			{
				// Soft delete — on ne supprime jamais
				// les données médicales
				patient.Actif = false;
				patient.ModifieLe = DateTime.UtcNow;
				await _db.SaveChangesAsync();
			}
		}
	}
}