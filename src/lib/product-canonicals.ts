export const PRODUCT_CANONICAL_PATHS: Record<string, string> = {
  "sheer-curtains": "/curtains/sheer",
  "blockout-curtains": "/curtains/blockout",
  "translucent-curtains": "/curtains/translucent-curtains",
  "blockout-roller-blinds": "/blinds/roller-blinds/blockout",
  "sunscreen-roller-blinds": "/blinds/roller-blinds/sunscreen",
  "double-roller-blinds": "/blinds/double-roller-blinds",
  "roman-blinds": "/blinds/roman-blinds",
  "venetian-blinds": "/blinds/venetian-blinds",
  "vertical-blinds": "/blinds/vertical-blinds",
  "honeycomb-blinds": "/blinds/honeycomb-blinds",
  "plantation-shutters": "/shutters/plantation-shutters",
  "fusion-plus-shutters": "/shutters/plantation-shutters/polymer",
  "sovereign-wood-shutters": "/shutters/plantation-shutters/timber",
  "element-13-shutters": "/shutters/plantation-shutters/aluminium",
  "roller-shutters": "/shutters/roller-shutters",
  "shutter-tech-roller-shutters": "/shutters/roller-shutters",
  "security-doors": "/security/security-doors",
  "invisi-gard-security": "/security/security-doors",
  "diamond-grille-security": "/security/security-doors",
  "fly-screens": "/security/fly-screens",
  "zipscreens": "/awnings/zipscreens",
  "awnings": "/awnings",
  "motorisation": "/motorisation",
  "arena-honeycomb-shades": "/blinds/honeycomb-blinds",
  "tuscany-pvc-venetians": "/blinds/venetian-blinds",
};

export function getProductCanonicalPath(slug: string) {
  return PRODUCT_CANONICAL_PATHS[slug] || `/products/${slug}`;
}
