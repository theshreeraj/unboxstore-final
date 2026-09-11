import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { getCategoryBySlug } from '../../data/categories'
import promoImage from '../../assets/hero/unboxstorehero3.png'

const GROUPS = [
  {
    heading: 'Tops',
    slugs: ['sweaters-and-cardigans', 'shirts', 'polos', 't-shirts', 'overshirts', 'short-sleeved-knitwear'],
  },
  {
    heading: 'Outerwear',
    slugs: ['jackets', 'trench-coats', 'blazers', 'coats', 'sweatshirts'],
  },
  {
    heading: 'Bottoms & More',
    slugs: ['trousers', 'jeans', 'shorts', 'linen', 'swimwear', 'underwear', 'pyjamas'],
  },
]

export default function ShopMegaMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-50">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={onClose} className="text-lg font-bold tracking-[0.2em]">
          ATELIER
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <span className="text-xs font-bold uppercase tracking-wide underline underline-offset-4">Shop</span>
          <Link
            to="/shop?sort=newest"
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-wide hover:text-neutral-500"
          >
            New Arrivals
          </Link>
          <Link to="/shop" onClick={onClose} className="text-xs font-bold uppercase tracking-wide hover:text-neutral-500">
            Featured
          </Link>
        </nav>

        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide hover:text-neutral-500"
        >
          <X size={18} />
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[280px_repeat(3,1fr)]">
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-3 lg:col-span-1">
            <Link to="/shop" onClick={onClose} className="text-3xl font-bold leading-tight hover:text-neutral-600 sm:text-4xl">
              Shop all
            </Link>
            <Link
              to="/shop?sort=newest"
              onClick={onClose}
              className="text-3xl font-bold leading-tight hover:text-neutral-600 sm:text-4xl"
            >
              New arrivals
            </Link>
            <Link to="/shop" onClick={onClose} className="text-3xl font-bold leading-tight hover:text-neutral-600 sm:text-4xl">
              Featured
            </Link>

            <Link to="/shop?sort=newest" onClick={onClose} className="mt-8 block max-w-[220px]">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-200">
                <img src={promoImage} alt="" className="h-full w-full object-cover" />
              </div>
              <span className="mt-2 inline-block text-sm font-medium underline underline-offset-4">Autumn 2026</span>
            </Link>
          </div>

          {GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{group.heading}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {group.slugs.map((slug) => {
                  const cat = getCategoryBySlug(slug)
                  if (!cat) return null
                  return (
                    <li key={slug}>
                      <Link
                        to={`/shop?category=${slug}`}
                        onClick={onClose}
                        className="text-lg font-semibold hover:text-neutral-500"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
