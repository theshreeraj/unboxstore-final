import { useState } from 'react'
import { X } from 'lucide-react'

const MESSAGES = [
  'Free express shipping on orders over ₹2,999',
  'New season arrivals — shop the latest drops',
  'Easy 30-day exchanges, no questions asked',
]

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="relative flex items-center justify-center bg-neutral-900 px-10 py-2.5 text-center text-xs text-white">
      <p className="truncate">{MESSAGES[0]}</p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/10"
      >
        <X size={14} />
      </button>
    </div>
  )
}
