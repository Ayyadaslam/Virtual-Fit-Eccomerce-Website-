export interface SpatialItem {
  n: string;
  p: number;
  g: [number, number];
  m: number;
  c: [string, string][];
}

export const ITEMS: SpatialItem[] = [
  {
    n: "Basic T-shirt",
    p: 45,
    g: [1.14, 3.06],
    m: 0.37,
    c: [
      ["White", "#f4f2ee"],
      ["Ash", "#c9c7c2"],
      ["Charcoal", "#3b3c3f"],
      ["Navy", "#27324d"],
    ],
  },
  {
    n: "Basic Sweater",
    p: 105,
    g: [49.7, 1.39],
    m: 25.0,
    c: [
      ["White", "#f6f4ef"],
      ["Oat", "#ddd3c2"],
      ["Sage", "#b9c2ae"],
      ["Black", "#1f1f21"],
    ],
  },
  {
    n: "Linen Shirt",
    p: 95,
    g: [98.2, 3.33],
    m: 49.86,
    c: [
      ["White", "#f7f6f1"],
      ["Sand", "#d9ccb4"],
      ["Sky", "#bcd0e2"],
      ["Olive", "#717556"],
    ],
  },
  {
    n: "Grey Hoodie",
    p: 110,
    g: [1.14, 93.3],
    m: 74.77,
    c: [
      ["Heather", "#a9a9a8"],
      ["Bone", "#e6e1d6"],
      ["Forest", "#33463a"],
      ["Black", "#1f1f21"],
    ],
  },
  {
    n: "Ringer Tee",
    p: 55,
    g: [49.7, 95.3],
    m: 99.35,
    c: [
      ["White / Black", "#f4f2ee"],
      ["Cream / Navy", "#efe6d3"],
      ["Grey / Red", "#c9c7c2"],
      ["White / Green", "#e9efe8"],
    ],
  },
];

export type CategoryTab = "Tops" | "Bottoms" | "Outerwear" | "Shoes" | "Accessories";

export const CATEGORY_TABS: CategoryTab[] = [
  "Tops",
  "Bottoms",
  "Outerwear",
  "Shoes",
  "Accessories",
];

export type CurrencyCode = "USD" | "EUR" | "GBP";

const CURRENCY_META: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
};

export function formatPrice(usd: number, currency: CurrencyCode = "USD"): string {
  const { symbol, rate } = CURRENCY_META[currency];
  const converted = Math.round(usd * rate);
  return `${symbol}${converted}`;
}

export interface ProductReview {
  id: string;
  author: string;
  height: string;
  sizeBought: string;
  fitFeedback: "Runs Small" | "True to Size" | "Relaxed";
  rating: number;
  date: string;
  comment: string;
}

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: CategoryTab;
  spatialIndex?: number;
  g?: [number, number];
  m?: number;
  image?: string;
  colors: [string, string][];
  sizes: string[];
  subtitle: string;
  description: string;
  fabric: string;
  weight: string;
  care: string;
  fit: string;
  rating: number;
  reviewCount: number;
  stockStatus: "In Stock" | "Low Stock";
  badgeText?: string;
  measurements: {
    size: string;
    chest: string;
    length: string;
    shoulder: string;
  }[];
  reviews: ProductReview[];
}

export const CATALOG: CatalogProduct[] = [
  {
    id: "vf-basic-tee",
    sku: "VF-TOP-001",
    name: ITEMS[0].n,
    price: ITEMS[0].p,
    category: "Tops",
    spatialIndex: 0,
    g: ITEMS[0].g,
    m: ITEMS[0].m,
    colors: ITEMS[0].c,
    sizes: ["S", "M", "L", "XL"],
    subtitle: "240gsm Organic Supima Jersey",
    description:
      "Architectural everyday crew-neck tee knitted from extra-long-staple organic Supima cotton. Designed with a clean, ribbed collar that holds its shape and a tailored shoulder line.",
    fabric: "100% Organic Supima Cotton",
    weight: "240 gsm compact jersey",
    care: "Machine wash cold inside out. Lay flat or hang dry.",
    fit: "Modern tailored regular fit. Model is 184 cm / 6'0\" wearing size M.",
    rating: 4.9,
    reviewCount: 148,
    stockStatus: "In Stock",
    badgeText: "Bestseller",
    measurements: [
      { size: "S", chest: "102 cm", length: "68 cm", shoulder: "44 cm" },
      { size: "M", chest: "108 cm", length: "70 cm", shoulder: "46 cm" },
      { size: "L", chest: "114 cm", length: "72 cm", shoulder: "48 cm" },
      { size: "XL", chest: "120 cm", length: "74 cm", shoulder: "50 cm" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Henrik Lindqvist",
        height: "182 cm",
        sizeBought: "M",
        fitFeedback: "True to Size",
        rating: 5,
        date: "Oct 2026",
        comment:
          "Substantial fabric weight without feeling stiff. The spatial try-on matched the actual shoulder drape spot-on.",
      },
      {
        id: "r2",
        author: "Marcus Vance",
        height: "177 cm",
        sizeBought: "M",
        fitFeedback: "True to Size",
        rating: 5,
        date: "Sep 2026",
        comment:
          "Collar stays crisp after six washes. Bought White and Charcoal together.",
      },
    ],
  },
  {
    id: "vf-basic-sweater",
    sku: "VF-TOP-002",
    name: ITEMS[1].n,
    price: ITEMS[1].p,
    category: "Tops",
    spatialIndex: 1,
    g: ITEMS[1].g,
    m: ITEMS[1].m,
    colors: ITEMS[1].c,
    sizes: ["S", "M", "L", "XL"],
    subtitle: "420gsm Loopback French Terry",
    description:
      "Oversized crewneck sweatshirt cut with slightly dropped shoulders and dense double-ribbed cuffs. Brushed interior loop-back cotton offers breathable warmth year-round.",
    fabric: "100% Combed Organic Cotton",
    weight: "420 gsm French terry",
    care: "Gentle cold wash. Dry flat away from direct heat.",
    fit: "Relaxed dropped-shoulder silhouette. Size down for a closer fit.",
    rating: 4.8,
    reviewCount: 92,
    stockStatus: "In Stock",
    measurements: [
      { size: "S", chest: "114 cm", length: "67 cm", shoulder: "52 cm" },
      { size: "M", chest: "120 cm", length: "69 cm", shoulder: "54 cm" },
      { size: "L", chest: "126 cm", length: "71 cm", shoulder: "56 cm" },
      { size: "XL", chest: "132 cm", length: "73 cm", shoulder: "58 cm" },
    ],
    reviews: [
      {
        id: "r3",
        author: "Daniela Cruz",
        height: "174 cm",
        sizeBought: "S",
        fitFeedback: "Relaxed",
        rating: 5,
        date: "Oct 2026",
        comment:
          "Structured enough to wear over a collared shirt, soft enough for daily travel.",
      },
    ],
  },
  {
    id: "vf-linen-shirt",
    sku: "VF-TOP-003",
    name: ITEMS[2].n,
    price: ITEMS[2].p,
    category: "Tops",
    spatialIndex: 2,
    g: ITEMS[2].g,
    m: ITEMS[2].m,
    colors: ITEMS[2].c,
    sizes: ["S", "M", "L", "XL"],
    subtitle: "Normandy Long-Staple Flax",
    description:
      "Airy, enzyme-washed linen button-down finished with mother-of-pearl buttons and a curved gusset hem. Effortless drape for warm interiors and coastal evenings.",
    fabric: "100% European Flax Linen",
    weight: "165 gsm enzyme-washed",
    care: "Machine wash gentle 30°C. Steam lightly while damp.",
    fit: "Easy tailored cut with room through the chest.",
    rating: 4.9,
    reviewCount: 74,
    stockStatus: "In Stock",
    badgeText: "Studio Favorite",
    measurements: [
      { size: "S", chest: "106 cm", length: "73 cm", shoulder: "45 cm" },
      { size: "M", chest: "112 cm", length: "75 cm", shoulder: "47 cm" },
      { size: "L", chest: "118 cm", length: "77 cm", shoulder: "49 cm" },
      { size: "XL", chest: "124 cm", length: "79 cm", shoulder: "51 cm" },
    ],
    reviews: [
      {
        id: "r4",
        author: "Julian Meyer",
        height: "185 cm",
        sizeBought: "L",
        fitFeedback: "True to Size",
        rating: 5,
        date: "Oct 2026",
        comment:
          "Zero scratchiness right out of the box. Looks sharp tucked or untucked.",
      },
    ],
  },
  {
    id: "vf-grey-hoodie",
    sku: "VF-TOP-004",
    name: ITEMS[3].n,
    price: ITEMS[3].p,
    category: "Tops",
    spatialIndex: 3,
    g: ITEMS[3].g,
    m: ITEMS[3].m,
    colors: ITEMS[3].c,
    sizes: ["S", "M", "L", "XL"],
    subtitle: "480gsm Heavyweight Fleece",
    description:
      "Double-lined hood without drawstrings for a minimal profile, deep kangaroo pocket, and cross-grain side gussets that prevent vertical shrinkage.",
    fabric: "85% Organic Cotton, 15% Recycled Polyester",
    weight: "480 gsm fleece",
    care: "Cold machine wash. Tumble dry low or air dry.",
    fit: "Boxy architectural fit. Model is 184 cm wearing size M.",
    rating: 4.9,
    reviewCount: 215,
    stockStatus: "In Stock",
    badgeText: "Bestseller",
    measurements: [
      { size: "S", chest: "116 cm", length: "66 cm", shoulder: "53 cm" },
      { size: "M", chest: "122 cm", length: "68 cm", shoulder: "55 cm" },
      { size: "L", chest: "128 cm", length: "70 cm", shoulder: "57 cm" },
      { size: "XL", chest: "134 cm", length: "72 cm", shoulder: "59 cm" },
    ],
    reviews: [
      {
        id: "r5",
        author: "Kenji Sato",
        height: "179 cm",
        sizeBought: "M",
        fitFeedback: "True to Size",
        rating: 5,
        date: "Nov 2026",
        comment:
          "The double-layered hood stands cleanly on its own. Easily my most worn piece.",
      },
    ],
  },
  {
    id: "vf-ringer-tee",
    sku: "VF-TOP-005",
    name: ITEMS[4].n,
    price: ITEMS[4].p,
    compareAtPrice: 68,
    category: "Tops",
    spatialIndex: 4,
    g: ITEMS[4].g,
    m: ITEMS[4].m,
    colors: ITEMS[4].c,
    sizes: ["S", "M", "L", "XL"],
    subtitle: "Contrast Binding Knit Jersey",
    description:
      "1970s athletic archive proportions updated in crisp combed cotton with yarn-dyed contrast neck and sleeve binding that stays flat against the arm.",
    fabric: "100% Combed Ring-Spun Cotton",
    weight: "225 gsm jersey",
    care: "Machine wash cold with like colors.",
    fit: "Slightly cropped, clean shoulder fit.",
    rating: 4.7,
    reviewCount: 63,
    stockStatus: "In Stock",
    badgeText: "Seasonal Offer",
    measurements: [
      { size: "S", chest: "100 cm", length: "66 cm", shoulder: "43 cm" },
      { size: "M", chest: "106 cm", length: "68 cm", shoulder: "45 cm" },
      { size: "L", chest: "112 cm", length: "70 cm", shoulder: "47 cm" },
      { size: "XL", chest: "118 cm", length: "72 cm", shoulder: "49 cm" },
    ],
    reviews: [
      {
        id: "r6",
        author: "Theo Bennett",
        height: "180 cm",
        sizeBought: "M",
        fitFeedback: "True to Size",
        rating: 5,
        date: "Oct 2026",
        comment:
          "White / Black trim pops neatly under a dark overshirt.",
      },
    ],
  },
  {
    id: "vf-midnight-tee",
    sku: "VF-TOP-006",
    name: "Midnight Heavyweight Tee",
    price: 50,
    category: "Tops",
    g: [98.2, 95.3],
    colors: [
      ["Midnight Navy", "#27324d"],
      ["Charcoal", "#3b3c3f"],
      ["Black", "#1f1f21"],
      ["Slate", "#545860"],
    ],
    sizes: ["S", "M", "L", "XL"],
    subtitle: "280gsm Garment-Dyed Jersey",
    description:
      "Deep pigment-dyed navy crew tee cut with a boxy body and dense 1×1 ribbed neckline. Washed for zero torque and broken-in handfeel from day one.",
    fabric: "100% Organic Carded Cotton",
    weight: "280 gsm heavy jersey",
    care: "Wash cold separately on first cycle.",
    fit: "Relaxed boxy drape.",
    rating: 4.8,
    reviewCount: 51,
    stockStatus: "In Stock",
    badgeText: "New Arrival",
    measurements: [
      { size: "S", chest: "106 cm", length: "68 cm", shoulder: "46 cm" },
      { size: "M", chest: "112 cm", length: "70 cm", shoulder: "48 cm" },
      { size: "L", chest: "118 cm", length: "72 cm", shoulder: "50 cm" },
      { size: "XL", chest: "124 cm", length: "74 cm", shoulder: "52 cm" },
    ],
    reviews: [],
  },
  {
    id: "vf-wool-trousers",
    sku: "VF-BTM-001",
    name: "Tailored Wool Trousers",
    price: 165,
    category: "Bottoms",
    image: "/src/assets/images/catalog_charcoal_trousers_1794848339609.jpg",
    colors: [
      ["Charcoal", "#3b3c3f"],
      ["Oat", "#ddd3c2"],
      ["Midnight", "#1f2430"],
      ["Espresso", "#423730"],
    ],
    sizes: ["28", "30", "32", "34"],
    subtitle: "Virgin Wool Gabardine",
    description:
      "Single-pleat tailored trousers featured on the studio lookbook model. Cut with a relaxed thigh and clean tapered leg that breaks effortlessly over low-top sneakers.",
    fabric: "100% Responsible Virgin Wool",
    weight: "290 gsm gabardine",
    care: "Dry clean recommended or steam refresh.",
    fit: "Mid-rise relaxed taper. True to waist measurement.",
    rating: 4.9,
    reviewCount: 58,
    stockStatus: "In Stock",
    badgeText: "Model Worn",
    measurements: [
      { size: "28", chest: "74 cm waist", length: "101 cm", shoulder: "20 cm hem" },
      { size: "30", chest: "79 cm waist", length: "102 cm", shoulder: "20.5 cm hem" },
      { size: "32", chest: "84 cm waist", length: "103 cm", shoulder: "21 cm hem" },
      { size: "34", chest: "89 cm waist", length: "104 cm", shoulder: "21.5 cm hem" },
    ],
    reviews: [
      {
        id: "r7",
        author: "Owen Mercer",
        height: "183 cm",
        sizeBought: "32",
        fitFeedback: "True to Size",
        rating: 5,
        date: "Oct 2026",
        comment:
          "Matches every single top in the VirtualFit studio. Incredible drape.",
      },
    ],
  },
  {
    id: "vf-selvedge-denim",
    sku: "VF-BTM-002",
    name: "Japanese Selvedge Denim",
    price: 180,
    compareAtPrice: 215,
    category: "Bottoms",
    image: "/src/assets/images/catalog_selvedge_denim_1794848772625.jpg",
    colors: [
      ["Raw Indigo", "#1d273b"],
      ["Washed Charcoal", "#3f4147"],
      ["Ecru", "#ebe6dc"],
    ],
    sizes: ["28", "30", "32", "34"],
    subtitle: "13.5oz Okayama Rope-Dyed",
    description:
      "Shuttle-loomed red-line selvedge denim woven in Okayama, Japan. Classic straight cut with copper rivets, hidden coin pocket selvedge, and chain-stitched hems.",
    fabric: "100% Japanese Cotton Selvedge",
    weight: "13.5 oz / 458 gsm",
    care: "Soak cold inside out and hang dry.",
    fit: "Mid-rise straight leg.",
    rating: 4.9,
    reviewCount: 84,
    stockStatus: "In Stock",
    badgeText: "Seasonal Offer",
    measurements: [
      { size: "28", chest: "74 cm waist", length: "103 cm", shoulder: "20 cm hem" },
      { size: "30", chest: "79 cm waist", length: "104 cm", shoulder: "20.5 cm hem" },
      { size: "32", chest: "84 cm waist", length: "105 cm", shoulder: "21 cm hem" },
      { size: "34", chest: "89 cm waist", length: "106 cm", shoulder: "21.5 cm hem" },
    ],
    reviews: [],
  },
  {
    id: "vf-linen-pants",
    sku: "VF-BTM-003",
    name: "Relaxed Linen Trousers",
    price: 125,
    category: "Bottoms",
    image: "/src/assets/images/catalog_linen_pants_1794848774083.jpg",
    colors: [
      ["Sand", "#d9ccb4"],
      ["Bone", "#e6e1d6"],
      ["Olive", "#636850"],
      ["Charcoal", "#3b3c3f"],
    ],
    sizes: ["S", "M", "L", "XL"],
    subtitle: "Drawstring Summer Flax",
    description:
      "Breathable relaxed trousers with an internal braided cotton drawstring, side seam pockets, and a clean cropped ankle profile.",
    fabric: "100% European Flax Linen",
    weight: "185 gsm pre-washed",
    care: "Machine wash cold gentle.",
    fit: "Easy tapered lounge cut.",
    rating: 4.7,
    reviewCount: 44,
    stockStatus: "In Stock",
    measurements: [
      { size: "S", chest: "76 cm waist", length: "98 cm", shoulder: "19 cm hem" },
      { size: "M", chest: "81 cm waist", length: "100 cm", shoulder: "19.5 cm hem" },
      { size: "L", chest: "86 cm waist", length: "102 cm", shoulder: "20 cm hem" },
      { size: "XL", chest: "91 cm waist", length: "103 cm", shoulder: "20.5 cm hem" },
    ],
    reviews: [],
  },
  {
    id: "vf-oat-overshirt",
    sku: "VF-OUT-001",
    name: "Wool-Blend Overshirt",
    price: 210,
    category: "Outerwear",
    image: "/src/assets/images/catalog_oat_overshirt_1794848339732.jpg",
    colors: [
      ["Stone Oat", "#d8d1c5"],
      ["Charcoal", "#3b3c3f"],
      ["Olive", "#636850"],
      ["Navy", "#27324d"],
    ],
    sizes: ["S", "M", "L", "XL"],
    subtitle: "Brushed Italian Melton",
    description:
      "Transitional outerwear piece bridging shirt and jacket. Finished with twin bellows chest pockets, horn buttons, and clean felled interior seams.",
    fabric: "70% Recycled Wool, 30% Polyamide",
    weight: "460 gsm melton",
    care: "Dry clean only.",
    fit: "Structured boxy cut designed to layer over hoodies or tees.",
    rating: 4.8,
    reviewCount: 41,
    stockStatus: "Low Stock",
    badgeText: "Low Stock",
    measurements: [
      { size: "S", chest: "112 cm", length: "71 cm", shoulder: "47 cm" },
      { size: "M", chest: "118 cm", length: "73 cm", shoulder: "49 cm" },
      { size: "L", chest: "124 cm", length: "75 cm", shoulder: "51 cm" },
      { size: "XL", chest: "130 cm", length: "77 cm", shoulder: "53 cm" },
    ],
    reviews: [],
  },
  {
    id: "vf-wool-overcoat",
    sku: "VF-OUT-002",
    name: "Double-Faced Wool Coat",
    price: 390,
    category: "Outerwear",
    image: "/src/assets/images/catalog_wool_overcoat_1794848772690.jpg",
    colors: [
      ["Camel Taupe", "#b79e82"],
      ["Charcoal", "#3b3c3f"],
      ["Black", "#1f1f21"],
    ],
    sizes: ["S", "M", "L", "XL"],
    subtitle: "Hand-Finished Virgin Wool",
    description:
      "Architectural single-breasted overcoat crafted from unlined double-faced virgin wool for featherlight drape, notch lapels, and horn button closure.",
    fabric: "100% Double-Faced Virgin Wool",
    weight: "540 gsm",
    care: "Specialist dry clean.",
    fit: "Tailored over-jacket proportions.",
    rating: 5.0,
    reviewCount: 29,
    stockStatus: "In Stock",
    badgeText: "Atelier Edition",
    measurements: [
      { size: "S", chest: "112 cm", length: "106 cm", shoulder: "46 cm" },
      { size: "M", chest: "118 cm", length: "108 cm", shoulder: "48 cm" },
      { size: "L", chest: "124 cm", length: "110 cm", shoulder: "50 cm" },
      { size: "XL", chest: "130 cm", length: "112 cm", shoulder: "52 cm" },
    ],
    reviews: [],
  },
  {
    id: "vf-bomber-jacket",
    sku: "VF-OUT-003",
    name: "Technical Bomber Jacket",
    price: 265,
    compareAtPrice: 295,
    category: "Outerwear",
    image: "/src/assets/images/catalog_bomber_jacket_1794848773279.jpg",
    colors: [
      ["Charcoal Olive", "#464942"],
      ["Matte Black", "#1f1f21"],
      ["Stone", "#ccc5b9"],
    ],
    sizes: ["S", "M", "L", "XL"],
    subtitle: "Water-Repellent Japanese Twill",
    description:
      "Cropped flight jacket engineered in matte water-repellent Japanese nylon twill with PrimaLoft insulation, two-way Excella zip, and tonal rib knit trims.",
    fabric: "100% Recycled Japanese Nylon Twill",
    weight: "320 gsm insulated",
    care: "Spot clean or gentle dry clean.",
    fit: "Cropped boxy waist.",
    rating: 4.8,
    reviewCount: 38,
    stockStatus: "In Stock",
    badgeText: "Seasonal Offer",
    measurements: [
      { size: "S", chest: "116 cm", length: "64 cm", shoulder: "48 cm" },
      { size: "M", chest: "122 cm", length: "66 cm", shoulder: "50 cm" },
      { size: "L", chest: "128 cm", length: "68 cm", shoulder: "52 cm" },
      { size: "XL", chest: "134 cm", length: "70 cm", shoulder: "54 cm" },
    ],
    reviews: [],
  },
  {
    id: "vf-leather-sneakers",
    sku: "VF-SHO-001",
    name: "Italian Leather Sneakers",
    price: 240,
    category: "Shoes",
    image: "/src/assets/images/catalog_leather_sneakers_1794848340509.jpg",
    colors: [
      ["Chalk White", "#f2efe9"],
      ["Warm Grey", "#a9a7a1"],
      ["Obsidian", "#1f1f21"],
      ["Sand Suede", "#cfc4b2"],
    ],
    sizes: ["40", "41", "42", "43", "44"],
    subtitle: "Full-Grain Calfskin · Margom Sole",
    description:
      "Hand-lasted low-top court sneakers crafted in Tuscany with unbleached calfskin lining, waxed cotton laces, and stitched cup soles.",
    fabric: "100% Full-Grain Italian Calfskin",
    weight: "Margom rubber cup sole",
    care: "Wipe with damp cloth and condition leather quarterly.",
    fit: "True to EU size. Half sizes should size down.",
    rating: 4.9,
    reviewCount: 112,
    stockStatus: "In Stock",
    badgeText: "Bestseller",
    measurements: [
      { size: "40", chest: "25.8 cm", length: "US 7", shoulder: "Standard D" },
      { size: "41", chest: "26.5 cm", length: "US 8", shoulder: "Standard D" },
      { size: "42", chest: "27.2 cm", length: "US 9", shoulder: "Standard D" },
      { size: "43", chest: "27.9 cm", length: "US 10", shoulder: "Standard D" },
      { size: "44", chest: "28.6 cm", length: "US 11", shoulder: "Standard D" },
    ],
    reviews: [],
  },
  {
    id: "vf-chelsea-boots",
    sku: "VF-SHO-002",
    name: "Suede Chelsea Boots",
    price: 310,
    category: "Shoes",
    image: "/src/assets/images/catalog_chelsea_boots_1794848773630.jpg",
    colors: [
      ["Espresso Suede", "#3f322a"],
      ["Sand Suede", "#bfb19b"],
      ["Black Calf", "#1f1f21"],
    ],
    sizes: ["40", "41", "42", "43", "44"],
    subtitle: "Goodyear Welted · Water-Repellent Suede",
    description:
      "Bench-made Chelsea boots constructed from hydrophobic Tuscan split suede on a sleek almond last with 360-degree Goodyear storm welt and Vibram commando outsole.",
    fabric: "100% Hydrophobic Italian Suede",
    weight: "Goodyear storm welt",
    care: "Brush with suede crepe brush; apply protector spray.",
    fit: "True to EU size.",
    rating: 4.9,
    reviewCount: 47,
    stockStatus: "Low Stock",
    badgeText: "New Arrival",
    measurements: [
      { size: "40", chest: "26.0 cm", length: "US 7", shoulder: "Standard D" },
      { size: "41", chest: "26.7 cm", length: "US 8", shoulder: "Standard D" },
      { size: "42", chest: "27.4 cm", length: "US 9", shoulder: "Standard D" },
      { size: "43", chest: "28.1 cm", length: "US 10", shoulder: "Standard D" },
      { size: "44", chest: "28.8 cm", length: "US 11", shoulder: "Standard D" },
    ],
    reviews: [],
  },
  {
    id: "vf-architect-tote",
    sku: "VF-ACC-001",
    name: "Architectural Tote",
    price: 185,
    category: "Accessories",
    image: "/src/assets/images/catalog_weekender_tote_1794848340838.jpg",
    colors: [
      ["Black / Canvas", "#222224"],
      ["Espresso / Ecru", "#4b3e35"],
      ["Sand / Tan", "#c8b79f"],
      ["Slate", "#545860"],
    ],
    sizes: ["One Size"],
    subtitle: "Pebbled Leather & 18oz Canvas",
    description:
      "Self-standing everyday carryall featuring a padded 16-inch laptop sleeve, solid gunmetal D-rings, and reinforced vegetable-tanned bridle handles.",
    fabric: "18oz Organic Duck Canvas & Full-Grain Cowhide",
    weight: "21L capacity",
    care: "Spot clean canvas; apply leather balm to straps.",
    fit: "42 cm × 34 cm × 15 cm.",
    rating: 4.8,
    reviewCount: 37,
    stockStatus: "In Stock",
    measurements: [
      { size: "One Size", chest: "42 cm W", length: "34 cm H", shoulder: "15 cm D" },
    ],
    reviews: [],
  },
  {
    id: "vf-steel-watch",
    sku: "VF-ACC-002",
    name: "Automatic Field Watch",
    price: 340,
    category: "Accessories",
    image: "/src/assets/images/catalog_steel_watch_1794848774525.jpg",
    colors: [
      ["Silver / Black Strap", "#c8c6c0"],
      ["Silver / Tan Strap", "#b89772"],
    ],
    sizes: ["38mm"],
    subtitle: "Brushed 316L Steel · Sapphire Crystal",
    description:
      "Minimalist 38mm automatic timepiece featuring a sunray warm-silver dial, domed anti-reflective sapphire crystal, 100m water resistance, and quick-release calfskin strap.",
    fabric: "316L Brushed Steel & Italian Calfskin",
    weight: "Miyota 9015 automatic",
    care: "Wipe case with microfiber cloth.",
    fit: "38mm case diameter · 9.8mm thin · 20mm lug width.",
    rating: 4.9,
    reviewCount: 64,
    stockStatus: "In Stock",
    badgeText: "Limited Run",
    measurements: [
      { size: "38mm", chest: "38 mm case", length: "45 mm lug-to-lug", shoulder: "9.8 mm thick" },
    ],
    reviews: [],
  },
];

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  colorName: string;
  colorHex: string;
  qty: number;
  g?: [number, number];
  image?: string;
  spatialIndex?: number;
}

export interface SavedLook {
  id: string;
  day: string;
  occasion: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  colorName: string;
  colorHex: string;
  g?: [number, number];
  spatialIndex?: number;
  savedAt: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  status: "Confirmed" | "Preparing Shipment" | "Shipped";
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: "Card" | "Apple Pay" | "Cash on Delivery";
  shippingTo: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "VF-1038",
    date: "Nov 08, 2026",
    status: "Shipped",
    items: [
      {
        key: "vf-linen-shirt__M__Sand",
        productId: "vf-linen-shirt",
        name: "Linen Shirt",
        price: 95,
        size: "M",
        colorName: "Sand",
        colorHex: "#d9ccb4",
        qty: 1,
        g: [98.2, 3.33],
        spatialIndex: 2,
      },
      {
        key: "vf-wool-trousers__32__Charcoal",
        productId: "vf-wool-trousers",
        name: "Tailored Wool Trousers",
        price: 165,
        size: "32",
        colorName: "Charcoal",
        colorHex: "#3b3c3f",
        qty: 1,
        image: "/src/assets/images/catalog_charcoal_trousers_1794848339609.jpg",
      },
    ],
    subtotal: 260,
    discount: 0,
    shipping: 0,
    total: 260,
    paymentMethod: "Card",
    shippingTo: {
      name: "Alex Mercer",
      address: "412 Mercer St, Apt 4B",
      city: "San Francisco",
      postalCode: "94107",
      phone: "+1 (415) 555-0192",
    },
  },
];
