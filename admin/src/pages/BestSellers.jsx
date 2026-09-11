import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { getBestSellers } from '../services/products'

export default function BestSellers() {
  const { data, loading, error, refetch } = useApi(() => getBestSellers(20), [])
  const products = data?.products || []
  const max = products[0]?.sold || 1

  return (
    <div>
      <PageHeader title="Best Sellers" description="Top performing products by units sold." />

      {error && <ErrorState message={`Failed to load best sellers — ${error}`} onRetry={refetch} />}

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-6 py-3 font-medium">Rank</th>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Units Sold</th>
                <th className="px-6 py-3 font-medium">Trend</th>
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
              {!loading && products.length === 0 && !error && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-neutral-400">
                    No sales data yet
                  </td>
                </tr>
              )}
              {!loading &&
                products.map((p, i) => (
                  <tr key={p._id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5 font-semibold text-neutral-400">#{i + 1}</td>
                    <td className="px-6 py-3.5 font-medium text-neutral-900">{p.name}</td>
                    <td className="px-6 py-3.5 text-neutral-900">{p.sold}</td>
                    <td className="px-6 py-3.5">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-neutral-100">
                        <div className="h-full rounded-full bg-neutral-900" style={{ width: `${(p.sold / max) * 100}%` }} />
                      </div>
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
