'use client';

import { FormEvent, useState } from 'react';

const stories = [
  {
    category: 'Home',
    title: 'The quiet-art-of-litter-box placement',
    description: 'A calmer corner starts with how the room feels, not just where the box fits.',
    readTime: '6 min read',
    tone: 'clay',
  },
  {
    category: 'Care',
    title: 'A no-drama guide to the senior-cat check-in',
    description: 'Small observations that help you arrive at the vet with useful context.',
    readTime: '8 min read',
    tone: 'blue',
  },
  {
    category: 'Culture',
    title: 'Why cat people are becoming better hosts',
    description: 'Design cues from the most considerate homes we have visited.',
    readTime: '5 min read',
    tone: 'yellow',
  },
];

const picks = [
  ['A scratching post that belongs in the living room', 'We tested stability, surface feel, and whether a skeptical cat would return to it.', 'Home test'],
  ['The travel carrier with a gentler opening act', 'A practical comparison for cats who would rather stay exactly where they are.', 'Field notes'],
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) setIsSubscribed(true);
  }

  return (
    <main>
      <div className="utility-bar">
        <div className="site-shell utility-inner">
          <span>Independent cat journalism, made slowly.</span>
          <span className="utility-right">For people who notice everything.</span>
        </div>
      </div>

      <header className="site-header">
        <div className="site-shell header-inner">
          <a className="wordmark" href="#top" aria-label="Whiskerfield home">
            <span className="wordmark-mark" aria-hidden="true">W</span>
            <span>Whiskerfield</span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#care">Care</a>
            <a href="#home">Home</a>
            <a href="#culture">Culture</a>
            <a href="#picks">Good things</a>
          </nav>
          <a className="header-cta" href="#newsletter">Get the Sunday letter <span aria-hidden="true">→</span></a>
          <button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav site-shell" aria-label="Mobile navigation">
            <a href="#care" onClick={() => setMenuOpen(false)}>Care</a>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#culture" onClick={() => setMenuOpen(false)}>Culture</a>
            <a href="#picks" onClick={() => setMenuOpen(false)}>Good things</a>
          </nav>
        )}
      </header>

      <section className="site-shell hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow light-eyebrow"><span /> The field guide to a good cat life</p>
          <h1>More curious cats.<br /><em>More considered</em> homes.</h1>
          <p className="hero-dek">Smart care, easy-to-live-with ideas, and honest finds for the years you get to share.</p>
          <div className="hero-actions">
            <a className="button button-coral" href="#latest">Read the latest <span aria-hidden="true">↗</span></a>
            <a className="text-link on-dark" href="#newsletter">Join 12,400 cat people <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img src="/cat-at-window.png" alt="A long-haired tabby cat resting in morning light by a window" className="hero-image" />
          <div className="image-caption"><span className="caption-dot" /> Home notes · Volume 04</div>
        </div>
      </section>

      <section className="site-shell feature-grid" id="latest">
        <article className="lead-story">
          <p className="eyebrow"><span /> The lead story</p>
          <h2>The 10-minute nightly reset your cat actually notices</h2>
          <p>It is less about a perfect routine and more about a few repeatable signals: a fresh bowl, a soft landing spot, and a room that settles down with them.</p>
          <a className="story-link" href="#newsletter">Read the guide <span aria-hidden="true">↗</span></a>
          <div className="byline"><span className="author-mark">MJ</span> By Marnie Jones <b>·</b> 7 min read</div>
        </article>
        <aside className="welcome-note">
          <div className="small-cat" aria-hidden="true">W</div>
          <p className="eyebrow"><span /> Start here</p>
          <h3>New to Whiskerfield?</h3>
          <p>Three gentle reads for a happier, better-understood cat.</p>
          <a className="story-link" href="#care">Browse the essentials <span aria-hidden="true">→</span></a>
        </aside>
      </section>

      <section className="site-shell section-block" id="care">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> Fresh on the journal</p>
            <h2>Useful, beautiful, and worth keeping.</h2>
          </div>
          <a className="text-link" href="#newsletter">All stories <span aria-hidden="true">→</span></a>
        </div>
        <div className="story-grid">
          {stories.map((story) => (
            <article className={`story-card ${story.tone}`} key={story.title} id={story.category === 'Home' ? 'home' : story.category === 'Culture' ? 'culture' : undefined}>
              <div className="card-topline"><span>{story.category}</span><span>{story.readTime}</span></div>
              <div className="story-orbit" aria-hidden="true">W</div>
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              <a className="round-arrow" href="#newsletter" aria-label={`Read ${story.title}`}><span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="site-shell picks-section" id="picks">
        <div className="picks-intro">
          <p className="eyebrow light-eyebrow"><span /> Good things, honestly reviewed</p>
          <h2>We only make room for what earns its place.</h2>
          <p>Reader-supported reviews of everyday cat essentials. When a link earns us a commission, we say so — and our opinion stays ours.</p>
          <p className="affiliate-note">Affiliate disclosure: some product links may earn Whiskerfield a small commission at no extra cost to you.</p>
        </div>
        <div className="pick-list">
          {picks.map(([title, description, label], index) => (
            <article className="pick-row" key={title}>
              <div className="pick-number">0{index + 1}</div>
              <div><p className="pick-label">{label}</p><h3>{title}</h3><p>{description}</p></div>
              <a className="round-arrow light-arrow" href="#newsletter" aria-label={`Explore ${title}`}><span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter-section" id="newsletter">
        <div className="site-shell newsletter-inner">
          <div>
            <p className="eyebrow"><span /> Sunday, in your inbox</p>
            <h2>A quieter kind of cat newsletter.</h2>
            <p>One useful story, one good find, and a little more delight. No noise, no nonsense.</p>
          </div>
          <div className="subscribe-panel">
            {isSubscribed ? (
              <div className="success-message"><span className="success-check" aria-hidden="true">✓</span> <span><strong>You’re on the list.</strong><br />The next letter will find you Sunday.</span></div>
            ) : (
              <form onSubmit={subscribe}>
                <label htmlFor="email">Your email address</label>
                <div className="email-row">
                  <span className="email-symbol" aria-hidden="true">@</span>
                  <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
                  <button type="submit">Subscribe <span aria-hidden="true">→</span></button>
                </div>
                <p>Free to join. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="site-shell site-footer">
        <a className="wordmark footer-mark" href="#top"><span className="wordmark-mark" aria-hidden="true">W</span><span>Whiskerfield</span></a>
        <p>For the life you share.</p>
        <div><a href="#picks">Work with us</a><a href="#newsletter">Newsletter</a><a href="#top">Instagram</a></div>
      </footer>
    </main>
  );
}
