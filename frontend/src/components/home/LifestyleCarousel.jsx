import { useState } from 'react'
import img1 from '../../assets/carsouselimg1.jpg'
import img2 from '../../assets/carsouselimg2.jpg'
import img3 from '../../assets/carsouselimg3.jpg'
import img4 from '../../assets/carsouselimg4.jpg'
import img5 from '../../assets/carsouselimg5.jpg'

const IMAGES = [img1, img2, img3, img4, img5]

export default function LifestyleCarousel() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="py-16">
      <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8">
        {IMAGES.map((img) => (
          <div key={img} className="aspect-[4/5] w-[70%] flex-none snap-start overflow-hidden bg-neutral-100 sm:w-[calc(20%-13px)]">
            <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-md px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Join Newsletter</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every
          week.
        </p>
        <form onSubmit={handleSubscribe} className="mt-6 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="min-w-0 flex-1 border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
          <button className="bg-neutral-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-neutral-700">
            Join
          </button>
        </form>
        {subscribed && <p className="mt-3 text-xs text-neutral-600">Thanks for subscribing!</p>}
      </div>
    </section>
  )
}
