import { useMemo, useState } from 'react';
import { relativeTime } from '../lib/time';
import type { MemberReview, MemberStory, ReviewCategory, ReviewVerdict, StoryCategory } from '../types/community';

type MemberContributionStudioProps = {
  userId: string;
  reviews: MemberReview[];
  stories: MemberStory[];
  onPublishReview: (productName: string, category: ReviewCategory, rating: number, title: string, body: string, verdict: ReviewVerdict) => Promise<string | null>;
  onPublishStory: (title: string, category: StoryCategory, body: string, submitForFeature: boolean) => Promise<string | null>;
  onDeleteReview: (id: number) => Promise<void>;
  onDeleteStory: (id: number) => Promise<void>;
};

const reviewCategories: Array<{ value: ReviewCategory; label: string }> = [
  { value: 'scratchers', label: 'Scratchers' },
  { value: 'carriers', label: 'Carriers & travel' },
  { value: 'feeding', label: 'Feeding & water' },
  { value: 'litter', label: 'Litter' },
  { value: 'enrichment', label: 'Toys & enrichment' },
  { value: 'home', label: 'Home & furniture' },
  { value: 'other', label: 'Other' },
];

const storyCategories: Array<{ value: StoryCategory; label: string }> = [
  { value: 'cat_life', label: 'Cat life' },
  { value: 'care', label: 'Care & routines' },
  { value: 'home', label: 'Home & behavior' },
  { value: 'adoption', label: 'Adoption' },
  { value: 'rescue', label: 'Rescue & foster' },
  { value: 'other', label: 'Other' },
];

export function MemberContributionStudio({
  userId,
  reviews,
  stories,
  onPublishReview,
  onPublishStory,
  onDeleteReview,
  onDeleteStory,
}: MemberContributionStudioProps) {
  const [productName, setProductName] = useState('');
  const [reviewCategory, setReviewCategory] = useState<ReviewCategory>('other');
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [verdict, setVerdict] = useState<ReviewVerdict>('recommend');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyCategory, setStoryCategory] = useState<StoryCategory>('cat_life');
  const [storyBody, setStoryBody] = useState('');
  const [submitForFeature, setSubmitForFeature] = useState(true);
  const [busy, setBusy] = useState<'review' | 'story' | ''>('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const myReviews = useMemo(() => reviews.filter((review) => review.author_id === userId).slice(0, 3), [reviews, userId]);
  const myStories = useMemo(() => stories.filter((story) => story.author_id === userId).slice(0, 3), [stories, userId]);

  async function submitReview(event: { preventDefault: () => void }) {
    event.preventDefault();
    setBusy('review');
    setError('');
    setNotice('');
    const result = await onPublishReview(productName, reviewCategory, rating, reviewTitle, reviewBody, verdict);
    if (result) setError(result);
    else {
      setProductName('');
      setReviewTitle('');
      setReviewBody('');
      setNotice('Your review is live in the Product Lab. Thank you for leaving the trade-offs in.');
    }
    setBusy('');
  }

  async function submitStory(event: { preventDefault: () => void }) {
    event.preventDefault();
    setBusy('story');
    setError('');
    setNotice('');
    const result = await onPublishStory(storyTitle, storyCategory, storyBody, submitForFeature);
    if (result) setError(result);
    else {
      setStoryTitle('');
      setStoryBody('');
      setNotice(submitForFeature
        ? 'Your story is live and in the editorial queue for a possible Journal feature.'
        : 'Your story is live in the community Journal.');
    }
    setBusy('');
  }

  return (
    <section className="shell member-studio" id="member-studio" aria-labelledby="member-studio-title">
      <div className="member-studio-heading">
        <div>
          <p className="eyebrow"><i /> Make the internet better</p>
          <h2 id="member-studio-title">Put your experience on the shelf.</h2>
        </div>
        <p>Share what worked, what did not, or the small story another cat person needs to hear. Helpful member contributions can become part of the public Product Lab and Journal.</p>
      </div>

      <div className="studio-grid">
        <form className="studio-card studio-review-card" onSubmit={submitReview}>
          <div className="studio-card-heading"><span className="studio-icon" aria-hidden="true">★</span><div><p className="studio-kicker">Product Lab</p><h3>Review something your cat actually used.</h3></div></div>
          <div className="review-writing-guide" id="review-writing-guide">
            <strong>A useful review answers three small questions.</strong>
            <ul>
              <li>What did your cat actually do with it?</li>
              <li>What would you change or warn someone about?</li>
              <li>Which cat or kind of home is it a good fit for?</li>
            </ul>
          </div>
          <label>Product or setup<input value={productName} onChange={(event) => setProductName(event.target.value)} maxLength={120} placeholder="e.g. a window perch, litter, water fountain" required /></label>
          <div className="studio-form-row">
            <label>Category<select value={reviewCategory} onChange={(event) => setReviewCategory(event.target.value as ReviewCategory)}>{reviewCategories.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
            <label>Rating<select value={rating} onChange={(event) => setRating(Number(event.target.value))}>{[5, 4, 3, 2, 1].map((value) => <option value={value} key={value}>{'★'.repeat(value)} {value}/5</option>)}</select></label>
          </div>
          <label>Review title<input value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value)} maxLength={120} placeholder="What should another cat person know?" required /></label>
          <label>Your honest take<textarea aria-describedby="review-writing-guide review-body-note" value={reviewBody} onChange={(event) => setReviewBody(event.target.value)} maxLength={2000} placeholder="What worked? What did not? Who would you buy it for?" required /><span className="studio-counter">{reviewBody.length}/2000</span><span className="studio-field-note" id="review-body-note">Specific details beat a perfect verdict: setup, durability, cleanup, and your cat’s reaction are all useful.</span></label>
          <label>Bottom line<select value={verdict} onChange={(event) => setVerdict(event.target.value as ReviewVerdict)}><option value="recommend">Recommend with context</option><option value="mixed">Mixed / depends on the home</option><option value="skip">Would skip</option></select></label>
          <button className="button ink" type="submit" disabled={busy !== ''}>{busy === 'review' ? 'Publishing…' : 'Publish review →'}</button>
        </form>

        <form className="studio-card studio-story-card" onSubmit={submitStory}>
          <div className="studio-card-heading"><span className="studio-icon" aria-hidden="true">✦</span><div><p className="studio-kicker">Community Journal</p><h3>Tell a story worth passing on.</h3></div></div>
          <label>Story title<input value={storyTitle} onChange={(event) => setStoryTitle(event.target.value)} maxLength={140} placeholder="The small routine that changed our mornings" required /></label>
          <label>Topic<select value={storyCategory} onChange={(event) => setStoryCategory(event.target.value as StoryCategory)}>{storyCategories.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
          <label>Your story<textarea value={storyBody} onChange={(event) => setStoryBody(event.target.value)} maxLength={5000} placeholder="Write the useful, honest, specific version. Aim for at least a few paragraphs." required /><span className="studio-counter">{storyBody.length}/5000</span></label>
          <label className="studio-checkbox"><input aria-label="Send story to editorial queue" type="checkbox" checked={submitForFeature} onChange={(event) => setSubmitForFeature(event.target.checked)} /><span><b>Send it to the editorial queue</b><small>Editors may feature a strong community story in the public Journal.</small></span></label>
          <button className="button coral" type="submit" disabled={busy !== ''}>{busy === 'story' ? 'Publishing…' : 'Publish story →'}</button>
        </form>
      </div>

      {(notice || error) && <p className={error ? 'form-error studio-status' : 'studio-status'} role={error ? 'alert' : 'status'}>{error || notice}</p>}

      {(myReviews.length > 0 || myStories.length > 0) && (
        <div className="my-contributions">
          <div><p className="eyebrow"><i /> Your shelf</p><h3>Recent contributions.</h3></div>
          <div className="my-contribution-list">
            {[...myReviews.map((review) => ({ id: review.id, kind: 'Review', title: review.title, time: review.created_at, remove: () => onDeleteReview(review.id) })), ...myStories.map((story) => ({ id: story.id, kind: 'Story', title: story.title, time: story.created_at, remove: () => onDeleteStory(story.id) }))].slice(0, 5).map((item) => (
              <div className="my-contribution" key={`${item.kind}-${item.id}`}><span>{item.kind}</span><b>{item.title}</b><small>{relativeTime(item.time)}</small><button type="button" onClick={() => void item.remove()}>Remove</button></div>
            ))}
          </div>
          <p className="studio-byline-note">Every contribution leaves a clearer trail for the next cat person who comes looking.</p>
        </div>
      )}
    </section>
  );
}
