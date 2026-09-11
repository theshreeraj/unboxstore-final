import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { searchProducts } from '../../services/productService'
import trendingJackets from '../../assets/10048.jpg'
import trendingTrench from '../../assets/10055.jpg'
import trendingCoats from '../../assets/10044.jpg'
import trendingTrousers from '../../assets/10030.png'
import trendingBlazers from '../../assets/10053.jpg'
import trendingJeans from '../../assets/10031.png'

const TRENDING = [
  { label: 'Jackets', to: '/shop?category=jackets', image: trendingJackets },
  { label: 'Trench Coats', to: '/shop?category=trench-coats', image: trendingTrench },
  { label: 'Coats', to: '/shop?category=coats', image: trendingCoats },
  { label: 'Trousers', to: '/shop?category=trousers', image: trendingTrousers },
  { label: 'Blazers', to: '/shop?category=blazers', image: trendingBlazers },
  { label: 'Jeans', to: '/shop?category=jeans', image: trendingJeans },
]

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    setQuery('')
    setResults([])
    setTimeout(() => inputRef.current?.focus(), 50)
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const handle = setTimeout(() => {
      searchProducts(query).then((res) => {
        setResults(res)
        setLoading(false)
      })
    }, 200)
    return () => clearTimeout(handle)
  }, [query])

  if (!open) return null

  function goTo(to) {
    onClose()
    navigate(to)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-neutral-50/95 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={onClose} className="text-lg font-bold tracking-[0.2em]">
          ATELIER
        </Link>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide hover:text-neutral-500"
        >
          <X size={18} />
          Close
        </button>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-3 rounded-full border-2 border-neutral-200 bg-white px-6 py-4 focus-within:border-neutral-900">
          <Search size={20} className="shrink-0 text-neutral-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
          />
          {loading && <Loader2 size={18} className="shrink-0 animate-spin text-neutral-400" />}
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {!query.trim() && (
          <div>
            <h2 className="text-sm font-bold">Trending now</h2>
            <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
              {TRENDING.map((t) => (
                <button
                  key={t.label}
                  onClick={() => goTo(t.to)}
                  className="group w-32 shrink-0 text-left sm:w-36"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-neutral-200">
                    <img
                      src={t.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-neutral-800">{t.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && results.length > 0 && (
          <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {results.map((product) => (
              <li key={product.id}>
                <button
                  onClick={() => goTo(`/product/${product.slug}`)}
                  className="flex w-full items-center gap-4 px-5 py-3 text-left hover:bg-neutral-50"
                >
                  <img src={product.images[0]} alt="" className="h-14 w-11 rounded object-cover" />
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-neutral-500">₹{product.price}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim() && !loading && results.length === 0 && (
          <p className="py-8 text-center text-sm text-neutral-500">No products found for "{query}"</p>
        )}
      </div>
    </div>
  )
}
