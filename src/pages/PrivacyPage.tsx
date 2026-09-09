export function PrivacyPage() {
  return (
    <div className="privacy-page shell" style={{ paddingTop: '80px', paddingBottom: '96px', maxWidth: '840px' }}>
      <p className="eyebrow"><i /> Privacy Policy &amp; Reader Trust</p>
      <h1 style={{ fontSize: 'clamp(2.5rem, 4.2vw, 4rem)', lineHeight: 1, margin: '.4rem 0 1.5rem' }}>
        Privacy Policy &amp; Reader Disclosures
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: '2.5rem' }}>
        Last updated: September 8, 2026
      </p>

      <div className="privacy-content" style={{ display: 'grid', gap: '2rem', lineHeight: 1.7, color: 'var(--ink)' }}>
        <section>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '.6rem', color: 'var(--ink)' }}>
            1. Overview &amp; Commitment
          </h2>
          <p>
            Whiskerfield (<strong>whiskerfield.social</strong>) is dedicated to being a gentle, transparent, and respectful space for cat lovers. We keep data collection to the absolute minimum necessary to operate the community and deliver editorial content.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '.6rem', color: 'var(--ink)' }}>
            2. Community &amp; Account Information
          </h2>
          <p>
            When you join the Cat Club, Supabase Auth securely handles your email address for magic-link, email/password, and passkey sign-in. Passkeys use your device’s built-in security credential; Whiskerfield never receives your biometric data or device PIN.
          </p>
          <p>
            Your email address is <strong>never displayed publicly</strong>, never sold to third parties, and never exposed to other members. Only your chosen display name and handle are visible alongside your published notes, replies, and reactions.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '.6rem', color: 'var(--ink)' }}>
            3. Advertising &amp; Third-Party Cookies (Google AdSense)
          </h2>
          <p>
            Whiskerfield uses Google AdSense to support independent writing, web hosting, and editorial curation.
          </p>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to Whiskerfield and other websites on the internet. Google’s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
          </p>
          <p>
            Users may opt out of personalized advertising at any time by visiting:{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: 800, textDecoration: 'underline', color: 'var(--coral)' }}
            >
              Google Ads Settings (google.com/settings/ads)
            </a>.
          </p>
          <p>
            Alternatively, you can opt out of a third-party vendor’s use of cookies for personalized advertising by visiting{' '}
            <a
              href="https://www.aboutads.info"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: 800, textDecoration: 'underline', color: 'var(--coral)' }}
            >
              aboutads.info
            </a>.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '.6rem', color: 'var(--ink)' }}>
            4. Local Storage &amp; Visitor Identifiers
          </h2>
          <p>
            To allow visitors to react to notes (likes, treats, smiles) without requiring registration, a random client identifier is saved in your browser’s local storage. This identifier does not contain personally identifiable information and is used solely to record which reactions you have chosen.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '.6rem', color: 'var(--ink)' }}>
            5. Error Tracking &amp; Diagnostics (Sentry)
          </h2>
          <p>
            We use Sentry to monitor software health and catch technical crashes. Sentry collects anonymous diagnostic crash reports (browser version, operating system, and error stack trace) so we can repair bugs quickly. No sensitive personal communication is sent to Sentry.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '.6rem', color: 'var(--ink)' }}>
            6. Editorial Independence &amp; Affiliate Disclosure
          </h2>
          <p>
            All care observations, scratcher field tests, and environmental enrichment articles are written independently. When an article includes an affiliate link to a pet product, it is clearly and prominently labeled. We only mention products that have proven genuinely useful in real cat homes.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '.6rem', color: 'var(--ink)' }}>
            7. European Economic Area (EEA), UK &amp; Switzerland Consent (GDPR / IAB TCF)
          </h2>
          <p>
            For readers in the European Economic Area (EEA), the United Kingdom, and Switzerland, Whiskerfield complies with the General Data Protection Regulation (GDPR), UK GDPR, and Swiss Federal Act on Data Protection (FADP). We use a Google-certified Consent Management Platform (CMP) implementing the IAB Europe Transparency and Consent Framework (TCF v2.2) to collect and record explicit consent prior to storing cookies or serving personalized advertising.
          </p>
          <p>
            You have the right to accept, reject, or customize advertising partners and cookie categories at any time. To modify or revoke your previous choices, use the <strong>Ad &amp; Cookie Choices</strong> link located in the footer of any page on our site, or visit your browser’s privacy settings.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '.6rem', color: 'var(--ink)' }}>
            8. Contact Us
          </h2>
          <p>
            If you have questions about this privacy policy or your community account, please reach out via GitHub at{' '}
            <a
              href="https://github.com/saappleg/whiskerfield"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: 800, textDecoration: 'underline', color: 'var(--coral)' }}
            >
              github.com/saappleg/whiskerfield
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
