import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { MemberResource } from '../types/community';

type MemberShelfProps = { user: User | null; isMember: boolean; resources: MemberResource[]; onJoin: () => Promise<string | null>; onOpenAuth: () => void };

export function MemberShelf({ user, isMember, resources, onJoin, onOpenAuth }: MemberShelfProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function join() {
    if (!user) return onOpenAuth();
    setBusy(true);
    setError('');
    const result = await onJoin();
    if (result) setError(result);
    setBusy(false);
  }
  return <section className="shell member-section" id="members"><div className="member-copy"><p className="eyebrow"><i /> Subscriber shelf</p><h2>A little more for the people who stay close.</h2><p>Join the free Whiskerfield member list to unlock practical guides, calm care notes, and our genuinely useful finds.</p>{isMember ? <span className="member-badge">✓ Your shelf is open</span> : <button className="button coral" onClick={() => void join()} disabled={busy}>{busy ? 'Opening your shelf…' : user ? 'Open my free shelf →' : 'Sign in to open the shelf →'}</button>}{error && <p className="form-error">{error}</p>}</div><div className="resource-grid">{isMember && resources.length > 0 ? resources.map((resource) => <article className="resource" key={resource.id}><p>{resource.kind.replace('_', ' ')}</p><h3>{resource.title}</h3><span>{resource.summary}</span><details><summary>Open note →</summary><p>{resource.body}</p></details></article>) : <LockedShelf />}</div></section>;
}

function LockedShelf() {
  return <><article className="resource locked"><p>GUIDE</p><h3>The 15-minute home reset</h3><span>A room-by-room checklist for calmer evenings.</span><b>Member note · locked</b></article><article className="resource locked sun"><p>NOTES</p><h3>What to notice before the next vet visit</h3><span>A simple observation log for everyday changes.</span><b>Member note · locked</b></article><article className="resource locked coral-block"><p>GOOD THINGS</p><h3>This month’s two genuinely useful finds</h3><span>Small things that made life easier for a cat and their human.</span><b>Member note · locked</b></article></>;
}
