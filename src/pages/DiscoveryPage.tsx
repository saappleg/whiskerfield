import type { User } from '@supabase/supabase-js';
import { dispatchStories, dispatchTopics, productRecommendations, productPrinciples, type DiscoveryRoute } from '../data/discovery';
import { amazonProducts, amazonSearchUrl, amazonShelfCategories } from '../lib/affiliate';
import type { MemberReview } from '../types/community';

type DiscoveryPageProps = {
  route: DiscoveryRoute;
  reviews?: MemberReview[];
  user?: User | null;
  onOpenAuth?: () => void;
};

const reviewCategoryLabels: Record<MemberReview['product_category'], string> = {
  scratchers: 'Scratchers',
  carriers: 'Carriers & travel',
  feeding: 'Feeding & water',
  litter: 'Litter',
  enrichment: 'Toys & enrichment',
  home: 'Home & furniture',
  other: 'Other',
};

const verdictLabels: Record<MemberReview['verdict'], string> = {
  recommend: 'Recommend with context',
  mixed: 'Mixed / depends on the home',
  skip: 'Would skip',
};

function MemberReviewShelf({ reviews = [], user, onOpenAuth }: { reviews?: MemberReview[]; user?: User | null; onOpenAuth?: () => void }) {
  return (
    <section className="shell member-review-section" aria-labelledby="member-review-heading">
      <div className="member-review-heading">
        <div><p className="eyebrow"><i /> From the Cat Club</p><h2 id="member-review-heading">What cat people actually kept.</h2></div>
        <p>Member reviews are experience reports, not paid rankings. Look for the trade-off, the setup, and whether the product fits your particular home.</p>
      </div>
      <div className="member-review-cta"><span>Have a real-world take?</span>{user ? <a href="#/members#member-studio">Write a member review →</a> : <button type="button" onClick={onOpenAuth}>Sign in to review a product →</button>}</div>
      <div className="member-review-grid">
        {reviews.length > 0 ? reviews.slice(0, 6).map((review) => {
          const profile = Array.isArray(review.profiles) ? review.profiles[0] : review.profiles;
          return (
            <article className="member-review-card" key={review.id}>
              <div className="member-review-meta"><span>{reviewCategoryLabels[review.product_category]}</span><span aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}<span className="review-empty-stars">{'★'.repeat(5 - review.rating)}</span></span></div>
              <p className="member-review-product">{review.product_name}</p>
              <h3>{review.title}</h3>
              <p>{review.body.slice(0, 210)}{review.body.length > 210 ? '…' : ''}</p>
              <div className="member-review-footer"><span>{profile?.display_name || 'Cat friend'} · {verdictLabels[review.verdict]}</span><span>{review.created_at.slice(0, 10)}</span></div>
            </article>
          );
        }) : <div className="member-review-empty"><h3>No member reviews yet.</h3><p>Be the first to leave a useful note about something your cat has actually lived with.</p></div>}
      </div>
    </section>
  );
}

function AmazonShelfSection() {
  return (
    <section className="shell amazon-shelf-section" id="amazon-shelf" aria-labelledby="amazon-shelf-heading">
      <div className="section-kicker-row">
        <div>
          <p className="eyebrow"><i /> The Whiskerfield shelf</p>
          <h2 id="amazon-shelf-heading">A few cat-home picks worth a look.</h2>
        </div>
        <p>Tried and tested products from our own home. Products we keep going back to for more or have seen major usage in our cat family.</p>
      </div>
      <div className="amazon-product-grid" aria-label="Featured Amazon products">
        {amazonProducts.map((product) => (
          <a className={`amazon-product-card ${product.accent}`} href={product.url} key={product.url} target="_blank" rel="sponsored nofollow noopener">
            <span className="amazon-product-category">{product.category}</span>
            <span className="amazon-shelf-arrow" aria-hidden="true">↗</span>
            <h3>{product.name}</h3>
            <p>{product.detail}</p>
            {product.note && <small>{product.note}</small>}
            <b>View on Amazon <span className="affiliate-link-label">(affiliate link)</span></b>
          </a>
        ))}
      </div>
      <div className="amazon-category-heading">
        <div>
          <p className="eyebrow"><i /> Keep browsing</p>
          <h3>Looking for something else?</h3>
        </div>
        <p>Browse a few everyday cat-home categories.</p>
      </div>
      <div className="amazon-shelf-grid">
        {amazonShelfCategories.map((category) => (
          <a className={`amazon-shelf-card ${category.accent}`} href={amazonSearchUrl(category.query)} key={category.label} target="_blank" rel="sponsored nofollow noopener">
            <span className="amazon-shelf-arrow" aria-hidden="true">↗</span>
            <h3>{category.label}</h3>
            <p>{category.detail}</p>
            <b>Browse on Amazon <span className="affiliate-link-label">(affiliate link)</span></b>
          </a>
        ))}
      </div>
      <p className="affiliate-disclosure">As an Amazon Associate I earn from qualifying purchases. Product opinions remain independent, and member reviews are not paid rankings.</p>
    </section>
  );
}

const pageCopy = {
  care: {
    eyebrow: 'Whiskerfield care center',
    title: 'Care that starts with paying attention.',
    intro: 'Clear, calming guidance for the everyday parts of life with a cat—plus free tools that help you organize what you notice. Educational only: your veterinarian is the right person for individual medical advice.',
  },
  products: {
    eyebrow: 'Whiskerfield product lab',
    title: 'Good cat gear has to earn its spot.',
    intro: 'We think a recommendation should make a shared home work better, not create one more thing to manage. Our Product Lab centers real-cat use, safety, durability, and the honest trade-offs.',
  },
  news: {
    eyebrow: 'The Whiskerfield dispatch',
    title: 'Cat news, with the volume turned down.',
    intro: 'A calm editorial desk for the care, science, rescue, and culture stories cat people want context for—not noise. Current reporting will always show its date and source.',
  },
} as const;

const carePaths = [
  ['Start with a change', 'What to note when your cat seems a little different.', '#/stories/article/notice-the-small-things'],
  ['Build a better home', 'Litter box placement, scratchers, enrichment, and gentle resets.', '#/stories/article/litter-box-placement'],
  ['Care for every age', 'Observations that make a senior-cat check-in more useful.', '#/stories/article/senior-cat-checkin'],
  ['Use a free tool', 'Safety checkers, hydration estimates, a health binder, and more.', '#/stories#tools'],
  ['Welcome a new cat', 'A soft landing for an adopted cat’s first month at home.', '#/stories/article/first-thirty-days-adopted-cat'],
  ['Prepare before you need it', 'A small emergency kit and a plan that keeps urgent moments clear.', '#/stories/article/cat-home-emergency-kit'],
];

const productPaths = [
  ['Scratchers that stay put', 'How to judge stability, surface, height, and placement before buying.', '#/stories/article/scratcher-belongs-here'],
  ['The carrier question', 'The features that can make vet-day handling calmer for everyone.', '#/stories/article/two-useful-things'],
  ['Everyday water setup', 'A small routine for fresher water, better placement, and one less point of friction.', '#/stories/article/nightly-reset'],
  ['The honest disclosure', 'If a recommendation ever earns a commission, it will be labeled plainly.', '#/privacy'],
  ['A safer window perch', 'How to keep the view, the route, and the landing spot in the same conversation.', '#/stories/article/safer-window-watching'],
  ['A play rotation that works', 'A simple way to bring novelty back without leaving every toy out forever.', '#/stories/article/play-that-ends-well'],
];

export function DiscoveryPage({ route, reviews, user, onOpenAuth }: DiscoveryPageProps) {
  const copy = pageCopy[route];

  return (
    <div className={`discovery-page ${route}-page`}>
      <section className="shell discovery-hero">
        <p className="eyebrow"><i /> {copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
        {route === 'care' && <a href="#/stories#tools" className="button coral">Open free care tools →</a>}
        {route === 'products' && <a href="#product-method" className="button coral">See our standard ↓</a>}
        {route === 'news' && <a href="#dispatch-standard" className="button coral">Our reporting standard ↓</a>}
      </section>

      {route === 'care' && (
        <section className="shell pathway-section" aria-label="Cat care pathways">
          <div className="section-kicker-row">
            <div>
              <p className="eyebrow"><i /> Find your next helpful thing</p>
              <h2>Care pathways for ordinary days.</h2>
            </div>
            <p>General education, never a substitute for veterinary care. If you believe your cat may be in urgent danger, contact a veterinarian or emergency resource now.</p>
          </div>
          <div className="pathway-grid">
            {carePaths.map(([title, detail, href], index) => (
              <a href={href} className="pathway-card" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
                <b>Open guide →</b>
              </a>
            ))}
          </div>
        </section>
      )}

      {route === 'products' && (
        <>
          <section className="shell product-feature">
            <div className="product-feature-image">
              {/* oxlint-disable-next-line next/no-img-element -- Static WebP is optimized for this Vite/GitHub Pages site. */}
              <img src="./images/editorial/product-lab-home.webp" alt="A tabby cat relaxing in a sunlit living room beside a scratching post, water fountain, and carrier" width="1536" height="1024" loading="eager" />
              <p>In a cat home, not a lab.</p>
            </div>
            <div className="product-feature-copy">
              <p className="eyebrow"><i /> The first question</p>
              <h2>Will this make daily life better for a cat and their person?</h2>
              <p>We are building a shelf of buying guides and reviews around that one test. Product categories are useful; consumer pressure and hidden drawbacks are worth naming too.</p>
              <p className="product-disclosure">When we publish a product recommendation, testing context, conflicts, and any affiliate disclosure belong alongside it—not in tiny print.</p>
            </div>
          </section>
          <section className="shell method-section" id="product-method">
            <p className="eyebrow"><i /> How we assess recommendations</p>
            <h2>Three questions before “add to cart.”</h2>
            <div className="principle-grid">
              {productPrinciples.map((principle) => (
                <article key={principle.title} className="principle-card">
                  <span aria-hidden="true">{principle.icon}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.detail}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="shell recommendation-section" aria-label="Product Lab recommendations">
            <div className="section-kicker-row">
              <div><p className="eyebrow"><i /> The shortlist</p><h2>Good starting points, with trade-offs included.</h2></div>
              <p>These are category-level recommendations, not paid rankings. Start with the “good for” line, then see whether the object fits your cat and your home.</p>
            </div>
            <div className="recommendation-grid">
              {productRecommendations.map((recommendation) => (
                <article className={`recommendation-card ${recommendation.accent}`} key={recommendation.name}>
                  <p className="recommendation-label">{recommendation.label}</p>
                  <h3>{recommendation.name}</h3>
                  <dl>
                    <div><dt>Good for</dt><dd>{recommendation.goodFor}</dd></div>
                    <div><dt>Skip if</dt><dd>{recommendation.skipIf}</dd></div>
                  </dl>
                  <p className="recommendation-note">{recommendation.note}</p>
                  <a href={recommendation.href}>Read the field note →</a>
                </article>
              ))}
            </div>
          </section>
          <MemberReviewShelf reviews={reviews} user={user} onOpenAuth={onOpenAuth} />
          <AmazonShelfSection />
          <section className="shell pathway-section product-paths" aria-label="Product Lab guides">
            <div className="section-kicker-row">
              <div><p className="eyebrow"><i /> Begin here</p><h2>Make a more useful cat home.</h2></div>
              <p>These field notes offer a clear place to begin. They do not recommend a specific retailer or brand.</p>
            </div>
            <div className="pathway-grid">
              {productPaths.map(([title, detail, href], index) => (
                <a href={href} className="pathway-card" key={title}>
                  <span>0{index + 1}</span><h3>{title}</h3><p>{detail}</p><b>Open note →</b>
                </a>
              ))}
            </div>
          </section>
        </>
      )}

      {route === 'news' && (
        <>
          <section className="shell dispatch-feature" id="dispatch-standard">
            <p className="eyebrow light"><i /> What you can expect here</p>
            <h2>Useful updates need context, not just urgency.</h2>
            <p>When the Whiskerfield Dispatch covers a current event, recall, or study, we will clearly show the publish date, source, relevant update, and where the facts end. We will not turn a thin signal into a scare headline.</p>
          </section>
          <section className="shell dispatch-story-grid" aria-label="Sourced Dispatch reading">
            {dispatchStories.map((story) => (
              <article className={`dispatch-story-card ${story.accent}`} key={story.title}>
                <p>{story.label}</p>
                <h2>{story.title}</h2>
                <span>{story.detail}</span>
                <a href={story.sourceUrl} target="_blank" rel="noreferrer">{story.sourceLabel} ↗</a>
              </article>
            ))}
          </section>
          <section className="shell dispatch-grid" aria-label="Dispatch editorial principles">
            {dispatchTopics.map((topic) => (
              <article key={topic.title}>
                <p>{topic.label}</p><h2>{topic.title}</h2><span>{topic.detail}</span>
              </article>
            ))}
          </section>
          <section className="shell callout-panel">
            <div><p className="eyebrow"><i /> A better inbox, eventually</p><h2>The weekly dispatch is in the works.</h2><p>Until then, the best place to find good company is the Cat Club: a respectful, member-led feed for the questions and small delights of everyday cat life.</p></div>
            <a href="#/members" className="button ink">Enter the Cat Club →</a>
          </section>
        </>
      )}
    </div>
  );
}
