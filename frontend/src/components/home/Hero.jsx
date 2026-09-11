import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import heroImage1 from '../../assets/hero/unboxstorehero1.png'
import heroImage2 from '../../assets/hero/unboxstorehero2.png'
import heroImage3 from '../../assets/hero/unboxstorehero3.png'

const SLIDES = [
  {
    image: heroImage1,
    eyebrow: 'New Season',
    title: 'Outerwear built for the long haul',
    cta: { label: 'Shop Coats & Jackets', to: '/shop?category=coats' },
  },
  {
    image: heroImage2,
    eyebrow: 'Summer Edit',
    title: 'Linen, lightened for warm days',
    cta: { label: 'Explore Linen', to: '/shop?category=linen' },
  },
  {
    image: heroImage3,
    eyebrow: 'Everyday Staples',
    title: 'The wardrobe foundations, refined',
    cta: { label: 'Shop Collection', to: '/shop' },
  },
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/35" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-end px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          {SLIDES[index].eyebrow}
        </p>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold text-white sm:text-5xl">
          {SLIDES[index].title}
        </h1>
        <Link
          to={SLIDES[index].cta.to}
          className="mt-7 inline-flex items-center bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-900 hover:bg-neutral-100"
        >
          {SLIDES[index].cta.label}
        </Link>
      </div>

      <div className="absolute bottom-6 right-4 z-10 flex gap-2 sm:right-8">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.image}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  )
}
