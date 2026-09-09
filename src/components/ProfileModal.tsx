import { useState } from 'react';
import { isImageAvatar } from '../lib/avatar';
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

const PET_PRESET_EMOJIS = [
  { emoji: '🐱', label: 'Tabby' },
  { emoji: '🐈', label: 'Calico' },
  { emoji: '🐈‍⬛', label: 'Black Cat' },
  { emoji: '🦁', label: 'Fluffy / Orange' },
  { emoji: '🐾', label: 'Paw Print' },
  { emoji: '😸', label: 'Grinning' },
  { emoji: '😻', label: 'Heart Eyes' },
  { emoji: '😺', label: 'Happy Cat' },
];

type ProfileModalProps = {
  profile: Profile | null;
  pets: Pet[];
  onClose: () => void;
  onUpdateProfile: (displayName: string, handle: string, bio: string, avatarUrl: string) => Promise<string | null>;
  onCreatePet: (name: string, breed: string, age: string, quirk: string, avatarUrl: string) => Promise<string | null>;
  onUpdatePet?: (id: number, name: string, breed: string, age: string, quirk: string, avatarUrl: string) => Promise<string | null>;
  onDeletePet: (id: number) => Promise<string | null>;
};

export function ProfileModal({
  profile,
  pets,
  onClose,
  onUpdateProfile,
  onCreatePet,
  onUpdatePet,
  onDeletePet,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'pets'>('profile');

  // Profile form state
  const initialIsImage = Boolean(isImageAvatar(profile?.avatar_url));
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [handle, setHandle] = useState(profile?.handle || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(initialIsImage ? '' : (profile?.avatar_url || 'cat_orange'));
  const [customAvatar, setCustomAvatar] = useState(initialIsImage ? (profile?.avatar_url || '') : '');
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Pet form state
  const [editingPetId, setEditingPetId] = useState<number | null>(null);
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petQuirk, setPetQuirk] = useState('');
  const [petAvatarEmoji, setPetAvatarEmoji] = useState('🐱');
  const [petPhotoUrl, setPetPhotoUrl] = useState('');
  const [petBusy, setPetBusy] = useState(false);
  const [petMsg, setPetMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Handlers for profile avatar upload
  function handleProfilePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setProfileMsg({ type: 'error', text: 'Profile photo is too large. Please select an image under 3MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      setCustomAvatar(dataUrl);
      setAvatarUrl('');
    };
    reader.readAsDataURL(file);
  }

  // Handlers for pet photo upload
  function handlePetPhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setPetMsg({ type: 'error', text: 'Cat photo is too large. Please select an image under 3MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      setPetPhotoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function startEditPet(pet: Pet) {
    setEditingPetId(pet.id);
    setPetName(pet.name);
    setPetBreed(pet.breed || '');
    setPetAge(pet.age || '');
    setPetQuirk(pet.quirk || '');
    if (isImageAvatar(pet.avatar_url)) {
      setPetPhotoUrl(pet.avatar_url || '');
      setPetAvatarEmoji('🐱');
    } else {
      setPetPhotoUrl('');
      setPetAvatarEmoji(pet.avatar_url || '🐱');
    }
    setPetMsg(null);
  }

  function cancelEditPet() {
    setEditingPetId(null);
    setPetName('');
    setPetBreed('');
    setPetAge('');
    setPetQuirk('');
    setPetAvatarEmoji('🐱');
    setPetPhotoUrl('');
    setPetMsg(null);
  }

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

  async function handleSavePet(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!petName.trim()) {
      setPetMsg({ type: 'error', text: 'Please enter your cat’s name.' });
      return;
    }
    setPetBusy(true);
    setPetMsg(null);

    const finalAvatar = petPhotoUrl.trim() || petAvatarEmoji || '🐱';

    if (editingPetId && onUpdatePet) {
      const err = await onUpdatePet(editingPetId, petName.trim(), petBreed.trim(), petAge.trim(), petQuirk.trim(), finalAvatar);
      if (err) {
        setPetMsg({ type: 'error', text: err });
      } else {
        setPetMsg({ type: 'success', text: `Updated ${petName}’s profile!` });
        cancelEditPet();
      }
    } else {
      const err = await onCreatePet(petName.trim(), petBreed.trim(), petAge.trim(), petQuirk.trim(), finalAvatar);
      if (err) {
        setPetMsg({ type: 'error', text: err });
      } else {
        setPetMsg({ type: 'success', text: `Added ${petName} to your cats!` });
        cancelEditPet();
      }
    }
    setPetBusy(false);
  }

  const currentProfileAvatarSrc = customAvatar.trim() || avatarUrl;

  return (
    <dialog className="dialog-overlay" open aria-labelledby="profile-dialog-title">
      <div className="dialog-card" style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
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
              Personalize your member avatar, handle, and bio across the Cat Club.
            </p>

            {/* Profile Avatar & Photo Upload Section */}
            <div style={{ marginBottom: '1.4rem', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '8px', padding: '1rem' }}>
              <span style={{ display: 'block', fontSize: '.8rem', fontWeight: 800, marginBottom: '.6rem', color: 'var(--ink)' }}>
                Profile Picture &amp; Avatar
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.8rem' }}>
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
                    fontSize: '2rem',
                    flexShrink: 0,
                  }}
                >
                  {isImageAvatar(currentProfileAvatarSrc) ? (
                    /* oxlint-disable-next-line next/no-img-element */
                    <img
                      src={currentProfileAvatarSrc}
                      alt="Profile preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    PRESET_AVATARS.find((a) => a.key === avatarUrl)?.emoji || avatarUrl || '🐱'
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                  <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label
                      style={{
                        cursor: 'pointer',
                        padding: '.4rem .8rem',
                        fontSize: '.75rem',
                        borderRadius: '999px',
                        background: 'var(--coral)',
                        color: '#fff',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '.3rem',
                      }}
                    >
                      📷 Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoSelect}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {(customAvatar || isImageAvatar(avatarUrl)) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomAvatar('');
                          setAvatarUrl('cat_orange');
                        }}
                        style={{
                          border: '1px solid var(--line)',
                          background: 'transparent',
                          borderRadius: '999px',
                          padding: '.35rem .7rem',
                          fontSize: '.72rem',
                          fontWeight: 700,
                          color: 'var(--coral)',
                          cursor: 'pointer',
                        }}
                      >
                        Reset to preset emoji
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: '.72rem', color: 'var(--ink-soft)' }}>
                    Upload from your device (JPG, PNG, WebP &lt; 3MB)
                  </span>
                </div>
              </div>

              {/* URL fallback */}
              <div style={{ marginBottom: '.8rem' }}>
                <input
                  id="profile-avatar-custom"
                  type="url"
                  placeholder="Or paste an image URL (https://…)"
                  value={customAvatar.startsWith('data:') ? '' : customAvatar}
                  onChange={(e) => {
                    setCustomAvatar(e.target.value);
                    if (e.target.value) setAvatarUrl('');
                  }}
                  style={{
                    width: '100%',
                    padding: '.5rem .75rem',
                    fontSize: '.8rem',
                    border: '1px solid var(--line)',
                    background: 'var(--cream)',
                    color: 'var(--ink)',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Preset Emoji Avatars */}
              <div>
                <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: '.35rem' }}>
                  Or choose a club emoji:
                </span>
                <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
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
                        width: '38px',
                        height: '38px',
                        fontSize: '1.25rem',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: 'pointer',
                      }}
                      title={a.label}
                    >
                      {a.emoji}
                    </button>
                  ))}
                </div>
              </div>
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
                  boxSizing: 'border-box',
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
                  boxSizing: 'border-box',
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
                  boxSizing: 'border-box',
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
              Add your cats with their photo and quirks so you can tag them in notes and showcase them in the club.
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
                      background: editingPetId === pet.id ? 'rgba(243,108,77,.08)' : 'var(--paper)',
                      border: editingPetId === pet.id ? '2px solid var(--coral)' : '1px solid var(--line)',
                      borderLeft: '4px solid var(--coral)',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1px solid var(--line)',
                        background: 'var(--cream)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '1.7rem',
                        flexShrink: 0,
                      }}
                    >
                      {isImageAvatar(pet.avatar_url) ? (
                        /* oxlint-disable-next-line next/no-img-element */
                        <img
                          src={pet.avatar_url || ''}
                          alt={pet.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        pet.avatar_url || '🐱'
                      )}
                    </div>

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

                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <button
                        type="button"
                        onClick={() => startEditPet(pet)}
                        style={{
                          border: '1px solid var(--line)',
                          background: 'var(--cream)',
                          color: 'var(--ink)',
                          fontSize: '.72rem',
                          fontWeight: 700,
                          padding: '.3rem .6rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDeletePet(pet.id)}
                        style={{
                          border: 0,
                          background: 'transparent',
                          color: 'var(--coral)',
                          fontSize: '.72rem',
                          fontWeight: 800,
                          padding: '.3rem .4rem',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSavePet}
              style={{
                padding: '1.2rem',
                background: editingPetId ? 'var(--cream)' : 'var(--mint)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
                <b style={{ fontSize: '.92rem', color: 'var(--ink)' }}>
                  {editingPetId ? `Edit ${petName || 'Cat'}’s Profile 🐾` : 'Add a New Cat 🐾'}
                </b>
                {editingPetId && (
                  <button
                    type="button"
                    onClick={cancelEditPet}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--coral)',
                      fontSize: '.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {/* Cat Photo / Avatar Selector */}
              <div style={{ marginBottom: '1rem', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '8px', padding: '.8rem' }}>
                <span style={{ display: 'block', fontSize: '.74rem', fontWeight: 800, marginBottom: '.5rem', color: 'var(--ink)' }}>
                  Cat Profile Picture
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem', marginBottom: '.7rem' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--coral)',
                      background: 'var(--cream)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '1.8rem',
                      flexShrink: 0,
                    }}
                  >
                    {isImageAvatar(petPhotoUrl) ? (
                      /* oxlint-disable-next-line next/no-img-element */
                      <img
                        src={petPhotoUrl}
                        alt="Cat preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      petAvatarEmoji || '🐱'
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
                    <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <label
                        style={{
                          cursor: 'pointer',
                          padding: '.35rem .75rem',
                          fontSize: '.75rem',
                          borderRadius: '999px',
                          background: 'var(--moss, #2e5a44)',
                          color: '#fff',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '.3rem',
                        }}
                      >
                        📷 Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePetPhotoSelect}
                          style={{ display: 'none' }}
                        />
                      </label>

                      {petPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => setPetPhotoUrl('')}
                          style={{
                            border: '1px solid var(--line)',
                            background: 'transparent',
                            borderRadius: '999px',
                            padding: '.3rem .65rem',
                            fontSize: '.72rem',
                            fontWeight: 700,
                            color: 'var(--coral)',
                            cursor: 'pointer',
                          }}
                        >
                          ✕ Remove photo
                        </button>
                      )}
                    </div>
                    <span style={{ fontSize: '.7rem', color: 'var(--ink-soft)' }}>
                      Attach a real photo of your cat (under 3MB)
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '.6rem' }}>
                  <input
                    type="url"
                    placeholder="Or paste cat photo URL (https://…)"
                    value={petPhotoUrl.startsWith('data:') ? '' : petPhotoUrl}
                    onChange={(e) => setPetPhotoUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '.45rem .65rem',
                      fontSize: '.78rem',
                      border: '1px solid var(--line)',
                      background: 'var(--cream)',
                      color: 'var(--ink)',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: '.3rem' }}>
                    Or pick an emoji character:
                  </span>
                  <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                    {PET_PRESET_EMOJIS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setPetAvatarEmoji(p.emoji);
                          setPetPhotoUrl('');
                        }}
                        style={{
                          border: petAvatarEmoji === p.emoji && !petPhotoUrl ? '2px solid var(--coral)' : '1px solid var(--line)',
                          background: petAvatarEmoji === p.emoji && !petPhotoUrl ? 'rgba(243,108,77,.1)' : 'var(--cream)',
                          borderRadius: '50%',
                          width: '34px',
                          height: '34px',
                          fontSize: '1.2rem',
                          display: 'grid',
                          placeItems: 'center',
                          cursor: 'pointer',
                        }}
                        title={p.label}
                      >
                        {p.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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
                    style={{ width: '100%', padding: '.5rem', fontSize: '.8rem', border: '1px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)', boxSizing: 'border-box' }}
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
                    style={{ width: '100%', padding: '.5rem', fontSize: '.8rem', border: '1px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '.8rem', marginBottom: '.8rem' }}>
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
                    style={{ width: '100%', padding: '.5rem', fontSize: '.8rem', border: '1px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)', boxSizing: 'border-box' }}
                  />
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
                  style={{ width: '100%', padding: '.5rem', fontSize: '.8rem', border: '1px solid var(--line)', background: 'var(--cream)', color: 'var(--ink)', boxSizing: 'border-box' }}
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
                {petBusy ? 'Saving cat…' : (editingPetId ? 'Save Changes to Cat 🐾' : 'Add Cat to Profile 🐾')}
              </button>
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
}
