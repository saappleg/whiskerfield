import type { Profile } from '../lib/supabase';
import type { PageRoute } from '../lib/router';

type HeaderProps = {
  configured: boolean;
  profile: Profile | null;
  signedIn: boolean;
  currentRoute: PageRoute;
  onOpenAuth: () => void;
  onSignOut: () => void;
};

export function Header({
  configured,
  profile,
  signedIn,
  currentRoute,
  onOpenAuth,
  onSignOut,
}: HeaderProps) {
  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>Cat people, in good company.</span>
          <span>{configured ? 'Live community · free to join' : 'Community preview · connecting soon'}</span>
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
              <span>@{profile?.handle || 'catfriend'}</span>
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
