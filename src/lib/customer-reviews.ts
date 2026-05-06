// Curated Google reviews used in the customer confirmation email.
// Refresh manually every 6-12 months: replace text, update timeAgo, re-tag.
// Source: https://maps.app.goo.gl/zRBNX1LBoTc2DK2g9 (MCB Google Business Profile)

export type ReviewTag =
  | 'curtains'
  | 'blinds'
  | 'roller_blinds'
  | 'shutters'
  | 'security'
  | 'awnings'
  | 'motorisation';

export type CuratedReview = {
  author: string;
  rating: number;
  timeAgo: string;
  text: string;
  tags: ReviewTag[];
};

export const CURATED_REVIEWS: CuratedReview[] = [
  {
    author: 'Mohammad Shah',
    rating: 5,
    timeAgo: '3 months ago',
    text: 'Amazing service from Dee and Deanne, with great communication and customer care throughout the process. The blinds and curtains look fantastic and are excellent quality. Big thanks to Tate for the professional installation — smooth, efficient, and done perfectly. Would definitely recommend.',
    tags: ['blinds', 'curtains'],
  },
  {
    author: 'Esther Yew',
    rating: 5,
    timeAgo: '5 months ago',
    text: 'I found Modern Curtain Blinds when we first moved in. Would highly recommend for curtains and blinds as well as fly screens/doors. Dee and Deane has been amazing to communicate with and is always lovely, helpful, and reliable. Pricing is very reasonable. Would recommend 1000%',
    tags: ['curtains', 'blinds', 'security'],
  },
  {
    author: 'Vineel Davuluri',
    rating: 5,
    timeAgo: '8 months ago',
    text: 'Wonderful experience with modern curtains and blinds. So generous couple who decorated my new house with modern curtains and blinds and plantation shutters. Very happy to use their services at humanly possible discounted prices.',
    tags: ['curtains', 'blinds', 'shutters'],
  },
  {
    author: 'Jane McAninly',
    rating: 5,
    timeAgo: '7 months ago',
    text: 'Deane and Dee were so professional and dedicated to helping us with our recent roller blinds, curtains and plantation shutters. The experience in helping us choose the correct colours and options with our renovations was so helpful.',
    tags: ['roller_blinds', 'blinds', 'curtains', 'shutters'],
  },
  {
    author: 'Jessica Barry',
    rating: 5,
    timeAgo: '9 months ago',
    text: 'Deane and Dee were very flexible and lovely to work with! Extremely happy with our final product which is of a high quality, looks beautiful and was turned around in a short timeframe.',
    tags: ['roller_blinds', 'blinds', 'curtains'],
  },
  {
    author: 'Arafat Mohamed',
    rating: 5,
    timeAgo: '7 months ago',
    text: 'We had our blinds and curtains done recently, I just wanted to come here and share my experience. Dee and the team were lovely to work with — they treated us more like family rather than clients.',
    tags: ['blinds', 'curtains'],
  },
  {
    author: 'Mike Paterson',
    rating: 5,
    timeAgo: '9 months ago',
    text: 'The smoothest, easiest and best experience from start to finish. Dee and Deane give a personal service that is second to none. We are very happy with the privacy and block-out blinds in our brand new house.',
    tags: ['blinds', 'roller_blinds'],
  },
  {
    author: 'Hayley',
    rating: 5,
    timeAgo: '10 months ago',
    text: 'Deane and Dee both came out to my house to give me a free quote on some blinds, doors and curtains (as I have just built my first home). They arrived on time, which some contractors don’t even show up these days!',
    tags: ['blinds', 'security', 'curtains'],
  },
  {
    author: 'Andrea Atherton',
    rating: 5,
    timeAgo: 'a year ago',
    text: 'I had blinds installed by Tate and couldn’t be happier! The team was professional, friendly, and helpful. The blinds are high quality, look great, and were installed soo quickly. The whole process was smooth from start to finish. Highly recommend!',
    tags: ['blinds'],
  },
  {
    author: 'Anjali Biddanda',
    rating: 5,
    timeAgo: '6 months ago',
    text: 'Dee and Deane were so patient with my indecision and going back and forth between the fabrics I had selected. They came out twice to help me decide. I finally have them installed and I love them! They’re professionals and lovely to work with.',
    tags: ['curtains', 'blinds'],
  },
  {
    author: 'Imman Saaoud',
    rating: 5,
    timeAgo: '11 months ago',
    text: 'Absolute best experience with Modern Curtains and Blinds! They were professional, experienced and great with communicating. The blinds they installed are amazing quality and went beyond our expectations!! Highly recommend!',
    tags: ['blinds'],
  },
  {
    author: 'Tahlia Castagnini',
    rating: 5,
    timeAgo: '10 months ago',
    text: 'We had such a great experience! From the first consultation to the final installation, everything was smooth and professional, the team were all super friendly and super efficient. Could not recommend them enough to anyone looking for good quality blinds and great service.',
    tags: ['blinds', 'roller_blinds'],
  },
];

const PRODUCT_TAG_KEYWORDS: Record<ReviewTag, RegExp> = {
  curtains: /curtain/i,
  roller_blinds: /roller|blockout|block-out|honeycomb|cellular|venetian|vertical/i,
  blinds: /blind/i,
  shutters: /shutter/i,
  security: /security|fly.?screen|crimsafe|screen.?door/i,
  awnings: /awning|outdoor|zip.?screen|folding.?arm/i,
  motorisation: /motoris|motoriz|automat|smart.?home|remote/i,
};

function productsToTags(products: string[]): ReviewTag[] {
  if (!products?.length) return [];
  const tags = new Set<ReviewTag>();
  for (const product of products) {
    for (const [tag, pattern] of Object.entries(PRODUCT_TAG_KEYWORDS) as [ReviewTag, RegExp][]) {
      if (pattern.test(product)) tags.add(tag);
    }
  }
  return Array.from(tags);
}

export function selectReviewsForProducts(products: string[], count = 3): CuratedReview[] {
  const customerTags = productsToTags(products);

  const scored = CURATED_REVIEWS.map((review, index) => {
    const matchCount = customerTags.length === 0
      ? 0
      : review.tags.filter((t) => customerTags.includes(t)).length;
    return { review, index, matchCount };
  });

  scored.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    if (b.review.rating !== a.review.rating) return b.review.rating - a.review.rating;
    return a.index - b.index;
  });

  const picked: CuratedReview[] = [];
  const seenAuthors = new Set<string>();
  for (const { review } of scored) {
    if (seenAuthors.has(review.author)) continue;
    picked.push(review);
    seenAuthors.add(review.author);
    if (picked.length >= count) break;
  }
  return picked;
}
