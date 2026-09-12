import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { AdSlot } from '../components/AdSlot';
import { EditorialPathways } from '../components/EditorialPathways';
import { JournalSection, type JournalSort } from '../components/JournalSection';
import { CareToolsSection } from '../components/tools/CareToolsSection';
import { featuredStories, practicalGuides, type EditorialChannel, type JournalEntry } from '../data/editorial';
import { getArticleId, getMemberStoryId } from '../lib/router';
import { articleHref } from '../lib/seo';
import type { MemberStory, Pet } from '../types/community';

type StoriesPageProps = {
  user?: User | null;
  userPets?: Pet[];
  memberStories?: MemberStory[];
};

const memberStoryCategoryLabels: Record<MemberStory['category'], string> = {
  cat_life: 'Cat life',
  care: 'Care & routines',
  home: 'Home & behavior',
  adoption: 'Adoption',
  rescue: 'Rescue & foster',
  other: 'Community story',
};

const channelLabels: Record<EditorialChannel, string> = {
  care: 'Care & health',
  home: 'Home & behavior',
  products: 'Product notes',
  journal: 'Field notes',
};

function ArticleReader({ entry, onBack }: { entry: JournalEntry; onBack: () => void }) {
  const relatedEntries = [...featuredStories, ...practicalGuides]
    .filter((candidate) => candidate.id !== entry.id && candidate.channel === entry.channel)
    .slice(0, 3);

  return (
    <article className="article-reader shell">
      <button type="button" className="article-back-link" onClick={onBack}>← Back to the Journal</button>
      <header className="article-reader-header">
        <p className="eyebrow"><i /> {entry.category} · {entry.readTime}</p>
        <h1>{entry.title}</h1>
        <p className="article-reader-dek">{entry.dek}</p>
        <div className="article-reader-meta"><span>Whiskerfield Editorial Desk</span><span>{entry.updated || 'Field note'}</span></div>
      </header>
      <div className="article-reader-layout">
        <div className="article-reader-body">
          {entry.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <aside className="article-reader-aside">
          <p className="eyebrow"><i /> Keep exploring</p>
          <h2>More from {channelLabels[entry.channel || 'journal']}.</h2>
          {relatedEntries.map((related) => <a href={articleHref(related.id)} key={related.id}>{related.title} →</a>)}
          <a href="#/stories#tools">Open free care tools →</a>
          <a href="#/care">Browse the Care Center →</a>
          <a href="#/members">Bring it to the Cat Club →</a>
          <p className="article-trust-note">Educational information is a starting point, not a diagnosis. For individual care, ask your veterinarian.</p>
        </aside>
      </div>
    </article>
  );
}

function MemberStoryReader({ story, onBack }: { story: MemberStory; onBack: () => void }) {
  const profile = Array.isArray(story.profiles) ? story.profiles[0] : story.profiles;
  return (
    <article className="article-reader shell member-story-reader">
      <button type="button" className="article-back-link" onClick={onBack}>← Back to the Journal</button>
      <header className="article-reader-header">
        <p className="eyebrow"><i /> {memberStoryCategoryLabels[story.category]} · Community story</p>
        <h1>{story.title}</h1>
        <p className="article-reader-dek">A story shared by {profile?.display_name || 'a Whiskerfield member'} for the cat people who come after.</p>
        <div className="article-reader-meta"><span>@{profile?.handle || 'cat_friend'}</span><span>{story.is_featured ? 'Featured by the editorial desk' : 'Shared with the Cat Club'}</span></div>
      </header>
      <div className="article-reader-layout">
        <div className="article-reader-body">
          {story.body.split(/\n\s*\n/).map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
        </div>
        <aside className="article-reader-aside">
          <p className="eyebrow"><i /> Keep exploring</p>
          <h2>More good company.</h2>
          <a href="#/stories">Browse the Whiskerfield Journal →</a>
          <a href="#/members">Share your own story →</a>
          <a href="#/products">Read member product reviews →</a>
          <p className="article-trust-note">Community stories are personal experiences, not medical advice. For individual care, ask your veterinarian.</p>
        </aside>
      </div>
    </article>
  );
}

function MemberStoriesSection({ stories }: { stories: MemberStory[] }) {
  if (stories.length === 0) return null;
  const visibleStories = [...stories].sort((a, b) => {
    if (Boolean(a.is_featured) !== Boolean(b.is_featured)) return a.is_featured ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return (
    <section className="shell member-story-section" aria-labelledby="member-stories-heading">
      <div className="member-story-heading">
        <div><p className="eyebrow"><i /> From the Cat Club</p><h2 id="member-stories-heading">Stories worth passing on.</h2></div>
        <p>Real homes, real routines, and the details that never make it into a generic guide. Featured stories are selected from member submissions.</p>
      </div>
      <div className="member-story-grid">
        {visibleStories.slice(0, 6).map((story) => {
          const profile = Array.isArray(story.profiles) ? story.profiles[0] : story.profiles;
          return (
            <a className={`member-story-card ${story.is_featured ? 'featured' : ''}`} href={`#/stories/member/${story.id}`} key={story.id}>
              <div className="member-story-card-meta"><span>{story.is_featured ? 'Featured story' : 'Member story'}</span><span>{memberStoryCategoryLabels[story.category]}</span></div>
              <h3>{story.title}</h3>
              <p>{story.body.slice(0, 190)}{story.body.length > 190 ? '…' : ''}</p>
              <footer><span>By {profile?.display_name || 'Cat friend'}</span><b>Read story →</b></footer>
            </a>
          );
        })}
      </div>
      <a href="#/members" className="member-story-cta">Share your story with the Cat Club →</a>
    </section>
  );
}

export function StoriesPage({ user, userPets, memberStories = [] }: StoriesPageProps) {
  const [articleId, setArticleId] = useState(() => typeof window !== 'undefined' ? getArticleId(window.location.hash || window.location.pathname, window.location.search) : '');
  const [memberStoryId, setMemberStoryId] = useState(() => typeof window !== 'undefined' ? getMemberStoryId(window.location.hash || window.location.pathname, window.location.search) : '');
  const [filter, setFilter] = useState<'all' | EditorialChannel>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<JournalSort>('editorial');
  const allJournalEntries = [...featuredStories, ...practicalGuides];
  const filters: Array<{ id: 'all' | EditorialChannel; label: string }> = [
    { id: 'all', label: 'Everything' },
    { id: 'care', label: 'Care & health' },
    { id: 'home', label: 'Home & behavior' },
    { id: 'products', label: 'Product notes' },
    { id: 'journal', label: 'Field notes' },
  ];
  const filterCounts = {
    all: allJournalEntries.length,
    care: allJournalEntries.filter((entry) => entry.channel === 'care').length,
    home: allJournalEntries.filter((entry) => entry.channel === 'home').length,
    products: allJournalEntries.filter((entry) => entry.channel === 'products').length,
    journal: allJournalEntries.filter((entry) => entry.channel === 'journal').length,
  };
  const article = [...featuredStories, ...practicalGuides].find((entry) => entry.id === articleId);
  const memberStory = memberStories.find((story) => String(story.id) === memberStoryId);

  useEffect(() => {
    const handleHashChange = () => {
      const source = window.location.hash || window.location.pathname;
      setArticleId(getArticleId(source, window.location.search));
      setMemberStoryId(getMemberStoryId(source, window.location.search));
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  if (article) {
    return <div className="stories-page stories-page-shell"><ArticleReader entry={article} onBack={() => { window.location.hash = '#/stories'; }} /></div>;
  }

  if (memberStory) {
    return <div className="stories-page stories-page-shell"><MemberStoryReader story={memberStory} onBack={() => { window.location.hash = '#/stories'; }} /></div>;
  }

  return (
    <div className="stories-page stories-page-shell">
      <div className="shell journal-intro">
        <p className="eyebrow"><i /> The Whiskerfield Journal</p>
        <h1>
          Stories for the life you share.
        </h1>
        <p>
          Practical care observations, honest field notes, and gentle routines for people building a good life with a cat.
        </p>
        <div className="journal-quicklinks" aria-label="Explore Whiskerfield">
          <a href="#/care">Care Center →</a>
          <a href="#/products">Product Lab →</a>
          <a href="#/news">Dispatch →</a>
          <a href="#/members">Cat Club →</a>
        </div>
      </div>

      <EditorialPathways />

      <section className="shell journal-controls" aria-label="Filter Journal">
        <fieldset className="journal-filter-row" aria-label="Journal topics">
          {filters.map((item) => (
            <button key={item.id} type="button" className={filter === item.id ? 'active' : ''} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
              {item.label} <span className="journal-filter-count">{filterCounts[item.id]}</span>
            </button>
          ))}
        </fieldset>
        <div className="journal-control-fields">
          <label className="journal-sort">
            <span>Sort articles</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as JournalSort)}>
              <option value="editorial">Editor’s order</option>
              <option value="shortest">Shortest read</option>
              <option value="alphabetical">Title A–Z</option>
            </select>
          </label>
          <label className="journal-search">
            <span>Search the Journal</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “senior”, “litter”, or “carrier”" />
          </label>
        </div>
      </section>

      <CareToolsSection user={user} userPets={userPets} />
      <JournalSection filter={filter} query={query} sort={sort} />
      <MemberStoriesSection stories={memberStories.filter((story) => story.is_published !== false)} />
      <AdSlot />
    </div>
  );
}
