import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Truck, Loader2 } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import StatusBadge from '../components/common/StatusBadge'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { apiErrorMessage } from '../lib/api'
import { getOrder, updateOrderStatus, shipOrder, trackOrder } from '../services/orders'

const STATUS_FLOW = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrderDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { data, loading, error, refetch } = useApi(() => getOrder(id), [id])
  const [updating, setUpdating] = useState(false)
  const [tracking, setTracking] = useState(null)

  async function handleStatusChange(status) {
    if (status === 'Cancelled' && !window.confirm('Cancel this order? Stock will be restocked and any payment refunded.')) return
    setUpdating(true)
    try {
      await updateOrderStatus(id, status)
      toast.success(`Order marked ${status}`)
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setUpdating(false)
    }
  }

  async function handleShip() {
    setUpdating(true)
    try {
      await shipOrder(id)
      toast.success('Shipment created via Shiprocket')
      refetch()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    } finally {
      setUpdating(false)
    }
  }

  async function handleTrack() {
    try {
      const res = await trackOrder(id)
      setTracking(res.tracking)
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-neutral-400" />
      </div>
    )
  }

  if (error) return <ErrorState message={`Failed to load order — ${error}`} onRetry={refetch} />

  const order = data.order

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link to="/orders" className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{order.orderNumber}</h1>
          <p className="text-sm text-neutral-500">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={order.paymentStatus} />
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card padded={false}>
            <h2 className="px-6 pt-5 text-base font-semibold text-neutral-900">Items</h2>
            <ul className="divide-y divide-neutral-100 px-6 py-4">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-4 py-3">
                  <img src={item.image} alt="" className="h-16 w-14 rounded-lg bg-neutral-100 object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.color} / {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">₹{item.price * item.quantity}</p>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 border-t border-neutral-100 px-6 py-4 text-sm">
              <Row label="Subtotal" value={`₹${order.subtotal}`} />
              {order.discount > 0 && <Row label={`Discount (${order.promoCode})`} value={`-₹${order.discount}`} />}
              <Row label="Shipping" value={order.shipping === 0 ? 'Free' : `₹${order.shipping}`} />
              <Row label="Tax" value={`₹${order.tax}`} />
              <Row label="Total" value={`₹${order.total}`} bold />
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-base font-semibold text-neutral-900">Shipping</h2>
            <p className="text-sm text-neutral-700">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-neutral-500">{order.shippingAddress.phone}</p>
            <p className="mt-1 text-sm text-neutral-500">
              {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.pincode}
            </p>

            {order.shiprocket?.awbCode ? (
              <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm">
                <p>
                  <span className="text-neutral-500">Courier:</span> {order.shiprocket.courierName || '—'}
                </p>
                <p>
                  <span className="text-neutral-500">AWB:</span> {order.shiprocket.awbCode}
                </p>
                <button onClick={handleTrack} className="mt-2 text-xs font-medium text-neutral-900 underline underline-offset-4">
                  Refresh tracking
                </button>
                {tracking && (
                  <pre className="mt-2 max-h-40 overflow-auto rounded bg-white p-2 text-[11px] text-neutral-500">
                    {JSON.stringify(tracking, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <Button onClick={handleShip} disabled={updating} variant="secondary" className="mt-4">
                <Truck size={15} />
                Push to Shiprocket
              </Button>
            )}
          </Card>
        </div>

        <Card className="h-fit">
          <h2 className="mb-3 text-base font-semibold text-neutral-900">Update Status</h2>
          <div className="space-y-2">
            {STATUS_FLOW.map((s) => (
              <button
                key={s}
                disabled={updating || order.status === s}
                onClick={() => handleStatusChange(s)}
                className={`block w-full rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium disabled:cursor-not-allowed ${
                  order.status === s
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {order.cancelReason && <p className="mt-3 text-xs text-neutral-500">Cancel reason: {order.cancelReason}</p>}
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? 'border-t border-neutral-100 pt-1.5 font-semibold text-neutral-900' : 'text-neutral-600'}`}>
      <span>{label}</span>
      <span className={bold ? '' : 'text-neutral-900'}>{value}</span>
    </div>
  )
}
