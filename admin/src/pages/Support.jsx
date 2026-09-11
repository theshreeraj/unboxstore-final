import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { listTickets } from '../services/support'

const STATUS_TABS = ['All', 'Open', 'In Progress', 'Resolved']

export default function Support() {
  const [status, setStatus] = useState('All')
  const { data, loading, error, refetch } = useApi(
    () => listTickets(status === 'All' ? {} : { status }),
    [status]
  )
  const tickets = data?.tickets || []

  return (
    <div>
      <PageHeader title="Support" description={`${tickets.length} tickets from customers.`} />

      <div className="mb-6 flex gap-2">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
              status === s ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <ErrorState message={`Failed to load tickets — ${error}`} onRetry={refetch} />}

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-6 py-3 font-medium">Subject</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/5">
                    <td className="px-6 py-4" colSpan={5}>
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                    </td>
                  </tr>
                ))}
              {!loading && tickets.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-neutral-400">
                    No tickets
                  </td>
                </tr>
              )}
              {!loading &&
                tickets.map((t) => (
                  <tr key={t._id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5 font-medium text-neutral-900">
                      <Link to={`/support/${t._id}`} className="hover:underline">
                        {t.subject}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-neutral-600">{t.customer}</td>
                    <td className="px-6 py-3.5 text-neutral-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={t.priority} />
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
