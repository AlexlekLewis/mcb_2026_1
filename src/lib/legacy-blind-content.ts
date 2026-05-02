import type { Metadata } from "next";

type ProductFeature = {
  title: string;
  description: string;
};

type ComparisonRow = {
  label: string;
  bestFor: string;
  notes: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type LegacyBlindContent = {
  metadata: Metadata;
  intentLabel: string;
  decisionGuide: ProductFeature[];
  comparisonRows: ComparisonRow[];
  faq: FaqItem[];
};

const siteName = "Modern Curtains and Blinds";

function pageMetadata(title: string, description: string, image: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export const legacyBlindContent: Record<string, LegacyBlindContent> = {
  rollerBlinds: {
    metadata: pageMetadata(
      `Custom Roller Blinds Melbourne | ${siteName}`,
      "Custom roller blinds for Melbourne homes. Compare blockout, sunscreen, light filtering, double roller and motorised options with a free in-home measure and quote.",
      "/assets/roller_blinds_interior.png"
    ),
    intentLabel: "Custom roller blind advice",
    decisionGuide: [
      {
        title: "Choose blockout for bedrooms",
        description: "Blockout roller fabrics are best when privacy, darkness and night-time comfort matter most.",
      },
      {
        title: "Choose sunscreen for glare",
        description: "Sunscreen fabrics reduce glare and UV exposure while keeping daytime outlook through the glass.",
      },
      {
        title: "Choose double roller for both",
        description: "A dual bracket combines sunscreen during the day with blockout privacy at night.",
      },
    ],
    comparisonRows: [
      { label: "Blockout roller", bestFor: "Bedrooms and media rooms", notes: "Privacy and room darkening in a clean, simple profile." },
      { label: "Sunscreen roller", bestFor: "Living rooms and bright windows", notes: "Reduces glare while keeping daytime connection to the view." },
      { label: "Light filtering roller", bestFor: "Soft privacy", notes: "Lets natural light glow through without the heavy look of blockout." },
      { label: "Motorised roller", bestFor: "Large or hard-to-reach windows", notes: "Adds remote, app or smart-home control where suitable." },
    ],
    faq: [
      {
        question: "Are roller blinds good for Melbourne homes?",
        answer: "Yes. Roller blinds are one of the most versatile choices for Melbourne homes because they suit bedrooms, living areas, apartments, sliding doors and larger window banks.",
      },
      {
        question: "Can I combine sunscreen and blockout roller blinds?",
        answer: "Yes. Double roller blinds combine two fabrics on one bracket, usually sunscreen for daytime glare control and blockout for night privacy.",
      },
      {
        question: "Do you bring roller blind samples to my home?",
        answer: "Yes. During the free in-home measure and quote, we bring suitable fabric samples so you can compare colour, texture and opacity in your own light.",
      },
    ],
  },
  blockoutBlinds: {
    metadata: pageMetadata(
      `Blockout Blinds Melbourne | ${siteName}`,
      "Made-to-measure blockout blinds for bedrooms, nurseries, media rooms and privacy-focused spaces across Melbourne. Book a free in-home measure and quote.",
      "/images/blockout-blinds.png"
    ),
    intentLabel: "Room darkening and privacy",
    decisionGuide: [
      {
        title: "Bedrooms and nurseries",
        description: "Blockout fabrics are the practical choice when sleep, privacy and morning light control are the priority.",
      },
      {
        title: "Media rooms",
        description: "A blockout roller helps reduce unwanted light on screens while keeping the window treatment simple.",
      },
      {
        title: "Pair with sheers or sunscreen",
        description: "For rooms used day and night, pair blockout with a softer privacy layer for more flexible control.",
      },
    ],
    comparisonRows: [
      { label: "Blockout roller", bestFor: "Clean modern windows", notes: "Simple, compact and cost effective." },
      { label: "Blockout roman", bestFor: "Softer decorative rooms", notes: "Adds fabric texture and a more furnished look." },
      { label: "Double roller", bestFor: "Day and night use", notes: "Adds sunscreen or translucent control on the same opening." },
    ],
    faq: [
      {
        question: "Do blockout blinds make a room completely dark?",
        answer: "The fabric blocks light, but small edge gaps can remain depending on the window reveal and fitting method. We explain the best fit during the measure.",
      },
      {
        question: "Are blockout blinds suitable for bedrooms?",
        answer: "Yes. They are one of the most common choices for bedrooms because they improve privacy and help control early morning light.",
      },
      {
        question: "Can blockout blinds be motorised?",
        answer: "Yes. Many roller blind systems can be motorised, which is useful for wide windows, high windows and rooms with multiple blinds.",
      },
    ],
  },
  sunscreenBlinds: {
    metadata: pageMetadata(
      `Sunscreen Blinds Melbourne | ${siteName}`,
      "Custom sunscreen roller blinds for glare reduction, UV control and daytime privacy across Melbourne homes. Free in-home measure and quote.",
      "/images/sunscreen-blinds.png"
    ),
    intentLabel: "Glare reduction and daytime comfort",
    decisionGuide: [
      {
        title: "Best for bright living spaces",
        description: "Sunscreen fabrics help reduce glare on screens while keeping the room bright and connected to the outlook.",
      },
      {
        title: "Pair with blockout for night privacy",
        description: "Sunscreen blinds are transparent at night when lights are on, so many homes pair them with blockout blinds.",
      },
      {
        title: "Choose openness carefully",
        description: "Lower openness gives more daytime privacy, while higher openness preserves more view.",
      },
    ],
    comparisonRows: [
      { label: "Tighter screen weave", bestFor: "More privacy", notes: "Reduces visibility while still filtering light." },
      { label: "More open screen weave", bestFor: "Better outlook", notes: "Keeps more view through the blind in daylight." },
      { label: "Double roller pairing", bestFor: "Day and night rooms", notes: "Adds blockout privacy once the sun goes down." },
    ],
    faq: [
      {
        question: "Can you see through sunscreen blinds at night?",
        answer: "At night, if the lights are on inside, people may be able to see in. For night privacy, pair sunscreen blinds with blockout blinds or curtains.",
      },
      {
        question: "Do sunscreen blinds help with heat?",
        answer: "They can help reduce glare and solar exposure through the window, especially on bright west and north-facing rooms.",
      },
      {
        question: "Are sunscreen blinds good for offices and living rooms?",
        answer: "Yes. They are popular in rooms where glare, daytime comfort and maintaining a view are more important than full darkness.",
      },
    ],
  },
  doubleRollerBlinds: {
    metadata: pageMetadata(
      `Double Roller Blinds Melbourne | ${siteName}`,
      "Custom double roller blinds combining sunscreen and blockout fabrics for day and night control. Free Melbourne measure and quote.",
      "/images/double-roller-hero.png"
    ),
    intentLabel: "Day and night blind control",
    decisionGuide: [
      {
        title: "Best when one fabric is not enough",
        description: "Double rollers solve the common problem of wanting daytime glare control and night privacy on the same window.",
      },
      {
        title: "Keep the profile neat",
        description: "A dual bracket keeps both fabrics on the same opening without needing a separate curtain layer.",
      },
      {
        title: "Consider motorisation",
        description: "Motorisation can be useful when a room has several double rollers or wide glass openings.",
      },
    ],
    comparisonRows: [
      { label: "Sunscreen front", bestFor: "Daytime glare", notes: "Preserves outlook while softening harsh light." },
      { label: "Blockout rear", bestFor: "Night privacy", notes: "Closes the room off when privacy or darkness is needed." },
      { label: "Motorised dual rollers", bestFor: "Convenience", notes: "Controls each blind layer independently where suitable." },
    ],
    faq: [
      {
        question: "Are double roller blinds bulky?",
        answer: "They use a dual bracket, so they need more space than a single roller blind. We check reveal depth and clearance during the measure.",
      },
      {
        question: "Can I choose different colours for each fabric?",
        answer: "Yes. Many customers choose a neutral sunscreen fabric and a coordinating blockout fabric for the room-facing layer.",
      },
      {
        question: "Where do double roller blinds work best?",
        answer: "They work especially well in living areas, bedrooms and apartments where one window needs different levels of control across the day.",
      },
    ],
  },
  honeycombBlinds: {
    metadata: pageMetadata(
      `Honeycomb Blinds Melbourne | Cellular Blinds | ${siteName}`,
      "Energy-conscious honeycomb and cellular blinds for insulation, privacy and compact stacking. Free in-home measure and quote across Melbourne.",
      "/images/product-unique/mcb-honeycomb-blinds-clean-energy-efficient-room-hero.webp"
    ),
    intentLabel: "Insulation and compact blind design",
    decisionGuide: [
      {
        title: "Use for temperature comfort",
        description: "The cellular structure traps air at the window, helping improve comfort in rooms exposed to heat or cold.",
      },
      {
        title: "Use top-down bottom-up for privacy",
        description: "This option lets you admit light from the top while keeping the lower part of the window covered.",
      },
      {
        title: "Use for tricky windows",
        description: "Honeycomb blinds can suit skylights and compact reveals where a neat stack is important.",
      },
    ],
    comparisonRows: [
      { label: "Translucent honeycomb", bestFor: "Soft filtered light", notes: "Maintains privacy while keeping rooms bright." },
      { label: "Blockout honeycomb", bestFor: "Bedrooms", notes: "Adds room darkening and thermal comfort." },
      { label: "Top-down bottom-up", bestFor: "Street-facing windows", notes: "Balances privacy and daylight beautifully." },
    ],
    faq: [
      {
        question: "Are honeycomb blinds good for insulation?",
        answer: "Yes. Their cellular structure creates an air pocket at the glass, which helps improve thermal comfort compared with a flat fabric blind.",
      },
      {
        question: "Do honeycomb blinds suit bedrooms?",
        answer: "Yes. Blockout honeycomb fabrics are a strong choice for bedrooms, while translucent fabrics suit living areas where softness and privacy matter.",
      },
      {
        question: "Can honeycomb blinds work on skylights?",
        answer: "They can be a good option for skylights depending on the window system, size and access. We confirm suitability during the measure.",
      },
    ],
  },
  venetianBlinds: {
    metadata: pageMetadata(
      `Venetian Blinds Melbourne | Timber, PVC and Aluminium | ${siteName}`,
      "Custom Venetian blinds in timber, PVC composite and aluminium for precise light, privacy and airflow control. Free Melbourne measure and quote.",
      "/images/product-unique/mcb-urban-wood-venetian-blinds-hero.webp"
    ),
    intentLabel: "Tilt control for light, privacy and airflow",
    decisionGuide: [
      {
        title: "Timber for warmth",
        description: "Timber venetians add texture and natural warmth to living rooms, studies and bedrooms.",
      },
      {
        title: "PVC composite for wet areas",
        description: "Moisture-resistant options are better suited to kitchens, laundries and bathrooms.",
      },
      {
        title: "Aluminium for a crisp profile",
        description: "Aluminium venetians suit contemporary spaces where a slimmer, more minimal finish is preferred.",
      },
    ],
    comparisonRows: [
      { label: "Timber", bestFor: "Warmth and texture", notes: "A premium look for dry living spaces." },
      { label: "PVC composite", bestFor: "Wet areas", notes: "More moisture tolerant than natural timber." },
      { label: "Aluminium", bestFor: "Slim, modern windows", notes: "Durable and easy to wipe down." },
    ],
    faq: [
      {
        question: "Are Venetian blinds good for privacy?",
        answer: "Yes. The tilting slats make it easy to control privacy while still allowing light and airflow.",
      },
      {
        question: "Which Venetian material is best for bathrooms?",
        answer: "PVC composite or aluminium is generally more suitable for moisture-prone spaces than natural timber.",
      },
      {
        question: "Can Venetian blinds be matched to interior colours?",
        answer: "Yes. We bring samples so you can compare slat finishes against flooring, joinery, paint and furniture.",
      },
    ],
  },
  romanBlinds: {
    metadata: pageMetadata(
      `Roman Blinds Melbourne | Soft Fabric Blinds | ${siteName}`,
      "Custom Roman blinds for soft folds, tailored fabric texture and privacy in Melbourne bedrooms and living rooms. Free in-home measure and quote.",
      "/assets/roman_blinds_closeup.png"
    ),
    intentLabel: "Soft fabric blinds with a tailored finish",
    decisionGuide: [
      {
        title: "Choose for softness",
        description: "Roman blinds add fabric texture and warmth where a roller blind may feel too minimal.",
      },
      {
        title: "Choose lining by room",
        description: "Blockout lining suits bedrooms, while translucent fabrics suit living areas and soft daytime light.",
      },
      {
        title: "Coordinate with curtains",
        description: "Romans can be made from curtain-style fabrics for a cohesive look across the home.",
      },
    ],
    comparisonRows: [
      { label: "Translucent roman", bestFor: "Soft daytime privacy", notes: "Shows fabric texture while filtering light." },
      { label: "Blockout roman", bestFor: "Bedrooms", notes: "Adds privacy, room darkening and a fuller fabric finish." },
      { label: "Textured roman", bestFor: "Feature windows", notes: "Creates a more decorated, interior-led look." },
    ],
    faq: [
      {
        question: "Are Roman blinds good for bedrooms?",
        answer: "Yes. With blockout lining they are a strong bedroom option, especially when you want a softer decorative finish.",
      },
      {
        question: "Do Roman blinds stack at the top?",
        answer: "Yes. Roman blinds fold upward into a fabric stack, so we consider available head space during the measure.",
      },
      {
        question: "Can Roman blinds match curtains?",
        answer: "Often, yes. We can advise on fabrics that coordinate with curtains, sheers and other furnishings.",
      },
    ],
  },
  verticalBlinds: {
    metadata: pageMetadata(
      `Vertical Blinds Melbourne | Sliding Door Blinds | ${siteName}`,
      "Custom vertical blinds for sliding doors, wide windows and practical light control. Free Melbourne measure and quote.",
      "/images/product-unique/mcb-vertical-blinds-sliding-door-hero.webp"
    ),
    intentLabel: "Practical control for sliding doors",
    decisionGuide: [
      {
        title: "Best for wide openings",
        description: "Vertical blinds stack sideways, making them practical for sliding doors and large expanses of glass.",
      },
      {
        title: "Control sun angle",
        description: "Rotating blades let you redirect light without opening the whole blind.",
      },
      {
        title: "Keep access easy",
        description: "Choose stack direction based on how you walk through the door and where furniture sits.",
      },
    ],
    comparisonRows: [
      { label: "Fabric verticals", bestFor: "Soft practical rooms", notes: "A flexible option for living rooms and sliding doors." },
      { label: "PVC verticals", bestFor: "High-use spaces", notes: "Easy to clean and practical for rentals or family homes." },
      { label: "Split stack", bestFor: "Centred doors", notes: "Opens from the middle where the opening suits it." },
    ],
    faq: [
      {
        question: "Are vertical blinds still a good option?",
        answer: "Yes. Modern fabrics and tracks make them a practical choice for sliding doors, large windows and budget-conscious projects.",
      },
      {
        question: "Can vertical blinds stack to either side?",
        answer: "Yes. Stack direction can usually be set left, right or split, depending on the opening and access pattern.",
      },
      {
        question: "Are vertical blinds easy to clean?",
        answer: "They are generally easy to maintain, especially PVC options. Fabric choices vary, so we recommend the right material for the room.",
      },
    ],
  },
  panelGlide: {
    metadata: pageMetadata(
      `Panel Glide Blinds Melbourne | Sliding Panel Blinds | ${siteName}`,
      "Panel glide blinds for wide windows, sliding doors, wardrobes and room dividers. Free in-home measure and quote across Melbourne.",
      "/images/product-unique/mcb-panel-glide-blinds-sliding-door-hero.webp"
    ),
    intentLabel: "Wide opening and sliding door advice",
    decisionGuide: [
      {
        title: "Use for contemporary wide glass",
        description: "Panel glides create a clean, architectural look on large openings where smaller blades can look busy.",
      },
      {
        title: "Match roller fabrics",
        description: "Panels can often be made in fabrics that coordinate with roller blinds elsewhere in the home.",
      },
      {
        title: "Consider stack space",
        description: "The panels need somewhere to stack, so track width and furniture position matter.",
      },
    ],
    comparisonRows: [
      { label: "Blockout panels", bestFor: "Privacy and glare control", notes: "Creates a strong, simple finish on wide glass." },
      { label: "Screen panels", bestFor: "Daytime outlook", notes: "Softens sun while retaining connection to outside." },
      { label: "Room divider", bestFor: "Flexible layouts", notes: "Can separate zones where the track system allows it." },
    ],
    faq: [
      {
        question: "Are panel glide blinds good for sliding doors?",
        answer: "Yes. They are designed for wide openings and slide sideways, which makes them a strong alternative to vertical blinds.",
      },
      {
        question: "Can panel glide blinds be used as room dividers?",
        answer: "In many cases, yes. Ceiling-mounted tracks can create flexible room zones or wardrobe screening.",
      },
      {
        question: "Do panel glide blinds need a lot of space?",
        answer: "They need enough width for the panels to stack when open. We measure and advise on track layout during the consultation.",
      },
    ],
  },
};
