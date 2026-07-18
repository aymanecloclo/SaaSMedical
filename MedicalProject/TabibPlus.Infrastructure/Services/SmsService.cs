using System;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Infrastructure.Services
{
    // Pour l'instant on simule l'envoi SMS
    // Plus tard on branchera Twilio ici
    public class SmsService : ISmsService
    {
        public async Task SendAsync(
            string telephone, string message)
        {
            // TODO : brancher Twilio
            Console.WriteLine(
                $"SMS → {telephone} : {message}");
            await Task.CompletedTask;
        }
    }
}