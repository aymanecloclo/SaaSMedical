using System;
using System.Collections.Generic;

namespace TabibPlus.Core.Entities
{
    // ─────────────────────────────────────────────
    // RENDEZ-VOUS
    // ─────────────────────────────────────────────
    public class RendezVous
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int PraticienId { get; set; }
        public int CabinetId { get; set; }
        public DateTime DateHeure { get; set; }
        public int DureeMinutes { get; set; } = 30;
        public string Motif { get; set; } = string.Empty;
        public string Statut { get; set; } = "Confirme";
        // Confirme | Arrive | EnConsultation | Termine | Absent | Reporte | Annule

        // Source de la réservation
        public string Source { get; set; } = "EnLigne";
        // EnLigne | Telephone | Cabinet

        // Téléconsultation
        public bool EstTeleconsultation { get; set; } = false;
        public string? LienVideo { get; set; }

        // Compte-rendu médecin
        public string? NotesConsultation { get; set; }
        public string? Diagnostic { get; set; }
        public string? Ordonnance { get; set; }

        // Facturation
        public decimal? MontantHonoraires { get; set; }
        public string? StatutPaiement { get; set; }
        // Paye | EnAttente | CNOPS | CNSS | Gratuit

        // Avis
        public bool AvisLaisse { get; set; } = false;

        // Système
        public DateTime CreeLe { get; set; } = DateTime.UtcNow;
        public DateTime? ModifieLe { get; set; }

        // Navigation
        public Patient Patient { get; set; } = null!;
        public Praticien Praticien { get; set; } = null!;
        public Cabinet Cabinet { get; set; } = null!;
        public ICollection<Rappel> Rappels { get; set; } = new List<Rappel>();
        public Avis? Avis { get; set; }
    }

    // ─────────────────────────────────────────────
    // RAPPEL SMS / EMAIL
    // ─────────────────────────────────────────────
    public class Rappel
    {
        public int Id { get; set; }
        public int RendezVousId { get; set; }
        public string Canal { get; set; } = "Email";
        // SMS | Email
        public DateTime DatePrevue { get; set; }
        public bool Envoye { get; set; } = false;
        public DateTime? EnvoyeLe { get; set; }
        public string? Erreur { get; set; }

        // Navigation
        public RendezVous RendezVous { get; set; } = null!;
    }

    // ─────────────────────────────────────────────
    // AVIS PATIENT — lié à un vrai RDV pour éviter les faux avis
    // ─────────────────────────────────────────────
    public class Avis
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int PraticienId { get; set; }
        public int RendezVousId { get; set; }
        // Lié au RDV — seul un patient ayant consulté peut noter
        public int Note { get; set; }
        // 1 à 5
        public string? Commentaire { get; set; }
        public DateTime DateAvis { get; set; } = DateTime.UtcNow;
        public bool Visible { get; set; } = false;
        // Modéré par admin avant publication

        // Navigation
        public Patient Patient { get; set; } = null!;
        public Praticien Praticien { get; set; } = null!;
        public RendezVous RendezVous { get; set; } = null!;
    }

    // ─────────────────────────────────────────────
    // AUDIT LOG — conformité CNDP obligatoire
    // ─────────────────────────────────────────────
    public class AuditLog
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Entite { get; set; } = string.Empty;
        public string Operation { get; set; } = string.Empty;
        // Lecture | Creation | Modification | Suppression
        public string? EntiteId { get; set; }
        public string? Details { get; set; }
        public string? AdresseIp { get; set; }
        public DateTime DateHeure { get; set; } = DateTime.UtcNow;
    }

    // ─────────────────────────────────────────────
    // SPECIALITE — liste officielle Maroc
    // ─────────────────────────────────────────────
    public class Specialite
    {
        public int Id { get; set; }
        public string NomFr { get; set; } = string.Empty;
        public string NomAr { get; set; } = string.Empty;
        public string? Icone { get; set; }
        public string Categorie { get; set; } = "Médecine";
        // Médecine | Dentaire | Paramédical | Mental

        // Navigation
        public ICollection<Praticien> Praticiens { get; set; } = new List<Praticien>();
    }

    // ─────────────────────────────────────────────
    // VILLE — 47 villes du Maroc
    // ─────────────────────────────────────────────
    public class Ville
    {
        public int Id { get; set; }
        public string NomFr { get; set; } = string.Empty;
        public string NomAr { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // Navigation
        public ICollection<Praticien> Praticiens { get; set; } = new List<Praticien>();
        public ICollection<Cabinet> Cabinets { get; set; } = new List<Cabinet>();
    }

    // ─────────────────────────────────────────────
    // MESSAGE — messagerie sécurisée chiffrée
    // ─────────────────────────────────────────────
    public class Message
    {
        public int Id { get; set; }
        public int ExpediteurId { get; set; }
        // FK → User
        public int DestinataireId { get; set; }
        // FK → User
        public string Contenu { get; set; } = string.Empty;
        // Chiffré AES-256
        public string? PieceJointeUrl { get; set; }
        // Ordonnance, résultat examen
        public bool Lu { get; set; } = false;
        public DateTime DateEnvoi { get; set; } = DateTime.UtcNow;
    }
}