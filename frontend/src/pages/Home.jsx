import Hero from '../components/home/Hero'
import GenderSplit from '../components/home/GenderSplit'
import CategoryGrid from '../components/home/CategoryGrid'
import StatementBanner from '../components/home/StatementBanner'
import FeaturedCarousel from '../components/home/FeaturedCarousel'
import EditorialBanner from '../components/home/EditorialBanner'
import LifestyleCarousel from '../components/home/LifestyleCarousel'

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCarousel title="Featured Products" />
      <CategoryGrid />
      <EditorialBanner />
      <StatementBanner />
      <GenderSplit />
      <LifestyleCarousel />
    </div>
  )
}
