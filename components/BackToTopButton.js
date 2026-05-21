"use client"

import { ArrowUp } from 'lucide-react'

export default function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[rgba(15,10,31,0.8)] text-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-roseglow-300/60 hover:bg-[rgba(35,14,48,0.9)]"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}