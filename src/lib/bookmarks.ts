import { useEffect, useState } from 'react';

const SAVED_POSTS_KEY = 'wf_saved_posts';
const SAVED_GUIDES_KEY = 'wf_saved_guides';

function getStoredIds<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [savedPostIds, setSavedPostIds] = useState<number[]>(() => getStoredIds<number>(SAVED_POSTS_KEY));
  const [savedGuideIds, setSavedGuideIds] = useState<string[]>(() => getStoredIds<string>(SAVED_GUIDES_KEY));

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(savedPostIds));
    } catch {
      // ignore
    }
  }, [savedPostIds]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_GUIDES_KEY, JSON.stringify(savedGuideIds));
    } catch {
      // ignore
    }
  }, [savedGuideIds]);

  const toggleSavePost = (postId: number) => {
    setSavedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const isPostSaved = (postId: number) => savedPostIds.includes(postId);

  const toggleSaveGuide = (guideId: string) => {
    setSavedGuideIds((prev) =>
      prev.includes(guideId) ? prev.filter((id) => id !== guideId) : [...prev, guideId]
    );
  };

  const isGuideSaved = (guideId: string) => savedGuideIds.includes(guideId);

  return {
    savedPostIds,
    savedGuideIds,
    toggleSavePost,
    isPostSaved,
    toggleSaveGuide,
    isGuideSaved,
  };
}
