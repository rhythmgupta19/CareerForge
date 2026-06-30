const mongoose = require('mongoose');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');

const domainData = require('./domainData');

const domainsToSeed = domainData.map(d => ({
  ...d,
  phases: [
    { phaseNumber: 0, name: 'Getting Started', description: `Introductory concepts for ${d.name}.` },
    { phaseNumber: 1, name: 'Fundamentals', description: `Core foundations of ${d.name}.` },
    { phaseNumber: 2, name: 'Intermediate Mastery', description: `Stepping up your ${d.name} skills.` }
  ]
}));

const webDevTopics = {
  0: [
    { 
      title: 'How the Internet Works', 
      description: 'The foundation of everything. DNS, IP, and Browsers.', 
      time: '1h', 
      youtube: 'https://www.youtube.com/watch?v=7_LPdttKXPc', 
      instructor: 'Apna College',
      challenge: 'Explain how a browser fetches a website to a non-technical friend.',
      notes: 'Focus on the Request/Response cycle and the role of the ISP.'
    },
    { 
      title: 'HTTP/HTTPS Deep Dive', 
      description: 'Understanding the protocol of the web.', 
      time: '1h', 
      youtube: 'https://www.youtube.com/watch?v=iYM2zFP3Zn0', 
      instructor: 'Apna College',
      challenge: 'Find the status code of a broken link on any website.',
      notes: 'Learn about 200, 404, 500 status codes.'
    }
  ],
  1: [
    { 
      title: 'Semantic HTML5', 
      description: 'Building meaningful structure.', 
      time: '2h', 
      youtube: 'https://www.youtube.com/watch?v=hcMzwfj824A', 
      instructor: 'Apna College',
      challenge: 'Convert a <div> based layout to a semantic one using <header>, <main>, and <footer>.',
      notes: 'Accessibility is the key here.'
    }
  ],
  2: [
    { 
      title: 'Modern CSS & Flexbox', 
      description: 'Mastering layouts without floats.', 
      time: '3h', 
      youtube: 'https://www.youtube.com/watch?v=Edsxf_NBFrw', 
      instructor: 'Chai aur Code',
      challenge: 'Create a responsive 3-column layout using Flexbox.',
      notes: 'justify-content vs align-items is the most important concept.'
    }
  ],
  3: [
    { 
      title: 'JavaScript Fundamentals', 
      description: 'Variables, Data types, and Loops.', 
      time: '5h', 
      youtube: 'https://www.youtube.com/watch?v=2md4HQNRqJA', 
      instructor: 'Chai aur Code',
      challenge: 'Write a program that calculates the sum of all prime numbers between 1 and 100.',
      notes: 'Master the "let" vs "const" and arrow functions.'
    },
    { 
      title: 'DOM Manipulation', 
      description: 'Making the web alive.', 
      time: '4h', 
      youtube: 'https://www.youtube.com/watch?v=y17RuWkWdn8', 
      instructor: 'Chai aur Code',
      challenge: 'Build a simple "To-Do" list that adds items on click.',
      notes: 'Events and event listeners are your best friends.'
    }
  ],
  4: [
    { 
      title: 'Git & GitHub Mastery', 
      description: 'Version control for everyone.', 
      time: '2h', 
      youtube: 'https://www.youtube.com/watch?v=apGV9Kg7ics', 
      instructor: 'Chai aur Code',
      challenge: 'Initialize a repo, make 3 commits, and push to GitHub.',
      notes: 'Learn the "staging area" concept properly.'
    }
  ],
  5: [
    { 
      title: 'React Fundamentals', 
      description: 'Components, Props, and State.', 
      time: '10h', 
      youtube: 'https://www.youtube.com/watch?v=e6O9shS_C0Q', 
      instructor: 'Chai aur Code',
      challenge: 'Build a weather app using a public API and React.',
      notes: 'Think in components.'
    }
  ],
  6: [
    { 
      title: 'Backend with Node & Express', 
      description: 'Building server-side logic.', 
      time: '8h', 
      youtube: 'https://www.youtube.com/watch?v=7H_QH9ippp8', 
      instructor: 'Sheriyans',
      challenge: 'Create a simple API that returns a list of your favorite books.',
      notes: 'Understanding middleware is crucial.'
    }
  ],
  7: [
    { 
      title: 'MongoDB & Mongoose', 
      description: 'Persisting data elegantly.', 
      time: '6h', 
      youtube: 'https://www.youtube.com/watch?v=9OD4V9fR_V0', 
      instructor: 'Sheriyans',
      challenge: 'Design a schema for a "User" and "Post" relationship.',
      notes: 'Focus on .populate() and referencing.'
    }
  ],
  8: [
    { 
      title: 'The Full Stack Project', 
      description: 'Connecting everything together.', 
      time: '20h', 
      youtube: 'https://www.youtube.com/watch?v=X7U-9_n_0oU', 
      instructor: 'Chai aur Code',
      challenge: 'Deploy a full-stack MERN application to Render.',
      notes: 'CORS and Environment variables are the biggest hurdles.'
    }
  ]
};

// Overwrite Web Dev with the new 5-phase roadmap
const webDevIdx = domainsToSeed.findIndex(d => d.slug === 'web-development');
if (webDevIdx !== -1) {
  domainsToSeed[webDevIdx].phases = [
    { phaseNumber: 0, name: 'Web Foundations & Responsive Layouts', description: 'Master the fundamentals of web pages (HTML, CSS, basic JS) and construct highly responsive layouts.' },
    { phaseNumber: 1, name: 'JavaScript Mastery', description: 'Deep dive into JS fundamentals, scoping, asynchronous behavior, and preparation for placement interviews.' },
    { phaseNumber: 2, name: 'Modern Frontend (React, Redux & TS)', description: 'Master component-driven development using React.js, global state using Redux Toolkit, and type safety with TypeScript.' },
    { phaseNumber: 3, name: 'Backend Engineering & APIs', description: 'Learn servers, databases, advanced transactions, and production-grade auth systems using Node, Express, and MongoDB.' },
    { phaseNumber: 4, name: 'Full Stack Integration & AI', description: 'Connect frontend and backend, secure your stack, and integrate Gemini AI APIs into a complete full stack project.' }
  ];
}

const phaseData = require('./phaseData');
const topicData = require('./topicData');

async function seedAllDomains() {
  try {
    for (const d of domainsToSeed) {
      const domain = await Domain.findOneAndUpdate(
        { slug: d.slug },
        { ...d },
        { upsert: true, new: true }
      );
      console.log(`✅ Domain set: ${domain.name}`);

      const phases = phaseData[domain.slug] || [];
      for (const phaseInfo of phases) {
        const phase = await Phase.findOneAndUpdate(
          { domainId: domain._id, phaseNumber: phaseInfo.phaseNumber },
          {
            ...phaseInfo,
            domainId: domain._id,
            order: phaseInfo.phaseNumber
          },
          { upsert: true, new: true }
        );
        
        const topicKey = `${domain.slug}:${phase.phaseNumber}`;
        const topics = topicData[topicKey] || [];
        
        if (topics.length > 0) {
          for (const t of topics) {
            await Topic.findOneAndUpdate(
              { domainId: domain._id, phaseId: phase._id, title: t.title },
              {
                ...t,
                phaseId: phase._id,
                domainId: domain._id,
                isActive: true
              },
              { upsert: true, new: true }
            );
          }
        } else {
          // Default topic if none specified
          await Topic.findOneAndUpdate(
            { domainId: domain._id, phaseId: phase._id, title: `Intro to ${phase.name}` },
            {
              title: `Intro to ${phase.name}`,
              description: `Core concepts and foundations of ${phase.name}.`,
              youtubeLink: 'https://www.youtube.com/watch?v=hcMzwfj824A',
              estimatedTime: '1 hour',
              phaseId: phase._id,
              domainId: domain._id,
              isActive: true,
              order: 0
            },
            { upsert: true, new: true }
          );
        }
      }
    }
    console.log('🎉 All domains seeded!');
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
