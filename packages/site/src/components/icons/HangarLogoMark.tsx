export const HangarLogoMark = ({size = 24}: {size?: number}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M5 10a7 4 0 0 1 14 0"/>
        <line x1="5"  y1="10" x2="5"  y2="19"/>
        <line x1="19" y1="10" x2="19" y2="19"/>
        <line x1="5"  y1="15" x2="19" y2="15"/>
        <line x1="5"  y1="19" x2="19" y2="19"/>
    </svg>
);

/**
 * HangarLogoMarkLight — wariant B (lekki)
 *
 * Same arch, pillars end AT the crossbar — no separate base below.
 * Y range: 7–18, centred at y≈12.5 in 24×24 viewBox.
 *
 *   ╭──────────╮   y=7
 *   │          │
 *   └──────────┘   y=18  (crossbar = sole bottom element)
 */
