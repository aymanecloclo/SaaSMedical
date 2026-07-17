using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;
using TabibPlus.Infrastructure.Data;

namespace TabibPlus.Infrastructure.Repositories
{
    public class VilleRepository : IVilleRepository
    {
        private readonly TabibPlusDbContext _db;

        public VilleRepository(TabibPlusDbContext db)
            => _db = db;

        public async Task<IEnumerable<Ville>> GetAllAsync()
            => await _db.Villes
                .OrderBy(v => v.NomFr)
                .ToListAsync();
        public async Task<Ville?> GetByIdAsync(int id)
    => await _db.Villes.FindAsync(id);
    }
}