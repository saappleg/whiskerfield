import { featuredStories, practicalGuides } from '../data/editorial';
import { Hero } from '../components/Hero';

type HomePageProps = {
  onOpenAuth: () => void;
  signedIn: boolean;
};

export function HomePage({ onOpenAuth, signedIn }: HomePageProps) {
  const [leadStory, secondStory] = featuredStories;
  const guideHighlights = practicalGuides.slice(0, 3);

  return (
    <div className="home-page" style={{ paddingBottom: '96px' }}>
      <Hero onOpenAuth={onOpenAuth} />

      {/* Featured Free Stories */}
      <section className="story-band" style={{ marginTop: '72px' }}>
        <div className="shell">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="eyebrow light"><i /> Free Journal &amp; Guides</p>
              <h2 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', margin: 0 }}>Stories for the life you share</h2>
            </div>
            <a href="#/stories" className="button coral">
              All stories &amp; guides →
            </a>
          </div>

          <div className="story-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            <article className="story main-story">
              <p className="story-meta">{leadStory.category.toUpperCase()} · {leadStory.readTime.toUpperCase()}</p>
              <h2>{leadStory.title}</h2>
              <span className="story-dek">{leadStory.dek}</span>
              <a href="#/stories" className="button ink" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                Read free article →
              </a>
            </article>
            <article className="story sun-story">
              <p className="story-meta">{secondStory.category.toUpperCase()} · {secondStory.readTime.toUpperCase()}</p>
              <h3>{secondStory.title}</h3>
              <span className="story-dek">{secondStory.dek}</span>
              <a href="#/stories" className="button ink" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                Read free article →
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* Member Club Showcase */}
      <section className="shell" style={{ marginTop: '80px' }}>
        <div
          style={{
            background: 'var(--cream)',
            border: '1px solid var(--line)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <p className="eyebrow"><i /> The Member Club</p>
            <h2 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', lineHeight: 1.05, margin: '.4rem 0 1.2rem' }}>
              A private, calm social space for cat lovers.
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontSize: '1.02rem', marginBottom: '1.8rem' }}>
              Behind our member panel is the Cat Club — a gentle community where members trade real care notes, celebrate tiny cat quirks, give 7 cat reactions, and share advice with zero spam or ads.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#/members" className="button ink">
                {signedIn ? 'Enter Member Club →' : 'Join Member Club (Free) →'}
              </a>
              {!signedIn && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  style={{
                    border: 0,
                    background: 'transparent',
                    color: 'var(--ink)',
                    fontSize: '.85rem',
                    fontWeight: 800,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Sign in with magic link →
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1.2rem', background: '#fff', border: '1px solid var(--line)', borderLeft: '4px solid var(--coral)' }}>
              <b style={{ fontSize: '.88rem', color: 'var(--ink)' }}>😸 7 Cat Reactions</b>
              <p style={{ margin: '.3rem 0 0', fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                Purr, Give a Treat, Love, Laugh, and more on daily notes.
              </p>
            </div>
            <div style={{ padding: '1.2rem', background: '#fff', border: '1px solid var(--line)', borderLeft: '4px solid var(--sun)' }}>
              <b style={{ fontSize: '.88rem', color: 'var(--ink)' }}>💬 Private Reply Threads</b>
              <p style={{ margin: '.3rem 0 0', fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                Gentle discussion with real cat owners, with verified handles.
              </p>
            </div>
            <div style={{ padding: '1.2rem', background: '#fff', border: '1px solid var(--line)', borderLeft: '4px solid var(--mint)' }}>
              <b style={{ fontSize: '.88rem', color: 'var(--ink)' }}>✨ Always 100% Free</b>
              <p style={{ margin: '.3rem 0 0', fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                No subscription, no spam. One-tap magic link sign in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Practical Guides Preview */}
      <section className="shell" style={{ marginTop: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="eyebrow"><i /> Care &amp; Routine Guides</p>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: 0 }}>Practical reading for every home</h2>
          </div>
          <a href="#/stories" className="button ink">
            View all 9 free guides →
          </a>
        </div>

        <div className="guide-grid">
          {guideHighlights.map((guide) => (
            <article className={`guide-card ${guide.tone}`} key={guide.id}>
              <p className="guide-meta">{guide.category} · {guide.readTime}</p>
              <h3>{guide.title}</h3>
              <span className="guide-dek">{guide.dek}</span>
              <a href="#/stories" style={{ marginTop: 'auto', paddingTop: '1rem', fontWeight: 800, fontSize: '.82rem', color: 'inherit', textDecoration: 'underline' }}>
                Read guide →
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
