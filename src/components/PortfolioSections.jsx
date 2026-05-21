"use client"

import { useFetchPortfolioData } from '../../hooks/useFetchPortfolioData'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Contact from './Contact'
import Footer from './Footer'

const PortfolioSections = () => {
  const { profile, about, skills, projects, education } = useFetchPortfolioData()

  return (
    <main className="relative z-10">
      <Hero profile={profile} />
      <About about={about} profile={profile} skills={skills} education={education} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </main>
  )
}

export default PortfolioSections
