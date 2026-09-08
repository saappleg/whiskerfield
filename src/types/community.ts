export type Topic = 'cat_life' | 'care' | 'introductions' | 'home';

export type ReactionType = 'purr' | 'paw' | 'treat' | 'hiss';

export type ReactionMeta = {
  key: ReactionType;
  label: string;
  emoji: string;
};

export const REACTIONS: ReactionMeta[] = [
  { key: 'purr', label: 'Purr', emoji: '😸' },
  { key: 'paw', label: 'Paw print', emoji: '🐾' },
  { key: 'treat', label: 'Cat treat', emoji: '🐟' },
  { key: 'hiss', label: 'Hiss', emoji: '😾' },
];

export type ReactionCounts = Partial<Record<ReactionType, number>>;

export type CommunityPost = {
  id: number;
  author_id?: string;
  body: string;
  topic: Topic;
  created_at: string;
  reactions?: ReactionCounts;
  userReaction?: ReactionType;
  profiles?: { display_name: string; handle: string } | { display_name: string; handle: string }[] | null;
};

export type CommunityComment = {
  id: number;
  post_id: number;
  author_id?: string;
  body: string;
  created_at: string;
  reactions?: ReactionCounts;
  userReaction?: ReactionType;
  profiles?: { display_name: string; handle: string } | { display_name: string; handle: string }[] | null;
};

export type MemberResource = {
  id: number;
  kind: 'guide' | 'notes' | 'good_things';
  title: string;
  summary: string;
  body: string;
};
