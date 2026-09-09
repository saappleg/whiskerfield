import { useState } from 'react';
import { SAFETY_DIRECTORY, type SafetyItem } from '../../data/cat-tools';

export function ToxicPlantChecker() {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'plant' | 'food'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'toxic' | 'fatal'>('all');

  const filteredItems = SAFETY_DIRECTORY.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const matchesName = item.name.toLowerCase().includes(q);
    const matchesAliases = item.aliases?.some((a) => a.toLowerCase().includes(q));
    const matchesVet = item.vetNote.toLowerCase().includes(q);
    return matchesName || Boolean(matchesAliases) || matchesVet;
  });

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
          <span style={{ fontSize: '1.4rem' }}>🌿</span>
          <h3 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--ink)' }}>
            Plant &amp; Food Safety Directory
          </h3>
        </div>
        <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '.86rem', lineHeight: 1.5 }}>
          Search over 30 common houseplants, flowers, and kitchen foods to verify whether they are safe or hazardous for your cat.
        </p>
      </div>

      {/* Emergency banner */}
      <div
        style={{
          background: 'rgba(243,108,77,.1)',
          borderLeft: '4px solid var(--coral)',
          padding: '.8rem 1rem',
          fontSize: '.78rem',
          color: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '.6rem',
        }}
      >
        <span>
          <strong>Suspect poisoning?</strong> Call your vet or the ASPCA Animal Poison Control immediately: <strong>(888) 426-4435</strong>
        </span>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
          <label htmlFor="safety-search" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clipPath: 'inset(50%)', border: 0 }}>
            Search plant or food
          </label>
          <input
            id="safety-search"
            type="search"
            placeholder="Search plant, flower, or food (e.g. Lily, Pothos, Garlic)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '.6rem .85rem',
              fontSize: '.85rem',
              border: '1px solid var(--line)',
              background: 'var(--paper)',
              color: 'var(--ink)',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                border: '1px solid var(--line)',
                background: 'var(--paper)',
                color: 'var(--ink-soft)',
                padding: '.6rem .9rem',
                fontSize: '.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '.74rem', fontWeight: 800, color: 'var(--ink-soft)', marginRight: '.2rem' }}>
            Filter:
          </span>
          {(['all', 'plant', 'food'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '999px',
                background: categoryFilter === cat ? 'var(--ink)' : 'var(--paper)',
                color: categoryFilter === cat ? 'var(--paper)' : 'var(--ink)',
                fontSize: '.72rem',
                fontWeight: 800,
                padding: '.25rem .65rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {cat === 'all' ? 'All Types' : `${cat}s`}
            </button>
          ))}

          <span style={{ borderLeft: '1px solid var(--line)', height: '18px', margin: '0 .2rem' }} />

          {(['all', 'safe', 'toxic', 'fatal'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '999px',
                background: statusFilter === st ? 'var(--ink)' : 'var(--paper)',
                color: statusFilter === st ? 'var(--paper)' : 'var(--ink)',
                fontSize: '.72rem',
                fontWeight: 800,
                padding: '.25rem .65rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {st === 'all' && 'All Statuses'}
              {st === 'safe' && '🌿 Safe'}
              {st === 'toxic' && '⚠️ Toxic'}
              {st === 'fatal' && '☠️ Fatal Danger'}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          maxHeight: '480px',
          overflowY: 'auto',
          paddingRight: '.3rem',
        }}
      >
        {filteredItems.map((item: SafetyItem) => {
          let badgeBg = 'rgba(22,163,74,.12)';
          let badgeColor = '#16a34a';
          let badgeText = '🌿 Non-Toxic';

          if (item.status === 'toxic') {
            badgeBg = 'rgba(234,88,12,.12)';
            badgeColor = '#ea580c';
            badgeText = '⚠️ Toxic';
          } else if (item.status === 'fatal') {
            badgeBg = 'rgba(220,38,38,.15)';
            badgeColor = '#dc2626';
            badgeText = '☠️ Fatal / Severe';
          }

          return (
            <div
              key={item.id}
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                borderTop: `4px solid ${badgeColor}`,
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.6rem' }}>
                <b style={{ fontSize: '.92rem', color: 'var(--ink)' }}>{item.name}</b>
                <span
                  style={{
                    fontSize: '.68rem',
                    fontWeight: 800,
                    padding: '.2rem .5rem',
                    borderRadius: '4px',
                    background: badgeBg,
                    color: badgeColor,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {badgeText}
                </span>
              </div>

              {item.aliases && item.aliases.length > 0 && (
                <span style={{ fontSize: '.71rem', color: 'var(--ink-soft)' }}>
                  Also known as: {item.aliases.join(', ')}
                </span>
              )}

              {item.commonSymptoms && (
                <div style={{ fontSize: '.76rem', color: 'var(--coral)', lineHeight: 1.4 }}>
                  <strong>Symptoms:</strong> {item.commonSymptoms}
                </div>
              )}

              <p style={{ margin: '.3rem 0 0', fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.48 }}>
                {item.vetNote}
              </p>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '2.5rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
            No plants or foods matching “{query}”. When in doubt, always keep unidentified plants out of reach.
          </div>
        )}
      </div>
    </div>
  );
}
