import './globals.css'
import { Cormorant_Garamond, Manrope } from 'next/font/google'

const headingFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700']
})

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
})

export const metadata = {
  title: 'Wakuru Juma Gilagali | Software Engineer & Data Analyst',
  description: 'Elegant portfolio and admin dashboard for Wakuru Juma Gilagali.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <div id="portfolio-nav-slot" />
        {children}
      </body>
    </html>
  )
}