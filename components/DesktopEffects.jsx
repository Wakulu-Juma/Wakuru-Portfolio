"use client"

import { useEffect, useState } from 'react'
import CursorTracker from './CursorTracker'
import BackgroundEffects from '../src/components/BackgroundEffects'

export default function DesktopEffects() {
  const [showHeavyEffects, setShowHeavyEffects] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)')

    const update = () => setShowHeavyEffects(media.matches)
    update()

    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  if (!showHeavyEffects) {
    return <BackgroundEffects lite />
  }

  return (
    <>
      <CursorTracker />
      <div className="cursor-glow" aria-hidden="true" />
      <BackgroundEffects />
    </>
  )
}
