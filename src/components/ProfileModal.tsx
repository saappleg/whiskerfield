import { useState } from 'react';
import type { Profile } from '../lib/supabase';
import type { Pet } from '../types/community';

const PRESET_AVATARS = [
  { key: 'cat_orange', emoji: '🐱', label: 'Orange Cat' },
  { key: 'cat_calico', emoji: '🐈', label: 'Calico' },
  { key: 'cat_black', emoji: '🐈‍⬛', label: 'Black Cat' },
  { key: 'cat_sleepy', emoji: '🐾', label: 'Paw Print' },
  { key: 'cat_love', emoji: '😻', label: 'Love Cat' },
  { key: 'cat_happy', emoji: '😸', label: 'Happy Cat' },
];

type ProfileModalProps = {
  profile: Profile | null;
  pets: Pet[];
  onClose: () => void;
  onUpdateProfile: (displayName: string, handle: string, bio: string, avatarUrl: string) => Promise<string | null>;
  onCreatePet: (name: string, breed: string, age: string, quirk: string, avatarUrl: string) => Promise<string | null>;
  onDeletePet: (id: number) => Promise<string | null>;
};

export function ProfileModal({
  profile,
  pets,
  onClose,
  onUpdateProfile,
  onCreatePet,
  onDeletePet,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'pets'>('profile');

  // Profile form state
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [handle, setHandle] = useState(profile?.handle || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || 'cat_orange');
  const [customAvatar, setCustomAvatar] = useState('');
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Pet form state
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petQuirk, setPetQuirk] = useState('');
  const [petAvatar, setPetAvatar] = useState('🐱');
  const [petBusy, setPetBusy] = useState(false);
  const [petMsg, setPetMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  async function handleSaveProfile(e: { preventDefault: () => void }) {
    e.preventDefault();
    setProfileBusy(true);
    setProfileMsg(null);

    const chosenAvatar = customAvatar.trim() || avatarUrl;
    const err = await onUpdateProfile(displayName.trim(), handle.trim(), bio.trim(), chosenAvatar);

    if (err) {
      setProfileMsg({ type: 'error', text: err });
    } else {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    }
    setProfileBusy(false);
  }

  async function handleAddPet(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!petName.trim()) {
      setPetMsg({ type: 'error', text: 'Please enter your cat’s name.' });
      return;
    }
    setPetBusy(true);
    setPetMsg(null);

    const err = await onCreatePet(petName.trim(), petBreed.trim(), petAge.trim(), petQuirk.trim(), petAvatar);

    if (err) {
      setPetMsg({ type: 'error', text: err });
    } else {
      setPetMsg({ type: 'success', text: `Added ${petName} to your cats!` });
      setPetName('');
      setPetBreed('');
      setPetAge('');
      setPetQuirk('');
    }
    setPetBusy(false);
  }

  return (
    <dialog className="dialog-overlay" open aria-labelledby="profile-dialog-title">
      <div className="dialog-card" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Close profile modal">
          ×
        </button>

        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--line)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              border: 0,
              background: 'transparent',
              padding: '.75rem 0',
              fontSize: '.9rem',
              fontWeight: 800,
              color: activeTab === 'profile' ? 'var(--coral)' : 'var(--ink-soft)',
              borderBottom: activeTab === 'profile' ? '2px solid var(--coral)' : 'none',
              cursor: 'pointer',
            }}
          >
            👤 My Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pets')}
            style={{
              border: 0,
              background: 'transparent',
              padding: '.75rem 0',
              fontSize: '.9rem',
              fontWeight: 800,
              color: activeTab === 'pets' ? 'var(--coral)' : 'var(--ink-soft)',
              borderBottom: activeTab === 'pets' ? '2px solid var(--coral)' : 'none',
              cursor: 'pointer',
            }}
          >
            🐾 My Cats ({pets.length})
          </button>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleSaveProfile}>
            <h2 id="profile-dialog-title" style={{ fontSize: '1.4rem', margin: '0 0 .5rem' }}>
              Edit Profile
            </h2>
            <p style={{ fontSize: '.82rem', color: 'var(--ink-soft)', marginBottom: '1.2rem' }}>
              Personalize how you appear to fellow members in the Cat Club.
            </p>

            <div style={{ marginBottom: '1.2rem' }}>
              <label htmlFor="profile-avatar-custom" style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, marginBottom: '.5rem' }}>
                Choose an Avatar
              </label>
              <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginBottom: '.6rem' }}>
                {PRESET_AVATARS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(a.key);
                      setCustomAvatar('');
                    }}
                    style={{
                      border: avatarUrl === a.key && !customAvatar ? '2px solid var(--coral)' : '1px solid var(--line)',
                      background: avatarUrl === a.key && !customAvatar ? 'rgba(243,108,77,.1)' : 'var(--cream)',
                      borderRadius: '50%',
                      width: '42px',
                      height: '42px',
                      fontSize: '1.4rem',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                    title={a.label}
                  >
                    {a.emoji}
                  </button>
                ))}
              </div>
              <input
                id="profile-avatar-custom"
                type="url"
                placeholder="Or paste an image URL (https://…)"
                value={customAvatar}
                onChange={(e) => setCustomAvatar(e.target.value)}
                style={{
                  width: '100%',
                  padding: '.55rem .75rem',
                  fontSize: '.8rem',
                  border: '1px solid var(--line)',
                  background: 'var(--cream)',
                  color: 'var(--ink)',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="profile-display-name" style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, marginBottom: '.3rem' }}>
                Display Name
              </label>
              <input
                id="profile-display-name"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={40}
                style={{
                  width: '100%',
                  padding: '.6rem .75rem',
                  fontSize: '.85rem',
                  border: '1px solid var(--line)',
                  background: 'var(--cream)',
                  color: 'var(--ink)',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="profile-handle" style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, marginBottom: '.3rem' }}>
                Handle (@username)
              </label>
              <input
                id="profile-handle"
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                maxLength={24}
                style={{
                  width: '100%',
                  padding: '.6rem .75rem',
                  fontSize: '.85rem',
                  border: '1px solid var(--line)',
                  background: 'var(--cream)',
                  color: 'var(--ink)',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label htmlFor="profile-bio" style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, marginBottom: '.3rem' }}>
                Bio
              </label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the club about you and your cats…"
                maxLength={300}
                rows={3}
                style={{
                  width: '100%',
                  padding: '.6rem .75rem',
                  fontSize: '.85rem',
                  border: '1px solid var(--line)',
                  background: 'var(--cream)',
                  color: 'var(--ink)',
                }}
              />
              <span style={{ fontSize: '.7rem', color: 'var(--ink-soft)' }}>{bio.length}/300</span>
            </div>

            {profileMsg && (
              <p
                className="form-error"
                style={{ color: profileMsg.type === 'success' ? '#16a34a' : undefined, margin: '0 0 1rem' }}
              >
                {profileMsg.text}
              </p>
            )}

            <button type="submit" className="button ink" disabled={profileBusy} style={{ width: '100%' }}>
              {profileBusy ? 'Saving…' : 'Save Profile →'}
            </button>
          </form>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 .5rem' }}>Your Cats</h2>
            <p style={{ fontSize: '.82rem', color: 'var(--ink-soft)', marginBottom: '1.2rem' }}>
              Add your cats so you can tag them in community notes and share their stories.
            </p>

            {pets.length > 0 && (
              <div style={{ display: 'grid', gap: '.8rem', marginBottom: '1.5rem' }}>
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '.8rem',
                      padding: '.8rem 1rem',
                      background: 'var(--paper)',
                      border: '1px solid var(--line)',
                      borderLeft: '4px solid var(--coral)',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{pet.avatar_url || '🐱'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b style={{ fontSize: '.88rem', display: 'block', color: 'var(--ink)' }}>{pet.name}</b>
                      <span style={{ fontSize: '.74rem', color: 'var(--ink-soft)' }}>
                        {[pet.breed, pet.age].filter(Boolean).join(' · ')}
                      </span>
                      {pet.quirk && (
                        <p style={{ margin: '.2rem 0 0', fontSize: '.75rem', fontStyle: 'italic', color: 'var(--ink)' }}>
                          “{pet.quirk}”
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => void onDeletePet(pet.id)}
                      style={{
                        border: 0,
                        background: 'transparent',
                        color: 'var(--coral)',
                        fontSize: '.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={handleAddPet}
              style={{
                padding: '1.2rem',
                background: 'var(--mint)',
                border: '1px solid var(--line)',
              }}
            >
              <b style={{ display: 'block', fontSize: '.9rem', marginBottom: '.8rem', color: 'var(--ink)' }}>
                Add a New Cat 🐾
              </b>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginBottom: '.8rem' }}>
                <div>
                  <label htmlFor="pet-name" style={{ display: 'block', fontSize: '.74rem', fontWeight: 800, marginBottom: '.2rem' }}>
                    Cat Name *
                  </label>
                  <input
                    id="pet-name"
                    type="text"
                    required
                    placeholder="e.g. Miso"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    maxLength={50}
                    style={{ width: '100%', padding: '.5rem', fontSize: '.8rem', border: '1px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)' }}
                  />
                </div>
                <div>
                  <label htmlFor="pet-breed" style={{ display: 'block', fontSize: '.74rem', fontWeight: 800, marginBottom: '.2rem' }}>
                    Breed or Coat
                  </label>
                  <input
                    id="pet-breed"
                    type="text"
                    placeholder="e.g. Orange Tabby"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    maxLength={80}
                    style={{ width: '100%', padding: '.5rem', fontSize: '.8rem', border: '1px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginBottom: '.8rem' }}>
                <div>
                  <label htmlFor="pet-age" style={{ display: 'block', fontSize: '.74rem', fontWeight: 800, marginBottom: '.2rem' }}>
                    Age
                  </label>
                  <input
                    id="pet-age"
                    type="text"
                    placeholder="e.g. 3 years old"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    maxLength={50}
                    style={{ width: '100%', padding: '.5rem', fontSize: '.8rem', border: '1px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)' }}
                  />
                </div>
                <div>
                  <label htmlFor="pet-avatar" style={{ display: 'block', fontSize: '.74rem', fontWeight: 800, marginBottom: '.2rem' }}>
                    Avatar Emoji
                  </label>
                  <select
                    id="pet-avatar"
                    value={petAvatar}
                    onChange={(e) => setPetAvatar(e.target.value)}
                    style={{ width: '100%', padding: '.5rem', fontSize: '.8rem', border: '1px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)' }}
                  >
                    <option value="🐱">🐱 Tabby</option>
                    <option value="🐈">🐈 Calico</option>
                    <option value="🐈‍⬛">🐈‍⬛ Black Cat</option>
                    <option value="🦁">🦁 Fluffy / Orange</option>
                    <option value="🐾">🐾 Paws</option>
                    <option value="😸">😸 Grinning</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '.8rem' }}>
                <label htmlFor="pet-quirk" style={{ display: 'block', fontSize: '.74rem', fontWeight: 800, marginBottom: '.2rem' }}>
                  Notable Quirk or Habit
                </label>
                <input
                  id="pet-quirk"
                  type="text"
                  placeholder="e.g. Must supervise the dishwasher at all times"
                  value={petQuirk}
                  onChange={(e) => setPetQuirk(e.target.value)}
                  maxLength={200}
                  style={{ width: '100%', padding: '.5rem', fontSize: '.8rem', border: '1px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)' }}
                />
              </div>

              {petMsg && (
                <p
                  className="form-error"
                  style={{ color: petMsg.type === 'success' ? '#16a34a' : undefined, margin: '0 0 .8rem' }}
                >
                  {petMsg.text}
                </p>
              )}

              <button type="submit" className="button ink" disabled={petBusy} style={{ width: '100%' }}>
                {petBusy ? 'Adding cat…' : 'Add Cat to Profile 🐾'}
              </button>
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
}
