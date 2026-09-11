import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { getTicket, replyToTicket, updateTicket } from '../services/support'

const STATUSES = ['Open', 'In Progress', 'Resolved']

export default function SupportDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { data, loading, error, refetch } = useApi(() => getTicket(id), [id])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [updating, setUpdating] = useState(false)

  async function handleReply(e) {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    try {
      await replyToTicket(id, reply)
      setReply('')
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  async function handleStatusChange(status) {
    setUpdating(true)
    try {
      await updateTicket(id, { status })
      toast.success(`Marked ${status}`)
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neutral-400" />
      </div>
    )
  }
  if (error) return <ErrorState message={`Failed to load ticket — ${error}`} onRetry={refetch} />

  const ticket = data.ticket

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link to="/support" className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{ticket.subject}</h1>
          <p className="text-sm text-neutral-500">
            {ticket.customer} · {ticket.email}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" padded={false}>
          <div className="max-h-[420px] space-y-4 overflow-y-auto p-6">
            {ticket.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === 'admin' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[10px] ${m.from === 'admin' ? 'text-neutral-300' : 'text-neutral-400'}`}>
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleReply} className="flex gap-2 border-t border-neutral-100 p-4">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type a reply..."
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
            />
            <Button type="submit" disabled={sending || !reply.trim()}>
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </Button>
          </form>
        </Card>

        <Card className="h-fit">
          <h2 className="mb-3 text-base font-semibold text-neutral-900">Status</h2>
          <div className="space-y-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                disabled={updating || ticket.status === s}
                onClick={() => handleStatusChange(s)}
                className={`block w-full rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium disabled:cursor-not-allowed ${
                  ticket.status === s ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
