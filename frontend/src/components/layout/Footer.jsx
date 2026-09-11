import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/categories'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <p className="text-lg font-bold tracking-[0.2em]">ATELIER</p>
            <p className="mt-3 max-w-xs text-sm text-neutral-600">
              Considered essentials, made to last. Designed in-house and shipped across India.
            </p>
            <form onSubmit={handleSubscribe} className="mt-5 flex max-w-xs gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="min-w-0 flex-1 border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
              <button className="bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase text-white">
                Join
              </button>
            </form>
            {subscribed && <p className="mt-2 text-xs text-neutral-600">Thanks for subscribing!</p>}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Shop</p>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/shop?category=${cat.slug}`} className="text-sm text-neutral-600 hover:text-neutral-900">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Help</p>
            <ul className="mt-3 space-y-2">
              <li><Link to="/shop" className="text-sm text-neutral-600 hover:text-neutral-900">Shipping &amp; Returns</Link></li>
              <li><Link to="/cart" className="text-sm text-neutral-600 hover:text-neutral-900">Track Order (Shiprocket)</Link></li>
              <li><Link to="/account" className="text-sm text-neutral-600 hover:text-neutral-900">Your Account</Link></li>
              <li><Link to="/shop" className="text-sm text-neutral-600 hover:text-neutral-900">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Company</p>
            <ul className="mt-3 space-y-2">
              <li><Link to="/" className="text-sm text-neutral-600 hover:text-neutral-900">About</Link></li>
              <li><Link to="/" className="text-sm text-neutral-600 hover:text-neutral-900">Privacy Policy</Link></li>
              <li><Link to="/" className="text-sm text-neutral-600 hover:text-neutral-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Atelier. All rights reserved.</p>
          <p>Secure checkout · Free returns · Made with care</p>
        </div>
      </div>
    </footer>
  )
}
