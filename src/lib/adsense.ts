const defaultPublisherId = 'pub-2209406347192595';

export const adsensePublisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID?.trim() || defaultPublisherId;
export const adsenseClient = `ca-${adsensePublisherId}`;
export const adsenseSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID?.trim() || '';

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
