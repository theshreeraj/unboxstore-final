export const CATEGORIES = [
  { name: 'Trousers', slug: 'trousers' },
  { name: 'Sweaters and Cardigans', slug: 'sweaters-and-cardigans' },
  { name: 'Shirts', slug: 'shirts' },
  { name: 'Jackets', slug: 'jackets' },
  { name: 'Trench Coats', slug: 'trench-coats' },
  { name: 'Jeans', slug: 'jeans' },
  { name: 'Blazers', slug: 'blazers' },
  { name: 'Sweatshirts', slug: 'sweatshirts' },
  { name: 'Polos', slug: 'polos' },
  { name: 'T-Shirts', slug: 't-shirts' },
  { name: 'Overshirts', slug: 'overshirts' },
  { name: 'Coats', slug: 'coats' },
  { name: 'Shorts', slug: 'shorts' },
  { name: 'Short-Sleeved Knitwear', slug: 'short-sleeved-knitwear' },
  { name: 'Linen', slug: 'linen' },
  { name: 'Swimwear', slug: 'swimwear' },
  { name: 'Underwear', slug: 'underwear' },
  { name: 'Pyjamas', slug: 'pyjamas' },
]

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug)
}
