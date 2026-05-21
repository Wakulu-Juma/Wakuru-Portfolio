import BackgroundEffects from '../src/components/BackgroundEffects'
import Navbar from '../src/components/Navbar'
import Hero from '../src/components/Hero'
import About from '../src/components/About'
import Skills from '../src/components/Skills'
import Projects from '../src/components/Projects'
import Contact from '../src/components/Contact'
import Footer from '../src/components/Footer'
import CursorTracker from '../components/CursorTracker'
import BackToTopButton from '../components/BackToTopButton'

export default function HomePage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden text-white">
      <CursorTracker />
      <div className="cursor-glow" aria-hidden="true" />
      <BackgroundEffects />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  )
}