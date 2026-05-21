"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BadgeCheck, GraduationCap, Sparkles, TrendingUp } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { get } from '../api'

const cardData = [
  {
    title: 'Education',
    description:
      'BSc in Official Statistics, Eastern Africa Statistical Training Centre (EASTC). Expected graduation: July 2026.'
  },
  {
    title: 'Technical Skills',
    description:
      'Frontend and backend development, data analysis, machine learning, and AI solution design with a focus on measurable impact.'
  },
  {
    title: 'Career Goals',
    description:
      'Build intelligent, human-centered software systems and grow into a versatile software engineer and data-driven product builder.'
  }
]

const About = () => {
  const [aboutContent, setAboutContent] = useState(null)
  const [stats, setStats] = useState([
    { label: 'Projects', value: '18+' },
    { label: 'Research Focus', value: 'AI + Data' },
    { label: 'Graduation', value: 'Jul 2026' }
  ])

  useEffect(() => {
    let mounted = true
    get('/api/about')
      .then((data) => mounted && setAboutContent(data))
      .catch(() => {})
    return () => (mounted = false)
  }, [])

  return (
    <section id="about" className="section-pad section-alt">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="About"
            title="Building elegant, data-driven digital experiences with a polished creative edge"
            subtitle="I am Wakuru Juma Gilagali, a final-year student at the Eastern Africa Statistical Training Centre (EASTC), expected to graduate in July 2026. I am passionate about frontend and backend development, data analysis, machine learning, and building impactful digital solutions."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="glass rounded-[1.5rem] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.18)]"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.25em] text-white/45">{stat.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {cardData.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="glass rounded-[1.75rem] p-5 shadow-[0_24px_65px_rgba(0,0,0,0.18)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-roseglow-200">
                    {index === 0 ? <GraduationCap className="h-5 w-5" /> : index === 1 ? <BadgeCheck className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">Card {String(index + 1).padStart(2, '0')}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{card.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/72">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="section-shell w-full max-w-[30rem] p-3"
          >
            <div className="section-glow" />
            <div className="relative overflow-hidden rounded-[2rem] p-6">
              <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,182,193,0.2)_0%,transparent_70%)] blur-xl animate-float-slow" />
              <div className="absolute bottom-4 left-4 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(183,153,255,0.18)_0%,transparent_70%)] blur-xl animate-float-slow [animation-delay:-3s]" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,182,193,0.95),rgba(183,153,255,0.9))] text-[#220b2f] shadow-[0_18px_50px_rgba(255,182,193,0.25)]">
                  <span className="text-lg font-bold tracking-[0.2em]">WJG</span>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/45">Profile snapshot</p>
                  <p className="mt-2 font-display text-3xl text-white">Software + Data + AI</p>
                </div>
              </div>

              <div className="relative mt-8 space-y-4 text-sm leading-7 text-white/72">
                <p>{aboutContent?.content || 'Final-year student engineer specializing in frontend, backend, and data science.'}</p>
                <p>{aboutContent?.extra || 'Focused on building human-centered, intelligent products for real-world impact.'}</p>
              </div>

              <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
                {['Research', 'Product', 'Analytics', 'UX Engineering'].map((item, index) => (
                  <div key={item} className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.16)]" style={{ transform: `translateY(${index % 2 === 0 ? '0' : '6px'})` }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
