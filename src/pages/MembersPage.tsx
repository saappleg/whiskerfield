import type { User } from '@supabase/supabase-js';
import { CommunitySection } from '../components/CommunitySection';
import { MemberGate } from '../components/MemberGate';
import { MemberContributionStudio } from '../components/MemberContributionStudio';
import type { Profile } from '../lib/supabase';
import type { CommunityComment, CommunityPost, MemberReview, MemberStory, Pet, ReactionType, ReviewCategory, ReviewVerdict, StoryCategory, Topic } from '../types/community';

type MembersPageProps = {
  user: User | null;
  profile: Profile | null;
  userPets: Pet[];
  posts: CommunityPost[];
  comments: CommunityComment[];
  feedError: string;
  isLoading: boolean;
  onRefresh: () => void;
  onPublish: (body: string, topic: Topic, petIds?: number | number[], imageUrl?: string) => Promise<string | null>;
  onDelete: (id: number) => void;
  onReactPost: (postId: number, reaction: ReactionType) => void;
  onReactComment: (commentId: number, reaction: ReactionType) => void;
  onAddComment: (postId: number, body: string) => Promise<string | null>;
  reviews: MemberReview[];
  memberStories: MemberStory[];
  onPublishReview: (productName: string, category: ReviewCategory, rating: number, title: string, body: string, verdict: ReviewVerdict) => Promise<string | null>;
  onPublishMemberStory: (title: string, category: StoryCategory, body: string, submitForFeature: boolean) => Promise<string | null>;
  onDeleteReview: (id: number) => Promise<void>;
  onDeleteMemberStory: (id: number) => Promise<void>;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
};

export function MembersPage(props: MembersPageProps) {
  if (!props.user) {
    return (
      <div className="members-page" style={{ paddingBottom: '96px' }}>
        <MemberGate onOpenAuth={props.onOpenAuth} />
      </div>
    );
  }

  return (
    <div className="members-page" style={{ paddingBottom: '96px' }}>
      <div className="shell member-welcome">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}><i /> Member Club Active</p>
          <h2>Welcome back, {props.profile?.display_name || 'Cat Friend'} (@{props.profile?.handle || 'friend'})</h2>
        </div>
        <div className="member-welcome-actions">
          <button type="button" onClick={props.onOpenProfile}>⚙️ Profile &amp; Cats ({props.userPets.length})</button>
          <span>✓ Club Member</span>
        </div>
      </div>
      <CommunitySection {...props} />
      <MemberContributionStudio
        userId={props.user.id}
        reviews={props.reviews}
        stories={props.memberStories}
        onPublishReview={props.onPublishReview}
        onPublishStory={props.onPublishMemberStory}
        onDeleteReview={props.onDeleteReview}
        onDeleteStory={props.onDeleteMemberStory}
      />
    </div>
  );
}
