using System.Collections.Generic;
using System.Threading.Tasks;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Interfaces
{
	public interface ISpecialiteRepository
	{
		Task<IEnumerable<Specialite>> GetAllAsync();
	}
}