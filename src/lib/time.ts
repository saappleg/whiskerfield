export function relativeTime(value: string) {
  const hours = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 3_600_000));
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}
