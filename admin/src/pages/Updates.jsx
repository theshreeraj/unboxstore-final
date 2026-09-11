import { useState } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { listUpdates, createUpdate, deleteUpdate } from '../services/updates'

const TAG_TONE = {
  Feature: 'bg-neutral-900 text-white',
  Fix: 'bg-red-100 text-red-700',
  Improvement: 'bg-amber-100 text-amber-800',
}

const EMPTY = { title: '', tag: 'Feature' }

export default function Updates() {
  const { data, loading, error, refetch } = useApi(listUpdates, [])
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const updates = data?.updates || []

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createUpdate(form)
      toast.success('Update posted')
      setModalOpen(false)
      setForm(EMPTY)
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(u) {
    if (!window.confirm('Delete this update?')) return
    try {
      await deleteUpdate(u._id)
      toast.success('Update deleted')
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Updates"
        description="Recent changes shipped to the platform."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Post Update
          </Button>
        }
      />

      {error && <ErrorState message={`Failed to load updates — ${error}`} onRetry={refetch} />}

      <Card>
        {loading && <div className="h-40 animate-pulse rounded-lg bg-neutral-100" />}
        {!loading && updates.length === 0 && !error && <p className="text-sm text-neutral-400">No updates posted yet</p>}
        {!loading && updates.length > 0 && (
          <ol className="relative space-y-6 border-l border-black/10 pl-6">
            {updates.map((u) => (
              <li key={u._id} className="group relative">
                <span className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-neutral-900" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${TAG_TONE[u.tag]}`}>{u.tag}</span>
                  <span className="text-xs text-neutral-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDelete(u)}
                    className="ml-auto rounded-lg p-1 text-neutral-300 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="mt-1.5 text-sm font-medium text-neutral-900">{u.title}</p>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Post Update">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Title</span>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={fieldClass} required />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-neutral-700">Tag</span>
            <select value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} className={fieldClass}>
              <option value="Feature">Feature</option>
              <option value="Fix">Fix</option>
              <option value="Improvement">Improvement</option>
            </select>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              Post
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

const fieldClass = 'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900'
