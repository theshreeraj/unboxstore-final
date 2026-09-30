import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { listOrders } from '../services/orders'
import { FaPencilAlt } from "react-icons/fa";

const STATUS_TABS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function Orders() {
  const [status, setStatus] = useState('All')
  const { data, loading, error, refetch } = useApi(
    () => listOrders(status === 'All' ? {} : { status }),
    [status]
  )
  const orders = data?.orders || []

  return (
    <div>
      <PageHeader title="Orders" description={`${orders.length} orders${status === 'All' ? '' : ` — ${status}`}.`} />

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
              status === s ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <ErrorState message={`Failed to load orders — ${error}`} onRetry={refetch} />}

      <Card padded={false}>
        <div style={{border:"1px solid red"}}>fdsfdsdsdssddsfdf</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Action</th>
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
              {!loading && orders.length === 0 && !error && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-neutral-400">
                    No orders found
                  </td>
                </tr>
              )}
              {!loading &&
                orders.map((o) => (
                  <tr key={o._id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-3.5 font-medium text-neutral-900">
                      <Link to={`/orders/${o._id}`} className="hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-neutral-600">{o.shippingAddress?.fullName}</td>
                    <td className="px-6 py-3.5 text-neutral-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5 text-neutral-600">{o.items.length}</td>
                    <td className="px-6 py-3.5 font-medium text-neutral-900">₹{o.total}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={o.paymentStatus} />
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>

                    <td>
                      <FaPencilAlt />
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
