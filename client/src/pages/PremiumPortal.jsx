import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  FiLock, FiUnlock, FiAward, FiBriefcase, FiCheckCircle, 
  FiExternalLink, FiCompass, FiLayers, FiAlertCircle 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const PremiumPortal = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'internships'
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Mock checkout card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const isSubscriber = user?.isPaidSubscriber || false;
  const activeDomainSlug = user?.activeDomain?.slug || user?.selectedDomain?.slug || 'web-development';

  const getDomainQuerySlug = (slug) => {
    if (!slug) return 'webdev';
    const s = slug.toLowerCase();
    if (s.includes('web')) return 'webdev';
    if (s.includes('devops')) return 'devops';
    if (s.includes('data')) return 'datascience';
    return s;
  };

  useEffect(() => {
    if (isSubscriber) {
      fetchPremiumContent();
    }
  }, [isSubscriber, activeDomainSlug]);

  const fetchPremiumContent = async () => {
    try {
      setLoading(true);
      const domainSlug = getDomainQuerySlug(activeDomainSlug);
      const [projRes, internRes] = await Promise.all([
        api.get(`/projects?domain=${domainSlug}`),
        api.get(`/internships?domain=${domainSlug}`)
      ]);
      setProjects(projRes.data.data || []);
      setInternships(internRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load premium dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (e) => {
    if (e) e.preventDefault();
    if (cardNumber.length < 16 || cardExpiry.length < 4 || cardCvv.length < 3) {
      toast.error('Please enter valid mock payment details (16 digit card, MM/YY, 3-digit CVV)');
      return;
    }
    setUpgrading(true);
    try {
      const res = await api.put('/auth/profile', { isPaidSubscriber: true });
      if (res.data.success) {
        toast.success('💎 Welcome to CareerForge Premium! Access unlocked!');
        await refreshUser();
      } else {
        toast.error('Upgrade failed. Please try again.');
      }
    } catch (err) {
      toast.error('Failed to process mock subscription upgrade');
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to end your Premium subscription benefits?')) {
      try {
        const res = await api.put('/auth/profile', { isPaidSubscriber: false });
        if (res.data.success) {
          toast.success('Subscription cancelled. Returning to free tier.');
          await refreshUser();
        }
      } catch (err) {
        toast.error('Failed to update subscription status');
      }
    }
  };

  // Expanded project state tracking
  const [expandedProject, setExpandedProject] = useState(null);

  if (!isSubscriber) {
    return (
      <div className="fade-in max-w-7xl mx-auto py-12 px-6 lg:px-8 bg-[var(--bg-main)] min-h-screen text-[var(--text-main)] flex flex-col items-center">
        <div className="text-center max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-400 border border-amber-500/20 rounded-full py-1.5 px-4 font-black text-xs uppercase tracking-wider animate-pulse">
            <FiLock /> Subscriber Only Area
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-200 to-zinc-500 bg-clip-text text-transparent">
            Unlock Premium Portals
          </h1>
          <p className="text-[var(--text-muted)] text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            Gain immediate access to domain-aligned capstone projects with step-by-step roadmaps, and direct apply portals for vetted high-paying student engineering internships.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 w-full items-start">
          {/* Perks description */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-black uppercase tracking-wider text-emerald-400">Included with Premium</h3>
            
            <div className="grid gap-4">
              {[
                { title: 'Capstone Project Blueprints', desc: 'Step-by-step implementation guidance for real-world projects corresponding to your active study domain.', icon: <FiLayers className="text-xl text-indigo-400" /> },
                { title: 'Vetted Internship Leads', desc: 'Direct application links and exact eligibility lists for top-tier software and cloud engineering internships.', icon: <FiBriefcase className="text-xl text-teal-400" /> },
                { title: 'Custom Implementation Roadmaps', desc: 'Detailed phase breakdown checklists inside each project to organize tasks and complete builds.', icon: <FiCompass className="text-xl text-amber-400" /> }
              ].map((perk, i) => (
                <div key={i} className="p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex items-start gap-4 hover:border-zinc-800 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    {perk.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[var(--text-main)]">{perk.title}</h4>
                    <p className="text-[var(--text-muted)] text-xs font-semibold mt-1 leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border)] p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-2xl"></div>
            
            <div className="text-center mb-6">
              <span className="text-2xl">💎</span>
              <h3 className="text-lg font-black text-[var(--text-main)] mt-2">Activate Premium Portal</h3>
              <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider mt-0.5">Mock checkout sandbox</p>
            </div>

            <form onSubmit={handleUpgrade} className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-indigo-400 font-semibold leading-relaxed mb-4 flex items-start gap-2.5">
                <FiAlertCircle className="shrink-0 mt-0.5" />
                <span>Sandbox Mode Active: No real money is charged. Enter any matching mock details to complete the order.</span>
              </div>

              <div>
                <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Card Number</label>
                <input 
                  type="text" 
                  maxLength="16"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-10 px-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-lg text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--primary)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    maxLength="5"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full h-10 px-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-lg text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--primary)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">CVV</label>
                  <input 
                    type="password" 
                    maxLength="3"
                    placeholder="***"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-10 px-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-lg text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--primary)]"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4 mt-6">
                <div className="flex justify-between items-center text-xs font-black uppercase text-[var(--text-main)] mb-4">
                  <span>Subscription Price</span>
                  <span className="text-emerald-400 font-black">Free (Sandbox Upgrade)</span>
                </div>
                
                <button
                  type="submit"
                  disabled={upgrading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer text-xs"
                >
                  {upgrading ? 'Unlocking Benefits...' : 'Unlock Premium Portals 🔓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // SUB-Dashboard View
  return (
    <div className="fade-in max-w-7xl mx-auto py-10 px-6 lg:px-8 bg-[var(--bg-main)] min-h-screen text-[var(--text-main)]">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[var(--border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/20 rounded-full py-1.5 px-4 font-black text-xs uppercase tracking-wider mb-3">
            <FiUnlock /> Premium Active 💎
          </div>
          <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-4">
            Premium Candidate Portal
          </h1>
          <p className="text-[var(--text-muted)] text-xs font-semibold mt-1">
            Active track: <span className="text-emerald-400 font-bold uppercase">{activeDomainSlug}</span>
          </p>
        </div>

        <button
          onClick={handleCancelSubscription}
          className="px-4 py-2 bg-[var(--bg-card)] hover:bg-zinc-800 text-rose-400 hover:text-rose-300 border border-[var(--border)] rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
        >
          Cancel Premium Tier
        </button>
      </div>

      {/* Tabs Header */}
      <div className="flex gap-4 border-b border-[var(--border)] pb-4 mb-8">
        {[
          { id: 'projects', label: 'Guided Capstone Projects', icon: <FiLayers /> },
          { id: 'internships', label: 'Curated Open Internships', icon: <FiBriefcase /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setExpandedProject(null);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[var(--primary)] text-[var(--text-main)] border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]/40 hover:text-[var(--text-main)]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
        </div>
      ) : activeTab === 'projects' ? (
        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
              <div className="text-5xl mb-4">📂</div>
              <h3 className="text-lg font-black text-[var(--text-main)] mb-1">No Projects Found</h3>
              <p className="text-[var(--text-muted)] text-xs font-semibold">We haven't seeded projects for this track yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {projects.map((proj) => {
                const isExpanded = expandedProject === proj._id;
                return (
                  <div key={proj._id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-zinc-800 transition-all">
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                            proj.difficulty === 'advanced'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {proj.difficulty}
                          </span>
                          <span className="text-[9px] text-[var(--text-light)] font-bold uppercase tracking-wider">
                            {proj.domain} Blueprint
                          </span>
                        </div>
                        <h3 className="text-base font-black text-[var(--text-main)]">{proj.title}</h3>
                        <p className="text-[var(--text-muted)] text-xs font-semibold mt-1 leading-relaxed max-w-4xl">
                          {proj.description}
                        </p>
                      </div>

                      <button
                        onClick={() => setExpandedProject(isExpanded ? null : proj._id)}
                        className="px-5 py-2.5 bg-[var(--bg-sub)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] border border-[var(--border)] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0"
                      >
                        {isExpanded ? 'Hide Guidance ⌃' : 'View Guidance ⌵'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-[var(--border)] bg-[var(--bg-sub)]/30 p-6 space-y-6">
                        <div className="grid md:grid-cols-12 gap-8">
                          {/* Step-by-Step Guidance */}
                          <div className="md:col-span-6 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                              <span>🛠️</span> Phased Implementation Checklists
                            </h4>
                            
                            <div className="space-y-3">
                              {proj.steps?.map((step) => (
                                <div key={step.stepNumber} className="bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-xl space-y-1 hover:border-zinc-800 transition-colors">
                                  <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">
                                    Step {step.stepNumber}: {step.title}
                                  </div>
                                  <p className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                                    {step.guidance}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Phase Roadmap */}
                          <div className="md:col-span-6 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                              <span>🗺️</span> Technical Roadmap
                            </h4>

                            <div className="space-y-4 border-l-2 border-zinc-800 pl-4 ml-2">
                              {proj.roadmap?.map((phase, phaseIdx) => (
                                <div key={phaseIdx} className="space-y-2 relative">
                                  {/* timeline dot */}
                                  <div className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--primary)] border-2 border-[var(--bg-card)] shadow"></div>
                                  
                                  <div className="text-xs font-black text-[var(--text-main)]">{phase.phaseName}</div>
                                  <ul className="space-y-1.5 pl-3 list-disc text-[var(--text-muted)] text-[11px] font-semibold leading-relaxed">
                                    {phase.tasks?.map((task, taskIdx) => (
                                      <li key={taskIdx} className="marker:text-[var(--primary)]">
                                        {task}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {internships.length === 0 ? (
            <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-lg font-black text-[var(--text-main)] mb-1">No Internships Found</h3>
              <p className="text-[var(--text-muted)] text-xs font-semibold">We haven't seeded internship openings for this domain. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {internships.map((intern) => (
                <div key={intern._id} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-2xl hover:border-[var(--primary)]/40 transition-all flex flex-col justify-between gap-6 hover:shadow-xl relative overflow-hidden group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-lg py-0.5 px-2.5 text-[9px] font-black uppercase tracking-wider inline-block">
                          {intern.location}
                        </div>
                        <h3 className="text-base font-black text-[var(--text-main)] mt-2 group-hover:text-[var(--primary)] transition-colors">{intern.title}</h3>
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">{intern.company}</div>
                      </div>
                      <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                        {intern.stipend}
                      </span>
                    </div>

                    <p className="text-[var(--text-muted)] text-xs font-semibold leading-relaxed line-clamp-3">
                      {intern.description}
                    </p>

                    <div className="space-y-2">
                      <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">Candidate Requirements</div>
                      <ul className="grid grid-cols-1 gap-1">
                        {intern.requirements?.map((req, reqIdx) => (
                          <li key={reqIdx} className="text-[10px] text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                            <span className="text-emerald-500">✓</span> {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={intern.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[var(--bg-sub)] hover:bg-[var(--primary)] hover:text-white border border-[var(--border)] hover:border-transparent rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    Apply Now <FiExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumPortal;
