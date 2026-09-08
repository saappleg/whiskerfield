import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { topicLabels } from '../data/community';
import type { Profile } from '../lib/supabase';
import type { CommunityPost, Topic } from '../types/community';
import { PostCard } from './PostCard';

type CommunitySectionProps = {
  user: User | null;
  profile: Profile | null;
  posts: CommunityPost[];
  feedError: string;
  isLoading: boolean;
  onRefresh: () => void;
  onPublish: (body: string, topic: Topic) => Promise<string | null>;
  onDelete: (id: number) => void;
  onOpenAuth: () => void;
};

export function CommunitySection({ user, profile, posts, feedError, isLoading, onRefresh, onPublish, onDelete, onOpenAuth }: CommunitySectionProps) {
  const [body, setBody] = useState('');
  const [topic, setTopic] = useState<Topic>('cat_life');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function publish(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!user) {
      setError('Sign in first, then your cat’s note can join the conversation.');
      onOpenAuth();
      return;
    }
    setBusy(true);
    setError('');
    const result = await onPublish(body, topic);
    if (result) setError(result);
    else setBody('');
    setBusy(false);
  }

  return <section className="shell community-section" id="community"><div className="section-heading"><div><p className="eyebrow"><i /> The cat club</p><h2>What’s good in your cat’s world?</h2></div><button className="refresh-button" onClick={onRefresh} disabled={isLoading}>{isLoading ? 'Refreshing…' : 'Refresh notes'}</button></div><div className="community-layout"><form className="composer" onSubmit={publish}><div className="composer-head"><span className="avatar">{profile?.display_name?.slice(0, 1) || 'W'}</span><div><b>{user ? `Posting as ${profile?.display_name || 'cat friend'}` : 'Your cat club note'}</b><p>{user ? 'Keep it kind, specific, and cat-shaped.' : 'Sign in with a magic link to share your own note.'}</p></div></div><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Share a tiny win, a question, or your cat’s latest decree…" maxLength={1000} aria-label="Write a community post" /><div className="composer-footer"><select value={topic} onChange={(event) => setTopic(event.target.value as Topic)} aria-label="Post topic">{(Object.keys(topicLabels) as Topic[]).map((item) => <option value={item} key={item}>{topicLabels[item]}</option>)}</select><span>{body.length}/1000</span><button className="button ink" type="submit" disabled={busy}>{busy ? 'Sharing…' : 'Share a note →'}</button></div>{error && <p className="form-error" role="alert">{error}</p>}</form><div className="feed" aria-live="polite">{feedError && <p className="form-error">{feedError}</p>}{posts.map((post) => <PostCard key={post.id} post={post} currentUserId={user?.id} onDelete={onDelete} />)}{!isLoading && posts.length === 0 && <p className="empty-feed">No notes yet. Be the first person to start a lovely thread.</p>}</div></div></section>;
}
