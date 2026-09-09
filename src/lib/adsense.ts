const defaultPublisherId = 'pub-2209406347192595';

export const adsensePublisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID?.trim() || defaultPublisherId;
export const adsenseClient = `ca-${adsensePublisherId}`;
export const adsenseSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID?.trim() || '';

export function loadAdsense() {
  if (!adsenseSlotId || typeof document === 'undefined') return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>('script[data-wf-adsense]');
  if (existing) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.wfAdsense = 'true';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

export function requestAd() {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    // Ad blockers and a late-loading provider should never interrupt the page.
  }
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}
