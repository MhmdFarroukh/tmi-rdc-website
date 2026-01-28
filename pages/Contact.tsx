import React, { useMemo, useState } from "react";
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, ExternalLink } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";

const PHONE_DISPLAY = "+243 828 391 457";
const PHONE_E164 = "+243828391457";
const EMAIL = "info@tmi-rdc.com";

// ✅ Put the exact address you want to show (text)
const ADDRESS_LABEL = "Lubumbashi, RDC — Av. de l'Industrie";

// ✅ Put the map query you want Google Maps to open
const MAP_QUERY = "Lubumbashi, Av. de l'Industrie, RDC";

const WA_NUMBER = PHONE_E164.replace("+", ""); // "243828391457"

export const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMap, setShowMap] = useState(false);

  const isValid = message.trim().length >= 10;

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(
      `Demande de devis — ${name || "Client"}${company ? ` (${company})` : ""}`
    );

    const body = encodeURIComponent(
      `Nom: ${name || "-"}\nEntreprise: ${company || "-"}\nEmail: ${email || "-"}\n\nMessage:\n${message || "-"}\n`
    );

    return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }, [name, company, email, message]);

  const mapsUrl = useMemo(() => {
    return `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}`;
  }, []);

  return (
    <div className="pt-28 md:pt-32 min-h-screen bg-forge-dark text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* ✅ Local fast hero (you already saved it here) */}
        <div className="absolute inset-0 opacity-30">
          <img
            src="/images/immersion/hero.avif"
            alt="Contact TMI"
            className="w-full h-full object-cover grayscale"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 bg-black/65" />

        <div className="container mx-auto px-6 py-16 md:py-24 relative">
          <Reveal effect="mask">
            <h1 className="text-[12vw] md:text-[7vw] font-display font-bold uppercase leading-[0.85] tracking-tighter">
              Contact
            </h1>
          </Reveal>

          <p className="mt-6 text-white/70 max-w-2xl text-base md:text-lg">
            Dites-nous ce que vous construisez. Nous revenons vers vous rapidement avec une proposition claire.
          </p>

          {/* Quick actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={`tel:${PHONE_E164}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              <Phone size={18} />
              Appeler
            </a>

            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-safety-orange text-black font-bold uppercase tracking-widest text-sm hover:brightness-110 transition"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              <Mail size={18} />
              Email
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left */}
          <div className="space-y-8">
            <Reveal effect="fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="text-safety-orange" />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Téléphone</h3>
                  </div>
                  <a href={`tel:${PHONE_E164}`} className="text-xl font-semibold hover:text-white/90 transition">
                    {PHONE_DISPLAY}
                  </a>
                  <p className="mt-2 text-white/60 text-sm">Appel direct pour devis & suivi.</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="text-safety-orange" />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Email</h3>
                  </div>
                  <a href={`mailto:${EMAIL}`} className="text-xl font-semibold hover:text-white/90 transition">
                    {EMAIL}
                  </a>
                  <p className="mt-2 text-white/60 text-sm">Plans, cahiers de charges, pièces jointes.</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="text-safety-orange" />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Adresse</h3>
                  </div>

                  <p className="text-white/80 leading-relaxed">{ADDRESS_LABEL}</p>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition text-sm"
                    >
                      <ExternalLink size={16} />
                      Ouvrir Google Maps
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowMap((v) => !v)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition text-sm"
                    >
                      {showMap ? "Masquer la carte" : "Afficher la carte"}
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-safety-orange" />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Horaires</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-white/75 text-sm">
                    <span>Lun – Ven</span><span className="text-right">08:00 – 17:15</span>
                    <span>Sam</span><span className="text-right">08:00 – 14:30</span>
                    <span>Dim</span><span className="text-right">Fermé</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right */}
          <div className="space-y-8">
            <Reveal effect="fade-up">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-2xl md:text-3xl font-display font-bold uppercase">
                  Demander un devis
                </h2>
                <p className="mt-2 text-white/60">
                  Remplissez le formulaire — il ouvrira un email pré-rempli (pas besoin de backend).
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-safety-orange transition"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-safety-orange transition"
                    placeholder="Entreprise"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <input
                    className="md:col-span-2 w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-safety-orange transition"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputMode="email"
                  />
                  <textarea
                    className="md:col-span-2 w-full min-h-[140px] bg-black/40 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-safety-orange transition resize-none"
                    placeholder="Votre message (minimum 10 caractères)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <a
                    href={isValid ? mailtoHref : undefined}
                    onClick={(e) => {
                      if (!isValid) e.preventDefault();
                    }}
                    className={[
                      "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition",
                      isValid
                        ? "bg-safety-orange text-black hover:brightness-110"
                        : "bg-white/10 text-white/40 border border-white/10 cursor-not-allowed",
                    ].join(" ")}
                    aria-disabled={!isValid}
                  >
                    <Send size={18} />
                    Envoyer
                  </a>

                  <a
                    href={`https://wa.me/${WA_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition"
                  >
                    <MessageCircle size={18} />
                    Envoyer sur WhatsApp
                  </a>
                </div>

                {!isValid && (
                  <p className="mt-3 text-xs text-white/50">
                    Ajoutez un message (au moins 10 caractères) pour activer “Envoyer”.
                  </p>
                )}
              </div>
            </Reveal>

            {/* ✅ Lazy map only when user asks for it */}
            {showMap && (
              <Reveal effect="fade-up">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <div className="aspect-video">
                    <iframe
                      title="TMI map"
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                    />
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
