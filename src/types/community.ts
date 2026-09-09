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

export type Pet = {
  id: number;
  owner_id?: string;
  name: string;
  breed?: string;
  age?: string;
  quirk?: string;
  avatar_url?: string;
  created_at?: string;
};

export type TaggedPet = {
  id: number;
  name: string;
  breed?: string;
  avatar_url?: string;
};

export type CommunityPost = {
  id: number;
  author_id?: string;
  body: string;
  topic: Topic;
  pet_id?: number;
  pet_ids?: number[];
  image_url?: string | null;
  pets?: TaggedPet | TaggedPet[] | null;
  created_at: string;
  reactions?: ReactionCounts;
  userReaction?: ReactionType;
  profiles?: { display_name: string; handle: string; avatar_url?: string } | { display_name: string; handle: string; avatar_url?: string }[] | null;
};

export function getTaggedPets(post: CommunityPost): TaggedPet[] {
  if (Array.isArray(post.pets)) return post.pets;
  if (post.pets && typeof post.pets === 'object') return [post.pets];
  return [];
}


export type CommunityComment = {
  id: number;
  post_id: number;
  author_id?: string;
  body: string;
  created_at: string;
  reactions?: ReactionCounts;
  userReaction?: ReactionType;
  profiles?: { display_name: string; handle: string; avatar_url?: string } | { display_name: string; handle: string; avatar_url?: string }[] | null;
};

export type MemberResource = {
  id: number;
  kind: 'guide' | 'notes' | 'good_things';
  title: string;
  summary: string;
  body: string;
};
