import type { Category, Product } from "@/types/product";

export const categories: Category[] = [
  {
    name: "Phones",
    slug: "phones",
    description: "Flagship phones, foldables, and 5G daily drivers.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "Portable power for work, gaming, and creative studios.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Desktops",
    slug: "desktops",
    description: "Premium towers, compact workstations, and home setups.",
    image:
      "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Cameras",
    slug: "cameras",
    description: "Creator kits, mirrorless bodies, and streaming cameras.",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Audio, docks, keyboards, chargers, and everyday upgrades.",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "High-refresh gear, immersive audio, and pro controls.",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Smart Gadgets",
    slug: "smart-gadgets",
    description: "Wearables and connected devices for modern homes.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Networking",
    slug: "networking",
    description: "Routers, mesh systems, switches, and secure connectivity.",
    image:
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Components",
    slug: "components",
    description: "Memory, storage, GPUs, boards, and build essentials.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Repairs / Parts",
    slug: "repairs-parts",
    description: "Replacement parts, toolkits, cables, and service-ready gear.",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
  },
];

export const products: Product[] = [
  {
    id: "prod-001",
    name: "NovaPhone Pro 5G",
    slug: "novaphone-pro-5g",
    sku: "PH-NOVA-PRO-5G",
    brand: "NovaMobile",
    category: "Phones",
    shortDescription:
      "A flagship 5G phone with a bright OLED display and pro-grade camera system.",
    fullDescription:
      "NovaPhone Pro 5G pairs a durable aluminum body with a high-refresh OLED display, all-day battery life, and advanced computational photography.",
    price: 999,
    salePrice: 879,
    stockQuantity: 24,
    featuredImage:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    tags: ["5g", "oled", "flagship", "camera"],
    specifications: {
      Display: "6.7 inch OLED, 120Hz",
      Storage: "256GB",
      Camera: "Triple 48MP system",
      Battery: "5000mAh",
    },
    warrantyInfo: "1 year limited warranty with optional protection plan.",
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    id: "prod-002",
    name: "PocketEdge Fold",
    slug: "pocketedge-fold",
    sku: "PH-EDGE-FOLD",
    brand: "EdgeLab",
    category: "Phones",
    shortDescription:
      "Compact foldable phone built for multitasking and pocketable media.",
    fullDescription:
      "PocketEdge Fold gives mobile professionals a tablet-class workspace in a compact device with split-view productivity and premium hinge engineering.",
    price: 1499,
    salePrice: 1329,
    stockQuantity: 11,
    featuredImage:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
    tags: ["foldable", "productivity", "premium"],
    specifications: {
      Display: "7.6 inch folding AMOLED",
      Storage: "512GB",
      RAM: "12GB",
      Charging: "45W wired",
    },
    warrantyInfo: "1 year device warranty plus hinge service coverage.",
    status: "active",
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod-003",
    name: "VoltBook Air 14",
    slug: "voltbook-air-14",
    sku: "LT-VOLT-AIR14",
    brand: "VoltWorks",
    category: "Laptops",
    shortDescription:
      "Slim 14 inch laptop with fast performance and a color-accurate display.",
    fullDescription:
      "VoltBook Air 14 balances portability, battery life, and crisp visuals for students, founders, and remote teams.",
    price: 1199,
    salePrice: 1049,
    stockQuantity: 18,
    featuredImage:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    tags: ["ultrabook", "portable", "work"],
    specifications: {
      Processor: "12-core performance CPU",
      Memory: "16GB",
      Storage: "1TB SSD",
      Display: "14 inch 2.8K IPS",
    },
    warrantyInfo: "2 year premium support warranty.",
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod-004",
    name: "CreatorBook OLED 16",
    slug: "creatorbook-oled-16",
    sku: "LT-CREATOR-OLED16",
    brand: "FrameForge",
    category: "Laptops",
    shortDescription:
      "Creator laptop with OLED color, dedicated graphics, and studio-grade cooling.",
    fullDescription:
      "CreatorBook OLED 16 is tuned for designers, editors, and 3D workflows with a calibrated display and quiet thermal profile.",
    price: 2199,
    stockQuantity: 9,
    featuredImage:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    tags: ["creator", "oled", "graphics", "studio"],
    specifications: {
      Processor: "16-core creator CPU",
      Graphics: "8GB dedicated GPU",
      Memory: "32GB",
      Display: "16 inch 4K OLED",
    },
    warrantyInfo: "2 year warranty with accidental damage option.",
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod-005",
    name: "ForgeBook RTX 15",
    slug: "forgebook-rtx-15",
    sku: "LT-FORGE-RTX15",
    brand: "FrameForge",
    category: "Gaming",
    shortDescription:
      "High-refresh gaming laptop with performance cooling and RGB keyboard.",
    fullDescription:
      "ForgeBook RTX 15 is ready for competitive gaming, streaming, and heavy multitasking with a 165Hz display and dedicated graphics.",
    price: 1799,
    salePrice: 1599,
    stockQuantity: 15,
    featuredImage:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80",
    tags: ["gaming", "165hz", "rgb", "laptop"],
    specifications: {
      Processor: "14-core gaming CPU",
      Graphics: "12GB dedicated GPU",
      Memory: "32GB",
      Display: "15.6 inch 165Hz QHD",
    },
    warrantyInfo: "2 year gamer support warranty.",
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod-006",
    name: "Titan Mini Workstation",
    slug: "titan-mini-workstation",
    sku: "DT-TITAN-MINI",
    brand: "CoreHaus",
    category: "Desktops",
    shortDescription:
      "Compact workstation with serious power for office and studio desks.",
    fullDescription:
      "Titan Mini Workstation delivers desktop-class performance in a quiet, compact chassis for business, engineering, and media work.",
    price: 1399,
    stockQuantity: 13,
    featuredImage:
      "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=900&q=80",
    tags: ["desktop", "workstation", "compact"],
    specifications: {
      Processor: "12-core desktop CPU",
      Memory: "32GB",
      Storage: "2TB SSD",
      Ports: "Thunderbolt, USB-C, HDMI",
    },
    warrantyInfo: "3 year business warranty.",
    status: "active",
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod-007",
    name: "Prism Gaming Tower",
    slug: "prism-gaming-tower",
    sku: "DT-PRISM-TOWER",
    brand: "CoreHaus",
    category: "Desktops",
    shortDescription:
      "Showcase gaming tower with quiet airflow and upgrade-ready internals.",
    fullDescription:
      "Prism Gaming Tower blends a premium tempered-glass chassis, tuned airflow, and expandable internals for next-generation games.",
    price: 2499,
    salePrice: 2299,
    stockQuantity: 7,
    featuredImage:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80",
    tags: ["gaming", "desktop", "rgb", "tower"],
    specifications: {
      Processor: "16-core desktop CPU",
      Graphics: "16GB dedicated GPU",
      Memory: "64GB",
      Cooling: "Liquid CPU cooling",
    },
    warrantyInfo: "3 year parts and labor warranty.",
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod-008",
    name: "CaptureOne Mirrorless Kit",
    slug: "captureone-mirrorless-kit",
    sku: "CA-C1-MIRRORLESS",
    brand: "OpticNorth",
    category: "Cameras",
    shortDescription:
      "Mirrorless camera kit for sharp travel, studio, and product photography.",
    fullDescription:
      "CaptureOne Mirrorless Kit includes a stabilized body, versatile zoom lens, and fast autofocus for creators moving between photo and video.",
    price: 1299,
    salePrice: 1199,
    stockQuantity: 10,
    featuredImage:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80",
    tags: ["mirrorless", "camera", "creator", "video"],
    specifications: {
      Sensor: "26MP APS-C",
      Video: "4K 60fps",
      Lens: "18-55mm stabilized zoom",
      Autofocus: "425 point hybrid AF",
    },
    warrantyInfo: "1 year camera and lens warranty.",
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod-009",
    name: "StreamPro 4K Creator Cam",
    slug: "streampro-4k-creator-cam",
    sku: "CA-STREAMPRO-4K",
    brand: "OpticNorth",
    category: "Cameras",
    shortDescription:
      "4K webcam with low-light tuning, clean audio, and magnetic mounting.",
    fullDescription:
      "StreamPro 4K Creator Cam upgrades meetings, livestreams, and product demos with sharp optics and plug-and-play controls.",
    price: 229,
    stockQuantity: 31,
    featuredImage:
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=900&q=80",
    tags: ["webcam", "4k", "streaming", "creator"],
    specifications: {
      Resolution: "4K UHD",
      Microphones: "Dual noise-reducing mics",
      Mount: "Magnetic monitor mount",
      Connection: "USB-C",
    },
    warrantyInfo: "1 year replacement warranty.",
    status: "active",
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod-010",
    name: "ArcPods ANC",
    slug: "arcpods-anc",
    sku: "AC-ARCPODS-ANC",
    brand: "ArcSound",
    category: "Accessories",
    shortDescription:
      "Wireless noise-canceling earbuds with long battery life and premium tuning.",
    fullDescription:
      "ArcPods ANC offer immersive sound, adaptive noise cancellation, and a pocketable case for everyday carry.",
    price: 199,
    salePrice: 149,
    stockQuantity: 42,
    featuredImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    tags: ["audio", "wireless", "anc", "earbuds"],
    specifications: {
      Battery: "32 hours with case",
      Audio: "Adaptive ANC",
      Charging: "USB-C and wireless",
      Resistance: "IPX5 sweat resistant",
    },
    warrantyInfo: "1 year audio warranty.",
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod-011",
    name: "QuantumDock 12-in-1",
    slug: "quantumdock-12-in-1",
    sku: "AC-QDOCK-12",
    brand: "Portline",
    category: "Accessories",
    shortDescription:
      "Compact USB-C dock with display, network, card, and fast charging ports.",
    fullDescription:
      "QuantumDock 12-in-1 turns thin laptops into full workstations with dual display support and reliable power delivery.",
    price: 169,
    stockQuantity: 29,
    featuredImage:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
    tags: ["dock", "usb-c", "productivity", "accessory"],
    specifications: {
      Ports: "12 total",
      Display: "Dual 4K HDMI",
      Power: "100W passthrough",
      Network: "Gigabit ethernet",
    },
    warrantyInfo: "2 year accessory warranty.",
    status: "active",
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod-012",
    name: "MechLite Wireless Keyboard",
    slug: "mechlite-wireless-keyboard",
    sku: "AC-MECHLITE-WL",
    brand: "KeyArc",
    category: "Accessories",
    shortDescription:
      "Low-profile mechanical keyboard with multi-device pairing and quiet switches.",
    fullDescription:
      "MechLite Wireless Keyboard brings a precise typing feel, long battery life, and clean desk aesthetics to premium workstations.",
    price: 149,
    salePrice: 119,
    stockQuantity: 36,
    featuredImage:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80",
    tags: ["keyboard", "wireless", "mechanical", "desk"],
    specifications: {
      Layout: "75 percent low profile",
      Switches: "Quiet tactile",
      Battery: "90 days",
      Pairing: "3 devices",
    },
    warrantyInfo: "1 year keyboard warranty.",
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
];
