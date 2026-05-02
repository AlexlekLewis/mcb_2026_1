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
    title: "Better sleep",
    description: "Blockout curtains, blockout blinds and roller shutters for darker, quieter rooms.",
    href: "/curtains/blockout",
    icon: Sparkles,
  },
  {
    title: "Daytime privacy",
    description: "Sheers, sunscreen blinds, translucent blinds and double rollers that soften light without closing the room in.",
    href: "/blinds/translucent-blinds",
    icon: Home,
  },
  {
    title: "Heat and glare control",
    description: "Honeycomb blinds, sunscreen fabrics and awnings for hot or west-facing windows.",
    href: "/blinds/honeycomb-blinds",
    icon: ThermometerSun,
  },
  {
    title: "Security and airflow",
    description: "Security doors, window screens, pet mesh and fly screens measured to fit.",
    href: "/security",
    icon: ShieldCheck,
  },
  {
    title: "Outdoor entertaining",
    description: "Zipscreens, folding arm awnings and outdoor shutters for alfresco comfort.",
    href: "/awnings",
    icon: SunMedium,
  },
  {
    title: "Smart control",
    description: "Motorised blinds, curtains and hubs for schedules, remotes, apps and voice control.",
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
    description: "Sheer, blockout, double, S-Fold, pleated, velvet and motorised curtains.",
    href: "/curtains",
    image: "/assets/curtain_hero.png",
  },
  {
    title: "Blinds",
    description: "Roller, sunscreen, blockout, translucent, honeycomb, Venetian, Roman, vertical, panel glide and specialty blinds.",
    href: "/blinds",
    image: "/assets/roller_blind_hero.png",
  },
  {
    title: "Plantation Shutters",
    description: "Timber, polymer/PVC, aluminium, outdoor and roller shutter options.",
    href: "/shutters",
    image: "/images/plantation-shutters-hero.png",
  },
  {
    title: "Security Doors & Screens",
    description: "Security doors, fly screens, pet mesh, window screens and stainless mesh options.",
    href: "/security",
    image: "/images/security-door-hero.png",
  },
  {
    title: "Outdoor Blinds & Awnings",
    description: "Zipscreens, folding arm awnings, window awnings, outdoor shutters and alfresco shade.",
    href: "/awnings",
    image: "/assets/awning_hero.png",
  },
  {
    title: "Motorisation",
    description: "Motorised blinds, curtains, awnings, remotes, hubs, schedules and smart-home control.",
    href: "/motorisation",
    image: "/assets/motorised_rollers.png",
  },
];

export const navItems = [
  {
    label: "Blinds",
    href: "/blinds",
    groups: [
      {
        title: "Popular",
        items: [
          { label: "Roller Blinds", href: "/blinds/roller-blinds" },
          { label: "Sunscreen Blinds", href: "/blinds/roller-blinds/sunscreen" },
          { label: "Venetian Blinds", href: "/blinds/venetian-blinds" },
          { label: "Honeycomb Blinds", href: "/blinds/honeycomb-blinds" },
          { label: "Roman Blinds", href: "/blinds/roman-blinds" },
        ],
      },
      {
        title: "Light & Privacy",
        items: [
          { label: "Blockout Blinds", href: "/blinds/roller-blinds/blockout" },
          { label: "Sunscreen Blinds", href: "/blinds/roller-blinds/sunscreen" },
          { label: "Translucent Blinds", href: "/blinds/translucent-blinds" },
          { label: "Venetian Blinds", href: "/blinds/venetian-blinds" },
          { label: "Vertical Blinds", href: "/blinds/vertical-blinds" },
          { label: "Panel Glide Blinds", href: "/blinds/panel-glide" },
        ],
      },
      {
        title: "Specialized",
        items: [
          { label: "Motorised Blinds", href: "/blinds/motorised-blinds" },
          { label: "Cassette Blinds", href: "/blinds/cassette-blinds" },
          { label: "Skylight Blinds", href: "/blinds/skylight-blinds" },
          { label: "Veri Shades", href: "/blinds/veri-shades" },
        ],
      },
    ],
  },
  {
    label: "Curtains",
    href: "/curtains",
    groups: [
      {
        title: "Styles",
        items: [
          { label: "Sheer Curtains", href: "/curtains/sheer" },
          { label: "Blockout Curtains", href: "/curtains/blockout" },
          { label: "S-Fold Curtains", href: "/curtains/s-fold-curtains" },
          { label: "Double Curtains", href: "/curtains" },
        ],
      },
      {
        title: "Headings",
        items: [
          { label: "Pleated Curtains", href: "/curtains/pleated-curtains" },
          { label: "Eyelet Curtains", href: "/curtains/eyelet-curtains" },
          { label: "Linen-Look Curtains", href: "/curtains/linen-look" },
          { label: "Velvet Curtains", href: "/curtains/velvet" },
        ],
      },
      {
        title: "Specialty",
        items: [
          { label: "Translucent Curtains", href: "/curtains/translucent-curtains" },
          { label: "Theatre Velvet", href: "/curtains/theatre-velvet" },
          { label: "Motorised Curtains", href: "/curtains/motorised" },
          { label: "Need Advice?", href: "/quote?product=Unsure%20-%20Need%20Advice" },
        ],
      },
    ],
  },
  {
    label: "Shutters",
    href: "/shutters",
    groups: [
      {
        title: "Our Range",
        items: [
          { label: "Plantation Shutters", href: "/shutters/plantation-shutters" },
          { label: "Timber Shutters", href: "/shutters/plantation-shutters/timber" },
          { label: "Polymer/PVC Shutters", href: "/shutters/plantation-shutters/polymer" },
          { label: "Aluminium Shutters", href: "/shutters/plantation-shutters/aluminium" },
          { label: "Roller Shutters", href: "/shutters/roller-shutters" },
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
          { label: "Pet Mesh", href: "/security/fly-screens" },
          { label: "Window Security Screens", href: "/security" },
        ],
      },
    ],
  },
  {
    label: "Outdoor",
    href: "/awnings",
    groups: [
      {
        title: "Shade & Shelter",
        items: [
          { label: "Zipscreens", href: "/awnings/zipscreens" },
          { label: "Outdoor Blinds", href: "/awnings/zipscreens" },
          { label: "Folding Arm Awnings", href: "/awnings" },
          { label: "Window Awnings", href: "/awnings" },
          { label: "Outdoor Shutters", href: "/shutters/plantation-shutters/aluminium" },
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
  "S-Fold Curtains",
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
  "Veri Shades",
  "Plantation Shutters",
  "Roller Shutters",
  "Security Doors",
  "Fly Screens",
  "Pet Mesh",
  "Outdoor Blinds",
  "Zipscreens",
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
    answer: "No. Choose the unsure option and we will recommend suitable products based on privacy, light, heat, security and how each room is used.",
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
