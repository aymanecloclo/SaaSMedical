using System.Threading.Tasks;

namespace TabibPlus.Application.Interfaces
{
	public interface IEmailService
	{
		Task SendAsync(string email, string sujet, string contenu);
	}
}