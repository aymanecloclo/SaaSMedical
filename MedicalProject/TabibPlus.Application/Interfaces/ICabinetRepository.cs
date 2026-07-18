using System.Threading.Tasks;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Interfaces
{
    public interface ICabinetRepository
    {
        // Ajoute un cabinet et retourne l'Id généré
        // (nécessaire pour lier le Praticien au Cabinet)
        Task<int> AddAsync(Cabinet cabinet);
    }
}