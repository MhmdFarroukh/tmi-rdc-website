import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";

// ✅ For Vite: files inside /public must be referenced by URL (not imported)
const withBase = (p: string) => {
  const base = import.meta.env.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = p.startsWith("/") ? p.slice(1) : p;
  return `${cleanBase}${cleanPath}`;
};

const LINKS = [
  {
    heading: "Hangar & Dépôt Charpente Métallique",
    subheading: "Structures industrielles",
    imgSrc: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.02.21 PM.jpeg"),
    href: "/prestation-services",
  },
  {
    heading: "Citerne Verticale et horizontale Citerne Carburants",
    subheading: "Transport de fluides",
    imgSrc: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.54 PM.jpeg"),
    href: "/prestation-services",
  },
  {
    heading: "Remorque Plateau Remorques Citerne",
    subheading: "Stockage grande capacité",
    imgSrc: withBase("images/immersion/remorque.png"),
    href: "/prestation-services",
  },
  {
    heading: "Réservoir d'eau & Mezzanine",
    subheading: "Logistique lourde",
    imgSrc: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.00.58 PM.jpeg"),
    href: "/prestation-services",
  },
  {
    heading: "Menuiserie & Porte",
    subheading: "Travaux & finitions",
    imgSrc: withBase("images/immersion/img2.png"),
    href: "/prestation-services",
  },
];

export const HoverImageLinks = () => {
  return (
    <section className="bg-white py-32 md:py-48 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end border-b border-black/10 pb-8">
          <h2 className="text-[10vw] leading-[0.8] font-display font-bold uppercase tracking-tighter text-black">
            Nos <br /> Prestations
          </h2>
          <div className="text-right mt-8 md:mt-0">
            <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-2">
              Catalogue
            </p>
            <p className="text-black font-bold uppercase text-lg">
              Solutions Métalliques
            </p>
          </div>
        </div>

        <div className="mx-auto w-full">
          {LINKS.map((link, i) => (
            <Link
              
              heading={link.heading}
              subheading={link.subheading}
              imgSrc={link.imgSrc}
              href={link.href}
              index={i}
              linkId={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Link = ({
  heading,
  subheading,
  imgSrc,
  href,
  index,
}: {
  heading: string;
  subheading: string;
  imgSrc: string;
  href: string;
  index: number;
  linkId?: number;
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const rect = ref.current!.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b border-neutral-200 py-6 transition-colors duration-500 hover:border-neutral-950 md:py-10"
    >
      <div className="flex items-baseline gap-6 md:gap-12">
        <span className="text-sm font-bold text-neutral-300 transition-colors duration-500 group-hover:text-neutral-950 font-mono">
          0{index + 1}
        </span>

        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
          <motion.span
            variants={{
              initial: { x: 0 },
              whileHover: { x: -10 },
            }}
            transition={{
              type: "spring",
              staggerChildren: 0.05,
              delayChildren: 0.1,
            }}
            className="relative z-10 block text-2xl md:text-5xl font-bold uppercase text-neutral-400 transition-colors duration-500 group-hover:text-neutral-950 font-display"
          >
            {heading.split("").map((l, i) => (
              <motion.span
                variants={{
                  initial: { x: 0 },
                  whileHover: { x: 5 },
                }}
                transition={{ type: "spring" }}
                className="inline-block"
                key={i}
              >
                {l}
              </motion.span>
            ))}
          </motion.span>

          <span className="relative z-10 mt-1 block text-xs font-bold text-neutral-300 transition-colors duration-500 group-hover:text-safety-orange md:mt-0 md:text-sm">
            {subheading}
          </span>
        </div>
      </div>

      {/* Floating preview image */}
      <motion.div
        style={{
          top,
          left,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={{
          initial: { scale: 0, rotate: "-12.5deg" },
          whileHover: { scale: 1, rotate: "12.5deg" },
        }}
        transition={{ type: "spring" }}
        className="absolute z-0 hidden h-48 w-64 md:block pointer-events-none"
      >
        <img
          src={imgSrc}
          alt={`Preview for ${heading}`}
          className="h-full w-full rounded-lg object-cover"
          loading="lazy"
          onError={() => console.error("[HoverImageLinks] failed to load:", imgSrc)}
        />
      </motion.div>

      <motion.div
        variants={{
          initial: { x: "25%", opacity: 0 },
          whileHover: { x: "0%", opacity: 1 },
        }}
        transition={{ type: "spring" }}
        className="relative z-10 p-2"
      >
        <ArrowRight className="text-neutral-950" size={24} />
      </motion.div>
    </motion.a>
  );
};
