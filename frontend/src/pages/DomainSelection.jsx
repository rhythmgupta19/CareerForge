import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const domains = [
  { id: '1', name: 'Web Development', desc: 'Build modern full-stack web applications using React and Node.js.', difficulty: 'Beginner' },
  { id: '2', name: 'Data Science', desc: 'Extract meaningful insights from data and train machine learning models.', difficulty: 'Intermediate' },
  { id: '3', name: 'Data Analytics', desc: 'Analyze data to help business make informed decisions using SQL & Python.', difficulty: 'Beginner' },
  { id: '4', name: 'DevOps Engineering', desc: 'Automate deployments, CI/CD, and manage cloud infrastructures.', difficulty: 'Advanced' },
  { id: '5', name: 'Cloud Computing', desc: 'Master AWS, Azure, and Google Cloud infrastructure and services.', difficulty: 'Intermediate' },
  { id: '6', name: 'Cybersecurity', desc: 'Protect systems, networks, and programs from digital attacks.', difficulty: 'Advanced' },
  { id: '7', name: 'App Development', desc: 'Create mobile applications for iOS and Android using Flutter or React Native.', difficulty: 'Intermediate' },
  { id: '8', name: 'AI/ML Engineering', desc: 'Build intelligent systems and deep learning models.', difficulty: 'Advanced' },
  { id: '9', name: 'Blockchain Development', desc: 'Develop decentralized applications and smart contracts.', difficulty: 'Advanced' },
  { id: '10', name: 'UI/UX Design', desc: 'Design engaging and beautiful user interfaces and experiences.', difficulty: 'Beginner' },
  { id: '11', name: 'Database Administration', desc: 'Manage and optimize complex database systems.', difficulty: 'Intermediate' },
  { id: '12', name: 'Software Testing / QA', desc: 'Ensure software quality through manual and automated testing.', difficulty: 'Beginner' },
  { id: '13', name: 'Competitive Programming', desc: 'Master algorithms and data structures for problem-solving.', difficulty: 'Intermediate' },
  { id: '14', name: 'Open Source Contribution', desc: 'Learn to contribute to global open source projects.', difficulty: 'Beginner' }
];

const DomainSelection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Select Your Career Domain</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Choose a domain to start your guided learning journey. You can always change this later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {domains.map(domain => (
          <div key={domain.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full 
                ${domain.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
                  domain.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700'}`}>
                {domain.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{domain.name}</h3>
            <p className="text-gray-500 text-sm mb-6 flex-grow">{domain.desc}</p>
            <Link to={`/roadmap/${domain.id}`} className="w-full flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-900 dark:text-gray-100 font-bold py-3 rounded-xl transition-colors">
              View Roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainSelection;
