import type { Profile } from '../lib/supabase';

type HeaderProps = {
  configured: boolean;
  profile: Profile | null;
  signedIn: boolean;
  onOpenAuth: () => void;
  onSignOut: () => void;
};

export function Header({ configured, profile, signedIn, onOpenAuth, onSignOut }: HeaderProps) {
  return <>
    <div className="utility-bar"><div className="shell utility-inner"><span>Cat people, in good company.</span><span>{configured ? 'Live community · free to join' : 'Community preview · connecting soon'}</span></div></div>
    <header className="site-header"><div className="shell header-inner"><a className="wordmark" href="#top" aria-label="Whiskerfield home"><b>W</b><span>Whiskerfield</span></a><nav aria-label="Main navigation"><a href="#community">Cat club</a><a href="#stories">Stories</a><a href="#members">Members</a></nav>{signedIn ? <div className="account-area"><span>@{profile?.handle || 'catfriend'}</span><button onClick={onSignOut}>Sign out</button></div> : <button className="header-cta" onClick={onOpenAuth}>Join the cat club <span aria-hidden="true">→</span></button>}</div></header>
  </>;
}
