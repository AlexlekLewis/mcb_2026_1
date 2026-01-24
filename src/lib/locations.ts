export interface Suburb {
    name: string;
    slug: string;
    postcode: string;
    description?: string;
}

export const LOCATIONS: Suburb[] = [
    { name: "Preston", slug: "preston", postcode: "3072" },
    { name: "Thornbury", slug: "thornbury", postcode: "3071" },
    { name: "Northcote", slug: "northcote", postcode: "3070" },
    { name: "Reservoir", slug: "reservoir", postcode: "3073" },
    { name: "Coburg", slug: "coburg", postcode: "3058" },
    { name: "Coburg North", slug: "coburg-north", postcode: "3058" },
    { name: "Brunswick", slug: "brunswick", postcode: "3056" },
    { name: "Brunswick East", slug: "brunswick-east", postcode: "3057" },
    { name: "Fairfield", slug: "fairfield", postcode: "3078" },
    { name: "Ivanhoe", slug: "ivanhoe", postcode: "3079" },
    { name: "Ivanhoe East", slug: "ivanhoe-east", postcode: "3079" },
    { name: "Heidelberg", slug: "heidelberg", postcode: "3084" },
    { name: "Heidelberg West", slug: "heidelberg-west", postcode: "3081" },
    { name: "Heidelberg Heights", slug: "heidelberg-heights", postcode: "3081" },
    { name: "Bellfield", slug: "bellfield", postcode: "3081" },
    { name: "Kingsbury", slug: "kingsbury", postcode: "3083" },
    { name: "Fawkner", slug: "fawkner", postcode: "3060" },
    { name: "Rosanna", slug: "rosanna", postcode: "3084" },
    { name: "Eaglemont", slug: "eaglemont", postcode: "3084" },
    { name: "Alphington", slug: "alphington", postcode: "3078" },
    { name: "Clifton Hill", slug: "clifton-hill", postcode: "3068" },
    { name: "Fitzroy North", slug: "fitzroy-north", postcode: "3068" },
    { name: "Regent", slug: "regent", postcode: "3073" },
    { name: "Keon Park", slug: "keon-park", postcode: "3073" },
    { name: "Abbotsford", slug: "abbotsford", postcode: "3067" },
    // Expanded Northern Suburbs
    { name: "Bundoora", slug: "bundoora", postcode: "3083" },
    { name: "Thomastown", slug: "thomastown", postcode: "3074" },
    { name: "Lalor", slug: "lalor", postcode: "3075" },
    { name: "Epping", slug: "epping", postcode: "3076" },
    { name: "Mill Park", slug: "mill-park", postcode: "3082" },
    { name: "South Morang", slug: "south-morang", postcode: "3752" },
    { name: "Mernda", slug: "mernda", postcode: "3754" },
    { name: "Doreen", slug: "doreen", postcode: "3754" },
    { name: "Wollert", slug: "wollert", postcode: "3750" },
    { name: "Campbellfield", slug: "campbellfield", postcode: "3061" },
    { name: "Somerton", slug: "somerton", postcode: "3062" },
    { name: "Broadmeadows", slug: "broadmeadows", postcode: "3047" },
    { name: "Dallas", slug: "dallas", postcode: "3047" },
    { name: "Jacana", slug: "jacana", postcode: "3047" },
    { name: "Greenvale", slug: "greenvale", postcode: "3059" },
    { name: "Tullamarine", slug: "tullamarine", postcode: "3043" },
    { name: "Gladstone Park", slug: "gladstone-park", postcode: "3043" },
    // Expanded North-Eastern Suburbs
    { name: "Macleod", slug: "macleod", postcode: "3085" },
    { name: "Watsonia", slug: "watsonia", postcode: "3087" },
    { name: "Watsonia North", slug: "watsonia-north", postcode: "3087" },
    { name: "Yallambie", slug: "yallambie", postcode: "3085" },
    { name: "Viewbank", slug: "viewbank", postcode: "3084" },
    { name: "Greensborough", slug: "greensborough", postcode: "3088" },
    { name: "Briar Hill", slug: "briar-hill", postcode: "3088" },
    { name: "Saint Helena", slug: "saint-helena", postcode: "3088" },
    { name: "Montmorency", slug: "montmorency", postcode: "3094" },
    { name: "Lower Plenty", slug: "lower-plenty", postcode: "3093" },
    { name: "Eltham", slug: "eltham", postcode: "3095" },
    { name: "Eltham North", slug: "eltham-north", postcode: "3095" },
    { name: "Research", slug: "research", postcode: "3095" },
    { name: "Diamond Creek", slug: "diamond-creek", postcode: "3089" },
    { name: "Warrandyte", slug: "warrandyte", postcode: "3113" },
    // Expanded Western Suburbs
    { name: "Pascoe Vale", slug: "pascoe-vale", postcode: "3044" },
    { name: "Pascoe Vale South", slug: "pascoe-vale-south", postcode: "3044" },
    { name: "Glenroy", slug: "glenroy", postcode: "3046" },
    { name: "Hadfield", slug: "hadfield", postcode: "3046" },
    { name: "Oak Park", slug: "oak-park", postcode: "3046" },
    { name: "Strathmore", slug: "strathmore", postcode: "3041" },
    { name: "Essendon", slug: "essendon", postcode: "3040" },
    { name: "Moonee Ponds", slug: "moonee-ponds", postcode: "3039" },
    { name: "Ascot Vale", slug: "ascot-vale", postcode: "3032" },
    { name: "Maribyrnong", slug: "maribyrnong", postcode: "3032" },
    { name: "Niddrie", slug: "niddrie", postcode: "3042" },
    { name: "Airport West", slug: "airport-west", postcode: "3042" },
    { name: "Keilor", slug: "keilor", postcode: "3036" },
    // Expanded Eastern Suburbs
    { name: "Bulleen", slug: "bulleen", postcode: "3105" },
    { name: "Templestowe Lower", slug: "templestowe-lower", postcode: "3107" },
    { name: "Templestowe", slug: "templestowe", postcode: "3106" },
    { name: "Doncaster", slug: "doncaster", postcode: "3108" },
    { name: "Doncaster East", slug: "doncaster-east", postcode: "3109" },
    { name: "Balwyn North", slug: "balwyn-north", postcode: "3104" },
    { name: "Kew", slug: "kew", postcode: "3101" },
    { name: "Kew East", slug: "kew-east", postcode: "3102" },
    // Inner City Areas
    { name: "Carlton", slug: "carlton", postcode: "3053" },
    { name: "Parkville", slug: "parkville", postcode: "3052" },
    { name: "Fitzroy", slug: "fitzroy", postcode: "3065" },
    { name: "Collingwood", slug: "collingwood", postcode: "3066" },
    { name: "Richmond", slug: "richmond", postcode: "3121" },
    { name: "Hawthorn", slug: "hawthorn", postcode: "3122" },
    { name: "South Yarra", slug: "south-yarra", postcode: "3141" },
];

export function getLocationBySlug(slug: string): Suburb | undefined {
    return LOCATIONS.find(loc => loc.slug === slug);
}

export function getNearbyLocations(currentSlug: string, count: number = 6): Suburb[] {
    // For now, we'll return a random selection excluding the current one.
    // In a real geo-aware app, we'd use haversine distance.
    const otherLocations = LOCATIONS.filter(loc => loc.slug !== currentSlug);
    return otherLocations.sort(() => 0.5 - Math.random()).slice(0, count);
}
