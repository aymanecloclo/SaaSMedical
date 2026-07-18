using System;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Infrastructure.Services
{
    // Pour l'instant on simule l'envoi email
    // Plus tard on branchera SendGrid ici
    public class EmailService : IEmailService
    {
        public async Task SendAsync(
            string email, string sujet, string contenu)
        {
            // TODO : brancher SendGrid
            Console.WriteLine(
                $"Email → {email} | {sujet}");
            await Task.CompletedTask;
        }
    }
}