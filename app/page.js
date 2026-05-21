import Navbar from '../src/components/Navbar'
import PortfolioSections from '../src/components/PortfolioSections'
import CursorTracker from '../components/CursorTracker'
import BackToTopButton from '../components/BackToTopButton'
import BackgroundEffects from '../src/components/BackgroundEffects'

export default function HomePage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden text-white">
      <CursorTracker />
      <div className="cursor-glow" aria-hidden="true" />
      <BackgroundEffects />
      <Navbar />
      <PortfolioSections />
      <BackToTopButton />
    </div>
  )
}