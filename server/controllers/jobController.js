// Mock Database of Jobs and Internships from LinkedIn and Naukri
const jobDatabase = [
  // --- DevOps Roles ---
  {
    id: "job_devops_1",
    title: "DevOps Engineer Internship",
    company: "CloudTech Solutions",
    location: "Bangalore, India (Hybrid)",
    type: "internship",
    category: "devops",
    salary: "₹30,000 - ₹45,000 / month",
    experience: "Freshers",
    source: "LinkedIn",
    link: "https://www.linkedin.com/jobs/view/devops-intern-cloudtech",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
    logoBg: "bg-blue-600",
    companyInitials: "CT",
    description: "Looking for an enthusiastic DevOps Intern to help maintain our cloud infrastructure. You will work on automating deployments, managing Kubernetes clusters, and setting up GitLab CI/CD pipelines."
  },
  {
    id: "job_devops_2",
    title: "Associate Cloud & DevOps Engineer",
    company: "RedHat Systems",
    location: "Pune, India (Remote)",
    type: "job",
    category: "devops",
    salary: "₹8 - ₹12 LPA",
    experience: "0-2 years",
    source: "Naukri",
    link: "https://www.naukri.com/job-listings-devops-engineer-redhat",
    skills: ["Linux", "Terraform", "Ansible", "Jenkins", "Azure"],
    logoBg: "bg-red-600",
    companyInitials: "RH",
    description: "Join our core infrastructure team to build scale. Responsible for infrastructure as code (IaC) using Terraform, managing automation configurations with Ansible, and scaling Azure cloud resources."
  },

  // --- DSA Roles ---
  {
    id: "job_dsa_1",
    title: "Software Engineer (Algorithms & Data Structures)",
    company: "Google India",
    location: "Hyderabad, India (Office-based)",
    type: "job",
    category: "dsa",
    salary: "₹18 - ₹25 LPA",
    experience: "1-3 years",
    source: "LinkedIn",
    link: "https://www.linkedin.com/jobs/view/software-engineer-google-dsa",
    skills: ["Data Structures", "Algorithms", "C++", "Java", "System Design"],
    logoBg: "bg-emerald-600",
    companyInitials: "G",
    description: "Looking for software developers with strong foundations in core algorithms, complexity analysis, and object-oriented programming. You will solve complex computational tasks and build high-performance search components."
  },
  {
    id: "job_dsa_2",
    title: "C++ / DSA Developer Intern",
    company: "Adobe Systems",
    location: "Noida, India (Hybrid)",
    type: "internship",
    category: "dsa",
    salary: "₹50,000 - ₹70,000 / month",
    experience: "Freshers",
    source: "LinkedIn",
    link: "https://www.linkedin.com/jobs/view/dsa-intern-adobe",
    skills: ["Data Structures", "Recursion", "Trees", "Graphs", "C++"],
    logoBg: "bg-red-500",
    companyInitials: "A",
    description: "Adobe is seeking interns with stellar algorithmic skills. You will work on PDF graphics engine performance optimization, low-level tree traversal algorithms, and memory footprint reduction."
  },

  // --- Full Stack Roles ---
  {
    id: "job_fs_1",
    title: "Full Stack Developer (MERN)",
    company: "Tech Mahindra",
    location: "Mumbai, India (Hybrid)",
    type: "job",
    category: "fullstack",
    salary: "₹6 - ₹10 LPA",
    experience: "1-3 years",
    source: "Naukri",
    link: "https://www.naukri.com/job-listings-mern-full-stack-techmahindra",
    skills: ["MongoDB", "Express.js", "React", "Node.js", "REST APIs"],
    logoBg: "bg-orange-600",
    companyInitials: "TM",
    description: "Build robust corporate admin dashboards and portal integrations. Responsibilities include frontend dashboard optimization, server routing logic, and database schemas inside MongoDB."
  },
  {
    id: "job_fs_2",
    title: "Full Stack Engineering Intern",
    company: "Zepto Payments",
    location: "Bangalore, India (Office-based)",
    type: "internship",
    category: "fullstack",
    salary: "₹40,000 / month",
    experience: "Freshers",
    source: "LinkedIn",
    link: "https://www.linkedin.com/jobs/view/zepto-payments-intern",
    skills: ["React.js", "Node.js", "PostgreSQL", "Tailwind CSS", "Redis"],
    logoBg: "bg-purple-600",
    companyInitials: "Z",
    description: "Work with Zepto's checkout team to build rapid features. Work across Next.js frontend, backend Express APIs, and caching layers with Redis. Highly performance-driven role."
  },

  // --- Frontend Roles ---
  {
    id: "job_fe_1",
    title: "Frontend Engineer (React & Next.js)",
    company: "Razorpay",
    location: "Bangalore, India (Hybrid)",
    type: "job",
    category: "frontend",
    salary: "₹12 - ₹16 LPA",
    experience: "2-4 years",
    source: "LinkedIn",
    link: "https://www.linkedin.com/jobs/view/frontend-engineer-razorpay",
    skills: ["React.js", "Next.js", "JavaScript", "Tailwind CSS", "Framer Motion"],
    logoBg: "bg-indigo-600",
    companyInitials: "RP",
    description: "Craft stunning merchant dashboards and checkout checkouts. Focus heavily on responsive layouts, micro-animations via Framer Motion, and core web vitals optimization."
  },
  {
    id: "job_fe_2",
    title: "Frontend Developer (UI Specialist) Intern",
    company: "InnoEye Technologies",
    location: "Indore, India (Office-based)",
    type: "internship",
    category: "frontend",
    salary: "₹15,000 - ₹20,000 / month",
    experience: "Freshers",
    source: "Naukri",
    link: "https://www.naukri.com/job-listings-frontend-intern-innoeye",
    skills: ["HTML", "CSS", "JavaScript", "React.js", "Bootstrap"],
    logoBg: "bg-teal-600",
    companyInitials: "IE",
    description: "Seeking a frontend design intern to build customer landing portals. You must have clean visual alignment skills, vanilla CSS proficiency, and dynamic React rendering knowledge."
  },

  // --- Backend Roles ---
  {
    id: "job_be_1",
    title: "Backend Software Engineer (Node / NestJS)",
    company: "Zomato",
    location: "Gurgaon, India (Hybrid)",
    type: "job",
    category: "backend",
    salary: "₹16 - ₹22 LPA",
    experience: "1-3 years",
    source: "Naukri",
    link: "https://www.naukri.com/job-listings-backend-engineer-zomato",
    skills: ["Node.js", "NestJS", "MongoDB", "RabbitMQ", "Microservices"],
    logoBg: "bg-rose-600",
    companyInitials: "Z",
    description: "Scale Zomato's cart checkout and food delivery microservices. Handle complex concurrent database connections, distributed message queues with RabbitMQ, and secure API routing."
  },
  {
    id: "job_be_2",
    title: "Backend Development Intern (Python/Django)",
    company: "Ola Electric",
    location: "Pune, India (Office-based)",
    type: "internship",
    category: "backend",
    salary: "₹25,000 - ₹30,000 / month",
    experience: "Freshers",
    source: "LinkedIn",
    link: "https://www.linkedin.com/jobs/view/backend-intern-ola",
    skills: ["Python", "Django", "MySQL", "REST API", "Git"],
    logoBg: "bg-lime-600",
    companyInitials: "OL",
    description: "Ola Electric is looking for backend django interns. You will write clean, well-tested Python controllers, integrate MySQL database schemas, and debug live telematics backend APIs."
  }
];

// @desc    Get all jobs & internships with filters
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res) => {
  try {
    const { type, category, source, search } = req.query;

    let filteredJobs = [...jobDatabase];

    // Filter by Job/Internship type
    if (type && type !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.type && job.type.toLowerCase() === type.toLowerCase());
    }

    // Filter by Tech Category (Devops, DSA, Fullstack, Frontend, Backend)
    if (category && category !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.category && job.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Aggregation Source (LinkedIn, Naukri)
    if (source && source !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.source && job.source.toLowerCase() === source.toLowerCase());
    }

    // Filter by search query (Title, Company, Location, Description, Skills)
    if (search && search.trim() !== '') {
      const query = search.trim().toLowerCase();
      filteredJobs = filteredJobs.filter(job => {
        const title = job.title || '';
        const company = job.company || '';
        const location = job.location || '';
        const description = job.description || '';
        const skills = job.skills || [];
        return (
          title.toLowerCase().includes(query) ||
          company.toLowerCase().includes(query) ||
          location.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          skills.some(skill => skill && skill.toLowerCase().includes(query))
        );
      });
    }

    res.json({
      success: true,
      count: filteredJobs.length,
      data: filteredJobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching jobs database aggregator",
      error: error.message
    });
  }
};
