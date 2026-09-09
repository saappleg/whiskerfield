import { useEffect } from 'react';
import { adsenseClient, adsenseSlotId, loadAdsense, requestAd } from '../lib/adsense';

export function AdSlot() {
  useEffect(() => {
    if (adsenseSlotId) {
      void loadAdsense().then(requestAd);
    }
  }, []);

  if (!adsenseSlotId) {
    return (
      <aside className="ad-band ad-preview" aria-label="Sponsorship notice">
        <span className="ad-tag">Sponsorship & Ethics</span>
        <p>Whiskerfield partners with Google AdSense and clearly labels sponsored recommendations.</p>
      </aside>
    );
  }

  return (
    <aside className="ad-band ad-live" aria-label="Advertisement">
      <span className="ad-tag">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseClient}
        data-ad-slot={adsenseSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
