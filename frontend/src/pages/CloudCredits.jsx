import { Cloud, ExternalLink, Gift, Server, ShieldCheck } from 'lucide-react';

const credits = [
  { id: 1, name: 'GitHub Student Developer Pack', link: 'https://education.github.com/pack', desc: 'The best developer tools, free for students.' },
  { id: 2, name: 'Google Cloud Free Program', link: 'https://cloud.google.com/free', desc: '$300 in free credits for new customers.' },
  { id: 3, name: 'Microsoft Azure for Students', link: 'https://azure.microsoft.com/free/students', desc: '$100 in Azure credit and free services.' },
  { id: 4, name: 'AWS Free Tier', link: 'https://aws.amazon.com/free/', desc: 'Free hands-on experience with AWS platform.' },
  { id: 5, name: 'MongoDB Atlas Free Tier', link: 'https://www.mongodb.com/cloud/atlas/register', desc: '512MB to 5GB free NoSQL Database storage.' },
  { id: 6, name: 'Vercel', link: 'https://vercel.com/', desc: 'Free frontend hosting and serverless functions.' },
];

const CloudCredits = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Cloud className="w-8 h-8 text-blue-500" /> Cloud Credits & Free Benefits
        </h1>
        <p className="text-gray-500 mt-2">Unlock amazing tools, hosting credits, and developer packs to power your projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credits.map(credit => (
          <div key={credit.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">{credit.name}</h3>
            <p className="text-gray-500 text-sm mb-6 flex-grow">{credit.desc}</p>
            <a href={credit.link} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 font-bold py-2.5 rounded-xl transition-colors">
              Claim Now <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudCredits;
