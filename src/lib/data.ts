
export interface Product {
    slug: string;
    category: string;
    title: string;
    description: string;
    heroImage: string;
    intro: {
        heading: string;
        body: string;
    };
    features: {
        title: string;
        description: string;
    }[];
    benefits?: string[]; // Added specifically for the popover
    faq: {
        question: string;
        answer: string;
    }[];
}

export const productData: Product[] = [
    // --- CURTAINS ---
    {
        slug: "sheer-curtains",
        category: "Curtains",
        title: "Custom Sheer Curtains | Soft minimalism & Light Diffusion",
        description: "Create elegant, airy interiors with premium custom-made Sheer Curtains. Expertly crafted in Melbourne in S-Fold, Pencil Pleat, and more.",
        heroImage: "/images/sheer-curtain-detail.png",
        intro: {
            heading: "Sheer Curtains: The Essence of Soft Minimalism",
            body: "Transform your living space with the ethereal beauty of Custom Sheer Curtains. Designed to diffuse natural light while providing daytime privacy, our sheers add a layer of sophisticated softness to any room. Whether you prefer the modern, fluid lines of an S-Fold heading or the classic elegance of a Pinch Pleat, our collection features organic textures and linen-look fabrics that bring the outdoors in."
        },
        features: [
            { title: "Light Diffusion", description: "Filters harsh UV rays, protecting furniture while keeping rooms bright." },
            { title: "Daytime Privacy", description: "See out without being seen in during the day." },
            { title: "S-Fold Heading", description: "Signature 'waving' track system for perfect, uniform folds." }
        ],
        benefits: [
            "Softens harsh sunlight",
            "Enhances interior depth",
            "Daytime privacy",
            "UV protection for furniture"
        ],
        faq: [
            { question: "Do sheer curtains provide privacy at night?", answer: "No, sheers are transparent at night when lights are on inside. We recommend pairing with Blockout Blinds or lining." },
            { question: "What is the best track for sheers?", answer: "S-Fold (Wave Fold) is the most popular choice for a simplified, modern aesthetic." }
        ]
    },
    {
        slug: "blockout-curtains",
        category: "Curtains",
        title: "Blockout Curtains | Total Privacy & Thermal Insulation",
        description: "Sleep better and save energy with heavy-duty Blockout Curtains. 100% light blocking and superior thermal efficiency.",
        heroImage: "/assets/blockout_curtains.png",
        intro: {
            heading: "Blockout Curtains: Sanctuary & Silence",
            body: "Create your personal sanctuary with our heavy-duty Blockout Curtains. Engineered for total light exclusion and superior thermal insulation, these curtains are essential for Australian homes. They trap a layer of air to keep your home cool in summer and warm in winter."
        },
        features: [
            { title: "100% Light Block", description: "Ideal for shift workers, nurseries, and media rooms." },
            { title: "Thermal Efficiency", description: "Reduces heat transfer by up to 40%, lowering energy costs." },
            { title: "Acoustic Dampening", description: "Heavy fabrics absorb street noise for a quieter home." }
        ],
        benefits: [
            "Complete darkness for better sleep",
            "Reduces energy bills",
            "Sound absorption",
            "Total privacy"
        ],
        faq: [
            { question: "Difference between thermal and blockout?", answer: "All blockout curtains offer thermal benefits. Dedicated Thermal Curtains may have specific flocking, but our Blockout range serves both purposes effectively." }
        ]
    },
    {
        slug: "translucent-curtains",
        category: "Curtains",
        title: "Translucent Curtains | Light Filtering Privacy",
        description: "The perfect balance between light filtering and privacy. Soften sunlight while reducing glare without darkening the room.",
        heroImage: "/images/sfold-translucent.png",
        intro: {
            heading: "Translucent Curtains: The Perfect Balance",
            body: "Translucent curtains offer the perfect middle ground between sheers and blockouts. They filter sunlight to create a soft, ambient glow while providing complete visual privacy day and night(silhouettes may be visible close up at night). Ideal for living areas where you want natural light but need privacy from neighbours."
        },
        features: [
            { title: "Light Filtering", description: "Allows natural light in but softens it to reduce glare." },
            { title: "Privacy", description: "Prevents view-through from outside while maintaining brightness." },
            { title: "UV Protection", description: "Reduces fading of floors and furniture." }
        ],
        benefits: [
            "Soft ambient light",
            "Glare reduction",
            "Enhanced privacy compared to sheers",
            "Protects interiors"
        ],
        faq: []
    },
    {
        slug: "velvet-curtains",
        category: "Curtains",
        title: "Velvet Curtains | Luxury & Drama",
        description: "Add a touch of opulence with rich, heavy Velvet Curtains. Excellent for theatre rooms and formal living spaces.",
        heroImage: "/images/velvet-curtains-hero.png",
        intro: {
            heading: "Velvet Curtains: Opulence & Warmth",
            body: "For a look of pure luxury, nothing compares to Velvet Curtains. Their dense pile absorbs light and sound, creating a cozy, intimate atmosphere. Perfect for formal dining rooms, master bedrooms, or home theatres where you want to make a dramatic statement."
        },
        features: [
            { title: "Rich Texture", description: "Deep, luxurious pile that catches the light beautifully." },
            { title: "Superior Insulation", description: "Heavy weight provides excellent thermal properties." },
            { title: "Cinema Quality", description: "Absorbs stray light and sound for the ultimate movie experience." }
        ],
        benefits: [
            "High-end luxury aesthetic",
            "Warm and cozy feel",
            "Excellent soundproofing",
            "Durable fabric"
        ],
        faq: []
    },


    // --- BLINDS ---
    {
        slug: "blockout-roller-blinds",
        category: "Roller Blinds",
        title: "Blockout Roller Blinds | Sleek Privacy",
        description: "Minimalist design with maximum function. 100% privacy and light control. Custom made in Melbourne.",
        heroImage: "/assets/roller_blockout_detail.png",
        intro: {
            heading: "Blockout Roller Blinds: Sleek & Functional",
            body: "The standard for modern functionality, our Blockout Roller Blinds offer a clean, minimalist aesthetic with maximum performance. When rolled down, they provide complete privacy and darkness. When rolled up, they disappear, leaving your view unobstructed."
        },
        features: [
            { title: "Ultimate Privacy", description: "Prevents silhouettes and shadows from being seen outside." },
            { title: "Space Saving", description: "Fits neatly into the window reveal (Recess Fit)." },
            { title: "Easy Clean", description: "Durable fabrics that are simple to wipe down." }
        ],
        benefits: [
            "Complete privacy",
            "Clean, modern look",
            "Easy maintenance",
            "Cost-effective"
        ],
        faq: []
    },
    {
        slug: "sunscreen-roller-blinds",
        category: "Roller Blinds",
        title: "Sunscreen Roller Blinds | View & UV Protection",
        description: "Maintain your view while blocking heat and UV rays. The ideal choice for open-plan living areas.",
        heroImage: "/images/sunscreen-blinds.png",
        intro: {
            heading: "Sunscreen Blinds: Protection Without Losing the View",
            body: "Sunscreen blinds are a technical marvel, allowing you to see out while blocking up to 95% of UV rays and heat. They reduce glare on screens and protect your floors from fading, all while maintaining a connection to the outside world during the day."
        },
        features: [
            { title: "Glare Reduction", description: "Perfect for home offices and TV rooms." },
            { title: "UV Block", description: "Blocks 95% of harmful UV rays." },
            { title: "See-Through", description: "Maintain your view to the outdoors." }
        ],
        benefits: [
            "Reduces heat",
            "Protects furniture",
            "Reduces glare",
            "Keeps room bright"
        ],
        faq: []
    },
    {
        slug: "double-roller-blinds",
        category: "Roller Blinds",
        title: "Double Roller Blinds | Day & Night Flexibility",
        description: "The best of both worlds. Combine a Sunscreen/Sheer blind with a Blockout blind on one bracket.",
        heroImage: "/images/double-roller-hero.png",
        intro: {
            heading: "Double Roller Blinds: 24/7 Flexibility",
            body: "Why choose between views and privacy when you can have both? Our Double Roller Blinds feature two blinds on a single bracket: a Sunscreen for the day and a Blockout for the night. This dual system gives you complete control over your environment."
        },
        features: [
            { title: "Dual Function", description: "Daytime views + Nighttime privacy." },
            { title: "Compact System", description: "Both blinds fit on a single streamlined bracket." }
        ],
        benefits: [
            "Versatility",
            "Total light control",
            "Modern aesthetic",
            "Space efficient"
        ],
        faq: []
    },
    {
        slug: "roman-blinds",
        category: "Blinds",
        title: "Roman Blinds | Classic Soft Folds",
        description: "Classical elegance meets modern design. Featuring soft, folding fabrics for a sophisticated look.",
        heroImage: "/assets/roman_blinds_hero.png",
        intro: {
            heading: "Roman Blinds: Timeless Elegance",
            body: "Roman Blinds bring the softness of curtains with the functionality of a blind. Featuring clean, horizontal folds that stack neatly when raised, they add a touch of formal sophistication to any room. Available in a vast range of blockout and light-filtering fabrics."
        },
        features: [
            { title: "Soft Aesthetic", description: "Adds texture and warmth to the window." },
            { title: "Versatile Styling", description: "Suits both traditional and contemporary homes." }
        ],
        benefits: [
            "Luxurious look",
            "Good insulation (fabric dependent)",
            "Softens window hard lines",
            "Customisable fabrics"
        ],
        faq: []
    },
    {
        slug: "venetian-blinds",
        category: "Blinds",
        title: "Venetian Blinds | Timber & Aluminium",
        description: " precise light control with classic horizontal slats. Available in Timber, Faux Wood, and Aluminium.",
        heroImage: "/images/venetian-blinds-hero.png",
        intro: {
            heading: "Venetian Blinds: Precise Control",
            body: "Venetian blinds offer unparalleled control over light and privacy. By simply tilting the slats, you can direct sunlight exactly where you want it or close them tight for privacy. Choose from warm Timber for a natural look, moisture-resistant Faux Wood for wet areas, or sleek Aluminium for a modern touch."
        },
        features: [
            { title: "Light Regulation", description: "Tilt slats to filter light without losing it completely." },
            { title: "Material Options", description: "Timber, PVC (Faux Wood), and Aluminium." },
            { title: "Ventilation", description: "Allows airflow while maintaining privacy." }
        ],
        benefits: [
            "Excellent light control",
            "Good airflow",
            "Classic style",
            "Durable materials"
        ],
        faq: []
    },
    {
        slug: "vertical-blinds",
        category: "Blinds",
        title: "Vertical Blinds | Practical & Versatile",
        description: "The ideal solution for large windows and sliding doors. Control light and privacy with rotating vertical blades.",
        heroImage: "/assets/vertical_blinds_modern.png",
        intro: {
            heading: "Vertical Blinds: Dynamic Light Control",
            body: "Vertical Blinds are back in style with modern fabrics and sleek tracking systems. They are the most practical solution for large expanses of glass and sliding doors, allowing you to walk through the blind easily. Rotate the blades 180 degrees to follow the sun or stack them neatly to the side."
        },
        features: [
            { title: "Ideal for Sliding Doors", description: "Blades can retract to left, right, or split center." },
            { title: "Light Direction", description: "Rotate blades to block sun but keep views." }
        ],
        benefits: [
            "Great for large windows",
            "Cost-effective",
            "Easy operation",
            "Low maintenance"
        ],
        faq: []
    },
    {
        slug: "honeycomb-blinds",
        category: "Blinds",
        title: "Honeycomb (Cellular) Blinds | Superior Insulation",
        description: "Save on energy bills with the unique cellular structure that traps air. The most energy-efficient blind on the market.",
        heroImage: "/assets/honeycomb_blinds.png",
        intro: {
            heading: "Honeycomb Blinds: Science Meets Style",
            body: "Also known as Cellular Blinds, these feature a unique honeycomb-shaped air pocket that acts as a powerful insulator. They trap air at the window, keeping your home warm in winter and cool in summer. With a sleek profile and minimal stack height, they utilize space efficiently."
        },
        features: [
            { title: "Energy Efficient", description: "Unmatched thermal insulation properties." },
            { title: "Top-Down/Bottom-Up", description: "Option to lower from the top for light while keeping privacy at the bottom." },
            { title: "Sound Absorption", description: "Cellular structure dampens outside noise." }
        ],
        benefits: [
            "Reduces energy costs",
            "Versatile light control",
            "Modern, tidy look",
            "Great for skylights"
        ],
        faq: []
    },


    // --- SHUTTERS ---
    {
        slug: "plantation-shutters",
        category: "Shutters",
        title: "Plantation Shutters | Timeless Sophistication",
        description: "The ultimate window furnishing for value and style. Available in PVC, Timber, and Aluminium.",
        heroImage: "/images/plantation-shutters-hero.png",
        intro: {
            heading: "Plantation Shutters: A Permanent Investment",
            body: "Plantation Shutters are more than just a window covering; they are a permanent addition to your home that adds value and curb appeal. With adjustable louvers, they offer excellent airflow and light control. Choose from PVC for wet areas, sustainable Timber for living spaces, or Aluminium for outdoors."
        },
        features: [
            { title: "Kerb Appeal", description: "Looks beautiful from both inside and outside." },
            { title: "Durability", description: "Built to last decades with minimal maintenance." },
            { title: "Insulation", description: "Good thermal barrier when closed." }
        ],
        benefits: [
            "Adds property value",
            "Superior light control",
            "Excellent airflow",
            "Child safe (no cords)"
        ],
        faq: []
    },
    {
        slug: "roller-shutters",
        category: "Shutters",
        title: "Roller Shutters | Security & Insulation",
        description: "Heavy-duty exterior shutters for maximum security, noise reduction, and total blockout.",
        heroImage: "/images/roller-shutters.png",
        intro: {
            heading: "Roller Shutters: Fortress-Like Protection",
            body: "Roller Shutters provide a robust physical barrier against intruders, noise, and weather. Constructed from interlocking aluminium slats filled with insulating foam, they reduce outside noise by up to 50% and provide complete darkness, making them perfect for shift workers and security-conscious homeowners."
        },
        features: [
            { title: "Security", description: "Visual and physical deterrent to break-ins." },
            { title: "Noise Reduction", description: "Significantly blocks traffic and neighbourhood noise." },
            { title: "Total Blockout", description: "Achieves near 100% darkness." }
        ],
        benefits: [
            "High security",
            "Thermal insulation",
            "Soundproofing",
            "Storm protection"
        ],
        faq: []
    },


    // --- OUTDOOR ---
    {
        slug: "zipscreens",
        category: "Outdoor",
        title: "Zipscreen Blinds | Enclose Your Alfresco",
        description: "Turn your outdoor area into a year-round room. Block wind, rain, and sun/insects.",
        heroImage: "/assets/zipscreen_blinds.png",
        intro: {
            heading: "Zipscreens: Outdoor Living, Refined",
            body: "Take control of your outdoor entertainment area with Zipscreen Blinds. Using a patented track-guided system, the fabric is locked into side channels, creating a seal against wind, rain, and bugs. It allows you to entertain outdoors regardless of the weather."
        },
        features: [
            { title: "Wind & Rain Protection", description: "Strong track system withstands gusts." },
            { title: "Insect Barrier", description: "Seals the space against mosquitoes." },
            { title: "UV Block", description: "Reduces heat on your patio." }
        ],
        benefits: [
            "Extends living space",
            "Year-round entertaining",
            "Protects outdoor furniture",
            "Motorisation options"
        ],
        faq: []
    },
    {
        slug: "awnings",
        category: "Outdoor",
        title: "Awnings | Shade & Style",
        description: "Protect your windows and patios from the harsh Australian sun with our range of stylish awnings.",
        heroImage: "/assets/awning_hero.png",
        intro: {
            heading: "Awnings: First Line of Defence",
            body: "Stop the sun before it hits your glass. External Awnings are the most effective way to cool your home, preventing heat from entering your windows. From Auto-Lock arms to Folding Arm Awnings for patios, we have a solution for every exterior."
        },
        features: [
            { title: "Heat Reduction", description: "Stops solar gain before it enters the home." },
            { title: "Retractable", description: "Fold away when not needed or in bad weather." }
        ],
        benefits: [
            "Reduces cooling costs",
            "Protects interiors from UV",
            "Adds street appeal",
            "Shades outdoor areas"
        ],
        faq: []
    },


    // --- SECURITY ---
    {
        slug: "security-doors",
        category: "Security",
        title: "Security Doors | Style Meets Safety",
        description: "Protect your family without compromising on style. Custom made security doors and screens.",
        heroImage: "/images/security-door-hero.png",
        intro: {
            heading: "Secure Your Home in Style",
            body: "Our range of security doors offers the highest level of protection while maintaining the aesthetic appeal of your home entrance."
        },
        features: [
            { title: "316 Marine Grade", description: "Invisi-Gard stainless steel mesh for superior strength." },
            { title: "Triple Lock", description: "Standard on all security doors for maximum security." },
            { title: "Custom Colours", description: "Powder coated to match your home's existing frames." }
        ],
        benefits: ["Peace of mind", "Airflow without bugs", "Durable construction", "Custom fit"],
        faq: [
            { question: "Can pets damage the mesh?", answer: "Standard flywire yes, but our security mesh and pet mesh are resistant to tears." }
        ]
    },
    {
        slug: "fly-screens",
        category: "Security",
        title: "Fly Screens | Insect Protection",
        description: "Keep the bugs out and let the fresh air in. Custom made for windows and doors.",
        heroImage: "/images/sec-fly.png",
        intro: {
            heading: "Fly Screens: Essential Ventilation",
            body: "Enjoy the fresh breeze without the buzzing guests. Our custom-made fly screens are essential for every Australian home. Available in standard fibreglass mesh, or upgrade to 'Pet Mesh' for paw-proof durability."
        },
        features: [
            { title: "Pet Mesh Upgrade", description: "Resistant to claws and tears." },
            { title: "Retractable Options", description: "Screens that roll away when not in use." }
        ],
        benefits: [
            "Insect free home",
            "Natural ventilation",
            "Cost effective",
            "Easy to clean"
        ],
        faq: []
    },


    // --- MOTORISATION ---
    {
        slug: "motorisation",
        category: "Automation",
        title: "Motorisation | Smart Home Automation",
        description: "Voice control, scheduling, and app integration. Powered by Somfy and Automate.",
        heroImage: "/assets/motorised_curtains.png",
        intro: {
            heading: "Motorisation: Smart Living",
            body: "Experience the ultimate convenience. Motorise your Roller Blinds, Curtains, or Awnings with world-leading motors from Somfy and Automate. Integrate with Google Home, Alexa, or Apple HomeKit to schedule your blinds to open with the sunrise."
        },
        features: [
            { title: "Wire-Free Options", description: "Rechargeable battery motors require no electrician." },
            { title: "Voice Control", description: "Compatible with smart assistants." },
            { title: "Schedule", description: "Automate your blinds for security and energy efficiency." }
        ],
        benefits: [
            "Child safe (no cords)",
            "Convenience",
            "Extended product life",
            "Home security simulation"
        ],
        faq: []
    },

    // --- SPECIFIC SUPPLIER PRODUCTS (NEW) ---

    // SHUTTERS (NBS / Sunline)
    {
        slug: "fusion-plus-shutters",
        category: "Shutters",
        title: "Fusion Plus Shutters | Waterproof Polymer",
        description: "The ultimate wet-area shutter. Waterproof reinforced polymer with an aluminium core for superior strength.",
        heroImage: "/images/products/fusion-plus-shutters-hero.png",
        intro: {
            heading: "Fusion Plus: Engineered for Life",
            body: "Fusion Plus shutters are crafted from a waterproof reinforced polymer extrusion, making them the perfect choice for bathrooms, laundries, and kitchens. Reinforced with an aluminium core, they offer the look of premium timber with the durability to withstand moisture and daily wear."
        },
        features: [
            { title: "Waterproof", description: "Ideal for wet areas; will not warp, crack, or peel." },
            { title: "Aluminium Core", description: "Reinforced slats for extra strength and wider spans." },
            { title: "Insulation", description: "Provides excellent thermal efficiency (70% better than timber)." },
            { title: "Hypoallergenic", description: "Does not support bacterial growth." },
            { title: "Fire Retardant", description: "Certified fire retardant material." }
        ],
        benefits: ["100% Waterproof", "High Durability", "Easy to Clean", "25 Year Warranty"],
        faq: [
            { question: "Can these be used in a shower?", answer: "Yes, Fusion Plus is fully waterproof and perfect for high-moisture zones." }
        ]
    },
    {
        slug: "sovereign-wood-shutters",
        category: "Shutters",
        title: "Sovereign Wood Shutters | Premium Basswood",
        description: "Handcrafted from A-Grade American Basswood. The premium choice for living areas and bedrooms.",
        heroImage: "/images/products/sovereign-wood-shutters-hero.png",
        intro: {
            heading: "Sovereign Wood: Natural Elegance",
            body: "Crafted from A-Grade American Basswood (Tilia Americana), Sovereign Wood shutters bring the warmth and beauty of natural timber to your home. Lightweight and stable, they offer a premium finish with a distinct uniform grain that paints and stains beautifully."
        },
        features: [
            { title: "Premium Timber", description: "Sourced from sustainable American Basswood forests." },
            { title: "Lightweight", description: "Lighter than man-made materials, allowing for larger panel sizes." },
            { title: "Custom Finishes", description: "Available in a wide range of paints and stains." },
            { title: "Uniform Grain", description: "Smooth finish with minimal knots." },
            { title: "Warp Resistant", description: "Kiln-dried to ensure stability in Australian conditions." }
        ],
        benefits: ["Natural Timber Feel", "Lightweight Operation", "Premium Aesthetic", "Wide Configurations"],
        faq: []
    },
    {
        slug: "element-13-shutters",
        category: "Shutters",
        title: "Element 13 Aluminium Shutters | Indoor & Outdoor",
        description: "High-grade aluminium shutters designed for alfresco areas and modern interiors.",
        heroImage: "/images/products/element-13-shutters-hero.png",
        intro: {
            heading: "Element 13: The Strength of Aluminium",
            body: "Named after the 13th element, Aluminium, these shutters are built for performance. Perfect for enclosing alfresco areas, balconies, or high-traffic internal spaces. They are impervious to moisture, UV rays, and insects, offering a sleek modern look that lasts a lifetime."
        },
        features: [
            { title: "Weather Resistant", description: "Will not rust or degrade in the elements." },
            { title: "Security", description: "Lockable options available for extra peace of mind." },
            { title: "Wide Spans", description: "Strong blades allow for wider panels without sagging." },
            { title: "Fly Screen Compatible", description: "Can be integrated with insect screening." },
            { title: "Modern Profile", description: "Slim lines suit contemporary architecture." }
        ],
        benefits: ["Indoor/Outdoor Use", "High Durability", "Lockable", "Low Maintenance"],
        faq: []
    },

    // SECURITY (Creative)
    {
        slug: "invisi-gard-security",
        category: "Security",
        title: "Invisi-Gard Security Doors | 316 Marine Grade",
        description: "The premium choice for security. 316 Marine Grade Stainless Steel Mesh for uncompromising strength and clarity.",
        heroImage: "/images/products/invisi-gard-security-hero.png",
        intro: {
            heading: "Invisi-Gard: Uncompromising Security",
            body: "Invisi-Gard combines the strength of 316 Marine Grade Stainless Steel with the beauty of a clear view. Using a unique patented E-Grip retention system, the mesh is locked into the frame without screws or rivets, ensuring maximum impact resistance while preventing corrosion."
        },
        features: [
            { title: "316 Marine Grade", description: "Superior corrosion resistance compared to 304 grade." },
            { title: "E-Grip Retention", description: "Patented system locks mesh into frame for maximum strength." },
            { title: "Triple Lock", description: "3-point locking system standard on all doors." },
            { title: "Fall Prevention", description: "Complies with window fall prevention standards." },
            { title: "Clear Vision", description: "Black powder-coated mesh acts like sunglasses, reducing glare." }
        ],
        benefits: ["Maximum Security", "Crystal Clear Views", "Corrosion Resistant", "Adds Value"],
        faq: [
            { question: "Why 316 Stainless Steel?", answer: "316 grade has higher corrosion resistance, essential for Australian coastal conditions." }
        ]
    },
    {
        slug: "diamond-grille-security",
        category: "Security",
        title: "Diamond Grille Security | Traditional Barrier",
        description: "The classic, cost-effective security solution. Strong aluminium grille for visible deterrence.",
        heroImage: "/images/products/diamond-grille-security-hero.png",
        intro: {
            heading: "Diamond Grille: Proven Protection",
            body: "Diamond Grille doors are the traditional choice for Australian home security. Featuring a 7mm heavy-duty aluminium grille, they provide a strong visible deterrent to intruders. Available with standard fly mesh or upgraded flexible security mesh."
        },
        features: [
            { title: "7mm Grille", description: "Heavy duty tempered aluminium construction." },
            { title: "Visible Deterrent", description: "Clearly signals that the home is protected." },
            { title: "Cost Effective", description: "Affordable security for the whole home." },
            { title: "Hinged or Sliding", description: "Available for all door types." },
            { title: "Mesh Options", description: "Pair with One-Way Vision mesh for extra privacy." }
        ],
        benefits: ["Affordable", "Durable", "High Airflow", "Visible Barrier"],
        faq: []
    },

    // BLINDS (NBS / Other)
    {
        slug: "arena-honeycomb-shades",
        category: "Blinds",
        title: "Arena Honeycomb Shades | Energy Efficient",
        description: "The market leader in insulation. Cellular design traps air for year-round climate control.",
        heroImage: "/images/products/arena-honeycomb-shades-hero.png",
        intro: {
            heading: "Arena Honeycomb: Efficiency Redefined",
            body: "Arena Honeycomb Shades are the gold standard for energy efficiency. Their unique cellular construction creates a pocket of air that insulates your windows, keeping your home warmer in winter and cooler in summer. Available in a stunning range of fabrics from sheer to total blockout."
        },
        features: [
            { title: "Superior Insulation", description: "Reduces heat loss through windows by up to 40%." },
            { title: "Cordless Options", description: "Child-safe operating systems available." },
            { title: "Minimal Stack", description: "Compresses tightly when raised for a minimal footprint." },
            { title: "Top-Down/Bottom-Up", description: "Flexible light control options." },
            { title: "Sound Absorption", description: "Improves room acoustics." }
        ],
        benefits: ["Lower Energy Bills", "Sleek Look", "Child Safe", "Versatile Control"],
        faq: []
    },
    {
        slug: "tuscany-pvc-venetians",
        category: "Blinds",
        title: "Tuscany PVC Venetians | Durable & Stylish",
        description: "The look of timber with the durability of PVC. Perfect for high-humidity areas.",
        heroImage: "/images/products/tuscany-pvc-venetians-hero.png",
        intro: {
            heading: "Tuscany: Style That Lasts",
            body: "Tuscany PVC Venetians offer the classic aesthetic of timber blinds but are engineered from high-quality PVC. This makes them incredibly durable, easy to clean, and resistant to moisture, ideal for kitchens and bathrooms where real timber might warp."
        },
        features: [
            { title: "Moisture Resistant", description: "Perfect for wet areas like bathrooms." },
            { title: "Easy Care", description: "Wipe clean slats require minimal maintenance." },
            { title: "Timber Look", description: "Textured finishes available to mimic wood grain." },
            { title: "UV Stabilised", description: "Will not yellow or fade in the sun." },
            { title: "Budget Friendly", description: "More affordable than real timber." }
        ],
        benefits: ["Waterproof", "Durable", "Classic Style", "Value for Money"],
        faq: []
    },
    {
        slug: "shutter-tech-roller-shutters",
        category: "Shutters",
        title: "Shutter Tech Roller Shutters | Ultimate Protection",
        description: "Premium aluminium roller shutters for total security, noise reduction, and thermal insulation.",
        heroImage: "/images/products/shutter-tech-roller-shutters-hero.png",
        intro: {
            heading: "Shutter Tech: The Ultimate Fortress",
            body: "Shutter Tech Roller Shutters provide a robust shield for your windows. Made from commercial-grade aluminium with foam-filled slats, they offer unbeatable protection against intruders, heat, cold, and storms. They also block up to 50% of outside noise, creating a peaceful indoor environment."
        },
        features: [
            { title: "Foam Filled Slats", description: "Provides excellent thermal and acoustic insulation." },
            { title: "High Security", description: "Physical locking system prevents forced entry." },
            { title: "Total Blockout", description: "Stops 100% of light for shift workers." },
            { title: "Motorised", description: "Remote or switch operation for ease of use." },
            { title: "Bushfire Protection", description: "protects windows from radiant heat and debris." }
        ],
        benefits: ["Maximum Security", "Noise Reduction", "Energy Saving", "Total Darkness"],
        faq: []
    }
];

// Helper to quickly map categories to nav structure if needed
export const PRODUCT_CATEGORIES = [
    { name: "Curtains", slug: "curtains" },
    { name: "Blinds", slug: "blinds" },
    { name: "Shutters", slug: "shutters" },
    { name: "Security", slug: "security" },
    { name: "Outdoor", slug: "outdoor" },
    { name: "Motorisation", slug: "motorisation" },
];
