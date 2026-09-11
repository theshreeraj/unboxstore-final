import ProductCard from './ProductCard'

const COLUMN_CLASSES = {
  2: 'lg:grid-cols-2',
  4: 'lg:grid-cols-4',
  8: 'lg:grid-cols-8',
}

export default function ProductGrid({ products, loading, columns = 4 }) {
  const gridClass = `grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 ${COLUMN_CLASSES[columns] || COLUMN_CLASSES[4]}`

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-neutral-100" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium text-neutral-700">No products match your filters</p>
        <p className="mt-1 text-sm text-neutral-500">Try adjusting or clearing your filters.</p>
      </div>
    )
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
