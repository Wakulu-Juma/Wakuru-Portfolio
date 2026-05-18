import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

const projects = [
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
  },
  {
    title: 'Frontend Portfolio Website',
    description:
      'Modern personal portfolio with glassmorphism UI, smooth animations, and SEO-first layout.',
    tech: ['React', 'Framer Motion', 'Vite'],
    github: '#',
    demo: '#'
  }
]

const Projects = () => {
  return (
    <section id="projects" className="section-pad section-alt">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work and academic highlights"
          subtitle="A snapshot of the projects that blend software engineering with data and AI research."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`project-card ${index === 0 ? 'project-card-featured lg:col-span-2' : ''}`}
            >
              <div className="project-thumb" />
              <div className="flex flex-1 flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <span key={item} className="chip chip-muted">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-3">
                  <a className="btn-secondary" href={project.github}>
                    GitHub
                  </a>
                  <a className="btn-primary" href={project.demo}>
                    Live Demo
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
