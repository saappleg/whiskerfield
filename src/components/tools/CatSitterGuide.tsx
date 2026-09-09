import { useState } from 'react';
import type { Pet } from '../../types/community';
import { AvatarImage } from '../AvatarImage';

type CatSitterGuideProps = {
  pet?: Pet | null;
  pets?: Pet[];
  onSelectPet?: (pet: Pet) => void;
  onClose?: () => void;
};

type SitterData = {
  catName: string;
  breed: string;
  age: string;
  photoUrl: string;
  quirk: string;
  morningFood: string;
  eveningFood: string;
  waterRoutine: string;
  treatsInfo: string;
  litterRoutine: string;
  medsInfo: string;
  hidingSpots: string;
  ownerPhone: string;
  backupContact: string;
  vetName: string;
  vetPhone: string;
  emergencyVet: string;
  specialNotes: string;
};

export function CatSitterGuide({ pet, pets = [], onSelectPet, onClose }: CatSitterGuideProps) {
  const [selectedPetId, setSelectedPetId] = useState<number | undefined>(pet?.id);

  const initialPet = pet || (pets.length > 0 ? pets[0] : null);

  const [data, setData] = useState<SitterData>(() => {
    const saved = localStorage.getItem(`wf_sitter_guide_${initialPet?.id || 'default'}`);
    if (saved) {
      try {
        return JSON.parse(saved) as SitterData;
      } catch {
        // Fallback below
      }
    }
    return {
      catName: initialPet?.name || '',
      breed: initialPet?.breed || '',
      age: initialPet?.age || '',
      photoUrl: initialPet?.avatar_url || '',
      quirk: initialPet?.quirk || 'Loves gentle chin scratches; please let them approach you first.',
      morningFood: '1/2 can wet food at 8:00 AM (cabinet under microwave)',
      eveningFood: '1/4 cup dry kibble at 6:30 PM',
      waterRoutine: 'Rinse and refill water fountain daily with cold filtered water',
      treatsInfo: '2 Churu tubes or crunchy salmon treats max per day',
      litterRoutine: 'Scoop once daily into Litter Genie; spare litter bags in hall closet',
      medsInfo: 'None currently required',
      hidingSpots: 'Under the master bed or on top of the sunny bookshelf',
      ownerPhone: '',
      backupContact: 'Neighbor Sarah (has spare key): (555) 234-5678',
      vetName: 'Main Street Animal Hospital: (555) 123-4567',
      vetPhone: '(555) 123-4567',
      emergencyVet: 'Metropolitan 24/7 Vet Hospital: (555) 999-8888',
      specialNotes: 'Please ensure balcony door stays completely closed at all times.',
    };
  });

  const [copied, setCopied] = useState(false);
  const [prevPetId, setPrevPetId] = useState(pet?.id);

  if (pet && pet.id !== prevPetId) {
    setPrevPetId(pet.id);
    setSelectedPetId(pet.id);
    const saved = localStorage.getItem(`wf_sitter_guide_${pet.id}`);
    if (saved) {
      try {
        setData(JSON.parse(saved) as SitterData);
      } catch {
        // ignore
      }
    } else {
      setData((prev) => ({
        ...prev,
        catName: pet.name,
        breed: pet.breed || prev.breed,
        age: pet.age || prev.age,
        photoUrl: pet.avatar_url || prev.photoUrl,
        quirk: pet.quirk || prev.quirk,
      }));
    }
  }

  function handlePetChange(pId: number) {
    setSelectedPetId(pId);
    const chosen = pets.find((p) => p.id === pId);
    if (chosen) {
      if (onSelectPet) onSelectPet(chosen);
      const saved = localStorage.getItem(`wf_sitter_guide_${chosen.id}`);
      if (saved) {
        try {
          setData(JSON.parse(saved) as SitterData);
          return;
        } catch {
          // ignore
        }
      }
      setData((prev) => ({
        ...prev,
        catName: chosen.name,
        breed: chosen.breed || '',
        age: chosen.age || '',
        photoUrl: chosen.avatar_url || '',
        quirk: chosen.quirk || '',
      }));
    }
  }

  function updateField<K extends keyof SitterData>(key: K, value: SitterData[K]) {
    setData((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(`wf_sitter_guide_${selectedPetId || 'default'}`, JSON.stringify(updated));
      return updated;
    });
  }

  function handlePrint() {
    window.print();
  }

  async function handleCopyText() {
    const text = `🐾 CAT SITTER INSTRUCTIONS: ${data.catName || 'My Cat'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Breed/Age: ${data.breed || 'Cat'} · ${data.age || 'Adult'}
Quirk: ${data.quirk}

🥣 FEEDING SCHEDULE:
• Morning: ${data.morningFood}
• Evening: ${data.eveningFood}
• Water: ${data.waterRoutine}
• Treats: ${data.treatsInfo}

📦 LITTER BOX & CARE:
• Protocol: ${data.litterRoutine}
• Meds: ${data.medsInfo}
• Favorite Spots: ${data.hidingSpots}

🚨 CONTACTS & EMERGENCIES:
• Owner Phone: ${data.ownerPhone || 'See text'}
• Emergency Backup (Key): ${data.backupContact}
• Primary Vet: ${data.vetName}
• 24/7 Emergency Vet: ${data.emergencyVet}

⚠️ IMPORTANT:
${data.specialNotes}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated via Whiskerfield Cat Club`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="cat-sitter-guide-container" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.5rem' }}>
      {/* Header controls (hidden in print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--coral)' }}>
            📋 Pet Sitter Ready
          </span>
          <h3 style={{ margin: '.2rem 0 0', fontSize: '1.4rem' }}>Cat Sitter Instructions Guide</h3>
          <p style={{ margin: '.2rem 0 0', fontSize: '.8rem', color: 'var(--ink-soft)' }}>
            Fill in your cat’s routine once. Print a counter sheet for your sitter or copy instructions straight to text.
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
            onClick={handleCopyText}
            style={{
              padding: '.45rem .85rem',
              borderRadius: '999px',
              border: '1px solid var(--line)',
              background: copied ? 'var(--moss, #2e5a44)' : 'var(--cream)',
              color: copied ? '#fff' : 'var(--ink)',
              fontSize: '.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.3rem',
            }}
          >
            {copied ? '✓ Copied to Clipboard!' : '📋 Copy for Text / WhatsApp'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="button ink"
            style={{
              padding: '.45rem .95rem',
              fontSize: '.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.3rem',
            }}
          >
            🖨️ Print Sitter Sheet
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

      {/* The Printable Sitter Sheet Content */}
      <div className="printable-sheet" style={{ background: '#ffffff', color: '#132227', border: '1px solid var(--line)', borderRadius: '8px', padding: '1.8rem', boxShadow: '0 4px 12px rgba(0,0,0,.03)' }}>
        {/* Printable Sheet Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', borderBottom: '2px solid var(--coral)', paddingBottom: '1.2rem', marginBottom: '1.4rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--coral)',
              background: 'var(--cream)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '2.2rem',
              flexShrink: 0,
            }}
          >
            <AvatarImage src={data.photoUrl} alt={data.catName} fallback="🐱" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#132227' }}>
                {data.catName || 'My Cat'}’s Sitter Guide
              </h2>
              <span style={{ background: 'rgba(243,108,77,.12)', color: 'var(--coral)', padding: '.2rem .6rem', borderRadius: '999px', fontSize: '.75rem', fontWeight: 800 }}>
                Whiskerfield Care Sheet
              </span>
            </div>
            <p style={{ margin: '.25rem 0 0', fontSize: '.85rem', color: '#555' }}>
              {[data.breed, data.age].filter(Boolean).join(' · ') || 'Feline Companion'}
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.4rem' }}>
          {/* Column 1: Daily Routine */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #F36C4D' }}>
              <h4 style={{ margin: '0 0 .5rem', fontSize: '.88rem', color: '#132227', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                🥣 Morning &amp; Evening Food
              </h4>
              <div style={{ marginBottom: '.6rem' }}>
                <label htmlFor="sitter-morning-food" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                  Morning Meal:
                </label>
                <input
                  id="sitter-morning-food"
                  type="text"
                  value={data.morningFood}
                  onChange={(e) => updateField('morningFood', e.target.value)}
                  style={{ width: '100%', padding: '.4rem .6rem', fontSize: '.82rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="sitter-evening-food" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                  Evening Meal:
                </label>
                <input
                  id="sitter-evening-food"
                  type="text"
                  value={data.eveningFood}
                  onChange={(e) => updateField('eveningFood', e.target.value)}
                  style={{ width: '100%', padding: '.4rem .6rem', fontSize: '.82rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #2e5a44' }}>
              <h4 style={{ margin: '0 0 .5rem', fontSize: '.88rem', color: '#132227', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                💧 Fresh Water &amp; Treats
              </h4>
              <div style={{ marginBottom: '.6rem' }}>
                <label htmlFor="sitter-water-routine" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                  Water Routine:
                </label>
                <input
                  id="sitter-water-routine"
                  type="text"
                  value={data.waterRoutine}
                  onChange={(e) => updateField('waterRoutine', e.target.value)}
                  style={{ width: '100%', padding: '.4rem .6rem', fontSize: '.82rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="sitter-treats-info" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                  Approved Treats:
                </label>
                <input
                  id="sitter-treats-info"
                  type="text"
                  value={data.treatsInfo}
                  onChange={(e) => updateField('treatsInfo', e.target.value)}
                  style={{ width: '100%', padding: '.4rem .6rem', fontSize: '.82rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #132227' }}>
              <h4 style={{ margin: '0 0 .5rem', fontSize: '.88rem', color: '#132227', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                📦 Litter Box Routine
              </h4>
              <label htmlFor="sitter-litter-routine" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                Litter Protocol &amp; Disposal:
              </label>
              <textarea
                id="sitter-litter-routine"
                value={data.litterRoutine}
                onChange={(e) => updateField('litterRoutine', e.target.value)}
                rows={2}
                style={{ width: '100%', padding: '.4rem .6rem', fontSize: '.82rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Column 2: Health, Behavior & Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #F36C4D' }}>
              <h4 style={{ margin: '0 0 .5rem', fontSize: '.88rem', color: '#132227', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                🐱 Behavior, Habits &amp; Hiding Spots
              </h4>
              <div style={{ marginBottom: '.6rem' }}>
                <label htmlFor="sitter-quirk" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                  Key Personality &amp; Petting Quirks:
                </label>
                <textarea
                  id="sitter-quirk"
                  value={data.quirk}
                  onChange={(e) => updateField('quirk', e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '.4rem .6rem', fontSize: '.82rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="sitter-hiding-spots" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                  If Scared, Check Here (Hiding Spots):
                </label>
                <input
                  id="sitter-hiding-spots"
                  type="text"
                  value={data.hidingSpots}
                  onChange={(e) => updateField('hidingSpots', e.target.value)}
                  style={{ width: '100%', padding: '.4rem .6rem', fontSize: '.82rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #d95334' }}>
              <h4 style={{ margin: '0 0 .5rem', fontSize: '.88rem', color: '#132227', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                🚨 Emergency Contacts &amp; Vet Clinic
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem', marginBottom: '.5rem' }}>
                <div>
                  <label htmlFor="sitter-owner-phone" style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                    Owner Cell / Text:
                  </label>
                  <input
                    id="sitter-owner-phone"
                    type="text"
                    placeholder="(555) 000-0000"
                    value={data.ownerPhone}
                    onChange={(e) => updateField('ownerPhone', e.target.value)}
                    style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.78rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label htmlFor="sitter-backup-contact" style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                    Local Keyholder / Neighbor:
                  </label>
                  <input
                    id="sitter-backup-contact"
                    type="text"
                    value={data.backupContact}
                    onChange={(e) => updateField('backupContact', e.target.value)}
                    style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.78rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '.5rem' }}>
                <label htmlFor="sitter-vet-name" style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                  Primary Vet Clinic &amp; Phone:
                </label>
                <input
                  id="sitter-vet-name"
                  type="text"
                  value={data.vetName}
                  onChange={(e) => updateField('vetName', e.target.value)}
                  style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.78rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label htmlFor="sitter-emergency-vet" style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                  24/7 Emergency Animal Hospital:
                </label>
                <input
                  id="sitter-emergency-vet"
                  type="text"
                  value={data.emergencyVet}
                  onChange={(e) => updateField('emergencyVet', e.target.value)}
                  style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.78rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ background: '#fff5f2', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(243,108,77,.3)' }}>
              <h4 style={{ margin: '0 0 .3rem', fontSize: '.82rem', color: 'var(--coral)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                ⚠️ House Rules &amp; Critical Notes
              </h4>
              <label htmlFor="sitter-special-notes" style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
                Special Safety Rules:
              </label>
              <textarea
                id="sitter-special-notes"
                value={data.specialNotes}
                onChange={(e) => updateField('specialNotes', e.target.value)}
                rows={2}
                style={{ width: '100%', padding: '.4rem .6rem', fontSize: '.8rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Printable Footer */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.72rem', color: '#888' }}>
          <span>Whiskerfield Pet Parent Network · Prepared with love for {data.catName || 'our cat'}</span>
          <span>whiskerfield.com</span>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-sheet, .printable-sheet * {
            visibility: visible;
          }
          .printable-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            border: none !important;
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
