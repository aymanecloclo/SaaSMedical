using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace TabibPlus.API.Controllers
{
	[ApiController]
	[Route("api/upload")]
	public class UploadController : ControllerBase
	{
		private readonly IWebHostEnvironment _env;

		// Extensions et taille autorisées — sécurité de base
		private static readonly string[] ExtensionsAutorisees =
			{ ".jpg", ".jpeg", ".png", ".webp" };
		private const long TailleMaxOctets = 5 * 1024 * 1024; // 5 Mo

		public UploadController(IWebHostEnvironment env)
		{
			_env = env;
		}

		// ── POST /api/upload/image ──
		[HttpPost("image")]
		public async Task<IActionResult> UploadImage(IFormFile fichier)
		{
			if (fichier == null || fichier.Length == 0)
				return BadRequest(new { message = "Aucun fichier reçu" });

			if (fichier.Length > TailleMaxOctets)
				return BadRequest(new { message = "Fichier trop volumineux (5 Mo max)" });

			var extension = Path.GetExtension(fichier.FileName).ToLowerInvariant();
			if (!ExtensionsAutorisees.Contains(extension))
				return BadRequest(new { message = "Format non autorisé (jpg, png, webp uniquement)" });

			// Nom de fichier unique pour éviter les collisions
			var nomFichier = $"{Guid.NewGuid()}{extension}";

			// wwwroot/uploads/ — créé automatiquement s'il n'existe pas
			var dossierUploads = Path.Combine(_env.WebRootPath, "uploads");
			Directory.CreateDirectory(dossierUploads);

			var cheminComplet = Path.Combine(dossierUploads, nomFichier);

			using (var stream = new FileStream(cheminComplet, FileMode.Create))
			{
				await fichier.CopyToAsync(stream);
			}

			// URL relative — le frontend la préfixera si besoin
			var url = $"/uploads/{nomFichier}";

			return Ok(new { url });
		}
	}
}