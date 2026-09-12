import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { topicLabels } from '../data/community';
import { useBookmarks } from '../lib/bookmarks';
import type { Profile } from '../lib/supabase';
import { type CommunityComment, type CommunityPost, type Pet, type ReactionType, type Topic, getTaggedPets } from '../types/community';
import { AvatarImage } from './AvatarImage';
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
  onPublish: (body: string, topic: Topic, petIds?: number[], imageUrl?: string) => Promise<string | null>;
  onDelete: (id: number) => void;
  onReactPost: (postId: number, reaction: ReactionType) => void;
  onReactComment: (commentId: number, reaction: ReactionType) => void;
  onAddComment: (postId: number, body: string) => Promise<string | null>;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
};

type FeedSort = 'latest' | 'popular' | 'discussed';

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
  const [selectedPetIds, setSelectedPetIds] = useState<number[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [feedSort, setFeedSort] = useState<FeedSort>('latest');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const { savedPostIds, isPostSaved, toggleSavePost } = useBookmarks();

  function togglePet(id: number) {
    setSelectedPetIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function publish(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!user) {
      setError('Sign in with a magic link, email/password, or passkey to share your note with the club.');
      onOpenAuth();
      return;
    }
    setBusy(true);
    setError('');
    const result = await onPublish(body, topic, selectedPetIds.length > 0 ? selectedPetIds : undefined, imageUrl.trim() || undefined);
    if (result) {
      setError(result);
    } else {
      setBody('');
      setSelectedPetIds([]);
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
    const taggedPets = getTaggedPets(p);
    const matchesPet = taggedPets.some((pet) => pet.name.toLowerCase().includes(q));
    const pProfile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
    const matchesAuthor =
      pProfile?.display_name.toLowerCase().includes(q) ||
      pProfile?.handle.toLowerCase().includes(q);
    return matchesBody || matchesPet || Boolean(matchesAuthor);
  });

  // Keep the feed useful even after it grows beyond the seeded set: members can
  // catch up with new notes, discover the community's most-loved notes, or jump
  // into the conversations with the most replies. This stays client-side so it
  // works for the preview feed as well as live Supabase data.
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (feedSort === 'popular') {
      const score = (post: CommunityPost) => Object.values(post.reactions ?? {}).reduce((sum, count) => sum + (count ?? 0), 0);
      return score(b) - score(a) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (feedSort === 'discussed') {
      const replies = (post: CommunityPost) => comments.filter((comment) => comment.post_id === post.id).length;
      return replies(b) - replies(a) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
                <AvatarImage
                  src={profile?.avatar_url}
                  alt=""
                  fallback={profile?.display_name?.slice(0, 1) || 'W'}
                />
              </span>
              <div>
                <b>{user ? `Posting as ${profile?.display_name || 'cat friend'}` : 'Your cat club note'}</b>
                <p>{user ? 'Keep it kind, specific, and cat-shaped.' : 'Sign in with a magic link, email/password, or passkey to share your own note.'}</p>
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
                <div
                  className="pet-tag-selector"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '.35rem',
                    flexWrap: 'wrap',
                    padding: '.2rem 0',
                  }}
                  aria-label="Tag cats in your note"
                >
                  <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--ink-soft)' }}>Tag:</span>
                  {userPets.map((pet) => {
                    const isSelected = selectedPetIds.includes(pet.id);
                    return (
                      <button
                        key={pet.id}
                        type="button"
                        onClick={() => togglePet(pet.id)}
                        aria-pressed={isSelected}
                        title={isSelected ? `Untag ${pet.name}` : `Tag ${pet.name}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '.3rem',
                          padding: '.25rem .6rem',
                          borderRadius: '999px',
                          fontSize: '.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: isSelected ? '1px solid var(--coral)' : '1px solid var(--line)',
                          background: isSelected ? 'rgba(243,108,77,.14)' : 'var(--cream)',
                          color: isSelected ? 'var(--coral)' : 'var(--ink)',
                          boxShadow: isSelected ? '0 1px 3px rgba(243,108,77,.2)' : 'none',
                          transition: 'all .15s ease',
                        }}
                      >
                        <AvatarImage
                          src={pet.avatar_url}
                          alt=""
                          fallback={<span>{pet.avatar_url || '🐾'}</span>}
                          style={{ width: '15px', height: '15px', borderRadius: '50%' }}
                        />
                        <span>{pet.name}</span>
                        {isSelected ? (
                          <span style={{ fontSize: '.65rem', fontWeight: 900 }}>✓</span>
                        ) : (
                          <span style={{ fontSize: '.75rem', opacity: 0.5 }}>+</span>
                        )}
                      </button>
                    );
                  })}
                  {selectedPetIds.length > 1 && (
                    <span style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--coral)' }}>
                      ({selectedPetIds.length} cats)
                    </span>
                  )}
                </div>
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
                background: !showSavedOnly && activeTopicFilter === 'all' ? 'var(--ink)' : 'var(--cream)',
                color: !showSavedOnly && activeTopicFilter === 'all' ? 'var(--paper)' : 'var(--ink)',
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
                  background: !showSavedOnly && activeTopicFilter === t ? 'var(--ink)' : 'var(--cream)',
                  color: !showSavedOnly && activeTopicFilter === t ? 'var(--paper)' : 'var(--ink)',
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

          <div className="feed-sort-row" aria-label="Choose how to browse the feed">
            <span className="feed-sort-label">Browse by</span>
            {([
              ['latest', 'Latest'],
              ['popular', 'Most reacted'],
              ['discussed', 'Most discussed'],
            ] as Array<[FeedSort, string]>).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`feed-sort-button ${feedSort === value ? 'active' : ''}`}
                onClick={() => setFeedSort(value)}
                aria-pressed={feedSort === value}
              >
                {label}
              </button>
            ))}
            <span className="feed-result-count">
              {sortedPosts.length} {sortedPosts.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {feedError && <p className="form-error">{feedError}</p>}
          {sortedPosts.map((post) => (
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
