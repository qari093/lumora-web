import styles from "./FypOmegaIdentity.module.css";

export default function FypOmegaIdentity({
  lane = "Wonder",
  count = "1/10"
}: {
  lane?: string;
  count?: string;
}) {
  return (
    <div data-testid="fyp-omega-identity" className={styles.topBar}>
      <svg
        className={styles.logoSvg}
        viewBox="0 0 64 112"
        aria-label="Lumora"
        role="img"
      >
        <defs>
          <linearGradient id="bladeA" x1="8" x2="56" y1="104" y2="8">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <filter id="bladeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M12 102 C20 70 31 34 55 8 C50 45 40 78 12 102 Z"
          fill="url(#bladeA)"
          filter="url(#bladeGlow)"
        />
        <path
          d="M18 94 C28 66 38 38 52 14"
          fill="none"
          stroke="rgba(255,255,255,.78)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      <span className={styles.word}>LUMORA</span>
      <span className={styles.spark} aria-hidden="true">✦</span>
      <span className={styles.pill}>{lane}</span>
      <span className={styles.count}>{count}</span>
    </div>
  );
}
