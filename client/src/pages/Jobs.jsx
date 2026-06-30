import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiExternalLink, FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiSearch, FiSliders, FiAward, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'job', 'internship'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'frontend', 'backend', 'fullstack', 'devops', 'dsa'
  const [selectedSource, setSelectedSource] = useState('all'); // 'all', 'linkedin', 'naukri'

  useEffect(() => {
    fetchJobs();
  }, [selectedType, selectedCategory, selectedSource]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs', {
        params: {
          type: selectedType,
          category: selectedCategory,
          source: selectedSource
        }
      });
      setJobs(response.data.data);
    } catch (err) {
      console.error('❌ Error fetching jobs:', err);
      if (err.response?.status === 401) {
        // Let Axios interceptor handle token clear/redirect
        return;
      }
      if (err.code === 'ERR_NETWORK') {
        toast.error('Local backend aggregator server is offline. Please run "npm run dev" in the server workspace.');
      } else {
        toast.error('Failed to aggregate jobs from LinkedIn & Naukri');
      }
    } finally {
      setLoading(false);
    }
  };

  // Local filtering in addition to backend filters for live keystroke updates
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Fields' },
    { id: 'frontend', label: 'Frontend Dev' },
    { id: 'backend', label: 'Backend Dev' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'devops', label: 'DevOps & SRE' },
    { id: 'dsa', label: 'DSA / Core SWE' }
  ];

  const types = [
    { id: 'all', label: 'All Roles' },
    { id: 'job', label: 'Jobs' },
    { id: 'internship', label: 'Internships' }
  ];

  const sources = [
    { id: 'all', label: 'All Sources' },
    { id: 'linkedin', label: 'LinkedIn Jobs' },
    { id: 'naukri', label: 'Naukri.com' }
  ];

  return (
    <div className="fade-in max-w-7xl mx-auto py-10 px-6 lg:px-8" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs mb-4 uppercase tracking-wider border border-indigo-100">
          💼 Live Job Board Aggregator
        </div>
        <h1 className="text-4xl font-extrabold text-[#101828] tracking-tight mb-4 flex items-center gap-4">
          Jobs &amp; Internships Tracker
        </h1>
        <p className="text-[#667085] text-lg font-medium max-w-3xl">
          Real-time aggregated tech listings synchronized from LinkedIn Jobs, Naukri, and developer portals. Target positions in DevOps, DSA, and Full Stack software engineering.
        </p>
      </div>

      {/* Search and Advanced Filters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eaecf0] shadow-sm mb-12 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3] group-focus-within:text-[#4361ee] transition-colors" />
            <input 
              type="text" 
              placeholder="Search by role, company, location or skill keyword..." 
              className="input-field pl-12 h-12 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Source Filter Select */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:inline">Source:</span>
            <div className="flex bg-gray-50 border border-gray-200 p-1 rounded-xl">
              {sources.map(src => (
                <button
                  key={src.id}
                  onClick={() => setSelectedSource(src.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold tracking-wide transition-all ${
                    selectedSource === src.id 
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-[#f2f4f7]">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  selectedCategory === cat.id 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                    : 'bg-white text-[#667085] border-[#eaecf0] hover:border-indigo-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Type Filter Tabs (Job vs Internship) */}
          <div className="flex bg-gray-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            {types.map(tp => (
              <button
                key={tp.id}
                onClick={() => setSelectedType(tp.id)}
                className={`px-5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                  selectedType === tp.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredJobs.map((job) => (
            <div key={job.id} className="card p-6 sm:p-8 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 flex flex-col group bg-white border border-[#eaecf0] rounded-3xl relative overflow-hidden">
              
              {/* Card Header: Initials and Tags */}
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-inner shrink-0 ${job.logoBg || 'bg-indigo-600'}`}>
                    {job.companyInitials || 'CF'}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <p className="text-xs font-bold text-gray-400 mt-1">{job.company}</p>
                  </div>
                </div>

                {/* Source Badge */}
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0 ${
                  job.source === 'LinkedIn' 
                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                    : 'bg-orange-50 text-orange-700 border-orange-100'
                }`}>
                  {job.source}
                </span>
              </div>

              {/* Meta information tags */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-gray-400 text-sm" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-gray-400 text-sm" />
                  <span className="capitalize">{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-emerald-500 text-sm" />
                  <span className="text-emerald-600 font-extrabold truncate">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBriefcase className="text-gray-400 text-sm" />
                  <span>{job.experience}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 font-medium text-xs leading-relaxed mb-6 flex-1">
                {job.description}
              </p>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {job.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200/80 transition-colors rounded-lg text-[10px] font-bold text-gray-600">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Apply Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-[#f2f4f7] mt-auto">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Category: <span className="text-indigo-600 font-extrabold">{job.category}</span>
                </span>
                
                <a 
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-100 hover:-translate-y-0.5"
                >
                  Apply Now <FiExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 card bg-white border border-[#eaecf0] rounded-3xl">
          <div className="text-6xl mb-6 opacity-20">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No job opportunities found</h3>
          <p className="text-gray-500 font-medium text-base">Adjust your keyword search, category, or platform filters to expand listings.</p>
        </div>
      )}

      {/* Advisory Tip */}
      <div className="mt-16 card p-8 bg-[#101828] rounded-3xl border-none flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/10">💡</div>
        <div>
          <h4 className="text-xl font-bold text-white mb-2 tracking-tight">Geek Guide: Perfecting Your Application</h4>
          <p className="text-indigo-100/70 leading-relaxed font-semibold text-xs">
            Before applying to these listings, ensure you update your resume with links to the live hosted websites built on this platform. Mentioning your **CareerForge rank** (e.g. Architect 🏆) and **completed roadmap certification badge milestones** dramatically increases conversion rates for technical interviews!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
