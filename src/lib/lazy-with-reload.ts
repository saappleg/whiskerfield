import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

type LazyModule<TProps> = { default: ComponentType<TProps> };

/**
 * Recover from a stale HTML/JS page requesting a chunk removed by a later deploy.
 * GitHub Pages publishes immutable, hashed assets, so one cache-busting reload
 * is safer than leaving the user on a broken route or retrying forever.
 */
export function lazyWithReload<TProps>(
  chunkName: string,
  loader: () => Promise<LazyModule<TProps>>,
): LazyExoticComponent<ComponentType<TProps>> {
  return lazy(async () => {
    const retryKey = `whiskerfield:lazy-retry:${chunkName}`;

    try {
      const loaded = await loader();
      try {
        sessionStorage.removeItem(retryKey);
      } catch {
        // Storage can be unavailable in private browsing; the import still succeeded.
      }

      if (typeof window !== 'undefined' && window.location.search.includes('wf_reload=')) {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('wf_reload');
        window.history.replaceState(null, '', cleanUrl.toString());
      }

      return loaded;
    } catch (error) {
      let alreadyRetried = false;
      try {
        alreadyRetried = sessionStorage.getItem(retryKey) === '1';
        if (!alreadyRetried) sessionStorage.setItem(retryKey, '1');
      } catch {
        // If storage is blocked, fall through and surface the original error.
      }

      if (!alreadyRetried && typeof window !== 'undefined') {
        const reloadUrl = new URL(window.location.href);
        reloadUrl.searchParams.set('wf_reload', Date.now().toString());
        window.location.replace(reloadUrl.toString());
        // Keep React.lazy pending while the browser performs the reload. This
        // prevents a second unhandled rejection from obscuring the recovery.
        return new Promise<never>(() => undefined);
      }

      throw error;
    }
  });
}
