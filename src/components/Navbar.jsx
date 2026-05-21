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
      const mobileTrigger = document.getElementById('portfolio-menu-trigger-mobile')

      if (
        menu?.contains(event.target) ||
        trigger?.contains(event.target) ||
        mobileTrigger?.contains(event.target)
      ) {
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

  const menuPanel = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-[#090512]/60 md:bg-[#090512]/55"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          <motion.aside
            key="menu-panel"
            id="portfolio-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-4 right-4 top-[4.75rem] z-[90] mx-auto w-full max-w-[20rem] md:left-4 md:right-auto md:top-20"
          >
            <div className="glass max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-[1.85rem] border-white/10 bg-[rgba(15,10,31,0.96)] p-3 shadow-[0_26px_80px_rgba(0,0,0,0.34)]">
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
                    <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/45">Wakuru</p>
                    <p className="mt-1 text-sm font-semibold text-white">Juma Gilagali</p>
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
                            activeState ? 'text-roseglow-200' : 'text-white/45 group-hover:text-white'
                          }`}
                        />
                        <span>{link.label}</span>
                        <Circle
                          className={`ml-auto h-2 w-2 ${
                            activeState ? 'fill-roseglow-300 text-roseglow-300' : 'text-white/20'
                          }`}
                        />
                      </a>
                    )
                  })}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <a href="/admin" className="btn-primary w-full gap-2" onClick={() => setOpen(false)}>
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
  )

  return (
    <>
      {/* Mobile: compact bar always on top — menu always tappable */}
      <div
        className={`fixed inset-x-4 top-4 z-[70] flex items-center justify-between gap-3 rounded-[1.35rem] border px-3 py-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.34)] transition-colors duration-300 md:hidden ${
          hasScrolled ? 'border-white/12 bg-[rgba(15,10,31,0.94)]' : 'border-white/10 bg-[rgba(15,10,31,0.88)]'
        }`}
      >
        <a
          href="#home"
          className="flex min-w-0 items-center gap-2.5 rounded-[1.1rem] border border-white/10 bg-white/[0.06] px-3 py-2"
          aria-label="Go to home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(255,182,193,0.92),rgba(183,153,255,0.92))] text-[#220b2f]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="truncate text-sm font-semibold text-white">Wakuru Juma</span>
        </a>

        <button
          id="portfolio-menu-trigger-mobile"
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm font-semibold text-white touch-manipulation"
          aria-expanded={open}
          aria-controls="portfolio-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          Menu
        </button>
      </div>

      {/* Desktop: full header at top, compact menu button after scroll */}
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={hasScrolled ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`fixed left-6 top-4 z-50 hidden w-[min(96vw,72rem)] md:block lg:left-20 ${hasScrolled ? 'invisible pointer-events-none' : 'visible pointer-events-auto'}`}
      >
        <div
          className={`relative flex flex-col gap-4 rounded-[1.9rem] border px-5 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-colors duration-300 sm:flex-row sm:items-center lg:px-6 lg:pr-8 ${open ? 'pr-20' : 'pr-6'} border-white/10 bg-[rgba(15,10,31,0.82)]`}
        >
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
        initial={false}
        animate={hasScrolled ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`fixed left-6 top-4 z-[60] hidden items-center gap-2 rounded-full border border-white/15 bg-[rgba(22,12,42,0.94)] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-0.5 hover:border-roseglow-300/40 md:flex touch-manipulation ${hasScrolled ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-expanded={open}
        aria-controls="portfolio-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Menu
      </motion.button>

      {menuPanel}
    </>
  )
}

export default Navbar
