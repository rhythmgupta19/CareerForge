const mongoose = require('mongoose');
const TerminalLab = require('../models/TerminalLab');

const initialLabs = [
  {
    labId: 'devops_lab_1',
    title: 'Linux File System Exploration',
    description: 'Master directory navigation, creation, and file manipulations.',
    category: 'linux',
    objectives: [
      'Create a folder named "workspace" inside /home/student using: mkdir workspace',
      'Navigate inside the folder using: cd workspace',
      'Create a file named "notes.txt" inside workspace using: touch notes.txt'
    ],
    validationRules: [
      { type: 'dir_exists', path: '/home/student/workspace' },
      { type: 'file_exists', path: '/home/student/workspace/notes.txt' }
    ],
    xpReward: 50
  },
  {
    labId: 'devops_lab_2',
    title: 'Git Version Control',
    description: 'Learn to track files, stage, and commit changes using Git.',
    category: 'git',
    objectives: [
      'Initialize Git in current directory using: git init',
      'Create a file named "app.js" using: touch app.js',
      'Stage the newly created file using: git add app.js',
      'Commit your changes with a message using: git commit -m "initial commit"'
    ],
    validationRules: [
      { type: 'git_initialized' },
      { type: 'file_exists', path: '/home/student/app.js' },
      { type: 'git_committed' }
    ],
    xpReward: 50
  },
  {
    labId: 'devops_lab_3',
    title: 'Docker Container Management',
    description: 'Practice building images from a Dockerfile and spinning up containers.',
    category: 'docker',
    objectives: [
      'Create a file named "Dockerfile" using: touch Dockerfile',
      'Start a background Nginx container named "my-web" using: docker run -d --name my-web nginx:alpine',
      'Build your custom app image from current directory using: docker build -t app:v1 .'
    ],
    validationRules: [
      { type: 'file_exists', path: '/home/student/Dockerfile' },
      { type: 'docker_running', imageName: 'nginx:alpine' }
    ],
    xpReward: 50
  },
  {
    labId: 'devops_lab_4',
    title: 'Kubernetes Pod Orchestration',
    description: 'Deploy workloads to Kubernetes clusters using kubectl.',
    category: 'k8s',
    objectives: [
      'Create a deployment descriptor named "pod.yaml" using: touch pod.yaml',
      'Add pod specifications using echo: echo "apiVersion: v1\\nkind: Pod\\nmetadata:\\n  name: nginx-pod" > pod.yaml',
      'Deploy the pod to your cluster using: kubectl apply -f pod.yaml'
    ],
    validationRules: [
      { type: 'file_exists', path: '/home/student/pod.yaml' },
      { type: 'k8s_applied', resourceName: 'nginx-pod' }
    ],
    xpReward: 50
  }
];

async function seedTerminalLabs() {
  try {
    if (mongoose.connection.readyState === 0) {
      const dotenv = require('dotenv');
      dotenv.config({ path: '../.env' });
      const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerforge';
      await mongoose.connect(uri);
      console.log('✅ Connected to MongoDB for seeding terminal labs');
    }

    for (const lab of initialLabs) {
      await TerminalLab.findOneAndUpdate(
        { labId: lab.labId },
        lab,
        { upsert: true, new: true }
      );
    }
    console.log('🐧 Predefined DevOps Terminal Labs successfully seeded!');
  } catch (error) {
    console.error('❌ Failed to seed DevOps Terminal Labs:', error.message);
    throw error;
  }
}

if (require.main === module) {
  seedTerminalLabs()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedTerminalLabs;
