"use client"

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { API_BASE } from '../api'
import { FALLBACK_PORTFOLIO } from '../data/portfolioFallback'

const Hero = ({ profile = FALLBACK_PORTFOLIO.profile }) => {
  const avatarSrc =
    profile?.avatarUrl && profile.avatarUrl !== '/default-avatar.svg'
      ? new URL(profile.avatarUrl, API_BASE).toString()
      : '/default-avatar.svg'

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-4 pb-16 pt-24 md:px-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(183,153,255,0.12),rgba(255,182,193,0.08),rgba(255,255,255,0.03))] bg-[length:220%_220%] md:animate-shimmer"
      />
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="relative flex flex-col gap-7 text-center lg:max-w-2xl lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 self-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.45em] text-roseglow-200 backdrop-blur-md lg:self-start"
          >
            <Sparkles className="h-3.5 w-3.5 text-roseglow-200" />
            {profile?.title || FALLBACK_PORTFOLIO.profile.title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl font-display text-5xl leading-[0.9] text-balance text-white sm:text-6xl md:text-7xl"
          >
            {profile?.name || FALLBACK_PORTFOLIO.profile.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-sm uppercase tracking-[0.34em] text-white/55 md:text-base"
          >
            {profile?.summary || FALLBACK_PORTFOLIO.profile.summary}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-xl text-base leading-8 text-white/78 md:text-lg"
          >
            {profile?.bio || FALLBACK_PORTFOLIO.profile.bio}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl text-sm leading-7 text-white/68 md:text-base"
          >
            {profile?.intro || FALLBACK_PORTFOLIO.profile.intro}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid gap-3 sm:grid-cols-3"
          >
            {[
              { label: 'Projects', value: profile?.projectsStat || FALLBACK_PORTFOLIO.profile.projectsStat },
              { label: 'Research', value: profile?.researchStat || FALLBACK_PORTFOLIO.profile.researchStat },
              { label: 'Availability', value: profile?.availabilityStat || FALLBACK_PORTFOLIO.profile.availabilityStat }
            ].map((item) => (
              <div key={item.label} className="glass rounded-[1.5rem] p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative flex items-center justify-center"
        >
          <div className="group mx-auto w-full max-w-[min(100%,20rem)] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_30px_100px_rgba(12,6,26,0.45)] sm:max-w-[22rem]">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0f0a1f]">
              <img
                src={avatarSrc}
                alt={profile?.name || FALLBACK_PORTFOLIO.profile.name}
                className="absolute inset-0 h-full w-full object-cover object-[50%_22%] transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
