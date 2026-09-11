import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Card from './Card'

export default function StatCard({ icon: Icon, label, value, change }) {
  const showChange = change !== undefined && change !== null
  const positive = change >= 0

  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
        {showChange && (
          <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
            {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}% vs last month
          </div>
        )}
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
        <Icon size={18} />
      </div>
    </Card>
  )
}
