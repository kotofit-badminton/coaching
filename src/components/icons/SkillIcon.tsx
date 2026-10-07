import type { PlainSkill } from '../../data/skillPlain'

// Simple line icons in the site's accent colour. Decorative, so hidden from screen readers.
export default function SkillIcon({ icon }: { icon: PlainSkill['icon'] }) {
  const common = {
    width: 40,
    height: 40,
    viewBox: '0 0 40 40',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (icon) {
    case 'corner':
      return (
        <svg {...common}>
          <rect x="6" y="6" width="28" height="28" rx="2" />
          <circle cx="30" cy="10" r="3" />
        </svg>
      )
    case 'serve':
      return (
        <svg {...common}>
          <rect x="6" y="6" width="28" height="28" rx="2" />
          <rect x="14" y="14" width="12" height="12" />
        </svg>
      )
    case 'rally':
      return (
        <svg {...common}>
          <path d="M6 16 H34" />
          <path d="M28 10 L34 16 L28 22" />
          <path d="M34 26 H6" />
          <path d="M12 20 L6 26 L12 32" />
        </svg>
      )
    case 'choice':
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="13" />
          <circle cx="20" cy="20" r="4" />
        </svg>
      )
    case 'footwork':
      return (
        <svg {...common}>
          <path d="M12 8 L14 14 L10 16 L13 22" />
          <path d="M26 18 L28 24 L24 26 L27 32" />
        </svg>
      )
    case 'energy':
      return (
        <svg {...common}>
          <path d="M22 4 L10 22 H19 L17 36 L30 17 H21 Z" />
        </svg>
      )
    case 'match':
      return (
        <svg {...common}>
          <rect x="6" y="10" width="28" height="20" rx="2" />
          <path d="M14 18 H26 M14 24 H22" />
        </svg>
      )
    case 'speed':
      return (
        <svg {...common}>
          <path d="M6 20 H24" />
          <path d="M10 14 H20 M10 26 H20" />
          <path d="M24 14 L34 20 L24 26 Z" />
        </svg>
      )
    case 'power':
      return (
        <svg {...common}>
          <path d="M8 26 L20 10 L32 26 Z" />
        </svg>
      )
    case 'control':
    case 'movement':
    case 'reaction':
    case 'focus':
    default:
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="12" />
          <path d="M20 12 V20 L26 24" />
        </svg>
      )
  }
}
