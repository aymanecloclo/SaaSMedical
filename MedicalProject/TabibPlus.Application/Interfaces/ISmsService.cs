using System.Threading.Tasks;

namespace TabibPlus.Application.Interfaces
{
	public interface ISmsService
	{
		Task SendAsync(string telephone, string message);
	}
}