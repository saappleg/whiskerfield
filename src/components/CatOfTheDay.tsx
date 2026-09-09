import type { Pet } from '../types/community';

type CatOfTheDayProps = {
  userPets?: Pet[];
  onSelectPetFilter?: (petName: string) => void;
};

const SEED_CAT_HEROES: Pet[] = [
  {
    id: 991,
    name: 'Miso',
    breed: 'Flame Point Ragdoll mix',
    age: '3 years old',
    quirk: 'Requires human supervision before attempting any dry food crunch.',
    avatar_url: '🐱',
  },
  {
    id: 992,
    name: 'Clover',
    breed: 'Calico / Short-hair',
    age: '2 years old',
    quirk: 'Spends 25 minutes inspecting the hallway shadows every sunset.',
    avatar_url: '🐈',
  },
  {
    id: 993,
    name: 'Biscuit',
    breed: 'Tuxedo Domestic Shorthair',
    age: '5 years old',
    quirk: 'Sleeps horizontally across entire mechanical keyboards when compile starts.',
    avatar_url: '🐈‍⬛',
  },
  {
    id: 994,
    name: 'Penny',
    breed: 'British Shorthair / Blue Cream',
    age: '4 years old',
    quirk: 'Greets every delivery box with gentle forehead nudges of approval.',
    avatar_url: '😻',
  },
];

export function CatOfTheDay({ userPets = [], onSelectPetFilter }: CatOfTheDayProps) {
  const pool = userPets.length > 0 ? [...userPets, ...SEED_CAT_HEROES] : SEED_CAT_HEROES;

  // Day-of-year deterministic index
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const featuredCat = pool[dayOfYear % pool.length];

  return (
    <div
      className="cat-of-the-day-card"
      style={{
        background: 'var(--cream)',
        border: '1px solid var(--line)',
        borderLeft: '5px solid var(--coral)',
        padding: '1.2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.2rem',
        boxShadow: '0 4px 20px rgba(16,45,53,.03)',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flexWrap: 'wrap' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--mint)',
            border: '2px solid var(--line)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '2rem',
            flexShrink: 0,
          }}
        >
          {featuredCat.avatar_url || '🐱'}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '.66rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '.08em',
                color: 'var(--coral)',
                background: 'rgba(243,108,77,.1)',
                padding: '.15rem .5rem',
                borderRadius: '999px',
              }}
            >
              👑 Cat of the Day
            </span>
            <b style={{ fontSize: '1.1rem', color: 'var(--ink)' }}>{featuredCat.name}</b>
            <span style={{ fontSize: '.78rem', color: 'var(--ink-soft)' }}>
              {[featuredCat.breed, featuredCat.age].filter(Boolean).join(' · ')}
            </span>
          </div>

          {featuredCat.quirk && (
            <p style={{ margin: '.3rem 0 0', fontSize: '.8rem', color: 'var(--ink)', fontStyle: 'italic' }}>
              “{featuredCat.quirk}”
            </p>
          )}
        </div>
      </div>

      {onSelectPetFilter && (
        <button
          type="button"
          onClick={() => onSelectPetFilter(featuredCat.name)}
          style={{
            padding: '.5rem .95rem',
            fontSize: '.75rem',
            fontWeight: 800,
            border: '1px solid var(--line)',
            borderRadius: '999px',
            background: 'var(--paper)',
            color: 'var(--ink)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '.4rem',
            transition: 'transform .15s ease',
          }}
        >
          <span>🐾</span> See notes mentioning {featuredCat.name} →
        </button>
      )}
    </div>
  );
}
