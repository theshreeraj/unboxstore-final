import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import MobileNav from './MobileNav'
import ShopMegaMenu from './ShopMegaMenu'
import SearchOverlay from './SearchOverlay'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [shopMenuOpen, setShopMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { itemCount, setCartOpen } = useCart()
  const { count: wishlistCount } = useWishlist()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 hover:bg-neutral-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="text-lg font-bold tracking-[0.2em]">
              ATELIER
            </Link>
          </div>

          <nav className="hidden items-center gap-1 rounded-full bg-neutral-100 p-1 lg:flex">
            <button
              onClick={() => setShopMenuOpen(true)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-white ${
                shopMenuOpen ? 'bg-white' : ''
              }`}
            >
              Shop
            </button>
            <Link
              to="/shop?sort=newest"
              className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-white"
            >
              New Arrivals
            </Link>
            <Link
              to="/shop"
              className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-white"
            >
              Featured
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative rounded-full p-2.5 hover:bg-neutral-100"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/account"
              aria-label="Account"
              className="hidden rounded-full p-2.5 hover:bg-neutral-100 sm:block"
            >
              <User size={18} />
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:border-neutral-900"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:border-neutral-900"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Cart</span> ({itemCount})
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <ShopMegaMenu open={shopMenuOpen} onClose={() => setShopMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
