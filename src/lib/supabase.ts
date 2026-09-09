import { createClient, type User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  handle: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
};

const url = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '');
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(url && publishableKey);
export const supabase = isSupabaseConfigured
  ? createClient(url!, publishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        experimental: { passkey: true },
      },
    })
  : null;

export async function ensureProfile(user: User): Promise<Profile> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const existing = await supabase
    .from('profiles')
    .select('id, handle, display_name, avatar_url, bio')
    .eq('id', user.id)
    .maybeSingle();

  if (existing.data) return existing.data as Profile;
  if (existing.error) throw existing.error;

  const displayName = displayNameFor(user);
  const created = await supabase
    .from('profiles')
    .insert({ id: user.id, handle: handleFor(user), display_name: displayName })
    .select('id, handle, display_name, avatar_url, bio')
    .single();

  if (created.data) return created.data as Profile;

  // A second tab can create the same profile while this request is in flight.
  const retried = await supabase
    .from('profiles')
    .select('id, handle, display_name, avatar_url, bio')
    .eq('id', user.id)
    .single();
  if (retried.data) return retried.data as Profile;
  throw created.error || retried.error || new Error('Could not create your profile.');
}

function displayNameFor(user: User) {
  const candidate = typeof user.user_metadata?.full_name === 'string'
    ? user.user_metadata.full_name
    : user.email?.split('@')[0] || 'Cat friend';
  return candidate.trim().slice(0, 40) || 'Cat friend';
}

function handleFor(user: User) {
  const seed = (user.email?.split('@')[0] || 'catfriend')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 16) || 'catfriend';
  return `${seed}_${user.id.replace(/-/g, '').slice(0, 7)}`.slice(0, 24);
}
