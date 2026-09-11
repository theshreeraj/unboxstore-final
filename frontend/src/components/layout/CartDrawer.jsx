import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import Drawer from '../common/Drawer'
import Button from '../common/Button'
import QuantityInput from '../common/QuantityInput'
import { useCart } from '../../context/CartContext'

export default function CartDrawer() {
  const { items, isCartOpen, setCartOpen, updateQuantity, removeItem, subtotal, itemCount } = useCart()

  return (
    <Drawer open={isCartOpen} onClose={() => setCartOpen(false)} title={`Your Bag (${itemCount})`}>
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm text-neutral-500">Your bag is empty.</p>
          <Button as={Link} to="/shop" onClick={() => setCartOpen(false)} size="sm">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 divide-y divide-neutral-100 px-5">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <img src={item.image} alt={item.name} className="h-24 w-20 rounded object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.color} / {item.size}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantityInput
                      size="sm"
                      value={item.quantity}
                      max={item.stockCount}
                      onChange={(qty) => updateQuantity(item.id, qty)}
                    />
                    <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                  className="self-start p-1 text-neutral-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-neutral-200 px-5 py-5">
            <div className="mb-4 flex items-center justify-between text-sm font-medium">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <Button
              as={Link}
              to="/cart"
              onClick={() => setCartOpen(false)}
              className="w-full"
            >
              View Bag & Checkout
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
