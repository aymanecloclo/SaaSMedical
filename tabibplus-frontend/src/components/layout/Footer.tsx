import { Link } from "react-router-dom";
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg">
                <Stethoscope size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  TabibPlus
                </h2>
                <p className="text-sm text-slate-400">
                  Plateforme médicale
                </p>
              </div>
            </Link>

            <p className="mt-5 leading-7 text-slate-400">
              Gérez facilement vos rendez-vous médicaux,
              consultez vos médecins et profitez d'une
              plateforme moderne, rapide et sécurisée.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Navigation
            </h3>

            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition">
                  Accueil
                </Link>
              </li>

              <li>
                <Link
                  to="/doctors"
                  className="hover:text-cyan-400 transition"
                >
                  Médecins
                </Link>
              </li>

              <li>
                <Link
                  to="/appointments"
                  className="hover:text-cyan-400 transition"
                >
                  Rendez-vous
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-cyan-400 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Services
            </h3>

            <ul className="space-y-3">
              <li>✔ Consultation en ligne</li>
              <li>✔ Gestion des patients</li>
              <li>✔ Dossier médical</li>
              <li>✔ Prise de rendez-vous</li>
              <li>✔ Support 24/7</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <MapPin
                  className="text-cyan-400"
                  size={18}
                />
                <span>Rabat, Maroc</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="text-cyan-400"
                  size={18}
                />
                <span>+212 6 00 00 00 00</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className="text-cyan-400"
                  size={18}
                />
                <span>contact@tabibplus.ma</span>
              </div>

              {/* Réseaux */}
              <div className="mt-6 flex gap-3">
                <a
                  href="#"
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  Facebook
                </a>

                <a
                  href="#"
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  LinkedIn
                </a>

                <a
                  href="#"
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="my-10 h-px bg-slate-800" />

        {/* Bas du footer */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">
              TabibPlus
            </span>{" "}
            - Tous droits réservés.
          </p>

          <div className="flex gap-6 text-sm">
            <Link
              to="/privacy"
              className="hover:text-cyan-400 transition"
            >
              Confidentialité
            </Link>

            <Link
              to="/terms"
              className="hover:text-cyan-400 transition"
            >
              Conditions
            </Link>

            <Link
              to="/faq"
              className="hover:text-cyan-400 transition"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}