import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Pet } from '../../types/community';
import { CatAgeCalculator } from './CatAgeCalculator';
import { CatHealthBinder } from './CatHealthBinder';
import { CatSitterGuide } from './CatSitterGuide';
import { HydrationCalculator } from './HydrationCalculator';
import { LostCatFlyer } from './LostCatFlyer';
import { ToxicPlantChecker } from './ToxicPlantChecker';
import { CARE_PATHWAYS, type CareToolId } from '../../data/cat-tools';

type CareToolsSectionProps = {
  user?: User | null;
  userPets?: Pet[];
};

export function CareToolsSection({ userPets = [] }: CareToolsSectionProps) {
  const [activeTool, setActiveTool] = useState<CareToolId>('age');
  const [activePathway, setActivePathway] = useState<string | null>(null);
  const tabs: Array<{ id: CareToolId; label: string }> = [
    { id: 'age', label: '🎂 Human Age' },
    { id: 'safety', label: '🌿 Plant & Food Safety' },
    { id: 'hydration', label: '💧 Hydration' },
    { id: 'sitter', label: '📋 Sitter Guide' },
    { id: 'binder', label: '🩺 Health Binder' },
    { id: 'lost', label: '🚨 Lost Cat Flyer' },
  ];
  const selectedPathway = CARE_PATHWAYS.find((pathway) => pathway.id === activePathway);
  const visibleTabs = selectedPathway
    ? tabs.filter((tab) => selectedPathway.toolIds.includes(tab.id))
    : tabs;

  function choosePathway(pathwayId: string | null) {
    setActivePathway(pathwayId);
    if (pathwayId) {
      const pathway = CARE_PATHWAYS.find((item) => item.id === pathwayId);
      if (pathway) setActiveTool(pathway.toolIds[0]);
    }
  }

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

          <div className="care-tool-tabs" role="tablist" aria-label="Cat care tools">
            {visibleTabs.map((tab) => {
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

      <div className="care-start-panel" aria-labelledby="care-start-heading">
        <div className="care-start-copy">
          <p className="care-start-kicker">Start with what is happening today</p>
          <h3 id="care-start-heading">Not sure which tool to open?</h3>
          <p>Pick a starting point and we’ll put the most useful tools together. You can always switch to the full set.</p>
        </div>
        <ul className="care-pathway-grid" aria-label="Care tool starting points">
          {CARE_PATHWAYS.map((pathway) => {
            const selected = activePathway === pathway.id;
            return (
              <li key={pathway.id}>
                <button
                  type="button"
                  className={`care-pathway-card ${pathway.accent}${selected ? ' is-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => choosePathway(pathway.id)}
                >
                  <span className="care-pathway-emoji" aria-hidden="true">{pathway.emoji}</span>
                  <strong>{pathway.label}</strong>
                  <small>{pathway.description}</small>
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              className={`care-pathway-card all-tools${activePathway === null ? ' is-selected' : ''}`}
              aria-pressed={activePathway === null}
              onClick={() => choosePathway(null)}
            >
              <span className="care-pathway-emoji" aria-hidden="true">✦</span>
              <strong>Show all tools</strong>
              <small>Browse the complete care toolkit.</small>
            </button>
          </li>
        </ul>
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
