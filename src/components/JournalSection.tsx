import { featuredStories, practicalGuides, type JournalEntry } from '../data/editorial';

function StoryBody({ entry }: { entry: JournalEntry }) {
  return (
    <details className="story-details">
      <summary className="story-toggle">
        <span>Read full piece</span>
        <span aria-hidden="true" className="toggle-arrow">↓</span>
      </summary>
      <div className="article-body">
        {entry.body.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </details>
  );
}

export function JournalSection() {
  const [lead, sideOne, sideTwo] = featuredStories;

  return (
    <section id="stories">
      <section className="story-band">
        <div className="shell story-grid">
          <article className="story main-story">
            <p className="story-meta">{lead.category.toUpperCase()} · {lead.readTime.toUpperCase()}</p>
            <h2>{lead.title}</h2>
            <span className="story-dek">{lead.dek}</span>
            <StoryBody entry={lead} />
          </article>
          <article className="story sun-story">
            <p className="story-meta">{sideOne.category.toUpperCase()} · {sideOne.readTime.toUpperCase()}</p>
            <h3>{sideOne.title}</h3>
            <span className="story-dek">{sideOne.dek}</span>
            <StoryBody entry={sideOne} />
          </article>
          <article className="story blue-story">
            <p className="story-meta">{sideTwo.category.toUpperCase()} · {sideTwo.readTime.toUpperCase()}</p>
            <h3>{sideTwo.title}</h3>
            <span className="story-dek">{sideTwo.dek}</span>
            <StoryBody entry={sideTwo} />
          </article>
        </div>
      </section>

      <section className="shell guide-section" id="guides">
        <div className="guide-heading">
          <div>
            <p className="eyebrow"><i /> The field guide</p>
            <h2>Useful reading for the life you share.</h2>
          </div>
          <p>Practical, gentle ideas for cat people. Educational only; a veterinary professional is the right person for individual medical advice.</p>
        </div>
        <div className="guide-grid">
          {practicalGuides.map((guide) => (
            <article className={`guide-card ${guide.tone}`} key={guide.id}>
              <p className="guide-meta">{guide.category} · {guide.readTime}</p>
              <h3>{guide.title}</h3>
              <span className="guide-dek">{guide.dek}</span>
              <StoryBody entry={guide} />
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
