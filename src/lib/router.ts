import { useEffect, useState } from 'react';

export type PageRoute = 'home' | 'stories' | 'members' | 'care' | 'products' | 'news' | 'privacy';

function parseRoute(locationValue: string): PageRoute {
  const clean = locationValue.replace(/^#\/?/, '').replace(/^\/+/, '').toLowerCase().trim();
  const path = clean.split(/[?#]/, 1)[0];
  if (path === 'community' || path === 'cat-club' || path === 'members' || path === 'shelf' || path === 'club') {
    return 'members';
  }
  if (path === 'stories' || path === 'journal' || path === 'articles' || path === 'guides' || path.startsWith('stories/article/') || path.startsWith('stories/member/')) {
    return 'stories';
  }
  if (path === 'care' || path === 'health' || path === 'wellness') {
    return 'care';
  }
  if (path === 'products' || path === 'reviews' || path === 'product-lab' || path === 'shop') {
    return 'products';
  }
  if (path === 'news' || path === 'dispatch' || path === 'cat-news') {
    return 'news';
  }
  if (path === 'privacy' || path === 'terms') {
    return 'privacy';
  }
  return 'home';
}

function getQueryValue(locationValue: string, key: string) {
  const query = locationValue.includes('?') ? locationValue.slice(locationValue.indexOf('?') + 1).split('#', 1)[0] : '';
  return new URLSearchParams(query).get(key) || '';
}

export function getArticleId(hashOrPath: string, search = '') {
  const clean = hashOrPath.replace(/^#\/?/, '').replace(/^\/+/, '').trim();
  const match = clean.match(/^stories\/article\/([^?#/]+)/i);
  if (match) return decodeURIComponent(match[1]);
  return getQueryValue(search || clean, 'article');
}

export function getMemberStoryId(hashOrPath: string, search = '') {
  const clean = hashOrPath.replace(/^#\/?/, '').replace(/^\/+/, '').trim();
  const match = clean.match(/^stories\/member\/([^?#/]+)/i);
  if (match) return decodeURIComponent(match[1]);
  return getQueryValue(search || clean, 'member');
}

function getAnchor(hash: string) {
  const anchorIndex = hash.indexOf('#', 1);
  return anchorIndex === -1 ? '' : decodeURIComponent(hash.slice(anchorIndex + 1));
}

function scrollToAnchor(anchor: string, attempt = 0) {
  if (!anchor || typeof window === 'undefined') return;
  const target = document.getElementById(anchor);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (attempt < 20) window.setTimeout(() => scrollToAnchor(anchor, attempt + 1), 50);
}

export function useRouter() {
  const getLocationRoute = () => {
    if (typeof window === 'undefined') return 'home' as PageRoute;
    return parseRoute(window.location.hash || `${window.location.pathname}${window.location.search}`);
  };

  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => {
    return getLocationRoute();
  });

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getLocationRoute();
      setCurrentRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const anchor = getAnchor(window.location.hash);
      scrollToAnchor(anchor);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    handleHashChange();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigate = (route: PageRoute) => {
    const targetHash = route === 'home' ? '#/' : `#/${route}`;
    if (window.location.hash === targetHash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = targetHash;
    }
  };

  return { currentRoute, navigate };
}
