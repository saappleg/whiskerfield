import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Pet } from '../../types/community';
import { CatAgeCalculator } from './CatAgeCalculator';
import { CatHealthBinder } from './CatHealthBinder';
import { CatSitterGuide } from './CatSitterGuide';
import { HydrationCalculator } from './HydrationCalculator';
import { LostCatFlyer } from './LostCatFlyer';
import { ToxicPlantChecker } from './ToxicPlantChecker';

type CareToolsSectionProps = {
  user?: User | null;
  userPets?: Pet[];
};

export function CareToolsSection({ userPets = [] }: CareToolsSectionProps) {
  type ToolId = 'age' | 'safety' | 'hydration' | 'sitter' | 'binder' | 'lost';
  const [activeTool, setActiveTool] = useState<ToolId>('age');
  const tabs: Array<{ id: ToolId; label: string }> = [
    { id: 'age', label: '🎂 Human Age' },
    { id: 'safety', label: '🌿 Plant & Food Safety' },
    { id: 'hydration', label: '💧 Hydration' },
    { id: 'sitter', label: '📋 Sitter Guide' },
    { id: 'binder', label: '🩺 Health Binder' },
    { id: 'lost', label: '🚨 Lost Cat Flyer' },
  ];

  const activePanel = activeTool === 'age' ? <CatAgeCalculator />
    : activeTool === 'safety' ? <ToxicPlantChecker />
    : activeTool === 'hydration' ? <HydrationCalculator />
    : activeTool === 'sitter' ? <CatSitterGuide pets={userPets} pet={userPets[0]} />
    : activeTool === 'binder' ? <CatHealthBinder pets={userPets} pet={userPets[0]} />
    : <LostCatFlyer pets={userPets} pet={userPets[0]} />;

  return (
    <section className="shell care-tools-section" id="tools" style={{ marginTop: '80px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p className="eyebrow">
          <i /> Interactive Veterinary &amp; Parent Toolkits
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', margin: 0, lineHeight: 1.05 }}>
              Free Feline Care &amp; Health Toolkits
            </h2>
            <p style={{ margin: '.4rem 0 0', color: 'var(--ink-soft)', fontSize: '.92rem' }}>
              Practical scientific calculators and printable parent guides. 100% free, private &amp; no sign-up required.
            </p>
          </div>

          {/* Tool Tab Switcher */}
          <div role="tablist" aria-label="Cat care tools" style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
            {tabs.map((tab) => {
              const selected = activeTool === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`care-tool-tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`care-tool-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTool(tab.id)}
                  style={{
                    padding: '.5rem .85rem',
                    border: '1px solid var(--line)',
                    borderRadius: '999px',
                    fontSize: '.76rem',
                    fontWeight: 800,
                    background: selected ? 'var(--ink)' : 'var(--cream)',
                    color: selected ? 'var(--paper)' : 'var(--ink)',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        id={`care-tool-panel-${activeTool}`}
        role="tabpanel"
        aria-labelledby={`care-tool-tab-${activeTool}`}
        tabIndex={0}
      >
        {activePanel}
      </div>
    </section>
  );
}
