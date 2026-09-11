const POSITIVE = ['active', 'in stock', 'paid', 'delivered', 'live', 'resolved', 'ok']
const WARNING = ['low stock', 'processing', 'pending', 'unpaid', 'draft', 'scheduled', 'expiring', 'open', 'medium']
const NEGATIVE = ['out of stock', 'cancelled', 'refunded', 'expired', 'suspended', 'ended', 'high']

export default function StatusBadge({ status }) {
  const key = status.toLowerCase()
  const tone = POSITIVE.includes(key)
    ? 'bg-neutral-900 text-white'
    : WARNING.includes(key)
      ? 'bg-amber-100 text-amber-800'
      : NEGATIVE.includes(key)
        ? 'bg-red-100 text-red-700'
        : 'bg-neutral-100 text-neutral-600'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{status}</span>
  )
}
