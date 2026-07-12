using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;
using TabibPlus.Infrastructure.Data;

namespace TabibPlus.Infrastructure.Repositories
{
    public class CabinetRepository : ICabinetRepository
    {
        private readonly TabibPlusDbContext _db;

        public CabinetRepository(TabibPlusDbContext db)
            => _db = db;

        public async Task<int> AddAsync(Cabinet cabinet)
        {
            _db.Cabinets.Add(cabinet);
            await _db.SaveChangesAsync();
            return cabinet.Id;   // Id généré par la DB après SaveChanges
        }
    }
}