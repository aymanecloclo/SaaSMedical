using System;
using System.Collections.Generic;

namespace TabibPlus.Core.Entities
{
    public class Patient
    {
        public int Id { get; set; }

        // Lien avec le compte User (si le patient s'est inscrit)
        public int? UserId { get; set; }

        // Infos personnelles
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public DateTime DateNaissance { get; set; }
        public string Telephone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Sexe { get; set; } = string.Empty;
        // M | F
        public string? Adresse { get; set; }

        // Infos médicales
        public string? GroupeSanguin { get; set; }
        // A+ | A- | B+ | B- | O+ | O- | AB+ | AB-
        public int? Taille { get; set; }
        // En cm
        public decimal? Poids { get; set; }
        // En kg
        public string? Allergies { get; set; }
        public string? Antecedents { get; set; }
        public string? Medicaments { get; set; }
        // Traitements en cours

        // Assurance
        public string? NumeroAssurance { get; set; }
        public string? TypeAssurance { get; set; }
        // CNOPS | CNSS | Aucune

        // Contact urgence
        public string? ContactUrgenceNom { get; set; }
        public string? ContactUrgenceTel { get; set; }

        // Conformité CNDP — obligatoire loi 09-08
        public bool ConsentementDonne { get; set; } = false;
        public DateTime? DateConsentement { get; set; }

        // Système
        public bool Actif { get; set; } = true;
        public DateTime CreeLe { get; set; } = DateTime.UtcNow;
        public DateTime? ModifieLe { get; set; }

        // Navigation
        public ICollection<RendezVous> RendezVous { get; set; } = new List<RendezVous>();
        public ICollection<Avis> Avis { get; set; } = new List<Avis>();
    }
}