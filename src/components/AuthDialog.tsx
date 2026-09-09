import { useState } from 'react';
import { useModalFocus } from '../hooks/use-modal-focus';

type AuthDialogProps = { configured: boolean; onClose: () => void; onSendMagicLink: (email: string) => Promise<string> };

export function AuthDialog({ configured, onClose, onSendMagicLink }: AuthDialogProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const dialogRef = useModalFocus(true, onClose);
  async function submit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setBusy(true);
    setMessage(await onSendMagicLink(email));
    setBusy(false);
  }
  return (
    <dialog ref={dialogRef} className="auth-overlay" open aria-modal="true" aria-labelledby="auth-title" tabIndex={-1}>
      <div className="auth-card">
        <button type="button" className="close" onClick={onClose} aria-label="Close sign in">×</button>
        <p className="eyebrow"><i /> Welcome in</p>
        <h2 id="auth-title">A small door into the cat club.</h2>
        <p>Use your email once. Supabase sends a one-tap sign-in link; there is no password to make or remember.</p>
        {configured ? (
          <form onSubmit={submit}>
            <label htmlFor="member-email">Your email</label>
            <input id="member-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            <button type="submit" className="button ink full" disabled={busy}>{busy ? 'Sending…' : 'Send my sign-in link →'}</button>
            {message && <output className="auth-message">{message}</output>}
          </form>
        ) : <p className="auth-message">The secure sign-in is being connected. The community design is ready; add the Supabase browser settings to make it live.</p>}
      </div>
    </dialog>
  );
}
