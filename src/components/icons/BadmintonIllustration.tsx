interface Props {
  paletteIndex?: number
  flip?: boolean
}

const palettes = [
  { skyStart: '#dbeafe', skyEnd: '#eff6ff', ground: '#8fc99a', figure: '#2f6fed' },
  { skyStart: '#fde3e3', skyEnd: '#fff5f5', ground: '#8fc99a', figure: '#d0392b' },
  { skyStart: '#fbeddc', skyEnd: '#fff8ef', ground: '#8fc99a', figure: '#e08a2b' },
  { skyStart: '#e6f4ea', skyEnd: '#f3faf4', ground: '#79b98a', figure: '#1a9c5a' },
  { skyStart: '#ede9fe', skyEnd: '#f5f3ff', ground: '#8fc99a', figure: '#7c5fe0' },
]

export default function BadmintonIllustration({ paletteIndex = 0, flip = false }: Props) {
  const p = palettes[paletteIndex % palettes.length]
  const gradId = `kf-sky-${paletteIndex}`

  return (
    <svg
      viewBox="0 0 160 110"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyStart} />
          <stop offset="100%" stopColor={p.skyEnd} />
        </linearGradient>
      </defs>
      <rect width="160" height="110" fill={`url(#${gradId})`} />
      <rect y="93" width="160" height="17" fill={p.ground} />
      <line x1="0" y1="93" x2="160" y2="93" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" />

      <g transform={flip ? 'translate(160,0) scale(-1,1)' : undefined}>
        {/* net */}
        <line x1="118" y1="60" x2="118" y2="93" stroke={p.figure} strokeOpacity="0.35" strokeWidth="2" />
        <line x1="112" y1="62" x2="148" y2="62" stroke={p.figure} strokeOpacity="0.35" strokeWidth="2" />

        {/* figure: head, torso, lunging legs, racket arm raised to a shuttle */}
        <g stroke={p.figure} strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M62 76 L54 93" />
          <path d="M62 76 L74 92" />
          <path d="M64 46 L62 76" />
          <path d="M63 52 L50 60" />
          <path d="M63 48 L80 30" />
        </g>
        <circle cx="64" cy="38" r="8.5" fill={p.figure} />
        <circle cx="86" cy="22" r="9" fill="none" stroke={p.figure} strokeWidth="3" />
        <line x1="80" y1="29" x2="72" y2="37" stroke={p.figure} strokeWidth="3" strokeLinecap="round" />

        {/* shuttlecock in flight */}
        <g transform="translate(100,10)">
          <circle r="2.6" fill="#ffffff" stroke={p.figure} strokeWidth="1.4" />
          <path
            d="M0 0 L7 -8 M0 0 L9 -1 M0 0 L5 -10"
            stroke={p.figure}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  )
}
