export type DiscoveryRoute = 'care' | 'products' | 'news';

export type DiscoveryHub = {
  route: DiscoveryRoute;
  eyebrow: string;
  title: string;
  summary: string;
  action: string;
  accent: 'mint' | 'sun' | 'coral';
};

export const discoveryHubs: DiscoveryHub[] = [
  {
    route: 'care',
    eyebrow: 'Care center',
    title: 'Practical care, for real life.',
    summary: 'Gentle guides, safety tools, and the observations worth bringing to your veterinarian.',
    action: 'Explore cat care',
    accent: 'mint',
  },
  {
    route: 'products',
    eyebrow: 'Product lab',
    title: 'Better gear, less guesswork.',
    summary: 'A clearer way to choose the objects your cat actually uses: stability, safety, clean-up, and cat approval.',
    action: 'Visit Product Lab',
    accent: 'sun',
  },
  {
    route: 'news',
    eyebrow: 'The dispatch',
    title: 'Cat news worth a closer look.',
    summary: 'Context for the care, science, rescue, and culture conversations that matter to cat people.',
    action: 'Read the dispatch',
    accent: 'coral',
  },
];

export type ProductPrinciple = {
  icon: string;
  title: string;
  detail: string;
};

export const productPrinciples: ProductPrinciple[] = [
  {
    icon: '↔',
    title: 'Stability first',
    detail: 'Does it stay put through a full-body stretch, jump, or enthusiastic scratch?',
  },
  {
    icon: '✦',
    title: 'Easy to live with',
    detail: 'We look for materials, cleaning, and upkeep that still make sense on a tired Tuesday.',
  },
  {
    icon: '♡',
    title: 'Cat-approved',
    detail: 'A clever object is only useful when a cat chooses it, not when it photographs well.',
  },
];

export type ProductRecommendation = {
  label: string;
  name: string;
  goodFor: string;
  skipIf: string;
  note: string;
  href: string;
  accent: 'paper' | 'mint' | 'sun';
};

export const productRecommendations: ProductRecommendation[] = [
  {
    label: 'FIELD NOTE · SCRATCHING',
    name: 'A stable vertical sisal post',
    goodFor: 'Cats who stretch tall and scratch near the rooms people use.',
    skipIf: 'Your cat prefers a flat cardboard scratcher or a hidden corner.',
    note: 'Start with the placement and the base. A beautiful scratcher that slides is still a miss.',
    href: '#/stories/article/scratcher-belongs-here',
    accent: 'mint',
  },
  {
    label: 'FIELD NOTE · TRAVEL',
    name: 'A top-and-front access carrier',
    goodFor: 'Cats learning that the carrier can be an ordinary piece of furniture.',
    skipIf: 'The doors are flimsy, the base flexes, or it cannot be cleaned easily.',
    note: 'Leave it open at home with familiar bedding. The useful test starts long before vet day.',
    href: '#/stories/article/two-useful-things',
    accent: 'paper',
  },
  {
    label: 'FIELD NOTE · FEEDING',
    name: 'A washable feeding station',
    goodFor: 'Homes where water drips, bowls travel, or mealtimes need a reset.',
    skipIf: 'The surface slides, traps moisture, or makes the bowls harder to reach.',
    note: 'Choose the thing that shortens one daily chore. Less friction is a real feature.',
    href: '#/stories/article/two-useful-things',
    accent: 'sun',
  },
  {
    label: 'FIELD NOTE · LITTER',
    name: 'A wide, easy-entry litter box',
    goodFor: 'Cats who need room to turn, dig, or choose their preferred edge.',
    skipIf: 'The entrance is hard to reach, the liner catches claws, or the box cannot be scooped comfortably.',
    note: 'The best box is one you can keep clean and your cat can leave without feeling cornered.',
    href: '#/stories/article/litter-box-placement',
    accent: 'paper',
  },
  {
    label: 'FIELD NOTE · ENRICHMENT',
    name: 'A toy rotation with a clear finish',
    goodFor: 'Cats who love novelty but lose interest when every toy is always available.',
    skipIf: 'The pieces are small enough to swallow or the toy cannot be supervised safely.',
    note: 'Three familiar options rotated thoughtfully beat a basket of forgotten objects.',
    href: '#/stories/article/play-that-ends-well',
    accent: 'mint',
  },
  {
    label: 'FIELD NOTE · PERCHING',
    name: 'A stable, reversible window perch',
    goodFor: 'Cats who want a view and a way to retreat without crossing the whole room.',
    skipIf: 'The hardware is loose, the screen is not secure, or the landing route is cluttered.',
    note: 'A view is more useful when it comes with a safe way up, down, and away.',
    href: '#/stories/article/safer-window-watching',
    accent: 'sun',
  },
];

export type DispatchStory = {
  label: string;
  title: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
  accent: 'coral' | 'sun' | 'mint';
};

export const dispatchStories: DispatchStory[] = [
  {
    label: 'RECALL WATCH · LIVE SOURCE',
    title: 'Start with the official recall record.',
    detail: 'The FDA’s Recalls & Withdrawals page lists current pet-food and animal-product actions with dates, product descriptions, reasons, and company names. Use the exact product and lot details before making a decision.',
    sourceLabel: 'Open FDA recalls & withdrawals',
    sourceUrl: 'https://www.fda.gov/animal-veterinary/safety-health/recalls-withdrawals',
    accent: 'coral',
  },
  {
    label: 'PLANT SAFETY · REFERENCE',
    title: 'A plant name is not enough.',
    detail: 'The ASPCA’s cat plant list separates toxic and non-toxic plants and includes common and scientific names. Keep it as a lookup tool; if your cat has eaten something concerning, contact a veterinarian or poison resource promptly.',
    sourceLabel: 'Check the ASPCA plant list',
    sourceUrl: 'https://www.aspca.org/pet-care/animal-poison-control/cats-plant-list',
    accent: 'sun',
  },
  {
    label: 'SENIOR CATS · REFERENCE',
    title: 'A check-in is a conversation, not a diagnosis.',
    detail: 'AVMA’s senior-pet guide recommends paying attention to changing needs and discussing health, diet, and home adjustments with a veterinarian. Bring observations, not internet certainty.',
    sourceLabel: 'Read AVMA’s senior-pet guide',
    sourceUrl: 'https://ebusiness.avma.org/files/ProductDownloads/mcm-client-brochures-senior-pets-2023.pdf',
    accent: 'mint',
  },
];

export const dispatchTopics = [
  {
    label: 'REPORTING STANDARD',
    title: 'Updates with receipts',
    detail: 'When we cover a current issue, we will date it, link the source, and note corrections clearly.',
  },
  {
    label: 'SCIENCE, PLAINLY',
    title: 'Curious, not clicky',
    detail: 'Useful research deserves context: what was studied, what it means, and what it does not prove.',
  },
  {
    label: 'RESCUE & CULTURE',
    title: 'The bigger cat world',
    detail: 'Stories about foster homes, better shared spaces, and the people widening the welcome for cats.',
  },
];

export const communityTopics = [
  { icon: '💬', title: 'Ask a kind question', detail: 'Get perspective on routines, behavior, and the small mysteries of living together.' },
  { icon: '📷', title: 'Show the good stuff', detail: 'Share the perch, the blanket nest, the carrier breakthrough, or the 3 a.m. gremlin.' },
  { icon: '📌', title: 'Keep what helps', detail: 'Save routines, notes, and recommendations for the next time you need them.' },
];
