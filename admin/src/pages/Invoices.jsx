import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { listInvoices, downloadInvoicePdf } from '../services/invoices'

export default function Invoices() {
  const { data, loading, error, refetch } = useApi(listInvoices, [])
  const toast = useToast()
  const [downloadingId, setDownloadingId] = useState(null)
  const invoices = data?.invoices || []

  async function handleDownload(inv) {
    setDownloadingId(inv._id)
    try {
      await downloadInvoicePdf(inv._id, `${inv.invoiceNumber}.pdf`)
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div>
      <PageHeader title="Invoices" description={`${invoices.length} invoices generated.`} />

      {error && <ErrorState message={`Failed to load invoices — ${error}`} onRetry={refetch} />}

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
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
              {!loading && invoices.length === 0 && !error && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-neutral-400">
                    No invoices yet
                  </td>
                </tr>
              )}
              {!loading &&
                invoices.map((inv) => (
                  <tr key={inv._id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5 font-medium text-neutral-900">{inv.invoiceNumber}</td>
                    <td className="px-6 py-3.5 text-neutral-500">{inv.order?.orderNumber || '—'}</td>
                    <td className="px-6 py-3.5 text-neutral-600">{inv.customer}</td>
                    <td className="px-6 py-3.5 text-neutral-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5 font-medium text-neutral-900">₹{inv.amount}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDownload(inv)}
                        disabled={downloadingId === inv._id}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-40"
                      >
                        {downloadingId === inv._id ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                        PDF
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
