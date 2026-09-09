import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { topicLabels } from '../data/community';
import { isImageAvatar } from '../lib/avatar';
import { useBookmarks } from '../lib/bookmarks';
import type { Profile } from '../lib/supabase';
import type { CommunityComment, CommunityPost, Pet, ReactionType, Topic } from '../types/community';
import { CatOfTheDay } from './CatOfTheDay';
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
  onPublish: (body: string, topic: Topic, petId?: number, imageUrl?: string) => Promise<string | null>;
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
  const [imageUrl, setImageUrl] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const { savedPostIds, isPostSaved, toggleSavePost } = useBookmarks();

  async function publish(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!user) {
      setError('Sign in with a quick magic link to share your note with the club.');
      onOpenAuth();
      return;
    }
    setBusy(true);
    setError('');
    const result = await onPublish(body, topic, selectedPetId, imageUrl.trim() || undefined);
    if (result) {
      setError(result);
    } else {
      setBody('');
      setSelectedPetId(undefined);
      setImageUrl('');
      setShowPhotoInput(false);
    }
    setBusy(false);
  }

  function handleFileSelect(e: { target: { files: FileList | null } }) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError('Image file is too large. Please select a photo under 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      setImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  const filteredPosts = posts.filter((p) => {
    if (showSavedOnly && !isPostSaved(p.id)) return false;
    if (activeTopicFilter !== 'all' && p.topic !== activeTopicFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchesBody = p.body.toLowerCase().includes(q);
    const matchesPet = p.pets && 'name' in p.pets && p.pets.name.toLowerCase().includes(q);
    const pProfile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
    const matchesAuthor =
      pProfile?.display_name.toLowerCase().includes(q) ||
      pProfile?.handle.toLowerCase().includes(q);
    return matchesBody || Boolean(matchesPet) || Boolean(matchesAuthor);
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
                {isImageAvatar(profile?.avatar_url) ? (
                  /* oxlint-disable-next-line next/no-img-element */
                  <img src={profile?.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

            <div className="composer-footer" style={{ flexWrap: 'wrap', gap: '.4rem' }}>
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
                      {isImageAvatar(pet.avatar_url) ? '🐱' : (pet.avatar_url || '🐱')} {pet.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={() => setShowPhotoInput((v) => !v)}
                style={{
                  background: imageUrl ? 'var(--moss, #2e5a44)' : 'transparent',
                  color: imageUrl ? '#fff' : 'var(--ink)',
                  border: '1px solid var(--line)',
                  borderRadius: '999px',
                  padding: '.35rem .75rem',
                  fontSize: '.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '.3rem',
                }}
              >
                📷 {imageUrl ? 'Photo attached' : 'Add photo'}
              </button>

              <span style={{ fontSize: '.75rem', marginLeft: 'auto', alignSelf: 'center' }}>{body.length}/1000</span>
              <button className="button ink" type="submit" disabled={busy}>
                {busy ? 'Sharing…' : 'Share note →'}
              </button>
            </div>

            {showPhotoInput && (
              <div
                style={{
                  marginTop: '.6rem',
                  padding: '.6rem .8rem',
                  background: 'var(--card-bg, #fff)',
                  border: '1px dashed var(--line)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '.5rem',
                }}
              >
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '.4rem .6rem',
                      fontSize: '.8rem',
                      borderRadius: '6px',
                      border: '1px solid var(--line)',
                    }}
                  />
                  <label
                    style={{
                      cursor: 'pointer',
                      padding: '.4rem .7rem',
                      fontSize: '.75rem',
                      borderRadius: '6px',
                      background: 'var(--cream, #f5f2eb)',
                      border: '1px solid var(--line)',
                      whiteSpace: 'nowrap',
                      fontWeight: 600,
                    }}
                  >
                    📁 Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {imageUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                    {/* oxlint-disable-next-line next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Upload preview"
                      style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid var(--line)',
                      }}
                    />
                    <span style={{ fontSize: '.75rem', color: 'var(--muted, #666)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {imageUrl.startsWith('data:') ? 'Local file attached' : imageUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--coral, #e76f51)',
                        cursor: 'pointer',
                        fontSize: '.85rem',
                        fontWeight: 'bold',
                      }}
                      title="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && <p className="form-error" role="alert">{error}</p>}
          </form>

          <PromptCard />
        </div>

        <div className="feed" aria-live="polite">
          <CatOfTheDay
            userPets={userPets}
            onSelectPetFilter={(name) => setSearchQuery(name)}
          />

          {/* Search bar */}
          <div style={{ marginBottom: '.75rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="search"
                placeholder="🔍 Search notes by keyword, cat name, or @author…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '.5rem .8rem',
                  fontSize: '.85rem',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: 'var(--card-bg, #fff)',
                  color: 'var(--ink)',
                  boxSizing: 'border-box',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '.6rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted, #888)',
                    fontSize: '.9rem',
                  }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Topic & Saved filter bar */}
          <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '.75rem' }}>
            <button
              type="button"
              onClick={() => {
                setShowSavedOnly(false);
                setActiveTopicFilter('all');
              }}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '999px',
                padding: '.3rem .75rem',
                fontSize: '.72rem',
                fontWeight: 800,
                background: !showSavedOnly && activeTopicFilter === 'all' ? 'var(--coral)' : 'var(--cream)',
                color: !showSavedOnly && activeTopicFilter === 'all' ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              All Topics
            </button>
            {(Object.keys(topicLabels) as Topic[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setShowSavedOnly(false);
                  setActiveTopicFilter(t);
                }}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '999px',
                  padding: '.3rem .75rem',
                  fontSize: '.72rem',
                  fontWeight: 800,
                  background: !showSavedOnly && activeTopicFilter === t ? 'var(--coral)' : 'var(--cream)',
                  color: !showSavedOnly && activeTopicFilter === t ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                {topicLabels[t]}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowSavedOnly((prev) => !prev)}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '999px',
                padding: '.3rem .75rem',
                fontSize: '.72rem',
                fontWeight: 800,
                background: showSavedOnly ? 'var(--moss, #2e5a44)' : 'var(--cream)',
                color: showSavedOnly ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              🔖 Saved ({savedPostIds.length})
            </button>
          </div>

          {feedError && <p className="form-error">{feedError}</p>}
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              comments={comments}
              currentUserId={user?.id}
              isSaved={isPostSaved(post.id)}
              onToggleSave={toggleSavePost}
              onDelete={onDelete}
              onReactPost={onReactPost}
              onReactComment={onReactComment}
              onAddComment={onAddComment}
              onOpenAuth={onOpenAuth}
            />
          ))}
          {!isLoading && filteredPosts.length === 0 && (
            <p className="empty-feed">
              {showSavedOnly
                ? 'No saved notes yet. Click the 🔖 Save button on any note to keep it handy!'
                : 'No notes found for this filter.'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
