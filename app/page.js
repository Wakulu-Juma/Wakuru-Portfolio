import Navbar from '../src/components/Navbar'
import PortfolioSections from '../src/components/PortfolioSections'
import BackToTopButton from '../components/BackToTopButton'
import DesktopEffects from '../components/DesktopEffects'

export default function HomePage() {
  return (
    <div className="portfolio-root relative isolate min-h-screen overflow-x-hidden text-white">
      <DesktopEffects />
      <Navbar />
      <PortfolioSections />
      <BackToTopButton />
    </div>
  )
}