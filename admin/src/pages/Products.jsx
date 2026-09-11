import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Filter, ChevronDown, Package, XCircle, AlertTriangle, IndianRupee } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import StatusBadge from '../components/common/StatusBadge'
import StatCard from '../components/common/StatCard'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { listProducts, deleteProduct } from '../services/products'
import { apiErrorMessage } from '../lib/api'

const STATUS_OPTIONS = ['All', 'In Stock', 'Low Stock', 'Out of Stock']

export default function Products() {
  const { data, loading, error, refetch } = useApi(listProducts, [])
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const products = data?.products || []

  const stats = useMemo(() => {
    const total = products.length
    const outOfStock = products.filter((p) => p.status === 'Out of Stock').length
    const lowStock = products.filter((p) => p.status === 'Low Stock').length
    const avgPrice = total ? products.reduce((sum, p) => sum + p.price, 0) / total : 0
    return { total, outOfStock, lowStock, avgPrice }
  }, [products])

  const filtered = products.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter
    return matchesQuery && matchesStatus
  })

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeletingId(product._id)
    try {
      await deleteProduct(product._id)
      toast.success('Product deleted')
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your products inventory"
        action={
          <Button as={Link} to="/products/new">
            <Plus size={16} />
            Add Product
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Total Products" value={stats.total} />
        <StatCard icon={XCircle} label="Out of Stock" value={stats.outOfStock} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={stats.lowStock} />
        <StatCard icon={IndianRupee} label="Avg. Price" value={`₹${stats.avgPrice.toFixed(2)}`} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
          <Search size={16} className="text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <Filter size={15} />
            {statusFilter === 'All' ? 'More Filters' : statusFilter}
            <ChevronDown size={14} className="text-neutral-400" />
          </button>
          {filtersOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setFiltersOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-black/5 bg-white py-1.5 shadow-lg">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s)
                      setFiltersOpen(false)
                    }}
                    className={`block w-full px-3.5 py-2 text-left text-sm hover:bg-neutral-50 ${
                      statusFilter === s ? 'font-semibold text-neutral-900' : 'text-neutral-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {error && <div className="mt-6"><ErrorState message={`Failed to load products from server — ${error}`} onRetry={refetch} /></div>}

      <Card className="mt-6" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/5">
                    <td className="px-6 py-4" colSpan={6}>
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && !error && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-neutral-400">
                    {products.length === 0 ? (
                      <>
                        No products found. <Link to="/products/new" className="font-medium text-neutral-900 underline">Add Product</Link> to get started.
                      </>
                    ) : (
                      `No products match "${query}"`
                    )}
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((p) => (
                  <tr key={p._id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg bg-neutral-100 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-neutral-900">{p.name}</p>
                          {p.sku && <p className="truncate text-xs text-neutral-400">{p.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-neutral-500">{p.category?.name || '—'}</td>
                    <td className="px-6 py-3.5 text-neutral-900">₹{p.price}</td>
                    <td className="px-6 py-3.5 text-neutral-600">{p.stockCount}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/products/${p._id}/edit`}
                          aria-label={`Edit ${p.name}`}
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deletingId === p._id}
                          aria-label={`Delete ${p.name}`}
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {!loading && (
        <p className="mt-4 text-xs text-neutral-400">
          Showing {filtered.length} of {products.length} products
        </p>
      )}
    </div>
  )
}
