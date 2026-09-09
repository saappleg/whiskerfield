import { useState } from 'react';
import { CatAgeCalculator } from './CatAgeCalculator';
import { CatHealthBinder } from './CatHealthBinder';
import { CatSitterGuide } from './CatSitterGuide';
import { HydrationCalculator } from './HydrationCalculator';
import { LostCatFlyer } from './LostCatFlyer';
import { ToxicPlantChecker } from './ToxicPlantChecker';

export function CareToolsSection() {
  const [activeTool, setActiveTool] = useState<
    'age' | 'safety' | 'hydration' | 'sitter' | 'binder' | 'lost'
  >('age');

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
          <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTool('age')}
              style={{
                padding: '.5rem .85rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontSize: '.76rem',
                fontWeight: 800,
                background: activeTool === 'age' ? 'var(--coral)' : 'var(--cream)',
                color: activeTool === 'age' ? '#ffffff' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              🎂 Human Age
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('safety')}
              style={{
                padding: '.5rem .85rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontSize: '.76rem',
                fontWeight: 800,
                background: activeTool === 'safety' ? 'var(--coral)' : 'var(--cream)',
                color: activeTool === 'safety' ? '#ffffff' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              🌿 Plant &amp; Food Safety
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('hydration')}
              style={{
                padding: '.5rem .85rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontSize: '.76rem',
                fontWeight: 800,
                background: activeTool === 'hydration' ? 'var(--coral)' : 'var(--cream)',
                color: activeTool === 'hydration' ? '#ffffff' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              💧 Hydration
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('sitter')}
              style={{
                padding: '.5rem .85rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontSize: '.76rem',
                fontWeight: 800,
                background: activeTool === 'sitter' ? 'var(--coral)' : 'var(--cream)',
                color: activeTool === 'sitter' ? '#ffffff' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              📋 Sitter Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('binder')}
              style={{
                padding: '.5rem .85rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontSize: '.76rem',
                fontWeight: 800,
                background: activeTool === 'binder' ? 'var(--coral)' : 'var(--cream)',
                color: activeTool === 'binder' ? '#ffffff' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              🩺 Health Binder
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('lost')}
              style={{
                padding: '.5rem .85rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontSize: '.76rem',
                fontWeight: 800,
                background: activeTool === 'lost' ? '#dc2626' : 'var(--cream)',
                color: activeTool === 'lost' ? '#ffffff' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              🚨 Lost Cat Flyer
            </button>
          </div>
        </div>
      </div>

      {activeTool === 'age' && <CatAgeCalculator />}
      {activeTool === 'safety' && <ToxicPlantChecker />}
      {activeTool === 'hydration' && <HydrationCalculator />}
      {activeTool === 'sitter' && <CatSitterGuide />}
      {activeTool === 'binder' && <CatHealthBinder />}
      {activeTool === 'lost' && <LostCatFlyer />}
    </section>
  );
}

