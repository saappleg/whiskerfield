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

  const memberId = props.user.id;

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
      <section className="shell member-identity" aria-labelledby="member-identity-title">
        <div className="member-identity-main">
          <div className="member-avatar" aria-hidden="true">
            {props.profile?.avatar_url?.startsWith('http') || props.profile?.avatar_url?.startsWith('data:')
              // oxlint-disable-next-line next/no-img-element -- Member avatars are user-provided URLs.
              ? <img src={props.profile.avatar_url} alt="" />
              : <span>{props.profile?.display_name?.slice(0, 1).toUpperCase() || '🐾'}</span>}
          </div>
          <div>
            <p className="eyebrow"><i /> Your Cat Club corner</p>
            <h2 id="member-identity-title">{props.profile?.display_name || 'Cat friend'}</h2>
            <p className="member-identity-handle">@{props.profile?.handle || 'catfriend'}</p>
            <p className="member-identity-bio">{props.profile?.bio || 'A cat person making room for good questions, honest reviews, and the everyday moments that make a home.'}</p>
          </div>
          <button type="button" className="button outline member-identity-edit" onClick={props.onOpenProfile}>Edit profile &amp; cats →</button>
        </div>
        <div className="member-stat-strip" aria-label="Your Cat Club activity">
          <div><b>{props.userPets.length}</b><span>{props.userPets.length === 1 ? 'cat' : 'cats'}</span></div>
          <div><b>{props.posts.filter((post) => post.author_id === memberId).length}</b><span>posts</span></div>
          <div><b>{props.reviews.filter((review) => review.author_id === memberId).length}</b><span>reviews</span></div>
          <div><b>{props.memberStories.filter((story) => story.author_id === memberId).length}</b><span>stories</span></div>
        </div>
        <div className="member-roster">
          <div className="member-roster-heading"><div><p className="studio-kicker">The cats behind the account</p><h3>Your cat roster</h3></div><button type="button" onClick={props.onOpenProfile}>{props.userPets.length > 0 ? 'Manage roster →' : 'Add a cat →'}</button></div>
          {props.userPets.length > 0 ? (
            <div className="member-roster-grid">
              {props.userPets.map((pet) => (
                <article className="member-pet-card" key={pet.id}>
                  <div className="member-pet-avatar" aria-hidden="true">
                    {pet.avatar_url?.startsWith('http') || pet.avatar_url?.startsWith('data:')
                      // oxlint-disable-next-line next/no-img-element -- Member pet avatars are user-provided URLs.
                      ? <img src={pet.avatar_url} alt="" />
                      : <span>{pet.name.slice(0, 1).toUpperCase()}</span>}
                  </div>
                  <div><h4>{pet.name}</h4><p>{[pet.breed, pet.age].filter(Boolean).join(' · ') || 'Cat club member'}</p>{pet.quirk && <small>{pet.quirk}</small>}</div>
                </article>
              ))}
            </div>
          ) : (
            <button type="button" className="member-roster-empty" onClick={props.onOpenProfile}>Add your cats so posts, care tools, and reviews feel like they belong to your actual home <span>→</span></button>
          )}
        </div>
      </section>
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
