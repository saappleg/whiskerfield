import { useState } from 'react';
import { AvatarImage } from './AvatarImage';
import { topicLabels } from '../data/community';
import { relativeTime } from '../lib/time';
import type { CommunityComment, CommunityPost, ReactionType } from '../types/community';
import { ImageLightbox } from './ImageLightbox';
import { ReactionsBar } from './ReactionsBar';

type PostCardProps = {
  post: CommunityPost;
  comments: CommunityComment[];
  currentUserId?: string;
  isSaved?: boolean;
  onToggleSave?: (postId: number) => void;
  onDelete: (id: number) => void;
  onReactPost: (postId: number, reaction: ReactionType) => void;
  onReactComment: (commentId: number, reaction: ReactionType) => void;
  onAddComment: (postId: number, body: string) => Promise<string | null>;
  onOpenAuth: () => void;
};

export function PostCard({
  post,
  comments,
  currentUserId,
  isSaved,
  onToggleSave,
  onDelete,
  onReactPost,
  onReactComment,
  onAddComment,
  onOpenAuth,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [busy, setBusy] = useState(false);
  const [replyError, setReplyError] = useState('');

  const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
  const author = profile || { display_name: 'Cat friend', handle: 'whiskerfriend' };
  const postComments = comments.filter((c) => c.post_id === post.id);

  async function handleReply(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!replyText.trim()) return;
    setBusy(true);
    setReplyError('');
    const err = await onAddComment(post.id, replyText);
    if (err) {
      setReplyError(err);
    } else {
      setReplyText('');
      setShowComments(true);
    }
    setBusy(false);
  }

  const taggedPet = post.pets;

  return (
    <article className="post-card">
      <header>
        <span className="avatar warm" style={{ overflow: 'hidden' }}>
          <AvatarImage
            src={author.avatar_url}
            alt={author.display_name}
            fallback={author.display_name.slice(0, 1)}
          />
        </span>
        <div>
          <b>{author.display_name}</b>
          <p>@{author.handle} · {relativeTime(post.created_at)}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.6rem', flexWrap: 'wrap' }}>
          {taggedPet && (
            <span
              className="pet-badge"
              title={taggedPet.breed ? `${taggedPet.name} (${taggedPet.breed})` : taggedPet.name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '.35rem',
                fontSize: '.72rem',
                fontWeight: 800,
                padding: '.25rem .6rem',
                background: 'rgba(243,108,77,.12)',
                color: 'var(--coral)',
                borderRadius: '999px',
                border: '1px solid rgba(243,108,77,.25)',
              }}
            >
              <AvatarImage
                src={taggedPet.avatar_url}
                alt=""
                fallback={<span>{taggedPet.avatar_url || '🐾'}</span>}
                style={{ width: '16px', height: '16px', borderRadius: '50%' }}
              />
              <span>{taggedPet.name}</span>
            </span>
          )}
          <span className="topic">{topicLabels[post.topic]}</span>
        </div>
      </header>

      <p className="post-body">{post.body}</p>

      {post.image_url && (
        <div
          style={{
            margin: '.6rem 0 1rem',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid var(--line)',
            background: 'var(--paper)',
            maxHeight: '380px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            style={{ border: 0, padding: 0, background: 'transparent', width: '100%', cursor: 'zoom-in', display: 'block' }}
            aria-label="Enlarge photo"
          >
            {/* oxlint-disable-next-line next/no-img-element */}
            <img
              src={post.image_url}
              alt={post.body.slice(0, 50)}
              referrerPolicy="no-referrer"
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
            />
          </button>
        </div>
      )}

      {lightboxOpen && post.image_url && (
        <ImageLightbox
          imageUrl={post.image_url}
          caption={post.body.slice(0, 120)}
          petBadge={taggedPet ? `🐾 ${taggedPet.name}` : undefined}
          authorName={author.display_name}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div className="post-interactions">
        <ReactionsBar
          reactions={post.reactions}
          userReaction={post.userReaction}
          onReact={(reaction) => onReactPost(post.id, reaction)}
        />
      </div>

      <footer>
        <button
          type="button"
          className="comments-toggle"
          onClick={() => setShowComments(!showComments)}
          aria-expanded={showComments}
        >
          {postComments.length > 0
            ? `💬 ${postComments.length} ${postComments.length === 1 ? 'reply' : 'replies'}`
            : '💬 Leave a reply'}
        </button>

        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(post.id)}
            style={{
              border: 0,
              padding: 0,
              background: 'transparent',
              color: isSaved ? 'var(--coral)' : 'var(--ink-soft)',
              fontSize: '.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.25rem',
            }}
            title={isSaved ? 'Remove from saved' : 'Save note to bookmarks'}
          >
            {isSaved ? '🔖 Saved' : '🔖 Save'}
          </button>
        )}

        {currentUserId && post.author_id === currentUserId && (
          <button type="button" className="delete-button" onClick={() => onDelete(post.id)}>
            Remove
          </button>
        )}
      </footer>

      {showComments && (
        <div className="comments-drawer">
          {postComments.length > 0 && (
            <div className="comments-list">
              {postComments.map((comment) => {
                const cProfile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
                const cAuthor = cProfile || { display_name: 'Cat friend', handle: 'friend' };
                return (
                  <div className="comment-item" key={comment.id}>
                    <span className="avatar small" style={{ overflow: 'hidden' }}>
                      <AvatarImage
                        src={cAuthor.avatar_url}
                        alt=""
                        fallback={cAuthor.display_name.slice(0, 1)}
                      />
                    </span>
                    <div className="comment-content">
                      <div className="comment-header">
                        <b>{cAuthor.display_name}</b>
                        <span className="comment-time">@{cAuthor.handle} · {relativeTime(comment.created_at)}</span>
                      </div>
                      <p>{comment.body}</p>
                      <ReactionsBar
                        reactions={comment.reactions}
                        userReaction={comment.userReaction}
                        onReact={(reaction) => onReactComment(comment.id, reaction)}
                        compact
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentUserId ? (
            <form className="comment-composer" onSubmit={handleReply}>
              <input
                type="text"
                placeholder="Add a gentle reply…"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                maxLength={500}
                aria-label="Reply to post"
              />
              <button type="submit" disabled={busy || !replyText.trim()}>
                {busy ? 'Sending…' : 'Reply'}
              </button>
            </form>
          ) : (
            <div className="comment-signin-prompt">
              <p>Sign in with a quick magic link to join the conversation and reply.</p>
              <button type="button" onClick={onOpenAuth}>
                Sign in to reply →
              </button>
            </div>
          )}
          {replyError && <p className="form-error" role="alert">{replyError}</p>}
        </div>
      )}
    </article>
  );
}
