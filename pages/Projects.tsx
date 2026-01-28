import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { SmartImage } from "../components/ui/SmartImage";

const withBase = (p: string) => {
  const base = import.meta.env.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = p.startsWith("/") ? p.slice(1) : p;
  return `${cleanBase}${cleanPath}`;
};

type Category =
  | "TOUT"
  | "CONSTRUCTION"
  | "CITERNES"
  | "REMORQUES"
  | "MAINTENANCE"
  | "MENUISERIE";

type ProjectCardItem = {
  title: string;
  subtitle: string;
  tag: string;
  category: Category;

  /**
   * Put ANY of these:
   * - "WhatsApp Image ...jpeg" (best)
   * - "images/immersion/WhatsApp Image ...jpeg"
   * - "/images/immersion/remorque.webp"
   */
  img: string;

  slug?: string;
  href?: string;
};

const FILTERS: { id: Category; label: string }[] = [
  { id: "TOUT", label: "Tout" },
  { id: "CONSTRUCTION", label: "Construction" },
  { id: "CITERNES", label: "Citernes" },
  { id: "REMORQUES", label: "Remorques" },
  { id: "MAINTENANCE", label: "Maintenance" },
  { id: "MENUISERIE", label: "Menuiserie" },
];

const PROJECTS: ProjectCardItem[] = [
  {
    title: "Dépôts & Hangars Métalliques",
    subtitle: "Charpente, montage & finitions",
    tag: "CONSTRUCTION",
    category: "CONSTRUCTION",
    img: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.02.21 PM.jpeg"),
    slug: "construction-metallique-hangar",
  },
  {
    title: "Citernes (Eau & Carburant)",
    subtitle: "Fabrication & installation",
    tag: "CITERNES",
    category: "CITERNES",
    img: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.54 PM.jpeg"),
    slug: "citernes-eau-carburant",
  },
  {
    title: "Remorques & Structures Mobiles",
    subtitle: "Assemblage, renforts & finitions",
    tag: "REMORQUES",
    category: "REMORQUES",
    img: withBase("images/immersion/remorque.png"),
    slug: "remorque-plateau",
  },
  {
    title: "Maintenance & Soudure",
    subtitle: "Interventions & réparations",
    tag: "MAINTENANCE",
    category: "MAINTENANCE",
    img: withBase("images/immersion/img2.png"),
    slug: "maintenance-soudure",
  },
  {
    title: "Voir toutes nos réalisations",
    subtitle: "Galerie complète par catégories",
    tag: "RÉALISATIONS",
    category: "TOUT",
    img: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.00.58 PM.jpeg"),
    href: "/realisations",
  },
];

const ProjectCard: React.FC<{ p: ProjectCardItem }> = ({ p }) => {
  const to = p.slug ? `/projets/${p.slug}` : p.href;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden bg-black aspect-[4/3] border border-white/10"
    >
      <div className="absolute inset-0">
        <SmartImage
          src={p.img}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-85 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] bg-white text-black px-2 py-1 rounded-sm">
          {p.tag}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <h3 className="text-white font-display font-bold uppercase text-2xl md:text-3xl leading-tight">
          {p.title}
        </h3>
        <p className="mt-2 text-white/70 text-sm font-mono uppercase tracking-wide">
          {p.subtitle}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="h-px w-16 bg-white/30 group-hover:bg-safety-orange transition-colors" />

          {to ? (
            <Link
              to={to}
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center
                         group-hover:border-safety-orange group-hover:bg-safety-orange transition-all"
              aria-label="Open project"
            >
              <ArrowUpRight className="text-white" size={18} />
            </Link>
          ) : (
            <div className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center">
              <ArrowUpRight className="text-white" size={18} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsPage: React.FC = () => {
  const [active, setActive] = useState<Category>("TOUT");

  const visible = useMemo(() => {
    if (active === "TOUT") return PROJECTS;
    return PROJECTS.filter((p) => p.category === active);
  }, [active]);

  return (
    <div className="pt-32 min-h-screen pb-24 bg-forge-dark">
      <div className="container mx-auto px-6">
        <Reveal effect="mask">
          <h1 className="text-[10vw] font-display font-bold text-white uppercase leading-[0.85] tracking-tighter mb-10">
            Projets
          </h1>
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10">
          <p className="text-white/60 max-w-2xl">
            Découvrez une sélection de réalisations TMI — construction métallique,
            citernes, remorques, maintenance & soudure.
          </p>

          <Link
            to="/realisations"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-safety-orange hover:text-white transition-colors duration-300 w-fit"
          >
            Voir toutes les réalisations
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 mb-14">
          {FILTERS.map((f) => {
            const on = f.id === active;
            return (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={[
                  "px-5 py-2 rounded-full text-xs uppercase tracking-widest font-mono transition-colors",
                  on ? "bg-safety-orange text-black" : "bg-white/10 text-white hover:bg-white/20",
                ].join(" ")}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {visible.map((p, idx) => (
            <ProjectCard key={`${p.title}-${idx}`} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
