import { featuredStories, practicalGuides } from '../data/editorial';
import { previewPosts, topicLabels } from '../data/community';
import { communityTopics, discoveryHubs, productPrinciples } from '../data/discovery';
import { Hero } from '../components/Hero';

type HomePageProps = {
  onOpenAuth: () => void;
  signedIn: boolean;
};

export function HomePage({ onOpenAuth, signedIn }: HomePageProps) {
  const [leadStory, secondStory] = featuredStories;
  const guideHighlights = practicalGuides.slice(0, 3);

  return (
    <div className="home-page">
      <Hero onOpenAuth={onOpenAuth} />

      <section className="shell discovery-section" aria-labelledby="find-your-place">
        <div className="section-kicker-row">
          <div>
            <p className="eyebrow"><i /> A bigger, kinder cat internet</p>
            <h2 id="find-your-place">Find your place in Whiskerfield.</h2>
          </div>
          <p>Come for good company, care you can actually use, gear with a point of view, and a quieter way to keep up with the cat world.</p>
        </div>
        <div className="discovery-grid">
          <a href="#/members" className="discovery-card community-card">
            <p>THE CAT CLUB</p>
            <h3>Come in. Your cat has a seat saved.</h3>
            <span>Questions, tiny wins, photo replies, and people who understand why the box is part of the décor.</span>
            <b>Meet the community →</b>
          </a>
          {discoveryHubs.map((hub) => (
            <a href={`#/${hub.route}`} className={`discovery-card ${hub.accent}`} key={hub.route}>
              <p>{hub.eyebrow.toUpperCase()}</p>
              <h3>{hub.title}</h3>
              <span>{hub.summary}</span>
              <b>{hub.action} →</b>
            </a>
          ))}
        </div>
      </section>

      <section className="shell care-now-panel">
        <div>
          <p className="eyebrow light"><i /> Care now</p>
          <h2>Helpful when something is on your mind.</h2>
          <p>Open a plant and food safety checker, organize a health binder, create a sitter guide, or find a gentle starting point for the everyday questions.</p>
        </div>
        <div className="care-now-actions">
          <a href="#/stories#tools" className="button care-tool-button">Open free tools →</a>
          <a href="#/care" className="care-link">Browse care guides →</a>
        </div>
      </section>

      <section className="community-showcase">
        <div className="shell community-showcase-inner">
          <div className="community-showcase-copy">
            <p className="eyebrow light"><i /> The social part</p>
            <h2>For the life that happens between the big moments.</h2>
            <p>The Cat Club is a calm, member-led feed for help, happy tears, windowsill supervision, and every breed of cat question. It is free to join and designed to feel welcoming from the first post.</p>
            <div className="community-actions">
              <a href="#/members" className="button coral">{signedIn ? 'Open the Cat Club →' : 'Join the Cat Club →'}</a>
              {!signedIn && <button type="button" className="text-link light-link" onClick={onOpenAuth}>Sign in →</button>}
            </div>
          </div>
          <div className="community-topic-list">
            {communityTopics.map((topic) => (
              <div className="community-topic" key={topic.title}>
                <span aria-hidden="true">{topic.icon}</span>
                <div><h3>{topic.title}</h3><p>{topic.detail}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell live-preview-section" aria-labelledby="latest-cat-club">
        <div className="home-section-heading">
          <div><p className="eyebrow"><i /> A public look inside the Cat Club</p><h2 id="latest-cat-club">A little of what members are sharing.</h2></div>
          <a href="#/members" className="button ink">Join to see the full community →</a>
        </div>
        <div className="home-post-grid">
          {previewPosts.slice(0, 3).map((post) => {
            const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
            const reactionCount = Object.values(post.reactions ?? {}).reduce((sum, count) => sum + (count ?? 0), 0);
            return (
              <article className="home-post-preview" key={post.id}>
                <header><span className="home-post-avatar">{profile?.display_name?.slice(0, 1) || '🐾'}</span><div><b>{profile?.display_name || 'Cat friend'}</b><p>@{profile?.handle || 'whiskerfriend'} · {topicLabels[post.topic]}</p></div></header>
                <p>{post.body}</p>
                {post.image_url && <><span className="sr-only">Photo shared with this note</span>{/* oxlint-disable-next-line next/no-img-element -- Static community preview image. */}<img src={post.image_url} alt="A cat-home moment shared by a Whiskerfield member" /></>}
                <footer><span>🐾 {reactionCount} reactions</span><span>🔒 Sign in to reply</span></footer>
              </article>
            );
          })}
        </div>
      </section>

      <section className="shell product-home-feature">
        <div className="product-home-image">
          {/* oxlint-disable-next-line next/no-img-element -- Static WebP is optimized for this Vite/GitHub Pages site. */}
          <img src="./images/editorial/product-lab-home.webp" alt="A tabby cat relaxing beside a scratching post, water fountain, and carrier in a sunlit home" width="1536" height="1024" loading="lazy" />
          <span>Product Lab</span>
        </div>
        <div className="product-home-copy">
          <p className="eyebrow"><i /> A better product shelf</p>
          <h2>Recommendations should be useful, not just adorable.</h2>
          <p>We are building product notes around what truly matters in a cat home: a cat using the thing, a person living with it, and no fine-print surprises.</p>
          <div className="mini-principles">
            {productPrinciples.map((principle) => <span key={principle.title}>{principle.icon} {principle.title}</span>)}
          </div>
          <a href="#/products" className="button ink">Visit Product Lab →</a>
        </div>
      </section>

      <section className="story-band story-band-home">
        <div className="shell">
          <div className="home-section-heading">
            <div>
              <p className="eyebrow light"><i /> From the Whiskerfield journal</p>
              <h2>Stories for the life you share.</h2>
            </div>
            <a href="#/stories" className="button coral">Open the journal →</a>
          </div>
          <div className="story-grid home-story-grid">
            <article className="story main-story" id={`story-${leadStory.id}`}>
              <p className="story-meta">{leadStory.category.toUpperCase()} · {leadStory.readTime.toUpperCase()}</p>
              <h2>{leadStory.title}</h2>
              <span className="story-dek">{leadStory.dek}</span>
              <a href={`#/stories/article/${leadStory.id}`} className="button coral story-button">Read the piece →</a>
            </article>
            <article className="story sun-story" id={`story-${secondStory.id}`}>
              <p className="story-meta">{secondStory.category.toUpperCase()} · {secondStory.readTime.toUpperCase()}</p>
              <h3>{secondStory.title}</h3>
              <span className="story-dek">{secondStory.dek}</span>
              <a href={`#/stories/article/${secondStory.id}`} className="button ink story-button">Read the piece →</a>
            </article>
          </div>
        </div>
      </section>

      <section className="shell guide-preview-section">
        <div className="home-section-heading">
          <div><p className="eyebrow"><i /> Cat care, at your pace</p><h2>Practical reading for every home.</h2></div>
          <a href="#/care" className="button ink">Explore the Care Center →</a>
        </div>
        <div className="guide-grid">
          {guideHighlights.map((guide) => (
            <article className={`guide-card ${guide.tone}`} key={guide.id} id={`story-${guide.id}`}>
              <p className="guide-meta">{guide.category} · {guide.readTime}</p>
              <h3>{guide.title}</h3>
              <span className="guide-dek">{guide.dek}</span>
              <a href={`#/stories/article/${guide.id}`} className="guide-link">Read guide →</a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
