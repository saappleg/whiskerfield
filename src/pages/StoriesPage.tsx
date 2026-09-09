import type { User } from '@supabase/supabase-js';
import { AdSlot } from '../components/AdSlot';
import { JournalSection } from '../components/JournalSection';
import { CareToolsSection } from '../components/tools/CareToolsSection';
import type { Pet } from '../types/community';

type StoriesPageProps = {
  user?: User | null;
  userPets?: Pet[];
};

export function StoriesPage({ user, userPets }: StoriesPageProps) {
  return (
    <div className="stories-page" style={{ paddingBottom: '96px' }}>
      <div className="shell" style={{ paddingTop: '80px', marginBottom: '-50px' }}>
        <p className="eyebrow"><i /> Whiskerfield Journal &amp; Guides</p>
        <h1 style={{ fontSize: 'clamp(2.6rem, 4.5vw, 4.4rem)', lineHeight: 1, margin: '.4rem 0 1rem' }}>
          Stories for the life you share.
        </h1>
        <p style={{ maxWidth: '640px', color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Explore practical care observations, field tests for cat homes, and gentle routines tested by experienced cat lovers.
        </p>
      </div>

      <CareToolsSection user={user} userPets={userPets} />
      <JournalSection />
      <AdSlot />
    </div>
  );
}

