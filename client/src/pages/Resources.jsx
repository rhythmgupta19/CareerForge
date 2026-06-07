import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiExternalLink, FiGift, FiAward, FiInfo, FiSearch, FiFilter, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get('/cloud-credits');
      setResources(res.data.data);
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || res.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', 'cloud', 'education', 'hosting', 'database'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-[var(--bg-main)]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-7xl mx-auto py-10 px-6 lg:px-8 bg-[var(--bg-main)] text-[var(--text-main)] min-h-screen">
      <div className="mb-12">
        <div className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full mb-4 py-1.5 px-4 font-black text-xs uppercase tracking-wider">
          Student Benefits
        </div>
        <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight mb-4 flex items-center gap-4">
          Free Perks & Tools
        </h1>
        <p className="text-[var(--text-muted)] text-sm font-semibold max-w-2xl leading-relaxed">
          Exclusive credits, premium software, and developer tools curated for the CareerForge engineering community. Use these to supercharge your portfolio.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)] group-focus-within:text-[var(--primary)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, platform or tool..." 
            className="w-full pl-12 pr-4 h-12 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-colors shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
                filter === cat 
                  ? 'bg-[var(--primary)] text-[var(--text-main)] border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10' 
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]/40 hover:text-[var(--text-main)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((res) => (
            <div key={res._id} className="bg-[var(--bg-card)] border border-[var(--border)] p-7 rounded-2xl hover:border-[var(--primary)]/40 hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-sub)] border border-[var(--border)] flex items-center justify-center text-3xl shadow-inner group-hover:bg-[var(--primary-light)] group-hover:text-[var(--primary)] transition-colors">
                  {res.icon || '🎁'}
                </div>
                <div className="bg-zinc-800 text-zinc-400 font-black py-1 px-3 text-[9px] rounded-lg uppercase tracking-widest border border-zinc-700">
                  {res.category}
                </div>
              </div>
              
              <h3 className="text-lg font-black text-[var(--text-main)] mb-3 group-hover:text-[var(--primary)] transition-colors tracking-tight">
                {res.title}
              </h3>
              <p className="text-[var(--text-muted)] text-xs font-semibold mb-8 flex-1 leading-relaxed">
                {res.description}
              </p>
              
              {res.eligibility && (
                <div className="mb-8 p-3.5 rounded-xl bg-[var(--bg-sub)] border border-[var(--border)] flex items-start gap-3">
                  <FiInfo className="text-[var(--primary)] shrink-0 mt-0.5" />
                  <span className="text-[10px] font-black text-[var(--text-light)] leading-relaxed uppercase tracking-wider">
                    Eligible for: {res.eligibility}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-widest">
                  {res.platform}
                </div>
                <a 
                  href={res.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-[var(--primary)] hover:text-indigo-400 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Claim Reward <FiChevronRight />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm">
          <div className="text-6xl mb-6 opacity-20">🔍</div>
          <h3 className="text-xl font-black text-[var(--text-main)] mb-2 tracking-tight">No resources found</h3>
          <p className="text-[var(--text-muted)] font-semibold text-sm">Try adjusting your filters or search keywords.</p>
        </div>
      )}

      {/* Advisory Note */}
      <div className="mt-16 bg-gradient-to-br from-emerald-950/20 via-teal-950/20 to-transparent border border-emerald-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl shrink-0">
          💡
        </div>
        <div>
          <h4 className="text-lg font-black text-white mb-2 tracking-tight">Strategic Tip for Engineers</h4>
          <p className="text-emerald-100/70 text-xs font-semibold leading-relaxed">
            Use these cloud credits to build and host your portfolio projects. Having a live, accessible project is 10x more valuable than a local one during interviews. 
            <span className="text-emerald-400 font-bold ml-1">Remember to use your student email (or Github Student pack) for maximum eligibility.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;
