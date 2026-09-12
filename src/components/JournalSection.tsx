import { featuredStories, practicalGuides, type EditorialChannel, type JournalEntry } from '../data/editorial';

const channelLabels: Record<EditorialChannel, string> = {
  care: 'Care & health',
  home: 'Home & behavior',
  products: 'Product notes',
  journal: 'Field notes',
};

type JournalSectionProps = {
  filter?: 'all' | EditorialChannel;
  query?: string;
  sort?: JournalSort;
};

export type JournalSort = 'editorial' | 'shortest' | 'alphabetical';

function matchesEntry(entry: JournalEntry, filter: JournalSectionProps['filter'], query: string) {
  const haystack = `${entry.title} ${entry.dek} ${entry.category} ${entry.body.join(' ')}`.toLowerCase();
  const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
  const matchesFilter = !filter || filter === 'all' || entry.channel === filter;
  return matchesQuery && matchesFilter;
}

function readingMinutes(entry: JournalEntry) {
  const match = entry.readTime.match(/(\d+)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function sortEntries(entries: JournalEntry[], sort: JournalSort) {
  if (sort === 'editorial') return entries;
  return [...entries].sort((a, b) => {
    if (sort === 'shortest') {
      const minutes = readingMinutes(a) - readingMinutes(b);
      return minutes || a.title.localeCompare(b.title);
    }
    return a.title.localeCompare(b.title);
  });
}

function ArticleCard({ entry, index }: { entry: JournalEntry; index: number }) {
  const channel = entry.channel || 'journal';

  return (
    <a className="article-card" href={`#/stories/article/${entry.id}`} aria-label={`Read: ${entry.title}`}>
      <div className="article-card-top">
        <span className="article-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className="article-card-category">{entry.category}</span>
        <span className="article-card-time">{entry.readTime}</span>
      </div>
      <h3>{entry.title}</h3>
      <p>{entry.dek}</p>
      <div className="article-card-footer">
        <span>{channelLabels[channel]}</span>
        <span className="article-card-link">Read article <span aria-hidden="true">→</span></span>
      </div>
    </a>
  );
}

export function JournalSection({ filter = 'all', query = '', sort = 'editorial' }: JournalSectionProps) {
  const allEntries = [...featuredStories, ...practicalGuides];
  const isBrowsingEverything = filter === 'all' && !query.trim();
  const matchingEntries = allEntries.filter((entry) => matchesEntry(entry, filter, query));
  const featuredEntries = featuredStories.filter((entry) => matchesEntry(entry, filter, query));
  // Keep the editor's picks distinct from the full library. When a visitor searches or filters,
  // the library becomes the single, complete result set so nothing appears twice.
  const libraryEntries = sortEntries(isBrowsingEverything ? practicalGuides : matchingEntries, sort);

  return (
    <section id="stories">
      {isBrowsingEverything && (
        <section className="journal-featured" aria-labelledby="journal-featured-heading">
          <div className="shell">
            <div className="journal-featured-heading">
              <div>
                <p className="eyebrow light"><i /> Start here</p>
                <h2 id="journal-featured-heading">Editor’s picks for this week.</h2>
              </div>
              <p>A few thoughtful places to begin, then a clearly labeled library of everything else.</p>
            </div>
            <div className="journal-featured-grid">
              {featuredEntries.map((entry, index) => (
                <a className={`journal-featured-card ${index === 0 ? 'journal-featured-card-lead' : ''}`} href={`#/stories/article/${entry.id}`} key={entry.id}>
                  <div className="article-card-top">
                    <span className="article-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="article-card-category">{entry.category}</span>
                    <span className="article-card-time">{entry.readTime}</span>
                  </div>
                  {index === 0 ? <h3>{entry.title}</h3> : <h4>{entry.title}</h4>}
                  <p>{entry.dek}</p>
                  <span className="article-card-link">Read article <span aria-hidden="true">→</span></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="shell article-library" id="guides" aria-labelledby="article-library-heading">
        <div className="guide-heading">
          <div>
            <p className="eyebrow"><i /> {isBrowsingEverything ? 'The full library' : 'Journal results'}</p>
            <h2 id="article-library-heading">{isBrowsingEverything ? 'The rest of the Journal, easy to scan.' : `${libraryEntries.length} ${libraryEntries.length === 1 ? 'article' : 'articles'} to explore.`}</h2>
          </div>
          <p>Each card tells you the topic, the time it takes, and exactly what you’ll get before you open it.</p>
        </div>
        <p className="journal-result-count" aria-live="polite">
          {libraryEntries.length === 0 ? 'No articles match that search yet.' : `${libraryEntries.length} ${libraryEntries.length === 1 ? 'article' : 'articles'} shown`}
        </p>
        {libraryEntries.length > 0 ? (
          <div className="article-library-grid">
            {libraryEntries.map((entry, index) => <ArticleCard entry={entry} index={index} key={entry.id} />)}
          </div>
        ) : (
          <p className="empty-editorial-state">Try a broader phrase or choose <strong>Everything</strong> to browse the full Journal.</p>
        )}
      </section>
    </section>
  );
}
