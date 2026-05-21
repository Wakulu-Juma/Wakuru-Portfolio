import { useEffect, useState } from 'react'
import { get } from '../services/api'

export function useFetchPortfolioData() {
  const [state, setState] = useState({
    profile: null,
    about: null,
    skills: [],
    projects: [],
    education: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const [about, skills, projects] = await Promise.all([
          get('/api/about'),
          get('/api/skills'),
          get('/api/projects')
        ])

        if (mounted) {
          setState({
            profile: null,
            about,
            skills,
            projects,
            education: []
          })
        }
      } catch (error) {
        if (mounted) {
          setState((current) => ({ ...current }))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return { ...state, loading }
}