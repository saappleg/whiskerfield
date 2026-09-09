import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { AvatarImage } from './AvatarImage';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuRoute, setMenuRoute] = useState(currentRoute);
  const menuVisible = mobileMenuOpen && menuRoute === currentRoute;

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

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
              aria-label={theme === 'dark' ? 'Light mode' : 'Night mode'}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'dark' ? '☀️ Light mode' : '🌙 Night mode'}
            </button>
            <span>{configured ? 'Live community · free to join' : 'Community preview · connecting soon'}</span>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <a href="#/" aria-label="Whiskerfield home" style={{ textDecoration: 'none' }}>
            <Logo size={32} />
          </a>
          <nav aria-label="Main navigation">
            <a href="#/" className={currentRoute === 'home' ? 'active' : ''} aria-current={currentRoute === 'home' ? 'page' : undefined}>
              Home
            </a>
            <a href="#/stories" className={currentRoute === 'stories' ? 'active' : ''} aria-current={currentRoute === 'stories' ? 'page' : undefined}>
              Stories &amp; Guides
            </a>
            <a href="#/members" className={currentRoute === 'members' ? 'active' : ''} aria-current={currentRoute === 'members' ? 'page' : undefined}>
              Member Club
            </a>
          </nav>
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => {
              setMenuRoute(currentRoute);
              setMobileMenuOpen((open) => !open);
            }}
            aria-expanded={menuVisible}
            aria-controls="mobile-navigation"
            aria-label={menuVisible ? 'Close menu' : 'Open menu'}
          >
            <span aria-hidden="true">{menuVisible ? '✕' : '☰'}</span>
          </button>
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
                <AvatarImage
                  src={profile?.avatar_url}
                  alt=""
                  fallback={<span>{profile?.avatar_url || '🐾'}</span>}
                  style={{ width: '18px', height: '18px', borderRadius: '50%' }}
                />
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
        {menuVisible && (
          <nav id="mobile-navigation" className="mobile-navigation shell" aria-label="Mobile navigation">
            <a href="#/" onClick={closeMobileMenu} className={currentRoute === 'home' ? 'active' : ''} aria-current={currentRoute === 'home' ? 'page' : undefined}>
              Home
            </a>
            <a href="#/stories" onClick={closeMobileMenu} className={currentRoute === 'stories' ? 'active' : ''} aria-current={currentRoute === 'stories' ? 'page' : undefined}>
              Stories &amp; Guides
            </a>
            <a href="#/members" onClick={closeMobileMenu} className={currentRoute === 'members' ? 'active' : ''} aria-current={currentRoute === 'members' ? 'page' : undefined}>
              Member Club
            </a>
          </nav>
        )}
      </header>
    </>
  );
}
