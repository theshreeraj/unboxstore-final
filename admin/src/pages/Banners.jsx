import { useState } from 'react'
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { listBanners, createBanner, updateBanner, deleteBanner } from '../services/banners'

const EMPTY = { title: '', placement: '', link: '', status: 'Draft' }

export default function Banners() {
  const { data, loading, error, refetch } = useApi(listBanners, [])
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const banners = data?.banners || []

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setImageFile(null)
    setModalOpen(true)
  }

  function openEdit(b) {
    setEditing(b)
    setForm({ title: b.title, placement: b.placement, link: b.link || '', status: b.status })
    setImageFile(null)
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!editing && !imageFile) {
      toast.error('Banner image is required')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await updateBanner(editing._id, form, imageFile)
        toast.success('Banner updated')
      } else {
        await createBanner(form, imageFile)
        toast.success('Banner created')
      }
      setModalOpen(false)
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(b) {
    if (!window.confirm(`Delete "${b.title}"?`)) return
    try {
      await deleteBanner(b._id)
      toast.success('Banner deleted')
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Banners"
        description={`${banners.length} banners across the storefront.`}
        action={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Add Banner
          </Button>
        }
      />

      {error && <ErrorState message={`Failed to load banners — ${error}`} onRetry={refetch} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-neutral-100" />)}

        {!loading &&
          banners.map((b) => (
            <Card key={b._id} padded={false} className="overflow-hidden">
              <div className="flex h-32 items-center justify-center overflow-hidden bg-neutral-100">
                {b.image?.url ? (
                  <img src={b.image.url} alt={b.title} className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon size={28} className="text-neutral-300" />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-neutral-900">{b.title}</p>
                <p className="mt-1 text-xs text-neutral-500">{b.placement}</p>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={b.status} />
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(b)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(b)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Banner' : 'Add Banner'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Title</span>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={fieldClass} required />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Placement</span>
            <input
              value={form.placement}
              onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value }))}
              className={fieldClass}
              placeholder="e.g. Home Hero — Slide 1"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Link (optional)</span>
            <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} className={fieldClass} placeholder="/shop?category=jackets" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Status</span>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={fieldClass}>
              <option value="Draft">Draft</option>
              <option value="Live">Live</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Image {editing ? '(replace)' : ''}</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editing ? 'Save Changes' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

const fieldClass = 'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900'
