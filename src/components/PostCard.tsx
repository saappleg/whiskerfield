import { topicLabels } from '../data/community';
import { relativeTime } from '../lib/time';
import type { CommunityPost } from '../types/community';

type PostCardProps = { post: CommunityPost; currentUserId?: string; onDelete: (id: number) => void };

export function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
  const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
  const author = profile || { display_name: 'Cat friend', handle: 'whiskerfriend' };
  return <article className="post-card"><header><span className="avatar warm">{author.display_name.slice(0, 1)}</span><div><b>{author.display_name}</b><p>@{author.handle} · {relativeTime(post.created_at)}</p></div><span className="topic">{topicLabels[post.topic]}</span></header><p className="post-body">{post.body}</p><footer><span>♡ A thoughtful nod</span>{currentUserId && post.author_id === currentUserId && <button onClick={() => onDelete(post.id)}>Remove</button>}</footer></article>;
}
