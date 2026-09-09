import { useState } from 'react';
import { CatAgeCalculator } from './CatAgeCalculator';
import { HydrationCalculator } from './HydrationCalculator';
import { ToxicPlantChecker } from './ToxicPlantChecker';

export function CareToolsSection() {
  const [activeTool, setActiveTool] = useState<'age' | 'safety' | 'hydration'>('age');

  return (
    <section className="shell care-tools-section" id="tools" style={{ marginTop: '80px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p className="eyebrow">
          <i /> Interactive Veterinary Tools
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', margin: 0, lineHeight: 1.05 }}>
              Free Feline Health &amp; Care Calculators
            </h2>
            <p style={{ margin: '.4rem 0 0', color: 'var(--ink-soft)', fontSize: '.92rem' }}>
              Practical scientific tools for every cat parent. 100% free, no sign-up required.
            </p>
          </div>

          {/* Tool Tab Switcher */}
          <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTool('age')}
              style={{
                padding: '.55rem 1rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontSize: '.78rem',
                fontWeight: 800,
                background: activeTool === 'age' ? 'var(--coral)' : 'var(--cream)',
                color: activeTool === 'age' ? '#ffffff' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              🎂 Age in Human Years
            </button>
            <button
              type="button"
              onClick={() => setActiveTool('safety')}
              style={{
                padding: '.55rem 1rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontSize: '.78rem',
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
                padding: '.55rem 1rem',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                fontSize: '.78rem',
                fontWeight: 800,
                background: activeTool === 'hydration' ? 'var(--coral)' : 'var(--cream)',
                color: activeTool === 'hydration' ? '#ffffff' : 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              💧 Hydration &amp; Calories
            </button>
          </div>
        </div>
      </div>

      {activeTool === 'age' && <CatAgeCalculator />}
      {activeTool === 'safety' && <ToxicPlantChecker />}
      {activeTool === 'hydration' && <HydrationCalculator />}
    </section>
  );
}
