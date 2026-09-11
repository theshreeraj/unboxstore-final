import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { listProducts, toggleFeatured } from '../services/products'

export default function Featured() {
  const { data, loading, error, refetch, setData } = useApi(listProducts, [])
  const toast = useToast()
  const [togglingId, setTogglingId] = useState(null)
  const products = data?.products || []

  async function handleToggle(p) {
    setTogglingId(p._id)
    try {
      const res = await toggleFeatured(p._id, !p.isFeatured)
      setData((prev) => ({
        ...prev,
        products: prev.products.map((item) => (item._id === p._id ? res.product : item)),
      }))
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div>
      <PageHeader title="Featured" description="Choose which products appear in the Featured collection." />

      {error && <ErrorState message={`Failed to load products — ${error}`} onRetry={refetch} />}

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium text-right">Featured</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/5">
                    <td className="px-6 py-4" colSpan={4}>
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                    </td>
                  </tr>
                ))}
              {!loading &&
                products.map((p) => (
                  <tr key={p._id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5 font-medium text-neutral-900">{p.name}</td>
                    <td className="px-6 py-3.5 text-neutral-500">{p.category?.name || '—'}</td>
                    <td className="px-6 py-3.5 text-neutral-900">₹{p.price}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleToggle(p)}
                        disabled={togglingId === p._id}
                        aria-pressed={p.isFeatured}
                        aria-label={`Toggle featured for ${p.name}`}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                          p.isFeatured ? 'bg-neutral-900' : 'bg-neutral-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            p.isFeatured ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
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
