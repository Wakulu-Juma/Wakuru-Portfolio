"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Github, Sparkles } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { get } from '../api'

const Projects = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    let mounted = true
    get('/api/projects')
      .then((data) => mounted && setProjects(data))
      .catch(() => {
        // ignore
      })
    return () => (mounted = false)
  }, [])

  const display = projects.length
    ? projects
    : [
        {
          title: 'Data Visualization Dashboard',
          description:
            'Interactive analytics dashboard showcasing insights with responsive charts and KPI storytelling.',
          tech: ['React', 'D3.js', 'Tailwind'],
          github: '#',
          demo: '#'
        },
        {
          title: 'Machine Learning Classifier',
          description:
            'End-to-end ML workflow for classification with model evaluation and deployment-ready APIs.',
          tech: ['Python', 'Scikit-learn', 'FastAPI'],
          github: '#',
          demo: '#'
        }
      ]

  return (
    <section id="projects" className="section-pad section-alt">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work and academic highlights shaped into premium showcase cards"
          subtitle="A curated snapshot of projects that blend software engineering with data and AI research, presented like a modern studio portfolio."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {display.map((project, index) => (
            <motion.article
              key={project.id || project.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`project-card ${index === 0 ? 'project-card-featured lg:col-span-2' : ''}`}
            >
              <div className="project-thumb">
                <div className="absolute inset-0 flex items-end justify-between p-5">
                  <div className="rounded-full border border-white/[0.12] bg-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                    {index === 0 ? 'Featured' : 'Selected'}
                  </div>
                  <Sparkles className="h-5 w-5 text-white/80 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(project.tech || []).map((item) => (
                    <span key={item} className="chip chip-muted">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-3 pt-2">
                  <a className="btn-secondary group gap-2" href={project.github || '#'}>
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  <a className="btn-primary group gap-2" href={project.demo || '#'}>
                    Live Demo
                    <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
