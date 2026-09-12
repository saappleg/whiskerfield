export const amazonAssociateTag = 'whiskerfield-20';

export type AmazonShelfCategory = {
  label: string;
  detail: string;
  query: string;
  accent: 'mint' | 'sun' | 'blue' | 'paper';
};

export type AmazonProduct = {
  name: string;
  category: string;
  detail: string;
  note?: string;
  url: string;
  accent: 'mint' | 'sun' | 'blue' | 'paper';
};

/**
 * A small, human-readable shelf of links supplied through SiteStripe.
 * Keep the short URLs intact so Amazon owns the redirect and tracking setup.
 */
export const amazonProducts: AmazonProduct[] = [
  {
    name: 'Geeni PetConnect smart water fountain',
    category: 'Feeding & water',
    detail: 'A filtered fountain with app-connected refill and cleaning reminders for households that want a more visible water routine.',
    url: 'https://amzn.to/4xT6kx9',
    accent: 'blue',
  },
  {
    name: 'Soft-tip pet pill shooter',
    category: 'Care helpers',
    detail: 'A reusable pill-delivery tool designed to make medication time more controlled and less stressful when it has been prescribed.',
    note: 'Use only as directed by your veterinarian.',
    url: 'https://amzn.to/4xKnahw',
    accent: 'paper',
  },
  {
    name: 'Temptations crunchy & soft chicken treats',
    category: 'Treats & enrichment',
    detail: 'A familiar small treat for clicker practice, carrier pairing, or a little daily delight—portion it as part of the overall diet.',
    url: 'https://amzn.to/3UOpXb1',
    accent: 'sun',
  },
  {
    name: 'PetArmor ear mite treatment for cats',
    category: 'Care helpers',
    detail: 'An ear-care product to discuss with a veterinary professional when mites are suspected, rather than a substitute for a diagnosis.',
    note: 'Read the label and ask your veterinarian before use.',
    url: 'https://amzn.to/4cCvKGH',
    accent: 'paper',
  },
  {
    name: 'Rocco & Roxie calming cat treats',
    category: 'Calm & enrichment',
    detail: 'A soft treat option for routines like travel, grooming, or a vet visit when your cat already has a low-pressure plan.',
    note: 'Ask your veterinarian before adding calming supplements.',
    url: 'https://amzn.to/4cAHBFi',
    accent: 'mint',
  },
  {
    name: 'IAMS Proactive Health indoor dry cat food',
    category: 'Food & feeding',
    detail: 'An indoor-cat dry food option to compare against your cat’s age, health history, preferences, and veterinarian guidance.',
    note: 'Food changes should fit your cat—not just the bag.',
    url: 'https://amzn.to/4xW0lHO',
    accent: 'sun',
  },
];

export const amazonShelfCategories: AmazonShelfCategory[] = [
  { label: 'Scratchers & climbing', detail: 'Stable posts, scratchers, shelves, and vertical options for cats who like to stretch.', query: 'cat scratching post stable sisal', accent: 'mint' },
  { label: 'Carriers & travel', detail: 'Top-loading carriers, washable liners, and calmer ways to make the carrier part of home life.', query: 'cat carrier top load washable', accent: 'blue' },
  { label: 'Feeding & water', detail: 'Low-friction bowls, fountains, mats, and feeding setups that are easy to keep clean.', query: 'cat water fountain stainless steel feeding mat', accent: 'sun' },
  { label: 'Litter & cleanup', detail: 'Wide-entry boxes, scoopers, mats, and the small tools that make a daily reset easier.', query: 'cat litter box wide entry litter mat scoop', accent: 'paper' },
  { label: 'Play & enrichment', detail: 'Wand toys, puzzle feeders, tunnels, and rotation-friendly enrichment for curious cats.', query: 'cat interactive toy puzzle feeder wand toy', accent: 'mint' },
  { label: 'Home & window watching', detail: 'Perches, beds, and home basics that give cats a safe place to look out and opt out.', query: 'cat window perch cat bed washable', accent: 'sun' },
];

export function amazonSearchUrl(query: string) {
  const params = new URLSearchParams({ k: query, tag: amazonAssociateTag });
  return `https://www.amazon.com/s?${params.toString()}`;
}
