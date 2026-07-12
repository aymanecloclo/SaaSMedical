using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;
using TabibPlus.Infrastructure.Data;

namespace TabibPlus.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly TabibPlusDbContext _db;

        public UserRepository(TabibPlusDbContext db)
            => _db = db;

        public async Task<bool> EmailExisteAsync(string email)
            => await _db.Users.AnyAsync(u => u.Email == email.ToLower());

        public async Task<User?> GetByEmailAsync(string email)
            => await _db.Users
                .Include(u => u.Praticien)
                .FirstOrDefaultAsync(u => u.Email == email.ToLower() && u.Actif);

        public async Task<int> AddAsync(User user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user.Id;   // l'Id est généré par la DB après SaveChanges
        }
    }
}