using System.Threading.Tasks;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Interfaces
{
    public interface IUserRepository
    {
        // Vérifier si un email est déjà pris (avant de créer un compte)
        Task<bool> EmailExisteAsync(string email);

        // Récupérer un user par email (utile pour le login plus tard)
        Task<User?> GetByEmailAsync(string email);

        // Ajouter un nouveau user, retourne l'Id généré
        Task<int> AddAsync(User user);
    }
}