import { useEffect } from 'react';

type ImageLightboxProps = {
  imageUrl: string;
  caption?: string;
  petBadge?: string;
  authorName?: string;
  onClose: () => void;
};

export function ImageLightbox({
  imageUrl,
  caption,
  petBadge,
  authorName,
  onClose,
}: ImageLightboxProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <dialog
      className="dialog-overlay"
      open
      aria-label="Enlarged photo preview"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close enlarged preview backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'zoom-out',
          zIndex: 1,
        }}
      />
      <div
        className="lightbox-card"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 'min(90vw, 840px)',
          maxHeight: '90vh',
          background: 'var(--cream)',
          border: '1px solid var(--line)',
          boxShadow: '0 20px 50px rgba(0,0,0,.5)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'default',
        }}
      >
        <button
          type="button"
          className="dialog-close"
          onClick={onClose}
          aria-label="Close photo preview"
          style={{ top: '.5rem', right: '.5rem', zIndex: 10 }}
        >
          ×
        </button>

        <div
          style={{
            width: '100%',
            maxHeight: '75vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            background: '#000',
            borderRadius: '4px',
          }}
        >
          {/* oxlint-disable-next-line next/no-img-element */}
          <img
            src={imageUrl}
            alt={caption || 'Cat photo shared by member'}
            style={{
              maxWidth: '100%',
              maxHeight: '75vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {(caption || petBadge || authorName) && (
          <div
            style={{
              width: '100%',
              marginTop: '.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '.6rem',
              fontSize: '.82rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              {petBadge && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '.3rem',
                    fontSize: '.72rem',
                    fontWeight: 800,
                    padding: '.2rem .6rem',
                    borderRadius: '999px',
                    background: 'rgba(243,108,77,.12)',
                    color: 'var(--coral)',
                    border: '1px solid rgba(243,108,77,.25)',
                  }}
                >
                  {petBadge}
                </span>
              )}
              {authorName && (
                <span style={{ color: 'var(--ink-soft)', fontSize: '.76rem' }}>
                  Posted by <strong>{authorName}</strong>
                </span>
              )}
            </div>

            {caption && (
              <span style={{ color: 'var(--ink)', fontStyle: 'italic', maxWidth: '450px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                “{caption}”
              </span>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
