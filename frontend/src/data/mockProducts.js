import { CATEGORIES } from './categories'

import tanSweatshirtFlat from '../assets/10013.png'
import creamHoodieFlat from '../assets/10014.png'
import oliveJacketFlat from '../assets/10015.png'
import blackTeeFlat from '../assets/10016.png'
import oliveTrousersFlat from '../assets/10017.png'
import blackShortsFlat from '../assets/10018.png'
import navyTopYellowPants1 from '../assets/10030.png'
import navyTopYellowPants2 from '../assets/10031.png'
import blackQuiltedCoat from '../assets/10040.jpg'
import orangeJacketAction from '../assets/10043.jpg'
import longDarkCoat from '../assets/10044.jpg'
import blackOutfit1 from '../assets/10048.jpg'
import blackOutfit2 from '../assets/10049.jpg'
import tanTrench1 from '../assets/10050.jpg'
import oliveJacketOutfit from '../assets/10051.jpg'
import blackOutfit3 from '../assets/10053.jpg'
import blackOutfit4 from '../assets/10054.jpg'
import tanTrench2 from '../assets/10055.jpg'
import blueJacketOutfit from '../assets/10058.jpg'
import tanTrench3 from '../assets/10083.jpg'
import tanTrench4 from '../assets/10088.jpg'
import brownTrenchFullBody from '../assets/10101.png'

// Curated from the real photography available in src/assets. The asset pool is
// skewed toward outerwear/bags, so categories without a direct match borrow the
// closest silhouette (e.g. jeans reuse the trouser flat-lay, swimwear/underwear
// reuse the shorts flat-lay).
const CATEGORY_IMAGE_POOLS = {
  trousers: [oliveTrousersFlat, navyTopYellowPants1, navyTopYellowPants2],
  'sweaters-and-cardigans': [creamHoodieFlat, tanSweatshirtFlat],
  shirts: [blackTeeFlat],
  jackets: [oliveJacketFlat, orangeJacketAction, oliveJacketOutfit, blueJacketOutfit],
  'trench-coats': [tanTrench1, tanTrench2, tanTrench3, tanTrench4, brownTrenchFullBody],
  jeans: [oliveTrousersFlat, navyTopYellowPants1, navyTopYellowPants2],
  blazers: [blackOutfit1, blackOutfit2, blackOutfit3, blackOutfit4],
  sweatshirts: [tanSweatshirtFlat, creamHoodieFlat],
  polos: [blackTeeFlat],
  't-shirts': [blackTeeFlat],
  overshirts: [blackQuiltedCoat, longDarkCoat],
  coats: [blackQuiltedCoat, longDarkCoat, brownTrenchFullBody],
  shorts: [blackShortsFlat],
  'short-sleeved-knitwear': [blackTeeFlat, tanSweatshirtFlat],
  linen: [blackTeeFlat, oliveTrousersFlat, blackShortsFlat],
  swimwear: [blackShortsFlat],
  underwear: [blackShortsFlat],
  pyjamas: [creamHoodieFlat, blackShortsFlat],
}

// Deterministic PRNG so mock data stays stable across reloads (keyed by product id).
function hashSeed(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLOR_POOL = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Stone', hex: '#c9beac' },
  { name: 'Navy', hex: '#1f2a44' },
  { name: 'Olive', hex: '#5b5d40' },
  { name: 'Ecru', hex: '#f0e8d8' },
  { name: 'Burgundy', hex: '#5c1f2e' },
  { name: 'Rust', hex: '#a5502c' },
  { name: 'Sage', hex: '#8a9a7b' },
  { name: 'Charcoal', hex: '#36393d' },
  { name: 'White', hex: '#f7f7f5' },
]

const NAME_PARTS = {
  trousers: ['Tailored Trousers', 'Wide-Leg Trousers', 'Pleated Trousers', 'Slim Chino Trousers'],
  'sweaters-and-cardigans': ['Merino Wool Sweater', 'Cable-Knit Cardigan', 'Crew Neck Sweater', 'Open-Front Cardigan'],
  shirts: ['Poplin Shirt', 'Oxford Shirt', 'Striped Cotton Shirt', 'Flannel Shirt'],
  jackets: ['Bomber Jacket', 'Quilted Jacket', 'Denim Jacket', 'Field Jacket'],
  'trench-coats': ['Classic Trench Coat', 'Double-Breasted Trench', 'Belted Trench Coat'],
  jeans: ['Slim Fit Jeans', 'Straight Leg Jeans', 'Relaxed Jeans', 'Tapered Jeans'],
  blazers: ['Unstructured Blazer', 'Wool Blazer', 'Linen Blend Blazer'],
  sweatshirts: ['Fleece Sweatshirt', 'Crewneck Sweatshirt', 'Hooded Sweatshirt'],
  polos: ['Pique Polo', 'Slim Fit Polo', 'Merino Polo'],
  't-shirts': ['Essential T-Shirt', 'Heavyweight Tee', 'Ribbed T-Shirt'],
  overshirts: ['Wool Overshirt', 'Corduroy Overshirt', 'Twill Overshirt'],
  coats: ['Wool Overcoat', 'Puffer Coat', 'Car Coat'],
  shorts: ['Tailored Shorts', 'Cotton Chino Shorts', 'Linen Shorts'],
  'short-sleeved-knitwear': ['Knit Polo Shirt', 'Short-Sleeve Knit Top', 'Textured Knit Tee'],
  linen: ['Linen Shirt', 'Linen Trousers', 'Linen Blazer'],
  swimwear: ['Swim Shorts', 'Tailored Swim Trunks', 'Printed Swim Shorts'],
  underwear: ['Cotton Boxer Briefs', 'Stretch Trunks', 'Ribbed Briefs'],
  pyjamas: ['Cotton Pyjama Set', 'Flannel Pyjama Set', 'Linen Pyjama Set'],
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function pick(rand, arr, count) {
  const shuffled = [...arr].sort(() => rand() - 0.5)
  return shuffled.slice(0, count)
}

// Rotates the pool so each product in a category leads with a different
// photo instead of every card showing the same first image.
function rotate(arr, offset) {
  if (arr.length === 0) return arr
  const shift = offset % arr.length
  return [...arr.slice(shift), ...arr.slice(0, shift)]
}

function buildProducts() {
  const products = []
  CATEGORIES.forEach((category) => {
    const names = NAME_PARTS[category.slug] || [category.name]
    names.forEach((baseName, idx) => {
      const id = `${category.slug}-${idx + 1}`
      const rand = hashSeed(id)
      const slug = `${slugify(baseName)}-${idx + 1}`
      const basePrice = Math.round((30 + rand() * 220) / 5) * 5
      const onSale = rand() > 0.72
      const originalPrice = onSale ? Math.round((basePrice * (1.15 + rand() * 0.3)) / 5) * 5 : undefined
      const stockCount = Math.floor(rand() * 40)
      const rating = Math.round((3.3 + rand() * 1.6) * 10) / 10
      const reviewCount = Math.floor(10 + rand() * 340)
      const sizeCount = category.slug === 'underwear' || category.slug === 'swimwear' ? 4 : 6
      const sizes = ALL_SIZES.slice(0, sizeCount)
      const colors = pick(rand, COLOR_POOL, 2 + Math.floor(rand() * 2))
      const images = rotate(CATEGORY_IMAGE_POOLS[category.slug] || [blackTeeFlat], idx)

      products.push({
        id,
        name: baseName,
        slug,
        category: category.slug,
        price: basePrice,
        originalPrice,
        description: `A refined ${baseName.toLowerCase()} cut from premium materials, designed for everyday wear with a considered, minimal silhouette.`,
        details: [
          'Made from premium, responsibly sourced materials',
          'Regular fit — true to size',
          'Reinforced stitching for durability',
          'Designed in-house, ethically manufactured',
        ],
        images,
        sizes,
        colors,
        stockCount,
        isFeatured: rand() > 0.75,
        isNewArrival: rand() > 0.8,
        rating,
        reviewCount,
      })
    })
  })
  return products
}

export const MOCK_PRODUCTS = buildProducts()
