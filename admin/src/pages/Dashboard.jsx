import { IndianRupee, ShoppingCart, Users, Receipt } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import StatCard from '../components/common/StatCard'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { getDashboard } from '../services/dashboard'

export default function Dashboard() {
  const { data, loading, error, refetch } = useApi(getDashboard, [])

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Loading your store overview..." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <ErrorState message={`Failed to load dashboard — ${error}`} onRetry={refetch} />
      </div>
    )
  }

  const { stats, orderStatus, revenueTrend, recentOrders, bestSellers } = data
  const max = Math.max(1, ...revenueTrend.map((r) => r.total))
  const totalOrdersForStatus = Object.values(orderStatus).reduce((a, b) => a + b, 0) || 1

  return (
    <div>
      <PageHeader title="Dashboard" description="Welcome back — here's what's happening with your store today." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} change={stats.revenueChange} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.orders.toLocaleString('en-IN')} change={stats.ordersChange} />
        <StatCard icon={Users} label="Customers" value={stats.customers.toLocaleString('en-IN')} change={stats.customersChange} />
        <StatCard icon={Receipt} label="Avg. Order Value" value={`₹${stats.aov.toLocaleString('en-IN')}`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">Revenue Trend</h2>
            <span className="text-xs text-neutral-400">Last 12 months</span>
          </div>
          {revenueTrend.every((r) => r.total === 0) ? (
            <div className="flex h-48 items-center justify-center text-sm text-neutral-400">
              No orders yet — revenue will appear here once sales come in.
            </div>
          ) : (
            <div className="flex h-48 items-end gap-2 sm:gap-3">
              {revenueTrend.map((r, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className="w-full rounded-t-md bg-neutral-900/90 transition-all"
                    style={{ height: `${(r.total / max) * 165}px` }}
                    title={`₹${r.total}`}
                  />
                  <span className="text-[10px] text-neutral-400">{r.month}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-semibold text-neutral-900">Order Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Delivered', key: 'Delivered', tone: 'bg-neutral-900' },
              { label: 'Shipped', key: 'Shipped', tone: 'bg-neutral-500' },
              { label: 'Processing', key: 'Processing', tone: 'bg-amber-400' },
              { label: 'Cancelled', key: 'Cancelled', tone: 'bg-red-400' },
            ].map((s) => (
              <div key={s.key}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-neutral-600">{s.label}</span>
                  <span className="font-medium text-neutral-900">{orderStatus[s.key]}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div className={`h-full rounded-full ${s.tone}`} style={{ width: `${(orderStatus[s.key] / totalOrdersForStatus) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2" padded={false}>
          <div className="flex items-center justify-between p-5 sm:p-6">
            <h2 className="text-base font-semibold text-neutral-900">Recent Orders</h2>
            <Link to="/orders" className="text-xs font-medium text-neutral-500 hover:text-neutral-900">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-black/5 text-xs uppercase tracking-wide text-neutral-400">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-neutral-400">
                      No orders yet
                    </td>
                  </tr>
                )}
                {recentOrders.map((o) => (
                  <tr key={o._id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5">
                      <Link to={`/orders/${o._id}`} className="font-medium text-neutral-900 hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-neutral-900">₹{o.total}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-semibold text-neutral-900">Top Products</h2>
          <div className="space-y-3">
            {bestSellers.length === 0 && <p className="text-sm text-neutral-400">No sales yet</p>}
            {bestSellers.map((p, i) => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <span className="truncate text-neutral-700">
                  <span className="mr-2 text-neutral-400">#{i + 1}</span>
                  {p.name}
                </span>
                <span className="shrink-0 font-medium text-neutral-900">{p.sold} sold</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
