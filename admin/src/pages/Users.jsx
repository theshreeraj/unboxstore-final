import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { listUsers, updateUser } from '../services/users'

export default function Users() {
  const { data, loading, error, refetch } = useApi(listUsers, [])
  const toast = useToast()
  const [updatingId, setUpdatingId] = useState(null)
  const users = data?.users || []

  async function handleToggleStatus(u) {
    setUpdatingId(u._id)
    try {
      await updateUser(u._id, { status: u.status === 'Active' ? 'Suspended' : 'Active' })
      toast.success(`${u.name} ${u.status === 'Active' ? 'suspended' : 'reactivated'}`)
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <PageHeader title="Users" description={`${data?.total ?? users.length} registered accounts.`} />

      {error && <ErrorState message={`Failed to load users — ${error}`} onRetry={refetch} />}

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Orders</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/5">
                    <td className="px-6 py-4" colSpan={7}>
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                    </td>
                  </tr>
                ))}
              {!loading && users.length === 0 && !error && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-neutral-400">
                    No users yet
                  </td>
                </tr>
              )}
              {!loading &&
                users.map((u) => (
                  <tr key={u._id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600">
                          {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-neutral-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-neutral-500">{u.email}</td>
                    <td className="px-6 py-3.5 text-neutral-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5 text-neutral-600">{u.orderCount ?? 0}</td>
                    <td className="px-6 py-3.5 text-neutral-600">{u.role}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={updatingId === u._id}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-40"
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Reactivate'}
                      </button>
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
