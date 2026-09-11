import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { updateMe } from '../services/users'

const inputClass =
  'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-400'

export default function Settings() {
  const { user } = useAuth()
  const toast = useToast()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateMe({ name, phone })
      toast.success('Account updated')
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and store preferences." />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">Admin Account</h2>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">Live</span>
          </div>
          <p className="mb-4 text-sm text-neutral-500">Update your personal admin profile.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Phone">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Email">
              <input value={user?.email || ''} disabled className={inputClass} />
              <span className="mt-1 block text-xs text-neutral-400">Contact a super-admin to change your login email.</span>
            </Field>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 size={16} className="animate-spin" />}
              Update Account
            </Button>
          </form>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">Store Details</h2>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">Not yet connected</span>
          </div>
          <p className="mb-4 text-sm text-neutral-500">
            Store-wide settings aren't backed by the API yet — these fields are for preview only.
          </p>
          <div className="space-y-4 opacity-60">
            <Field label="Store name">
              <input defaultValue="UnboxStore" className={inputClass} disabled />
            </Field>
            <Field label="Support email">
              <input defaultValue="support@unboxstore.com" className={inputClass} disabled />
            </Field>
            <Field label="Currency">
              <select defaultValue="INR" className={inputClass} disabled>
                <option value="INR">INR (₹)</option>
              </select>
            </Field>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  )
}
