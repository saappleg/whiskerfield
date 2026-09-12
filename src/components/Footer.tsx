import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="shell site-footer">
      <a href="#/" aria-label="Whiskerfield home" style={{ textDecoration: 'none' }}>
        <Logo size={36} />
      </a>
      <p>For the life you share.</p>
      <div>
        <a href="#/">Home</a>
        <a href="#/members">Community</a>
        <a href="#/care">Care</a>
        <a href="#/products">Product Lab</a>
        <a href="#/products#amazon-shelf">Amazon shelf</a>
        <a href="#/news">Dispatch</a>
        <a href="#/stories">Journal</a>
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
