import { featuredStories } from '../data/editorial';
import { Hero } from '../components/Hero';
import { PostCard } from '../components/PostCard';
import type { CommunityComment, CommunityPost, ReactionType } from '../types/community';

type HomePageProps = {
  posts: CommunityPost[];
  comments: CommunityComment[];
  currentUserId?: string;
  onOpenAuth: () => void;
  onDeletePost: (id: number) => void;
  onReactPost: (postId: number, reaction: ReactionType) => void;
  onReactComment: (commentId: number, reaction: ReactionType) => void;
  onAddComment: (postId: number, body: string) => Promise<string | null>;
};

export function HomePage({
  posts,
  comments,
  currentUserId,
  onOpenAuth,
  onDeletePost,
  onReactPost,
  onReactComment,
  onAddComment,
}: HomePageProps) {
  const [leadStory, secondStory] = featuredStories;
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="home-page">
      <Hero onOpenAuth={onOpenAuth} />

      {/* Highlights: Cat Club Preview */}
      <section className="shell section-heading-wrap" style={{ marginTop: '72px' }}>
        <div className="section-heading">
          <div>
            <p className="eyebrow"><i /> From the Cat Club</p>
            <h2>Recent notes from cat people</h2>
          </div>
          <a href="#/community" className="button ink">
            Visit Cat Club →
          </a>
        </div>

        <div className="feed" style={{ maxWidth: '820px', margin: '0 auto' }}>
          {recentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              comments={comments}
              currentUserId={currentUserId}
              onDelete={onDeletePost}
              onReactPost={onReactPost}
              onReactComment={onReactComment}
              onAddComment={onAddComment}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      </section>

      {/* Highlights: Featured Reading */}
      <section className="story-band" style={{ marginTop: '84px' }}>
        <div className="shell">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <p className="eyebrow light"><i /> Featured Journal</p>
              <h2 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', margin: 0 }}>Stories for the life you share</h2>
            </div>
            <a href="#/stories" className="button coral">
              All stories &amp; guides →
            </a>
          </div>

          <div className="story-grid" style={{ gridTemplateColumns: '1.2fr .8fr' }}>
            <article className="story main-story">
              <p className="story-meta">{leadStory.category.toUpperCase()} · {leadStory.readTime.toUpperCase()}</p>
              <h2>{leadStory.title}</h2>
              <span className="story-dek">{leadStory.dek}</span>
              <a href="#/stories" className="button ink" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                Read full article →
              </a>
            </article>
            <article className="story sun-story">
              <p className="story-meta">{secondStory.category.toUpperCase()} · {secondStory.readTime.toUpperCase()}</p>
              <h3>{secondStory.title}</h3>
              <span className="story-dek">{secondStory.dek}</span>
              <a href="#/stories" className="button ink" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                Read full article →
              </a>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
