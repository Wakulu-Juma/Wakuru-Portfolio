"use client"

import { motion } from 'framer-motion'

const SectionHeading = ({ eyebrow, title, subtitle, align = 'left' }) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${alignClass}`}>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.4em] text-roseglow-200"
      >
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-roseglow-300 to-transparent" />
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl font-display text-4xl leading-[1.05] text-white md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-2xl text-base leading-8 text-white/72 md:text-[1.05rem]"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

export default SectionHeading
