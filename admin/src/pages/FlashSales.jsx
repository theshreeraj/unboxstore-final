import { useEffect, useState } from 'react'
import { Plus, Zap, Trash2, Loader2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { listFlashSales, createFlashSale, deleteFlashSale } from '../services/flashSales'
import { listProducts } from '../services/products'

const EMPTY = { name: '', discountPercent: '', startsAt: '', endsAt: '', products: [] }

export default function FlashSales() {
  const { data, loading, error, refetch } = useApi(listFlashSales, [])
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [products, setProducts] = useState([])
  const [saving, setSaving] = useState(false)

  const flashSales = data?.flashSales || []

  useEffect(() => {
    if (modalOpen && products.length === 0) {
      listProducts().then((res) => setProducts(res.products)).catch(() => {})
    }
  }, [modalOpen, products.length])

  function toggleProduct(id) {
    setForm((f) => ({
      ...f,
      products: f.products.includes(id) ? f.products.filter((p) => p !== id) : [...f.products, id],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createFlashSale(form)
      toast.success('Flash sale created')
      setModalOpen(false)
      setForm(EMPTY)
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(f) {
    if (!window.confirm(`Delete "${f.name}"?`)) return
    try {
      await deleteFlashSale(f._id)
      toast.success('Flash sale deleted')
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Flash Sales"
        description={`${flashSales.length} flash sales.`}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            New Flash Sale
          </Button>
        }
      />

      {error && <ErrorState message={`Failed to load flash sales — ${error}`} onRetry={refetch} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-neutral-100" />)}

        {!loading &&
          flashSales.map((f) => (
            <Card key={f._id}>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
                  <Zap size={18} />
                </div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={f.status} />
                  <button onClick={() => handleDelete(f)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="mt-4 font-semibold text-neutral-900">{f.name}</p>
              <p className="mt-1 text-sm text-neutral-500">{f.discountPercent}% off</p>
              <div className="mt-4 space-y-1 text-xs text-neutral-500">
                <p>Starts: {new Date(f.startsAt).toLocaleString()}</p>
                <p>Ends: {new Date(f.endsAt).toLocaleString()}</p>
              </div>
              <p className="mt-3 text-xs font-medium text-neutral-600">{f.products?.length || 0} products included</p>
            </Card>
          ))}

        {!loading && flashSales.length === 0 && !error && (
          <Card className="col-span-full py-10 text-center text-sm text-neutral-400">No flash sales yet</Card>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Flash Sale" widthClass="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Name</span>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={fieldClass} required />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-neutral-700">Discount %</span>
              <input type="number" min="1" max="90" value={form.discountPercent} onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))} className={fieldClass} required />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-neutral-700">Starts</span>
              <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} className={fieldClass} required />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-neutral-700">Ends</span>
              <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} className={fieldClass} required />
            </label>
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-neutral-700">Products ({form.products.length} selected)</span>
            <div className="max-h-56 overflow-y-auto rounded-lg border border-neutral-200">
              {products.map((p) => (
                <label key={p._id} className="flex items-center gap-2.5 border-b border-neutral-100 px-3 py-2 text-sm last:border-0 hover:bg-neutral-50">
                  <input type="checkbox" checked={form.products.includes(p._id)} onChange={() => toggleProduct(p._id)} className="h-4 w-4 accent-neutral-900" />
                  {p.name}
                  <span className="ml-auto text-xs text-neutral-400">₹{p.price}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              Create Flash Sale
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

const fieldClass = 'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900'
