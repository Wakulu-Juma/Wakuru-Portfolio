import { useEffect, useState } from 'react'
import { get } from '../services/api'
import { FALLBACK_PORTFOLIO } from '../src/data/portfolioFallback'

function mergeObject(fallback, value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fallback
  }

  return { ...fallback, ...value }
}

function pickArray(value, fallback) {
  return Array.isArray(value) ? value : fallback
}

function buildContactLinks(profile) {
  const github = profile?.githubUrl || FALLBACK_PORTFOLIO.profile.githubUrl
  const linkedin = profile?.linkedinUrl || FALLBACK_PORTFOLIO.profile.linkedinUrl
  const email = profile?.email || FALLBACK_PORTFOLIO.profile.email

  return [
    { label: 'GitHub', href: github || '#', icon: 'Github' },
    { label: 'LinkedIn', href: linkedin || '#', icon: 'Linkedin' },
    { label: 'Email', href: email ? `mailto:${email}` : '#', icon: 'Mail' },
    { label: 'Call / Collaborate', href: email ? `mailto:${email}` : '#', icon: 'PhoneCall' }
  ]
}

export function useFetchPortfolioData() {
  const [state, setState] = useState({
    profile: FALLBACK_PORTFOLIO.profile,
    about: FALLBACK_PORTFOLIO.about,
    skills: FALLBACK_PORTFOLIO.skills,
    projects: FALLBACK_PORTFOLIO.projects,
    education: FALLBACK_PORTFOLIO.education,
    contactLinks: buildContactLinks(FALLBACK_PORTFOLIO.profile)
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      const [profileResult, aboutResult, skillsResult, projectsResult, educationResult] = await Promise.all([
        get('/api/profile').then((value) => ({ ok: true, value })).catch(() => ({ ok: false })),
        get('/api/about').then((value) => ({ ok: true, value })).catch(() => ({ ok: false })),
        get('/api/skills').then((value) => ({ ok: true, value })).catch(() => ({ ok: false })),
        get('/api/projects').then((value) => ({ ok: true, value })).catch(() => ({ ok: false })),
        get('/api/education').then((value) => ({ ok: true, value })).catch(() => ({ ok: false }))
      ])

      if (!mounted) {
        return
      }

      const profile = mergeObject(FALLBACK_PORTFOLIO.profile, profileResult.ok ? profileResult.value : null)
      const about = mergeObject(FALLBACK_PORTFOLIO.about, aboutResult.ok ? aboutResult.value : null)
      const skills = pickArray(skillsResult.ok ? skillsResult.value : null, FALLBACK_PORTFOLIO.skills)
      const projects = pickArray(projectsResult.ok ? projectsResult.value : null, FALLBACK_PORTFOLIO.projects)
      const education = pickArray(educationResult.ok ? educationResult.value : null, FALLBACK_PORTFOLIO.education)

      setState({
        profile,
        about,
        skills,
        projects,
        education,
        contactLinks: buildContactLinks(profile)
      })
      setLoading(false)
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return { ...state, loading }
}