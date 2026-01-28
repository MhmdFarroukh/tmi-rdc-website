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

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  hero: string;
  facts: { label: string; value: string }[];
  gallery: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "construction-metallique-hangar",
    title: "Construction Métallique — Hangar",
    subtitle: "Charpente, montage & finitions",
    hero: withBase("images/immersion/construction.png"),
    facts: [
      { label: "Type", value: "Charpente métallique" },
      { label: "Prestation", value: "Fabrication + montage" },
      { label: "Zone", value: "RDC" },
    ],
    gallery: [
      withBase("images/immersion/charpente.png"),
      withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.02.21 PM.jpeg"),
      withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.43 PM.jpeg"),
      // add 8–12 total
    ],
  },
  {
    slug: "remorque-plateau",
    title: "Remorque Plateau",
    subtitle: "Structure, renforts & assemblage",
    hero: withBase("images/immersion/remorque.png"),
    facts: [
      { label: "Type", value: "Remorque" },
      { label: "Prestation", value: "Conception + fabrication" },
      { label: "Zone", value: "RDC" },
    ],
    gallery: [
      withBase("images/immersion/remorque.png"),
      withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.33 PM.jpeg"),
      // add more
    ],
  },
  {
    slug: "maintenance-soudure",
    title: "Maintenance & Soudure",
    subtitle: "Interventions + réparations",
    hero: withBase("images/immersion/img2.png"),
    facts: [
      { label: "Type", value: "Maintenance industrielle" },
      { label: "Prestation", value: "Soudure / réparation" },
      { label: "Zone", value: "RDC" },
    ],
    gallery: [
      withBase("images/immersion/img2.png"),
      withBase("images/immersion/img3.png"),
      withBase("images/immersion/qualite.png"),
      // add more
    ],
  },
  {
  slug: "citernes-eau-carburant",
  title: "Citernes (Eau & Carburant)",
  subtitle: "Fabrication, assemblage & installation",
  hero: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.54 PM.jpeg"),
  facts: [
    { label: "Type", value: "Citerne" },
    { label: "Prestation", value: "Fabrication + montage" },
    { label: "Zone", value: "RDC" },
  ],
  gallery: [
    withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.54 PM.jpeg"),
    withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.43 PM.jpeg"),
    withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.33 PM.jpeg"),
    // ajoute 8–12 photos ici
  ],
},

];
