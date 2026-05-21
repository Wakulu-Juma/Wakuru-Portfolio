"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { adminDelete, adminGet, adminPost, adminPut, getAdminToken, setAdminToken } from '../../services/adminApi'
import { API_BASE } from '../../services/api'

const tabs = ['profile', 'projects', 'skills', 'education', 'messages']

const emptyProfile = {
  name: '',
  title: '',
  summary: '',
  bio: '',
  resumeUrl: '',
  avatarUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  email: ''
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

function AdminPageContent() {
  // initialize as empty on server to avoid hydration mismatch; populate on mount
  const [token, setTokenState] = useState('')
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [profile, setProfile] = useState(emptyProfile)
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

  const [lastActivity, setLastActivity] = useState(Date.now())
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const INACTIVITY_LIMIT = 300 // seconds (5 minutes)
  const WARNING_DURATION = 45 // seconds before logout to show warning

  const authed = Boolean(token)

  // populate token from localStorage on client mount
  useEffect(() => {
    setTokenState(getAdminToken())
  }, [])

  async function loadData() {
    const [sessionData, profileData, projectData, skillData, educationData, messageData] = await Promise.all([
      adminGet('/session'),
      adminGet('/profile'),
      adminGet('/projects'),
      adminGet('/skills'),
      adminGet('/education'),
      adminGet('/contacts')
    ])

    setSession(sessionData)
    setProfile(profileData || emptyProfile)
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
      setStatus('Session expired.')
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
    setStatus('Logged out.')
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
      setStatus('Signed in.')
    } catch (error) {
      console.error(error)
      // show specific server-provided message when available
      setStatus(error?.message || 'Invalid credentials.')
    }
  }

  async function saveProfile() {
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
    setAvatarPreview(updated?.avatarUrl ? resolveImageSrc(updated.avatarUrl) : '')
    setAvatarFile(null)
    setStatus('Profile saved.')
  }

  async function createProject(event) {
    event.preventDefault()
    const result = await adminPost('/projects', {
      ...projectForm,
      tech: splitTech(projectForm.techText)
    })
    setProjects((current) => [result, ...current])
    setProjectForm(emptyProject)
    setStatus('Project created.')
  }

  async function saveProject(project) {
    const result = await adminPut(`/projects/${project.id}`, project)
    setProjects((current) => current.map((item) => (item.id === project.id ? result : item)))
    setStatus('Project saved.')
  }

  async function removeProject(projectId) {
    await adminDelete(`/projects/${projectId}`)
    setProjects((current) => current.filter((item) => item.id !== projectId))
    setStatus('Project deleted.')
  }

  async function createSkill(event) {
    event.preventDefault()
    const result = await adminPost('/skills', skillForm)
    setSkills((current) => [result, ...current])
    setSkillForm(emptySkill)
    setStatus('Skill created.')
  }

  async function removeSkill(skillId) {
    await adminDelete(`/skills/${skillId}`)
    setSkills((current) => current.filter((item) => item.id !== skillId))
    setStatus('Skill deleted.')
  }

  async function createEducation(event) {
    event.preventDefault()
    const result = await adminPost('/education', educationForm)
    setEducation((current) => [result, ...current])
    setEducationForm(emptyEducation)
    setStatus('Education saved.')
  }

  async function removeEducation(recordId) {
    await adminDelete(`/education/${recordId}`)
    setEducation((current) => current.filter((item) => item.id !== recordId))
    setStatus('Education deleted.')
  }

  async function removeMessage(messageId) {
    await adminDelete(`/contacts/${messageId}`)
    setMessages((current) => current.filter((item) => item.id !== messageId))
    setStatus('Contact deleted.')
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
          </form>
          {status ? <p className="mt-4 text-sm text-slate-300">{status}</p> : null}
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
            <p className="mt-2 text-sm text-slate-300">Update the hero portrait, bio, and social links from one place.</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ['name', 'Name'],
                ['title', 'Title'],
                ['summary', 'Summary'],
                ['bio', 'Bio'],
                ['resumeUrl', 'Resume URL'],
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

            <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <label className="flex cursor-pointer flex-col gap-3 rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.04] p-4 transition hover:border-roseglow-300/50 hover:bg-white/[0.06]">
                <span className="text-xs uppercase tracking-[0.25em] text-white/45">Hero portrait</span>
                <span className="text-sm text-white/80">Choose a local image and upload it.</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null
                    setAvatarFile(file)
                    if (file) {
                      setAvatarPreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </label>

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
                onClick={() => {
                  setAvatarFile(null)
                  setAvatarPreview(profile.avatarUrl ? resolveImageSrc(profile.avatarUrl) : '')
                }}
              >
                Reset preview
              </button>
            </div>
          </form>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-white">Snapshot</h3>
            <p className="mt-3 text-sm text-slate-300">{profile.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{profile.summary}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{profile.bio}</p>
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/45">Current portrait</p>
              <div className="mt-3 overflow-hidden rounded-[1.25rem] border border-white/10">
                {profile.avatarUrl ? (
                  <img src={resolveImageSrc(profile.avatarUrl)} alt="Current portrait" className="h-56 w-full object-cover" />
                ) : (
                  <div className="grid h-56 place-items-center bg-[linear-gradient(135deg,rgba(255,182,193,0.12),rgba(183,153,255,0.12))] text-white/60">
                    No portrait uploaded yet
                  </div>
                )}
              </div>
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
            </div>
          </form>

          <div className="grid gap-4">
            {projects.map((project) => (
              <article key={project.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <input className="input-field" value={project.title || ''} onChange={(event) => setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, title: event.target.value } : item)))} />
                <textarea className="input-field mt-3 min-h-24" value={project.description || ''} onChange={(event) => setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, description: event.target.value } : item)))} />
                <input className="input-field mt-3" value={(project.tech || []).join(', ')} onChange={(event) => setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, tech: splitTech(event.target.value) } : item)))} />
                <div className="mt-4 flex gap-3">
                  <button type="button" className="btn-secondary" onClick={() => saveProject(project)}>Save</button>
                  <button type="button" className="btn-secondary" onClick={() => removeProject(project.id)}>Delete</button>
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
            </div>
          </form>

          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill) => (
              <article key={skill.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <p className="text-lg font-semibold text-white">{skill.name}</p>
                <p className="text-sm text-slate-300">{skill.category}</p>
                <p className="text-sm text-slate-300">Level: {skill.level}</p>
                <button type="button" className="btn-secondary mt-4" onClick={() => removeSkill(skill.id)}>
                  Delete
                </button>
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
            </div>
          </form>

          <div className="grid gap-4">
            {education.map((item) => (
              <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <p className="text-lg font-semibold text-white">{item.school}</p>
                <p className="text-sm text-slate-300">{item.degree} {item.field ? `• ${item.field}` : ''}</p>
                <p className="text-sm text-slate-300">{item.startYear} - {item.endYear}</p>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                <button type="button" className="btn-secondary mt-4" onClick={() => removeEducation(item.id)}>
                  Delete
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'messages' ? (
        <section className="grid gap-4">
          {messages.map((message) => (
            <article key={message.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <p className="text-lg font-semibold text-white">{message.name}</p>
              <p className="text-sm text-slate-300">{message.email}</p>
              <p className="mt-3 text-sm text-slate-300">{message.message}</p>
              <button type="button" className="btn-secondary mt-4" onClick={() => removeMessage(message.id)}>
                Delete
              </button>
            </article>
          ))}
        </section>
      ) : null}

      {status ? <p className="text-sm text-slate-300">{status}</p> : null}
    </main>
  )
}

export default function AdminPage() {
  return <AdminPageContent />
}