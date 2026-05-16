const domains = [
  {
    name: 'Web Development',
    slug: 'web-development',
    shortDescription: 'Build modern, responsive websites and full-stack web applications.',
    icon: '🌐',
    color: '#6366f1',
    difficultyLevel: 'beginner',
    estimatedDuration: '4-6 months',
    order: 1,
    certificationLink: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'
  },
  {
    name: 'Data Science',
    slug: 'data-science',
    shortDescription: 'Extract insights from data using Python and statistics.',
    icon: '📊',
    color: '#10b981',
    difficultyLevel: 'intermediate',
    estimatedDuration: '5-7 months',
    order: 2,
    certificationLink: 'https://www.coursera.org/professional-certificates/ibm-data-science'
  },
  {
    name: 'Data Analytics',
    slug: 'data-analytics',
    shortDescription: 'Analyze business data and create dashboards.',
    icon: '📈',
    color: '#f59e0b',
    difficultyLevel: 'beginner',
    estimatedDuration: '3-5 months',
    order: 3,
    certificationLink: 'https://grow.google/certificates/data-analytics/'
  },
  {
    name: 'DevOps',
    slug: 'devops',
    shortDescription: 'Automate, deploy, and scale software with CI/CD.',
    icon: '⚙️',
    color: '#ef4444',
    difficultyLevel: 'intermediate',
    estimatedDuration: '5-7 months',
    order: 4,
    certificationLink: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/'
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    shortDescription: 'Master AWS, Azure, GCP and cloud architectures.',
    icon: '☁️',
    color: '#3b82f6',
    difficultyLevel: 'intermediate',
    estimatedDuration: '5-8 months',
    order: 5,
    certificationLink: 'https://cloud.google.com/learn/certification'
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    shortDescription: 'Protect systems and networks through ethical hacking.',
    icon: '🔒',
    color: '#8b5cf6',
    difficultyLevel: 'intermediate',
    estimatedDuration: '5-7 months',
    order: 6,
    certificationLink: 'https://grow.google/certificates/cybersecurity/'
  },
  {
    name: 'App Development',
    slug: 'app-development',
    shortDescription: 'Build cross-platform mobile apps with Flutter.',
    icon: '📱',
    color: '#06b6d4',
    difficultyLevel: 'beginner',
    estimatedDuration: '4-6 months',
    order: 7,
    certificationLink: 'https://developers.google.com/certification/associate-android-developer'
  },
  {
    name: 'AI/ML',
    slug: 'ai-ml',
    shortDescription: 'Design and train AI models at scale.',
    icon: '🤖',
    color: '#ec4899',
    difficultyLevel: 'advanced',
    estimatedDuration: '6-9 months',
    order: 8,
    certificationLink: 'https://www.coursera.org/specializations/machine-learning-introduction'
  },
  {
    name: 'Blockchain',
    slug: 'blockchain',
    shortDescription: 'Build decentralized apps and smart contracts.',
    icon: '⛓️',
    color: '#f97316',
    difficultyLevel: 'advanced',
    estimatedDuration: '5-7 months',
    order: 9,
    certificationLink: 'https://www.coursera.org/specializations/blockchain'
  },
  {
    name: 'UI/UX',
    slug: 'ui-ux',
    shortDescription: 'Design beautiful digital experiences.',
    icon: '🎨',
    color: '#a855f7',
    difficultyLevel: 'beginner',
    estimatedDuration: '3-5 months',
    order: 10,
    certificationLink: 'https://grow.google/certificates/ux-design/'
  },
  {
    name: 'Database Administration',
    slug: 'database-administration',
    shortDescription: 'Manage, optimize, and secure databases.',
    icon: '🗄️',
    color: '#14b8a6',
    difficultyLevel: 'intermediate',
    estimatedDuration: '4-6 months',
    order: 11,
    certificationLink: 'https://education.oracle.com/oracle-database-administration-i/pExam_1Z0-082'
  },
  {
    name: 'QA Testing',
    slug: 'qa-testing',
    shortDescription: 'Ensure software quality through testing.',
    icon: '🧪',
    color: '#84cc16',
    difficultyLevel: 'beginner',
    estimatedDuration: '3-5 months',
    order: 12,
    certificationLink: 'https://www.istqb.org/certifications/certified-tester-foundation-level'
  },
  {
    name: 'DSA',
    slug: 'dsa',
    shortDescription: 'Master data structures and algorithms.',
    icon: '🏆',
    color: '#eab308',
    difficultyLevel: 'intermediate',
    estimatedDuration: '4-6 months',
    order: 13,
    certificationLink: 'https://www.hackerrank.com/skills-verification/data_structures'
  },
  {
    name: 'Open Source',
    slug: 'open-source',
    shortDescription: 'Contribute to real-world projects.',
    icon: '🌱',
    color: '#22c55e',
    difficultyLevel: 'beginner',
    estimatedDuration: '2-4 months',
    order: 14,
    certificationLink: 'https://summerofcode.withgoogle.com/'
  }
];

module.exports = domains;
