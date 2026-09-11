import { useState } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { listPromoCodes, createPromoCode, deletePromoCode } from '../services/promoCodes'

const EMPTY = { code: '', type: 'Percent', value: '', minOrderValue: '', usageLimit: '', expiresAt: '' }

export default function PromoCodes() {
  const { data, loading, error, refetch } = useApi(listPromoCodes, [])
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const promoCodes = data?.promoCodes || []

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createPromoCode(form)
      toast.success('Promo code created')
      setModalOpen(false)
      setForm(EMPTY)
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(p) {
    if (!window.confirm(`Delete "${p.code}"?`)) return
    try {
      await deletePromoCode(p._id)
      toast.success('Promo code deleted')
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Promo Codes"
        description={`${promoCodes.length} promo codes.`}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Create Code
          </Button>
        }
      />

      {error && <ErrorState message={`Failed to load promo codes — ${error}`} onRetry={refetch} />}

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-6 py-3 font-medium">Code</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Value</th>
                <th className="px-6 py-3 font-medium">Usage</th>
                <th className="px-6 py-3 font-medium">Expires</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/5">
                    <td className="px-6 py-4" colSpan={7}>
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                    </td>
                  </tr>
                ))}
              {!loading && promoCodes.length === 0 && !error && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-neutral-400">
                    No promo codes yet
                  </td>
                </tr>
              )}
              {!loading &&
                promoCodes.map((p) => (
                  <tr key={p._id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5 font-mono text-sm font-semibold text-neutral-900">{p.code}</td>
                    <td className="px-6 py-3.5 text-neutral-500">{p.type}</td>
                    <td className="px-6 py-3.5 text-neutral-900">
                      {p.type === 'Percent' ? `${p.value}%` : p.type === 'Flat' ? `₹${p.value}` : 'Free shipping'}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className="h-full rounded-full bg-neutral-900"
                            style={{ width: `${p.usageLimit ? Math.min(100, (p.usedCount / p.usageLimit) * 100) : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500">
                          {p.usedCount}/{p.usageLimit || '∞'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-neutral-500">{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button onClick={() => handleDelete(p)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Promo Code">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Code</span>
            <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className={fieldClass} placeholder="SUMMER20" required />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-neutral-700">Type</span>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={fieldClass}>
                <option value="Percent">Percent</option>
                <option value="Flat">Flat</option>
                <option value="Shipping">Free Shipping</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-neutral-700">Value</span>
              <input
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                className={fieldClass}
                disabled={form.type === 'Shipping'}
                placeholder={form.type === 'Percent' ? '%' : '₹'}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-neutral-700">Min order value</span>
              <input type="number" min="0" value={form.minOrderValue} onChange={(e) => setForm((f) => ({ ...f, minOrderValue: e.target.value }))} className={fieldClass} />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-neutral-700">Usage limit</span>
              <input type="number" min="0" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} className={fieldClass} placeholder="0 = unlimited" />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Expires</span>
            <input type="date" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} className={fieldClass} />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              Create Code
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

const fieldClass = 'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-400'
