"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Sparkles } from 'lucide-react'
import { API_BASE, get } from '../api'

const Hero = () => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let mounted = true

    get('/api/profile')
      .then((data) => mounted && setProfile(data))
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  const avatarSrc = profile?.avatarUrl ? new URL(profile.avatarUrl, API_BASE).toString() : new URL('/uploads/default-avatar.svg', API_BASE).toString()

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-4 pb-16 pt-24 md:px-6">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(183,153,255,0.12),rgba(255,182,193,0.08),rgba(255,255,255,0.03))] bg-[length:220%_220%] animate-shimmer" />
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="relative flex flex-col gap-7 text-center lg:max-w-2xl lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 self-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.45em] text-roseglow-200 backdrop-blur-md lg:self-start"
          >
            <Sparkles className="h-3.5 w-3.5 text-roseglow-200" />
            Final-year software developer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl font-display text-5xl leading-[0.9] text-balance text-white sm:text-6xl md:text-7xl"
          >
            Wakuru Juma Gilagali
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-sm uppercase tracking-[0.34em] text-white/55 md:text-base"
          >
            Software Engineer · Data Analyst · AI Builder
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-xl text-base leading-8 text-white/78 md:text-lg"
          >
            Final-year student at Eastern Africa Statistical Training Centre (EASTC), expected to graduate in July 2026.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl text-sm leading-7 text-white/68 md:text-base"
          >
            Passionate about building modern web applications, analyzing data, and applying AI solutions to real-world problems.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <a href="#projects" className="btn-primary group gap-2">
              <span>View My Work</span>
              <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
            </a>
            <button type="button" className="btn-secondary group gap-2">
              <Download className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5" />
              Download Resume
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid gap-3 sm:grid-cols-3"
          >
            {[
              { label: 'Projects', value: '18+' },
              { label: 'Research', value: 'AI + Data' },
              { label: 'Availability', value: 'Open to collaborate' }
            ].map((item) => (
              <div key={item.label} className="glass rounded-[1.5rem] p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative w-full max-w-[28rem] rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-[1px] shadow-[0_30px_100px_rgba(12,6,26,0.45)]"
          >
            <div className="relative overflow-hidden rounded-[2.45rem] border border-white/8 bg-[rgba(15,10,31,0.7)] p-6 backdrop-blur-2xl sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,182,193,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(183,153,255,0.16),transparent_34%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent animate-shimmer" />

              <div className="relative flex min-h-[420px] flex-col justify-between gap-6">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,182,193,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(183,153,255,0.16),transparent_34%)]" />
                  <div className="relative grid gap-4 md:grid-cols-[1fr_0.92fr] md:items-center">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/45">Portrait</p>
                      <p className="font-display text-3xl text-white">{profile?.name || 'Wakuru Juma Gilagali'}</p>
                      <p className="max-w-sm text-sm leading-7 text-white/72">{profile?.title || 'Final-year software developer'}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {['Frontend', 'Data Analysis', 'Machine Learning'].map((item) => (
                          <span key={item} className="chip chip-muted">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="relative mx-auto aspect-[4/5] w-full max-w-[16rem] overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_24px_70px_rgba(255,182,193,0.14)]">
                      <img
                        src={avatarSrc}
                        alt={profile?.name || 'Wakuru portrait'}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,31,0.04),rgba(15,10,31,0.48))]" />
                      <div className="absolute inset-x-4 bottom-4 rounded-[1.4rem] border border-white/10 bg-[rgba(15,10,31,0.62)] p-3 backdrop-blur-2xl">
                        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-roseglow-200">Available for</p>
                        <p className="mt-1 text-sm font-semibold text-white">Research, internships, collaboration</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Current focus', value: 'Elegant web products & AI features' },
                    { label: 'Tooling', value: 'React, Node.js, SQL, Python' },
                    { label: 'Style', value: 'Soft luxury, warm gradients, polished motion' },
                    { label: 'Mindset', value: 'Clear interfaces with measurable value' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="glass rounded-[1.4rem] p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.22em] text-white/45">{String(index + 1).padStart(2, '0')}</p>
                      <p className="mt-2 text-sm font-semibold text-white">{item.label}</p>
                      <p className="mt-1 text-sm leading-7 text-white/72">{item.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,182,193,0.12),rgba(183,153,255,0.1))] p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_35%)]" />
                  <p className="relative text-xs uppercase tracking-[0.25em] text-roseglow-200">Status</p>
                  <p className="relative mt-2 text-sm leading-7 text-white/80">Open to internships, research collaborations, and product-driven engineering opportunities.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
