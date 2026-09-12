export const amazonAssociateTag = 'whiskerfield-20';

export type AmazonShelfCategory = {
  label: string;
  detail: string;
  query: string;
  accent: 'mint' | 'sun' | 'blue' | 'paper';
};

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
