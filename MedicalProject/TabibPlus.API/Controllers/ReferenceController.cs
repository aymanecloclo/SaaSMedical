using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TabibPlus.Application.Reference.GetSpecialites;
using TabibPlus.Application.Reference.GetVilles;

namespace TabibPlus.API.Controllers
{
    [ApiController]
    [Route("api/public")]
    public class ReferenceController : ControllerBase
    {
        private readonly GetSpecialitesHandler _specialitesHandler;
        private readonly GetVillesHandler _villesHandler;

        public ReferenceController(
            GetSpecialitesHandler specialitesHandler,
            GetVillesHandler villesHandler)
        {
            _specialitesHandler = specialitesHandler;
            _villesHandler = villesHandler;
        }

        // ── GET /api/public/specialites ──
        [HttpGet("specialites")]
        public async Task<IActionResult> GetSpecialites()
            => Ok(await _specialitesHandler.Handle());

        // ── GET /api/public/villes ──
        [HttpGet("villes")]
        public async Task<IActionResult> GetVilles()
            => Ok(await _villesHandler.Handle());
    }
}