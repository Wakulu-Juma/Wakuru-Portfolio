import { motion } from 'framer-motion'
import TypewriterText from './TypewriterText'

const Hero = () => {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(208,120,200,0.2),rgba(35,26,56,0.1),rgba(148,163,184,0.15))] bg-[length:200%_200%] animate-shimmer"
      />
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-center justify-center gap-6 text-center lg:items-start lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.4em] text-roseglow-300"
          >
            Final-year software developer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-slate-100"
          >
            Wakuru Juma Gilagali
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-200"
          >
            <TypewriterText
              texts={[
                'Frontend & Backend Developer',
                'Data Analyst',
                'AI Enthusiast'
              ]}
            />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-xl text-base md:text-lg text-slate-300"
          >
            Final-year student at Eastern Africa Statistical Training Centre (EASTC), expected to graduate in July 2026.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl text-sm md:text-base text-slate-300"
          >
            Passionate about building modern web applications, analyzing data, and applying AI solutions to real-world problems.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <a href="#projects" className="btn-primary">
              View My Work
            </a>
            <button type="button" className="btn-secondary">
              Download Resume
            </button>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="rounded-[2.7rem] bg-gradient-to-br from-roseglow-400/60 via-aqua-300/30 to-ink-400/40 p-[1px] shadow-glow">
            <div className="relative min-h-[340px] w-full max-w-sm rounded-[2.6rem] border border-white/10 bg-ink-900/80 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex h-full flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-aqua-300">Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {['Software Engineering', 'Data Analysis', 'Machine Learning', 'AI Research'].map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-aqua-300">Core Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Python', 'SQL'].map((item) => (
                      <span key={item} className="chip chip-muted">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-roseglow-300">Status</p>
                  <p className="mt-2 text-sm text-slate-200">Open to internships and research collaborations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400 md:flex">
        <span>Scroll</span>
        <span className="h-10 w-5 rounded-full border border-white/20">
          <span className="scroll-dot" />
        </span>
      </div>
    </section>
  )
}

export default Hero
