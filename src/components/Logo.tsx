type LogoProps = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
};

export function Logo({ size = 32, showWordmark = true, className = 'wordmark' }: LogoProps) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', textDecoration: 'none' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0, display: 'block', borderRadius: '50%' }}
      >
        <defs>
          <linearGradient id="logoCoralGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF7E62" />
            <stop offset="50%" stopColor="#F36C4D" />
            <stop offset="100%" stopColor="#D95334" />
          </linearGradient>
          <linearGradient id="logoSunGrad" x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE3A8" />
            <stop offset="100%" stopColor="#F2C572" />
          </linearGradient>
        </defs>

        {/* Circular emblem badge */}
        <circle cx="60" cy="60" r="56" fill="url(#logoCoralGrad)" />
        <circle cx="60" cy="60" r="51" stroke="#FFF" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 3" />

        {/* Cat Silhouette & Face */}
        {/* Left Ear */}
        <path d="M 28 52 C 27 40, 24 28, 23 20 C 32 23, 44 32, 48 40 Z" fill="#FFFDF9" />
        <path d="M 29 46 C 28 38, 26 29, 25 24 C 31 27, 39 34, 43 40 Z" fill="#FFCBBF" opacity="0.9" />

        {/* Right Ear */}
        <path d="M 92 52 C 93 40, 96 28, 97 20 C 88 23, 76 32, 72 40 Z" fill="#FFFDF9" />
        <path d="M 91 46 C 92 38, 94 29, 95 24 C 89 27, 81 34, 77 40 Z" fill="#FFCBBF" opacity="0.9" />

        {/* Main Head */}
        <path
          d="M 32 46 C 42 42, 78 42, 88 46 C 98 54, 99 74, 91 85 C 82 96, 68 98, 60 98 C 52 98, 38 96, 29 85 C 21 74, 22 54, 32 46 Z"
          fill="#FFFDF9"
        />

        {/* Contented Smiling Eyes */}
        <path d="M 39 59 C 42 55, 47 55, 50 59" stroke="#132227" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 70 59 C 73 55, 78 55, 81 59" stroke="#132227" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <path d="M 57 66 C 58 64, 62 64, 63 66 C 63.5 67, 61 70, 60 70 C 59 70, 56.5 67, 57 66 Z" fill="#F36C4D" />

        {/* Gentle Mouth (W) */}
        <path d="M 54 71 C 54 75, 59 75, 60 72 C 61 75, 66 75, 66 71" stroke="#132227" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Left Whiskers */}
        <path d="M 40 68 C 30 67, 18 65, 11 64" stroke="#132227" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 39 73 C 28 74, 17 74, 10 77" stroke="#132227" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 40 77 C 31 81, 20 84, 13 89" stroke="#132227" strokeWidth="2.4" strokeLinecap="round" />

        {/* Right Whiskers */}
        <path d="M 80 68 C 90 67, 102 65, 109 64" stroke="#132227" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 81 73 C 92 74, 103 74, 110 77" stroke="#132227" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 80 77 C 89 81, 100 84, 107 89" stroke="#132227" strokeWidth="2.4" strokeLinecap="round" />

        {/* Little Golden Sparkle on forehead */}
        <path d="M 60 46 L 61 49 L 64 50 L 61 51 L 60 54 L 59 51 L 56 50 L 59 49 Z" fill="url(#logoSunGrad)" />
      </svg>

      {showWordmark && (
        <span style={{ color: 'var(--ink)' }}>Whiskerfield</span>
      )}
    </span>
  );
}

