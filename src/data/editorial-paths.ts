export type EditorialPath = {
  id: string;
  eyebrow: string;
  title: string;
  detail: string;
  accent: 'coral' | 'sun' | 'mint' | 'blue';
  articles: string[];
};

/** Curated routes through the Journal, built from existing articles. */
export const editorialPaths: EditorialPath[] = [
  {
    id: 'new-cat-first-month',
    eyebrow: 'A soft landing',
    title: 'Your first month together',
    detail: 'A low-pressure sequence for helping a newly adopted cat find safety, rhythm, and a voice in the home.',
    accent: 'coral',
    articles: ['first-thirty-days-adopted-cat', 'litter-box-placement', 'read-cat-body-language'],
  },
  {
    id: 'calmer-cat-home',
    eyebrow: 'Home, made legible',
    title: 'Build a calmer cat home',
    detail: 'Start with the routes and resources your cat already uses, then make one useful change at a time.',
    accent: 'mint',
    articles: ['one-room-cat-refresh', 'multi-cat-resource-map', 'safer-window-watching'],
  },
  {
    id: 'care-without-panic',
    eyebrow: 'Better observations',
    title: 'Care without the spiral',
    detail: 'Simple records and gentle routines that help you notice change and arrive at a veterinary visit prepared.',
    accent: 'sun',
    articles: ['notice-the-small-things', 'water-bowl-audit', 'cat-care-binder'],
  },
  {
    id: 'everyday-cat-joy',
    eyebrow: 'The good ordinary',
    title: 'More play, less pressure',
    detail: 'Small invitations for scratching, play, grooming, and enrichment that leave your cat room to choose.',
    accent: 'blue',
    articles: ['play-that-ends-well', 'gentle-grooming-routine', 'seven-day-enrichment'],
  },
];
