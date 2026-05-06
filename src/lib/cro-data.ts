import {
  BadgeCheck,
  Blocks,
  CalendarCheck,
  CheckCircle2,
  Home,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  SunMedium,
  ThermometerSun,
  Wand2,
} from "lucide-react";

export const trustItems = [
  { icon: Ruler, label: "Free In-Home Measure", sub: "Samples brought to you" },
  { icon: MapPin, label: "Melbourne Service", sub: "We come to your home" },
  { icon: ShieldCheck, label: "5-Year Warranty", sub: "Clear aftercare support" },
  { icon: BadgeCheck, label: "Professional Install", sub: "Measured and fitted properly" },
  { icon: CalendarCheck, label: "30+ Years Experience", sub: "Family-owned expertise" },
];

export const needCards = [
  {
    title: "Better Sleep",
    description: "Blockout Curtains, Blockout Blinds and Roller Shutters for darker, quieter Rooms.",
    href: "/curtains/blockout",
    icon: Sparkles,
  },
  {
    title: "Daytime Privacy",
    description: "Sheers, Sunscreen Blinds, Translucent Blinds and Double Rollers that soften Light without closing the Room in.",
    href: "/blinds/translucent-blinds",
    icon: Home,
  },
  {
    title: "Heat and Glare Control",
    description: "Honeycomb Blinds, Sunscreen Fabrics and Awnings for hot or west-facing Windows.",
    href: "/blinds/honeycomb-blinds",
    icon: ThermometerSun,
  },
  {
    title: "Security and Airflow",
    description: "Security Doors, Pet Mesh and Fly Screens measured to fit.",
    href: "/security",
    icon: ShieldCheck,
  },
  {
    title: "Outdoor Entertaining",
    description: "Zipscreens, Roller Shutters, Folding Arm Awnings and Exterior Shade Systems for Alfresco Comfort.",
    href: "/awnings",
    icon: SunMedium,
  },
  {
    title: "Smart Control",
    description: "Motorised Blinds, Curtains and Hubs for Schedules, Remotes, Apps and Voice Control.",
    href: "/motorisation",
    icon: Wand2,
  },
];

export const processSteps = [
  {
    title: "Book your free measure",
    description: "Tell us what you need help with and we will arrange a time to visit.",
  },
  {
    title: "We bring samples and measure",
    description: "See colours and textures in your own light while we check the right fit.",
  },
  {
    title: "You receive a clear quote",
    description: "We explain the recommended products, options and written pricing before anything is ordered.",
  },
  {
    title: "We make and install",
    description: "Your products are custom made and professionally installed with care.",
  },
];

export const categoryCards = [
  {
    title: "Curtains",
    description: "Sheer, blockout, double, Wavefold, pleated, velvet and motorised curtains.",
    href: "/curtains",
    image: "/assets/curtain_hero.png",
  },
  {
    title: "Blinds",
    description: "Roller, sunscreen, blockout, translucent, honeycomb, Venetian, Roman, vertical, panel glide and specialty blinds.",
    href: "/blinds",
    image: "/images/product-unique/mcb-blinds-category-hero.webp",
  },
  {
    title: "Plantation Shutters",
    description: "Timber, PVC and aluminium plantation shutter options.",
    href: "/shutters",
    image: "/images/product-unique/mcb-shutters-category-hero.webp",
  },
  {
    title: "Security Doors & Screens",
    description: "Security doors, fly screens, pet mesh and stainless mesh options.",
    href: "/security",
    image: "/images/product-unique/mcb-security-products-category-hero.webp",
  },
  {
    title: "Outdoor Products",
    description: "Zipscreens, roller shutters, folding arm, straight drop, auto, fixed guide and wire guide awnings.",
    href: "/awnings",
    image: "/images/product-unique/mcb-outdoor-products-category-hero.webp",
  },
  {
    title: "Motorisation",
    description: "Motorised blinds, curtains, awnings, remotes, hubs, schedules and smart-home control.",
    href: "/motorisation",
    image: "/assets/motorised_rollers.webp",
  },
];

export const navItems = [
  {
    label: "Blinds",
    href: "/blinds",
    groups: [
      {
        title: "Products",
        items: [
          { label: "Roller Blinds", href: "/blinds/roller-blinds" },
          { label: "Venetian Blinds", href: "/blinds/venetian-blinds" },
          { label: "Honeycomb Blinds", href: "/blinds/honeycomb-blinds" },
          { label: "Roman Blinds", href: "/blinds/roman-blinds" },
          { label: "Vertical Blinds", href: "/blinds/vertical-blinds" },
          { label: "Panel Glide Blinds", href: "/blinds/panel-glide" },
          { label: "Smart Drapes", href: "/blinds/soft-vertical-drapes" },
        ],
      },
      {
        title: "Type / Benefits",
        items: [
          { label: "Sunscreen Blinds", href: "/blinds/roller-blinds/sunscreen" },
          { label: "Blockout Blinds", href: "/blinds/roller-blinds/blockout" },
          { label: "Translucent Blinds", href: "/blinds/translucent-blinds" },
        ],
      },
      {
        title: "Specialised",
        items: [
          { label: "Motorised Blinds", href: "/blinds/motorised-blinds" },
          { label: "Cassette Blinds", href: "/blinds/cassette-blinds" },
          { label: "Skylight Blinds", href: "/blinds/skylight-blinds" },
        ],
      },
    ],
  },
  {
    label: "Curtains",
    href: "/curtains",
    groups: [
      {
        title: "Style",
        items: [
          { label: "Sheer Curtains", href: "/curtains/sheer" },
          { label: "Blockout Curtains", href: "/curtains/blockout" },
          { label: "Double Curtains", href: "/curtains/double-curtains" },
          { label: "Translucent Curtains", href: "/curtains/translucent-curtains" },
        ],
      },
      {
        title: "Heading Types",
        items: [
          { label: "Wavefold Curtains", href: "/curtains/s-fold-curtains" },
          { label: "Pleated Curtains", href: "/curtains/pleated-curtains" },
          { label: "Eyelet Curtains", href: "/curtains/eyelet-curtains" },
          { label: "Gathered Curtains", href: "/curtains/gathered-curtains" },
        ],
      },
      {
        title: "Specialty",
        items: [
          { label: "Motorised Curtains", href: "/curtains/motorised" },
          { label: "Linen-Look Curtains", href: "/curtains/linen-look" },
          { label: "Theatre Velvet", href: "/curtains/theatre-velvet" },
          { label: "Need Advice?", href: "/quote?product=Unsure%20-%20Need%20Advice" },
        ],
      },
    ],
  },
  {
    label: "Plantation Shutters",
    href: "/shutters",
    groups: [
      {
        title: "Our Range",
        items: [
          { label: "Plantation Shutters", href: "/shutters/plantation-shutters" },
          { label: "Timber Shutters", href: "/shutters/plantation-shutters/timber" },
          { label: "PVC Shutters", href: "/shutters/plantation-shutters/polymer" },
          { label: "Aluminium Shutters", href: "/shutters/plantation-shutters/aluminium" },
        ],
      },
    ],
  },
  {
    label: "Security",
    href: "/security",
    groups: [
      {
        title: "Protection",
        items: [
          { label: "Security Doors", href: "/security/security-doors" },
          { label: "Fly Screens", href: "/security/fly-screens" },
          { label: "Pet Mesh", href: "/security/pet-mesh" },
        ],
      },
    ],
  },
  {
    label: "Outdoor",
    href: "/awnings",
    groups: [
      {
        title: "Products",
        items: [
          { label: "Zipscreens", href: "/awnings/zipscreens" },
          { label: "Roller Shutters", href: "/shutters/roller-shutters" },
          { label: "Folding Arm Awnings", href: "/awnings/folding-arm-awnings" },
          { label: "Straight Drop Awnings", href: "/awnings/straight-drop-awnings" },
          { label: "Auto Awnings", href: "/awnings/auto-awnings" },
          { label: "Fixed Guide Awnings", href: "/awnings/fixed-guide-awnings" },
        ],
      },
      {
        title: "Specialty",
        items: [
          { label: "Motorised Outdoor Blinds", href: "/awnings/motorised-outdoor-blinds" },
          { label: "Wire Guide Awnings", href: "/awnings/wire-guide-awnings" },
        ],
      },
    ],
  },
  { label: "Motorisation", href: "/motorisation" },
];

export const quoteProductOptions = [
  "Unsure / Need Advice",
  "Curtains",
  "Sheer Curtains",
  "Blockout Curtains",
  "Double Curtains",
  "Wavefold Curtains",
  "Gathered Curtains",
  "Blinds",
  "Roller Blinds",
  "Blockout Blinds",
  "Double Roller Blinds",
  "Sunscreen Blinds",
  "Translucent Blinds",
  "Honeycomb Blinds",
  "Venetian Blinds",
  "Roman Blinds",
  "Vertical Blinds",
  "Panel Glide Blinds",
  "Motorised Blinds",
  "Cassette Blinds",
  "Skylight Blinds",
  "Smart Drapes",
  "Plantation Shutters",
  "Roller Shutters",
  "Security Doors",
  "Fly Screens",
  "Pet Mesh",
  "Zipscreens",
  "Folding Arm Awnings",
  "Straight Drop Awnings",
  "Auto Awnings",
  "Fixed Guide Awnings",
  "Motorised Outdoor Blinds",
  "Wire Guide Awnings",
  "Awnings",
  "Motorisation",
];

export const defaultFaq = [
  {
    question: "Is the measure and quote really free?",
    answer: "Yes. We visit your home, bring samples, measure the relevant windows or doors and provide a clear written quote before anything is ordered.",
  },
  {
    question: "Do I need to know which product I want before booking?",
    answer: "No. Our friendly team will help you and recommend suitable products based on privacy, light, heat, security and how each room is used.",
  },
  {
    question: "Can you help with more than one product at the same visit?",
    answer: "Yes. We can quote curtains, blinds, shutters, awnings, security doors and fly screens during the same appointment.",
  },
  {
    question: "Will you bring samples to my home?",
    answer: "Yes. Seeing fabrics, colours and textures in your own light is one of the biggest benefits of an in-home consultation.",
  },
];

export const comparisonIcons = {
  check: CheckCircle2,
  blocks: Blocks,
};
