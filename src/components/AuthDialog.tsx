import { useState } from 'react';
import { useModalFocus } from '../hooks/use-modal-focus';

type AuthMethod = 'magic' | 'password';
type PasswordMode = 'sign-in' | 'sign-up';

type AuthDialogProps = {
  configured: boolean;
  onClose: () => void;
  onSendMagicLink: (email: string) => Promise<string>;
  onSignInWithPassword: (email: string, password: string) => Promise<string>;
  onSignUpWithPassword: (email: string, password: string) => Promise<string>;
  onResetPassword: (email: string) => Promise<string>;
  onSignInWithPasskey: () => Promise<string>;
};

export function AuthDialog({
  configured,
  onClose,
  onSendMagicLink,
  onSignInWithPassword,
  onSignUpWithPassword,
  onResetPassword,
  onSignInWithPasskey,
}: AuthDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState<AuthMethod>('magic');
  const [passwordMode, setPasswordMode] = useState<PasswordMode>('sign-in');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const dialogRef = useModalFocus(true, onClose);

  function chooseMethod(nextMethod: AuthMethod) {
    setMethod(nextMethod);
    setMessage('');
  }

  async function submitMagic(event: { preventDefault: () => void }) {
    event.preventDefault();
    setBusy(true);
    setMessage(await onSendMagicLink(email));
    setBusy(false);
  }

  async function submitPassword(event: { preventDefault: () => void }) {
    event.preventDefault();
    setBusy(true);
    const nextMessage = passwordMode === 'sign-in'
      ? await onSignInWithPassword(email, password)
      : await onSignUpWithPassword(email, password);
    setMessage(nextMessage);
    setBusy(false);
  }

  async function requestPasswordReset() {
    if (!email.trim()) {
      setMessage('Enter your email first, then choose “Forgot password?”.');
      return;
    }
    setBusy(true);
    setMessage(await onResetPassword(email));
    setBusy(false);
  }

  async function submitPasskey() {
    setBusy(true);
    setMessage(await onSignInWithPasskey());
    setBusy(false);
  }

  return (
    <dialog ref={dialogRef} className="auth-overlay" open aria-modal="true" aria-labelledby="auth-title" tabIndex={-1}>
      <div className="auth-card">
        <button type="button" className="close" onClick={onClose} aria-label="Close sign in">×</button>
        <p className="eyebrow"><i /> Welcome in</p>
        <h2 id="auth-title">A small door into the cat club.</h2>
        <p>Choose the sign-in method that feels easiest: a one-tap email link, an email and password, or a passkey.</p>
        {configured ? (
          <>
            <div className="auth-method-switch" aria-label="Sign-in method">
              <button
                type="button"
                className={method === 'magic' ? 'active' : ''}
                aria-pressed={method === 'magic'}
                onClick={() => chooseMethod('magic')}
              >
                Magic link
              </button>
              <button
                type="button"
                className={method === 'password' ? 'active' : ''}
                aria-pressed={method === 'password'}
                onClick={() => chooseMethod('password')}
              >
                Email + password
              </button>
            </div>

            {method === 'magic' ? (
              <form onSubmit={submitMagic}>
                <p className="auth-form-intro">Supabase sends a one-tap sign-in link; there is no password to make or remember.</p>
                <label htmlFor="member-email">Your email</label>
                <input
                  id="member-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
                <button type="submit" className="button ink full" disabled={busy}>
                  {busy ? 'Sending…' : 'Send my sign-in link →'}
                </button>
              </form>
            ) : (
              <form onSubmit={submitPassword}>
                <p className="auth-form-intro">
                  {passwordMode === 'sign-in'
                    ? 'Use the email and password you already created.'
                    : 'Create a free Cat Club account with your email and a password.'}
                </p>
                <label htmlFor="member-email">Your email</label>
                <input
                  id="member-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="username"
                  required
                />
                <label htmlFor="member-password">Password</label>
                <input
                  id="member-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={passwordMode === 'sign-in' ? 'current-password' : 'new-password'}
                  minLength={6}
                  required
                />
                <button type="submit" className="button ink full" disabled={busy}>
                  {busy ? 'Working…' : passwordMode === 'sign-in' ? 'Sign in with password →' : 'Create my account →'}
                </button>
                {passwordMode === 'sign-in' && (
                  <button type="button" className="auth-reset" onClick={() => void requestPasswordReset()} disabled={busy}>
                    Forgot password?
                  </button>
                )}
                <p className="auth-switch-copy">
                  {passwordMode === 'sign-in' ? 'New to the Cat Club?' : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    className="auth-reset"
                    onClick={() => {
                      setPasswordMode(passwordMode === 'sign-in' ? 'sign-up' : 'sign-in');
                      setMessage('');
                    }}
                  >
                    {passwordMode === 'sign-in' ? 'Create an account' : 'Sign in'}
                  </button>
                </p>
              </form>
            )}

            <div className="auth-divider"><span>or</span></div>
            <button type="button" className="button ink full" onClick={() => void submitPasskey()} disabled={busy}>
              {busy ? 'Waiting for passkey…' : 'Continue with a passkey'}
            </button>
            <p className="auth-hint">Use Face ID, Touch ID, Windows Hello, a device PIN, or a security key.</p>
            {message && <output className="auth-message" aria-live="polite">{message}</output>}
          </>
        ) : (
          <p className="auth-message" aria-live="polite">The secure sign-in is being connected. The community design is ready; add the Supabase browser settings to make it live.</p>
        )}
      </div>
    </dialog>
  );
}
