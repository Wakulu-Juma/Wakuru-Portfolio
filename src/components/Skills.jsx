import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

const skills = [
  { name: 'HTML', level: 90, icon: 'bi-filetype-html' },
  { name: 'CSS', level: 88, icon: 'bi-filetype-css' },
  { name: 'JavaScript', level: 86, icon: 'bi-filetype-js' },
  { name: 'React', level: 84, icon: 'bi-cpu' },
  { name: 'Node.js', level: 78, icon: 'bi-diagram-3' },
  { name: 'Python', level: 88, icon: 'bi-filetype-py' },
  { name: 'Java', level: 76, icon: 'bi-filetype-java' },
  { name: 'SQL', level: 82, icon: 'bi-database' },
  { name: 'Machine Learning', level: 74, icon: 'bi-robot' },
  { name: 'Data Visualization', level: 80, icon: 'bi-bar-chart' }
]

const Skills = () => {
  return (
    <section id="skills" className="section-pad">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
        <SectionHeading
          eyebrow="Skills"
          title="Technical strengths and growing expertise"
          subtitle="A balance of engineering fundamentals, data analysis proficiency, and hands-on AI development."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="skill-card"
            >
              <div className="flex items-center gap-3">
                <span className="skill-icon" aria-hidden="true">
                  <i className={`bi ${skill.icon}`} />
                </span>
                <h3 className="text-base font-semibold text-white">{skill.name}</h3>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-2 rounded-full bg-gradient-to-r from-roseglow-300 via-ink-300 to-roseglow-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
