import { featuredStories, practicalGuides, type JournalEntry } from '../data/editorial';

export const SITE_URL = 'https://whiskerfield.social';
export const SITE_NAME = 'Whiskerfield';
export const SITE_IMAGE = `${SITE_URL}/cat-at-window-1200.webp`;
export const SITE_DESCRIPTION = 'A social home for cat people with community, care guidance, product notes, and a thoughtful dispatch.';

export function articleHref(id: string) {
  return `/stories?article=${encodeURIComponent(id)}`;
}

export function articleUrl(id: string) {
  return `${SITE_URL}${articleHref(id)}`;
}

export function findJournalEntry(id: string) {
  return [...featuredStories, ...practicalGuides].find((entry) => entry.id === id);
}

export type SeoDetails = {
  title: string;
  description: string;
  canonical: string;
  type: 'website' | 'article';
  imageAlt: string;
  article?: JournalEntry;
};

const pageDetails: Record<string, Omit<SeoDetails, 'canonical' | 'article'>> = {
  home: {
    title: 'Whiskerfield — A social home for cat people',
    description: 'Real cat people, practical care, thoughtful product notes, and the stories worth sharing.',
    type: 'website',
    imageAlt: 'A cat watching the world from a sunny window',
  },
  stories: {
    title: 'The Whiskerfield Journal — Stories for the life you share',
    description: 'Practical care observations, honest field notes, and gentle routines for people building a good life with a cat.',
    type: 'website',
    imageAlt: 'A cat watching the world from a sunny window',
  },
  care: {
    title: 'Cat Care Center — Practical guidance | Whiskerfield',
    description: 'Practical cat-care guides, free checklists, and gentle tools for everyday decisions with your cat.',
    type: 'website',
    imageAlt: 'A cat watching the world from a sunny window',
  },
  products: {
    title: 'Product Lab — Honest cat product notes | Whiskerfield',
    description: 'Thoughtful cat-product notes, member reviews, and practical questions to ask before you buy.',
    type: 'website',
    imageAlt: 'A cat watching the world from a sunny window',
  },
  news: {
    title: 'The Whiskerfield Dispatch — Useful cat news and notes',
    description: 'A thoughtful dispatch of useful reads, care reminders, and stories from the world of cat people.',
    type: 'website',
    imageAlt: 'A cat watching the world from a sunny window',
  },
  members: {
    title: 'The Cat Club — A community for cat people | Whiskerfield',
    description: 'A private community for sharing cat stories, routines, questions, and product experiences with fellow cat people.',
    type: 'website',
    imageAlt: 'A cat watching the world from a sunny window',
  },
  privacy: {
    title: 'Privacy at Whiskerfield',
    description: 'How Whiskerfield handles community accounts, analytics, advertising, and member data.',
    type: 'website',
    imageAlt: 'A cat watching the world from a sunny window',
  },
};

export function getSeoDetails(route: string, articleId = ''): SeoDetails {
  const article = articleId ? findJournalEntry(articleId) : undefined;
  if (article) {
    return {
      title: `${article.title} | Whiskerfield`,
      description: article.dek,
      canonical: articleUrl(article.id),
      type: 'article',
      imageAlt: `Whiskerfield Journal: ${article.title}`,
      article,
    };
  }

  const details = pageDetails[route] || pageDetails.home;
  return {
    ...details,
    canonical: route === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${route}`,
  };
}
