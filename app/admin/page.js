"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, CheckCircle2, ImagePlus, Upload } from 'lucide-react'
import { adminDelete, adminGet, adminPost, adminPut, getAdminToken, setAdminToken } from '../../services/adminApi'
import { API_BASE } from '../../services/api'

const tabs = ['profile', 'about', 'projects', 'skills', 'education', 'messages']

const emptyProfile = {
  name: '',
  title: '',
  summary: '',
  bio: '',
  intro: '',
  projectsStat: '',
  researchStat: '',
  availabilityStat: '',
  resumeUrl: '',
  avatarUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  email: ''
}

const emptyAbout = {
  content: '',
  extra: ''
}

const emptyProject = {
  title: '',
  description: '',
  techText: '',
  github: '',
  demo: '',
  featured: false
}

const emptySkill = { name: '', level: 0, icon: '', category: '' }

const emptyEducation = { school: '', degree: '', field: '', startYear: '', endYear: '', description: '' }

function splitTech(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function resolveImageSrc(src) {
  if (!src) {
    return ''
  }

  if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }

  return new URL(src, API_BASE).toString()
}

function statusClassName(type) {
  if (type === 'success') {
    return 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100'
  }

  if (type === 'error') {
    return 'border-roseglow-300/40 bg-roseglow-400/10 text-roseglow-100'
  }

  return 'border-sky-400/30 bg-sky-400/10 text-sky-100'
}

function ActionFeedback({ feedback, scope, className = 'mt-4' }) {
  const item = feedback[scope]

  if (!item?.message) {
    return null
  }

  return (
    <div className={`rounded-2xl border p-3 text-sm ${statusClassName(item.type)} ${className}`} role="status" aria-live="polite">
      <div className="flex items-start gap-2">
        {item.type === 'success' ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        ) : (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        )}
        <span>{item.message}</span>
      </div>
    </div>
  )
}

function AdminPageContent() {
  // initialize as empty on server to avoid hydration mismatch; populate on mount
  const [token, setTokenState] = useState('')
  const [session, setSession] = useState(null)
  const [feedback, setFeedback] = useState({})
  const [activeTab, setActiveTab] = useState('profile')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [profile, setProfile] = useState(emptyProfile)
  const [aboutForm, setAboutForm] = useState(emptyAbout)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [education, setEducation] = useState([])
  const [messages, setMessages] = useState([])
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [skillForm, setSkillForm] = useState(emptySkill)
  const [educationForm, setEducationForm] = useState(emptyEducation)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [warningSeconds, setWarningSeconds] = useState(0)
  const [isAvatarDragging, setIsAvatarDragging] = useState(false)

  const [lastActivity, setLastActivity] = useState(Date.now())

  const avatarInputRef = useRef(null)

  const router = useRouter()

  const INACTIVITY_LIMIT = 300 // seconds (5 minutes)
  const WARNING_DURATION = 45 // seconds before logout to show warning

  const authed = Boolean(token)

  function setStatus(scope, type, message) {
    setFeedback((current) => ({ ...current, [scope]: { type, message } }))
  }

  function clearStatus(scope) {
    setFeedback((current) => {
      if (!current[scope]) {
        return current
      }

      const next = { ...current }
      delete next[scope]
      return next
    })
  }

  function handleAvatarSelection(file) {
    if (!file) {
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setStatus('profile-avatar', 'info', `Image selected: ${file.name}. Save profile to upload it.`)
  }

  function clearAvatarSelection() {
    setAvatarFile(null)
    setAvatarPreview(profile.avatarUrl ? resolveImageSrc(profile.avatarUrl) : '')
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ''
    }
  }

  // populate token from localStorage on client mount
  useEffect(() => {
    setTokenState(getAdminToken())
  }, [])

  async function loadData() {
    const [sessionData, profileData, aboutData, projectData, skillData, educationData, messageData] = await Promise.all([
      adminGet('/session'),
      adminGet('/profile'),
      adminGet('/about'),
      adminGet('/projects'),
      adminGet('/skills'),
      adminGet('/education'),
      adminGet('/contacts')
    ])

    setSession(sessionData)
    setProfile(profileData || emptyProfile)
    setAboutForm({
      content: aboutData?.content || profileData?.bio || '',
      extra: aboutData?.extra || profileData?.summary || ''
    })
    setProjects(projectData || [])
    setSkills(skillData || [])
    setEducation(educationData || [])
    setMessages(messageData || [])
    setAvatarPreview(profileData?.avatarUrl ? resolveImageSrc(profileData.avatarUrl) : '')
  }

  useEffect(() => {
    if (!token) {
      return undefined
    }

    loadData().catch((error) => {
      console.error(error)
      setStatus('session', 'error', error?.message || 'Session expired.')
      handleLogout()
    })
  }, [token])

  // inactivity countdown handler used to show warning and auto-logout
  // keep previous warningSeconds behavior by computing remaining time

  // inactivity tracking: reset on user events, auto-logout after INACTIVITY_LIMIT
  useEffect(() => {
    if (!token) return undefined

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    const reset = () => setLastActivity(Date.now())

    events.forEach((ev) => window.addEventListener(ev, reset))
    // initialize
    setLastActivity(Date.now())

    return () => events.forEach((ev) => window.removeEventListener(ev, reset))
  }, [token])

  // interval to compute remaining inactivity time and trigger logout
  useEffect(() => {
    if (!token) return undefined

    const tick = () => {
      const elapsed = Math.floor((Date.now() - lastActivity) / 1000)
      const remaining = INACTIVITY_LIMIT - elapsed
      if (remaining <= 0) {
        handleLogout()
        return
      }
      // show countdown when within warning duration
      if (remaining <= WARNING_DURATION) {
        setWarningSeconds(remaining)
      } else {
        setWarningSeconds(0)
      }
    }

    const id = window.setInterval(tick, 1000)
    // run immediately
    tick()
    return () => window.clearInterval(id)
  }, [token, lastActivity])

  function handleLogout() {
    setAdminToken('')
    setTokenState('')
    setSession(null)
    clearStatus('session')
    // redirect to home page after logout
    try {
      router.push('/')
    } catch (e) {
      // ignore in environments without router
    }
  }

  async function handleLogin(event) {
    event.preventDefault()

    try {
      const result = await adminPost('/login', loginForm)
      setAdminToken(result.token)
      setTokenState(result.token)
      setLoginForm({ email: '', password: '' })
      setStatus('login', 'success', 'Signed in successfully.')
    } catch (error) {
      console.error(error)
      setStatus('login', 'error', error?.message || 'Invalid credentials.')
    }
  }

  async function saveProfile() {
    try {
      const formData = new FormData()

      Object.entries(profile).forEach(([key, value]) => {
        if (key === 'avatarUrl') {
          return
        }

        formData.append(key, value || '')
      })

      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      const updated = await adminPut('/profile', formData)
      setProfile(updated)
      setAboutForm({
        content: updated?.bio || '',
        extra: updated?.summary || ''
      })
      setAvatarPreview(updated?.avatarUrl ? resolveImageSrc(updated.avatarUrl) : '')
      setAvatarFile(null)
      setStatus('profile-save', 'success', avatarFile ? 'Profile saved and image uploaded successfully.' : 'Profile saved successfully.')
    } catch (error) {
      console.error(error)
      setStatus('profile-save', 'error', error?.message || 'Failed to save profile.')
    }
  }

  async function saveAbout() {
    try {
      const updated = await adminPut('/about', aboutForm)
      const nextContent = updated?.bio || aboutForm.content
      const nextExtra = updated?.summary || aboutForm.extra

      setProfile((current) => ({
        ...current,
        bio: nextContent,
        summary: nextExtra
      }))
      setAboutForm({ content: nextContent, extra: nextExtra })
      setStatus('about-save', 'success', 'About section saved successfully.')
    } catch (error) {
      console.error(error)
      setStatus('about-save', 'error', error?.message || 'Failed to save about section.')
    }
  }

  async function createProject(event) {
    event.preventDefault()
    try {
      const result = await adminPost('/projects', {
        ...projectForm,
        tech: splitTech(projectForm.techText)
      })
      setProjects((current) => [result, ...current])
      setProjectForm(emptyProject)
      setStatus('project-create', 'success', 'Project created successfully.')
    } catch (error) {
      console.error(error)
      setStatus('project-create', 'error', error?.message || 'Failed to create project.')
    }
  }

  async function saveProject(project) {
    const scope = `project-${project.id}`

    try {
      const result = await adminPut(`/projects/${project.id}`, project)
      setProjects((current) => current.map((item) => (item.id === project.id ? result : item)))
      setStatus(scope, 'success', 'Project updated successfully.')
    } catch (error) {
      console.error(error)
      setStatus(scope, 'error', error?.message || 'Failed to update project.')
    }
  }

  async function removeProject(projectId) {
    const scope = `project-${projectId}`

    try {
      await adminDelete(`/projects/${projectId}`)
      setStatus(scope, 'success', 'Project deleted successfully.')
      window.setTimeout(() => {
        setProjects((current) => current.filter((item) => item.id !== projectId))
        clearStatus(scope)
      }, 1600)
    } catch (error) {
      console.error(error)
      setStatus(scope, 'error', error?.message || 'Failed to delete project.')
    }
  }

  async function createSkill(event) {
    event.preventDefault()
    try {
      const result = await adminPost('/skills', skillForm)
      setSkills((current) => [result, ...current])
      setSkillForm(emptySkill)
      setStatus('skill-create', 'success', 'Skill created successfully.')
    } catch (error) {
      console.error(error)
      setStatus('skill-create', 'error', error?.message || 'Failed to create skill.')
    }
  }

  async function saveSkill(skill) {
    const scope = `skill-${skill.id}`

    try {
      const result = await adminPut(`/skills/${skill.id}`, skill)
      setSkills((current) => current.map((item) => (item.id === skill.id ? result : item)))
      setStatus(scope, 'success', 'Skill updated successfully.')
    } catch (error) {
      console.error(error)
      setStatus(scope, 'error', error?.message || 'Failed to update skill.')
    }
  }

  async function removeSkill(skillId) {
    const scope = `skill-${skillId}`

    try {
      await adminDelete(`/skills/${skillId}`)
      setStatus(scope, 'success', 'Skill deleted successfully.')
      window.setTimeout(() => {
        setSkills((current) => current.filter((item) => item.id !== skillId))
        clearStatus(scope)
      }, 1600)
    } catch (error) {
      console.error(error)
      setStatus(scope, 'error', error?.message || 'Failed to delete skill.')
    }
  }

  async function createEducation(event) {
    event.preventDefault()
    try {
      const result = await adminPost('/education', educationForm)
      setEducation((current) => [result, ...current])
      setEducationForm(emptyEducation)
      setStatus('education-create', 'success', 'Education created successfully.')
    } catch (error) {
      console.error(error)
      setStatus('education-create', 'error', error?.message || 'Failed to create education record.')
    }
  }

  async function saveEducation(record) {
    const scope = `education-${record.id}`

    try {
      const result = await adminPut(`/education/${record.id}`, record)
      setEducation((current) => current.map((item) => (item.id === record.id ? result : item)))
      setStatus(scope, 'success', 'Education updated successfully.')
    } catch (error) {
      console.error(error)
      setStatus(scope, 'error', error?.message || 'Failed to update education record.')
    }
  }

  async function removeEducation(recordId) {
    const scope = `education-${recordId}`

    try {
      await adminDelete(`/education/${recordId}`)
      setStatus(scope, 'success', 'Education deleted successfully.')
      window.setTimeout(() => {
        setEducation((current) => current.filter((item) => item.id !== recordId))
        clearStatus(scope)
      }, 1600)
    } catch (error) {
      console.error(error)
      setStatus(scope, 'error', error?.message || 'Failed to delete education record.')
    }
  }

  async function removeMessage(messageId) {
    const scope = `message-${messageId}`

    try {
      await adminDelete(`/contacts/${messageId}`)
      setStatus(scope, 'success', 'Message deleted successfully.')
      window.setTimeout(() => {
        setMessages((current) => current.filter((item) => item.id !== messageId))
        clearStatus(scope)
      }, 1600)
    } catch (error) {
      console.error(error)
      setStatus(scope, 'error', error?.message || 'Failed to delete message.')
    }
  }

  const sessionLabel = useMemo(() => {
    if (!session?.lastActivity) {
      return 'unknown'
    }

    return new Date(session.lastActivity).toLocaleString()
  }, [session])

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-12">
        <section className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-xl">
          <a
            href="/"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-roseglow-300/50 hover:bg-white/10"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
          <p className="text-sm uppercase tracking-[0.3em] text-roseglow-300">Admin Dashboard</p>
          <h1 className="mt-3 font-display text-3xl text-white">Sign in</h1>
          <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
            <input
              className="input-field"
              type="email"
              placeholder="Admin email"
              value={loginForm.email}
              onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
            />
            <button type="submit" className="btn-primary justify-self-start">
              Sign in
            </button>
            <ActionFeedback feedback={feedback} scope="login" />
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-10">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-roseglow-300">Admin Dashboard</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">Portfolio content management</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">Session active. Last activity: {sessionLabel}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
        {warningSeconds ? (
          <p className="mt-6 rounded-2xl border border-roseglow-300/40 bg-roseglow-400/10 p-4 text-sm text-roseglow-200">
            Inactivity logout in {warningSeconds}s
          </p>
        ) : null}
        <ActionFeedback feedback={feedback} scope="session" className="mt-4" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-2xl border px-5 py-4 text-left transition ${
              activeTab === tab ? 'border-roseglow-300/70 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            <span className="block text-lg font-semibold capitalize">{tab}</span>
            <span className="block text-sm opacity-75">Open editor</span>
          </button>
        ))}
      </section>

      {activeTab === 'profile' ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <form
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft"
            onSubmit={(event) => {
              event.preventDefault()
              saveProfile()
            }}
          >
            <h2 className="text-2xl font-semibold text-white">Profile</h2>
            <p className="mt-2 text-sm text-slate-300">Edit the hero copy, stats, contact links, and portrait from one place.</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ['name', 'Name'],
                ['title', 'Title'],
                ['summary', 'Summary'],
                ['bio', 'Bio'],
                ['intro', 'Intro paragraph'],
                ['projectsStat', 'Projects stat'],
                ['researchStat', 'Research stat'],
                ['availabilityStat', 'Availability stat'],
                ['githubUrl', 'GitHub URL'],
                ['linkedinUrl', 'LinkedIn URL'],
                ['email', 'Email']
              ].map(([field, label]) => (
                <div key={field} className={field === 'bio' ? 'md:col-span-2' : ''}>
                  {field === 'bio' ? (
                    <textarea
                      className="input-field min-h-32"
                      placeholder={label}
                      value={profile[field] || ''}
                      onChange={(event) => setProfile((current) => ({ ...current, [field]: event.target.value }))}
                    />
                  ) : (
                    <input
                      className="input-field"
                      placeholder={label}
                      value={profile[field] || ''}
                      onChange={(event) => setProfile((current) => ({ ...current, [field]: event.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div
                className={`rounded-[1.5rem] border border-dashed p-4 transition ${isAvatarDragging ? 'border-roseglow-300/60 bg-white/[0.08]' : 'border-white/15 bg-white/[0.04]'} cursor-pointer`}
                role="button"
                tabIndex={0}
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsAvatarDragging(true)
                }}
                onDragLeave={() => setIsAvatarDragging(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setIsAvatarDragging(false)
                  const file = event.dataTransfer.files?.[0] || null
                  handleAvatarSelection(file)
                }}
                onClick={() => avatarInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    avatarInputRef.current?.click()
                  }
                }}
              >
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleAvatarSelection(event.target.files?.[0] || null)}
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-roseglow-200">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/45">Hero portrait</p>
                    <p className="mt-2 text-sm text-white/80">Drag and drop an image here or choose a file. Save profile to upload it.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary gap-2"
                    onClick={(event) => {
                      event.stopPropagation()
                      avatarInputRef.current?.click()
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    Choose image
                  </button>
                </div>
                {avatarFile ? (
                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/80">
                    <span className="truncate">Selected: {avatarFile.name}</span>
                    <button type="button" className="text-xs uppercase tracking-[0.2em] text-roseglow-200" onClick={(event) => { event.stopPropagation(); clearAvatarSelection() }}>
                      Clear
                    </button>
                  </div>
                ) : null}
                <ActionFeedback feedback={feedback} scope="profile-avatar" className="mt-4" />
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.05)]">
                <div className="grid min-h-56 place-items-center p-3">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Portrait preview" className="h-56 w-full rounded-[1.2rem] object-cover" />
                  ) : (
                    <div className="flex h-56 w-full items-center justify-center rounded-[1.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,182,193,0.12),rgba(183,153,255,0.12))] text-center text-sm text-white/60">
                      Portrait preview will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button type="submit" className="btn-primary justify-self-start">
                Save profile
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={clearAvatarSelection}
              >
                Reset preview
              </button>
            </div>
            <ActionFeedback feedback={feedback} scope="profile-save" />
          </form>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-white">Snapshot</h3>
            <p className="mt-3 text-sm text-slate-300">{profile.name || 'Wakuru Juma Gilagali'}</p>
            <p className="mt-2 text-sm text-slate-300">{profile.title || 'Final-year software developer'}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{profile.summary || 'Software Engineer · Data Analyst · AI Builder'}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{profile.bio || 'Final-year student at Eastern Africa Statistical Training Centre (EASTC), expected to graduate in July 2026.'}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{profile.intro || 'Passionate about building modern web applications, analyzing data, and applying AI solutions to real-world problems.'}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Projects', value: profile.projectsStat || '18+' },
                { label: 'Research', value: profile.researchStat || 'AI + Data' },
                { label: 'Availability', value: profile.availabilityStat || 'Open to collaborate' }
              ].map((item) => (
                <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'about' ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <form className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft" onSubmit={(event) => { event.preventDefault(); saveAbout() }}>
            <h2 className="text-2xl font-semibold text-white">About</h2>
            <p className="mt-2 text-sm text-slate-300">Edit the public About section copy shown on the front end.</p>
            <div className="mt-5 grid gap-4">
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/45">About paragraph</label>
                <textarea
                  className="input-field min-h-36"
                  placeholder="About paragraph"
                  value={aboutForm.content}
                  onChange={(event) => setAboutForm((current) => ({ ...current, content: event.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.25em] text-white/45">Support paragraph</label>
                <textarea
                  className="input-field min-h-36"
                  placeholder="Support paragraph"
                  value={aboutForm.extra}
                  onChange={(event) => setAboutForm((current) => ({ ...current, extra: event.target.value }))}
                />
              </div>
              <button type="submit" className="btn-primary justify-self-start">Save about section</button>
              <ActionFeedback feedback={feedback} scope="about-save" />
            </div>
          </form>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-white">Public preview</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{aboutForm.content || 'Final-year student engineer specializing in frontend, backend, and data science.'}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{aboutForm.extra || 'Focused on building human-centered, intelligent products for real-world impact.'}</p>
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75">
              This content powers the front-end About section.
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'projects' ? (
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft" onSubmit={createProject}>
            <h2 className="text-2xl font-semibold text-white">Add project</h2>
            <div className="mt-4 grid gap-4">
              <input className="input-field" placeholder="Title" value={projectForm.title} onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))} />
              <textarea className="input-field min-h-32" placeholder="Description" value={projectForm.description} onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))} />
              <input className="input-field" placeholder="Tech comma separated" value={projectForm.techText} onChange={(event) => setProjectForm((current) => ({ ...current, techText: event.target.value }))} />
              <input className="input-field" placeholder="GitHub" value={projectForm.github} onChange={(event) => setProjectForm((current) => ({ ...current, github: event.target.value }))} />
              <input className="input-field" placeholder="Demo" value={projectForm.demo} onChange={(event) => setProjectForm((current) => ({ ...current, demo: event.target.value }))} />
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" checked={projectForm.featured} onChange={(event) => setProjectForm((current) => ({ ...current, featured: event.target.checked }))} />
                Featured
              </label>
              <button type="submit" className="btn-primary justify-self-start">Create project</button>
              <ActionFeedback feedback={feedback} scope="project-create" />
            </div>
          </form>

          <div className="grid gap-4">
            {projects.map((project) => (
              <article key={project.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <input className="input-field" value={project.title || ''} onChange={(event) => setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, title: event.target.value } : item)))} />
                <textarea className="input-field mt-3 min-h-24" value={project.description || ''} onChange={(event) => setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, description: event.target.value } : item)))} />
                <input className="input-field mt-3" value={(project.tech || []).join(', ')} onChange={(event) => setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, tech: splitTech(event.target.value) } : item)))} />
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button type="button" className="btn-secondary" onClick={() => saveProject(project)}>Save</button>
                    <button type="button" className="btn-secondary" onClick={() => removeProject(project.id)}>Delete</button>
                  </div>
                  <ActionFeedback feedback={feedback} scope={`project-${project.id}`} className="mt-0" />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'skills' ? (
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <form className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft" onSubmit={createSkill}>
            <h2 className="text-2xl font-semibold text-white">Add skill</h2>
            <div className="mt-4 grid gap-4">
              <input className="input-field" placeholder="Name" value={skillForm.name} onChange={(event) => setSkillForm((current) => ({ ...current, name: event.target.value }))} />
              <input className="input-field" placeholder="Level" type="number" value={skillForm.level} onChange={(event) => setSkillForm((current) => ({ ...current, level: Number(event.target.value) }))} />
              <input className="input-field" placeholder="Icon" value={skillForm.icon} onChange={(event) => setSkillForm((current) => ({ ...current, icon: event.target.value }))} />
              <input className="input-field" placeholder="Category" value={skillForm.category} onChange={(event) => setSkillForm((current) => ({ ...current, category: event.target.value }))} />
              <button type="submit" className="btn-primary justify-self-start">Create skill</button>
              <ActionFeedback feedback={feedback} scope="skill-create" />
            </div>
          </form>

          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill) => (
              <article key={skill.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <input className="input-field" value={skill.name || ''} onChange={(event) => setSkills((current) => current.map((item) => (item.id === skill.id ? { ...item, name: event.target.value } : item)))} />
                <input className="input-field mt-3" placeholder="Category" value={skill.category || ''} onChange={(event) => setSkills((current) => current.map((item) => (item.id === skill.id ? { ...item, category: event.target.value } : item)))} />
                <input className="input-field mt-3" type="number" placeholder="Level" value={skill.level ?? 0} onChange={(event) => setSkills((current) => current.map((item) => (item.id === skill.id ? { ...item, level: Number(event.target.value) } : item)))} />
                <input className="input-field mt-3" placeholder="Icon" value={skill.icon || ''} onChange={(event) => setSkills((current) => current.map((item) => (item.id === skill.id ? { ...item, icon: event.target.value } : item)))} />
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button type="button" className="btn-secondary" onClick={() => saveSkill(skill)}>Save</button>
                    <button type="button" className="btn-secondary" onClick={() => removeSkill(skill.id)}>Delete</button>
                  </div>
                  <ActionFeedback feedback={feedback} scope={`skill-${skill.id}`} className="mt-0" />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'education' ? (
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <form className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft" onSubmit={createEducation}>
            <h2 className="text-2xl font-semibold text-white">Add education</h2>
            <div className="mt-4 grid gap-4">
              <input className="input-field" placeholder="School" value={educationForm.school} onChange={(event) => setEducationForm((current) => ({ ...current, school: event.target.value }))} />
              <input className="input-field" placeholder="Degree" value={educationForm.degree} onChange={(event) => setEducationForm((current) => ({ ...current, degree: event.target.value }))} />
              <input className="input-field" placeholder="Field" value={educationForm.field} onChange={(event) => setEducationForm((current) => ({ ...current, field: event.target.value }))} />
              <input className="input-field" placeholder="Start year" type="number" value={educationForm.startYear} onChange={(event) => setEducationForm((current) => ({ ...current, startYear: event.target.value }))} />
              <input className="input-field" placeholder="End year" type="number" value={educationForm.endYear} onChange={(event) => setEducationForm((current) => ({ ...current, endYear: event.target.value }))} />
              <textarea className="input-field min-h-24" placeholder="Description" value={educationForm.description} onChange={(event) => setEducationForm((current) => ({ ...current, description: event.target.value }))} />
              <button type="submit" className="btn-primary justify-self-start">Save education</button>
              <ActionFeedback feedback={feedback} scope="education-create" />
            </div>
          </form>

          <div className="grid gap-4">
            {education.map((item) => (
              <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <input className="input-field" placeholder="School" value={item.school || ''} onChange={(event) => setEducation((current) => current.map((row) => (row.id === item.id ? { ...row, school: event.target.value } : row)))} />
                <input className="input-field mt-3" placeholder="Degree" value={item.degree || ''} onChange={(event) => setEducation((current) => current.map((row) => (row.id === item.id ? { ...row, degree: event.target.value } : row)))} />
                <input className="input-field mt-3" placeholder="Field" value={item.field || ''} onChange={(event) => setEducation((current) => current.map((row) => (row.id === item.id ? { ...row, field: event.target.value } : row)))} />
                <input className="input-field mt-3" type="number" placeholder="Start year" value={item.startYear ?? ''} onChange={(event) => setEducation((current) => current.map((row) => (row.id === item.id ? { ...row, startYear: event.target.value } : row)))} />
                <input className="input-field mt-3" type="number" placeholder="End year" value={item.endYear ?? ''} onChange={(event) => setEducation((current) => current.map((row) => (row.id === item.id ? { ...row, endYear: event.target.value } : row)))} />
                <textarea className="input-field mt-3 min-h-24" placeholder="Description" value={item.description || ''} onChange={(event) => setEducation((current) => current.map((row) => (row.id === item.id ? { ...row, description: event.target.value } : row)))} />
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button type="button" className="btn-secondary" onClick={() => saveEducation(item)}>Save</button>
                    <button type="button" className="btn-secondary" onClick={() => removeEducation(item.id)}>Delete</button>
                  </div>
                  <ActionFeedback feedback={feedback} scope={`education-${item.id}`} className="mt-0" />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'messages' ? (
        <section className="grid gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Contact messages</h2>
            <p className="mt-2 text-sm text-slate-300">Submissions from the public contact form. Each card shows the sender name, email, and message body.</p>
          </div>

          {messages.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
              No messages yet.
            </p>
          ) : null}

          {messages.map((message) => (
            <article key={message.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
              {message.createdAt ? (
                <p className="mb-5 text-xs uppercase tracking-[0.22em] text-white/40">
                  Received {new Date(message.createdAt).toLocaleString()}
                </p>
              ) : null}

              <div className="grid gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">Name</p>
                  <p className="mt-2 text-lg font-semibold text-white">{message.name || '—'}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">Email</p>
                  {message.email ? (
                    <a
                      href={`mailto:${message.email}`}
                      className="mt-2 inline-block text-base text-roseglow-200 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {message.email}
                    </a>
                  ) : (
                    <p className="mt-2 text-base text-slate-300">—</p>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">Message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-200">{message.message || '—'}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button type="button" className="btn-secondary self-start" onClick={() => removeMessage(message.id)}>
                  Delete message
                </button>
                <ActionFeedback feedback={feedback} scope={`message-${message.id}`} className="mt-0" />
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  )
}

export default function AdminPage() {
  return <AdminPageContent />
}