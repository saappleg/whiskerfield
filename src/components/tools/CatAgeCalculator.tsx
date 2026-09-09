import { useState } from 'react';
import { calculateHumanAge } from '../../data/cat-tools';

export function CatAgeCalculator() {
  const [catAge, setCatAge] = useState<number>(4);

  const { humanAge, lifeStage } = calculateHumanAge(catAge);

  return (
    <div
      className="tool-card"
      style={{
        background: 'var(--cream)',
        border: '1px solid var(--line)',
        padding: 'clamp(1.5rem, 3vw, 2.2rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.4rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🎂</span>
          <h3 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--ink)' }}>
            Cat Age in Human Years Calculator
          </h3>
        </div>
        <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '.86rem', lineHeight: 1.5 }}>
          Cats mature much faster in their first two years, then age approximately 4 human years for every feline year thereafter.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
          background: 'var(--paper)',
          padding: '1.4rem',
          border: '1px solid var(--line)',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <label htmlFor="cat-age-slider" style={{ fontSize: '.8rem', fontWeight: 800, color: 'var(--ink)' }}>
              Cat’s Age
            </label>
            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--coral)' }}>
              {catAge} {catAge === 1 ? 'year' : 'years'} old
            </span>
          </div>
          <input
            id="cat-age-slider"
            type="range"
            min={0.5}
            max={22}
            step={0.5}
            value={catAge}
            onChange={(e) => setCatAge(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--coral)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap', marginTop: '.8rem' }}>
            {[1, 2, 4, 7, 11, 15, 18].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCatAge(preset)}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '999px',
                  background: catAge === preset ? 'var(--ink)' : 'var(--cream)',
                  color: catAge === preset ? 'var(--paper)' : 'var(--ink)',
                  fontSize: '.7rem',
                  fontWeight: 800,
                  padding: '.2rem .55rem',
                  cursor: 'pointer',
                }}
              >
                {preset}y
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            padding: '1rem',
            borderLeft: '2px dashed var(--line)',
          }}
        >
          <span style={{ display: 'block', fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-soft)', marginBottom: '.2rem' }}>
            Equivalent Human Age
          </span>
          <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.4rem)', fontWeight: 900, fontFamily: 'Georgia, serif', color: 'var(--ink)', lineHeight: 1 }}>
            ~{humanAge}
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink-soft)', marginLeft: '.4rem' }}>years</span>
          </div>
          <span
            style={{
              display: 'inline-block',
              marginTop: '.6rem',
              padding: '.25rem .7rem',
              borderRadius: '999px',
              fontSize: '.72rem',
              fontWeight: 800,
              background: 'rgba(243,108,77,.12)',
              color: 'var(--coral)',
            }}
          >
            {lifeStage.badgeEmoji} {lifeStage.label} Stage ({lifeStage.ageRange})
          </span>
        </div>
      </div>

      <div
        style={{
          borderLeft: '4px solid var(--coral)',
          padding: '1rem 1.2rem',
          background: 'var(--paper)',
          fontSize: '.82rem',
          lineHeight: 1.55,
        }}
      >
        <b style={{ display: 'block', color: 'var(--ink)', marginBottom: '.2rem' }}>
          {lifeStage.label} Care Focus: {lifeStage.focus}
        </b>
        <p style={{ margin: '0 0 .5rem', color: 'var(--ink-soft)' }}>
          {lifeStage.description}
        </p>
        <div style={{ color: 'var(--ink)', fontSize: '.8rem' }}>
          <strong style={{ color: 'var(--coral)' }}>Diet &amp; Nutrition:</strong> {lifeStage.dietAdvice}
        </div>
      </div>
    </div>
  );
}
