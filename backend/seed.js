import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Domain from './models/Domain.js';
import Phase from './models/Phase.js';
import Topic from './models/Topic.js';
import Assessment from './models/Assessment.js';
import Badge from './models/Badge.js';
import CloudCredit from './models/CloudCredit.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Domain.deleteMany();
    await Phase.deleteMany();
    await Topic.deleteMany();
    await Assessment.deleteMany();
    await Badge.deleteMany();
    await CloudCredit.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    await User.create([
      { name: 'Admin User', email: 'admin@careerforge.com', password: adminPassword, role: 'admin' },
      { name: 'Student User', email: 'student@careerforge.com', password: studentPassword, role: 'student' }
    ]);

    const domainsData = [
      { name: 'Web Development', description: 'Build full-stack web applications.', difficulty: 'Beginner', duration: '6 Months', prerequisites: ['Basic Computer Knowledge'], careerRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'] },
      { name: 'Data Science', description: 'Extract insights from data.', difficulty: 'Intermediate', duration: '8 Months', prerequisites: ['Math Basics', 'Python Basics'], careerRoles: ['Data Scientist', 'Machine Learning Engineer'] },
      { name: 'Data Analytics', description: 'Analyze data to help business.', difficulty: 'Beginner', duration: '5 Months', prerequisites: ['Basic Math', 'Excel'], careerRoles: ['Data Analyst', 'Business Analyst'] },
      { name: 'DevOps Engineering', description: 'Unify software development and operation.', difficulty: 'Advanced', duration: '7 Months', prerequisites: ['Linux Basics', 'Networking'], careerRoles: ['DevOps Engineer', 'SRE'] },
      { name: 'Cloud Computing', description: 'Master cloud infrastructure.', difficulty: 'Intermediate', duration: '6 Months', prerequisites: ['Networking', 'Linux'], careerRoles: ['Cloud Architect', 'Cloud Engineer'] },
      { name: 'Cybersecurity', description: 'Protect systems and networks.', difficulty: 'Advanced', duration: '9 Months', prerequisites: ['Networking', 'Linux', 'Web Basics'], careerRoles: ['Security Analyst', 'Penetration Tester'] },
      { name: 'App Development', description: 'Create mobile applications.', difficulty: 'Intermediate', duration: '6 Months', prerequisites: ['Programming Basics'], careerRoles: ['Android Developer', 'iOS Developer', 'Flutter Developer'] },
      { name: 'AI/ML Engineering', description: 'Build intelligent systems.', difficulty: 'Advanced', duration: '10 Months', prerequisites: ['Python', 'Math', 'Data Science Basics'], careerRoles: ['AI Engineer', 'ML Engineer'] },
      { name: 'Blockchain Development', description: 'Develop decentralized apps.', difficulty: 'Advanced', duration: '7 Months', prerequisites: ['Web Development', 'Cryptography Basics'], careerRoles: ['Blockchain Developer', 'Smart Contract Engineer'] },
      { name: 'UI/UX Design', description: 'Design engaging interfaces.', difficulty: 'Beginner', duration: '4 Months', prerequisites: ['Creativity'], careerRoles: ['UI Designer', 'UX Researcher'] },
      { name: 'Database Administration', description: 'Manage database systems.', difficulty: 'Intermediate', duration: '5 Months', prerequisites: ['SQL Basics'], careerRoles: ['Database Administrator'] },
      { name: 'Software Testing / QA', description: 'Ensure software quality.', difficulty: 'Beginner', duration: '4 Months', prerequisites: ['Basic Programming'], careerRoles: ['QA Engineer', 'Test Automation Engineer'] },
      { name: 'Competitive Programming / DSA', description: 'Master algorithms.', difficulty: 'Intermediate', duration: '8 Months', prerequisites: ['Programming Basics'], careerRoles: ['Software Engineer'] },
      { name: 'Open Source Contribution', description: 'Contribute to open source projects.', difficulty: 'Beginner', duration: '3 Months', prerequisites: ['Git Basics'], careerRoles: ['Open Source Contributor'] }
    ];

    const createdDomains = await Domain.insertMany(domainsData);

    const getDomainId = (name) => createdDomains.find(d => d.name === name)?._id;

    // Web Development Seed
    const webDevId = getDomainId('Web Development');
    if (webDevId) {
      const wdPhases = await Phase.insertMany([
        { domainId: webDevId, name: 'Internet and Web Basics', order: 1 },
        { domainId: webDevId, name: 'HTML', order: 2 },
        { domainId: webDevId, name: 'CSS', order: 3 },
        { domainId: webDevId, name: 'JavaScript', order: 4 },
        { domainId: webDevId, name: 'Git and GitHub', order: 5 },
        { domainId: webDevId, name: 'React.js', order: 6 },
        { domainId: webDevId, name: 'Backend with Node.js and Express.js', order: 7 },
        { domainId: webDevId, name: 'Database with MongoDB/SQL', order: 8 },
        { domainId: webDevId, name: 'Final Full-Stack Project', order: 9 }
      ]);

      await Topic.insertMany([
        { phaseId: wdPhases[1]._id, title: 'HTML Basics', order: 1, theoryLink: 'https://www.geeksforgeeks.org/html/html-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=html+full+course+for+beginners', isRequired: true },
        { phaseId: wdPhases[2]._id, title: 'CSS Basics', order: 1, theoryLink: 'https://www.geeksforgeeks.org/css/css-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=css+full+course+for+beginners', isRequired: true },
        { phaseId: wdPhases[3]._id, title: 'JavaScript Basics', order: 1, theoryLink: 'https://www.geeksforgeeks.org/javascript/javascript-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=javascript+full+course+for+beginners', isRequired: true },
        { phaseId: wdPhases[5]._id, title: 'React Basics', order: 1, theoryLink: 'https://www.geeksforgeeks.org/react/react-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=react+js+full+course+for+beginners', isRequired: true },
        { phaseId: wdPhases[6]._id, title: 'Node.js', order: 1, theoryLink: 'https://www.geeksforgeeks.org/node-js/nodejs/', youtubeLink: 'https://www.youtube.com/results?search_query=node+js+express+mongodb+full+course', isRequired: true },
        { phaseId: wdPhases[6]._id, title: 'Express.js', order: 2, theoryLink: 'https://www.geeksforgeeks.org/node-js/express-js/', isRequired: true },
        { phaseId: wdPhases[7]._id, title: 'SQL Basics', order: 1, theoryLink: 'https://www.geeksforgeeks.org/sql/sql-tutorial/', isRequired: true }
      ]);

      await Assessment.create({
        title: 'JavaScript Basic Certification',
        type: 'certification',
        platform: 'HackerRank',
        assessmentLink: 'ADMIN_WILL_ADD_HACKERRANK_ASSESSMENT_LINK',
        hackerRankCertificationLink: 'https://www.hackerrank.com/skills-verification/javascript_basic'
      });
      
      const domain = await Domain.findById(webDevId);
      domain.phases = wdPhases.map(p => p._id);
      await domain.save();
    }

    // Data Science Seed
    const dsId = getDomainId('Data Science');
    if (dsId) {
      const dsPhases = await Phase.insertMany([
        { domainId: dsId, name: 'Python Basics', order: 1 },
        { domainId: dsId, name: 'Math for Data Science', order: 2 },
        { domainId: dsId, name: 'NumPy', order: 3 },
        { domainId: dsId, name: 'Pandas', order: 4 },
        { domainId: dsId, name: 'Machine Learning Basics', order: 5 },
        { domainId: dsId, name: 'Projects', order: 6 }
      ]);
      await Topic.insertMany([
        { phaseId: dsPhases[0]._id, title: 'Python Basics', order: 1, theoryLink: 'https://www.geeksforgeeks.org/python/python-programming-language-tutorial/', isRequired: true },
        { phaseId: dsPhases[2]._id, title: 'NumPy Tutorial', order: 1, theoryLink: 'https://www.geeksforgeeks.org/python/numpy-tutorial/', isRequired: true },
        { phaseId: dsPhases[3]._id, title: 'Pandas Tutorial', order: 1, theoryLink: 'https://www.geeksforgeeks.org/python/pandas-tutorial/', isRequired: true },
        { phaseId: dsPhases[4]._id, title: 'Machine Learning', order: 1, theoryLink: 'https://www.geeksforgeeks.org/machine-learning/machine-learning/', youtubeLink: 'https://www.youtube.com/results?search_query=data+science+roadmap+for+beginners', isRequired: true }
      ]);
      const domain = await Domain.findById(dsId);
      domain.phases = dsPhases.map(p => p._id);
      await domain.save();
    }
    
    // DevOps Engineering Seed
    const devopsId = getDomainId('DevOps Engineering');
    if(devopsId) {
      const devopsPhases = await Phase.insertMany([
        { domainId: devopsId, name: 'Linux Basics', order: 1 },
        { domainId: devopsId, name: 'Docker', order: 2 },
        { domainId: devopsId, name: 'Kubernetes', order: 3 },
        { domainId: devopsId, name: 'CI/CD', order: 4 }
      ]);
      await Topic.insertMany([
        { phaseId: devopsPhases[0]._id, title: 'Linux Tutorial', order: 1, theoryLink: 'https://www.geeksforgeeks.org/linux-unix/linux-tutorial/', isRequired: true },
        { phaseId: devopsPhases[1]._id, title: 'Docker Tutorial', order: 1, theoryLink: 'https://www.geeksforgeeks.org/devops/docker-tutorial/', isRequired: true },
        { phaseId: devopsPhases[2]._id, title: 'Kubernetes Tutorial', order: 1, theoryLink: 'https://www.geeksforgeeks.org/devops/kubernetes-tutorial/', isRequired: true }
      ]);
      const domain = await Domain.findById(devopsId);
      domain.phases = devopsPhases.map(p => p._id);
      await domain.save();
    }

    // Cloud Credits
    await CloudCredit.insertMany([
      { name: 'GitHub Student Developer Pack', link: 'https://education.github.com/pack' },
      { name: 'Google Cloud Free Program', link: 'https://cloud.google.com/free' },
      { name: 'Microsoft Azure for Students', link: 'https://azure.microsoft.com/free/students' },
      { name: 'AWS Free Tier', link: 'https://aws.amazon.com/free/' },
      { name: 'MongoDB Atlas Free Tier', link: 'https://www.mongodb.com/cloud/atlas/register' },
      { name: 'Vercel', link: 'https://vercel.com/' }
    ]);

    // Badges
    await Badge.insertMany([
      { name: 'Domain Starter', description: 'Selected your first domain', icon: 'Rocket' },
      { name: 'HTML Starter', description: 'Completed HTML Phase', icon: 'Code' },
      { name: '7-Day Streak', description: 'Studied for 7 days consecutively', icon: 'Flame' },
      { name: 'Roadmap Finisher', description: 'Completed a full domain roadmap', icon: 'Trophy' }
    ]);

    console.log('Seed data successfully imported!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
