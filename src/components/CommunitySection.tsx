import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { topicLabels } from '../data/community';
import type { Profile } from '../lib/supabase';
import type { CommunityComment, CommunityPost, Pet, ReactionType, Topic } from '../types/community';
import { PostCard } from './PostCard';
import { PromptCard } from './PromptCard';

type CommunitySectionProps = {
  user: User | null;
  profile: Profile | null;
  userPets: Pet[];
  posts: CommunityPost[];
  comments: CommunityComment[];
  feedError: string;
  isLoading: boolean;
  onRefresh: () => void;
  onPublish: (body: string, topic: Topic, petId?: number) => Promise<string | null>;
  onDelete: (id: number) => void;
  onReactPost: (postId: number, reaction: ReactionType) => void;
  onReactComment: (commentId: number, reaction: ReactionType) => void;
  onAddComment: (postId: number, body: string) => Promise<string | null>;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
};

export function CommunitySection({
  user,
  profile,
  userPets,
  posts,
  comments,
  feedError,
  isLoading,
  onRefresh,
  onPublish,
  onDelete,
  onReactPost,
  onReactComment,
  onAddComment,
  onOpenAuth,
  onOpenProfile,
}: CommunitySectionProps) {
  const [body, setBody] = useState('');
  const [topic, setTopic] = useState<Topic>('cat_life');
  const [selectedPetId, setSelectedPetId] = useState<number | undefined>(undefined);
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function publish(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!user) {
      setError('Sign in with a quick magic link to share your note with the club.');
      onOpenAuth();
      return;
    }
    setBusy(true);
    setError('');
    const result = await onPublish(body, topic, selectedPetId);
    if (result) {
      setError(result);
    } else {
      setBody('');
      setSelectedPetId(undefined);
    }
    setBusy(false);
  }

  const filteredPosts = posts.filter((p) => {
    if (activeTopicFilter === 'all') return true;
    return p.topic === activeTopicFilter;
  });

  return (
    <section className="shell community-section" id="community">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><i /> The cat club</p>
          <h2>What’s good in your cat’s world?</h2>
        </div>
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
          {user && onOpenProfile && (
            <button type="button" className="refresh-button" onClick={onOpenProfile}>
              👤 My Profile &amp; Cats ({userPets.length})
            </button>
          )}
          <button type="button" className="refresh-button" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? 'Refreshing…' : 'Refresh notes'}
          </button>
        </div>
      </div>

      <div className="community-layout">
        <div className="composer-column">
          <form className="composer" onSubmit={publish}>
            <div className="composer-head">
              <span className="avatar" style={{ overflow: 'hidden' }}>
                {profile?.avatar_url && profile.avatar_url.startsWith('http') ? (
                  /* oxlint-disable-next-line next/no-img-element */
                  <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile?.display_name?.slice(0, 1) || 'W'
                )}
              </span>
              <div>
                <b>{user ? `Posting as ${profile?.display_name || 'cat friend'}` : 'Your cat club note'}</b>
                <p>{user ? 'Keep it kind, specific, and cat-shaped.' : 'Sign in with a magic link to share your own note.'}</p>
              </div>
            </div>

            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Share a tiny win, a question, or your cat’s latest decree…"
              maxLength={1000}
              aria-label="Write a community post"
            />

            <div className="composer-footer" style={{ flexWrap: 'wrap' }}>
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value as Topic)}
                aria-label="Post topic"
              >
                {(Object.keys(topicLabels) as Topic[]).map((item) => (
                  <option value={item} key={item}>
                    {topicLabels[item]}
                  </option>
                ))}
              </select>

              {userPets.length > 0 && (
                <select
                  value={selectedPetId || ''}
                  onChange={(e) => setSelectedPetId(e.target.value ? Number(e.target.value) : undefined)}
                  aria-label="Tag a cat"
                  style={{ maxWidth: '160px' }}
                >
                  <option value="">🐾 No pet tag</option>
                  {userPets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.avatar_url || '🐱'} {pet.name}
                    </option>
                  ))}
                </select>
              )}

              <span>{body.length}/1000</span>
              <button className="button ink" type="submit" disabled={busy}>
                {busy ? 'Sharing…' : 'Share note →'}
              </button>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
          </form>

          <PromptCard />
        </div>

        <div className="feed" aria-live="polite">
          {/* Topic filter bar */}
          <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '.4rem' }}>
            <button
              type="button"
              onClick={() => setActiveTopicFilter('all')}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '999px',
                padding: '.3rem .75rem',
                fontSize: '.72rem',
                fontWeight: 800,
                background: activeTopicFilter === 'all' ? 'var(--coral)' : 'var(--cream)',
                color: activeTopicFilter === 'all' ? '#fff' : 'var(--ink)',
              }}
            >
              All Topics
            </button>
            {(Object.keys(topicLabels) as Topic[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTopicFilter(t)}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '999px',
                  padding: '.3rem .75rem',
                  fontSize: '.72rem',
                  fontWeight: 800,
                  background: activeTopicFilter === t ? 'var(--coral)' : 'var(--cream)',
                  color: activeTopicFilter === t ? '#fff' : 'var(--ink)',
                }}
              >
                {topicLabels[t]}
              </button>
            ))}
          </div>

          {feedError && <p className="form-error">{feedError}</p>}
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              comments={comments}
              currentUserId={user?.id}
              onDelete={onDelete}
              onReactPost={onReactPost}
              onReactComment={onReactComment}
              onAddComment={onAddComment}
              onOpenAuth={onOpenAuth}
            />
          ))}
          {!isLoading && filteredPosts.length === 0 && (
            <p className="empty-feed">No notes found for this category.</p>
          )}
        </div>
      </div>
    </section>
  );
}
