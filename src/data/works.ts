export type Category =
  | "identity"
  | "print"
  | "editorial"
  | "packaging"
  | "poster"
  | "social"
  | "art"

export interface Work {
  slug: string
  title: string
  client: string
  category: Category
  /** What was made, in a few words */
  deliverable: string
  img: string
  /** Shown in the 3D "Selected works" ring */
  featured?: boolean
}

export const CATEGORIES: { id: Category; label: string; accent: string; blurb: string; tags: string[] }[] = [
  { id: "identity", label: "Logo & Identity", accent: "var(--color-saffron)", blurb: "Marks, systems and charters that hold a brand together.", tags: ["Logos", "Brand charters", "Signage", "Rebrands"] },
  { id: "print", label: "Cards & Stationery", accent: "var(--color-henna)", blurb: "Business cards, loyalty cards, letterheads — paper you keep.", tags: ["Business cards", "Gold foil", "Letterheads", "Loyalty cards"] },
  { id: "editorial", label: "Catalogues & Menus", accent: "var(--color-zellige)", blurb: "Menus, brochures and catalogues laid out on a real grid.", tags: ["Menus", "Brochures", "Catalogues", "Layout & grid"] },
  { id: "packaging", label: "Packaging", accent: "var(--color-saffron)", blurb: "Boxes, bags and totes designed for the shelf and the street.", tags: ["Product boxes", "Shopping bags", "Totes", "Labels"] },
  { id: "poster", label: "Posters & Signage", accent: "var(--color-henna)", blurb: "Event posters, roll-ups and large-format signage.", tags: ["Event posters", "Roll-ups", "Totems", "Door hangers"] },
  { id: "social", label: "Digital & Social", accent: "var(--color-zellige)", blurb: "Campaign visuals and social content that stop the scroll.", tags: ["Instagram", "Campaigns", "Product posts", "Ads"] },
  { id: "art", label: "Art & Illustration", accent: "var(--color-saffron)", blurb: "Vector portraits, ink work and photo-manipulation.", tags: ["Vector portraits", "Ink drawing", "Photo-manipulation", "Covers"] },
]

export const WORKS: Work[] = [
  // Identity
  { slug: "magistral-logo", title: "Magistral", client: "Magistral Clinic & Spa", category: "identity", deliverable: "Logo & interior signage", img: "/works/magistral-logo.webp", featured: true },
  { slug: "wem-rebrand", title: "WEM Rebrand", client: "Web Marketing Maroc", category: "identity", deliverable: "Logo redesign", img: "/works/wem-rebrand.webp", featured: true },
  { slug: "big-mamie", title: "Big Mamie", client: "Big Mamie — Crèche", category: "identity", deliverable: "Logo & lightbox sign", img: "/works/big-mamie.webp" },
  { slug: "pro-air-logo", title: "Pro-Air", client: "Pro-Air St-Martin", category: "identity", deliverable: "Logo & facade mockup", img: "/works/pro-air-logo.webp" },
  { slug: "glasses-lens", title: "Glasses & Lens", client: "Glasses & Lens", category: "identity", deliverable: "Logo & building signage", img: "/works/glasses-lens.webp" },
  { slug: "lumens-logo", title: "LuMen's", client: "LuMen's Lighting", category: "identity", deliverable: "Logo system", img: "/works/lumens-logo.webp" },
  { slug: "wem-consulting", title: "WEM Consulting", client: "WEM Business Consulting", category: "identity", deliverable: "Logo", img: "/works/wem-consulting.webp" },
  { slug: "los-tacos", title: "Los Tacos Hermanos", client: "Los Tacos Hermanos", category: "identity", deliverable: "Logo & kiosk branding", img: "/works/los-tacos.webp", featured: true },

  // Print
  { slug: "magistral-stationery", title: "Magistral Stationery", client: "Magistral Clinic & Spa", category: "print", deliverable: "Full stationery set, gold foil", img: "/works/magistral-stationery.webp", featured: true },
  { slug: "habiba-card", title: "Habiba El Farisi", client: "Habiba El Farisi", category: "print", deliverable: "Gold-edge business cards", img: "/works/habiba-card.webp", featured: true },
  { slug: "boks-card", title: "Boks Advertising", client: "Boks Advertising", category: "print", deliverable: "Business cards", img: "/works/boks-card.webp" },
  { slug: "3may-card", title: "3 May Travaux", client: "3 May Travaux", category: "print", deliverable: "Business cards", img: "/works/3may-card.webp" },
  { slug: "zen-fidelity", title: "Zen — Loyalty", client: "Zen Beauty", category: "print", deliverable: "Loyalty card", img: "/works/zen-fidelity.webp" },
  { slug: "come-on-morocco", title: "Come On Morocco", client: "Come On Morocco Tours", category: "print", deliverable: "Business cards", img: "/works/come-on-morocco.webp" },

  // Editorial
  { slug: "sushi-menu", title: "Sushi Menu", client: "Sushi restaurant", category: "editorial", deliverable: "Folded menu", img: "/works/sushi-menu.webp", featured: true },
  { slug: "positano-menu", title: "Positano", client: "Positano Italian Kitchen", category: "editorial", deliverable: "Illustrated menu", img: "/works/positano-menu.webp" },
  { slug: "magistral-brochure", title: "Magistral Brochure", client: "Magistral Clinic & Spa", category: "editorial", deliverable: "Spa price brochure", img: "/works/magistral-brochure.webp" },
  { slug: "luigi-menu", title: "Luigi", client: "Restaurant Luigi, Fès", category: "editorial", deliverable: "Menu cover", img: "/works/luigi-menu.webp" },
  { slug: "zalagh-catalogue", title: "Zalagh Voyages", client: "Zalagh Voyages", category: "editorial", deliverable: "Travel catalogue", img: "/works/zalagh-catalogue.webp" },

  // Packaging
  { slug: "lumens-packaging", title: "LuMen's LED", client: "LuMen's Lighting", category: "packaging", deliverable: "Product boxes", img: "/works/lumens-packaging.webp", featured: true },
  { slug: "glowup-tote", title: "Let's Glow Up", client: "Let's Glow Up Cosmetics", category: "packaging", deliverable: "Logo & tote bags", img: "/works/glowup-tote.webp" },
  { slug: "magistral-bag", title: "Magistral Bag", client: "Magistral Clinic & Spa", category: "packaging", deliverable: "Shopping bag", img: "/works/magistral-bag.webp" },

  // Posters
  { slug: "soiree-orientale", title: "Soirée Orientale", client: "Restaurant Luigi", category: "poster", deliverable: "Event poster & totem", img: "/works/soiree-orientale.webp", featured: true },
  { slug: "venezia-poster", title: "Opening Match", client: "Venezia Ice", category: "poster", deliverable: "AFCON screening poster", img: "/works/venezia-poster.webp" },
  { slug: "pro-air-print", title: "Pro-Air Campaign", client: "Pro-Air St-Martin", category: "poster", deliverable: "Roll-up & door hanger", img: "/works/pro-air-print.webp" },

  // Social
  { slug: "mielii-social", title: "Mielii", client: "Mielii", category: "social", deliverable: "Label & social posts", img: "/works/mielii-social.webp", featured: true },
  { slug: "glowup-social", title: "Glow Up Feed", client: "Let's Glow Up Cosmetics", category: "social", deliverable: "Product social posts", img: "/works/glowup-social.webp" },
  { slug: "travel4fun-social", title: "Travel4Fun", client: "Travel4Fun", category: "social", deliverable: "Campaign posts", img: "/works/travel4fun-social.webp" },
  { slug: "oxygene-social", title: "Oxygène Experiences", client: "Oxygène Spa", category: "social", deliverable: "Instagram campaign", img: "/works/oxygene-social.webp" },
  { slug: "usmile-social", title: "U-Smile", client: "U-Smile Consultant", category: "social", deliverable: "Promo posts", img: "/works/usmile-social.webp" },

  // Art
  { slug: "plata-o-plomo", title: "Plata o Plomo", client: "Personal", category: "art", deliverable: "Ink illustration / cover", img: "/works/plata-o-plomo.webp", featured: true },
  { slug: "fazza-artwork", title: "Fazz3a", client: "Fazz3a — artist", category: "art", deliverable: "Vector portrait & logo", img: "/works/fazza-artwork.webp" },
  { slug: "gta-portrait", title: "Vice City", client: "Personal", category: "art", deliverable: "GTA-style self portrait", img: "/works/gta-portrait.webp" },
  { slug: "vector-portrait", title: "Vector Portrait", client: "Commission", category: "art", deliverable: "Photo-to-vector illustration", img: "/works/vector-portrait.webp" },
  { slug: "bvs-poster", title: "The End Is Near", client: "Personal", category: "art", deliverable: "Photo-manipulation poster", img: "/works/bvs-poster.webp" },
]

export const EXPERIENCE = [
  {
    role: "Graphic Designer",
    company: "OVO Lounge",
    place: "Dubai, UAE",
    text: "Advised clients on the graphic options best suited to their marketing goals. Logos, brochures, infographics, presentations and ads; social visuals, photo shoots and retouching.",
  },
  {
    role: "Graphic Designer",
    company: "WEM — Web Marketing Maroc",
    place: "Digital marketing agency",
    text: "Designed graphics for 50+ products, built and ran digital campaigns for clients, and produced work for laser, thermal and digital printing.",
  },
  {
    role: "Graphic Designer",
    company: "Gold Evolution",
    place: "Training agency",
    text: "Juggled several projects at once against weekly deadlines: social visuals, product packaging, print, shoots and retouching.",
  },
  {
    role: "Graphic Designer",
    company: "Ambassadeur des Médias",
    place: "Media agency",
    text: "Print and web visuals for a range of clients, and the agency's own brand charter.",
  },
]

export const EDUCATION = [
  { year: "2019", title: "Microsoft Certified Professional" },
  { year: "2018", title: "Multimedia Development — training" },
  { year: "2015–17", title: "Specialised Technician Diploma in Infography" },
  { year: "2015", title: "Baccalaureate in Applied Arts" },
]

export const CONTACT = {
  email: "khelaoussama767@gmail.com",
  phone: "+212 675 214 148",
  phoneHref: "tel:+212675214148",
  location: "Oued Fès, Fès — Morocco",
}
