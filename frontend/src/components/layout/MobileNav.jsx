import { Link } from 'react-router-dom'
import Drawer from '../common/Drawer'
import { CATEGORIES } from '../../data/categories'

export default function MobileNav({ open, onClose }) {
  return (
    <Drawer open={open} onClose={onClose} side="left" title="Menu" widthClass="max-w-xs">
      <nav className="flex flex-col px-2 py-2">
        <Link to="/shop?sort=newest" onClick={onClose} className="px-3 py-3 text-sm font-medium">
          New Arrivals
        </Link>
        <Link to="/shop" onClick={onClose} className="px-3 py-3 text-sm font-medium">
          Shop All
        </Link>
        <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Categories
        </p>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            onClick={onClose}
            className="px-3 py-2.5 text-sm text-neutral-700"
          >
            {cat.name}
          </Link>
        ))}
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <Link to="/account" onClick={onClose} className="px-3 py-2.5 text-sm font-medium">
            Account
          </Link>
          <Link to="/wishlist" onClick={onClose} className="px-3 py-2.5 text-sm font-medium">
            Wishlist
          </Link>
        </div>
      </nav>
    </Drawer>
  )
}
