export const DSA_LEVELS = [
  'Programming Foundations',
  'Arrays Explorer',
  'Hashing Hunter',
  'Recursion Survivor',
  'Linked List Warrior',
  'Stack & Queue Master',
  'Tree Master',
  'Graph Adventurer',
  'Dynamic Programming Beast',
  'Greedy Strategist',
  'Placement Challenger'
];

export const DSA_LANGUAGE_LABELS = {
  cpp: 'C++',
  java: 'Java',
  python: 'Python',
  javascript: 'JavaScript',
  js: 'JavaScript'
};

export const DSA_BADGES = [
  { minLevel: 0, name: 'Beginner Warrior' },
  { minLevel: 1, name: 'Array Rookie' },
  { minLevel: 3, name: 'Recursion Survivor' },
  { minLevel: 6, name: 'Tree Explorer' },
  { minLevel: 7, name: 'Graph Master' },
  { minLevel: 8, name: 'DP Beast' },
  { minLevel: 10, name: 'Placement Ready' }
];

export const normalizeDsaLanguage = (language) => {
  if (language === 'js') return 'javascript';
  return language || 'cpp';
};

export const getStreakRank = (streak = 0) => {
  if (streak >= 120) return { name: 'Legendary Coder', next: 'Maintain your legendary rhythm', color: 'text-fuchsia-500' };
  if (streak >= 60) return { name: 'Platinum', next: '120-day legendary streak', color: 'text-cyan-500' };
  if (streak >= 30) return { name: 'Gold', next: '60-day platinum streak', color: 'text-amber-500' };
  if (streak >= 5) return { name: 'Bronze', next: '30-day silver streak', color: 'text-orange-500' };
  return { name: 'Rookie', next: `${Math.max(5 - streak, 1)} days to Bronze`, color: 'text-indigo-500' };
};

export const getDsaBadgeForLevel = (level = 0) => {
  return [...DSA_BADGES].reverse().find((badge) => level >= badge.minLevel) || DSA_BADGES[0];
};

const hasKnown = (answers, topic) => (answers.dsa_known_topics || []).includes(topic);

export const analyzeDsaProfile = (answers = {}) => {
  const language = normalizeDsaLanguage(answers.dsa_language);
  const dailyTime = Number(answers.daily_time || 60);
  const solvedBefore = answers.dsa_problem_experience || 'never';
  const codingExperience = answers.coding_experience || 'never';
  const knownTopics = answers.dsa_known_topics || [];
  const goal = answers.goal || 'placements';

  let score = 0;
  if (codingExperience === 'basic') score += 1;
  if (codingExperience === 'some_problems') score += 2;
  if (codingExperience === 'comfortable') score += 3;
  if (hasKnown(answers, 'variables')) score += 1;
  if (hasKnown(answers, 'loops')) score += 1;
  if (hasKnown(answers, 'functions')) score += 1;
  if (hasKnown(answers, 'arrays')) score += 2;
  if (hasKnown(answers, 'recursion')) score += 2;
  if (solvedBefore === 'beginner') score += 1;
  if (solvedBefore === 'some_leetcode') score += 3;
  if (solvedBefore === 'regular') score += 5;

  let startingLevel = 0;
  let startReason = 'Start from printing and input/output so syntax never becomes a hidden blocker.';
  if (score >= 10) {
    startingLevel = 3;
    startReason = 'You already have coding reps, arrays, and recursion exposure, so foundations become a quick review.';
  } else if (score >= 7) {
    startingLevel = 2;
    startReason = 'Your basics are strong enough to move directly into hashing after a short arrays warm-up.';
  } else if (score >= 4 || (hasKnown(answers, 'loops') && hasKnown(answers, 'functions'))) {
    startingLevel = 1;
    startReason = 'You know enough programming basics to skip the slowest intro lessons and begin with arrays.';
  }

  const roadmapType = startingLevel >= 2 || solvedBefore === 'regular' ? 'Fast-Track' : 'Beginner Roadmap';
  const recommendedPace = dailyTime >= 120 ? 'Sprint Pace' : dailyTime >= 60 ? 'Steady Pace' : 'Micro-Learning Pace';
  const timeline = dailyTime >= 120
    ? (roadmapType === 'Fast-Track' ? '10-12 weeks' : '4-5 months')
    : dailyTime >= 60
      ? (roadmapType === 'Fast-Track' ? '4-5 months' : '6-7 months')
      : (roadmapType === 'Fast-Track' ? '6-8 months' : '9-10 months');

  const goalCopy = {
    placements: 'placement interview readiness',
    internship: 'internship screening confidence',
    problem_solving: 'clear problem-solving muscle',
    competitive: 'competitive programming foundations'
  };

  const weakTopics = [];
  if (!hasKnown(answers, 'recursion')) weakTopics.push('Recursion');
  if (!hasKnown(answers, 'arrays')) weakTopics.push('Arrays');
  if (knownTopics.length <= 2) weakTopics.push('Programming Foundations');

  const strongestTopic = hasKnown(answers, 'arrays') ? 'Arrays' : hasKnown(answers, 'functions') ? 'Functions' : 'Fresh Start';

  return {
    language,
    languageLabel: DSA_LANGUAGE_LABELS[language] || 'C++',
    skillLevel: score >= 10 ? 'intermediate' : score >= 5 ? 'builder' : 'beginner',
    startingLevel,
    startLevelName: DSA_LEVELS[startingLevel],
    roadmapType,
    recommendedPace,
    estimatedTimeline: timeline,
    startReason,
    strongestTopic,
    weakTopics: weakTopics.slice(0, 3),
    unlockedLevels: DSA_LEVELS.map((name, index) => ({ name, index, unlocked: index <= startingLevel })),
    aiSummary: `You are starting at Level ${startingLevel}: ${DSA_LEVELS[startingLevel]} in ${DSA_LANGUAGE_LABELS[language] || 'C++'}. This is a ${roadmapType.toLowerCase()} tuned for ${goalCopy[goal] || 'DSA mastery'} with a ${recommendedPace.toLowerCase()} timeline of ${timeline}. ${startReason}`
  };
};

export const getLessonAssessment = (topicTitle = '', language = 'cpp') => {
  const title = topicTitle.toLowerCase();
  const langLabel = DSA_LANGUAGE_LABELS[normalizeDsaLanguage(language)] || 'C++';

  if (title.includes('array') || title.includes('vector') || title.includes('list')) {
    return [
      { type: 'MCQ', prompt: 'What is the time complexity of reading arr[i] by index?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N log N)'], answer: 'O(1)' },
      { type: 'MCQ', prompt: 'Which of the following describes an array in memory?', options: ['Linked nodes', 'Contiguous memory locations', 'Randomly distributed blocks', 'Key-value pairs'], answer: 'Contiguous memory locations' },
      { type: 'MCQ', prompt: `What is the index of the last element in an array of size N in ${langLabel}?`, options: ['N', 'N - 1', '1', '0'], answer: 'N - 1' }
    ];
  }

  if (title.includes('recursion') || title.includes('backtrack')) {
    return [
      { type: 'MCQ', prompt: 'What must every recursive solution include to avoid infinite loops?', options: ['A base case', 'A loop counter', 'A return statement', 'An array initialization'], answer: 'A base case' },
      { type: 'MCQ', prompt: 'Which data structure is used internally by the system to manage recursive function calls?', options: ['Queue', 'Stack', 'Linked List', 'Binary Search Tree'], answer: 'Stack' },
      { type: 'MCQ', prompt: 'What runtime error is thrown when recursion depth exceeds system limits?', options: ['Stack Overflow', 'Out of Memory', 'Null Pointer Exception', 'Buffer Overflow'], answer: 'Stack Overflow' }
    ];
  }

  if (title.includes('hash') || title.includes('map') || title.includes('frequency') || title.includes('dictionary')) {
    return [
      { type: 'MCQ', prompt: 'Which data structure is commonly used for constant-time key-value frequency counting?', options: ['Hash Map', 'Binary Tree', 'Stack', 'Queue'], answer: 'Hash Map' },
      { type: 'MCQ', prompt: 'What is the average time complexity of insertion and search in a Hash Map?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N log N)'], answer: 'O(1)' },
      { type: 'MCQ', prompt: 'What happens when two distinct keys hash to the identical index in a hash map?', options: ['Hash Collision', 'Buffer Overflow', 'Array Exception', 'Memory Leak'], answer: 'Hash Collision' }
    ];
  }

  if (title.includes('html') || title.includes('css') || title.includes('web')) {
    return [
      { type: 'MCQ', prompt: 'Which HTML5 semantic element is most appropriate for a container of navigation links?', options: ['<nav>', '<header>', '<section>', '<ul>'], answer: '<nav>' },
      { type: 'MCQ', prompt: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Complex Style System'], answer: 'Cascading Style Sheets' },
      { type: 'MCQ', prompt: 'Which HTML tag is used to link an external CSS file?', options: ['<link>', '<style>', '<script>', '<a>'], answer: '<link>' }
    ];
  }

  if (title.includes('javascript') || title.includes('js') || title.includes('dom')) {
    return [
      { type: 'MCQ', prompt: 'Which ES6 variable declaration keyword prevents variable re-assignment?', options: ['const', 'let', 'var', 'define'], answer: 'const' },
      { type: 'MCQ', prompt: 'What asynchronous object is used in JS to handle operations that will finish in the future?', options: ['Promise', 'Callback', 'Event Loop', 'Closure'], answer: 'Promise' },
      { type: 'MCQ', prompt: 'Which browser event is fired when user clicks an interactive element?', options: ['click', 'hover', 'load', 'submit'], answer: 'click' }
    ];
  }

  if (title.includes('docker') || title.includes('container')) {
    return [
      { type: 'MCQ', prompt: 'What file is used to define custom configuration blueprints for building container images?', options: ['Dockerfile', 'docker-compose.yml', 'package.json', 'Makefile'], answer: 'Dockerfile' },
      { type: 'MCQ', prompt: 'What docker command starts a container in detached background mode?', options: ['docker run -d', 'docker start -b', 'docker up', 'docker run -t'], answer: 'docker run -d' },
      { type: 'MCQ', prompt: 'What does containerization achieve?', options: ['Isolates software dependencies and environments', 'Compiles code to machine language', 'Speeds up CPU raw speed', 'Deletes virtual machines'], answer: 'Isolates software dependencies and environments' }
    ];
  }

  if (title.includes('kubernetes') || title.includes('k8s') || title.includes('pod')) {
    return [
      { type: 'MCQ', prompt: 'What is the smallest deployable computing unit in Kubernetes?', options: ['Pod', 'Container', 'Service', 'Deployment'], answer: 'Pod' },
      { type: 'MCQ', prompt: 'Which Kubernetes resources defines ingress or external network exposure for pods?', options: ['Service', 'ConfigMap', 'DaemonSet', 'Volume'], answer: 'Service' },
      { type: 'MCQ', prompt: 'What command-line tool is standard for controlling Kubernetes clusters?', options: ['kubectl', 'kubelet', 'docker', 'helm'], answer: 'kubectl' }
    ];
  }

  if (title.includes('linux') || title.includes('bash') || title.includes('command') || title.includes('terminal')) {
    return [
      { type: 'MCQ', prompt: 'Which command prints the absolute file path of the current directory?', options: ['pwd', 'ls', 'cd', 'whoami'], answer: 'pwd' },
      { type: 'MCQ', prompt: 'Which command modifies file permissions (read/write/execute) in Linux?', options: ['chmod', 'chown', 'touch', 'mkdir'], answer: 'chmod' },
      { type: 'MCQ', prompt: 'Which command allows executing programs with root/superuser administration access?', options: ['sudo', 'su', 'runas', 'admin'], answer: 'sudo' }
    ];
  }

  if (title.includes('git') || title.includes('github') || title.includes('branch')) {
    return [
      { type: 'MCQ', prompt: 'Which command initializes a new git tracking repository in the current directory?', options: ['git init', 'git clone', 'git add', 'git commit'], answer: 'git init' },
      { type: 'MCQ', prompt: 'Which command fetches remote changes and integrates them directly into the current branch?', options: ['git pull', 'git fetch', 'git push', 'git branch'], answer: 'git pull' },
      { type: 'MCQ', prompt: 'What command shows staging changes and active modified file paths?', options: ['git status', 'git diff', 'git log', 'git show'], answer: 'git status' }
    ];
  }

  // Fallback MCQ questions if no keyword matches
  return [
    { type: 'MCQ', prompt: 'What is the purpose of dry-running algorithm solutions on paper?', options: ['To detect logical and edge-case errors before compiling', 'To format the code style', 'To speed up network requests', 'To install dependencies'], answer: 'To detect logical and edge-case errors before compiling' },
    { type: 'MCQ', prompt: 'What is the runtime time complexity of accessing elements in a Hash Set?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'], answer: 'O(1)' },
    { type: 'MCQ', prompt: 'Which memory section stores dynamically allocated objects and variables?', options: ['Heap', 'Stack', 'Register', 'Cache'], answer: 'Heap' }
  ];
};
