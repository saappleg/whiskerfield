import type { User } from '@supabase/supabase-js';
import { CommunitySection } from '../components/CommunitySection';
import { MemberGate } from '../components/MemberGate';
import type { Profile } from '../lib/supabase';
import type { CommunityComment, CommunityPost, ReactionType, Topic } from '../types/community';

type MembersPageProps = {
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

export function MembersPage(props: MembersPageProps) {
  if (!props.user) {
    return <MemberGate onOpenAuth={props.onOpenAuth} />;
  }

  return (
    <div className="members-page" style={{ paddingBottom: '96px' }}>
      <div className="shell" style={{ paddingTop: '60px', marginBottom: '-60px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem 1.4rem',
            background: 'var(--mint)',
            border: '1px solid var(--line)',
          }}
        >
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>
              <i /> Member Club Active
            </p>
            <h2 style={{ fontSize: '1.25rem', margin: '.25rem 0 0', color: 'var(--ink)' }}>
              Welcome back, {props.profile?.display_name || 'Cat Friend'} (@{props.profile?.handle || 'friend'})
            </h2>
          </div>
          <span
            style={{
              fontSize: '.72rem',
              fontWeight: 800,
              padding: '.35rem .75rem',
              background: 'var(--cream)',
              border: '1px solid var(--line)',
              borderRadius: '999px',
              color: 'var(--coral)',
            }}
          >
            ✓ Club Member
          </span>
        </div>
      </div>

      <CommunitySection {...props} />
    </div>
  );
}
