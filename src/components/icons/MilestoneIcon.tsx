import type { MilestoneIconKey } from '../../types'

interface Props {
  icon: MilestoneIconKey
  size?: number
}

export default function MilestoneIcon({ icon, size = 20 }: Props) {
  switch (icon) {
    case 'rally':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
          <ellipse cx="10.5" cy="8" rx="5.5" ry="6.8" stroke="currentColor" strokeWidth="2" />
          <path
            d="M6 8h9M10.5 1.7v12.6M7.7 3.6l5.6 8.8M13.3 3.6 7.7 12.4"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.55"
          />
          <path d="M10.5 14.5V21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="19.5" cy="4" r="1.6" fill="currentColor" />
          <path
            d="M19.5 4 22.3 1.8M19.5 4 22.5 4.6M19.5 4 21 1"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'match':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="M7 3h10v4a5 5 0 0 1-10 0V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M7 4H4v2a3 3 0 0 0 3 3M17 4h3v2a3 3 0 0 1-3 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M12 12v4M9 20h6M10 16h4v4h-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )
    case 'anniversary':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="2" />
          <path d="M7.5 3v4M16.5 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="m12 12.5 1.1 2.2 2.4.35-1.75 1.7.4 2.4-2.15-1.13-2.15 1.13.4-2.4-1.75-1.7 2.4-.35Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'smash':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="M13.5 2 5 14h6l-1 8L19 10h-6l0.5-8Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'trophy':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="M7 4h10v5a5 5 0 0 1-10 0V4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M7 5H4v1.5A3.5 3.5 0 0 0 7 10M17 5h3v1.5A3.5 3.5 0 0 1 17 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M12 13.5V17M8.5 20.5h7M9.5 17h5v3.5h-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )
    case 'target':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      )
  }
}
