import { AdSlot } from './AdSlot';
import { JournalSection } from './JournalSection';

export function EditorialSections() {
  return (
    <>
      <JournalSection />
      <AdSlot />
      <section className="shell about-grid" id="privacy">
        <div>
          <p className="eyebrow"><i /> Privacy & Reader Trust</p>
          <h2>Built for warm conversation and transparent standards.</h2>
        </div>
        <div className="privacy-body">
          <p>
            <strong>Community &amp; Account Data:</strong> Profiles display only your chosen name and handle. Your email address is handled securely via Supabase Auth for magic-link or email/password sign in, and passkeys stay on your device. Your email is never displayed publicly or shared with other members.
          </p>
          <p>
            <strong>Advertising &amp; Cookies:</strong> Whiskerfield uses Google AdSense to support independent publishing. Third-party vendors, including Google, use cookies to serve advertisements based on a visitor’s prior visits to this website and other sites across the web.
          </p>
          <p>
            Google’s use of advertising cookies enables it and its partners to serve ads based on visits to Whiskerfield and/or other sites on the Internet. Visitors may opt out of personalized advertising at any time by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">
              Google Ads Settings
            </a>{' '}
            or{' '}
            <a href="https://www.aboutads.info" target="_blank" rel="noreferrer">
              aboutads.info
            </a>.
          </p>
          <p>
            <strong>Editorial &amp; Affiliate Disclosure:</strong> All care notes and product field tests are produced independently. Recommendations are never swayed by sponsorships. When affiliate links are included in product notes, they are plainly labeled so readers are always informed.
          </p>
        </div>
      </section>
    </>
  );
}
