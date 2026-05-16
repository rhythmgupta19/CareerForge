const mongoose = require('mongoose');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');
const Assessment = require('../models/Assessment');
const CloudCredit = require('../models/CloudCredit');

const domainData = require('./domainData');
const phaseData = require('./phaseData');
const topicData = require('./topicData');

const webDevTopics = {
  0: [
    { title: 'How the Internet Works', description: 'The foundation of everything. DNS, IP, and Browsers.', time: '1h', youtube: 'https://www.youtube.com/watch?v=7_LPdttKXPc', instructor: 'Apna College', challenge: 'Explain how a browser fetches a website to a non-technical friend.', notes: 'Focus on the Request/Response cycle and the role of the ISP.' },
    { title: 'HTTP/HTTPS Deep Dive', description: 'Understanding the protocol of the web.', time: '1h', youtube: 'https://www.youtube.com/watch?v=iYM2zFP3Zn0', instructor: 'Apna College', challenge: 'Find the status code of a broken link on any website.', notes: 'Learn about 200, 404, 500 status codes.' }
  ],
  1: [
    { title: 'Semantic HTML5', description: 'Building meaningful structure.', time: '2h', youtube: 'https://www.youtube.com/watch?v=hcMzwfj824A', instructor: 'Apna College', challenge: 'Convert a <div> based layout to a semantic one using <header>, <main>, and <footer>.', notes: 'Accessibility is the key here.' }
  ],
  2: [
    { title: 'Modern CSS & Flexbox', description: 'Mastering layouts without floats.', time: '3h', youtube: 'https://www.youtube.com/watch?v=Edsxf_NBFrw', instructor: 'Chai aur Code', challenge: 'Create a responsive 3-column layout using Flexbox.', notes: 'justify-content vs align-items is the most important concept.' }
  ],
  3: [
    { title: 'JavaScript Fundamentals', description: 'Variables, Data types, and Loops.', time: '5h', youtube: 'https://www.youtube.com/watch?v=2md4HQNRqJA', instructor: 'Chai aur Code', challenge: 'Write a program that calculates the sum of all prime numbers between 1 and 100.', notes: 'Master the "let" vs "const" and arrow functions.' },
    { title: 'DOM Manipulation', description: 'Making the web alive.', time: '4h', youtube: 'https://www.youtube.com/watch?v=y17RuWkWdn8', instructor: 'Chai aur Code', challenge: 'Build a simple "To-Do" list that adds items on click.', notes: 'Events and event listeners are your best friends.' }
  ],
  4: [
    { title: 'Git & GitHub Mastery', description: 'Version control for everyone.', time: '2h', youtube: 'https://www.youtube.com/watch?v=apGV9Kg7ics', instructor: 'Chai aur Code', challenge: 'Initialize a repo, make 3 commits, and push to GitHub.', notes: 'Learn the "staging area" concept properly.' }
  ],
  5: [
    { title: 'React Fundamentals', description: 'Components, Props, and State.', time: '10h', youtube: 'https://www.youtube.com/watch?v=e6O9shS_C0Q', instructor: 'Chai aur Code', challenge: 'Build a weather app using a public API and React.', notes: 'Think in components.' }
  ],
  6: [
    { title: 'Backend with Node & Express', description: 'Building server-side logic.', time: '8h', youtube: 'https://www.youtube.com/watch?v=7H_QH9ippp8', instructor: 'Sheriyans', challenge: 'Create a simple API that returns a list of your favorite books.', notes: 'Understanding middleware is crucial.' }
  ],
  7: [
    { title: 'MongoDB & Mongoose', description: 'Persisting data elegantly.', time: '6h', youtube: 'https://www.youtube.com/watch?v=9OD4V9fR_V0', instructor: 'Sheriyans', challenge: 'Design a schema for a "User" and "Post" relationship.', notes: 'Focus on .populate() and referencing.' }
  ],
  8: [
    { title: 'The Full Stack Project', description: 'Connecting everything together.', time: '20h', youtube: 'https://www.youtube.com/watch?v=X7U-9_n_0oU', instructor: 'Chai aur Code', challenge: 'Deploy a full-stack MERN application to Render.', notes: 'CORS and Environment variables are the biggest hurdles.' }
  ],
  9: [
    { title: 'Temporary Assignment', description: 'Complete this prerequisite assignment to unlock the Final Assessment.', time: '5h', youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', instructor: 'CareerForge', challenge: 'Build a mini-project integrating frontend and backend. Submit the GitHub link to pass.', notes: 'This must be completed to unlock the next topic.', tag: 'assignment' },
    { title: 'Final Assessment', description: 'Comprehensive test covering all phases. Unlocks certification.', time: '2h', youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', instructor: 'CareerForge', challenge: 'Clear the 50-question MCQ and the coding test.', notes: 'Passing score is 80%.', tag: 'locked_assessment' }
  ]
};

const domainsToSeed = domainData.map(d => {
  const dPhases = phaseData[d.slug] || [
    { phaseNumber: 0, name: 'Getting Started', description: `Introductory concepts for ${d.name}.` },
    { phaseNumber: 1, name: 'Fundamentals', description: `Core foundations of ${d.name}.` },
    { phaseNumber: 2, name: 'Intermediate Mastery', description: `Stepping up your ${d.name} skills.` }
  ];
  return {
    ...d,
    phases: dPhases
  };
});

// Overwrite Web Dev with a premium, gamified 9-phase roadmap
const webDevIdx = domainsToSeed.findIndex(d => d.slug === 'web-development');
if (webDevIdx !== -1) {
  domainsToSeed[webDevIdx].phases = [
    { phaseNumber: 0, name: 'The Web Voyager', description: 'Master the hidden mechanics of the internet: DNS, HTTP, and how browsers render the world.' },
    { phaseNumber: 1, name: 'Structure Sensei', description: 'Learn to build the skeletal foundation of applications with semantic HTML5 and SEO best practices.' },
    { phaseNumber: 2, name: 'Style Sorcerer', description: 'Control the visual realm using Modern CSS, Flexbox, CSS Grid, and responsive wizardry.' },
    { phaseNumber: 3, name: 'Logic Legend', description: 'Harness the power of JavaScript. Master ES6+, DOM manipulation, and asynchronous programming.' },
    { phaseNumber: 4, name: 'Version Vanguard', description: 'Learn the art of time travel with Git and collaborative warfare on GitHub.' },
    { phaseNumber: 5, name: 'Component Commander', description: 'Step into the modern era with React. Master hooks, props, and virtual DOM strategies.' },
    { phaseNumber: 6, name: 'API Architect', description: 'Build the engine. Master Node.js, Express, and RESTful API design from scratch.' },
    { phaseNumber: 7, name: 'Schema Strategist', description: 'Master the data layer. Design scalable NoSQL schemas with MongoDB and Mongoose.' },
    { phaseNumber: 8, name: 'Full Stack Titan', description: 'Assemble the MERN stack. Deploy live projects and become an industry-ready architect.' },
    { phaseNumber: 9, name: 'Assessment & Certification', description: 'Test your skills and earn your completion certificate.' }
  ];
}

async function seedAllDomains() {
  try {
    // Clear and Seed Cloud Credits
    await CloudCredit.deleteMany({});
    const credits = [
      { title: 'Google Cloud for Students', description: '$300 free credits and free tier products for students to learn and build on GCP.', link: 'https://cloud.google.com/students', platform: 'Google Cloud', category: 'cloud', icon: '☁️', eligibility: 'Students with .edu email' },
      { title: 'Azure for Students', description: '$100 credit and popular free services like VMs, App Service, and SQL Database.', link: 'https://azure.microsoft.com/en-us/free/students/', platform: 'Microsoft Azure', category: 'cloud', icon: '🔷', eligibility: 'Verified Students' },
      { title: 'AWS Activate for Founders', description: 'Up to $1,000 in AWS Activate Credits for self-funded or bootstrapped startups.', link: 'https://aws.amazon.com/activate/', platform: 'AWS', category: 'cloud', icon: '🟧', eligibility: 'Early-stage startups' },
      { title: 'GitHub Student Developer Pack', description: 'The best developer tools for free. Includes Canva, Namecheap, and Heroku credits.', link: 'https://education.github.com/pack', platform: 'GitHub', category: 'education', icon: '🐙', eligibility: 'Active Students' },
      { title: 'DigitalOcean Hatch', description: '12 months of credit to build and scale your startup on DigitalOcean.', link: 'https://www.digitalocean.com/hatch', platform: 'DigitalOcean', category: 'hosting', icon: '🌊', eligibility: 'Hatch participants' },
      { title: 'MongoDB for Students', description: '$50 Atlas credits and free training through MongoDB University.', link: 'https://www.mongodb.com/students', platform: 'MongoDB', category: 'database', icon: '🍃', eligibility: 'Students' }
    ];
    await CloudCredit.insertMany(credits);
    console.log('🎁 Cloud Credits seeded!');

    for (const d of domainsToSeed) {
      const { phases: phaseList, ...domainInfo } = d;
      const domain = await Domain.findOneAndUpdate(
        { slug: d.slug },
        domainInfo,
        { upsert: true, new: true }
      );
      console.log(`✅ Domain set: ${domain.name}`);

      // Clear existing for this domain
      await Phase.deleteMany({ domainId: domain._id });
      await Topic.deleteMany({ domainId: domain._id });
      await Assessment.deleteMany({ domainId: domain._id });

      for (const phaseInfo of phaseList) {
        const phase = await Phase.create({
          ...phaseInfo,
          domainId: domain._id,
          order: phaseInfo.phaseNumber
        });
        
        let topicsToAdd = [];
        if (domain.slug === 'web-development') {
            topicsToAdd = webDevTopics[phase.phaseNumber] || [];
        } else {
            topicsToAdd = topicData[`${domain.slug}:${phase.phaseNumber}`] || 
              [{ title: `Intro to ${phase.name}`, description: `Fundamentals of ${phase.name}.`, time: '1h' }];
        }

        if (phase.phaseNumber === 0) {
            topicsToAdd.push(
               { title: 'Video Learner Overview', description: 'Curated video playlists for visual learners. Links will be manually added later.', time: '1h', youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
               { title: 'Practice Learner Overview', description: 'Hands-on practice problems and platforms. Links will be manually added later.', time: '1h', youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
               { title: 'Project Based Learner Overview', description: 'Real-world project guides. Links will be manually added later.', time: '1h', youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
               { title: 'Mixed Learner Overview', description: 'A balanced mix of theory, practice, and videos. Links will be manually added later.', time: '1h', youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
            );
        }

        for (const t of topicsToAdd) {
          await Topic.create({
            title: t.title,
            description: t.description,
            youtubeLink: t.youtubeLink || t.youtube || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            instructor: t.instructor || '',
            challenge: t.challenge || '',
            theoryNotes: t.notes || t.theoryNotes || '',
            estimatedTime: t.estimatedTime || t.time || '1 hour',
            phaseId: phase._id,
            domainId: domain._id,
            isActive: true,
            order: t.order || topicsToAdd.indexOf(t)
          });
        }

        // Add a specialized assessment for the final phase or specific milestones
        if (phase.phaseNumber === 5 || phase.phaseNumber === phaseList.length - 1) {
            await Assessment.create({
                domainId: domain._id,
                phaseId: phase._id,
                title: `${domain.name} Mastery Assessment`,
                description: `A comprehensive test designed to validate your knowledge of ${domain.name} concepts from Phase 0 to Phase ${phase.phaseNumber}.`,
                platform: 'HackerRank',
                difficultyRating: phase.phaseNumber > 5 ? 'advanced' : 'intermediate',
                passingScore: 70,
                order: phase.phaseNumber
            });
        }
      }

      // Add a general certification assessment for all domains
      await Assessment.create({
          domainId: domain._id,
          title: `Professional ${domain.name} Certification`,
          description: `Industry-recognized verification of your ${domain.name} skills. Clear this to earn your professional badge.`,
          platform: 'Other',
          type: 'certification',
          difficultyRating: 'advanced',
          passingScore: 80,
          assessmentLink: d.certificationLink || 'https://www.hackerrank.com/skills-verification',
          order: 100
      });
    }
    console.log('🎉 All domains and assessments seeded!');
  } catch (error) {
    console.error('❌ Error seeding domains:', error);
  }
}

module.exports = seedAllDomains;

// If run directly
if (require.main === module) {
  const dotenv = require('dotenv');
  dotenv.config({ path: '.env' });
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerforge')
    .then(() => {
      console.log('📡 Connected to MongoDB for seeding...');
      return seedAllDomains();
    })
    .then(() => {
      console.log('✅ Seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
