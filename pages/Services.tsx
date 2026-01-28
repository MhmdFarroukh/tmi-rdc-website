import React, { useEffect, useMemo, useState } from "react";
import { Reveal } from "../components/ui/Reveal";
import { ParallaxImage } from "../components/ui/ParallaxImage";
import { LightboxPortal } from "../components/ui/LightboxPortal";
import { SmartImage } from "../components/ui/SmartImage";

// Proper URL encoding for image paths with spaces and special characters
const withBase = (p: string) => {
  const base = import.meta.env.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = p.startsWith("/") ? p.slice(1) : p;
  
  // Use encodeURI to handle spaces and special characters
  return encodeURI(`${cleanBase}${cleanPath}`);
};

type Service = {
  id: string;
  title: string;
  content: string;
  bullets: string[];
  img: string;
  gallery: { src: string; alt?: string }[];
};

export const ServicesPage: React.FC = () => {
  const IMG = useMemo(
    () => ({
      hangar: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.02.21 PM.jpeg"),
      depot: withBase("images/immersion/construction.webp"),
      charpente: withBase("images/immersion/charpente.webp"),

      citerne1: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.54 PM.jpeg"),
      citerne2: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.43 PM.jpeg"),
      citerne3: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.33 PM.jpeg"),

      remorque1: withBase("images/immersion/remorque.webp"),
      remorque2: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.33 PM.jpeg"),

      maintenance1: withBase("images/immersion/img2.webp"),
      maintenance2: withBase("images/immersion/img3.webp"),
      qualite: withBase("images/immersion/qualite.webp"),

      atelier1: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.12 PM.jpeg"),
      atelier2: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.20 PM.jpeg"),
      atelier3: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.02.00 PM.jpeg"),

      menuiserie: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.00.58 PM.jpeg"),
    }),
    []
  );

  const SERVICES_FULL: Service[] = useMemo(
    () => [
      {
        id: "hangars-depots",
        title: "Hangar & Dépôt — Charpente Métallique",
        content:
          "Conception, fabrication et montage de charpentes métalliques pour hangars, dépôts et bâtiments industriels. Nous optimisons la structure selon l’usage, les portées, la ventilation et les contraintes du chantier.",
        bullets: ["Étude, conception & fabrication", "Montage sur site & alignement", "Couverture & bardage (selon projet)", "Renforts & extensions de structures"],
        img: IMG.hangar,
        gallery: [{ src: IMG.hangar }, { src: IMG.depot }, { src: IMG.charpente }, { src: IMG.atelier1 }],
      },
      {
        id: "citernes",
        title: "Citernes — Verticales / Horizontales & Carburants",
        content:
          "Fabrication de citernes et réservoirs (eau, carburant, stockage technique) en versions verticales ou horizontales. Assemblage, contrôle, finitions et préparation à l’installation.",
        bullets: ["Citerne verticale & horizontale", "Citerne carburants (selon besoin)", "Renforts, piquages, supports & accessoires", "Finitions & préparation logistique"],
        img: IMG.citerne1,
        gallery: [{ src: IMG.citerne1 }, { src: IMG.citerne2 }, { src: IMG.citerne3 }, { src: IMG.atelier2 }],
      },
      {
        id: "remorques",
        title: "Remorque Plateau & Remorque Citerne",
        content:
          "Conception et fabrication de remorques adaptées aux besoins industriels : remorque plateau, remorque citerne et structures mobiles. Focus sur rigidité, renforts et fiabilité.",
        bullets: ["Remorque plateau (structure & renforts)", "Remorque citerne (selon projet)", "Assemblage & finition", "Contrôle qualité (alignement / points critiques)"],
        img: IMG.remorque1,
        gallery: [{ src: IMG.remorque1 }, { src: IMG.remorque2 }, { src: IMG.atelier3 }, { src: IMG.maintenance1 }],
      },
      {
        id: "chaudronnerie",
        title: "Chaudronnerie & Réservoirs",
        content:
          "Travaux de chaudronnerie pour pièces métalliques sur-mesure : réservoirs, éléments assemblés, supports, renforts et structures techniques. Une fabrication précise, adaptée aux contraintes de terrain.",
        bullets: ["Fabrication sur-mesure", "Assemblage & soudure", "Renforts, supports & structures techniques", "Préparation à la pose / installation"],
        img: IMG.qualite,
        gallery: [{ src: IMG.qualite }, { src: IMG.maintenance2 }, { src: IMG.atelier1 }, { src: IMG.citerne2 }],
      },
      {
        id: "menuiserie-metallique",
        title: "Menuiserie Métallique",
        content:
          "Conception et fabrication d’éléments de menuiserie métallique : portes, cadres, protections, supports et pièces de finition. Solutions robustes, adaptées à l’environnement industriel.",
        bullets: ["Portes & cadres métalliques", "Protections & supports", "Pièces de finition", "Fabrication sur mesure"],
        img: IMG.menuiserie,
        gallery: [{ src: IMG.menuiserie }, { src: IMG.atelier2 }, { src: IMG.hangar }, { src: IMG.maintenance1 }],
      },
      {
        id: "maintenance",
        title: "Maintenance & Soudure",
        content:
          "Interventions et réparations : renforcement, reprise de soudure, remise en état de pièces et ajustements sur site. Un service orienté continuité d’exploitation et sécurité.",
        bullets: ["Réparations & reprises", "Renforts sur structures", "Interventions sur site", "Contrôle & finitions"],
        img: IMG.maintenance1,
        gallery: [{ src: IMG.maintenance1 }, { src: IMG.maintenance2 }, { src: IMG.qualite }, { src: IMG.atelier3 }],
      },
    ],
    [IMG]
  );

  const [activeId, setActiveId] = useState(SERVICES_FULL[0].id);

  const [lb, setLb] = useState<{ open: boolean; src: string | null; list: string[]; idx: number }>({
    open: false,
    src: null,
    list: [],
    idx: 0,
  });

  const openLightbox = (list: string[], idx: number) => {
    setLb({ open: true, src: list[idx] ?? null, list, idx });
  };
  const closeLightbox = () => setLb((s) => ({ ...s, open: false, src: null }));
  const prev = () =>
    setLb((s) => {
      if (!s.list.length) return s;
      const n = (s.idx - 1 + s.list.length) % s.list.length;
      return { ...s, idx: n, src: s.list[n] };
    });
  const next = () =>
    setLb((s) => {
      if (!s.list.length) return s;
      const n = (s.idx + 1) % s.list.length;
      return { ...s, idx: n, src: s.list[n] };
    });

  useEffect(() => {
    const handleScroll = () => {
      const sections = SERVICES_FULL.map((s) => document.getElementById(s.id));
      const scrollPos = window.scrollY + 300;
      sections.forEach((sec) => {
        if (!sec) return;
        if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
          setActiveId(sec.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [SERVICES_FULL]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pt-32 min-h-screen pb-24 bg-forge-dark">
      <div className="container mx-auto px-6">
        <Reveal effect="mask">
          <h1 className="text-[10vw] font-display font-bold text-white uppercase leading-none mb-24 tracking-tighter">
            Nos <span className="text-safety-orange">Prestations</span>
          </h1>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-24">
          {/* LEFT INDEX */}
          <div className="hidden lg:block w-1/4">
            <div className="sticky top-32">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-8 block">
                INDEX
              </span>
              <ul className="space-y-6">
                {SERVICES_FULL.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollTo(s.id)}
                      className={`text-sm uppercase font-bold tracking-widest transition-all duration-300 text-left hover:pl-2 ${
                        activeId === s.id
                          ? "text-white pl-2 border-l-2 border-safety-orange"
                          : "text-gray-600 hover:text-white"
                      }`}
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:w-3/4 space-y-48">
            {SERVICES_FULL.map((service, idx) => {
              const galleryList = service.gallery.map((g) => g.src);

              return (
                <div key={service.id} id={service.id} className="scroll-mt-32">
                  <div className="mb-12 relative">
                    <span className="absolute -top-12 -left-4 text-[120px] font-display font-bold text-white/5 z-0 select-none">
                      0{idx + 1}
                    </span>
                    <div className="relative z-10">
                      <Reveal effect="mask">
                        <h2 className="text-5xl md:text-6xl font-display font-bold text-white uppercase mb-8">
                          {service.title}
                        </h2>
                      </Reveal>
                    </div>
                  </div>

                  {/* BIG IMAGE */}
                  <Reveal effect="fade-up">
                    <ParallaxImage
                      src={service.img}
                      alt={service.title}
                      className="w-full aspect-video mb-12 grayscale"
                    />
                  </Reveal>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <Reveal effect="fade-up" delay={0.2}>
                      <p className="text-xl text-gray-300 leading-relaxed font-light">{service.content}</p>
                    </Reveal>

                    <Reveal effect="fade-up" delay={0.3}>
                      <ul className="space-y-4 border-t border-forge-border pt-4">
                        {service.bullets.map((b, i) => (
                          <li key={i} className="flex items-center justify-between text-sm text-gray-400 font-mono">
                            <span>{b}</span>
                            <div className="w-2 h-2 bg-forge-border" />
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>

                  {/* MINI GALLERY (optimized) */}
                  <div className="mt-12">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-bold uppercase tracking-widest text-xs">Galerie</h4>
                      <div className="h-px flex-1 bg-white/10 ml-4" />
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {service.gallery.map((img, i) => (
                        <button
                          key={`${img.src}-${i}`}
                          onClick={() => openLightbox(galleryList, i)}
                          className="relative min-w-[240px] h-[150px] overflow-hidden border border-white/10 bg-black group"
                          type="button"
                        >
                          <div className="w-full h-full">
                            <SmartImage
                              src={img.src}
                              alt={img.alt ?? "Image"}
                              responsiveSizes={true}
                              forGrid={true}
                              className="w-full h-full object-cover grayscale opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                              decoding="async"
                              onError={(e) => {
                                console.error("[Services Gallery] Image failed to load:", {
                                  src: img.src,
                                  error: (e.currentTarget as HTMLImageElement).naturalWidth === 0 ? "404" : "Load error",
                                });
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <LightboxPortal
        open={lb.open}
        src={lb.src}
        onClose={closeLightbox}
        onPrev={lb.list.length > 1 ? prev : undefined}
        onNext={lb.list.length > 1 ? next : undefined}
      />
    </div>
  );
};

export default ServicesPage;