"use client"

import { useEffect } from 'react'

export default function CursorTracker() {
  useEffect(() => {
    const handleMove = (event) => {
      const root = document.documentElement
      root.style.setProperty('--cursor-x', `${event.clientX}px`)
      root.style.setProperty('--cursor-y', `${event.clientY}px`)
    }

    window.addEventListener('pointermove', handleMove)

    return () => {
      window.removeEventListener('pointermove', handleMove)
    }
  }, [])

  return null
}