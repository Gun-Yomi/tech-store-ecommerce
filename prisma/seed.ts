import bcrypt from "bcryptjs";
import {
  CatalogStatus,
  PrismaClient,
  ProductStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  brandSlug: string;
  categorySlug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  featuredImage: string;
  images: string[];
  tags: string[];
  specifications: Record<string, string>;
  warrantyInfo: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
};

const catalogImages = {
  phones: "/catalog/placeholders/phones.svg",
  laptops: "/catalog/placeholders/laptops.svg",
  desktops: "/catalog/placeholders/desktops.svg",
  cameras: "/catalog/placeholders/cameras.svg",
  tablets: "/catalog/placeholders/tablets.svg",
  gaming: "/catalog/placeholders/gaming.svg",
  accessories: "/catalog/placeholders/accessories.svg",
  smart: "/catalog/placeholders/smart-gadgets.svg",
  networking: "/catalog/placeholders/networking.svg",
  components: "/catalog/placeholders/components.svg",
  repairs: "/catalog/placeholders/repairs-parts.svg",
};

const categories = [
  {
    name: "Phones",
    slug: "phones",
    description: "Flagship phones, foldables, and 5G daily drivers.",
    image: catalogImages.phones,
    icon: "Smartphone",
    isFeatured: true,
    sortOrder: 10,
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "Portable power for work, gaming, and creative studios.",
    image: catalogImages.laptops,
    icon: "Laptop",
    isFeatured: true,
    sortOrder: 20,
  },
  {
    name: "Desktops",
    slug: "desktops",
    description: "Premium towers, compact workstations, and home setups.",
    image: catalogImages.desktops,
    icon: "Monitor",
    isFeatured: true,
    sortOrder: 30,
  },
  {
    name: "Cameras",
    slug: "cameras",
    description: "Creator kits, mirrorless bodies, and streaming cameras.",
    image: catalogImages.cameras,
    icon: "Camera",
    isFeatured: true,
    sortOrder: 40,
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "Pen-ready tablets for field work, sketching, and travel.",
    image: catalogImages.tablets,
    icon: "Tablet",
    isFeatured: false,
    sortOrder: 50,
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "High-refresh gear, immersive audio, and pro controls.",
    image: catalogImages.gaming,
    icon: "Gamepad2",
    isFeatured: true,
    sortOrder: 60,
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Audio, docks, keyboards, chargers, and everyday upgrades.",
    image: catalogImages.accessories,
    icon: "Cable",
    isFeatured: true,
    sortOrder: 70,
  },
  {
    name: "Smart Gadgets",
    slug: "smart-gadgets",
    description: "Wearables and connected devices for modern homes.",
    image: catalogImages.smart,
    icon: "Watch",
    isFeatured: false,
    sortOrder: 80,
  },
  {
    name: "Networking",
    slug: "networking",
    description: "Routers, mesh systems, switches, and secure connectivity.",
    image: catalogImages.networking,
    icon: "Wifi",
    isFeatured: false,
    sortOrder: 90,
  },
  {
    name: "Components",
    slug: "components",
    description: "Memory, storage, GPUs, boards, and build essentials.",
    image: catalogImages.components,
    icon: "Cpu",
    isFeatured: false,
    sortOrder: 100,
  },
  {
    name: "Repairs / Parts",
    slug: "repairs-parts",
    description: "Replacement parts, toolkits, cables, and service-ready gear.",
    image: catalogImages.repairs,
    icon: "Wrench",
    isFeatured: false,
    sortOrder: 110,
  },
];

const brands = [
  {
    name: "Apex",
    slug: "apex",
    description: "High-end mobile and tablet hardware with long software support.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "NovaMobile",
    slug: "novamobile",
    description: "Flagship Android phones focused on cameras, displays, and battery life.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "EdgeLab",
    slug: "edgelab",
    description: "Experimental foldables and compact devices for mobile productivity.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "VoltWorks",
    slug: "voltworks",
    description: "Portable computers tuned for quiet performance and all-day runtime.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "FrameForge",
    slug: "frameforge",
    description: "Creator and gaming machines with calibrated displays and dedicated graphics.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "CoreHaus",
    slug: "corehaus",
    description: "Desktops and workstations for studios, engineers, and gaming rooms.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "OpticNorth",
    slug: "opticnorth",
    description: "Cameras and creator optics for streaming, product work, and travel.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "ArcSound",
    slug: "arcsound",
    description: "Wireless audio, microphones, and focused listening tools.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "Portline",
    slug: "portline",
    description: "Docks, charging, adapters, and repair-ready connectivity parts.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "KeyArc",
    slug: "keyarc",
    description: "Keyboards, input devices, and precise desk controls.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "Meshly",
    slug: "meshly",
    description: "Secure networking and smart home connectivity for modern spaces.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "PixelSmith",
    slug: "pixelsmith",
    description: "Color-first phones, cameras, and displays for visual creators.",
    logo: "/catalog/brands/brand.svg",
  },
  {
    name: "Northstar",
    slug: "northstar",
    description: "Rugged devices and field-ready tech for demanding environments.",
    logo: "/catalog/brands/brand.svg",
  },
];

const products: SeedProduct[] = [
  {
    name: "Apex Terra X1 5G",
    slug: "apex-terra-x1-5g",
    sku: "PH-APX-TERRA-X1",
    brandSlug: "apex",
    categorySlug: "phones",
    shortDescription: "Nature-inspired flagship phone with titanium rails and a bright LTPO display.",
    fullDescription:
      "Apex Terra X1 5G pairs a matte recycled alloy body with a color-accurate LTPO display, a large battery, and a triple-camera system built for travel, product photos, and daily work.",
    price: 109900,
    salePrice: 99900,
    stockQuantity: 28,
    featuredImage: catalogImages.phones,
    images: [catalogImages.phones, catalogImages.smart, catalogImages.accessories],
    tags: ["5g", "ltpo", "flagship", "wireless charging"],
    specifications: {
      Display: "6.8 inch LTPO OLED, 1-120Hz",
      Storage: "256GB",
      Camera: "50MP wide, 48MP ultra-wide, 12MP telephoto",
      Battery: "5100mAh with 45W fast charging",
    },
    warrantyInfo: "1 year limited warranty with optional accidental protection.",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    name: "NovaPhone Pro 5G",
    slug: "novaphone-pro-5g",
    sku: "PH-NOVA-PRO-5G",
    brandSlug: "novamobile",
    categorySlug: "phones",
    shortDescription: "Balanced pro phone with OLED, long battery life, and fast computational photography.",
    fullDescription:
      "NovaPhone Pro 5G is built for customers who want flagship polish without excess bulk, combining a bright display, efficient chipset, and dependable cameras.",
    price: 99900,
    salePrice: 87900,
    stockQuantity: 24,
    featuredImage: catalogImages.phones,
    images: [catalogImages.phones, catalogImages.cameras],
    tags: ["5g", "oled", "camera", "flagship"],
    specifications: {
      Display: "6.7 inch OLED, 120Hz",
      Storage: "256GB",
      Camera: "Triple 48MP camera system",
      Battery: "5000mAh",
    },
    warrantyInfo: "1 year limited warranty with express replacement option.",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    name: "PocketEdge Fold",
    slug: "pocketedge-fold",
    sku: "PH-EDGE-FOLD",
    brandSlug: "edgelab",
    categorySlug: "phones",
    shortDescription: "Compact foldable phone for split-screen work and pocketable media.",
    fullDescription:
      "PocketEdge Fold gives mobile professionals a tablet-class workspace in a compact phone with a reinforced hinge, split-view multitasking, and pen support.",
    price: 149900,
    salePrice: 132900,
    stockQuantity: 11,
    featuredImage: catalogImages.phones,
    images: [catalogImages.phones, catalogImages.tablets],
    tags: ["foldable", "productivity", "pen support"],
    specifications: {
      Display: "7.6 inch folding AMOLED",
      Storage: "512GB",
      Memory: "12GB",
      Charging: "45W wired",
    },
    warrantyInfo: "1 year device warranty plus hinge service coverage.",
    isNewArrival: true,
  },
  {
    name: "Apex Terra Mini",
    slug: "apex-terra-mini",
    sku: "PH-APX-TERRA-MINI",
    brandSlug: "apex",
    categorySlug: "phones",
    shortDescription: "Compact premium phone with flagship camera tuning and all-day power.",
    fullDescription:
      "Apex Terra Mini keeps premium materials and camera tuning in a smaller one-hand form factor for customers who want power without a huge screen.",
    price: 79900,
    stockQuantity: 21,
    featuredImage: catalogImages.phones,
    images: [catalogImages.phones, catalogImages.accessories],
    tags: ["compact", "5g", "premium", "oled"],
    specifications: {
      Display: "6.1 inch OLED, 120Hz",
      Storage: "128GB",
      Camera: "Dual 50MP camera system",
      Battery: "4300mAh",
    },
    warrantyInfo: "1 year limited warranty.",
    isFeatured: false,
    isNewArrival: true,
  },
  {
    name: "PixelSmith Note 7",
    slug: "pixelsmith-note-7",
    sku: "PH-PS-NOTE7",
    brandSlug: "pixelsmith",
    categorySlug: "phones",
    shortDescription: "Large-screen phone with stylus support and a calibrated creator display.",
    fullDescription:
      "PixelSmith Note 7 blends a pen-ready display, expandable workflow tools, and color-focused imaging for creators who edit and annotate on the go.",
    price: 89900,
    stockQuantity: 16,
    featuredImage: catalogImages.phones,
    images: [catalogImages.phones, catalogImages.tablets],
    tags: ["stylus", "creator", "large display", "productivity"],
    specifications: {
      Display: "6.9 inch AMOLED, 1440p",
      Storage: "256GB",
      Pen: "Low-latency active stylus",
      Camera: "50MP creator mode camera",
    },
    warrantyInfo: "1 year device and stylus warranty.",
    isBestSeller: true,
  },
  {
    name: "Northstar Field 5G",
    slug: "northstar-field-5g",
    sku: "PH-NS-FIELD5G",
    brandSlug: "northstar",
    categorySlug: "phones",
    shortDescription: "Rugged 5G phone with reinforced glass, glove mode, and long battery life.",
    fullDescription:
      "Northstar Field 5G is designed for service teams, job sites, and outdoor work with IP-rated protection, glove-friendly controls, and a replaceable battery module.",
    price: 64900,
    salePrice: 59900,
    stockQuantity: 14,
    featuredImage: catalogImages.phones,
    images: [catalogImages.phones, catalogImages.repairs],
    tags: ["rugged", "5g", "field work", "ip68"],
    specifications: {
      Display: "6.4 inch reinforced LCD",
      Rating: "IP68 water and dust resistant",
      Battery: "6200mAh replaceable pack",
      Connectivity: "5G, NFC, dual SIM",
    },
    warrantyInfo: "2 year rugged hardware warranty.",
  },
  {
    name: "VoltBook Air 14",
    slug: "voltbook-air-14",
    sku: "LT-VOLT-AIR14",
    brandSlug: "voltworks",
    categorySlug: "laptops",
    shortDescription: "Slim 14 inch laptop with fast performance and a color-accurate display.",
    fullDescription:
      "VoltBook Air 14 balances portability, battery life, and crisp visuals for students, founders, and remote teams who need a quiet daily machine.",
    price: 119900,
    salePrice: 104900,
    stockQuantity: 18,
    featuredImage: catalogImages.laptops,
    images: [catalogImages.laptops, catalogImages.accessories],
    tags: ["ultrabook", "portable", "work", "long battery"],
    specifications: {
      Processor: "12-core performance CPU",
      Memory: "16GB",
      Storage: "1TB SSD",
      Display: "14 inch 2.8K IPS",
    },
    warrantyInfo: "2 year premium support warranty.",
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "CreatorBook OLED 16",
    slug: "creatorbook-oled-16",
    sku: "LT-CREATOR-OLED16",
    brandSlug: "frameforge",
    categorySlug: "laptops",
    shortDescription: "Creator laptop with OLED color, dedicated graphics, and studio-grade cooling.",
    fullDescription:
      "CreatorBook OLED 16 is tuned for designers, editors, and 3D workflows with a calibrated display, dedicated GPU, and quiet thermal profile.",
    price: 219900,
    stockQuantity: 9,
    featuredImage: catalogImages.laptops,
    images: [catalogImages.laptops, catalogImages.cameras],
    tags: ["creator", "oled", "graphics", "studio"],
    specifications: {
      Processor: "16-core creator CPU",
      Graphics: "8GB dedicated GPU",
      Memory: "32GB",
      Display: "16 inch 4K OLED",
    },
    warrantyInfo: "2 year warranty with accidental damage option.",
    isFeatured: true,
    isNewArrival: true,
  },
  {
    name: "TrailBook Pro 13",
    slug: "trailbook-pro-13",
    sku: "LT-APX-TRAIL13",
    brandSlug: "apex",
    categorySlug: "laptops",
    shortDescription: "Ultra-light laptop with magnesium chassis and outdoor-readable display.",
    fullDescription:
      "TrailBook Pro 13 is a travel-first machine with a durable magnesium shell, bright low-power display, and compact charger for mobile professionals.",
    price: 139900,
    stockQuantity: 12,
    featuredImage: catalogImages.laptops,
    images: [catalogImages.laptops, catalogImages.smart],
    tags: ["travel", "lightweight", "business", "bright display"],
    specifications: {
      Processor: "10-core efficiency CPU",
      Memory: "16GB",
      Storage: "512GB SSD",
      Weight: "2.3 lb",
    },
    warrantyInfo: "2 year travel support warranty.",
    isNewArrival: true,
  },
  {
    name: "VoltBook Studio 15",
    slug: "voltbook-studio-15",
    sku: "LT-VOLT-STUDIO15",
    brandSlug: "voltworks",
    categorySlug: "laptops",
    shortDescription: "Performance laptop for analysis, development, and light creative work.",
    fullDescription:
      "VoltBook Studio 15 provides extra cooling headroom, generous ports, and a high-resolution screen for customers who split time between code, documents, and media.",
    price: 159900,
    salePrice: 144900,
    stockQuantity: 10,
    featuredImage: catalogImages.laptops,
    images: [catalogImages.laptops, catalogImages.desktops],
    tags: ["developer", "studio", "ports", "performance"],
    specifications: {
      Processor: "14-core workstation CPU",
      Memory: "32GB",
      Storage: "1TB SSD",
      Ports: "USB-C, HDMI, SD reader",
    },
    warrantyInfo: "2 year premium support warranty.",
    isBestSeller: true,
  },
  {
    name: "Titan Mini Workstation",
    slug: "titan-mini-workstation",
    sku: "DT-TITAN-MINI",
    brandSlug: "corehaus",
    categorySlug: "desktops",
    shortDescription: "Compact workstation with serious power for office and studio desks.",
    fullDescription:
      "Titan Mini Workstation delivers desktop-class performance in a quiet, compact chassis for business, engineering, and media work.",
    price: 139900,
    stockQuantity: 13,
    featuredImage: catalogImages.desktops,
    images: [catalogImages.desktops, catalogImages.components],
    tags: ["desktop", "workstation", "compact", "quiet"],
    specifications: {
      Processor: "12-core desktop CPU",
      Memory: "32GB",
      Storage: "2TB SSD",
      Ports: "Thunderbolt, USB-C, HDMI",
    },
    warrantyInfo: "3 year business warranty.",
    isBestSeller: true,
  },
  {
    name: "Prism Gaming Tower",
    slug: "prism-gaming-tower",
    sku: "DT-PRISM-TOWER",
    brandSlug: "corehaus",
    categorySlug: "desktops",
    shortDescription: "Showcase gaming tower with quiet airflow and upgrade-ready internals.",
    fullDescription:
      "Prism Gaming Tower blends a premium tempered-glass chassis, tuned airflow, and expandable internals for next-generation games.",
    price: 249900,
    salePrice: 229900,
    stockQuantity: 7,
    featuredImage: catalogImages.desktops,
    images: [catalogImages.desktops, catalogImages.gaming],
    tags: ["gaming", "desktop", "rgb", "tower"],
    specifications: {
      Processor: "16-core desktop CPU",
      Graphics: "16GB dedicated GPU",
      Memory: "64GB",
      Cooling: "Liquid CPU cooling",
    },
    warrantyInfo: "3 year parts and labor warranty.",
    isFeatured: true,
    isNewArrival: true,
  },
  {
    name: "CoreHaus Studio Cube",
    slug: "corehaus-studio-cube",
    sku: "DT-CORE-STUDIO-CUBE",
    brandSlug: "corehaus",
    categorySlug: "desktops",
    shortDescription: "Quiet creator desktop in a compact cube chassis with tool-free upgrades.",
    fullDescription:
      "CoreHaus Studio Cube is sized for creative desks and tuned for quiet rendering, fast storage, and easy access to memory and GPU upgrades.",
    price: 189900,
    stockQuantity: 8,
    featuredImage: catalogImages.desktops,
    images: [catalogImages.desktops, catalogImages.cameras],
    tags: ["creator", "desktop", "compact", "upgradeable"],
    specifications: {
      Processor: "14-core desktop CPU",
      Graphics: "12GB dedicated GPU",
      Memory: "32GB",
      Storage: "2TB NVMe SSD",
    },
    warrantyInfo: "3 year studio workstation warranty.",
    isFeatured: true,
  },
  {
    name: "CaptureOne Mirrorless Kit",
    slug: "captureone-mirrorless-kit",
    sku: "CA-C1-MIRRORLESS",
    brandSlug: "opticnorth",
    categorySlug: "cameras",
    shortDescription: "Mirrorless camera kit for sharp travel, studio, and product photography.",
    fullDescription:
      "CaptureOne Mirrorless Kit includes a stabilized body, versatile zoom lens, and fast autofocus for creators moving between photo and video.",
    price: 129900,
    salePrice: 119900,
    stockQuantity: 10,
    featuredImage: catalogImages.cameras,
    images: [catalogImages.cameras, catalogImages.accessories],
    tags: ["mirrorless", "camera", "creator", "video"],
    specifications: {
      Sensor: "26MP APS-C",
      Video: "4K 60fps",
      Lens: "18-55mm stabilized zoom",
      Autofocus: "425 point hybrid AF",
    },
    warrantyInfo: "1 year camera and lens warranty.",
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "StreamPro 4K Creator Cam",
    slug: "streampro-4k-creator-cam",
    sku: "CA-STREAMPRO-4K",
    brandSlug: "opticnorth",
    categorySlug: "cameras",
    shortDescription: "4K webcam with low-light tuning, clean audio, and magnetic mounting.",
    fullDescription:
      "StreamPro 4K Creator Cam upgrades meetings, livestreams, and product demos with sharp optics and plug-and-play controls.",
    price: 22900,
    stockQuantity: 31,
    featuredImage: catalogImages.cameras,
    images: [catalogImages.cameras, catalogImages.accessories],
    tags: ["webcam", "4k", "streaming", "creator"],
    specifications: {
      Resolution: "4K UHD",
      Microphones: "Dual noise-reducing mics",
      Mount: "Magnetic monitor mount",
      Connection: "USB-C",
    },
    warrantyInfo: "1 year replacement warranty.",
    isNewArrival: true,
  },
  {
    name: "FieldFrame Action 8K",
    slug: "fieldframe-action-8k",
    sku: "CA-FIELDFRAME-8K",
    brandSlug: "pixelsmith",
    categorySlug: "cameras",
    shortDescription: "Rugged 8K action camera with horizon lock and modular mounting.",
    fullDescription:
      "FieldFrame Action 8K is built for travel footage, shop documentation, and outdoor content with stabilized video and weather-sealed controls.",
    price: 44900,
    salePrice: 39900,
    stockQuantity: 17,
    featuredImage: catalogImages.cameras,
    images: [catalogImages.cameras, catalogImages.repairs],
    tags: ["action camera", "8k", "rugged", "stabilized"],
    specifications: {
      Video: "8K 30fps, 4K 120fps",
      Stabilization: "Horizon lock",
      Rating: "IP68 without case",
      Battery: "Endurance battery module",
    },
    warrantyInfo: "1 year action camera warranty.",
  },
  {
    name: "Apex Slate 11 Tablet",
    slug: "apex-slate-11-tablet",
    sku: "TB-APX-SLATE11",
    brandSlug: "apex",
    categorySlug: "tablets",
    shortDescription: "Thin 11 inch tablet with pen support, keyboard pins, and rich speakers.",
    fullDescription:
      "Apex Slate 11 Tablet is designed for notes, field forms, sketching, and media with a laminated display and optional keyboard cover support.",
    price: 69900,
    salePrice: 64900,
    stockQuantity: 19,
    featuredImage: catalogImages.tablets,
    images: [catalogImages.tablets, catalogImages.accessories],
    tags: ["tablet", "stylus", "portable", "media"],
    specifications: {
      Display: "11 inch 2.8K laminated display",
      Storage: "256GB",
      Pen: "Active pen support",
      Battery: "14 hours video playback",
    },
    warrantyInfo: "1 year tablet warranty.",
    isNewArrival: true,
  },
  {
    name: "ArcPods ANC",
    slug: "arcpods-anc",
    sku: "AC-ARCPODS-ANC",
    brandSlug: "arcsound",
    categorySlug: "accessories",
    shortDescription: "Wireless noise-canceling earbuds with long battery life and premium tuning.",
    fullDescription:
      "ArcPods ANC offer immersive sound, adaptive noise cancellation, and a pocketable case for everyday carry.",
    price: 19900,
    salePrice: 14900,
    stockQuantity: 42,
    featuredImage: catalogImages.accessories,
    images: [catalogImages.accessories, catalogImages.smart],
    tags: ["audio", "wireless", "anc", "earbuds"],
    specifications: {
      Battery: "32 hours with case",
      Audio: "Adaptive ANC",
      Charging: "USB-C and wireless",
      Resistance: "IPX5 sweat resistant",
    },
    warrantyInfo: "1 year audio warranty.",
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "QuantumDock 12-in-1",
    slug: "quantumdock-12-in-1",
    sku: "AC-QDOCK-12",
    brandSlug: "portline",
    categorySlug: "accessories",
    shortDescription: "Compact USB-C dock with display, network, card, and fast charging ports.",
    fullDescription:
      "QuantumDock 12-in-1 turns thin laptops into full workstations with dual display support and reliable power delivery.",
    price: 16900,
    stockQuantity: 29,
    featuredImage: catalogImages.accessories,
    images: [catalogImages.accessories, catalogImages.laptops],
    tags: ["dock", "usb-c", "productivity", "accessory"],
    specifications: {
      Ports: "12 total",
      Display: "Dual 4K HDMI",
      Power: "100W passthrough",
      Network: "Gigabit ethernet",
    },
    warrantyInfo: "2 year accessory warranty.",
    isNewArrival: true,
  },
  {
    name: "MechLite Wireless Keyboard",
    slug: "mechlite-wireless-keyboard",
    sku: "AC-MECHLITE-WL",
    brandSlug: "keyarc",
    categorySlug: "accessories",
    shortDescription: "Low-profile mechanical keyboard with multi-device pairing and quiet switches.",
    fullDescription:
      "MechLite Wireless Keyboard brings a precise typing feel, long battery life, and clean desk aesthetics to premium workstations.",
    price: 14900,
    salePrice: 11900,
    stockQuantity: 36,
    featuredImage: catalogImages.accessories,
    images: [catalogImages.accessories, catalogImages.laptops],
    tags: ["keyboard", "wireless", "mechanical", "desk"],
    specifications: {
      Layout: "75 percent low profile",
      Switches: "Quiet tactile",
      Battery: "90 days",
      Pairing: "3 devices",
    },
    warrantyInfo: "1 year keyboard warranty.",
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "ForgeBook RTX 15",
    slug: "forgebook-rtx-15",
    sku: "GM-FORGE-RTX15",
    brandSlug: "frameforge",
    categorySlug: "gaming",
    shortDescription: "High-refresh gaming laptop with performance cooling and RGB keyboard.",
    fullDescription:
      "ForgeBook RTX 15 is ready for competitive gaming, streaming, and heavy multitasking with a 165Hz display and dedicated graphics.",
    price: 179900,
    salePrice: 159900,
    stockQuantity: 15,
    featuredImage: catalogImages.gaming,
    images: [catalogImages.gaming, catalogImages.laptops],
    tags: ["gaming", "165hz", "rgb", "laptop"],
    specifications: {
      Processor: "14-core gaming CPU",
      Graphics: "12GB dedicated GPU",
      Memory: "32GB",
      Display: "15.6 inch 165Hz QHD",
    },
    warrantyInfo: "2 year gamer support warranty.",
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "PulsePad Pro Controller",
    slug: "pulsepad-pro-controller",
    sku: "GM-PULSEPAD-PRO",
    brandSlug: "frameforge",
    categorySlug: "gaming",
    shortDescription: "Hall-effect wireless controller with remappable controls and low-latency mode.",
    fullDescription:
      "PulsePad Pro Controller adds durable hall-effect sticks, trigger locks, and profile switching for PC and living-room gaming setups.",
    price: 12900,
    stockQuantity: 22,
    featuredImage: catalogImages.gaming,
    images: [catalogImages.gaming, catalogImages.accessories],
    tags: ["controller", "wireless", "hall effect", "gaming"],
    specifications: {
      Sticks: "Hall-effect analog sticks",
      Battery: "40 hours",
      Connectivity: "2.4GHz, Bluetooth, USB-C",
      Profiles: "3 onboard profiles",
    },
    warrantyInfo: "1 year controller warranty.",
    isNewArrival: true,
  },
  {
    name: "Meshly Home Mesh 6E",
    slug: "meshly-home-mesh-6e",
    sku: "NW-MESHLY-6E",
    brandSlug: "meshly",
    categorySlug: "networking",
    shortDescription: "Tri-band mesh Wi-Fi 6E system for fast, secure whole-home coverage.",
    fullDescription:
      "Meshly Home Mesh 6E uses dedicated backhaul, app-guided setup, and built-in network health tools for modern homes and small offices.",
    price: 39900,
    salePrice: 34900,
    stockQuantity: 18,
    featuredImage: catalogImages.networking,
    images: [catalogImages.networking, catalogImages.smart],
    tags: ["wifi 6e", "mesh", "router", "security"],
    specifications: {
      Standard: "Wi-Fi 6E tri-band",
      Coverage: "Up to 6,000 sq ft",
      Ports: "2.5GbE WAN, Gigabit LAN",
      Security: "Automatic firmware and threat alerts",
    },
    warrantyInfo: "2 year networking warranty.",
    isFeatured: true,
  },
  {
    name: "Meshly Sense Hub",
    slug: "meshly-sense-hub",
    sku: "SG-MESHLY-SENSE",
    brandSlug: "meshly",
    categorySlug: "smart-gadgets",
    shortDescription: "Matter-ready smart home hub with local automation and privacy controls.",
    fullDescription:
      "Meshly Sense Hub connects sensors, lights, and energy devices while keeping common automation local for faster response and better privacy.",
    price: 17900,
    stockQuantity: 25,
    featuredImage: catalogImages.smart,
    images: [catalogImages.smart, catalogImages.networking],
    tags: ["smart home", "matter", "automation", "privacy"],
    specifications: {
      Standards: "Matter, Thread, Zigbee",
      Automations: "Local routines",
      Network: "Ethernet and Wi-Fi",
      Privacy: "On-device event rules",
    },
    warrantyInfo: "1 year smart device warranty.",
    isNewArrival: true,
  },
  {
    name: "Portline Precision Repair Kit",
    slug: "portline-precision-repair-kit",
    sku: "RP-PORT-PRECISION",
    brandSlug: "portline",
    categorySlug: "repairs-parts",
    shortDescription: "Precision toolkit with bits, spudgers, mat, and ESD-safe handling tools.",
    fullDescription:
      "Portline Precision Repair Kit gives technicians and careful DIY customers the core tools for opening laptops, phones, controllers, and compact devices.",
    price: 7900,
    stockQuantity: 34,
    featuredImage: catalogImages.repairs,
    images: [catalogImages.repairs, catalogImages.components],
    tags: ["repair", "toolkit", "esd", "parts"],
    specifications: {
      Bits: "64 precision steel bits",
      Tools: "Spudgers, picks, tweezers, suction handle",
      Safety: "ESD-safe mat and wrist strap",
      Case: "Magnetic folding case",
    },
    warrantyInfo: "Lifetime warranty on hand tools under normal use.",
    isBestSeller: true,
  },
  {
    name: "CoreHaus NVMe Pro 2TB",
    slug: "corehaus-nvme-pro-2tb",
    sku: "CP-CORE-NVME-2TB",
    brandSlug: "corehaus",
    categorySlug: "components",
    shortDescription: "High-endurance PCIe 4.0 NVMe drive for upgrades, builds, and repairs.",
    fullDescription:
      "CoreHaus NVMe Pro 2TB provides fast load times, strong sustained writes, and a slim heat spreader for desktops, laptops, and external enclosures.",
    price: 18900,
    salePrice: 15900,
    stockQuantity: 27,
    featuredImage: catalogImages.components,
    images: [catalogImages.components, catalogImages.repairs],
    tags: ["ssd", "nvme", "component", "upgrade"],
    specifications: {
      Capacity: "2TB",
      Interface: "PCIe 4.0 x4 NVMe",
      Read: "Up to 7,200 MB/s",
      Endurance: "1,200 TBW",
    },
    warrantyInfo: "5 year component warranty.",
    isFeatured: true,
  },
  {
    name: "Draft Lab Prototype Phone",
    slug: "draft-lab-prototype-phone",
    sku: "PH-DRAFT-HIDDEN",
    brandSlug: "edgelab",
    categorySlug: "phones",
    shortDescription: "Internal draft product used to verify public catalog filtering.",
    fullDescription:
      "This draft product is intentionally hidden from public catalog pages and exists only to validate status filtering.",
    price: 999900,
    stockQuantity: 1,
    featuredImage: catalogImages.phones,
    images: [catalogImages.phones],
    tags: ["hidden", "draft"],
    specifications: {
      Visibility: "Draft only",
    },
    warrantyInfo: "Not available.",
    status: ProductStatus.DRAFT,
  },
  {
    name: "Archived Desk Dock",
    slug: "archived-desk-dock",
    sku: "AC-ARCHIVED-DOCK",
    brandSlug: "portline",
    categorySlug: "accessories",
    shortDescription: "Archived product used to verify public catalog filtering.",
    fullDescription:
      "This archived product is intentionally hidden from public catalog pages and product detail routes.",
    price: 9900,
    stockQuantity: 0,
    featuredImage: catalogImages.accessories,
    images: [catalogImages.accessories],
    tags: ["hidden", "archived"],
    specifications: {
      Visibility: "Archived only",
    },
    warrantyInfo: "Not available.",
    status: ProductStatus.ARCHIVED,
  },
];

async function seedAdminUser() {
  const email = process.env.DEFAULT_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.DEFAULT_ADMIN_PASSWORD;
  const name = process.env.DEFAULT_ADMIN_NAME?.trim() || "Local Admin";

  if (!email || !password) {
    console.log(
      "Skipping admin seed. Set DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD to create a local admin user.",
    );
    return;
  }

  if (password.length < 8) {
    throw new Error("DEFAULT_ADMIN_PASSWORD must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
    create: {
      name,
      email,
      passwordHash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
  });

  console.log(`Seeded local admin user: ${email}`);
}

async function seedCatalog() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        ...category,
        status: CatalogStatus.ACTIVE,
      },
      create: {
        ...category,
        status: CatalogStatus.ACTIVE,
      },
    });
  }

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        ...brand,
        status: CatalogStatus.ACTIVE,
      },
      create: {
        ...brand,
        status: CatalogStatus.ACTIVE,
      },
    });
  }

  const categoryRecords = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const brandRecords = await prisma.brand.findMany({
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(
    categoryRecords.map((category) => [category.slug, category.id]),
  );
  const brandIdBySlug = new Map(
    brandRecords.map((brand) => [brand.slug, brand.id]),
  );

  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    const brandId = brandIdBySlug.get(product.brandSlug);

    if (!categoryId || !brandId) {
      throw new Error(`Missing catalog relation for ${product.slug}.`);
    }

    const productRecord = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        sku: product.sku,
        brandId,
        categoryId,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        price: product.price,
        salePrice: product.salePrice ?? null,
        stockQuantity: product.stockQuantity,
        featuredImage: product.featuredImage,
        tags: JSON.stringify(product.tags),
        specifications: JSON.stringify(product.specifications),
        warrantyInfo: product.warrantyInfo,
        status: product.status ?? ProductStatus.ACTIVE,
        isFeatured: product.isFeatured ?? false,
        isNewArrival: product.isNewArrival ?? false,
        isBestSeller: product.isBestSeller ?? false,
      },
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        brandId,
        categoryId,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        price: product.price,
        salePrice: product.salePrice ?? null,
        stockQuantity: product.stockQuantity,
        featuredImage: product.featuredImage,
        tags: JSON.stringify(product.tags),
        specifications: JSON.stringify(product.specifications),
        warrantyInfo: product.warrantyInfo,
        status: product.status ?? ProductStatus.ACTIVE,
        isFeatured: product.isFeatured ?? false,
        isNewArrival: product.isNewArrival ?? false,
        isBestSeller: product.isBestSeller ?? false,
      },
      select: { id: true },
    });

    await prisma.productImage.deleteMany({
      where: { productId: productRecord.id },
    });

    await prisma.productImage.createMany({
      data: product.images.map((url, index) => ({
        productId: productRecord.id,
        url,
        altText: `${product.name} image ${index + 1}`,
        sortOrder: index,
      })),
    });
  }

  console.log(
    `Seeded catalog: ${categories.length} categories, ${brands.length} brands, ${products.length} products.`,
  );
}

async function main() {
  await seedAdminUser();
  await seedCatalog();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
