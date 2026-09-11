import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, Layers } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { listCollections, createCollection, updateCollection, deleteCollection } from '../services/collections'

const EMPTY = { name: '', description: '', status: 'Active', launchDate: '' }

export default function Collections() {
  const { data, loading, error, refetch } = useApi(listCollections, [])
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const collections = data?.collections || []

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setImageFile(null)
    setModalOpen(true)
  }

  function openEdit(c) {
    setEditing(c)
    setForm({
      name: c.name,
      description: c.description || '',
      status: c.status,
      launchDate: c.launchDate ? c.launchDate.slice(0, 10) : '',
    })
    setImageFile(null)
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await updateCollection(editing._id, form, imageFile)
        toast.success('Collection updated')
      } else {
        await createCollection(form, imageFile)
        toast.success('Collection created')
      }
      setModalOpen(false)
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(c) {
    if (!window.confirm(`Delete "${c.name}"?`)) return
    try {
      await deleteCollection(c._id)
      toast.success('Collection deleted')
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Collections"
        description="Seasonal drops under the UnboxStore brand — a collection can span any category."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Add Collection
          </Button>
        }
      />

      {error && <ErrorState message={`Failed to load collections — ${error}`} onRetry={refetch} />}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <Card className="flex flex-col items-center py-12 text-center">
          <Layers size={28} className="text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">No collections yet. Create your first seasonal drop.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Card key={c._id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-neutral-900">{c.name}</p>
                  <p className="mt-1 text-xs text-neutral-500">{c.productCount} products</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              {c.description && <p className="mt-3 text-sm text-neutral-600">{c.description}</p>}
              <div className="mt-4 flex items-center justify-end gap-1 border-t border-neutral-100 pt-3">
                <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(c)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Collection' : 'Add Collection'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              placeholder="e.g. Aware"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="min-h-[80px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              placeholder="e.g. A climate-aware future — hoodies from recycled fibers"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-neutral-700">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Hidden">Hidden</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-neutral-700">Launch Date</span>
              <input
                type="date"
                value={form.launchDate}
                onChange={(e) => setForm((f) => ({ ...f, launchDate: e.target.value }))}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Cover Image (optional)</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editing ? 'Save Changes' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
