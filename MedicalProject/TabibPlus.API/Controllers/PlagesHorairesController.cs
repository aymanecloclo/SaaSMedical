using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;

namespace TabibPlus.API.Controllers
{
    [ApiController]
    [Route("api/praticien/plages-horaires")]
    [Authorize(Policy = "Praticien")]
    public class PlagesHorairesController : ControllerBase
    {
        private readonly IPraticienRepository _praticienRepo;

        public PlagesHorairesController(IPraticienRepository praticienRepo)
            => _praticienRepo = praticienRepo;

        private int? GetPraticienIdDuToken()
        {
            var claim = User.FindFirst("praticienId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        // ── GET /api/praticien/plages-horaires ──
        [HttpGet]
        public async Task<IActionResult> GetMesPlagesHoraires()
        {
            var praticienId = GetPraticienIdDuToken();
            if (praticienId == null)
                return Forbid();

            var plages = await _praticienRepo.GetPlagesHorairesAsync(praticienId.Value);

            var result = plages.Select(p => new
            {
                p.Id,
                p.JourSemaine,
                HeureDebut = p.HeureDebut.ToString(@"hh\:mm"),
                HeureFin = p.HeureFin.ToString(@"hh\:mm"),
                p.Actif
            });

            return Ok(result);
        }

        public record PlageHoraireInput(int JourSemaine, string HeureDebut, string HeureFin, bool Actif);

        // ── PUT /api/praticien/plages-horaires ──
        // Remplace TOUTES les plages du praticien connecté par la nouvelle liste envoyée
        [HttpPut]
        public async Task<IActionResult> RemplacerPlagesHoraires([FromBody] List<PlageHoraireInput> plages)
        {
            var praticienId = GetPraticienIdDuToken();
            if (praticienId == null)
                return Forbid();

            var entites = plages.Select(p => new PlageHoraire
            {
                JourSemaine = p.JourSemaine,
                HeureDebut = TimeSpan.Parse(p.HeureDebut),
                HeureFin = TimeSpan.Parse(p.HeureFin),
                Actif = p.Actif
            });

            await _praticienRepo.RemplacerPlagesHorairesAsync(praticienId.Value, entites);

            return NoContent();
        }
    }
}
