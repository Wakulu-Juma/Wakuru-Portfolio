"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowUpRight, Github, Mail, Linkedin, PhoneCall, Sparkles } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { post, API_BASE } from '../api'

const Contact = () => {
  const [status, setStatus] = useState({ type: null, text: '' })

  const contactLinks = [
    { label: 'GitHub', href: '#', icon: Github },
    { label: 'LinkedIn', href: '#', icon: Linkedin },
    { label: 'Email', href: '#', icon: Mail },
    { label: 'Call / Collaborate', href: '#', icon: PhoneCall }
  ]

  return (
    <section id="contact" className="section-pad">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s build something meaningful, beautiful, and technically excellent"
            subtitle="Interested in collaboration, research, internships, or product work? Send a message and I will respond with intention."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {contactLinks.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="glass group flex items-center gap-4 rounded-[1.6rem] p-4 transition duration-300 hover:border-roseglow-300/50"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,182,193,0.15),rgba(183,153,255,0.12))] text-roseglow-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/40">0{index + 1}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/45 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </motion.a>
              )
            })}
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="section-shell relative flex flex-col gap-4 p-3"
          onSubmit={async (event) => {
            event.preventDefault()
            setStatus({ type: null, text: '' })
            console.log('Contact form submitting to', API_BASE + '/api/contact')
            const form = event.currentTarget
            const name = form.name.value
            const email = form.email.value
            const message = form.message.value
            try {
              await post('/api/contact', { name, email, message })
              setStatus({ type: 'success', text: 'Message sent — thank you!' })
              form.reset()
            } catch (err) {
              console.error(err)
              const text = err && err.message ? String(err.message) : 'Failed to send message. Please try again later.'
              setStatus({ type: 'error', text: `${text} (API: ${API_BASE})` })
            }
          }}
        >
          <div className="section-glow" />
          <div className="relative rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.3em] text-roseglow-200">Direct message</p>
                <p className="mt-2 font-display text-3xl text-white">Start a conversation</p>
              </div>
              <Sparkles className="h-5 w-5 text-roseglow-200" />
            </div>

            <div className="grid gap-4">
              {[
                { id: 'name', label: 'Your name', type: 'text', name: 'name' },
                { id: 'email', label: 'Email address', type: 'email', name: 'email' }
              ].map((field) => (
                <div key={field.id} className="relative">
                  <input id={field.id} type={field.type} name={field.name} className="peer input-field pt-6" placeholder=" " required />
                  <label htmlFor={field.id} className="pointer-events-none absolute left-4 top-4 text-sm text-white/45 transition-all peer-focus:top-2 peer-focus:text-[0.68rem] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-roseglow-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/45">
                    {field.label}
                  </label>
                </div>
              ))}

              <div className="relative">
                <textarea id="message" name="message" rows="5" className="peer input-field pt-6" placeholder=" " required />
                <label htmlFor="message" className="pointer-events-none absolute left-4 top-4 text-sm text-white/45 transition-all peer-focus:top-2 peer-focus:text-[0.68rem] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-roseglow-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/45">
                  Message
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary mt-5 w-full gap-2">
              Send Message
              <ArrowUpRight className="h-4 w-4" />
            </button>

            {status.text && (
              <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${status.type === 'success' ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200' : 'border-rose-300/30 bg-rose-300/10 text-rose-200'}`} role="status">
                {status.text}
              </div>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  )
}

export default Contact
