import { editorialPaths } from '../data/editorial-paths';
import { featuredStories, practicalGuides, type JournalEntry } from '../data/editorial';

const allEntries = [...featuredStories, ...practicalGuides];
const entryById = new Map(allEntries.map((entry) => [entry.id, entry]));

function getEntry(id: string): JournalEntry | undefined {
  return entryById.get(id);
}

export function EditorialPathways() {
  return (
    <section className="editorial-pathways shell" aria-labelledby="editorial-pathways-heading">
      <div className="editorial-pathways-heading">
        <div>
          <p className="eyebrow"><i /> Start with a path</p>
          <h2 id="editorial-pathways-heading">Good reading, in a useful order.</h2>
        </div>
        <p>Not sure where to begin? Choose the situation closest to yours. Each path is three short steps through the Journal, with room to pause and notice what your cat is telling you.</p>
      </div>
      <div className="editorial-pathway-grid">
        {editorialPaths.map((path, pathIndex) => (
          <article className={`editorial-pathway-card ${path.accent}`} key={path.id}>
            <div className="editorial-pathway-card-top"><span>0{pathIndex + 1}</span><span>{path.eyebrow}</span></div>
            <h3>{path.title}</h3>
            <p>{path.detail}</p>
            <ol>
              {path.articles.map((articleId, articleIndex) => {
                const entry = getEntry(articleId);
                if (!entry) return null;
                return (
                  <li key={articleId}>
                    <span aria-hidden="true">{articleIndex + 1}</span>
                    <a href={`#/stories/article/${entry.id}`}>
                      <strong>{entry.title}</strong>
                      <small>{entry.readTime}</small>
                    </a>
                  </li>
                );
              })}
            </ol>
            <a className="editorial-pathway-start" href={`#/stories/article/${path.articles[0]}`}>Start this path <span aria-hidden="true">→</span></a>
          </article>
        ))}
      </div>
    </section>
  );
}
