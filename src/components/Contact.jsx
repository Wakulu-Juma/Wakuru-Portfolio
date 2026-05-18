import { motion } from 'framer-motion'
import { useState } from 'react'
import SectionHeading from './SectionHeading'
import { post, API_BASE } from '../api'

const Contact = () => {
  const [status, setStatus] = useState({ type: null, text: '' })
  return (
    <section id="contact" className="section-pad">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Contact"
            title="Let us build something meaningful"
            subtitle="Interested in collaboration, research, or internships? Send a message and I will respond."
          />

          <div className="flex flex-wrap gap-4">
            <a className="icon-button" href="#">
              <span className="sr-only">GitHub</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.48 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.12-1.5-1.12-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.94.85.09-.66.35-1.11.64-1.36-2.22-.26-4.56-1.14-4.56-5.09 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.33c.85 0 1.71.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.56 1.43.21 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.96-2.35 4.83-4.58 5.08.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .26.18.58.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
              </svg>
            </a>
            <a className="icon-button" href="#">
              <span className="sr-only">LinkedIn</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.5 9H6v9h2.5V9zm-1.2-1.1c.8 0 1.4-.6 1.4-1.4S8.1 5.1 7.3 5.1s-1.4.6-1.4 1.4.6 1.4 1.4 1.4zM18 13.2c0-2.4-1.3-3.6-3.1-3.6-1.4 0-2 .8-2.3 1.4V9H10v9h2.5v-4.4c0-1.2.2-2.3 1.7-2.3 1.4 0 1.4 1.3 1.4 2.4V18H18v-4.8z" />
              </svg>
            </a>
            <a className="icon-button" href="#">
              <span className="sr-only">Email</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v.01L12 12l8-4.99V7H4zm0 10h16V9.2l-7.48 4.68a1 1 0 0 1-1.04 0L4 9.2V17z" />
              </svg>
            </a>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="glass flex flex-col gap-4 rounded-3xl p-6"
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
          <div>
            <label className="text-sm text-slate-200" htmlFor="name">Name</label>
            <input id="name" type="text" name="name" className="input-field" placeholder="Your name" required />
          </div>
          <div>
            <label className="text-sm text-slate-200" htmlFor="email">Email</label>
            <input id="email" type="email" name="email" className="input-field" placeholder="you@email.com" required />
          </div>
          <div>
            <label className="text-sm text-slate-200" htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" className="input-field" placeholder="Write your message" required />
          </div>
          <button type="submit" className="btn-primary">Send Message</button>
          {status.text && (
            <div className={`mt-2 text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`} role="status">
              {status.text}
            </div>
          )}
        </motion.form>
      </div>
    </section>
  )
}

export default Contact
