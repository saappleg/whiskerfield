import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { previewComments, previewPosts } from '../data/community';
import { ensureProfile, isSupabaseConfigured, supabase, type Profile } from '../lib/supabase';
import type { CommunityComment, CommunityPost, MemberResource, ReactionCounts, ReactionType, Topic } from '../types/community';

function updateReactions(
  currentReactions: ReactionCounts = {},
  currentChoice: ReactionType | undefined,
  toggled: ReactionType
): { reactions: ReactionCounts; userReaction?: ReactionType } {
  const next: ReactionCounts = { ...currentReactions };

  if (currentChoice === toggled) {
    // Un-react
    next[toggled] = Math.max(0, (next[toggled] ?? 1) - 1);
    return { reactions: next, userReaction: undefined };
  }

  // If changing choice, decrement the previous one
  if (currentChoice) {
    next[currentChoice] = Math.max(0, (next[currentChoice] ?? 1) - 1);
  }

  // Increment new choice
  next[toggled] = (next[toggled] ?? 0) + 1;
  return { reactions: next, userReaction: toggled };
}

export function useWhiskerfield() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>(previewPosts);
  const [comments, setComments] = useState<CommunityComment[]>(previewComments);
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
      // Retry message shown in UI on write failure
    }
  }, [loadResources]);

  const refreshFeed = useCallback(async () => {
    if (!supabase) return;
    setIsLoadingFeed(true);
    setFeedError('');
    const [postsRes, commentsRes] = await Promise.all([
      supabase
        .from('community_posts')
        .select('id, author_id, body, topic, created_at, profiles(display_name, handle)')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(30),
      supabase
        .from('community_comments')
        .select('id, post_id, author_id, body, created_at, profiles(display_name, handle)')
        .order('created_at', { ascending: true })
        .limit(100),
    ]);

    if (postsRes.error) {
      setFeedError('The live conversation is taking a short nap. Try refreshing in a moment.');
    } else if (postsRes.data && postsRes.data.length > 0) {
      setPosts(postsRes.data as CommunityPost[]);
    }

    if (!commentsRes.error && commentsRes.data && commentsRes.data.length > 0) {
      setComments(commentsRes.data as CommunityComment[]);
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
    const trimmed = body.trim();
    if (!trimmed || trimmed.length > 1000) return 'Posts need to be between 1 and 1,000 characters.';

    if (supabase && user && profile) {
      const result = await supabase
        .from('community_posts')
        .insert({ author_id: user.id, body: trimmed, topic })
        .select('id, author_id, body, topic, created_at, profiles(display_name, handle)')
        .single();
      if (result.error) return result.error.message;
      if (result.data) {
        setPosts((current) => [result.data as CommunityPost, ...current.filter((post) => post.id !== result.data.id)]);
        return null;
      }
    }

    // Optimistic fallback for preview mode / local guest
    const optimisticPost: CommunityPost = {
      id: Date.now(),
      author_id: user?.id || 'guest',
      body: trimmed,
      topic,
      created_at: new Date().toISOString(),
      reactions: { purr: 1 },
      userReaction: 'purr',
      profiles: profile
        ? { display_name: profile.display_name, handle: profile.handle }
        : { display_name: user?.email?.split('@')[0] || 'Friendly Cat Person', handle: 'cat_friend' },
    };
    setPosts((current) => [optimisticPost, ...current]);
    return null;
  }

  async function deletePost(id: number) {
    if (supabase) {
      await supabase.from('community_posts').delete().eq('id', id);
    }
    setPosts((current) => current.filter((post) => post.id !== id));
  }

  function reactToPost(postId: number, reaction: ReactionType) {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post;
        const result = updateReactions(post.reactions, post.userReaction, reaction);
        return {
          ...post,
          reactions: result.reactions,
          userReaction: result.userReaction,
        };
      })
    );
  }

  function reactToComment(commentId: number, reaction: ReactionType) {
    setComments((current) =>
      current.map((comment) => {
        if (comment.id !== commentId) return comment;
        const result = updateReactions(comment.reactions, comment.userReaction, reaction);
        return {
          ...comment,
          reactions: result.reactions,
          userReaction: result.userReaction,
        };
      })
    );
  }

  async function publishComment(postId: number, body: string) {
    const trimmed = body.trim();
    if (!trimmed || trimmed.length > 500) return 'Replies need to be between 1 and 500 characters.';

    if (supabase && user && profile) {
      const result = await supabase
        .from('community_comments')
        .insert({ post_id: postId, author_id: user.id, body: trimmed })
        .select('id, post_id, author_id, body, created_at, profiles(display_name, handle)')
        .single();
      if (result.error) return result.error.message;
      if (result.data) {
        setComments((prev) => [...prev, result.data as CommunityComment]);
        return null;
      }
    }

    // Optimistic fallback
    const newComment: CommunityComment = {
      id: Date.now(),
      post_id: postId,
      author_id: user?.id || 'guest',
      body: trimmed,
      created_at: new Date().toISOString(),
      reactions: { purr: 1 },
      userReaction: 'purr',
      profiles: profile
        ? { display_name: profile.display_name, handle: profile.handle }
        : { display_name: user?.email?.split('@')[0] || 'Cat friend', handle: 'cat_friend' },
    };
    setComments((prev) => [...prev, newComment]);
    return null;
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
    setUser(null);
    setProfile(null);
    setIsMember(false);
  }

  return {
    configured: isSupabaseConfigured,
    user,
    profile,
    isMember,
    posts,
    comments,
    resources,
    isLoadingFeed,
    feedError,
    refreshFeed,
    sendMagicLink,
    publishPost,
    deletePost,
    reactToPost,
    reactToComment,
    publishComment,
    joinMemberShelf,
    signOut,
  };
}
