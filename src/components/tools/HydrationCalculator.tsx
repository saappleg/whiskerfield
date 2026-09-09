import { useState } from 'react';
import { calculateCatCaloriesAndHydration, type CalorieGoal } from '../../data/cat-tools';

export function HydrationCalculator() {
  const [weightLbs, setWeightLbs] = useState<number>(10);
  const [goal, setGoal] = useState<CalorieGoal>('maintain');
  const [wetPercent, setWetPercent] = useState<number>(50);

  const results = calculateCatCaloriesAndHydration(weightLbs, goal, wetPercent);
  const waterTotalOz = Math.round((results.waterTotalMl / 29.5735) * 10) / 10;
  const waterFromBowlOz = Math.round((results.waterFromBowlMl / 29.5735) * 10) / 10;

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
          <span style={{ fontSize: '1.4rem' }}>💧</span>
          <h3 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--ink)' }}>
            Daily Hydration &amp; Calorie Calculator
          </h3>
        </div>
        <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '.86rem', lineHeight: 1.5 }}>
          Cats evolved in desert origins and have a naturally low thirst drive. See your cat’s daily calorie target and how much moisture they need from their bowl vs. wet food.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Inputs */}
        <div
          style={{
            background: 'var(--paper)',
            padding: '1.4rem',
            border: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
              <label htmlFor="cat-weight-input" style={{ fontSize: '.78rem', fontWeight: 800, color: 'var(--ink)' }}>
                Cat’s Weight:
              </label>
              <span style={{ fontSize: '.95rem', fontWeight: 900, color: 'var(--coral)' }}>
                {weightLbs} lbs ({results.weightKg} kg)
              </span>
            </div>
            <input
              id="cat-weight-input"
              type="range"
              min={4}
              max={25}
              step={0.5}
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--coral)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label htmlFor="cat-goal-select" style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, marginBottom: '.4rem', color: 'var(--ink)' }}>
              Life Stage &amp; Goal:
            </label>
            <select
              id="cat-goal-select"
              value={goal}
              onChange={(e) => setGoal(e.target.value as CalorieGoal)}
              style={{
                width: '100%',
                padding: '.6rem',
                fontSize: '.82rem',
                border: '1px solid var(--line)',
                background: 'var(--cream)',
                color: 'var(--ink)',
              }}
            >
              <option value="maintain">Healthy Adult (Neutered / Spayed)</option>
              <option value="loss">Gentle Weight Loss (Sedentary)</option>
              <option value="gain">Active / Underweight Adult</option>
              <option value="kitten">Growing Kitten (&lt; 12 months)</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
              <label htmlFor="cat-diet-ratio" style={{ fontSize: '.78rem', fontWeight: 800, color: 'var(--ink)' }}>
                Diet Wet vs. Dry Ratio:
              </label>
              <span style={{ fontSize: '.84rem', fontWeight: 800, color: 'var(--ink)' }}>
                {wetPercent}% Wet / {100 - wetPercent}% Dry
              </span>
            </div>
            <input
              id="cat-diet-ratio"
              type="range"
              min={0}
              max={100}
              step={10}
              value={wetPercent}
              onChange={(e) => setWetPercent(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--coral)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '.7rem', color: 'var(--ink-soft)' }}>
              Canned wet food is ~78% moisture, providing natural hydration.
            </span>
          </div>
        </div>

        {/* Results */}
        <div
          style={{
            background: 'var(--paper)',
            padding: '1.4rem',
            border: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-soft)' }}>
              Estimated Daily Calorie Target
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'Georgia, serif', color: 'var(--ink)', lineHeight: 1.1, margin: '.2rem 0' }}>
              {results.dailyKcal} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink-soft)' }}>kcal / day</span>
            </div>
            <p style={{ margin: 0, fontSize: '.74rem', color: 'var(--ink-soft)' }}>
              Based on standard Feline NRC Resting Energy Requirements.
            </p>
          </div>

          <div style={{ borderTop: '1px dashed var(--line)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-soft)' }}>
              Daily Water Target
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--coral)', margin: '.2rem 0' }}>
              {results.waterTotalMl} ml <span style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--ink)' }}>({waterTotalOz} fl oz)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem', marginTop: '.6rem' }}>
              <div style={{ padding: '.6rem', background: 'var(--cream)', border: '1px solid var(--line)' }}>
                <span style={{ display: 'block', fontSize: '.66rem', color: 'var(--ink-soft)', fontWeight: 800 }}>FROM WET FOOD</span>
                <b style={{ fontSize: '.88rem', color: 'var(--ink)' }}>~{results.waterFromFoodMl} ml</b>
              </div>
              <div style={{ padding: '.6rem', background: 'var(--cream)', border: '1px solid var(--line)' }}>
                <span style={{ display: 'block', fontSize: '.66rem', color: 'var(--ink-soft)', fontWeight: 800 }}>DRINK FROM BOWL</span>
                <b style={{ fontSize: '.88rem', color: 'var(--coral)' }}>~{results.waterFromBowlMl} ml ({waterFromBowlOz} oz)</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          borderLeft: '4px solid var(--coral)',
          padding: '.8rem 1.2rem',
          background: 'var(--paper)',
          fontSize: '.8rem',
          color: 'var(--ink)',
          lineHeight: 1.5,
        }}
      >
        💡 <strong>Vet hydration tip:</strong> Cats prefer moving water. A stainless steel or ceramic circulating fountain encourages up to 60% more drinking compared to stagnant water bowls, protecting against urinary stones and chronic kidney disease.
      </div>
    </div>
  );
}
