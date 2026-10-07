import { useStore } from '../data/store'

export default function ResetButton() {
  const { resetStore } = useStore()
  return (
    <button
      type="button"
      className="reset-btn"
      onClick={() => {
        if (confirm('Reset all demo data back to the seeded roster?')) resetStore()
      }}
    >
      Reset demo data
    </button>
  )
}
