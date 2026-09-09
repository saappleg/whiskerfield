import { useEffect, useState } from 'react';

export type PageRoute = 'home' | 'stories' | 'members' | 'privacy';

function parseRoute(hash: string): PageRoute {
  const clean = hash.replace(/^#\/?/, '').toLowerCase().trim();
  const path = clean.split('#', 1)[0];
  if (path === 'community' || path === 'cat-club' || path === 'members' || path === 'shelf' || path === 'club') {
    return 'members';
  }
  if (path === 'stories' || path === 'journal' || path === 'articles' || path === 'guides') {
    return 'stories';
  }
  if (path === 'privacy' || path === 'terms') {
    return 'privacy';
  }
  return 'home';
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
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => {
    return typeof window !== 'undefined' ? parseRoute(window.location.hash) : 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = parseRoute(window.location.hash);
      setCurrentRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const anchor = getAnchor(window.location.hash);
      scrollToAnchor(anchor);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
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
