/* ============================================================================
   data.js — Boutique configuration + product catalogue
   ----------------------------------------------------------------------------
   ✏️  HOW TO UPDATE THE SHOP (everything is here, nothing is hard-coded):
   1. Add / edit / delete products in the PRODUCTS array below.
   2. Each product needs:  id, name, price, category, img, sizes
   3. Set `img` to your real photo URL when ready. Until then it points to a
      placeholder that degrades gracefully to a blush gradient + monogram
      (see .ph in style.css), so the layout never breaks.
   ========================================================================== */

const SITE = {
  name: "Tendance by Souka",
  owner: "Soukaina",
  city: "Kénitra",
  country: "Maroc",
  tagline: "Élégance & créativité, choisies avec soin",
  // International format, digits only (no +, no spaces) — used by wa.me
  phone: "212627222047",
  phoneDisplay: "+212 627 222 047",
  instagram: "tendance_by_souka",
  instagramUrl: "https://www.instagram.com/tendance_by_souka/",
  tiktokUrl: "https://www.tiktok.com/@tendance_by_souka",
  rating: 4.5,
  reviewCount: 6,
  followers: "7.6K+",
  freeShippingFrom: 800, // DH — order above this gets free worldwide delivery
  address: {
    line1: "Avenue Mohamed Diouri, angle Mohamed Abdou",
    line2: "Quartier Camélia — près de Camélia Mall",
    city: "Kénitra 14001",
    country: "Maroc",
    mapsQuery: "Avenue Mohamed Diouri, Kénitra 14001, Maroc",
    mapsEmbed:
      "https://www.google.com/maps?q=" +
      encodeURIComponent("Avenue Mohamed Diouri, Kénitra 14001, Maroc") +
      "&z=15&output=embed"
  },
  hours: [
    { d: "Lundi — Vendredi", h: "10:00 — 23:00", today: true },
    { d: "Samedi", h: "10:00 — 23:00" },
    { d: "Dimanche", h: "11:00 — 21:00" }
  ]
};

/* Category definitions — `key` is used by the shop filters */
const CATEGORIES = [
  {
    key: "dresses",
    label: "Dresses",
    fr: "Robes",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    mono: "Robes",
    count: 8
  },
  {
    key: "sets",
    label: "Sets & Co-ords",
    fr: "Ensembles",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    mono: "Ensembles",
    count: 4
  },
  {
    key: "shoes",
    label: "Shoes",
    fr: "Chaussures",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
    mono: "Chaussures",
    count: 5
  },
  {
    key: "bags",
    label: "Bags & Accessories",
    fr: "Sacs",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    mono: "Sacs",
    count: 4
  }
];

/* Size presets */
const SIZES = {
  clothes: ["S", "M", "L", "XL"],
  shoes: ["36", "37", "38", "39", "40"],
  one: []            // empty = no size selector needed
};

/* ============================================================================
   PRODUCTS — edit freely. `featured: true` puts it on the homepage rail.
   ========================================================================== */
const PRODUCTS = [
  /* ---------------- DRESSES ---------------- */
  {
    id: "d1",
    name: "Iman Draped Satin Dress",
    price: 649,
    old: 799,
    category: "dresses",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    featured: true,
    tag: "Best seller",
    blurb: "Bias-cut satin that moves like water, with a soft draped neckline."
  },
  {
    id: "d2",
    name: "Nour Embroidered Midi Dress",
    price: 520,
    category: "dresses",
    img: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    featured: true,
    tag: "New",
    blurb: "Hand-finished embroidery on a fluid crepe midi. Made for evening light."
  },
  {
    id: "d3",
    name: "Lalla Pleated Maxi Dress",
    price: 580,
    category: "dresses",
    img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    featured: true,
    blurb: "Tiny sunray pleats that catch every bit of light. Floor-grazing, effortless."
  },
  {
    id: "d4",
    name: "Salma Wrap Midi Dress",
    price: 460,
    category: "dresses",
    img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    blurb: "A true wrap dress with a tie waist — the one you'll reach for daily."
  },
  {
    id: "d5",
    name: "Hind Tiered Chiffon Dress",
    price: 495,
    category: "dresses",
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    featured: true,
    blurb: "Sheer layered tiers, a square neckline, and an airy weightless fall."
  },
  {
    id: "d6",
    name: "Yasmine Column Dress",
    price: 720,
    category: "dresses",
    img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    blurb: "Architectural column cut in a matte structured crepe. Quietly dramatic."
  },
  {
    id: "d7",
    name: "Meryem Slip Dress",
    price: 390,
    category: "dresses",
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    blurb: "Minimal silk-look slip, cut on the bias. Layers beautifully under knitwear."
  },
  {
    id: "d8",
    name: "Aya Lace Midi Dress",
    price: 610,
    category: "dresses",
    img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    blurb: "All-over lace with a scalloped hem and a soft cotton lining."
  },

  /* ---------------- SETS & CO-ORDS ---------------- */
  {
    id: "s1",
    name: "Loubna Satin Co-ord Set",
    price: 690,
    category: "sets",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    featured: true,
    tag: "New",
    blurb: "Matching camisole and wide-leg trouser in champagne satin."
  },
  {
    id: "s2",
    name: "Ghita Knit Two-Piece",
    price: 480,
    category: "sets",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    featured: true,
    blurb: "Soft ribbed knit top with a relaxed pant. Off-duty, but elegant."
  },
  {
    id: "s3",
    name: "Rim Blazer & Short Set",
    price: 740,
    category: "sets",
    img: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    blurb: "Tailored blazer over a high-waisted short. Boardroom to dinner."
  },
  {
    id: "s4",
    name: "Warda Linen Set",
    price: 420,
    category: "sets",
    img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.clothes,
    blurb: "Breathable linen shirt and shorts with a natural, sun-washed hand."

  },

  /* ---------------- SHOES ---------------- */
  {
    id: "h1",
    name: "Zineb Nude Heels",
    price: 549,
    category: "shoes",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.shoes,
    featured: true,
    blurb: "Sculptural block heel in a nude finish that lengthens every line."
  },
  {
    id: "h2",
    name: "Amira Strappy Sandals",
    price: 430,
    category: "shoes",
    img: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.shoes,
    featured: true,
    blurb: "Fine gold straps on a cushioned leather sole. Made for long evenings."
  },
  {
    id: "h3",
    name: "Lilia Pointed Flats",
    price: 360,
    category: "shoes",
    img: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.shoes,
    blurb: "A razor-point ballet flat with a soft grosgrain bow."
  },
  {
    id: "h4",
    name: "Kenza Ankle Boots",
    price: 690,
    category: "shoes",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.shoes,
    blurb: "Slim calf leather boot with a tapered heel and side zip."
  },
  {
    id: "h5",
    name: "Chaim Suede Mules",
    price: 470,
    category: "shoes",
    img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.shoes,
    blurb: "Backless suede mule with a low stacked heel. Effortless polish."
  },

  /* ---------------- BAGS & ACCESSORIES ---------------- */
  {
    id: "b1",
    name: "Sofia Quilted Shoulder Bag",
    price: 590,
    category: "bags",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.one,
    featured: true,
    tag: "Best seller",
    blurb: "Diamond-quilted nappa with a slim chain strap. Fits a phone, keys, lipstick."
  },
  {
    id: "b2",
    name: "Hana Mini Tote",
    price: 420,
    category: "bags",
    img: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.one,
    featured: true,
    blurb: "Structured mini tote in pebbled leather with a top handle."
  },
  {
    id: "b3",
    name: "Malak Silk Scarf",
    price: 190,
    category: "bags",
    img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.one,
    blurb: "90×90 cm printed silk twill, hand-rolled edges. The finishing touch."
  },
  {
    id: "b4",
    name: "Ihraz Leather Belt & Card Holder",
    price: 220,
    category: "bags",
    img: "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?auto=format&fit=crop&w=700&q=80",
    sizes: SIZES.one,
    blurb: "Slim cognac leather belt paired with a matching card holder."
  }
];

/* Small helpers used across pages */
const money = (n) =>
  new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(n) + " DH";

const productById = (id) => PRODUCTS.find((p) => p.id === id);
const categoryLabel = (key) => (CATEGORIES.find((c) => c.key === key) || {}).label || "";
