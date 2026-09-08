type MemberGateProps = {
  onOpenAuth: () => void;
};

export function MemberGate({ onOpenAuth }: MemberGateProps) {
  return (
    <div className="shell" style={{ paddingTop: '80px', paddingBottom: '96px', maxWidth: '780px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          <i /> Members-Only Cat Club
        </p>
        <h1 style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)', lineHeight: 1.02, margin: '.5rem 0 1.2rem' }}>
          Good company for the life you share.
        </h1>
        <p style={{ maxWidth: '580px', margin: '0 auto', color: 'var(--ink-soft)', fontSize: '1.08rem', lineHeight: 1.6 }}>
          The Cat Club is Whiskerfield’s private social space. Here, cat people share tiny wins, swap advice, give treats, and trade notes without algorithms, ads, or noise.
        </p>
      </div>

      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--line)',
          padding: 'clamp(2rem, 4vw, 3rem)',
          display: 'grid',
          gap: '2rem',
          boxShadow: '0 8px 30px rgba(16,45,53,.04)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,252,246,.7)', borderLeft: '3px solid var(--coral)' }}>
            <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '.4rem' }}>😸</span>
            <b style={{ fontSize: '.92rem', display: 'block', color: 'var(--ink)' }}>Thoughtful Community</b>
            <p style={{ fontSize: '.78rem', color: 'var(--ink-soft)', margin: '.3rem 0 0', lineHeight: 1.45 }}>
              A calm space where cat habits, quirks, and care questions are taken seriously and warmly.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,252,246,.7)', borderLeft: '3px solid var(--sun)' }}>
            <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '.4rem' }}>🐟</span>
            <b style={{ fontSize: '.92rem', display: 'block', color: 'var(--ink)' }}>Cat Reactions &amp; Replies</b>
            <p style={{ fontSize: '.78rem', color: 'var(--ink-soft)', margin: '.3rem 0 0', lineHeight: 1.45 }}>
              Give posts a treat, a purr, or love. Share gentle replies with fellow cat lovers.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,252,246,.7)', borderLeft: '3px solid var(--blue)' }}>
            <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: '.4rem' }}>✨</span>
            <b style={{ fontSize: '.92rem', display: 'block', color: 'var(--ink)' }}>Free to Join</b>
            <p style={{ fontSize: '.78rem', color: 'var(--ink-soft)', margin: '.3rem 0 0', lineHeight: 1.45 }}>
              No passwords, no subscription fees. Just a quick magic link to your email inbox.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px dashed var(--line)' }}>
          <button
            type="button"
            className="button ink"
            onClick={onOpenAuth}
            style={{ fontSize: '.92rem', padding: '.9rem 2rem' }}
          >
            Join the Cat Club (Free) →
          </button>

          <p style={{ margin: '1.2rem 0 0', fontSize: '.8rem', color: 'var(--ink-soft)' }}>
            Already a member?{' '}
            <button
              type="button"
              onClick={onOpenAuth}
              style={{
                border: 0,
                background: 'transparent',
                color: 'var(--coral)',
                fontWeight: 800,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Sign in with your magic link
            </button>
          </p>

          <p style={{ margin: '1rem 0 0', fontSize: '.78rem' }}>
            Looking for reading material?{' '}
            <a href="#/stories" style={{ fontWeight: 800, color: 'var(--ink)', textDecoration: 'underline' }}>
              Read our free stories &amp; care guides →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
