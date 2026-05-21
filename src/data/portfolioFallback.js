export const FALLBACK_PORTFOLIO = {
  profile: {
    name: 'Wakuru Juma Gilagali',
    title: 'Final-year software developer',
    summary: 'Frontend and backend developer, data analyst, and AI enthusiast.',
    bio: 'Final-year student at Eastern Africa Statistical Training Centre (EASTC), expected to graduate in July 2026.',
    intro: 'Passionate about building modern web applications, analyzing data, and applying AI solutions to real-world problems.',
    projectsStat: '18+',
    researchStat: 'AI + Data',
    availabilityStat: 'Open to collaborate',
    resumeUrl: '/resume.pdf',
    avatarUrl: '/default-avatar.svg',
    githubUrl: 'https://github.com/',
    linkedinUrl: 'https://linkedin.com/',
    email: 'wakuru@gmail.com'
  },
  about: {
    content:
      'Final-year student at Eastern Africa Statistical Training Centre (EASTC), expected to graduate in July 2026.',
    extra: 'Frontend and backend developer, data analyst, and AI enthusiast.'
  },
  skills: [
    { name: 'HTML', level: 90, icon: 'bi-filetype-html', category: 'Frontend' },
    { name: 'CSS', level: 88, icon: 'bi-filetype-css', category: 'Frontend' },
    { name: 'JavaScript', level: 86, icon: 'bi-filetype-js', category: 'Frontend' },
    { name: 'React', level: 84, icon: 'bi-cpu', category: 'Frontend' },
    { name: 'Node.js', level: 78, icon: 'bi-diagram-3', category: 'Backend' },
    { name: 'Data Analysis', level: 82, icon: 'bi-graph-up', category: 'Analytics' },
    { name: 'Machine Learning', level: 76, icon: 'bi-cpu-fill', category: 'AI' }
  ],
  projects: [
    {
      title: 'Data Visualization Dashboard',
      description:
        'Interactive analytics dashboard showcasing insights with responsive charts and KPI storytelling.',
      tech: ['React', 'D3.js', 'Tailwind'],
      github: '#',
      demo: '#',
      featured: true
    },
    {
      title: 'Machine Learning Classifier',
      description:
        'End-to-end ML workflow for classification with model evaluation and deployment-ready APIs.',
      tech: ['Python', 'Scikit-learn', 'FastAPI'],
      github: '#',
      demo: '#',
      featured: false
    }
  ],
  education: [
    {
      school: 'Eastern Africa Statistical Training Centre (EASTC)',
      degree: 'BSc',
      field: 'Official Statistics',
      startYear: 2022,
      endYear: 2026,
      description: 'Final-year student expected to graduate in July 2026.'
    }
  ]
}
