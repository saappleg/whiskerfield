import { useState } from 'react';
import type { Pet } from '../../types/community';
import { AvatarImage } from '../AvatarImage';

type LostCatFlyerProps = {
  pet?: Pet | null;
  pets?: Pet[];
  onSelectPet?: (pet: Pet) => void;
  onClose?: () => void;
};

type FlyerData = {
  catName: string;
  breedColor: string;
  gender: string;
  photoUrl: string;
  rewardAmount: string;
  lastSeenDate: string;
  lastSeenLocation: string;
  distinguishingMarks: string;
  collarDescription: string;
  temperamentNotes: string;
  primaryPhone: string;
  secondaryPhone: string;
};

export function LostCatFlyer({ pet, pets = [], onSelectPet, onClose }: LostCatFlyerProps) {
  const [selectedPetId, setSelectedPetId] = useState<number | undefined>(pet?.id);
  const initialPet = pet || (pets.length > 0 ? pets[0] : null);

  const [data, setData] = useState<FlyerData>(() => {
    return {
      catName: initialPet?.name || 'MISO',
      breedColor: initialPet?.breed || 'Black & White Tuxedo',
      gender: 'Spayed Female',
      photoUrl: initialPet?.avatar_url || '',
      rewardAmount: '$250 REWARD',
      lastSeenDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      lastSeenLocation: 'Near Elm St & 4th Avenue',
      distinguishingMarks: 'White bib and four white paws; small black spot on pink nose pad.',
      collarDescription: 'Teal breakaway collar with bell & tag (may have slipped off)',
      temperamentNotes: 'Indoor-only cat! Very shy and frightened. Please DO NOT CHASE — please call or text immediately!',
      primaryPhone: '(555) 234-5678',
      secondaryPhone: '(555) 876-5432',
    };
  });

  const [copiedAlert, setCopiedAlert] = useState(false);
  const [prevPetId, setPrevPetId] = useState(pet?.id);

  if (pet && pet.id !== prevPetId) {
    setPrevPetId(pet.id);
    setSelectedPetId(pet.id);
    setData((prev) => ({
      ...prev,
      catName: pet.name.toUpperCase(),
      breedColor: pet.breed || prev.breedColor,
      photoUrl: pet.avatar_url || prev.photoUrl,
    }));
  }

  const activePet = pets.find((p) => p.id === selectedPetId) || pet;

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      updateField('photoUrl', dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handlePetChange(pId: number) {
    setSelectedPetId(pId);
    const chosen = pets.find((p) => p.id === pId);
    if (chosen) {
      if (onSelectPet) onSelectPet(chosen);
      setData((prev) => ({
        ...prev,
        catName: chosen.name.toUpperCase(),
        breedColor: chosen.breed || prev.breedColor,
        photoUrl: chosen.avatar_url || prev.photoUrl,
      }));
    }
  }

  function updateField<K extends keyof FlyerData>(key: K, value: FlyerData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCopyNextdoorText() {
    const text = `🚨 LOST CAT: ${data.catName} (${data.rewardAmount ? `${data.rewardAmount} - ` : ''}NO QUESTIONS ASKED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 LAST SEEN: ${data.lastSeenLocation} on ${data.lastSeenDate}
🐾 DESCRIPTION: ${data.breedColor} (${data.gender})
🔍 DISTINCTIVE MARKS: ${data.distinguishingMarks}
🔔 COLLAR/TAGS: ${data.collarDescription}

⚠️ IMPORTANT: ${data.temperamentNotes}
If spotted, please DO NOT yell or chase. Please take a photo and call/text immediately:
📞 Call/Text: ${data.primaryPhone} ${data.secondaryPhone ? `or ${data.secondaryPhone}` : ''}

Please check under your porch, shed, garage, or crawlspace! Thank you so much!`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 2500);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="lost-cat-flyer-container" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.5rem' }}>
      {/* Controls header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#dc2626' }}>
            🚨 Emergency Generator
          </span>
          <h3 style={{ margin: '.2rem 0 0', fontSize: '1.4rem' }}>Lost Cat Poster &amp; Alert Generator</h3>
          <p style={{ margin: '.2rem 0 0', fontSize: '.8rem', color: 'var(--ink-soft)' }}>
            Generate a high-contrast printable poster and instant text for Nextdoor, Facebook, and neighborhood groups.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {pets.length > 1 && (
            <select
              value={selectedPetId || ''}
              onChange={(e) => handlePetChange(Number(e.target.value))}
              style={{
                padding: '.45rem .75rem',
                borderRadius: '6px',
                border: '1px solid var(--line)',
                fontSize: '.78rem',
                fontWeight: 700,
                background: 'var(--cream)',
                color: 'var(--ink)',
              }}
              aria-label="Select cat"
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  🐱 {p.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleCopyNextdoorText}
            style={{
              padding: '.45rem .85rem',
              borderRadius: '999px',
              border: '1px solid var(--line)',
              background: copiedAlert ? 'var(--moss, #2e5a44)' : 'var(--cream)',
              color: copiedAlert ? '#fff' : 'var(--ink)',
              fontSize: '.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.3rem',
            }}
          >
            {copiedAlert ? '✓ Copied Alert Text!' : '📱 Copy for Nextdoor / SMS'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: '.45rem .95rem',
              borderRadius: '999px',
              border: 0,
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.3rem',
            }}
          >
            🖨️ Print 8.5x11 Poster
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid var(--line)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                color: 'var(--ink-soft)',
                fontSize: '.9rem',
              }}
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Flyer Photo Selector (Hidden in Print) */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexWrap: 'wrap', marginBottom: '1rem', background: 'var(--cream)', padding: '.75rem 1rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
        <span style={{ fontSize: '.76rem', fontWeight: 800, color: 'var(--ink)' }}>Flyer Photo:</span>
        {activePet?.avatar_url && (
          <button
            type="button"
            onClick={() => updateField('photoUrl', activePet.avatar_url || '')}
            style={{
              fontSize: '.74rem',
              fontWeight: 800,
              padding: '.3rem .75rem',
              background: 'rgba(243,108,77,.14)',
              color: 'var(--coral)',
              border: '1px solid rgba(243,108,77,.3)',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.3rem',
            }}
          >
            📷 Use {activePet.name}’s Profile Photo
          </button>
        )}
        <label
          style={{
            cursor: 'pointer',
            padding: '.3rem .75rem',
            fontSize: '.74rem',
            borderRadius: '999px',
            background: 'var(--paper)',
            color: 'var(--ink)',
            border: '1px solid var(--line)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '.3rem',
          }}
        >
          📁 Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </label>
        {data.photoUrl && (
          <button
            type="button"
            onClick={() => updateField('photoUrl', '')}
            style={{
              border: 0,
              background: 'transparent',
              color: '#888',
              fontSize: '.72rem',
              cursor: 'pointer',
              padding: '.2rem .4rem',
            }}
          >
            ✕ Remove photo
          </button>
        )}
      </div>

      {/* Editor Controls Grid (Hidden in Print) */}
      <div className="no-print" style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '.8rem' }}>
        <div>
          <label htmlFor="flyer-cat-name" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
            Cat Name:
          </label>
          <input
            id="flyer-cat-name"
            type="text"
            value={data.catName}
            onChange={(e) => updateField('catName', e.target.value.toUpperCase())}
            style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.8rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label htmlFor="flyer-reward-banner" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
            Reward Banner:
          </label>
          <input
            id="flyer-reward-banner"
            type="text"
            value={data.rewardAmount}
            onChange={(e) => updateField('rewardAmount', e.target.value)}
            style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.8rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label htmlFor="flyer-last-seen" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
            Last Seen Location:
          </label>
          <input
            id="flyer-last-seen"
            type="text"
            value={data.lastSeenLocation}
            onChange={(e) => updateField('lastSeenLocation', e.target.value)}
            style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.8rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label htmlFor="flyer-primary-phone" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
            Primary Phone:
          </label>
          <input
            id="flyer-primary-phone"
            type="text"
            value={data.primaryPhone}
            onChange={(e) => updateField('primaryPhone', e.target.value)}
            style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.8rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* High-Contrast Printable Poster */}
      <div
        className="printable-sheet lost-poster"
        style={{
          background: '#ffffff',
          color: '#000000',
          border: '4px solid #dc2626',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '720px',
          margin: '0 auto',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,.06)',
        }}
      >
        {/* HUGE HEADER */}
        <div style={{ background: '#dc2626', color: '#ffffff', padding: '.8rem 1rem', borderRadius: '4px', marginBottom: '1.2rem' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(2.8rem, 6vw, 4.2rem)', fontWeight: 900, letterSpacing: '4px', lineHeight: 1 }}>
            LOST CAT
          </h1>
        </div>

        {/* Reward Subheading */}
        {data.rewardAmount && (
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              ★ {data.rewardAmount} ★
            </span>
          </div>
        )}

        {/* Cat Photo (Large, Centered) */}
        <div style={{ margin: '0 auto 1.2rem', width: '220px', height: '220px', borderRadius: '8px', overflow: 'hidden', border: '3px solid #000', background: '#f5f5f5', display: 'grid', placeItems: 'center' }}>
          <AvatarImage src={data.photoUrl} alt={data.catName} fallback="🐱" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Cat Name & Description */}
        <h2 style={{ fontSize: '2.4rem', margin: '0 0 .3rem', fontWeight: 900, letterSpacing: '1px' }}>
          {data.catName || 'CAT'}
        </h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.2rem', color: '#333' }}>
          {[data.breedColor, data.gender].filter(Boolean).join(' · ')}
        </p>

        {/* Key Clues Table */}
        <div style={{ textAlign: 'left', background: '#f8f8f8', border: '2px solid #ddd', borderRadius: '6px', padding: '1rem', marginBottom: '1.4rem' }}>
          <div style={{ marginBottom: '.5rem' }}>
            <strong style={{ fontSize: '1rem', color: '#dc2626' }}>📍 LAST SEEN: </strong>
            <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{data.lastSeenLocation} on {data.lastSeenDate}</span>
          </div>
          <div style={{ marginBottom: '.5rem' }}>
            <strong style={{ fontSize: '.95rem' }}>🔍 DISTINCTIVE MARKS: </strong>
            <span style={{ fontSize: '.95rem' }}>{data.distinguishingMarks}</span>
          </div>
          <div style={{ marginBottom: '.5rem' }}>
            <strong style={{ fontSize: '.95rem' }}>🔔 COLLAR: </strong>
            <span style={{ fontSize: '.95rem' }}>{data.collarDescription}</span>
          </div>
          <div>
            <strong style={{ fontSize: '.95rem', color: '#000' }}>⚠️ INSTRUCTIONS: </strong>
            <span style={{ fontSize: '.95rem', fontStyle: 'italic' }}>{data.temperamentNotes}</span>
          </div>
        </div>

        {/* GIANT CALL TO ACTION PHONE */}
        <div style={{ background: '#000000', color: '#ffffff', padding: '1.2rem', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 .2rem', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#fbbf24' }}>
            IF SEEN ANYWHERE, PLEASE CALL OR TEXT IMMEDIATELY:
          </p>
          <p style={{ margin: 0, fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)', fontWeight: 900, letterSpacing: '1px' }}>
            {data.primaryPhone}
          </p>
          {data.secondaryPhone && (
            <p style={{ margin: '.3rem 0 0', fontSize: '1.1rem', color: '#ddd' }}>
              Alternate: {data.secondaryPhone}
            </p>
          )}
        </div>

        <div style={{ marginTop: '1rem', fontSize: '.75rem', color: '#666' }}>
          whiskerfield.com · Feline Community Emergency Network
        </div>
      </div>

      {/* Feline Search Tips Box (Never printed) */}
      <div className="no-print" style={{ marginTop: '1.5rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem' }}>
        <b style={{ color: '#1d4ed8', fontSize: '.84rem', display: 'block', marginBottom: '.4rem' }}>
          💡 Feline Search Tips (From Lost Pet Specialists):
        </b>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '.78rem', color: '#1e3a8a', lineHeight: 1.5 }}>
          <li><strong>Indoor cats hide close:</strong> Over 85% of escaped indoor cats are hiding within 3 houses of home, frozen in silence.</li>
          <li><strong>Search at dusk or 2 AM:</strong> Bring a flashlight held directly at your cheek level so the beam reflects their eyeshine.</li>
          <li><strong>Check every crawlspace:</strong> Physically look under decks, window wells, under parked car hoods, and behind air conditioning units.</li>
          <li><strong>Scent markers:</strong> Place an unwashed worn shirt of yours outside on your doorstep (avoid placing litter boxes outside as they attract aggressive stray cats).</li>
        </ul>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .lost-poster, .lost-poster * {
            visibility: visible;
          }
          .lost-poster {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 15px !important;
            border: 4px solid #dc2626 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
