using System;
using System.Collections.Generic;

namespace TabibPlus.Core.Entities
{
    // ─────────────────────────────────────────────
    // USER
    // ─────────────────────────────────────────────
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Secretaire";
        // Admin | Praticien | Secretaire | Patient
        public string TypeCompte { get; set; } = "Patient";
        // "Patient" ou "Professionnel"
        public string? Telephone { get; set; }
        public string? PhotoUrl { get; set; }
        public string Langue { get; set; } = "FR";
        // FR | AR | EN
        public bool NotificationsEmail { get; set; } = true;
        public bool NotificationsSms { get; set; } = true;
        public bool Actif { get; set; } = true;
        public DateTime CreeLe { get; set; } = DateTime.UtcNow;
        public DateTime? DerniereConnexion { get; set; }

        // Navigation
        public Praticien? Praticien { get; set; }
    }

    // ─────────────────────────────────────────────
    // CABINET
    // ─────────────────────────────────────────────
    public class Cabinet
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Type { get; set; } = "Solo";
        // Solo | Groupe | Clinique
        public string Adresse { get; set; } = string.Empty;
        public int? VilleId { get; set; }
        public Ville? Ville { get; set; }
        public string Telephone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? SiteWeb { get; set; }
        public string? Description { get; set; }
        public string? HorairesJson { get; set; }
        public bool Parking { get; set; } = false;
        public bool AccesHandicap { get; set; } = false;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? NumeroConvention { get; set; }
        public string Abonnement { get; set; } = "Gratuit";
        // Gratuit | Basic | Premium
        public DateTime? AbonnementExpire { get; set; }
        public DateTime CreeLe { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Praticien> Praticiens { get; set; } = new List<Praticien>();
    }

    // ─────────────────────────────────────────────
    // PRATICIEN
    // ─────────────────────────────────────────────
    public class Praticien
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CabinetId { get; set; }
        public int? SpecialiteId { get; set; }
        public int? VilleId { get; set; }

        // Infos de base
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string? Inpe { get; set; }
        public int DureeRdvDefaut { get; set; } = 30;

        // Profil public — crucial pour les réservations
        public string? PhotoProfil { get; set; }
        public string? Bio { get; set; }
        public int AnneesExperience { get; set; } = 0;
        public string? Langues { get; set; } = "FR,AR";
        // "AR,FR,EN,Amazigh" — 3+ langues = x3.5 réservations
        public string? Diplomes { get; set; }
        public string? SiteWeb { get; set; }

        // Tarifs et convention
        public decimal Honoraires { get; set; } = 0;
        public string Secteur { get; set; } = "Libre";
        // CNOPS | CNSS | Libre | CNOPS_CNSS

        // Filtres importants
        public bool AccepteTeleconsult { get; set; } = false;
        public bool AccepteNouveauxPatients { get; set; } = true;

        // Avis — dénormalisé pour la performance
        public decimal NoteMoyenne { get; set; } = 0;
        public int NombreAvis { get; set; } = 0;

        // Géolocalisation
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        // Validation admin avant publication
        public bool ProfilValide { get; set; } = false;

        // Navigation
        public User User { get; set; } = null!;
        public Cabinet Cabinet { get; set; } = null!;
        public Specialite? Specialite { get; set; }
        public ICollection<RendezVous> RendezVous { get; set; } = new List<RendezVous>();
        public ICollection<PlageHoraire> PlagesHoraires { get; set; } = new List<PlageHoraire>();
        public ICollection<PhotoCabinet> Photos { get; set; } = new List<PhotoCabinet>();
        public ICollection<Avis> Avis { get; set; } = new List<Avis>();
    }

    // ─────────────────────────────────────────────
    // PLAGE HORAIRE
    // ─────────────────────────────────────────────
    public class PlageHoraire
    {
        public int Id { get; set; }
        public int PraticienId { get; set; }
        public int JourSemaine { get; set; }
        // 1=Lundi ... 6=Samedi
        public TimeSpan HeureDebut { get; set; }
        public TimeSpan HeureFin { get; set; }
        public bool Actif { get; set; } = true;

        // Navigation
        public Praticien Praticien { get; set; } = null!;
    }

    // ─────────────────────────────────────────────
    // PHOTO CABINET — +4 photos = x5.8 réservations
    // ─────────────────────────────────────────────
    public class PhotoCabinet
    {
        public int Id { get; set; }
        public int PraticienId { get; set; }
        public string Url { get; set; } = string.Empty;
        public int Ordre { get; set; } = 0;
        public string Type { get; set; } = "Cabinet";
        // Cabinet | Salle | Accueil | Portrait | Exterieur

        // Navigation
        public Praticien Praticien { get; set; } = null!;
    }
}