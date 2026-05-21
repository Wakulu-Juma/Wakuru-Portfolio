"use client"

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Circle, LayoutDashboard, LogIn, Mail, Menu, Sparkles, UserRound, BadgeCheck, FolderKanban, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home', icon: LayoutDashboard },
  { label: 'About', href: '#about', icon: UserRound },
  { label: 'Skills', href: '#skills', icon: BadgeCheck },
  { label: 'Projects', href: '#projects', icon: FolderKanban },
  { label: 'Contact', href: '#contact', icon: Mail }
]

const Navbar = () => {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const sections = navLinks.map((link) => document.querySelector(link.href))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible?.target?.id) {
          setActive(visible.target.id)
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 }
    )

    sections.forEach((section) => section && observer.observe(section))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 8)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollState)
    }
  }, [])

  useEffect(() => {
    function handlePointerDown(event) {
      if (!open) {
        return
      }

      const menu = document.getElementById('portfolio-menu')
      const trigger = document.getElementById('portfolio-menu-trigger')

      if (menu?.contains(event.target) || trigger?.contains(event.target)) {
        return
      }

      setOpen(false)
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    if (open) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={hasScrolled ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`fixed left-4 right-4 top-4 z-50 md:left-6 md:right-auto md:w-[min(96vw,72rem)] lg:left-20 ${hasScrolled ? 'pointer-events-none' : 'pointer-events-auto'}`}
      >
        <div className={`relative flex flex-col gap-4 rounded-[1.9rem] border px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-colors duration-300 sm:flex-row sm:items-center sm:px-5 lg:px-6 lg:pr-8 ${hasScrolled ? 'border-white/12 bg-[rgba(15,10,31,0.58)] backdrop-blur-3xl' : 'border-white/10 bg-[rgba(15,10,31,0.82)]'} ${open ? 'pr-20' : 'pr-6'}`}>
          <a
            href="#home"
            className="group flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.06] px-4 py-3 transition hover:-translate-y-0.5 hover:border-roseglow-300/40"
            aria-label="Go to home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,182,193,0.92),rgba(183,153,255,0.92))] text-[#220b2f] shadow-[0_18px_50px_rgba(255,182,193,0.18)]">
              <Sparkles className="h-5 w-5" />
            </span>

            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/45">Wakuru</p>
              <p className="mt-1 text-sm font-semibold text-white">Juma Gilagali</p>
            </div>
          </a>

          <nav className="flex min-w-0 items-center gap-2 overflow-x-auto sm:ml-auto sm:justify-center">
            {navLinks.map((link) => {
              const Icon = link.icon
              const activeState = active === link.href.slice(1)

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`group flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition duration-300 ${activeState ? 'border-roseglow-300/50 bg-white/10 text-white' : 'border-white/10 bg-white/[0.04] text-white/72 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'}`}
                >
                  <Icon className={`h-4 w-4 ${activeState ? 'text-roseglow-200' : 'text-white/45 group-hover:text-white'}`} />
                  <span>{link.label}</span>
                  <Circle className={`h-2 w-2 ${activeState ? 'fill-roseglow-300 text-roseglow-300' : 'text-white/20'}`} />
                </a>
              )
            })}
          </nav>
        </div>
      </motion.header>

      <motion.button
        id="portfolio-menu-trigger"
        type="button"
        onClick={() => setOpen((current) => !current)}
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={hasScrolled ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`fixed left-4 top-4 z-[60] flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-roseglow-300/40 hover:bg-[rgba(22,12,42,0.94)] ${hasScrolled ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-expanded={open}
        aria-controls="portfolio-menu"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Menu
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[#090512]/55 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.aside
              key="menu-panel"
              id="portfolio-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-4 top-20 z-50 w-[min(90vw,20rem)]"
            >
              <div className="glass max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-[1.85rem] border-white/10 bg-[rgba(15,10,31,0.92)] p-3 shadow-[0_26px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
                <div className="flex flex-col gap-5">
                  <a
                    href="#home"
                    className="group flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-4 transition hover:-translate-y-0.5 hover:border-roseglow-300/40"
                    aria-label="Go to home"
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,182,193,0.92),rgba(183,153,255,0.92))] text-[#220b2f] shadow-[0_18px_50px_rgba(255,182,193,0.18)]">
                      <Sparkles className="h-5 w-5" />
                    </span>

                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/45">
                        Wakuru
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        Juma Gilagali
                      </p>
                    </div>
                  </a>

                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon
                      const activeState = active === link.href.slice(1)

                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`group flex items-center gap-3 rounded-[1.25rem] border px-4 py-3 text-sm transition duration-300 hover:-translate-y-0.5 ${
                            activeState
                              ? 'border-roseglow-300/50 bg-white/10 text-white'
                              : 'border-white/10 bg-white/[0.04] text-white/72 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              activeState
                                ? 'text-roseglow-200'
                                : 'text-white/45 group-hover:text-white'
                            }`}
                          />

                          <span>{link.label}</span>

                          <Circle
                            className={`ml-auto h-2 w-2 ${
                              activeState
                                ? 'fill-roseglow-300 text-roseglow-300'
                                : 'text-white/20'
                            }`}
                          />
                        </a>
                      )
                    })}
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <a
                      href="/admin"
                      className="btn-primary w-full gap-2"
                      onClick={() => setOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      Admin Login
                    </a>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar