import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { previewPosts } from '../data/community';
import { ensureProfile, isSupabaseConfigured, supabase, type Profile } from '../lib/supabase';
import type { CommunityPost, MemberResource, Topic } from '../types/community';

export function useWhiskerfield() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>(previewPosts);
  const [resources, setResources] = useState<MemberResource[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(isSupabaseConfigured);
  const [feedError, setFeedError] = useState('');

  const loadResources = useCallback(async () => {
    if (!supabase) return;
    const result = await supabase
      .from('member_resources')
      .select('id, kind, title, summary, body')
      .order('published_at', { ascending: false });
    if (!result.error) setResources((result.data ?? []) as MemberResource[]);
  }, []);

  const hydrateMember = useCallback(async (nextUser: User) => {
    if (!supabase) return;
    try {
      const nextProfile = await ensureProfile(nextUser);
      setProfile(nextProfile);
      const membership = await supabase
        .from('memberships')
        .select('status')
        .eq('user_id', nextUser.id)
        .maybeSingle();
      const active = membership.data?.status === 'active';
      setIsMember(active);
      if (active) await loadResources();
    } catch {
      // The UI displays a helpful retry message when a write is attempted.
    }
  }, [loadResources]);

  const refreshFeed = useCallback(async () => {
    if (!supabase) return;
    setIsLoadingFeed(true);
    setFeedError('');
    const result = await supabase
      .from('community_posts')
      .select('id, author_id, body, topic, created_at, profiles(display_name, handle)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(30);
    if (result.error) {
      setFeedError('The live conversation is taking a short nap. Try refreshing in a moment.');
    } else {
      setPosts((result.data ?? []) as CommunityPost[]);
    }
    setIsLoadingFeed(false);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void Promise.resolve().then(refreshFeed);
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) void hydrateMember(session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) void hydrateMember(session.user);
      if (!session) {
        setProfile(null);
        setIsMember(false);
        setResources([]);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [hydrateMember, refreshFeed]);

  async function sendMagicLink(email: string) {
    if (!supabase) return 'The secure sign-in is being connected.';
    const result = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin, shouldCreateUser: true },
    });
    return result.error
      ? result.error.message
      : 'Check your inbox for a one-tap sign-in link. Then come straight back to Whiskerfield.';
  }

  async function publishPost(body: string, topic: Topic) {
    if (!supabase || !user || !profile) return 'Sign in first, then your cat’s note can join the conversation.';
    const trimmed = body.trim();
    if (!trimmed || trimmed.length > 1000) return 'Posts need to be between 1 and 1,000 characters.';
    const result = await supabase
      .from('community_posts')
      .insert({ author_id: user.id, body: trimmed, topic })
      .select('id, author_id, body, topic, created_at, profiles(display_name, handle)')
      .single();
    if (result.error) return result.error.message;
    if (result.data) setPosts((current) => [result.data as CommunityPost, ...current.filter((post) => post.id !== result.data.id)]);
    return null;
  }

  async function deletePost(id: number) {
    if (!supabase) return;
    const result = await supabase.from('community_posts').delete().eq('id', id);
    if (!result.error) setPosts((current) => current.filter((post) => post.id !== id));
  }

  async function joinMemberShelf() {
    if (!supabase || !user) return 'Please sign in before opening the shelf.';
    const result = await supabase
      .from('memberships')
      .upsert({ user_id: user.id, status: 'active', updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (result.error) return result.error.message;
    setIsMember(true);
    await loadResources();
    return null;
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
  }

  return {
    configured: isSupabaseConfigured,
    user,
    profile,
    isMember,
    posts,
    resources,
    isLoadingFeed,
    feedError,
    refreshFeed,
    sendMagicLink,
    publishPost,
    deletePost,
    joinMemberShelf,
    signOut,
  };
}
