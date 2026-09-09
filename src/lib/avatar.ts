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
    s.includes('imgur.com') ||
    /^https?:\/\//i.test(s) ||
    /^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/.*\.(png|jpe?g|webp|gif|svg)/i.test(s)
  );
}

/**
 * Normalizes user-entered image URLs:
 * - Trims whitespace
 * - Adds https: protocol if missing
 * - Converts Imgur webpage / gallery / album links to direct image links
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return '';
  let trimmed = url.trim();

  // Strip wrapping quotes if pasted from markdown
  trimmed = trimmed.replace(/^["']|["']$/g, '');

  // Handle protocol-relative URLs
  if (trimmed.startsWith('//')) {
    trimmed = `https:${trimmed}`;
  } else if (
    !/^https?:\/\//i.test(trimmed) &&
    !trimmed.startsWith('data:') &&
    !trimmed.startsWith('/') &&
    !trimmed.startsWith('./') &&
    !trimmed.startsWith('blob:')
  ) {
    trimmed = `https://${trimmed}`;
  }

  // Handle Imgur URLs (e.g. imgur.com/abc, imgur.com/a/abc, imgur.com/gallery/abc, i.imgur.com/abc)
  const imgurRegex = /^https?:\/\/(?:[a-z0-9]+\.)?imgur\.com\/(?:(?:a|gallery)\/)?([a-zA-Z0-9]+)(?:\.[a-zA-Z0-9]+)?(?:[?#].*)?$/i;
  const imgurMatch = trimmed.match(imgurRegex);
  if (imgurMatch && imgurMatch[1]) {
    const id = imgurMatch[1];
    // Check if the original URL already ended with an image extension
    const extMatch = trimmed.match(/\.(jpe?g|png|gif|webp)(?:[?#]|$)/i);
    const ext = extMatch ? extMatch[1] : 'jpg';
    return `https://i.imgur.com/${id}.${ext}`;
  }

  return trimmed;
}
