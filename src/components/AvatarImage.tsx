import { useState } from 'react';
import { isImageAvatar, normalizeImageUrl } from '../lib/avatar';

type AvatarImageProps = {
  src?: string | null;
  alt?: string;
  fallback: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onLoadError?: () => void;
};

/**
 * Resilient avatar image with no-referrer policy to avoid hotlink blocks,
 * automatic fallback to Cloudflare global image cache if blocked,
 * and graceful fallback to initials or emojis on complete failure.
 */
export function AvatarImage({ src, alt = '', fallback, style, className, onLoadError }: AvatarImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [triedProxy, setTriedProxy] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setTriedProxy(false);
    setFailedSrc(null);
  }

  const normalized = normalizeImageUrl(src);
  const hasError = Boolean(src && failedSrc === src);

  if (!src || !isImageAvatar(src) || hasError) {
    return <>{fallback}</>;
  }

  // If initial load failed and it's an external HTTP URL, try the Cloudflare wsrv proxy
  const currentSrc =
    triedProxy && normalized.startsWith('http') && !normalized.includes('wsrv.nl')
      ? `https://wsrv.nl/?url=${encodeURIComponent(normalized)}`
      : normalized;

  return (
    /* oxlint-disable-next-line next/no-img-element */
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!triedProxy && normalized.startsWith('http') && !normalized.includes('wsrv.nl')) {
          setTriedProxy(true);
        } else {
          setFailedSrc(src);
          onLoadError?.();
        }
      }}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
      className={className}
    />
  );
}
