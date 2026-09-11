import Hero from '../components/home/Hero'
import ValueProps from '../components/home/ValueProps'
import CategoryGrid from '../components/home/CategoryGrid'
import StatementBanner from '../components/home/StatementBanner'
import FeaturedCarousel from '../components/home/FeaturedCarousel'
import EditorialBanner from '../components/home/EditorialBanner'
import Testimonials from '../components/home/Testimonials'
import LifestyleCarousel from '../components/home/LifestyleCarousel'

export default function Home() {
  return (
    <div>
      <Hero />
      <ValueProps />
      <CategoryGrid />
      <StatementBanner />
      <FeaturedCarousel title="Featured Products" />
      <EditorialBanner />
      <Testimonials />
      <LifestyleCarousel />
    </div>
  )
}
