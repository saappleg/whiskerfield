type AffiliateDisclosureProps = {
  compact?: boolean;
  className?: string;
};

/**
 * Keep the affiliate relationship visible beside the recommendations it
 * applies to. The short version is useful in compact shelves; the default is
 * intentionally plain enough to stand on its own in an editorial section.
 */
export function AffiliateDisclosure({ compact = false, className = '' }: AffiliateDisclosureProps) {
  const classes = ['affiliate-disclosure', compact ? 'affiliate-disclosure-compact' : '', className].filter(Boolean).join(' ');

  return (
    <p className={classes}>
      <strong>Affiliate disclosure:</strong> Some links below are affiliate links. If you buy through one, Whiskerfield may earn a commission at no extra cost to you. As an Amazon Associate I earn from qualifying purchases. Recommendations and member reviews remain independent.
    </p>
  );
}
