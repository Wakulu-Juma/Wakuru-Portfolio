"use client"

import { useEffect, useState } from 'react'

const TypewriterText = ({ texts = [], speed = 38, pause = 1400 }) => {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!texts.length) {
      return undefined
    }

    const current = texts[index % texts.length]
    let timeout = speed

    if (!isDeleting && subIndex === current.length) {
      timeout = pause
      setIsDeleting(true)
    } else if (isDeleting && subIndex === 0) {
      setIsDeleting(false)
      setIndex((prev) => (prev + 1) % texts.length)
      timeout = 400
    } else {
      timeout = isDeleting ? speed / 2 : speed
    }

    const handle = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1))
    }, timeout)

    return () => clearTimeout(handle)
  }, [texts, index, subIndex, isDeleting, speed, pause])

  const display = texts.length ? texts[index % texts.length].substring(0, subIndex) : ''

  return (
    <span className="typewriter bg-gradient-to-r from-roseglow-200 via-white to-lavender-200 bg-clip-text text-transparent" aria-live="polite">
      {display}
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  )
}

export default TypewriterText
