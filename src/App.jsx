import { useEffect } from 'react'
import About from './components/About'
import BackgroundEffects from './components/BackgroundEffects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import Skills from './components/Skills'

const App = () => {
  useEffect(() => {
    const handleMove = (event) => {
      const root = document.documentElement
      root.style.setProperty('--cursor-x', `${event.clientX}px`)
      root.style.setProperty('--cursor-y', `${event.clientY}px`)
    }

    window.addEventListener('mousemove', handleMove)

    return () => {
      window.removeEventListener('mousemove', handleMove)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-900 text-slate-100">
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
    </div>
  )
}

export default App
