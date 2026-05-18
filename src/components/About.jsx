import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    let mounted = true
    get('/api/about')
      .then((data) => mounted && setAboutContent(data))
      .catch(() => {})
    return () => (mounted = false)
  }, [])
  return (
    <section id="about" className="section-pad section-alt">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="About"
            title="Building elegant, data-driven digital experiences"
            subtitle="I am Wakuru Juma Gilagali, a final-year student at the Eastern Africa Statistical Training Centre (EASTC), expected to graduate in July 2026. I am passionate about frontend and backend development, data analysis, machine learning, and building impactful digital solutions."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Projects', value: '18+' },
              { label: 'Research Focus', value: 'AI + Data' },
              { label: 'Graduation', value: 'Jul 2026' }
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
              </div>
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
                className="glass rounded-2xl p-5"
              >
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="glass relative w-full max-w-sm rounded-[2.8rem] p-8 text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-roseglow-400 to-aqua-300 text-ink-900">
                <span className="text-lg font-bold">WJG</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-aqua-300">Profile snapshot</p>
                <p className="mt-2 text-lg font-semibold text-white">Software + Data + AI</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p>{aboutContent?.content || 'Final-year student engineer specializing in frontend, backend, and data science.'}</p>
              <p>{aboutContent?.extra || 'Focused on building human-centered, intelligent products for real-world impact.'}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Research', 'Product', 'Analytics', 'UX Engineering'].map((item) => (
                <span key={item} className="chip chip-muted">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
