const focusBeats = [
  {
    title: "Lofi Hip Hop Radio 📚 Beats to Relax/Study to",
    channelName: "Lofi Girl",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    reason: "The world's most popular 24/7 live lofi chill beats. Ideal background ambiance to unlock deep coding concentration."
  },
  {
    title: "Synthwave Radio 🌌 Retro Coding & Gaming Beats",
    channelName: "Lofi Girl Synthwave",
    url: "https://www.youtube.com/watch?v=4xDzrJK33Dg",
    reason: "Upbeat retro electronic synth music to keep a high-energy flow state during intensive coding sessions."
  },
  {
    title: "Ambient Programming Soundscapes 💻 Deep Coding Beats",
    channelName: "Box Lofi",
    url: "https://www.youtube.com/watch?v=m53k25VbV2w",
    reason: "Relaxing deep chill-out tunes designed specifically to help software developers concentrate comfortably for hours."
  }
];

const domainRoadmaps = {
  'web-development': {
    title: "Full-Stack Web Development Roadmap",
    description: "Master modern frontend, backend, database architectures, and build highly performant web applications.",
    estimatedDuration: "4-6 months",
    difficultyLevel: "Beginner to Intermediate",
    requiredSkills: ["HTML/CSS", "Basic Javascript", "Problem Solving"],
    steps: [
      {
        stepNumber: 1,
        title: "Frontend Foundations & Responsive Design",
        description: "Learn how browsers render pages, structural HTML5, and visual styling with CSS and Modern Layouts.",
        topics: ["HTML5 Semantics", "CSS Flexbox & Grid", "Responsive Design & Media Queries"],
        gfgLinks: [
          { title: "HTML Tutorial", url: "https://www.geeksforgeeks.org/html-tutorial/" },
          { title: "CSS Tutorial", url: "https://www.geeksforgeeks.org/css-tutorial/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "web-1-css-flexbox",
            title: "Flexbox Layout Puzzle",
            difficulty: "Easy",
            description: "Given a layout structure, write a function that returns the correct flex direction and alignment parameters to align items to the center horizontally and space-between vertically."
          }
        ],
        miniProject: "Responsive Professional Personal Portfolio Website",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-webdev-frontend-1"
      },
      {
        stepNumber: 2,
        title: "Programming with JavaScript & DOM Manipulation",
        description: "Breathe life into static pages. Master dynamic scripting, DOM operations, ES6+, and asynchronous actions.",
        topics: ["ES6+ Features", "DOM Event Handling", "Asynchronous JS & Fetch API"],
        gfgLinks: [
          { title: "JavaScript Tutorial", url: "https://www.geeksforgeeks.org/javascript/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "web-2-js-fetch",
            title: "Async Data Filter",
            difficulty: "Medium",
            description: "Write an asynchronous JavaScript function that fetches products from a mock API, filters them by rating higher than 4.5, and returns the sorted names."
          }
        ],
        miniProject: "Dynamic Weather App using Live Geolocation API",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-webdev-js-2"
      },
      {
        stepNumber: 3,
        title: "Modern UI Architecture with React",
        description: "Learn component-based UI engineering. Master hooks, components, routing, and centralized state management.",
        topics: ["React JSX & Props", "Hooks (useState, useEffect)", "State Management & React Router"],
        gfgLinks: [
          { title: "ReactJS Tutorial", url: "https://www.geeksforgeeks.org/reactjs/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "web-3-react-counter",
            title: "Hook State Simulator",
            difficulty: "Easy",
            description: "Simulate a React counter hook that increases or decreases state, ensuring that the count never goes below zero."
          }
        ],
        miniProject: "Interactive Personal Finance Management Dashboard",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-webdev-react-3"
      },
      {
        stepNumber: 4,
        title: "Backend Engineering with Node.js & Express",
        description: "Scale the server side. Create highly scalable servers, REST APIs, and authentication mechanisms.",
        topics: ["Node.js Runtime Basics", "Express routing & middlewares", "Token authentication with JWT"],
        gfgLinks: [
          { title: "Node.js Tutorial", url: "https://www.geeksforgeeks.org/nodejs/" },
          { title: "Express.js Tutorial", url: "https://www.geeksforgeeks.org/express-js/" },
          { title: "REST API Introduction", url: "https://www.geeksforgeeks.org/rest-api-introduction/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "web-4-express-jwt",
            title: "Middleware Auth Validation",
            difficulty: "Medium",
            description: "Implement a secure token validation handler that checks if a request has a valid Bearer token and decodes it."
          }
        ],
        miniProject: "Secure RESTful Blogging API with User Roles",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-webdev-node-4"
      },
      {
        stepNumber: 5,
        title: "Database Integration & Full Stack MERN Deployment",
        description: "Tie frontend and backend together. Store application state persistently in MongoDB, optimize schemas, and deploy.",
        topics: ["MongoDB Schemas & Aggregations", "MERN Stack integration", "Cloud Hosting (Render/Vercel)"],
        gfgLinks: [
          { title: "MongoDB Tutorial", url: "https://www.geeksforgeeks.org/mongodb/" },
          { title: "MERN Stack Introduction", url: "https://www.geeksforgeeks.org/mern-stack/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "web-5-mongo-query",
            title: "Database Query Planner",
            difficulty: "Hard",
            description: "Write a MongoDB aggregation pipeline equivalent function that aggregates user purchase totals, groups by month, and filters values above $500."
          }
        ],
        miniProject: "Full Stack Realtime Collaborative Workspace & Board",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-webdev-mern-5"
      }
    ]
  },
  'data-science': {
    title: "Data Science Mastery Roadmap",
    description: "Learn Python scripting, data analytics, mathematical statistics, machine learning models, and complex data viz.",
    estimatedDuration: "5-7 months",
    difficultyLevel: "Intermediate",
    requiredSkills: ["Python Basics", "Linear Algebra", "Logical Thinking"],
    steps: [
      {
        stepNumber: 1,
        title: "Data Science Foundations & NumPy",
        description: "Master Python programming tools and the powerful array computing package NumPy.",
        topics: ["Python Pandas Dataframes", "NumPy Vectorized Calculations", "Statistical Data Cleaning"],
        gfgLinks: [
          { title: "Data Science Tutorial", url: "https://www.geeksforgeeks.org/data-science/" },
          { title: "NumPy Tutorial", url: "https://www.geeksforgeeks.org/numpy-tutorial/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "ds-1-numpy",
            title: "Array Norm Calculator",
            difficulty: "Easy",
            description: "Given a 2D numpy-like nested list, calculate the Euclidean norm of each column and return the column indices sorted in descending order."
          }
        ],
        miniProject: "Retail Transactions Exploratory Data Analysis Report",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-datascience-1"
      },
      {
        stepNumber: 2,
        title: "Pandas & Exploratory Data Analysis",
        description: "Learn the core library for data wrangling. Manipulate files, resolve missing fields, and aggregate statistics.",
        topics: ["Pandas Series & Dataframes", "Grouping & Merging datasets", "Outlier detection techniques"],
        gfgLinks: [
          { title: "Python Pandas DataFrame", url: "https://www.geeksforgeeks.org/python-pandas-dataframe/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "ds-2-pandas",
            title: "DataFrame Null Imputer",
            difficulty: "Medium",
            description: "Write a function that accepts a table representation, computes the mean of each column, and replaces all null/undefined values with that column's mean."
          }
        ],
        miniProject: "Automated CSV Data Cleaning Pipeline Script",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-datascience-2"
      }
    ]
  },
  'data-analytics': {
    title: "Data Analytics Career Roadmap",
    description: "Learn to extract valuable insights from business data and build stunning charts, dashboards, and KPI metrics.",
    estimatedDuration: "3-5 months",
    difficultyLevel: "Beginner",
    requiredSkills: ["Basic Maths", "Excel Skills", "Inquisitive Mindset"],
    steps: [
      {
        stepNumber: 1,
        title: "Structured Query Language (SQL) Basics",
        description: "Learn how relational databases work, how to write complex select statements, and aggregate business tables.",
        topics: ["SQL Joins (Inner, Left, Right)", "Grouping & Filtering", "Subqueries"],
        gfgLinks: [
          { title: "SQL Tutorial", url: "https://www.geeksforgeeks.org/sql-tutorial/" },
          { title: "MySQL Tutorial", url: "https://www.geeksforgeeks.org/mysql-tutorial/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "da-1-sql",
            title: "Mock SQL Aggregator",
            difficulty: "Easy",
            description: "Given a set of sales objects, write a function that performs the equivalent of a SQL 'GROUP BY' on category, calculating total sales revenue."
          }
        ],
        miniProject: "Sales KPI Metrics Dashboard design",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-dataanalytics-1"
      }
    ]
  },
  'devops': {
    title: "DevOps & Cloud Automation Roadmap",
    description: "Transition from software builder to deployments expert. Automate code testing, containerize applications, and build massive CI/CD rigs.",
    estimatedDuration: "5-7 months",
    difficultyLevel: "Intermediate",
    requiredSkills: ["Linux CLI", "Web Server Basics", "Git"],
    steps: [
      {
        stepNumber: 1,
        title: "Linux Command Line & Operating System Architecture",
        description: "DevOps runs on servers. Master directory operations, bash scripting, networking protocols, and system files.",
        topics: ["Linux file permissions", "BASH shell scripting", "Network diagnostic utilities"],
        gfgLinks: [
          { title: "DevOps Tutorial", url: "https://www.geeksforgeeks.org/devops-tutorial/" },
          { title: "Linux Commands Guide", url: "https://www.geeksforgeeks.org/linux-commands/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "do-1-linux",
            title: "Log Parser Script",
            difficulty: "Medium",
            description: "Write a function that parses a list of log output strings, counts the occurrences of ERROR, WARNING, and INFO statements, and lists the unique IP addresses that caused errors."
          }
        ],
        miniProject: "Automated System Resource Monitor Bash Tool",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-devops-1"
      },
      {
        stepNumber: 2,
        title: "Containerization with Docker",
        description: "Package your code once, run it anywhere. Master container files, caching layers, volumes, and network orchestration.",
        topics: ["Dockerfiles & Image Building", "Container Port mapping", "Docker Compose Orchestration"],
        gfgLinks: [
          { title: "Docker Tutorial", url: "https://www.geeksforgeeks.org/docker-tutorial/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "do-2-docker",
            title: "Dockerfile Optimizer",
            difficulty: "Easy",
            description: "Create a parser that verifies if a Dockerfile contains multi-stage builds and flags redundant packages that would increase image size."
          }
        ],
        miniProject: "Multi-container Microservices App setup with Compose",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-devops-2"
      },
      {
        stepNumber: 3,
        title: "Kubernetes Production Orchestration",
        description: "Scale applications on massive clusters. Manage pods, services, ingress controllers, replicas, and configuration files.",
        topics: ["Kubernetes Architecture", "K8s Pods and Services", "Deployment strategies (Blue/Green)"],
        gfgLinks: [
          { title: "Kubernetes Tutorial", url: "https://www.geeksforgeeks.org/kubernetes-tutorial/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "do-3-k8s",
            title: "K8s Replica Count Validator",
            difficulty: "Medium",
            description: "Write a validator function that inspects a mock Kubernetes YAML config and throws alerts if resources limits (CPU, Memory) are undeclared."
          }
        ],
        miniProject: "Deploying a Fault-Tolerant React-Node Rigs to K8s Local Cluster",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-devops-3"
      }
    ]
  },
  'cloud-computing': {
    title: "Cloud Computing Architect Roadmap",
    description: "Master global cloud platforms, network topology, serverless computation, identity access, and scalable architecture.",
    estimatedDuration: "5-8 months",
    difficultyLevel: "Intermediate",
    requiredSkills: ["Networking Basics", "Security Protocols", "Python/Bash"],
    steps: [
      {
        stepNumber: 1,
        title: "Cloud Core Models & Global Infrastructure",
        description: "Learn cloud paradigms (IaaS, PaaS, SaaS) and global network foundations (regions, availability zones, VPNs).",
        topics: ["Cloud Service Paradigms", "Global AZ and Region selection", "SLA & High Availability"],
        gfgLinks: [
          { title: "Cloud Computing Tutorial", url: "https://www.geeksforgeeks.org/cloud-computing/" },
          { title: "Introduction to Cloud Computing", url: "https://www.geeksforgeeks.org/introduction-to-cloud-computing/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "cc-1-subnet",
            title: "VPC Subnet IP Allocator",
            difficulty: "Medium",
            description: "Given a CIDR block, compute the number of available IPs and list the valid subnet masks that fit 250 connected servers."
          }
        ],
        miniProject: "Multi-tier Cloud Network Architecture topology map",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-cloud-1"
      },
      {
        stepNumber: 2,
        title: "Amazon Web Services (AWS) Core Services",
        description: "Design real production environments using AWS EC2, S3, IAM, Lambda, and DynamoDB database services.",
        topics: ["EC2 Computing and IAM Roles", "S3 Storage Classes & Buckets", "Serverless Compute with AWS Lambda"],
        gfgLinks: [
          { title: "AWS Tutorial", url: "https://www.geeksforgeeks.org/aws-tutorial/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "cc-2-aws-iam",
            title: "IAM Policy Analyzer",
            difficulty: "Medium",
            description: "Given a JSON-represented AWS IAM security statement, verify if it grants wildcards '*' permissions and identify resource threats."
          }
        ],
        miniProject: "High-Availability Serverless Backend with API Gateway",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-cloud-2"
      }
    ]
  },
  'cybersecurity': {
    title: "Cybersecurity & Ethical Hacking Roadmap",
    description: "Protect enterprise networks, identify dangerous vulnerabilities, study OWASP threats, and practice defensive engineering.",
    estimatedDuration: "5-7 months",
    difficultyLevel: "Intermediate",
    requiredSkills: ["Networking", "Operating Systems", "Bash/Python"],
    steps: [
      {
        stepNumber: 1,
        title: "Cybersecurity Fundamentals & Cryptography",
        description: "Learn security methodologies, cryptography primitives, hashing algorithms, symmetric and asymmetric ciphers.",
        topics: ["Symmetric vs Asymmetric encryption", "SHA-256 Hashing algorithms", "Port Scanning & Network Protocols"],
        gfgLinks: [
          { title: "Cyber Security Tutorial", url: "https://www.geeksforgeeks.org/cyber-security-tutorial/" },
          { title: "Network Security Introduction", url: "https://www.geeksforgeeks.org/network-security/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "sec-1-cipher",
            title: "Caesar Cipher Decoder",
            difficulty: "Easy",
            description: "Write a function that decrypts a string shifted by 'k' places, checking all letters but keeping spaces and special characters intact."
          }
        ],
        miniProject: "Robust Symmetric File Encryption Command Line Tool",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-cybersecurity-1"
      },
      {
        stepNumber: 2,
        title: "OWASP Top 10 Web Vulnerability Hacking",
        description: "Identify SQL injections, Cross-Site Scripting (XSS), token hijacking, broken credentials, and defend against them.",
        topics: ["SQL Injection Vulnerability", "Cross-site Scripting (XSS)", "CSRF & Token Validation"],
        gfgLinks: [
          { title: "OWASP Top 10 Tutorial", url: "https://www.geeksforgeeks.org/owasp-top-10/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "sec-2-sanitize",
            title: "XSS Input Sanitizer",
            difficulty: "Medium",
            description: "Write a strict function that filters string values, removing potentially harmful html tags, event listeners (onerror/onload), and script entities."
          }
        ],
        miniProject: "Vulnerability Scanner for Website Forms",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-cybersecurity-2"
      }
    ]
  },
  'app-development': {
    title: "Android & Mobile App Development Roadmap",
    description: "Learn to build high-performance native apps for Android using Kotlin and Android Studio.",
    estimatedDuration: "4-6 months",
    difficultyLevel: "Beginner",
    requiredSkills: ["Java/Kotlin Basics", "OOP Concepts", "UI layouts"],
    steps: [
      {
        stepNumber: 1,
        title: "Kotlin Programming Language Foundations",
        description: "Master Kotlin, standard operators, nullability safety, functional structures, and modern classes.",
        topics: ["Kotlin variables & Null safety", "OOP concepts in Kotlin", "Coroutines & async tasks"],
        gfgLinks: [
          { title: "Android Tutorial", url: "https://www.geeksforgeeks.org/android-tutorial/" },
          { title: "Kotlin Programming Language", url: "https://www.geeksforgeeks.org/kotlin-programming-language/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "app-1-kotlin-null",
            title: "Null-Safe Collection Handler",
            difficulty: "Easy",
            description: "Write a function that filters a list containing nullable integer entries, returning a list of squared numbers with all nulls safely discarded."
          }
        ],
        miniProject: "Kotlin Console Calculator with Custom Math Parsing",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-appdev-1"
      },
      {
        stepNumber: 2,
        title: "Android Studio & Jetpack Compose UI",
        description: "Master Android Studio configurations, layout models, state handling, material theme widgets, and view models.",
        topics: ["Android Studio Project Configuration", "Jetpack Compose Declarative UI", "Activity lifecycle models"],
        gfgLinks: [
          { title: "Android Studio Tutorial", url: "https://www.geeksforgeeks.org/android-studio-tutorial/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "app-2-lifecycle",
            title: "State Saver Lifecycle",
            difficulty: "Medium",
            description: "Implement a state restoration controller simulation that saves user profiles data during UI shifts and updates the current state view."
          }
        ],
        miniProject: "Interactive Multi-screen Goal Tracking App",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-appdev-2"
      }
    ]
  },
  'ai-ml': {
    title: "Artificial Intelligence & Machine Learning Roadmap",
    description: "Design smart automated models. Learn core linear algebra, search algorithms, data regression, and neural networks.",
    estimatedDuration: "6-9 months",
    difficultyLevel: "Advanced",
    requiredSkills: ["Calculus", "Python Programming", "Statistics"],
    steps: [
      {
        stepNumber: 1,
        title: "AI Search Algorithms & Logic Structures",
        description: "Master classical AI concepts, search trees, heuristic approaches, game theory, and logical statements.",
        topics: ["BFS & DFS in state search", "A* Heuristic Search Method", "Knowledge Representation"],
        gfgLinks: [
          { title: "Artificial Intelligence", url: "https://www.geeksforgeeks.org/artificial-intelligence/" },
          { title: "Search Algorithms in AI", url: "https://www.geeksforgeeks.org/search-algorithms-in-ai/" },
          { title: "Knowledge Representation in AI", url: "https://www.geeksforgeeks.org/knowledge-representation-in-ai/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "aiml-1-astar",
            title: "Heuristic Grid Pathfind",
            difficulty: "Medium",
            description: "Given a 2D matrix representing blocks, write a function that calculates the Manhattan distance to a goal location, outputting a list of viable steps."
          }
        ],
        miniProject: "Classic Pacman AI agent solver using A*",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-aiml-1"
      },
      {
        stepNumber: 2,
        title: "Supervised and Unsupervised Learning",
        description: "Understand data modeling. Implement linear regression, clustering metrics, decision trees, and SVMs.",
        topics: ["Supervised vs Unsupervised Learning", "Linear Regression equations", "Clustering (K-Means)"],
        gfgLinks: [
          { title: "Machine Learning Tutorial", url: "https://www.geeksforgeeks.org/machine-learning/" },
          { title: "Supervised & Unsupervised Learning", url: "https://www.geeksforgeeks.org/supervised-unsupervised-learning/" },
          { title: "Linear Regression python implementation", url: "https://www.geeksforgeeks.org/linear-regression-python-implementation/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "aiml-2-regression",
            title: "Linear Loss Minimizer",
            difficulty: "Medium",
            description: "Write a function that calculates the Mean Squared Error (MSE) loss between predicted and actual variables, and outputs the parameter gradients."
          }
        ],
        miniProject: "Housing Price Predictor Model using Python Sklearn",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-aiml-2"
      }
    ]
  },
  'blockchain': {
    title: "Blockchain & Web3 Architect Roadmap",
    description: "Learn how consensus networks operate, build smart contracts using Solidity, and launch decentralized applications.",
    estimatedDuration: "5-7 months",
    difficultyLevel: "Advanced",
    requiredSkills: ["Javascript", "Cryptography basics", "Terminal usage"],
    steps: [
      {
        stepNumber: 1,
        title: "Blockchain Network Core Mechanics",
        description: "Study decentralization, cryptography keys, transactions hashing, block mining, and consensus metrics.",
        topics: ["Blockchain Introduction", "Proof of Work vs Stake", "Ethereum Architecture"],
        gfgLinks: [
          { title: "Blockchain Technology Introduction", url: "https://www.geeksforgeeks.org/blockchain-technology-introduction/" },
          { title: "Ethereum Blockchain", url: "https://www.geeksforgeeks.org/ethereum-blockchain/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "bc-1-hash",
            title: "Block Hash Miner",
            difficulty: "Easy",
            description: "Given a block properties object (index, prevHash, data, nonce), simulate a miner by finding a nonce that outputs a SHA-256 hash containing at least 2 leading zeros."
          }
        ],
        miniProject: "Console-based Proof-of-Work Blockchain simulator",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-blockchain-1"
      },
      {
        stepNumber: 2,
        title: "Smart Contracts with Solidity & Ethereum",
        description: "Design decentralized backend applications using the Solidity language, managing accounts, structures, and events.",
        topics: ["Solidity variable types", "Smart Contracts architecture", "Contract deployments and gas optimization"],
        gfgLinks: [
          { title: "Smart Contracts in Blockchain", url: "https://www.geeksforgeeks.org/smart-contracts-in-blockchain/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "bc-2-solidity",
            title: "Contract Modifier Checker",
            difficulty: "Medium",
            description: "Write a mock checker function that scans a smart contract string to verify if administrative functions have proper restriction modifiers."
          }
        ],
        miniProject: "Decentralized Voting System Solidity Contract",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-blockchain-2"
      }
    ]
  },
  'ui-ux': {
    title: "UI/UX & Product Design Roadmap",
    description: "Learn user research strategies, wireframing, color theory, component states, and construct sleek modern designs.",
    estimatedDuration: "3-5 months",
    difficultyLevel: "Beginner",
    requiredSkills: ["Visual sense", "Aesthetics", "Critical thinking"],
    steps: [
      {
        stepNumber: 1,
        title: "User Experience (UX) Principles & Wireframing",
        description: "Learn user research methodologies, personas, information architectures, wireframing, and low-fidelity prototypes.",
        topics: ["User Experience (UX) Design", "Wireframing Concepts", "Information Architectures"],
        gfgLinks: [
          { title: "User Experience or UX Design", url: "https://www.geeksforgeeks.org/user-experience-or-ux-design/" },
          { title: "Wireframing Principles", url: "https://www.geeksforgeeks.org/wireframing/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "uiux-1-wireframe",
            title: "Layout Tree Compiler",
            difficulty: "Easy",
            description: "Accept a raw textual layout representation and format it into a nested JSON structure representing parent-child UI nodes."
          }
        ],
        miniProject: "Mobile Health Booking App Low-Fidelity Wireframes",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-uiux-1"
      },
      {
        stepNumber: 2,
        title: "User Interface (UI) Design & Styling System",
        description: "Master visual layouts, typography, Harmonious Colors (HSL), micro-interactions, responsive sizing, and Figma utilities.",
        topics: ["User Interface (UI) Assets", "Color palettes & grids", "Interactive prototype flows"],
        gfgLinks: [
          { title: "User Interface (UI)", url: "https://www.geeksforgeeks.org/user-interface-ui/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "uiux-2-colors",
            title: "Contrast Ratio Evaluator",
            difficulty: "Medium",
            description: "Given hex codes for background and foreground colors, compute their relative luminance and determine if they pass the WCAG AAA standard."
          }
        ],
        miniProject: "Premium SaaS Management Console Mockup",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-uiux-2"
      }
    ]
  },
  'database-administration': {
    title: "Database Administration & Optimization Roadmap",
    description: "Learn advanced database query engines, schema indexing, replication structures, backup models, and scaling data pools.",
    estimatedDuration: "4-6 months",
    difficultyLevel: "Intermediate",
    requiredSkills: ["SQL basics", "Storage architectures", "Linux"],
    steps: [
      {
        stepNumber: 1,
        title: "Relational DB Engine Basics",
        description: "Study tables structures, transactions logs, keys constraints, query aggregations, and normalization styles.",
        topics: ["DBMS Core Structures", "Database Normalization Forms", "ACID properties verification"],
        gfgLinks: [
          { title: "DBMS Tutorial", url: "https://www.geeksforgeeks.org/dbms/" },
          { title: "Normal Forms in DBMS", url: "https://www.geeksforgeeks.org/normal-forms-in-dbms/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "db-1-normal",
            title: "Normalization Schema Checker",
            difficulty: "Medium",
            description: "Check if a set of database table attributes contains functional dependencies violating the Third Normal Form (3NF)."
          }
        ],
        miniProject: "Normalized Database Schema Blueprint for Online Bookstore",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-dbadmin-1"
      }
    ]
  },
  'qa-testing': {
    title: "QA Software Testing & Quality Assurance Roadmap",
    description: "Learn manual testing parameters, write comprehensive test cases, perform end-to-end UI automation testing.",
    estimatedDuration: "3-5 months",
    difficultyLevel: "Beginner",
    requiredSkills: ["Logic flow", "Detail-oriented", "Coding basics"],
    steps: [
      {
        stepNumber: 1,
        title: "Testing Methodologies & Test Cases",
        description: "Study black box and white box testing structures, sanity checks, regression testing, and write professional test case worksheets.",
        topics: ["Black vs White Box Testing", "Boundary Value Analysis", "Regression testing strategies"],
        gfgLinks: [
          { title: "Software Testing Introduction", url: "https://www.geeksforgeeks.org/software-testing/" },
          { title: "Manual Testing Tutorial", url: "https://www.geeksforgeeks.org/manual-testing-tutorial/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "qa-1-boundary",
            title: "Boundary Value Checker",
            difficulty: "Easy",
            description: "Given a valid input range [min, max], write a function that generates a list of test cases at boundary levels including invalid values."
          }
        ],
        miniProject: "Comprehensive Test Cases worksheet for Booking Portal",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-qatesting-1"
      }
    ]
  },
  'dsa': {
    title: "Data Structures & Algorithms (DSA) Roadmap",
    description: "Build robust problem-solving skills. Learn optimal memory architectures, recursion algorithms, trees, graphs, and dynamic programming.",
    estimatedDuration: "4-6 months",
    difficultyLevel: "Intermediate",
    requiredSkills: ["Language basics (C++, Java, JS or Python)", "Logic"],
    steps: [
      {
        stepNumber: 1,
        title: "Basic Arrays and Strings Manipulations",
        description: "Understand simple array properties, strings manipulations, pointers arrays, sorting algorithms, and complexity time calculations.",
        topics: ["Time and Space Complexity", "Array manipulations & pointers", "String operations & regex"],
        gfgLinks: [
          { title: "Data Structures", url: "https://www.geeksforgeeks.org/data-structures/" },
          { title: "Array Data Structure", url: "https://www.geeksforgeeks.org/array-data-structure/" },
          { title: "String Data Structure", url: "https://www.geeksforgeeks.org/string-data-structure/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "dsa-1-reverse",
            title: "String Word Reverser",
            difficulty: "Easy",
            description: "Given a string input, reverse the order of letters inside each word while maintaining the original spacing positions."
          }
        ],
        miniProject: "Terminal-based Custom Phonebook Directory App using sorted Arrays",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-dsa-1"
      },
      {
        stepNumber: 2,
        title: "Algorithms & Search Techniques",
        description: "Learn fast sorting techniques, search algorithms like binary search, and recursive programming.",
        topics: ["Fundamentals of Algorithms", "Binary Search method", "Recursion and Backtracking"],
        gfgLinks: [
          { title: "Fundamentals of Algorithms", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "dsa-2-binary",
            title: "Binary Search Implementer",
            difficulty: "Medium",
            description: "Write an optimized binary search function that searches for a target integer inside a sorted array, returning its index, or -1 if absent."
          }
        ],
        miniProject: "Visualizer Dashboard tool for Sorting Algorithms",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-dsa-2"
      }
    ]
  },
  'open-source': {
    title: "Open Source Contributor Roadmap",
    description: "Learn the protocols of collaborative software building, learn Git tools, and make contributions to global repos.",
    estimatedDuration: "2-4 months",
    difficultyLevel: "Beginner",
    requiredSkills: ["Git CLI", "Command terminal", "Code reading"],
    steps: [
      {
        stepNumber: 1,
        title: "Git, GitHub & Branching Protocol",
        description: "Master local repositories, commits, branch conflicts resolution, forks, and pull requests operations.",
        topics: ["Git configuration & keys", "Branching & Merging conflicts", "Pull Request protocols"],
        gfgLinks: [
          { title: "Open Source Software", url: "https://www.geeksforgeeks.org/open-source-software/" },
          { title: "Git Tutorial", url: "https://www.geeksforgeeks.org/git-tutorial/" }
        ],
        youtubeLinks: focusBeats,
        practiceProblems: [
          {
            problemId: "os-1-git",
            title: "Commit Msg Validator",
            difficulty: "Easy",
            description: "Given a commit message string, write a validator function that flags an error if it doesn't match the Conventional Commits specification."
          }
        ],
        miniProject: "Creating and Publishing a custom utility npm package",
        assessmentLinkPlaceholder: "https://hackerrank.com/test-opensource-1"
      }
    ]
  }
};

export default domainRoadmaps;
