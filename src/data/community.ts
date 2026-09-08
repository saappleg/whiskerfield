import type { CommunityPost, Topic } from '../types/community';

export const topicLabels: Record<Topic, string> = {
  cat_life: 'Cat life',
  care: 'Care',
  introductions: 'Introductions',
  home: 'Home',
};

export const previewPosts: CommunityPost[] = [
  {
    id: 1,
    topic: 'introductions',
    body: 'Hello from Miso and me. He has decided the laundry basket is his new office, and honestly I respect the commitment.',
    created_at: '2026-09-08T12:00:00.000Z',
    profiles: { display_name: 'Mara & Miso', handle: 'mara_miso' },
  },
  {
    id: 2,
    topic: 'home',
    body: 'Small win: moving the scratcher beside the sofa saved the corner of our rug. It is now the busiest little piece of furniture in the room.',
    created_at: '2026-09-07T17:20:00.000Z',
    profiles: { display_name: 'Theo', handle: 'theo_catlife' },
  },
  {
    id: 3,
    topic: 'care',
    body: 'What is one thing you always write down before a vet visit? We are building a calmer check-in routine for our senior cat.',
    created_at: '2026-09-06T15:10:00.000Z',
    profiles: { display_name: 'Aster', handle: 'aster_notes' },
  },
];
