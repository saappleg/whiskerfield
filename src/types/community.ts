export type Topic = 'cat_life' | 'care' | 'introductions' | 'home';

export type ReactionType = 'like' | 'love' | 'treat' | 'sad' | 'laugh' | 'omg' | 'angry';

export type ReactionMeta = {
  key: ReactionType;
  label: string;
  emoji: string;
};

export const REACTIONS: ReactionMeta[] = [
  { key: 'like', label: 'Like', emoji: '😸' },
  { key: 'love', label: 'Love', emoji: '😻' },
  { key: 'treat', label: 'Give a Treat', emoji: '🐟' },
  { key: 'sad', label: 'Sad', emoji: '😿' },
  { key: 'laugh', label: 'Laugh', emoji: '😹' },
  { key: 'omg', label: 'OMG', emoji: '🙀' },
  { key: 'angry', label: 'Angry', emoji: '😾' },
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
