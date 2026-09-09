/**
 * Utility to determine if an avatar string represents an image source
 * (URL, base64 data URI, or local asset path) rather than an emoji or icon key.
 */
export function isImageAvatar(str?: string | null): boolean {
  if (!str) return false;
  const s = str.trim();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('data:') ||
    s.startsWith('/') ||
    s.startsWith('./') ||
    s.startsWith('blob:') ||
    /^https?:\/\//i.test(s) ||
    /^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/.*\.(png|jpe?g|webp|gif|svg)/i.test(s)
  );
}

/**
 * Normalizes user-entered image URLs (trims whitespace, adds https: if missing).
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('data:') && !trimmed.startsWith('/') && !trimmed.startsWith('./')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}
