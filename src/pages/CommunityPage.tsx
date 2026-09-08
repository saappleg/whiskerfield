import type { User } from '@supabase/supabase-js';
import { CommunitySection } from '../components/CommunitySection';
import type { Profile } from '../lib/supabase';
import type { CommunityComment, CommunityPost, ReactionType, Topic } from '../types/community';

type CommunityPageProps = {
  user: User | null;
  profile: Profile | null;
  posts: CommunityPost[];
  comments: CommunityComment[];
  feedError: string;
  isLoading: boolean;
  onRefresh: () => void;
  onPublish: (body: string, topic: Topic) => Promise<string | null>;
  onDelete: (id: number) => void;
  onReactPost: (postId: number, reaction: ReactionType) => void;
  onReactComment: (commentId: number, reaction: ReactionType) => void;
  onAddComment: (postId: number, body: string) => Promise<string | null>;
  onOpenAuth: () => void;
};

export function CommunityPage(props: CommunityPageProps) {
  return (
    <div className="community-page" style={{ paddingBottom: '96px' }}>
      <CommunitySection {...props} />
    </div>
  );
}
