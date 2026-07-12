using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;
using TabibPlus.Infrastructure.Data;

namespace TabibPlus.Infrastructure.Repositories
{
    public class SpecialiteRepository : ISpecialiteRepository
    {
        private readonly TabibPlusDbContext _db;

        public SpecialiteRepository(TabibPlusDbContext db)
            => _db = db;

        public async Task<IEnumerable<Specialite>> GetAllAsync()
            => await _db.Specialites
                .OrderBy(s => s.NomFr)
                .ToListAsync();
    }
}