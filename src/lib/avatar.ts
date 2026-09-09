/**
 * Utility to determine if an avatar string represents an image source
 * (URL, base64 data URI, or local asset path) rather than an emoji or icon key.
 */
export function isImageAvatar(str?: string | null): boolean {
  if (!str) return false;
  return (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('data:') ||
    str.startsWith('/') ||
    str.startsWith('./')
  );
}
