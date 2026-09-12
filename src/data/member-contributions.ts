import type { MemberReview, MemberStory } from '../types/community';

// These seeded examples keep the community feeling alive before a Supabase project is connected.
// Live member submissions are merged ahead of them by useWhiskerfield.
export const previewMemberReviews: MemberReview[] = [
  {
    id: 9101,
    author_id: 'seed-review-1',
    product_name: 'Feline Pine Original Pellets',
    product_category: 'litter',
    rating: 4,
    title: 'Low dust, but give the transition time',
    body: 'We liked the clean-up and the low dust, but our cat needed a slow transition from clay. The first few days were a lot of sniffing and one dramatic protest. Once the old and new litters were blended gradually, it became an easy part of the routine.',
    verdict: 'recommend',
    created_at: '2026-09-09T15:20:00.000Z',
    profiles: { display_name: 'Nora & Juniper', handle: 'nora_juniper' },
  },
  {
    id: 9102,
    author_id: 'seed-review-2',
    product_name: 'Modkat Top-Entry Carrier',
    product_category: 'carriers',
    rating: 5,
    title: 'The carrier that stayed out',
    body: 'The top opening made our nervous senior cat easier to move without a wrestling match. We leave it open beside the bookcase with a towel inside, so it reads as a nap spot instead of a surprise. The latches are the feature I would check first if you are comparing models.',
    verdict: 'recommend',
    created_at: '2026-09-08T19:05:00.000Z',
    profiles: { display_name: 'Mara', handle: 'mara_and_olive' },
  },
  {
    id: 9103,
    author_id: 'seed-review-3',
    product_name: 'Tall sisal scratching post',
    product_category: 'scratchers',
    rating: 3,
    title: 'Great height, not enough base',
    body: 'Our cat loved the height immediately, but the original base slid on hardwood and made the whole thing feel uncertain. We added a rubber mat and that helped. I would recommend this style only if you can make the footprint stable in your space.',
    verdict: 'mixed',
    created_at: '2026-09-07T13:40:00.000Z',
    profiles: { display_name: 'Eli', handle: 'eli_and_mochi' },
  },
];

export const previewMemberStories: MemberStory[] = [
  {
    id: 9201,
    author_id: 'seed-story-1',
    title: 'The first week our foster stopped hiding',
    category: 'rescue',
    body: 'On day one, Toast lived behind the washing machine and only came out after midnight. We stopped trying to make progress happen and started leaving the room predictable: the same breakfast, the same chair, the same quiet hello. On day seven, he watched me read from the doorway. It was not a movie moment, but it was ours.',
    submitted_for_feature: true,
    is_featured: true,
    created_at: '2026-09-09T11:20:00.000Z',
    profiles: { display_name: 'Sofia M.', handle: 'sofia_catlife' },
  },
  {
    id: 9202,
    author_id: 'seed-story-2',
    title: 'What our cat taught us about a smaller apartment',
    category: 'home',
    body: 'We thought moving from a house to an apartment meant our cat would lose territory. Instead, we learned to make better routes: one high perch by the window, a quiet bed in the office, and a scratcher where the hallway turns. The footprint got smaller, but the choices got clearer.',
    submitted_for_feature: true,
    is_featured: false,
    created_at: '2026-09-08T16:10:00.000Z',
    profiles: { display_name: 'Grace L.', handle: 'grace_and_mochi' },
  },
  {
    id: 9203,
    author_id: 'seed-story-3',
    title: 'The notes app that made vet day less vague',
    category: 'care',
    body: 'I started writing down small changes for our senior cat because I kept arriving at appointments with a feeling and no timeline. Three short notes later, I could say what changed, when it started, and what stayed normal. The notes did not make me an expert; they made me a better teammate for our veterinarian.',
    submitted_for_feature: true,
    is_featured: true,
    created_at: '2026-09-07T09:45:00.000Z',
    profiles: { display_name: 'Marcus T.', handle: 'marcus_t' },
  },
];
