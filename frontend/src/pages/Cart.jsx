import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Button from '../components/common/Button'
import QuantityInput from '../components/common/QuantityInput'

const EMPTY_ADDRESS = {
  fullName: '',
  phone: '',
  addressLine: '',
  city: '',
  state: '',
  pincode: '',
}

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    promoCode,
    promoLabel,
    promoError,
    applyPromo,
    removePromo,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount,
    amountToFreeShipping,
  } = useCart()

  const navigate = useNavigate()
  const [promoInput, setPromoInput] = useState('')
  const [address, setAddress] = useState(EMPTY_ADDRESS)
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState(null)

  function handleAddressChange(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  function validateAddress() {
    const next = {}
    if (!address.fullName.trim()) next.fullName = 'Required'
    if (!/^\d{10}$/.test(address.phone.trim())) next.phone = 'Enter a 10-digit phone number'
    if (!address.addressLine.trim()) next.addressLine = 'Required'
    if (!address.city.trim()) next.city = 'Required'
    if (!address.state.trim()) next.state = 'Required'
    if (!/^\d{6}$/.test(address.pincode.trim())) next.pincode = 'Enter a 6-digit pincode'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handlePlaceOrder(e) {
    e.preventDefault()
    if (!validateAddress()) return
    setPlacing(true)
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
      setOrder({ id: orderId, total, itemCount, address })
      clearCart()
      setPlacing(false)
    }, 900)
  }

  if (order) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <CheckCircle2 size={48} className="text-neutral-900" />
        <h1 className="mt-5 text-2xl font-bold">Order placed!</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Thanks{order.address.fullName ? `, ${order.address.fullName.split(' ')[0]}` : ''} — your order
          <span className="font-semibold text-neutral-900"> {order.id} </span>
          is confirmed. A confirmation has been sent to your email.
        </p>
        <div className="mt-6 w-full rounded-lg border border-neutral-200 p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Items</span>
            <span className="font-medium">{order.itemCount}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-neutral-500">Total paid</span>
            <span className="font-semibold">₹{order.total}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-neutral-500">Shipping to</span>
            <span className="text-right font-medium">
              {order.address.city}, {order.address.state} {order.address.pincode}
            </span>
          </div>
        </div>
        <Button className="mt-8 w-full" onClick={() => navigate('/shop')}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <ShoppingBag size={40} className="text-neutral-300" />
        <h1 className="mt-4 text-xl font-bold">Your bag is empty</h1>
        <p className="mt-2 text-sm text-neutral-500">Looks like you haven't added anything yet.</p>
        <Button as={Link} to="/shop" className="mt-6">
          Start Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Your Bag</h1>
      <p className="mt-1 text-sm text-neutral-500">{itemCount} items</p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <img src={item.image} alt={item.name} className="h-32 w-24 flex-none bg-neutral-100 object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantityInput
                      size="sm"
                      value={item.quantity}
                      max={item.stockCount}
                      onChange={(qty) => updateQuantity(item.id, qty)}
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={handlePlaceOrder}
            className="mt-10 border-t border-neutral-200 pt-8"
            aria-label="Shipping address"
          >
            <h2 className="text-lg font-bold">Shipping Address</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName} className="sm:col-span-2">
                <input
                  value={address.fullName}
                  onChange={(e) => handleAddressChange('fullName', e.target.value)}
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>
              <Field label="Phone number" error={errors.phone}>
                <input
                  value={address.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  inputMode="numeric"
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <input
                  value={address.pincode}
                  onChange={(e) => handleAddressChange('pincode', e.target.value)}
                  inputMode="numeric"
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>
              <Field label="Address" error={errors.addressLine} className="sm:col-span-2">
                <input
                  value={address.addressLine}
                  onChange={(e) => handleAddressChange('addressLine', e.target.value)}
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>
              <Field label="City" error={errors.city}>
                <input value={address.city} onChange={(e) => handleAddressChange('city', e.target.value)} className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900" />
              </Field>
              <Field label="State" error={errors.state}>
                <input
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>
            </div>
          </form>
        </div>

        <div className="h-fit rounded-lg border border-neutral-200 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Order Summary</h2>

          {amountToFreeShipping > 0 ? (
            <p className="mt-3 text-xs text-neutral-600">
              Add <span className="font-semibold">₹{amountToFreeShipping}</span> more for free shipping.
            </p>
          ) : (
            <p className="mt-3 text-xs font-medium text-green-700">You've unlocked free shipping.</p>
          )}

          <div className="mt-4">
            {promoCode ? (
              <div className="flex items-center justify-between rounded-md bg-neutral-100 px-3 py-2 text-sm">
                <span>
                  <span className="font-medium">{promoCode}</span> applied — {promoLabel}
                </span>
                <button onClick={removePromo} className="text-xs font-medium underline underline-offset-4">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    applyPromo(promoInput)
                    setPromoInput('')
                  }}
                >
                  Apply
                </Button>
              </div>
            )}
            {promoError && <p className="mt-1.5 text-xs font-medium text-red-600">{promoError}</p>}
          </div>

          <div className="mt-5 space-y-2.5 border-t border-neutral-200 pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Discount</span>
                <span className="font-medium text-green-700">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Shipping</span>
              <span className="font-medium">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tax</span>
              <span className="font-medium">₹{tax}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <Button onClick={handlePlaceOrder} disabled={placing} className="mt-6 w-full" size="lg">
            {placing ? 'Placing Order…' : `Place Order — ₹${total}`}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children, className = '' }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1.5 block font-medium text-neutral-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}
