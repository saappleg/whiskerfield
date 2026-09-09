import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { previewComments, previewPosts } from '../data/community';
import { ensureProfile, isSupabaseConfigured, supabase, type Profile } from '../lib/supabase';
import { getVisitorId } from '../lib/visitor';
import type { CommunityComment, CommunityPost, MemberResource, Pet, ReactionCounts, ReactionType, Topic } from '../types/community';

function updateReactions(
  currentReactions: ReactionCounts = {},
  currentChoice: ReactionType | undefined,
  toggled: ReactionType
): { reactions: ReactionCounts; userReaction?: ReactionType } {
  const next: ReactionCounts = { ...currentReactions };

  if (currentChoice === toggled) {
    next[toggled] = Math.max(0, (next[toggled] ?? 1) - 1);
    return { reactions: next, userReaction: undefined };
  }

  if (currentChoice) {
    next[currentChoice] = Math.max(0, (next[currentChoice] ?? 1) - 1);
  }

  next[toggled] = (next[toggled] ?? 0) + 1;
  return { reactions: next, userReaction: toggled };
}

export function useWhiskerfield() {
  const [user, setUser] = useState<User | null>(null);
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>(previewPosts);
  const [comments, setComments] = useState<CommunityComment[]>(previewComments);
  const [resources, setResources] = useState<MemberResource[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(isSupabaseConfigured);
  const [feedError, setFeedError] = useState('');
  const isFetchingRef = useRef(false);

  const loadResources = useCallback(async () => {
    if (!supabase) return;
    const result = await supabase
      .from('member_resources')
      .select('id, kind, title, summary, body')
      .order('published_at', { ascending: false });
    if (!result.error) setResources((result.data ?? []) as MemberResource[]);
  }, []);

  const loadPets = useCallback(async (userId: string) => {
    if (!supabase) return;
    const result = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: true });
    if (!result.error && result.data) {
      setUserPets(result.data as Pet[]);
    }
  }, []);

  const hydrateMember = useCallback(async (nextUser: User) => {
    if (!supabase) return;
    try {
      const nextProfile = await ensureProfile(nextUser);
      setProfile(nextProfile);
      await loadPets(nextUser.id);
      const membership = await supabase
        .from('memberships')
        .select('status')
        .eq('user_id', nextUser.id)
        .maybeSingle();
      const active = membership.data?.status === 'active';
      setIsMember(active);
      if (active) await loadResources();
    } catch {
      // Handled via user state
    }
  }, [loadPets, loadResources]);

  const refreshFeed = useCallback(async () => {
    if (!supabase || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoadingFeed(true);
    setFeedError('');

    try {
      const [postsRes, commentsRes, reactionsRes] = await Promise.all([
        supabase
          .from('community_posts')
          .select('id, author_id, body, topic, pet_id, image_url, created_at, profiles(display_name, handle, avatar_url), pets(id, name, breed, avatar_url)')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .order('id', { ascending: false })
          .limit(50),
        supabase
          .from('community_comments')
          .select('id, post_id, author_id, body, created_at, profiles(display_name, handle, avatar_url)')
          .order('created_at', { ascending: true })
          .limit(200),
        supabase
          .from('community_reactions')
          .select('target_type, target_id, user_identifier, reaction')
          .limit(2000),
      ]);

      if (postsRes.error) {
        setFeedError('The live conversation is taking a short nap. Try refreshing in a moment.');
        setIsLoadingFeed(false);
        return;
      }

      const visitorId = userRef.current?.id || getVisitorId();

      const postReactionCounts: Record<number, ReactionCounts> = {};
      const postUserReactions: Record<number, ReactionType> = {};
      const commentReactionCounts: Record<number, ReactionCounts> = {};
      const commentUserReactions: Record<number, ReactionType> = {};

      if (reactionsRes.data) {
        for (const row of reactionsRes.data as Array<{
          target_type: 'post' | 'comment';
          target_id: number;
          user_identifier: string;
          reaction: ReactionType;
        }>) {
          const isSelf = row.user_identifier === visitorId;
          if (row.target_type === 'post') {
            if (!postReactionCounts[row.target_id]) postReactionCounts[row.target_id] = {};
            postReactionCounts[row.target_id][row.reaction] =
              (postReactionCounts[row.target_id][row.reaction] ?? 0) + 1;
            if (isSelf) postUserReactions[row.target_id] = row.reaction;
          } else if (row.target_type === 'comment') {
            if (!commentReactionCounts[row.target_id]) commentReactionCounts[row.target_id] = {};
            commentReactionCounts[row.target_id][row.reaction] =
              (commentReactionCounts[row.target_id][row.reaction] ?? 0) + 1;
            if (isSelf) commentUserReactions[row.target_id] = row.reaction;
          }
        }
      }

      const dbPosts = (postsRes.data || []) as unknown as CommunityPost[];
      const dbPostIds = new Set(dbPosts.map((p) => p.id));
      const mergedPosts = [
        ...dbPosts,
        ...previewPosts.filter((p) => !dbPostIds.has(p.id)),
      ].map((post) => {
        const extraCounts = postReactionCounts[post.id] || {};
        const baseCounts = post.reactions || {};
        const mergedCounts: ReactionCounts = { ...baseCounts };
        for (const [key, count] of Object.entries(extraCounts)) {
          const k = key as ReactionType;
          mergedCounts[k] = (mergedCounts[k] ?? 0) + (count ?? 0);
        }
        return {
          ...post,
          reactions: mergedCounts,
          userReaction: postUserReactions[post.id] ?? post.userReaction,
        };
      });
      setPosts(mergedPosts);

      const dbComments = (commentsRes.data || []) as CommunityComment[];
      const dbCommentIds = new Set(dbComments.map((c) => c.id));
      const mergedComments = [
        ...previewComments.filter((c) => !dbCommentIds.has(c.id)),
        ...dbComments,
      ].map((comment) => {
        const extraCounts = commentReactionCounts[comment.id] || {};
        const baseCounts = comment.reactions || {};
        const mergedCounts: ReactionCounts = { ...baseCounts };
        for (const [key, count] of Object.entries(extraCounts)) {
          const k = key as ReactionType;
          mergedCounts[k] = (mergedCounts[k] ?? 0) + (count ?? 0);
        }
        return {
          ...comment,
          reactions: mergedCounts,
          userReaction: commentUserReactions[comment.id] ?? comment.userReaction,
        };
      });
      setComments(mergedComments);
    } finally {
      isFetchingRef.current = false;
      setIsLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    void refreshFeed();

    void supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) void hydrateMember(currentUser);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        void hydrateMember(currentUser);
      } else {
        setProfile(null);
        setUserPets([]);
        setIsMember(false);
        setResources([]);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [hydrateMember, refreshFeed]);

  // Realtime subscription for cross-user live updates - subscribed once
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('whiskerfield_realtime_feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_comments' }, () => {
        void refreshFeed();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_reactions' }, () => {
        void refreshFeed();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        void refreshFeed();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pets' }, () => {
        void refreshFeed();
        if (userRef.current) void loadPets(userRef.current.id);
      })
      .subscribe();

    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [loadPets, refreshFeed]);

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

  async function updateProfile(displayName: string, handle: string, bio: string, avatarUrl: string) {
    if (!supabase || !user) return 'You must be signed in to update your profile.';

    const result = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        handle,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id, handle, display_name, avatar_url, bio')
      .single();

    if (result.error) return result.error.message;
    if (result.data) {
      setProfile(result.data as Profile);
      void refreshFeed();
      return null;
    }
    return 'Could not update profile.';
  }

  async function createPet(name: string, breed: string, age: string, quirk: string, avatarUrl: string) {
    if (!supabase || !user) {
      // Local optimistic fallback
      const localPet: Pet = {
        id: Date.now(),
        owner_id: user?.id || 'guest',
        name,
        breed,
        age,
        quirk,
        avatar_url: avatarUrl || '🐱',
        created_at: new Date().toISOString(),
      };
      setUserPets((prev) => [...prev, localPet]);
      return null;
    }

    const result = await supabase
      .from('pets')
      .insert({
        owner_id: user.id,
        name,
        breed: breed || null,
        age: age || null,
        quirk: quirk || null,
        avatar_url: avatarUrl || '🐱',
      })
      .select('*')
      .single();

    if (result.error) return result.error.message;
    if (result.data) {
      setUserPets((prev) => [...prev, result.data as Pet]);
      return null;
    }
    return 'Could not add pet.';
  }

  async function deletePet(id: number) {
    if (supabase) {
      const result = await supabase.from('pets').delete().eq('id', id);
      if (result.error) return result.error.message;
    }
    setUserPets((prev) => prev.filter((p) => p.id !== id));
    return null;
  }

  async function publishPost(body: string, topic: Topic, petId?: number, imageUrl?: string) {
    const trimmed = body.trim();
    if (!trimmed || trimmed.length > 1000) return 'Posts need to be between 1 and 1,000 characters.';

    const chosenPet = userPets.find((p) => p.id === petId);

    if (supabase && user && profile) {
      const result = await supabase
        .from('community_posts')
        .insert({ author_id: user.id, body: trimmed, topic, pet_id: petId || null, image_url: imageUrl || null })
        .select('id, author_id, body, topic, pet_id, image_url, created_at, profiles(display_name, handle, avatar_url), pets(id, name, breed, avatar_url)')
        .single();
      if (result.error) return result.error.message;
      if (result.data) {
        setPosts((current) => [(result.data as unknown as CommunityPost), ...current.filter((post) => post.id !== result.data.id)]);
        return null;
      }
    }

    const optimisticPost: CommunityPost = {
      id: Date.now(),
      author_id: user?.id || 'guest',
      body: trimmed,
      topic,
      pet_id: petId,
      image_url: imageUrl || null,
      pets: chosenPet || null,
      created_at: new Date().toISOString(),
      reactions: { like: 1 },
      userReaction: 'like',
      profiles: profile
        ? { display_name: profile.display_name, handle: profile.handle, avatar_url: profile.avatar_url }
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
    const visitorId = user?.id || getVisitorId();
    let isRemoving = false;

    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post;
        isRemoving = post.userReaction === reaction;
        const result = updateReactions(post.reactions, post.userReaction, reaction);
        return {
          ...post,
          reactions: result.reactions,
          userReaction: result.userReaction,
        };
      })
    );

    if (supabase) {
      if (isRemoving) {
        void supabase
          .from('community_reactions')
          .delete()
          .match({ target_type: 'post', target_id: postId, user_identifier: visitorId });
      } else {
        void supabase
          .from('community_reactions')
          .upsert(
            {
              target_type: 'post',
              target_id: postId,
              user_identifier: visitorId,
              reaction,
            },
            { onConflict: 'target_type, target_id, user_identifier' }
          );
      }
    }
  }

  function reactToComment(commentId: number, reaction: ReactionType) {
    const visitorId = user?.id || getVisitorId();
    let isRemoving = false;

    setComments((current) =>
      current.map((comment) => {
        if (comment.id !== commentId) return comment;
        isRemoving = comment.userReaction === reaction;
        const result = updateReactions(comment.reactions, comment.userReaction, reaction);
        return {
          ...comment,
          reactions: result.reactions,
          userReaction: result.userReaction,
        };
      })
    );

    if (supabase) {
      if (isRemoving) {
        void supabase
          .from('community_reactions')
          .delete()
          .match({ target_type: 'comment', target_id: commentId, user_identifier: visitorId });
      } else {
        void supabase
          .from('community_reactions')
          .upsert(
            {
              target_type: 'comment',
              target_id: commentId,
              user_identifier: visitorId,
              reaction,
            },
            { onConflict: 'target_type, target_id, user_identifier' }
          );
      }
    }
  }

  async function publishComment(postId: number, body: string) {
    if (!user || !profile) {
      return 'You must sign in with a magic link before leaving a reply.';
    }

    const trimmed = body.trim();
    if (!trimmed || trimmed.length > 500) return 'Replies need to be between 1 and 500 characters.';

    if (supabase) {
      const result = await supabase
        .from('community_comments')
        .insert({ post_id: postId, author_id: user.id, body: trimmed })
        .select('id, post_id, author_id, body, created_at, profiles(display_name, handle, avatar_url)')
        .single();
      if (result.error) return result.error.message;
      if (result.data) {
        setComments((prev) => [...prev, result.data as CommunityComment]);
        return null;
      }
    }

    const newComment: CommunityComment = {
      id: Date.now(),
      post_id: postId,
      author_id: user.id,
      body: trimmed,
      created_at: new Date().toISOString(),
      reactions: { like: 1 },
      userReaction: 'like',
      profiles: { display_name: profile.display_name, handle: profile.handle, avatar_url: profile.avatar_url },
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
    setUserPets([]);
    setIsMember(false);
  }

  return {
    configured: isSupabaseConfigured,
    user,
    profile,
    userPets,
    isMember,
    posts,
    comments,
    resources,
    isLoadingFeed,
    feedError,
    refreshFeed,
    sendMagicLink,
    updateProfile,
    createPet,
    deletePet,
    publishPost,
    deletePost,
    reactToPost,
    reactToComment,
    publishComment,
    joinMemberShelf,
    signOut,
  };
}
