import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CASE_STUDIES } from "../data/caseStudies";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { LightboxPortal } from "../components/ui/LightboxPortal";
import { SmartImage } from "../components/ui/SmartImage";

// Proper URL encoding for image paths with spaces and special characters
const withBase = (p: string) => {
  const base = import.meta.env.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = p.startsWith("/") ? p.slice(1) : p;
  
  // Properly encode the path to handle spaces and special characters
  const parts = cleanPath.split("/");
  const encodedParts = parts.map((part) => {
    return encodeURIComponent(decodeURIComponent(part));
  });
  
  return `${cleanBase}${encodedParts.join("/")}`;
};

export const CaseStudyPage: React.FC = () => {
  const { slug } = useParams();
  const cs = useMemo(() => CASE_STUDIES.find((c) => c.slug === slug), [slug]);

  const [idx, setIdx] = useState<number | null>(null);
  if (!cs) {
    return (
      <div className="pt-32 bg-forge-dark min-h-screen text-white container mx-auto px-6">
        <h1 className="text-4xl font-display font-bold uppercase">Projet introuvable</h1>
        <Link className="text-safety-orange underline mt-6 inline-block" to="/projets">
          Retour Projets
        </Link>
      </div>
    );
  }

  const open = (i: number) => setIdx(i);
  const close = () => setIdx(null);
  const prev = () =>
    setIdx((i) => (i === null ? null : (i - 1 + cs.gallery.length) % cs.gallery.length));
  const next = () =>
    setIdx((i) => (i === null ? null : (i + 1) % cs.gallery.length));

  const openSrc = idx !== null ? cs.gallery[idx] : null;

  return (
    <div className="pt-28 bg-forge-dark min-h-screen">
      {/* HERO */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src={withBase(cs.hero)}
            alt={cs.title}
            loading="eager"
            fetchpriority="high"
            responsiveSizes={true}
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
            onError={(e) =>
              console.error("[CaseStudy] Hero image failed:", {
                src: withBase(cs.hero),
                error: e.currentTarget.naturalWidth === 0 ? "404" : "Load error",
              })
            }
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-12">
          <div>
            <div className="w-12 h-1 bg-safety-orange mb-5" />
            <h1 className="text-white font-display font-bold uppercase tracking-tighter text-[9vw] md:text-[4vw] leading-[0.95]">
              {cs.title}
            </h1>
            <p className="mt-4 text-white/70 text-lg">{cs.subtitle}</p>
          </div>
        </div>
      </section>

      {/* FACTS + GALLERY */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {cs.facts.map((f) => (
            <div key={f.label} className="border border-white/10 bg-white/5 p-5">
              <div className="text-white/50 text-xs uppercase tracking-widest font-mono">{f.label}</div>
              <div className="text-white font-bold mt-2">{f.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cs.gallery.map((src, i) => (
            <button
              key={`${src}-${i}`}
              className="relative overflow-hidden border border-white/10 bg-black group"
              onClick={() => open(i)}
              type="button"
            >
              <div className="w-full h-[280px] overflow-hidden">
                <SmartImage
                  src={withBase(src)}
                  alt={cs.title}
                  responsiveSizes={true}
                  forGrid={true}
                  className="w-full h-full object-cover grayscale opacity-85 group-hover:scale-105 transition-transform duration-700"
                  decoding="async"
                  onError={(e) =>
                    console.error("[CaseStudy] Gallery image failed:", {
                      src: withBase(src),
                      error: e.currentTarget.naturalWidth === 0 ? "404" : "Load error",
                    })
                  }
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </button>
          ))}
        </div>
      </section>

      {/* (Optional) legacy overlay removed — LightboxPortal handles everything safely */}
      <LightboxPortal
        open={idx !== null}
        src={openSrc}
        onClose={close}
        onPrev={() => (cs.gallery.length > 1 ? prev() : undefined)}
        onNext={() => (cs.gallery.length > 1 ? next() : undefined)}
      />
    </div>
  );
};
