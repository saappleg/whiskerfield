export function Footer() {
  return (
    <footer className="shell site-footer">
      <a className="wordmark" href="#/">
        <b>W</b>
        <span>Whiskerfield</span>
      </a>
      <p>For the life you share.</p>
      <div>
        <a href="#/">Home</a>
        <a href="#/stories">Stories &amp; Guides</a>
        <a href="#/members">Member Club</a>
        <a href="#/privacy">Privacy</a>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && 'googlefc' in window) {
              /* oxlint-disable-next-line @typescript-eslint/no-explicit-any */
              const gfc = (window as any).googlefc;
              if (typeof gfc?.showRevocationMessage === 'function') {
                gfc.showRevocationMessage();
                return;
              }
            }
            window.location.hash = '#/privacy';
          }}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            font: 'inherit',
            fontSize: 'inherit',
            color: 'inherit',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Ad &amp; Cookie Choices
        </button>
      </div>
    </footer>
  );
}
