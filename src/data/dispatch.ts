import { articleHref } from '../lib/seo';

export type HomeDispatchItem = {
  label: string;
  title: string;
  detail: string;
  href: string;
  action: string;
  accent: 'mint' | 'sun' | 'paper';
};

/**
 * The small, useful things we want readers to find when they come back to the
 * home page. Keeping these as plain editorial data makes the block easy to
 * refresh each week without turning it into a pretend newsletter backend.
 */
export const homeDispatch = {
  label: 'THE WHISKERFIELD DISPATCH · THIS WEEK',
  title: 'A few good things for the week ahead.',
  intro: 'One useful read, one small thing to try, and one reminder that you are not the only person living with a cat who has very strong opinions.',
  items: [
    {
      label: 'READ · 7 DAYS',
      title: 'A seven-day enrichment reset',
      detail: 'A low-pressure week of tiny changes for cats who are bored, busy, or simply curious about everything you do.',
      href: articleHref('seven-day-enrichment'),
      action: 'Read the guide →',
      accent: 'mint',
    },
    {
      label: 'TRY · AT HOME',
      title: 'Move the good spot closer',
      detail: 'Put the scratcher, bed, or perch where your cat already wants to be. The living room is often the whole point.',
      href: articleHref('scratcher-belongs-here'),
      action: 'Read the field note →',
      accent: 'sun',
    },
    {
      label: 'KEEP AN EYE ON',
      title: 'The quiet clues count',
      detail: 'A short observation log can make the next vet conversation much clearer. Notice first; diagnose never.',
      href: '#/care#tools',
      action: 'Open the Care Center →',
      accent: 'paper',
    },
  ] satisfies HomeDispatchItem[],
};
