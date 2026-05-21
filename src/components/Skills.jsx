"use client"

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { FALLBACK_PORTFOLIO } from '../data/portfolioFallback'

const Skills = ({ skills = FALLBACK_PORTFOLIO.skills }) => {
  const display = skills.length ? skills : FALLBACK_PORTFOLIO.skills

  return (
    <section id="skills" className="section-pad">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
        <SectionHeading
          eyebrow="Skills"
          title="Technical strengths presented as luminous skill stories"
          subtitle="A balance of engineering fundamentals, data analysis proficiency, and hands-on AI development shaped into a premium visual system."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {display.map((skill, index) => (
            <motion.div
              key={skill.id || skill.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className="skill-card relative overflow-hidden md:transition-transform md:hover:-translate-y-1.5 md:hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,182,193,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(183,153,255,0.1),transparent_28%)]" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="skill-icon" aria-hidden="true">
                    <i className={`bi ${skill.icon}`} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{skill.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/40">{skill.category || 'Core skill'}</p>
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(255,182,193,0.16),rgba(183,153,255,0.16))] text-xs font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]" style={{ backgroundImage: `conic-gradient(from 180deg, rgba(255,182,193,0.95) 0deg, rgba(183,153,255,0.95) ${Math.min(skill.level || 60, 100) * 3.6}deg, rgba(255,255,255,0.06) 0deg)` }}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#130a24] text-[0.7rem] text-white/90">
                    {skill.level || 60}%
                  </span>
                </div>
              </div>

              <div className="relative mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
                  <Sparkles className="h-3.5 w-3.5 text-roseglow-200" />
                  {skill.icon}
                </div>
                <span className="chip chip-muted">Adaptive depth</span>
              </div>

              <div className="relative mt-5 h-px w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level || 60}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,182,193,0.95),rgba(183,153,255,0.95),rgba(255,255,255,0.9))]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
