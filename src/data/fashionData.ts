/**
 * NOWHERE® Fashion E-Commerce Data Specification
 * Exact assets, coordinates, and product catalog for Vol. 01
 */

export const CDN_BASE = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

/**
 * Image wrapper specified in technical requirements:
 * px(file, w) = https://images.higgs.ai/?default=1&output=webp&url=ENCODED_CDN_IMAGE_URL&w=WIDTH&q=85
 */
export function px(file: string, w: number = 914): string {
  const fullCdnUrl = CDN_BASE + file;
  return `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(fullCdnUrl)}&w=${w}&q=85`;
}

// Fallback direct CDN if proxy is unreachable in any sandbox
export function directCdn(file: string): string {
  return CDN_BASE + file;
}

export interface ShopDotCoord {
  left: number; // percentage
  top: number;  // percentage
}

export interface ProductItem {
  id: string;
  itemNumber: number; // 0, 1, 2
  name: string;
  category: "Top" | "Bottom" | "Outerwear" | "Shoes" | "Accessory";
  price: number;
  sizes: string[];
  lookNumber: number;
  lookName: string;
  description: string;
  details: string[];
}

export interface LookData {
  number: number; // 1 to 9
  numberStr: string; // "01", "02", etc.
  name: string;
  footOffset: number;
  modelFile: string;
  dots: ShopDotCoord[];
  subtotal: number;
  discount: number;
  total: number;
  products: ProductItem[];
}

// Product Contact Sheets
export const PRODUCT_SHEETS = [
  "hf_20261108_190756_3f427fdd-ba34-433e-bc55-eb9b03d2e1c6.png",
  "hf_20261108_190758_785127d3-ef7d-4831-976b-14540a7188aa.png",
  "hf_20261108_190800_4db1daba-ebb1-436f-857a-91dfab40f4b7.png",
];

/**
 * Helper to get contact sheet background position styling:
 * Sheet index = floor((lookNumber - 1) / 3)
 * Row index = (lookNumber - 1) % 3
 * Col index = itemNumber (0, 1, 2)
 */
export function getProductImageStyle(lookNumber: number, itemNumber: number) {
  const sheetIndex = Math.floor((lookNumber - 1) / 3);
  const rowIndex = (lookNumber - 1) % 3;
  const colIndex = itemNumber;

  const colPcts = [0, 50, 100];
  const rowPcts = [0, 50, 100];

  const sheetUrl = px(PRODUCT_SHEETS[sheetIndex], 600);
  const fallbackUrl = directCdn(PRODUCT_SHEETS[sheetIndex]);

  return {
    backgroundImage: `url(${sheetUrl}), url(${fallbackUrl})`,
    backgroundSize: '300% 300%',
    backgroundPosition: `${colPcts[colIndex]}% ${rowPcts[rowIndex]}%`,
    backgroundRepeat: 'no-repeat',
  };
}

export const LOOKS: LookData[] = [
  {
    number: 1,
    numberStr: "01",
    name: "Somewhere Else",
    footOffset: 0.0501,
    modelFile: "hf_20261108_190717_6580d844-f3b0-4240-8b4a-239355685fc9.png",
    dots: [
      { left: 52, top: 44 },
      { left: 80, top: 40 },
      { left: 44, top: 57 },
    ],
    subtotal: 142,
    discount: 14.20,
    total: 127.80,
    products: [
      {
        id: "nw-01-01",
        itemNumber: 0,
        name: "Ribbed Tank Top",
        category: "Top",
        price: 36,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 1,
        lookName: "Somewhere Else",
        description: "Heavyweight ribbed cotton jersey with bound neckline and raw bottom hem finish.",
        details: ["100% Organic Heavy Rib Cotton", "Pre-washed for zero shrinkage", "Garment dyed in Studio Grey", "Made in Portugal"],
      },
      {
        id: "nw-01-02",
        itemNumber: 1,
        name: "Striped Open Shirt",
        category: "Top",
        price: 74,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 1,
        lookName: "Somewhere Else",
        description: "Breezy relaxed-collar button down featuring subtle monochrome vertical stripe weave.",
        details: ["60% Linen, 40% Tencel blend", "Corozo nut buttons", "Boxy architectural cut", "Chest patch pocket"],
      },
      {
        id: "nw-01-03",
        itemNumber: 2,
        name: "Braided Belt",
        category: "Accessory",
        price: 32,
        sizes: ["One size"],
        lookNumber: 1,
        lookName: "Somewhere Else",
        description: "Hand-braided waxed cotton cord belt finished with brushed matte nickel hardware.",
        details: ["Waxed tactile cotton weave", "Brushed metal D-ring buckle", "Total length 120cm", "Infinitely adjustable"],
      },
    ],
  },
  {
    number: 2,
    numberStr: "02",
    name: "Dial-Up",
    footOffset: 0.0501,
    modelFile: "hf_20261111_034030_a9171bb1-0b34-4468-9a9e-f451d79b8429.png",
    dots: [
      { left: 76, top: 45 },
      { left: 54, top: 68 },
      { left: 45, top: 87 },
    ],
    subtotal: 324,
    discount: 32.40,
    total: 291.60,
    products: [
      {
        id: "nw-02-01",
        itemNumber: 0,
        name: "Corduroy Trucker",
        category: "Outerwear",
        price: 142,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 2,
        lookName: "Dial-Up",
        description: "Wide-wale cotton corduroy jacket with dropped shoulders and shank button closures.",
        details: ["8-wale heavyweight corduroy", "Custom matte black shanks", "Interior welt pocket", "Relaxed boxy silhouette"],
      },
      {
        id: "nw-02-02",
        itemNumber: 1,
        name: "Pleated Shorts",
        category: "Bottom",
        price: 64,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 2,
        lookName: "Dial-Up",
        description: "Double front pleat relaxed shorts cut from crisp Japanese cotton poplin.",
        details: ["High-density cotton poplin", "Elasticated waistband with drawcord", "Deep slash pockets", "8-inch inseam"],
      },
      {
        id: "nw-02-03",
        itemNumber: 2,
        name: "Suede Moccasin",
        category: "Shoes",
        price: 118,
        sizes: ["40", "41", "42", "43", "44", "45"],
        lookNumber: 2,
        lookName: "Dial-Up",
        description: "Unstructured rough-out split suede slip-on with crepe natural rubber sole.",
        details: ["Genuine split cow suede", "Natural crepe rubber outsole", "Leather lined footbed", "Hand-stitched apron toe"],
      },
    ],
  },
  {
    number: 3,
    numberStr: "03",
    name: "Long Walks",
    footOffset: 0.0656,
    modelFile: "hf_20261111_034045_5a78f1ff-8dea-4054-85bc-60a28a4cc434.png",
    dots: [
      { left: 66, top: 47 },
      { left: 51, top: 64 },
      { left: 48, top: 87 },
    ],
    subtotal: 274,
    discount: 27.40,
    total: 246.60,
    products: [
      {
        id: "nw-03-01",
        itemNumber: 0,
        name: "Polar Fleece Zip",
        category: "Top",
        price: 92,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 3,
        lookName: "Long Walks",
        description: "Plush micro-fleece quarter zip sweater with elastic bound cuffs and hem.",
        details: ["320gsm thermal fleece", "YKK metal zipper pull", "Stand collar with chin guard", "Side zip hand pockets"],
      },
      {
        id: "nw-03-02",
        itemNumber: 1,
        name: "Nylon Hike Shorts",
        category: "Bottom",
        price: 58,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 3,
        lookName: "Long Walks",
        description: "Quick-drying taslan nylon outdoor shorts with integrated webbing belt.",
        details: ["Durable water repellent finish", "Magnetic snap cargo pocket", "Reinforced seat stitching", "Breathable mesh pocket bags"],
      },
      {
        id: "nw-03-03",
        itemNumber: 2,
        name: "Mesh Trainers",
        category: "Shoes",
        price: 124,
        sizes: ["40", "41", "42", "43", "44", "45"],
        lookNumber: 3,
        lookName: "Long Walks",
        description: "Open-cell breathable mesh low-profile sneaker with dual-density EVA midsole.",
        details: ["Engineered sandwich mesh", "Vibram rubber lug traction", "Removable cushioned insole", "Reflective heel tab"],
      },
    ],
  },
  {
    number: 4,
    numberStr: "04",
    name: "Low Battery",
    footOffset: 0.0582,
    modelFile: "hf_20261111_034059_24eecc7c-e8b7-4b9c-b58c-b862b1261e87.png",
    dots: [
      { left: 76, top: 47 },
      { left: 43, top: 70 },
      { left: 54, top: 88 },
    ],
    subtotal: 284,
    discount: 28.40,
    total: 255.60,
    products: [
      {
        id: "nw-04-01",
        itemNumber: 0,
        name: "Yellow Anorak Shell",
        category: "Outerwear",
        price: 128,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 4,
        lookName: "Low Battery",
        description: "Lightweight hooded pullover anorak crafted in pale ochre ripstop with storm flaps.",
        details: ["Waterproof 2.5-layer mini-ripstop", "Packable kangaroo pocket", "Adjustable shockcord hem and hood", "Taped critical seams"],
      },
      {
        id: "nw-04-02",
        itemNumber: 1,
        name: "Fleece Joggers",
        category: "Bottom",
        price: 72,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 4,
        lookName: "Low Battery",
        description: "Heavyweight French terry tapered sweatpants with ribbed ankles and deep pockets.",
        details: ["400gsm combed cotton loopback", "Chunky cotton drawstrings", "Hidden zippered back pocket", "Tapered tailored drape"],
      },
      {
        id: "nw-04-03",
        itemNumber: 2,
        name: "Chunky Sandals",
        category: "Shoes",
        price: 84,
        sizes: ["40", "41", "42", "43", "44", "45"],
        lookNumber: 4,
        lookName: "Low Battery",
        description: "Ergonomic molded footbed sandals with durable velcro nylon strap harness.",
        details: ["Anatomical molded EVA footbed", "Quick-drying neoprene lined straps", "Non-marking rubber compound outsole", "Ultra-lightweight"],
      },
    ],
  },
  {
    number: 5,
    numberStr: "05",
    name: "No Reply",
    footOffset: 0.065,
    modelFile: "hf_20261111_034112_5aa3a76f-7e92-48bb-b93d-ec3a35be2494.png",
    dots: [
      { left: 72, top: 41 },
      { left: 51, top: 68 },
      { left: 45, top: 89 },
    ],
    subtotal: 358,
    discount: 35.80,
    total: 322.20,
    products: [
      {
        id: "nw-05-01",
        itemNumber: 0,
        name: "Navy Rollneck Knit",
        category: "Top",
        price: 118,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 5,
        lookName: "No Reply",
        description: "Seamless extrafine Merino wool turtleneck sweater in deep midnight ink navy.",
        details: ["100% Extrafine Australian Merino", "Fully fashioned raglan sleeves", "Ribbed collar, cuffs, and hem", "Naturally temperature regulating"],
      },
      {
        id: "nw-05-02",
        itemNumber: 1,
        name: "Wool Trousers",
        category: "Bottom",
        price: 106,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 5,
        lookName: "No Reply",
        description: "Single pleat tailored trousers tailored in structured tropical wool blend.",
        details: ["70% Wool, 30% Recycled Poly", "Extended tab waist closure", "Unfinished hems for custom tailoring", "Lined to the knee"],
      },
      {
        id: "nw-05-03",
        itemNumber: 2,
        name: "Leather Mary Janes",
        category: "Shoes",
        price: 134,
        sizes: ["40", "41", "42", "43", "44", "45"],
        lookNumber: 5,
        lookName: "No Reply",
        description: "Polished smooth boxcalf leather single-strap shoe with stacked leather heel.",
        details: ["Full-grain calfskin leather", "Buckled instep strap", "Goodyear welted construction", "Hand-burnished leather edge"],
      },
    ],
  },
  {
    number: 6,
    numberStr: "06",
    name: "Analog",
    footOffset: 0.047,
    modelFile: "hf_20261111_034123_ce28dc23-bd91-40ba-95e6-7a09442a865f.png",
    dots: [
      { left: 75, top: 45 },
      { left: 51, top: 70 },
      { left: 46, top: 88 },
    ],
    subtotal: 400,
    discount: 40.00,
    total: 360.00,
    products: [
      {
        id: "nw-06-01",
        itemNumber: 0,
        name: "Corduroy Blazer",
        category: "Outerwear",
        price: 156,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 6,
        lookName: "Analog",
        description: "Unstructured two-button blazer tailored in supple fine-wale needlecord.",
        details: ["14-wale fine needlecord", "Patch hip pockets", "Soft unpadded shoulders", "Double vented back hem"],
      },
      {
        id: "nw-06-02",
        itemNumber: 1,
        name: "Black Slim Jeans",
        category: "Bottom",
        price: 98,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 6,
        lookName: "Analog",
        description: "13.5oz stay-black Japanese selvedge denim with clean rinsed finish.",
        details: ["100% Kuroki Mills cotton denim", "Redline selvedge ID", "Custom embossed matte hardware", "Slim straight leg profile"],
      },
      {
        id: "nw-06-03",
        itemNumber: 2,
        name: "Desert Boots",
        category: "Shoes",
        price: 146,
        sizes: ["40", "41", "42", "43", "44", "45"],
        lookNumber: 6,
        lookName: "Analog",
        description: "Classic two-eyelet chukka boot in supple oiled suede on plantation crepe soles.",
        details: ["Oiled water-resistant suede", "Cushioned leather insole", "Natural crepe sole", "Handcrafted in Spain"],
      },
    ],
  },
  {
    number: 7,
    numberStr: "07",
    name: "Rewind",
    footOffset: 0.0377,
    modelFile: "hf_20261111_034137_abed307a-bcb4-4192-82e9-6ec122a80820.png",
    dots: [
      { left: 69, top: 43 },
      { left: 51, top: 72 },
      { left: 56, top: 92 },
    ],
    subtotal: 296,
    discount: 29.60,
    total: 266.40,
    products: [
      {
        id: "nw-07-01",
        itemNumber: 0,
        name: "Faded Black Hoodie",
        category: "Top",
        price: 86,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 7,
        lookName: "Rewind",
        description: "Vintage wash heavy cotton fleece hoodie with double layered hood and dropped shoulders.",
        details: ["450gsm brushed back fleece", "Mineral enzyme wash treatment", "No drawstrings for minimal clean look", "Bar-tacked pocket corners"],
      },
      {
        id: "nw-07-02",
        itemNumber: 1,
        name: "Carpenter Trousers",
        category: "Bottom",
        price: 94,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 7,
        lookName: "Rewind",
        description: "Heavy canvas utility trousers equipped with hammer loop and dual tool pockets.",
        details: ["12oz washed cotton duck canvas", "Triple needle flat-felled seams", "Relaxed straight workwear fit", "Reinforced back pockets"],
      },
      {
        id: "nw-07-03",
        itemNumber: 2,
        name: "Retro Court Sneaker",
        category: "Shoes",
        price: 116,
        sizes: ["40", "41", "42", "43", "44", "45"],
        lookNumber: 7,
        lookName: "Rewind",
        description: "Minimalist leather tennis sneaker with perforated toe and vulcanized off-white cupsole.",
        details: ["Supple nappa leather upper", "Cotton terry toweling lining", "Stitched rubber cupsole", "Subtle debossed heel logo"],
      },
    ],
  },
  {
    number: 8,
    numberStr: "08",
    name: "Out Of Office",
    footOffset: 0.0891,
    modelFile: "hf_20261111_034150_fc1776ff-a8d6-4060-a8af-1afedfdfc563.png",
    dots: [
      { left: 65, top: 47 },
      { left: 43, top: 68 },
      { left: 60, top: 86 },
    ],
    subtotal: 206,
    discount: 20.60,
    total: 185.40,
    products: [
      {
        id: "nw-08-01",
        itemNumber: 0,
        name: "Linen Camp Shirt",
        category: "Top",
        price: 76,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 8,
        lookName: "Out Of Office",
        description: "Relaxed open-collar short sleeve shirt crafted from pure French flax linen.",
        details: ["100% Normandy Flax Linen", "Camp collar with loop closure", "Straight hem with side slits", "Mother of pearl buttons"],
      },
      {
        id: "nw-08-02",
        itemNumber: 1,
        name: "Pleated Bermuda",
        category: "Bottom",
        price: 68,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 8,
        lookName: "Out Of Office",
        description: "Wide-leg tailored Bermuda shorts in crisp garment-dyed cotton twill.",
        details: ["Medium-weight cotton twill", "Deep front box pleats", "Side welt pockets", "9.5-inch knee-length inseam"],
      },
      {
        id: "nw-08-03",
        itemNumber: 2,
        name: "Leather Slides",
        category: "Shoes",
        price: 62,
        sizes: ["40", "41", "42", "43", "44", "45"],
        lookNumber: 8,
        lookName: "Out Of Office",
        description: "Wide cross-strap slip-on sandal in vegetable-tanned leather with padded footbed.",
        details: ["Vegetable-tanned bridle leather", "Cushioned memory foam insole", "Flexible ridged rubber sole", "Tonal edge dressing"],
      },
    ],
  },
  {
    number: 9,
    numberStr: "09",
    name: "Paper Maps",
    footOffset: 0.0588,
    modelFile: "hf_20261111_034202_62b7ffb7-14f5-4dfc-87fe-83c6d9ee6134.png",
    dots: [
      { left: 66, top: 41 },
      { left: 48, top: 72 },
      { left: 56, top: 88 },
    ],
    subtotal: 294,
    discount: 29.40,
    total: 264.60,
    products: [
      {
        id: "nw-09-01",
        itemNumber: 0,
        name: "Rugby Top",
        category: "Top",
        price: 88,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 9,
        lookName: "Paper Maps",
        description: "Traditional heavy jersey long-sleeve rugby shirt with woven drill collar.",
        details: ["380gsm dry handle cotton", "Concealed rubber button placket", "Woven cotton twill collar", "Ribbed knit storm cuffs"],
      },
      {
        id: "nw-09-02",
        itemNumber: 1,
        name: "Tapered Khakis",
        category: "Bottom",
        price: 84,
        sizes: ["S", "M", "L", "XL"],
        lookNumber: 9,
        lookName: "Paper Maps",
        description: "Mid-rise washed chino trousers with gentle taper towards a clean hem.",
        details: ["100% Peached Cotton Twill", "Coin pocket detail at waist", "Horn button closures", "Garment dyed in Sand Grey"],
      },
      {
        id: "nw-09-03",
        itemNumber: 2,
        name: "Suede Low-Tops",
        category: "Shoes",
        price: 122,
        sizes: ["40", "41", "42", "43", "44", "45"],
        lookNumber: 9,
        lookName: "Paper Maps",
        description: "Low-profile skate-inspired sneaker in fine brushed pigskin suede with gum sole.",
        details: ["Premium calf suede upper", "Traditional gum rubber cupsole", "Waxed flat cotton laces", "Padded leather collar"],
      },
    ],
  },
];

// Flat list of all 27 products for catalog, search, and PDP
export const ALL_PRODUCTS: ProductItem[] = LOOKS.flatMap(look => look.products);

// Currency conversion rate: 1 USD = 280 PKR
export const USD_TO_PKR_RATE = 280;

// Format money in Pakistani Rupee (PKR) with thousands separators and true minus for discounts
export function formatMoney(amount: number): string {
  const pkr = Math.round(amount * USD_TO_PKR_RATE);
  return `PKR ${pkr.toLocaleString('en-US')}`;
}

export function formatDiscount(amount: number): string {
  const pkr = Math.round(amount * USD_TO_PKR_RATE);
  return `−PKR ${pkr.toLocaleString('en-US')}`;
}
