export default function PrintButton() {
  return (
    <button
      type="button"
      className="print-btn"
      onClick={() => window.print()}
      aria-label="Print or save as PDF"
      title="Print or save as PDF"
    >
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
        <path
          d="M7 8.5V3.5h10v5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="3.5" y="8.5" width="17" height="9" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <path d="M7 14h10v6.5H7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
