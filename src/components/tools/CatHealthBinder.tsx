import { useState } from 'react';
import type { Pet } from '../../types/community';
import { AvatarImage } from '../AvatarImage';

type CatHealthBinderProps = {
  pet?: Pet | null;
  pets?: Pet[];
  onSelectPet?: (pet: Pet) => void;
  onClose?: () => void;
};

type WeightEntry = {
  id: string;
  date: string;
  weightLbs: number;
  note?: string;
};

type VaccineEntry = {
  id: string;
  vaccine: string;
  dateGiven: string;
  nextDue: string;
  clinic?: string;
};

type HealthBinderData = {
  catName: string;
  microchipNumber: string;
  microchipRegistry: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  primaryVetClinic: string;
  primaryVetPhone: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
  weights: WeightEntry[];
  vaccines: VaccineEntry[];
};

export function CatHealthBinder({ pet, pets = [], onSelectPet, onClose }: CatHealthBinderProps) {
  const [selectedPetId, setSelectedPetId] = useState<number | undefined>(pet?.id);
  const initialPet = pet || (pets.length > 0 ? pets[0] : null);

  const [data, setData] = useState<HealthBinderData>(() => {
    const saved = localStorage.getItem(`wf_health_binder_${initialPet?.id || 'default'}`);
    if (saved) {
      try {
        return JSON.parse(saved) as HealthBinderData;
      } catch {
        // fallback
      }
    }
    return {
      catName: initialPet?.name || '',
      microchipNumber: '985141002348912',
      microchipRegistry: 'HomeAgain (homeagain.com)',
      insuranceProvider: 'Trupanion',
      insurancePolicyNumber: 'TRU-8921-CAT',
      primaryVetClinic: 'Whiskerfield Veterinary Wellness',
      primaryVetPhone: '(555) 345-6789',
      bloodType: 'Type A',
      allergies: 'Chicken protein sensitivity (prefers rabbit & duck)',
      chronicConditions: 'Mild seasonal asthma in spring',
      weights: [
        { id: '1', date: '2026-03-15', weightLbs: 9.8, note: 'Annual wellness check' },
        { id: '2', date: '2026-06-20', weightLbs: 10.1, note: 'Summer check-in' },
        { id: '3', date: '2026-09-01', weightLbs: 10.0, note: 'Routine weighing' },
      ],
      vaccines: [
        { id: '1', vaccine: 'Rabies (1-Year PureVax)', dateGiven: '2025-10-12', nextDue: '2026-10-12', clinic: 'Whiskerfield Vet' },
        { id: '2', vaccine: 'FVRCP (Feline Distemper / Upper Resp)', dateGiven: '2024-04-18', nextDue: '2027-04-18', clinic: 'Whiskerfield Vet' },
        { id: '3', vaccine: 'FeLV (Feline Leukemia)', dateGiven: '2025-05-10', nextDue: '2026-05-10', clinic: 'Whiskerfield Vet' },
      ],
    };
  });

  // State for adding new entries
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newWeightNote, setNewWeightNote] = useState('');

  const [newVacName, setNewVacName] = useState('');
  const [newVacGiven, setNewVacGiven] = useState(() => new Date().toISOString().slice(0, 10));
  const [newVacDue, setNewVacDue] = useState('');

  const [prevPetId, setPrevPetId] = useState(pet?.id);

  if (pet && pet.id !== prevPetId) {
    setPrevPetId(pet.id);
    setSelectedPetId(pet.id);
    const saved = localStorage.getItem(`wf_health_binder_${pet.id}`);
    if (saved) {
      try {
        setData(JSON.parse(saved) as HealthBinderData);
      } catch {
        // ignore
      }
    } else {
      setData((prev) => ({
        ...prev,
        catName: pet.name,
      }));
    }
  }

  function handlePetChange(pId: number) {
    setSelectedPetId(pId);
    const chosen = pets.find((p) => p.id === pId);
    if (chosen) {
      if (onSelectPet) onSelectPet(chosen);
      const saved = localStorage.getItem(`wf_health_binder_${chosen.id}`);
      if (saved) {
        try {
          setData(JSON.parse(saved) as HealthBinderData);
          return;
        } catch {
          // ignore
        }
      }
      setData((prev) => ({
        ...prev,
        catName: chosen.name,
      }));
    }
  }

  function updateField<K extends keyof HealthBinderData>(key: K, value: HealthBinderData[K]) {
    setData((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(`wf_health_binder_${selectedPetId || 'default'}`, JSON.stringify(updated));
      return updated;
    });
  }

  function handleAddWeight(e: { preventDefault: () => void }) {
    e.preventDefault();
    const w = parseFloat(newWeight);
    if (isNaN(w) || w <= 0) return;

    const entry: WeightEntry = {
      id: Date.now().toString(),
      date: newWeightDate,
      weightLbs: Math.round(w * 10) / 10,
      note: newWeightNote.trim() || undefined,
    };

    setData((prev) => {
      const updatedWeights = [...prev.weights, entry].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const updated = { ...prev, weights: updatedWeights };
      localStorage.setItem(`wf_health_binder_${selectedPetId || 'default'}`, JSON.stringify(updated));
      return updated;
    });

    setNewWeight('');
    setNewWeightNote('');
  }

  function handleDeleteWeight(id: string) {
    setData((prev) => {
      const updated = { ...prev, weights: prev.weights.filter((w) => w.id !== id) };
      localStorage.setItem(`wf_health_binder_${selectedPetId || 'default'}`, JSON.stringify(updated));
      return updated;
    });
  }

  function handleAddVaccine(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!newVacName.trim()) return;

    const entry: VaccineEntry = {
      id: Date.now().toString(),
      vaccine: newVacName.trim(),
      dateGiven: newVacGiven,
      nextDue: newVacDue || 'TBD',
    };

    setData((prev) => {
      const updated = { ...prev, vaccines: [entry, ...prev.vaccines] };
      localStorage.setItem(`wf_health_binder_${selectedPetId || 'default'}`, JSON.stringify(updated));
      return updated;
    });

    setNewVacName('');
    setNewVacDue('');
  }

  function handleDeleteVaccine(id: string) {
    setData((prev) => {
      const updated = { ...prev, vaccines: prev.vaccines.filter((v) => v.id !== id) };
      localStorage.setItem(`wf_health_binder_${selectedPetId || 'default'}`, JSON.stringify(updated));
      return updated;
    });
  }

  const latestWeight = data.weights[0]?.weightLbs;
  const previousWeight = data.weights[1]?.weightLbs;
  const weightDiff = latestWeight && previousWeight ? Math.round((latestWeight - previousWeight) * 10) / 10 : null;

  return (
    <div className="cat-health-binder-container" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.5rem' }}>
      {/* Controls header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--coral)' }}>
            🩺 Medical &amp; Vet Records
          </span>
          <h3 style={{ margin: '.2rem 0 0', fontSize: '1.4rem' }}>Cat Passport &amp; Health Binder</h3>
          <p style={{ margin: '.2rem 0 0', fontSize: '.8rem', color: 'var(--ink-soft)' }}>
            Keep critical vaccine dates, microchip IDs, weight trends, and allergies in one clean, secure place.
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
            onClick={() => window.print()}
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
            🖨️ Print Medical Binder
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

      {/* Printable Sheet */}
      <div className="printable-sheet" style={{ background: '#ffffff', color: '#132227', border: '1px solid var(--line)', borderRadius: '8px', padding: '1.8rem', boxShadow: '0 4px 12px rgba(0,0,0,.03)' }}>
        {/* Header summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', borderBottom: '2px solid #2e5a44', paddingBottom: '1.2rem', marginBottom: '1.4rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #2e5a44',
              background: 'var(--cream)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '2.2rem',
              flexShrink: 0,
            }}
          >
            <AvatarImage src={pet?.avatar_url} alt={data.catName} fallback="🐱" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#132227' }}>
                {data.catName || 'My Cat'}’s Health Passport
              </h2>
              <span style={{ background: 'rgba(46,90,68,.12)', color: '#2e5a44', padding: '.2rem .6rem', borderRadius: '999px', fontSize: '.75rem', fontWeight: 800 }}>
                Verified Records
              </span>
            </div>
            <p style={{ margin: '.25rem 0 0', fontSize: '.85rem', color: '#555' }}>
              {[pet?.breed, pet?.age].filter(Boolean).join(' · ') || 'Feline Patient'}
            </p>
          </div>

          {latestWeight && (
            <div style={{ textAlign: 'right', background: 'var(--cream)', padding: '.6rem 1rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '.68rem', fontWeight: 700, color: '#777', textTransform: 'uppercase', display: 'block' }}>Current Weight</span>
              <b style={{ fontSize: '1.3rem', color: '#132227' }}>{latestWeight} lbs</b>
              {weightDiff !== null && (
                <span style={{ display: 'block', fontSize: '.72rem', color: weightDiff > 0 ? '#d97706' : (weightDiff < 0 ? '#2563eb' : '#16a34a') }}>
                  {weightDiff > 0 ? `+${weightDiff} lbs` : (weightDiff < 0 ? `${weightDiff} lbs` : 'Stable')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Identification & Insurance Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.6rem', background: 'var(--cream)', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
          <div>
            <label htmlFor="binder-microchip-number" style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
              🏷️ Microchip ID Number:
            </label>
            <input
              id="binder-microchip-number"
              type="text"
              value={data.microchipNumber}
              onChange={(e) => updateField('microchipNumber', e.target.value)}
              style={{ width: '100%', padding: '.4rem .5rem', fontSize: '.8rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label htmlFor="binder-microchip-registry" style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
              🌐 Microchip Registry:
            </label>
            <input
              id="binder-microchip-registry"
              type="text"
              value={data.microchipRegistry}
              onChange={(e) => updateField('microchipRegistry', e.target.value)}
              style={{ width: '100%', padding: '.4rem .5rem', fontSize: '.8rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label htmlFor="binder-insurance-policy" style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
              🛡️ Pet Insurance &amp; Policy:
            </label>
            <input
              id="binder-insurance-policy"
              type="text"
              value={data.insuranceProvider ? `${data.insuranceProvider} · ${data.insurancePolicyNumber}` : ''}
              placeholder="e.g. Trupanion #TRU-1234"
              onChange={(e) => {
                const val = e.target.value;
                const parts = val.split('·').map((s) => s.trim());
                updateField('insuranceProvider', parts[0] || '');
                if (parts[1]) updateField('insurancePolicyNumber', parts[1]);
              }}
              style={{ width: '100%', padding: '.4rem .5rem', fontSize: '.8rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label htmlFor="binder-vet-clinic" style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.2rem' }}>
              🏥 Primary Vet Clinic &amp; Phone:
            </label>
            <input
              id="binder-vet-clinic"
              type="text"
              value={data.primaryVetClinic}
              onChange={(e) => updateField('primaryVetClinic', e.target.value)}
              style={{ width: '100%', padding: '.4rem .5rem', fontSize: '.8rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Critical Alerts & Sensitivities */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.6rem' }}>
          <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
            <label htmlFor="binder-allergies" style={{ display: 'block', margin: '0 0 .4rem', fontSize: '.82rem', fontWeight: 700, color: '#b91c1c' }}>
              ⚠️ Allergies &amp; Food Sensitivities
            </label>
            <textarea
              id="binder-allergies"
              value={data.allergies}
              onChange={(e) => updateField('allergies', e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.8rem', border: '1px solid #f87171', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a' }}>
            <label htmlFor="binder-conditions" style={{ display: 'block', margin: '0 0 .4rem', fontSize: '.82rem', fontWeight: 700, color: '#b45309' }}>
              🩺 Chronic Conditions &amp; Notes
            </label>
            <textarea
              id="binder-conditions"
              value={data.chronicConditions}
              onChange={(e) => updateField('chronicConditions', e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '.35rem .5rem', fontSize: '.8rem', border: '1px solid #fcd34d', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* 2-Column Split: Vaccines & Weight Tracker */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Vaccines Card */}
          <div style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '1.2rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
              <h4 style={{ margin: 0, fontSize: '.95rem', color: '#132227' }}>
                💉 Vaccination History &amp; Due Dates
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1rem' }}>
              {data.vaccines.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '.6rem .8rem',
                    background: 'var(--cream)',
                    borderRadius: '6px',
                    border: '1px solid var(--line)',
                    fontSize: '.8rem',
                  }}
                >
                  <div>
                    <b style={{ color: '#132227', display: 'block' }}>{v.vaccine}</b>
                    <span style={{ fontSize: '.72rem', color: '#666' }}>
                      Given: {v.dateGiven} · <strong>Due: {v.nextDue}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="no-print"
                    onClick={() => handleDeleteVaccine(v.id)}
                    style={{ border: 0, background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '.75rem' }}
                    title="Delete record"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Vaccine Form */}
            <form onSubmit={handleAddVaccine} className="no-print" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr auto', gap: '.4rem', alignItems: 'center', background: 'var(--cream)', padding: '.6rem', borderRadius: '6px' }}>
              <input
                type="text"
                placeholder="Vaccine name"
                aria-label="Vaccine name"
                value={newVacName}
                onChange={(e) => setNewVacName(e.target.value)}
                style={{ padding: '.35rem .5rem', fontSize: '.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <input
                type="date"
                aria-label="Date given"
                value={newVacGiven}
                onChange={(e) => setNewVacGiven(e.target.value)}
                style={{ padding: '.35rem .5rem', fontSize: '.72rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <input
                type="date"
                placeholder="Next due"
                aria-label="Next due date"
                value={newVacDue}
                onChange={(e) => setNewVacDue(e.target.value)}
                style={{ padding: '.35rem .5rem', fontSize: '.72rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button
                type="submit"
                disabled={!newVacName.trim()}
                style={{ padding: '.35rem .65rem', background: '#2e5a44', color: '#fff', border: 0, borderRadius: '4px', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                + Add
              </button>
            </form>
          </div>

          {/* Weight Log Card */}
          <div style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '1.2rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
              <h4 style={{ margin: 0, fontSize: '.95rem', color: '#132227' }}>
                ⚖️ Weight Log &amp; Monitoring
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1rem' }}>
              {data.weights.map((w, idx) => {
                const prev = data.weights[idx + 1];
                const diff = prev ? Math.round((w.weightLbs - prev.weightLbs) * 10) / 10 : null;
                return (
                  <div
                    key={w.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '.6rem .8rem',
                      background: 'var(--cream)',
                      borderRadius: '6px',
                      border: '1px solid var(--line)',
                      fontSize: '.8rem',
                    }}
                  >
                    <div>
                      <b style={{ color: '#132227' }}>{w.weightLbs} lbs</b>
                      {diff !== null && (
                        <span style={{ marginLeft: '.5rem', fontSize: '.72rem', color: diff > 0 ? '#d97706' : (diff < 0 ? '#2563eb' : '#16a34a') }}>
                          ({diff > 0 ? `+${diff}` : diff} lbs)
                        </span>
                      )}
                      <span style={{ display: 'block', fontSize: '.72rem', color: '#666' }}>
                        {w.date} {w.note ? `· ${w.note}` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="no-print"
                      onClick={() => handleDeleteWeight(w.id)}
                      style={{ border: 0, background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '.75rem' }}
                      title="Delete entry"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Weight Form */}
            <form onSubmit={handleAddWeight} className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.5fr auto', gap: '.4rem', alignItems: 'center', background: 'var(--cream)', padding: '.6rem', borderRadius: '6px' }}>
              <input
                type="number"
                step="0.1"
                placeholder="lbs (e.g. 10.2)"
                aria-label="Weight in pounds"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                style={{ padding: '.35rem .5rem', fontSize: '.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <input
                type="date"
                aria-label="Date weighed"
                value={newWeightDate}
                onChange={(e) => setNewWeightDate(e.target.value)}
                style={{ padding: '.35rem .5rem', fontSize: '.72rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="Note (optional)"
                aria-label="Weight note"
                value={newWeightNote}
                onChange={(e) => setNewWeightNote(e.target.value)}
                style={{ padding: '.35rem .5rem', fontSize: '.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button
                type="submit"
                disabled={!newWeight}
                style={{ padding: '.35rem .65rem', background: '#2e5a44', color: '#fff', border: 0, borderRadius: '4px', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                + Log
              </button>
            </form>
          </div>
        </div>

        {/* Printable Footer */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.72rem', color: '#888' }}>
          <span>Whiskerfield Medical Passport · Retain with official rabies tags &amp; records</span>
          <span>whiskerfield.com</span>
        </div>
      </div>
    </div>
  );
}
