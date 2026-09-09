import { isImageAvatar } from '../lib/avatar';
import type { Profile } from '../lib/supabase';
import type { PageRoute } from '../lib/router';
import type { Theme } from '../lib/theme';

type HeaderProps = {
  configured: boolean;
  profile: Profile | null;
  signedIn: boolean;
  currentRoute: PageRoute;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onSignOut: () => void;
};

export function Header({
  configured,
  profile,
  signedIn,
  currentRoute,
  theme,
  onToggleTheme,
  onOpenAuth,
  onOpenProfile,
  onSignOut,
}: HeaderProps) {
  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>Cat people, in good company.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={onToggleTheme}
              style={{
                border: 0,
                background: 'transparent',
                color: 'inherit',
                fontSize: '.72rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '.3rem',
                cursor: 'pointer',
              }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️ Light mode' : '🌙 Night mode'}
            </button>
            <span>{configured ? 'Live community · free to join' : 'Community preview · connecting soon'}</span>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="wordmark" href="#/" aria-label="Whiskerfield home">
            <b>W</b>
            <span>Whiskerfield</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#/" className={currentRoute === 'home' ? 'active' : ''}>
              Home
            </a>
            <a href="#/stories" className={currentRoute === 'stories' ? 'active' : ''}>
              Stories &amp; Guides
            </a>
            <a href="#/members" className={currentRoute === 'members' ? 'active' : ''}>
              Member Club
            </a>
          </nav>
          {signedIn ? (
            <div className="account-area">
              <button
                type="button"
                onClick={onOpenProfile}
                title="Edit profile & cats"
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '999px',
                  padding: '.35rem .75rem',
                  background: 'var(--cream)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '.4rem',
                  fontSize: '.75rem',
                  fontWeight: 800,
                  color: 'var(--ink)',
                }}
              >
                {isImageAvatar(profile?.avatar_url) ? (
                  /* oxlint-disable-next-line next/no-img-element */
                  <img
                    src={profile?.avatar_url}
                    alt=""
                    style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{profile?.avatar_url || '🐾'}</span>
                )}
                <span>@{profile?.handle || 'catfriend'}</span>
              </button>
              <button type="button" onClick={onSignOut}>Sign out</button>
            </div>
          ) : (
            <button type="button" className="header-cta" onClick={onOpenAuth}>
              Join the club <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
}
