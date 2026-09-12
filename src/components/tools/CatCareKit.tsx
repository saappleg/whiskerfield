export function CatCareKit() {
  return (
    <aside className="cat-care-kit" aria-labelledby="cat-care-kit-heading">
      <div className="cat-care-kit-copy">
        <p className="cat-care-kit-kicker">Free printable · no email required</p>
        <h3 id="cat-care-kit-heading">A calmer cat-care handoff</h3>
        <p>
          Keep feeding notes, medicine reminders, vet contacts, and sitter instructions in one place before
          a busy week or a weekend away.
        </p>
        <a className="button ink" href="/cat-home-care-kit.html" target="_blank" rel="noreferrer">
          Open the free care kit ↗
        </a>
      </div>

      <div className="cat-care-kit-preview" aria-label="What is included in the printable care kit">
        <span className="cat-care-kit-sheet" aria-hidden="true">🐾</span>
        <div>
          <strong>Print it, fill it in, keep it handy</strong>
          <ul>
            <li>Daily routine and feeding notes</li>
            <li>Medication and observation log</li>
            <li>Vet, backup, and emergency contacts</li>
          </ul>
        </div>
      </div>

      <div className="cat-care-kit-next">
        <span>Coming next</span>
        <strong>Deluxe Cat Home Binder</strong>
        <small>More pages for multi-cat households. Planned, not available yet.</small>
      </div>
    </aside>
  );
}
