using Microsoft.AspNetCore.Mvc;
using TabibPlus.Application.Praticiens.GetPraticienById;
using TabibPlus.Application.Praticiens.SearchPraticiens;

namespace TabibPlus.API.Controllers
{
    [ApiController]
    [Route("api/public/praticiens")]
    public class PraticiensPublicController : ControllerBase
    {
        private readonly SearchPraticiensHandler _searchHandler;
        private readonly GetPraticienByIdHandler _getByIdHandler;

        public PraticiensPublicController(
            SearchPraticiensHandler searchHandler,
            GetPraticienByIdHandler getByIdHandler)
        {
            _searchHandler = searchHandler;
            _getByIdHandler = getByIdHandler;
        }

        // ── GET /api/public/praticiens?specialite=...&ville=...
        // Page d'accueil — recherche publique sans JWT
        [HttpGet]
        public async Task<IActionResult> Search(
      [FromQuery] string? specialite,
      [FromQuery] string? ville,
      [FromQuery] string? secteur,
      [FromQuery] bool? teleconsult,
      [FromQuery] bool? disponibleAujourdhui,
      [FromQuery] string? langue,
      [FromQuery] string? motCle,
      [FromQuery] int page = 1,
      [FromQuery] int taille = 20)
        {
            var query = new SearchPraticiensQuery(
                specialite,
                ville,
                secteur,
                teleconsult,
                disponibleAujourdhui,
                langue,
                motCle,
                page,
                taille
            );

            var result = await _searchHandler.Handle(query);
            return Ok(result);
        }

        // ── GET /api/public/praticiens/{id}
        // Profil public d'un praticien
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _getByIdHandler
                .Handle(new GetPraticienByIdQuery(id));

            if (result == null)
                return NotFound(new
                {
                    message = "Praticien introuvable"
                });

            return Ok(result);
        }
    }
}