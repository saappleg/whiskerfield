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
 * and automatic fallback to initials or emojis on image load failure.
 */
export function AvatarImage({ src, alt = '', fallback, style, className, onLoadError }: AvatarImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const hasError = Boolean(src && failedSrc === src);

  if (!src || !isImageAvatar(src) || hasError) {
    return <>{fallback}</>;
  }

  return (
    /* oxlint-disable-next-line next/no-img-element */
    <img
      src={normalizeImageUrl(src)}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        setFailedSrc(src);
        onLoadError?.();
      }}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
      className={className}
    />
  );
}
