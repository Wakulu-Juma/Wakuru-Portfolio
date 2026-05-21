"use client"

import { Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[rgba(15,10,31,0.55)] px-6 py-8 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 md:flex-row md:items-center">
        
        <div className="flex items-center gap-3">
          <a className="icon-button" href="#">
            <span className="sr-only">GitHub</span>
            <Github className="h-4 w-4" />
          </a>
          <a className="icon-button" href="#">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-4 w-4" />
          </a>
          <a className="icon-button" href="#">
            <span className="sr-only">Email</span>
            <Mail className="h-4 w-4" />
          </a>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/60">
            Scroll anytime
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
