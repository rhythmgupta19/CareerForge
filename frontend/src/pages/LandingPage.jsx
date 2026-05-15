import { Link } from 'react-router-dom';
import { ArrowRight, Code, Database, Shield, Layout, Server, Cpu } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium mb-6">
          Your Personal Career AI Agent
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white max-w-4xl tracking-tight mb-6 leading-tight">
          Forge Your Career Path with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Guided Roadmaps</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10">
          Confused about what to do beyond college? Choose a domain, follow a structured roadmap, earn badges, and get mentored by AI.
        </p>
        <div className="flex gap-4">
          <Link to="/domains" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-blue-500/30">
            Explore Domains <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-sm">
            Login
          </Link>
        </div>
      </section>

      {/* Domains Preview */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Career Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Web Development', icon: <Code />, desc: 'Build scalable full-stack applications' },
            { name: 'Data Science', icon: <Database />, desc: 'Extract insights and train ML models' },
            { name: 'Cybersecurity', icon: <Shield />, desc: 'Protect systems from modern threats' },
            { name: 'UI/UX Design', icon: <Layout />, desc: 'Design beautiful, intuitive interfaces' },
            { name: 'Cloud Computing', icon: <Server />, desc: 'Master AWS, Azure, and GCP infrastructure' },
            { name: 'DevOps Engineering', icon: <Cpu />, desc: 'Automate CI/CD pipelines and deployments' },
          ].map((domain, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {domain.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{domain.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{domain.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/domains" className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1">
            View all 14 domains <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
