import { useEffect, useState } from 'react';

export type PageRoute = 'home' | 'community' | 'stories' | 'members' | 'privacy';

function parseRoute(hash: string): PageRoute {
  const clean = hash.replace(/^#\/?/, '').toLowerCase().trim();
  if (clean === 'community' || clean === 'cat-club') return 'community';
  if (clean === 'stories' || clean === 'journal' || clean === 'articles') return 'stories';
  if (clean === 'members' || clean === 'shelf') return 'members';
  if (clean === 'privacy' || clean === 'terms') return 'privacy';
  return 'home';
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
    };

    window.addEventListener('hashchange', handleHashChange);
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
