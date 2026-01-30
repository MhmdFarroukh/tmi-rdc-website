import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Projets", path: "/projets" },
    { label: "Services", path: "/prestation-services" },
    { label: "Agence", path: "/politique" },
    { label: "Actualités", path: "/news" },
    { label: "Réalisations", path: "/realisations" },
  ];

  return (
    <div className="min-h-screen bg-forge-dark text-slate-200 font-sans selection:bg-safety-orange selection:text-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 py-6 mix-blend-difference text-white">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 z-50 group">
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-3xl tracking-tighter group-hover:text-safety-orange transition-colors">
                TMI
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-70">
                Techno Métal Industrie
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-bold uppercase tracking-widest hover:text-safety-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* ✅ Navigate to Contact page */}
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-safety-orange hover:text-white transition-colors duration-300"
            >
              Demander un devis
            </Link>

            <button
              type="button"
              className="md:hidden z-50"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-white text-black flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-5xl font-display font-bold uppercase hover:text-safety-orange transition-colors tracking-tighter"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* ✅ Navigate to Contact page */}
              <Link
                to="/contact"
                className="mt-8 px-10 py-4 rounded-full bg-black text-white text-sm font-bold uppercase tracking-widest inline-flex items-center justify-center"
              >
                Demander un devis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-20 w-full bg-forge-dark">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative bg-black text-white pt-24 md:pt-32 pb-12 z-10 border-t border-white/10">
        <div className="container mx-auto px-6">
          {/* Top CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-end mb-16 md:mb-20">
            <div>
              <h2 className="text-6xl md:text-8xl font-display font-bold uppercase leading-[0.85] tracking-tighter">
                Let&apos;s <br />
                <span className="text-transparent text-stroke-white">Build.</span>
              </h2>

              <p className="mt-6 text-base md:text-lg text-white/60 max-w-xl">
                Experts en construction métallique : charpente, chaudronnerie,
                tuyauterie & suivi de chantier.
              </p>
            </div>

            <div className="flex flex-col gap-6 lg:items-end">
              <a
                href="mailto:info@tmi-rdc.com"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-safety-orange text-black text-sm font-bold uppercase tracking-widest hover:brightness-110 transition"
              >
                Commencer un projet
              </a>

              <div className="flex flex-col gap-2 lg:text-right text-white/70">
                <a href="tel:+243828391457" className="text-lg font-semibold hover:text-white transition">
                  +243 828 391 457
                </a>
                <a href="tel:+243828391457" className="text-lg font-semibold hover:text-white transition">
                  +243 900 000 800
                </a>
                <a href="mailto:info@tmi-rdc.com" className="hover:text-white transition">
                  info@tmi-rdc.com
                </a>
                <a href="commercial@tmi-rdc.com" className="hover:text-white transition">
                  commercial@tmi-rdc.com
                </a>
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-white/10 pt-12">
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold uppercase tracking-widest text-sm">Adresse</span>
              <div className="text-white/70 leading-relaxed">
                <div>RDC</div>
                <div>Av. de l&apos;Industrie</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-white font-bold uppercase tracking-widest text-sm">Contact</span>
              <div className="text-white/70 leading-relaxed flex flex-col gap-2">
                <a href="tel:+243828391457" className="hover:text-white transition">
                  +243 828 391 457
                </a>
                <a href="tel:+243900000800" className="hover:text-white transition">
                  +243 900 000 800
                </a>
                <a href="mailto:info@tmi-rdc.com" className="hover:text-white transition">
                  info@tmi-rdc.com
                </a>
                <a href="mailto:commercial@tmi-rdc.com" className="hover:text-white transition">
                  commercial@tmi-rdc.com
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-white font-bold uppercase tracking-widest text-sm">Services</span>
              <div className="text-white/70 leading-relaxed flex flex-col gap-2">
                <Link to="/prestation-services" className="hover:text-white transition">
                  Charpente
                </Link>
                <Link to="/prestation-services" className="hover:text-white transition">
                  Chaudronnerie
                </Link>
                <Link to="/prestation-services" className="hover:text-white transition">
                  Tuyauterie
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <span className="text-white font-bold uppercase tracking-widest text-sm">Social</span>
              <div className="flex gap-3 lg:justify-end">
                {/* ✅ Don’t use href="#" */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition"
                  aria-label="Facebook"
                >
                  FB
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition"
                  aria-label="LinkedIn"
                >
                  LI
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition"
                  aria-label="Instagram"
                >
                  IG
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between text-white/50 text-sm">
            <span>© {new Date().getFullYear()} TMI-RDC. Tous droits réservés.</span>

            <div className="flex items-center gap-6">
              <Link to="/politique" className="hover:text-white transition">
                Politique
              </Link>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hover:text-white transition"
              >
                Retour en haut
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
