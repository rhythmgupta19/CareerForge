import { CheckCircle, ShieldCheck, PlayCircle, ExternalLink } from 'lucide-react';

const assessments = [
  { id: 1, title: 'JavaScript Basic Certification', platform: 'HackerRank', type: 'certification', link: 'https://www.hackerrank.com/skills-verification/javascript_basic', status: 'completed' },
  { id: 2, title: 'CSS Basic Certification', platform: 'HackerRank', type: 'certification', link: 'https://www.hackerrank.com/skills-verification/css_basic', status: 'available' },
  { id: 3, title: 'React Basic Certification', platform: 'HackerRank', type: 'certification', link: 'https://www.hackerrank.com/skills-verification/react_basic', status: 'locked' },
  { id: 4, title: 'SQL Basic Certification', platform: 'HackerRank', type: 'certification', link: 'https://www.hackerrank.com/skills-verification/sql_basic', status: 'available' }
];

const AssessmentsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-500" /> Assessments & Certifications
        </h1>
        <p className="text-gray-500 mt-2">Validate your skills through external platforms like HackerRank to earn badges.</p>
      </div>

      <div className="space-y-4">
        {assessments.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              {item.status === 'completed' ? (
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
              ) : item.status === 'locked' ? (
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <PlayCircle className="w-6 h-6" />
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {item.platform}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase
                    ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'available' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className={`text-lg font-bold ${item.status === 'locked' ? 'text-gray-400' : ''}`}>{item.title}</h3>
              </div>
            </div>

            {item.status !== 'locked' && (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors
                ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {item.status === 'completed' ? 'View Certificate' : 'Take Test'} <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentsPage;
