using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TabibPlus.Core.Entities;
using TabibPlus.Infrastructure.Data;
using TabibPlus.Application.Auth.RegisterPatient;
using TabibPlus.Application.Auth.RegisterProfessionnel;
namespace TabibPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TabibPlusDbContext _db;
        private readonly IConfiguration _config;
        private readonly RegisterPatientHandler _registerPatientHandler;
        private readonly RegisterProfessionnelHandler _registerProfessionnelHandler;
        public AuthController(
            TabibPlusDbContext db,
            IConfiguration config,
            RegisterPatientHandler registerPatientHandler,RegisterProfessionnelHandler registerProfessionnelHandler)
        {
            _db = db;
            _config = config;
            _registerPatientHandler = registerPatientHandler;
            _registerProfessionnelHandler = registerProfessionnelHandler;
        }

        // ── POST /api/auth/login ──────────────────────────────────────────
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users
                .Include(u => u.Praticien)
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Actif);

            if (user == null)
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });

            bool valide = BCrypt.Net.BCrypt.Verify(dto.MotDePasse, user.PasswordHash);
            if (!valide)
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });

            user.DerniereConnexion = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            var token = GenererToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.Role,
                    praticienId = user.Praticien?.Id,
                    nom = user.Praticien != null
                        ? $"Dr. {user.Praticien.Prenom} {user.Praticien.Nom}"
                        : user.Email
                }
            });
        }

        // ── POST /api/auth/register (ancien, à garder pour l'instant) ──────
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Cet email est déjà utilisé" });

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse),
                Role = dto.Role ?? "Secretaire"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Compte créé avec succès", userId = user.Id });
        }

        // ── POST /api/auth/register/patient (nouveau, pattern Handler) ─────
        [HttpPost("register/patient")]
        public async Task<IActionResult> RegisterPatient(
            [FromBody] RegisterPatientCommand cmd)
        {
            try
            {
                var userId = await _registerPatientHandler.Handle(cmd);
                return Ok(new { message = "Compte patient créé avec succès", userId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
        // ── POST /api/auth/register/professionnel ─────────────────────────
        [HttpPost("register/professionnel")]
        public async Task<IActionResult> RegisterProfessionnel(
            [FromBody] RegisterProfessionnelCommand cmd)
        {
            try
            {
                var praticienId = await _registerProfessionnelHandler.Handle(cmd);
                return Ok(new { message = "Compte professionnel créé avec succès", praticienId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
        // ── Génération JWT ────────────────────────────────────────────────
        private string GenererToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("praticienId", user.Praticien?.Id.ToString() ?? "")
            };

            var expiration = int.Parse(_config["Jwt:ExpirationHours"] ?? "8");
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiration),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // ── DTOs ──────────────────────────────────────────────────────────────
    public record LoginDto(string Email, string MotDePasse);
    public record RegisterDto(string Email, string MotDePasse, string? Role);
}