export type Topic = 'cat_life' | 'care' | 'introductions' | 'home';

export type CommunityPost = {
  id: number;
  author_id?: string;
  body: string;
  topic: Topic;
  created_at: string;
  profiles?: { display_name: string; handle: string } | { display_name: string; handle: string }[] | null;
};

export type MemberResource = {
  id: number;
  kind: 'guide' | 'notes' | 'good_things';
  title: string;
  summary: string;
  body: string;
};
