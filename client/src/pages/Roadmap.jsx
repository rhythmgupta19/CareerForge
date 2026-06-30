import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  FiLock, FiUnlock, FiCheckCircle, FiPlayCircle, FiZap, FiStar, 
  FiTrendingUp, FiAward, FiClock, FiCode, FiInfo, FiSearch 
} from 'react-icons/fi';

const SHEET_QUESTIONS = [
  { id: 'sheet_cp1', title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays/Hashing', companies: ['Google', 'Amazon', 'Meta', 'Microsoft'], yt: 'https://www.youtube.com/watch?v=DRU_nIY4j4c' },
  { id: 'sheet_cp2', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Arrays/Hashing', companies: ['Amazon', 'Microsoft', 'Google', 'Apple'], yt: 'https://www.youtube.com/watch?v=excAOcl19kk' },
  { id: 'sheet_cp3', title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays/Hashing', companies: ['Amazon', 'Adobe', 'Microsoft'], yt: 'https://www.youtube.com/watch?v=3OamzN90kQg' },
  { id: 'sheet_cp4', title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Arrays/Hashing', companies: ['Amazon', 'Microsoft', 'Meta'], yt: 'https://www.youtube.com/watch?v=gReAturMcRs' },
  { id: 'sheet_cp5', title: 'Maximum Subarray (Kadane)', difficulty: 'Medium', topic: 'Arrays/Hashing', companies: ['Amazon', 'Microsoft', 'Google'], yt: 'https://www.youtube.com/watch?v=H5PvPRwUPng' },
  { id: 'sheet_cp6', title: 'Reverse a Linked List', difficulty: 'Easy', topic: 'Linked Lists', companies: ['Amazon', 'Microsoft', 'Adobe'], yt: 'https://www.youtube.com/watch?v=iRtLEoL-r-Y' },
  { id: 'sheet_cp7', title: 'Detect Cycle in Linked List', difficulty: 'Easy', topic: 'Linked Lists', companies: ['Amazon', 'Microsoft'], yt: 'https://www.youtube.com/watch?v=aFitA8X1518' },
  { id: 'sheet_cp8', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked Lists', companies: ['Amazon', 'Microsoft'], yt: 'https://www.youtube.com/watch?v=Xb4sraKQV2o' },
  { id: 'sheet_cp9', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stacks/Queues', companies: ['Amazon', 'Meta', 'Microsoft'], yt: 'https://www.youtube.com/watch?v=WKpHszpdfnM' },
  { id: 'sheet_cp10', title: 'Next Greater Element', difficulty: 'Medium', topic: 'Stacks/Queues', companies: ['Amazon', 'Microsoft'], yt: 'https://www.youtube.com/watch?v=V09NfaGf2Ao' },
  { id: 'sheet_cp11', title: 'Invert a Binary Tree', difficulty: 'Easy', topic: 'Trees', companies: ['Google', 'Amazon'], yt: 'https://www.youtube.com/watch?v=fKgZaGX-c4Y' },
  { id: 'sheet_cp12', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'Trees', companies: ['Amazon', 'Goldman Sachs'], yt: 'https://www.youtube.com/watch?v=eD3tmO66aSE' },
  { id: 'sheet_cp13', title: 'Lowest Common Ancestor BST', difficulty: 'Easy', topic: 'Trees', companies: ['Amazon', 'Microsoft', 'Meta'], yt: 'https://www.youtube.com/watch?v=cX_kPV_yS2Y' },
  { id: 'sheet_cp14', title: 'Tree Level Order', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Microsoft', 'Bloomberg'], yt: 'https://www.youtube.com/watch?v=EoAsWbO7sqg' },
  { id: 'sheet_cp15', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google', 'Microsoft', 'Meta'], yt: 'https://www.youtube.com/watch?v=muncqlKJ8ZY' },
  { id: 'sheet_cp16', title: 'Path in Graph', difficulty: 'Easy', topic: 'Graphs', companies: ['Meta', 'Google'], yt: 'https://www.youtube.com/watch?v=f2EfG57Rq3Y' },
  { id: 'sheet_cp17', title: 'Climbing Stairs', difficulty: 'Easy', topic: 'DP', companies: ['Amazon', 'Adobe', 'Google'], yt: 'https://www.youtube.com/watch?v=A617IOwlq7E' },
  { id: 'sheet_cp18', title: 'Coin Change', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Microsoft', 'Goldman Sachs'], yt: 'https://www.youtube.com/watch?v=HGYgy8WYyfU' },
  { id: 'sheet_cp19', title: 'Longest Common Subseq', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Microsoft', 'Honeywell'], yt: 'https://www.youtube.com/watch?v=NPvvyJh-C_w' },
  { id: 'sheet_cp20', title: 'N Meetings in One Room', difficulty: 'Easy', topic: 'Greedy', companies: ['Amazon', 'Microsoft'], yt: 'https://www.youtube.com/watch?v=zPtI8q9ALU8' }
];
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeDsaProfile, DSA_LEVELS, DSA_LANGUAGE_LABELS, getDsaBadgeForLevel, getStreakRank, normalizeDsaLanguage } from '../utils/dsaPersonalization';
import { STRIVER_A2Z_SHEET } from '../utils/striverA2ZContent';

// Beautiful gamified icons for DSA and Generic roadmaps
const getLevelIcon = (index, domainSlug) => {
  if (domainSlug === 'dsa') {
    const dsaIcons = ["🌱", "🧱", "🗺️", "🥷", "⚔️", "🛡️", "🌳", "⛰️", "👹", "🏹", "🏆"];
    return dsaIcons[index] || "🔥";
  }
  const icons = ["🌐", "🧱", "🎨", "🧟", "🐙", "⚛️", "⚙️", "🗄️", "🏗️"];
  return icons[index] || "⭐️";
};

const getLevelThreshold = (index) => {
  return index * 300;
};

// DSA specific gamified level titles
const dsaLevelNames = DSA_LEVELS;

const Roadmap = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState(null);

  // Dynamic language selection state synced with local cache
  const [selectedLang, setSelectedLang] = useState(() => normalizeDsaLanguage(localStorage.getItem('dsa_lang') || 'cpp'));
  const [useStriverAdvanced, setUseStriverAdvanced] = useState(() => localStorage.getItem('striver_advanced') === 'true');

  // DSA Sheet state
  const [roadmapView, setRoadmapView] = useState('path'); // 'path' or 'sheet'
  const [dsaSheetTopicId, setDsaSheetTopicId] = useState(null);
  const [sheetSearch, setSheetSearch] = useState('');
  const [sheetCompany, setSheetCompany] = useState('All');
  const [sheetTopic, setSheetTopic] = useState('All');
  const [sheetCompletions, setSheetCompletions] = useState([]);

  // Striver A2Z Sheet state
  const [a2zSearch, setA2zSearch] = useState('');
  const [a2zDifficulty, setA2zDifficulty] = useState('All');
  const [a2zCompletions, setA2zCompletions] = useState([]);
  const [expandedA2zStep, setExpandedA2zStep] = useState(null);

  const getProgressKey = (slug) => {
    if (!slug) return 'dsa';
    const lowercaseSlug = slug.toLowerCase();
    if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
    if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
    if (lowercaseSlug === 'devops') return 'devops';
    if (lowercaseSlug === 'dsa') return 'dsa';
    return 'dsa';
  };

  const activeDomainSlug = user?.activeDomain?.slug || user?.selectedDomain?.slug || 'dsa';
  const activeDomainKey = getProgressKey(activeDomainSlug);
  const activeDomainProgress = user?.domainsProgress?.[activeDomainKey] || {
    xp: 0,
    currentPhase: 0,
    overallProgress: 0,
    completedTopics: []
  };

  const domainId = user?.selectedDomain?._id || user?.selectedDomain;

  // Track initial state
  useEffect(() => {
    const initRoadmap = async () => {
      try {
        const freshUser = await refreshUser();
        if (!freshUser?.selectedDomain) {
          navigate('/domains');
          return;
        }
        if (freshUser?.profile?.onboardingAnswers?.dsa_language) {
          setSelectedLang(normalizeDsaLanguage(localStorage.getItem('dsa_lang') || freshUser.profile.onboardingAnswers.dsa_language));
        }
      } catch (err) {
        console.error(err);
      }
    };
    initRoadmap();
  }, []);

  // Fetch roadmap data
  useEffect(() => {
    if (domainId) {
      fetchRoadmap(domainId);
    }
  }, [domainId]);

  // Sync state modifications with local persistence
  useEffect(() => {
    localStorage.setItem('dsa_lang', selectedLang);
  }, [selectedLang]);

  useEffect(() => {
    localStorage.setItem('striver_advanced', useStriverAdvanced.toString());
  }, [useStriverAdvanced]);

  useEffect(() => {
    if (dsaSheetTopicId) {
      try {
        const completed = JSON.parse(localStorage.getItem(`dsa_cp_done_${dsaSheetTopicId}`) || '[]');
        setSheetCompletions(completed);
      } catch (e) {
        setSheetCompletions([]);
      }
    }
  }, [dsaSheetTopicId]);

  const handleToggleCheckpoint = (cpId) => {
    if (!dsaSheetTopicId) return;
    const isDone = sheetCompletions.includes(cpId);
    let updated;
    if (isDone) {
      updated = sheetCompletions.filter(id => id !== cpId);
    } else {
      updated = [...sheetCompletions, cpId];
    }
    setSheetCompletions(updated);
    localStorage.setItem(`dsa_cp_done_${dsaSheetTopicId}`, JSON.stringify(updated));
    toast.success(isDone ? 'Marked question as unsolved' : 'Marked question as solved! 🎉');
  };

  const handleSolveChallenge = (cpId) => {
    if (!dsaSheetTopicId) return;
    localStorage.setItem(`dsa_checkpoint_${dsaSheetTopicId}`, cpId);
    navigate(`/topic/${dsaSheetTopicId}?cp=${cpId}`);
  };

  useEffect(() => {
    try {
      const completed = JSON.parse(localStorage.getItem('a2z_cp_done') || '[]');
      setA2zCompletions(completed);
    } catch (e) {
      setA2zCompletions([]);
    }
  }, []);

  const handleToggleA2zProblem = (problemId) => {
    const isDone = a2zCompletions.includes(problemId);
    let updated;
    if (isDone) {
      updated = a2zCompletions.filter(id => id !== problemId);
    } else {
      updated = [...a2zCompletions, problemId];
    }
    setA2zCompletions(updated);
    localStorage.setItem('a2z_cp_done', JSON.stringify(updated));
    toast.success(isDone ? 'Marked problem as unsolved' : 'Marked problem as solved! 🚀');
  };

  const fetchRoadmap = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/domains/${id}`);
      setDomainData(res.data.data);
      if (res.data.data) {
        setActiveLevel(activeDomainProgress.currentPhase ?? 0);
        
        // Find DSA Cheat Sheet Topic ID
        if (res.data.data.domain.slug === 'dsa') {
          const phase10 = res.data.data.phases.find(p => p.phaseNumber === 10);
          if (phase10) {
            try {
              const topicsRes = await api.get(`/topics/phase/${phase10._id}`);
              const sheetTopic = topicsRes.data.data?.find(t => t.title.includes('DSA Cheat Sheet'));
              if (sheetTopic) {
                setDsaSheetTopicId(sheetTopic._id);
              }
            } catch (err) {
              console.error("Failed to load sheet topic", err);
            }
          }
        }
      }
    } catch (err) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const isTopicCompleted = (topicId) => {
    return activeDomainProgress.completedTopics?.some(t => t.topicId === topicId || t.topicId?._id === topicId);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );
  
  if (!domainData) return null;

  const { domain, phases } = domainData;
  const activePhase = phases.find(p => p.phaseNumber === activeLevel);
  const currentXP = activeDomainProgress.xp || 0;
  const currentStreak = user.dailyStreak || 0;
  const isDSA = domain.slug === 'dsa';
  const dsaAnswers = user.profile?.onboardingAnswers || {};
  const dsaAnalysis = isDSA ? (dsaAnswers.dsaAnalysis || analyzeDsaProfile(dsaAnswers)) : null;
  const streakRank = getStreakRank(currentStreak);
  const activeBadge = getDsaBadgeForLevel(activeDomainProgress.currentPhase ?? 0);

  const langNames = DSA_LANGUAGE_LABELS;

  const handleSkipLevel = async () => {
    const levelName = isDSA ? (dsaLevelNames[activeLevel] || activePhase?.name || 'Level') : (activePhase?.name || 'Level');
    if (window.confirm(`Are you sure you want to skip the entire "${levelName}" (Level ${activeLevel}) and mark all its topics as completed?`)) {
      try {
        if (!activePhase) return;
        
        toast.loading('Processing skip...', { id: 'skip-level' });
        const res = await api.post('/progress/skip-phase', { phaseId: activePhase._id });
        
        if (res.data.success) {
          toast.success('Level skipped successfully! 🚀', { id: 'skip-level' });
          await refreshUser();
          fetchRoadmap(domainId);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to skip level', { id: 'skip-level' });
      }
    }
  };

  const solvedCount = sheetCompletions.length;
  const totalQuestions = SHEET_QUESTIONS.length;
  const percentCompleted = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

  const filteredQuestions = SHEET_QUESTIONS.filter(q => {
    // 1. Search Query
    const searchLower = sheetSearch.toLowerCase();
    const matchesSearch = 
      q.title.toLowerCase().includes(searchLower) ||
      q.topic.toLowerCase().includes(searchLower) ||
      q.companies.some(c => c.toLowerCase().includes(searchLower));

    // 2. Company Filter
    let matchesCompany = true;
    if (sheetCompany !== 'All') {
      if (sheetCompany === 'Others') {
        matchesCompany = q.companies.some(c => c !== 'Google' && c !== 'Amazon' && c !== 'Microsoft' && c !== 'Meta');
      } else {
        matchesCompany = q.companies.includes(sheetCompany);
      }
    }

    // 3. Topic Filter
    let matchesTopic = true;
    if (sheetTopic !== 'All') {
      matchesTopic = q.topic === sheetTopic;
    }

    return matchesSearch && matchesCompany && matchesTopic;
  });

  // Striver A2Z Statistics
  const allA2zProblems = [];
  STRIVER_A2Z_SHEET.forEach(step => {
    step.subcategories.forEach(sub => {
      sub.problems.forEach(p => {
        allA2zProblems.push(p);
      });
    });
  });

  const totalA2zCount = allA2zProblems.length;
  const solvedA2zCount = allA2zProblems.filter(p => a2zCompletions.includes(p.id)).length;
  const percentA2zCompleted = totalA2zCount > 0 ? Math.round((solvedA2zCount / totalA2zCount) * 100) : 0;

  const easyA2zTotal = allA2zProblems.filter(p => p.difficulty === 'Easy').length;
  const easyA2zSolved = allA2zProblems.filter(p => p.difficulty === 'Easy' && a2zCompletions.includes(p.id)).length;

  const mediumA2zTotal = allA2zProblems.filter(p => p.difficulty === 'Medium').length;
  const mediumA2zSolved = allA2zProblems.filter(p => p.difficulty === 'Medium' && a2zCompletions.includes(p.id)).length;

  const hardA2zTotal = allA2zProblems.filter(p => p.difficulty === 'Hard').length;
  const hardA2zSolved = allA2zProblems.filter(p => p.difficulty === 'Hard' && a2zCompletions.includes(p.id)).length;

  const getFilteredStepProblems = (stepObj) => {
    const matched = [];
    stepObj.subcategories.forEach(sub => {
      sub.problems.forEach(p => {
        const searchLower = a2zSearch.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchLower) || sub.title.toLowerCase().includes(searchLower);
        const matchesDifficulty = a2zDifficulty === 'All' || p.difficulty === a2zDifficulty;

        if (matchesSearch && matchesDifficulty) {
          matched.push(p);
        }
      });
    });
    return matched;
  };

  return (
    <div className="pb-20 max-w-6xl mx-auto px-6 pt-10 transition-colors duration-300">
      
      {/* Premium Gamification Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in">
        <div className="card p-6 bg-[var(--bg-card)] flex items-center gap-5 border-b-4 border-amber-400">
          <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-2xl text-amber-500 shadow-inner">
            <FiZap fill="currentColor" />
          </div>
          <div>
            <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">Experience Points</div>
            <div className="text-2xl font-black text-[var(--text-main)]">{currentXP} XP</div>
          </div>
        </div>
        
        <div className="card p-6 bg-[var(--bg-card)] flex items-center gap-5 border-b-4 border-emerald-400">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl text-emerald-500 shadow-inner">
            <FiTrendingUp />
          </div>
          <div>
            <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">Daily Streak</div>
            <div className="text-2xl font-black text-[var(--text-main)]">{currentStreak} 🔥</div>
          </div>
        </div>
        
        <div className="card p-6 bg-[var(--bg-card)] flex items-center gap-5 border-b-4 border-indigo-400">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl text-[var(--primary)] shadow-inner">
            <FiStar />
          </div>
          <div>
            <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">Current Rank</div>
            <div className="text-2xl font-black text-[var(--text-main)]">
              {isDSA ? (dsaLevelNames[activeDomainProgress.currentPhase ?? 0] || 'Apprentice') : (phases.find(p => p.phaseNumber === (activeDomainProgress.currentPhase ?? 0))?.name || 'Apprentice')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Description */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-[var(--border)]`}>
          <FiZap /> {isDSA ? `${dsaAnalysis.roadmapType} • ${dsaAnalysis.recommendedPace}` : (user.profile?.roadmapType || 'Steady Pace')} • {isDSA ? dsaAnalysis.estimatedTimeline : (user.profile?.estimatedTimeline || '6 Months')}
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-gradient tracking-tight">
          {isDSA ? 'The Ultimate DSA Journey' : `Your ${domain.name} Adventure`}
        </h1>
        <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-sm font-bold leading-relaxed">
          {isDSA 
            ? dsaAnalysis.aiSummary
            : (user.profile?.aiSummary || "Master each level to unlock the next chapter of your coding journey.")}
        </p>
      </div>

      {isDSA && (
        <div className="grid lg:grid-cols-4 gap-4 mb-12">
          {[
            ['AI Start Point', `Level ${dsaAnalysis.startingLevel}: ${dsaAnalysis.startLevelName}`],
            ['Detected Skill', dsaAnalysis.skillLevel],
            ['Current Badge', activeBadge.name],
            ['Streak Rank', `${streakRank.name} • ${streakRank.next}`]
          ].map(([label, value]) => (
            <div key={label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-light)] mb-2">{label}</div>
              <div className="text-sm font-black text-[var(--text-main)] leading-snug">{value}</div>
            </div>
          ))}
          <div className="lg:col-span-4 bg-[var(--brand-purple)] text-white rounded-2xl p-6 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-purple-200 mb-2">AI Recommendations</div>
                <p className="text-sm text-white font-bold leading-relaxed">
                  {dsaAnalysis.startReason} Focus next on {dsaAnalysis.weakTopics[0] || 'Arrays'}, keep lessons in {langNames[selectedLang]}, and complete the Watch, Notes, Dry Run, Practice, Challenge loop before unlocking the next topic.
                </p>
              </div>
              <div className="shrink-0 grid grid-cols-2 gap-2 text-center">
                <div className="bg-[var(--bg-card)]/20 border border-white/20 rounded-xl p-3">
                  <div className="text-[8px] font-black text-purple-100 uppercase">Strongest</div>
                  <div className="text-xs font-black text-white">{dsaAnalysis.strongestTopic}</div>
                </div>
                <div className="bg-[var(--bg-card)]/20 border border-white/20 rounded-xl p-3">
                  <div className="text-[8px] font-black text-purple-100 uppercase">Weak Topic</div>
                  <div className="text-xs font-black text-white">{dsaAnalysis.weakTopics[0] || 'Recursion'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Language Selector for DSA ROADMAP */}
      {isDSA && (
        <div className="card p-6 mb-12 border-amber-500/20 max-w-2xl mx-auto relative overflow-hidden bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-sub)] to-[var(--bg-card)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div>
              <h3 className="text-sm font-black text-[var(--text-main)] flex items-center gap-2">
                <FiCode className="text-amber-500 text-lg" /> Selected Language Option
              </h3>
              <p className="text-[10px] text-[var(--text-light)] font-bold uppercase mt-1 tracking-wider">
                Current: <span className="text-amber-500">{langNames[selectedLang] || 'C++'}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-1 bg-[var(--bg-sub)] p-1 rounded-xl border border-[var(--border)] shadow-inner">
              {['cpp', 'java', 'python', 'javascript'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(normalizeDsaLanguage(lang))}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    selectedLang === lang 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Striver Advanced Track Toggle */}
          {(selectedLang === 'cpp' || selectedLang === 'java') && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 border-t border-[var(--border)] pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">🇬🇧</div>
                <div>
                  <div className="text-xs font-black text-[var(--text-main)]">
                    Comfortable learning in English?
                  </div>
                  <div className="text-[9px] font-semibold text-[var(--text-light)]">
                    Unlock Striver's Advanced DSA Track as an optional learning overlay.
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setUseStriverAdvanced(!useStriverAdvanced)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow border ${
                  useStriverAdvanced 
                    ? 'bg-amber-500 border-amber-500 text-white' 
                    : 'bg-[var(--bg-sub)] border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                }`}
              >
                {useStriverAdvanced ? 'Striver Mode Active 🏆' : 'Try Striver Track'}
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Segmented View Switcher */}
      {isDSA && (
        <div className="flex justify-center mb-10">
          <div className="bg-[var(--bg-sub)] p-1.5 rounded-2xl border border-[var(--border)] flex flex-wrap justify-center gap-2 shadow-inner">
            <button
              onClick={() => setRoadmapView('path')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                roadmapView === 'path'
                  ? 'bg-gradient-to-r from-[var(--primary)] to-amber-500 text-white shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]/50'
              }`}
            >
              🗺️ Journey Roadmap
            </button>
            <button
              onClick={() => setRoadmapView('sheet')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                roadmapView === 'sheet'
                  ? 'bg-gradient-to-r from-[var(--primary)] to-amber-500 text-white shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]/50'
              }`}
            >
              🔥 Company DSA Sheet
            </button>
            <button
              onClick={() => setRoadmapView('a2z')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                roadmapView === 'a2z'
                  ? 'bg-gradient-to-r from-[var(--primary)] to-amber-500 text-white shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]/50'
              }`}
            >
              📚 Striver A2Z Sheet
            </button>
          </div>
        </div>
      )}

      {roadmapView === 'path' ? (
        <>
          {/* Connected Progression Level Path */}
          <div className="relative py-6 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex items-start gap-12 min-w-max px-10 pb-10 relative">
              
              {phases.map((phase, index) => {
                const phaseNum = phase.phaseNumber;
                const isUnlocked = phaseNum <= (activeDomainProgress.currentPhase ?? 0);
                const isCompleted = phaseNum < (activeDomainProgress.currentPhase ?? 0);
                const isCurrent = phaseNum === (activeDomainProgress.currentPhase ?? 0);
                
                // Override title if domain is DSA
                const levelName = isDSA ? (dsaLevelNames[phaseNum] || phase.name) : phase.name;

                let nodeClass = "locked";
                if (isCompleted) nodeClass = "completed";
                else if (isCurrent) nodeClass = "active";

                return (
                  <div key={phase._id} className="flex flex-col items-center relative z-10">
                    {/* Level Node with custom states */}
                    <motion.div
                      whileHover={isUnlocked ? { scale: 1.08, y: -4 } : {}}
                      onClick={() => isUnlocked && setActiveLevel(phaseNum)}
                      className={`level-node w-24 h-24 cursor-pointer relative ${nodeClass}`}
                    >
                      <span className="text-4xl mb-1 filter drop-shadow-sm">{getLevelIcon(index, domain.slug)}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest mt-0.5">LVL {phaseNum}</span>
                      {isDSA && index < dsaAnalysis.startingLevel && (
                        <div className="absolute -bottom-3 bg-sky-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black shadow-sm">
                          AI SKIP
                        </div>
                      )}
                      
                      {isCurrent && (
                        <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-bounce shadow-md">
                          ACTIVE
                        </div>
                      )}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                          <FiLock className="text-white text-lg" />
                        </div>
                      )}
                      {isCompleted && (
                        <FiCheckCircle className="absolute -bottom-1 -right-1 text-emerald-500 bg-[var(--bg-card)] dark:bg-zinc-900 rounded-full text-xl shadow" />
                      )}
                    </motion.div>

                    {/* Level Title */}
                    <div className="mt-4 text-center max-w-[130px]">
                      <div className={`text-xs font-black leading-tight ${isUnlocked ? 'text-[var(--text-main)]' : 'text-[var(--text-light)]'}`}>{levelName}</div>
                      <div className="text-[8px] font-bold text-[var(--text-light)] uppercase mt-1 tracking-widest">{getLevelThreshold(index)} XP</div>
                    </div>

                    {/* Connection Line */}
                    {index < phases.length - 1 && (
                      <div 
                        className={`absolute top-[48px] left-[106px] w-[50px] h-1 rounded-full transition-colors duration-1000 ${
                          isUnlocked && (phases[index + 1]?.phaseNumber <= (activeDomainProgress.currentPhase ?? 0)) 
                            ? 'bg-gradient-to-r from-emerald-500 to-[var(--primary)]' 
                            : 'bg-[var(--border)]'
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Details Expedition Panel */}
          {activeLevel !== null && phases.length > 0 && (
            <motion.div 
              key={activeLevel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 card p-8 md:p-10 relative overflow-hidden border-2 border-[var(--border)]"
            >
              <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8 pb-8 border-b border-[var(--border)] relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl bg-[var(--bg-sub)] border border-[var(--border)] w-16 h-16 flex items-center justify-center rounded-2xl shadow-inner shrink-0">
                      {getLevelIcon(activePhase ? phases.indexOf(activePhase) : 0, domain.slug)}
                    </span>
                    <div>
                      <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">
                        {isDSA ? (dsaLevelNames[activeLevel] || activePhase?.name || 'Level') : (activePhase?.name || 'Level')}
                      </h2>
                      <div className="text-[var(--primary)] font-black text-xs tracking-widest uppercase mt-0.5">Level {activeLevel} Expedition</div>
                    </div>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed max-w-2xl font-semibold text-sm">
                    {activePhase?.description || "Complete these challenges to master this level and earn massive XP rewards."}
                  </p>
                </div>
                
                {/* Rewards Pill & Skip Level Actions */}
                <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
                  <div className="bg-[var(--bg-sub)] border border-[var(--border)] p-5 rounded-2xl shadow-sm w-full">
                    <div className="text-[9px] font-black text-[var(--primary)] uppercase tracking-widest mb-3">Completion Rewards</div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-[var(--text-main)] font-black text-sm">
                        <div className="w-7 h-7 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center"><FiZap /></div>
                        +500 XP
                      </div>
                      <div className="flex items-center gap-3 text-[var(--text-main)] font-black text-sm">
                        <div className="w-7 h-7 bg-indigo-500/10 text-[var(--primary)] rounded-lg flex items-center justify-center"><FiAward /></div>
                        Master Badge
                      </div>
                    </div>
                  </div>

                  {activeLevel === (activeDomainProgress.currentPhase ?? 0) && (
                    <button
                      onClick={handleSkipLevel}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-sub)] border-2 border-[var(--border)] text-[var(--text-main)] font-black text-xs tracking-wider uppercase transition duration-300 shadow-sm w-full"
                    >
                      ⏭️ Skip Whole Level
                    </button>
                  )}
                </div>
              </div>

              <TopicsList 
                phaseId={activePhase?._id} 
                isTopicCompleted={isTopicCompleted}
                activeLevel={activeLevel}
                isDSA={isDSA}
              />
            </motion.div>
          )}
        </>
      ) : roadmapView === 'sheet' ? (
        <div className="animate-fade-in space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">Sheet Progress</span>
                <h3 className="text-3xl font-black text-[var(--text-main)] mt-1">{solvedCount} / {totalQuestions}</h3>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] mb-1">
                  <span>{percentCompleted}% Completed</span>
                  <span>{totalQuestions - solvedCount} Remaining</span>
                </div>
                <div className="h-2.5 bg-[var(--bg-sub)] rounded-full overflow-hidden border border-[var(--border)]">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentCompleted}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">XP Claimed</span>
                <h3 className="text-3xl font-black text-amber-500 mt-1">+{solvedCount * 100} XP</h3>
                <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1">100 XP per accepted challenge</p>
              </div>
              <div className="text-4xl bg-amber-500/10 text-amber-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
                🏆
              </div>
            </div>

            <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">Preparation Level</span>
                <h3 className="text-xl font-black text-[var(--primary)] mt-2">
                  {percentCompleted === 100 ? '👑 Master' : percentCompleted >= 75 ? '🥷 Expert' : percentCompleted >= 50 ? '⚔️ Challenger' : percentCompleted >= 25 ? '🛡️ Explorer' : '🌱 Initiate'}
                </h3>
                <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1">Instantly visual corporate readiness</p>
              </div>
              <div className="text-4xl bg-[var(--primary-light)] text-[var(--primary)] w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
                🎓
              </div>
            </div>
          </div>

          {/* Filters and Search Bar Container */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search by challenge title, company, or concept..."
                  value={sheetSearch}
                  onChange={(e) => setSheetSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition duration-200"
                />
              </div>

              {(sheetCompany !== 'All' || sheetTopic !== 'All' || sheetSearch !== '') && (
                <button
                  onClick={() => {
                    setSheetCompany('All');
                    setSheetTopic('All');
                    setSheetSearch('');
                  }}
                  className="px-4 py-2.5 bg-[var(--bg-sub)] hover:bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl text-[10px] font-black uppercase tracking-wider transition duration-200 shrink-0"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Company Filter Row */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)]">Filter by Target Company</span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Google', 'Amazon', 'Microsoft', 'Meta', 'Others'].map((comp) => (
                  <button
                    key={comp}
                    onClick={() => setSheetCompany(comp)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${
                      sheetCompany === comp
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md'
                        : 'bg-[var(--bg-sub)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                    }`}
                  >
                    {comp === 'All' ? '🌐 All Companies' : comp}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Filter Row */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)]">Filter by Concept / Topic</span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Arrays/Hashing', 'Linked Lists', 'Stacks/Queues', 'Trees', 'Graphs', 'DP', 'Greedy'].map((top) => (
                  <button
                    key={top}
                    onClick={() => setSheetTopic(top)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${
                      sheetTopic === top
                        ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                        : 'bg-[var(--bg-sub)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                    }`}
                  >
                    {top === 'All' ? '📚 All Topics' : top}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions List Grid */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-sub)]/50 flex items-center justify-between">
              <span className="text-xs font-black text-[var(--text-main)] tracking-wider">
                Showing {filteredQuestions.length} Coding Challenges
              </span>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-16 text-center text-[var(--text-muted)] italic">
                No matching questions found matching your filter criteria. Try resetting filters.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {filteredQuestions.map((q) => {
                  const isDone = sheetCompletions.includes(q.id);
                  const displayIndex = SHEET_QUESTIONS.indexOf(q) + 1;

                  return (
                    <div 
                      key={q.id} 
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 ${
                        isDone 
                          ? 'bg-emerald-500/5 hover:bg-emerald-500/10' 
                          : 'hover:bg-[var(--bg-sub)]/30'
                      }`}
                    >
                      {/* Checkbox + Title block */}
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleToggleCheckpoint(q.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                            isDone 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'border-[var(--border)] hover:border-[var(--primary)] bg-[var(--bg-sub)]'
                          }`}
                        >
                          {isDone && <span className="text-xs font-black">✓</span>}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black text-[var(--text-light)]">#{displayIndex}</span>
                            <h4 className={`font-black text-sm transition-all ${
                              isDone 
                                ? 'text-[var(--text-muted)] line-through' 
                                : 'text-[var(--text-main)]'
                            }`}>
                              {q.title}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              q.difficulty === 'Easy' 
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {q.difficulty}
                            </span>
                            <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-[9px] font-black uppercase tracking-wider border border-[var(--border)]">
                              {q.topic}
                            </span>
                          </div>

                          {/* Company Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {q.companies.map((company) => {
                              let styleClass = 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20';
                              if (company === 'Google') styleClass = 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
                              else if (company === 'Amazon') styleClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
                              else if (company === 'Microsoft') styleClass = 'bg-sky-500/10 text-sky-500 border border-sky-500/20';
                              else if (company === 'Meta' || company === 'Facebook') styleClass = 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20';
                              
                              return (
                                <span key={company} className={`px-2 py-0.5 rounded-md text-[8px] font-bold tracking-wide ${styleClass}`}>
                                  {company}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Solve Challenge / Video Actions */}
                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        {q.yt && (
                          <a 
                            href={q.yt} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition duration-200"
                            title="Watch Video Tutorial Explanation"
                          >
                            🎬
                          </a>
                        )}
                        <button
                          onClick={() => handleSolveChallenge(q.id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-amber-500 hover:from-[var(--primary)] hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow hover:shadow-md hover:scale-[1.01]"
                        >
                          Solve Challenge ⚡
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">A2Z Progress</span>
                <h3 className="text-3xl font-black text-[var(--text-main)] mt-1">{solvedA2zCount} / {totalA2zCount}</h3>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] mb-1">
                  <span>{percentA2zCompleted}% Completed</span>
                  <span>{totalA2zCount - solvedA2zCount} Remaining</span>
                </div>
                <div className="h-2.5 bg-[var(--bg-sub)] rounded-full overflow-hidden border border-[var(--border)]">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentA2zCompleted}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">By Difficulty</span>
                <div className="space-y-1 mt-2 text-xs font-bold text-[var(--text-muted)]">
                  <div className="flex justify-between gap-8">
                    <span className="text-emerald-500">🟢 Easy</span>
                    <span className="text-[var(--text-main)]">{easyA2zSolved} / {easyA2zTotal}</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-amber-500">🟡 Medium</span>
                    <span className="text-[var(--text-main)]">{mediumA2zSolved} / {mediumA2zTotal}</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-rose-500">🔴 Hard</span>
                    <span className="text-[var(--text-main)]">{hardA2zSolved} / {hardA2zTotal}</span>
                  </div>
                </div>
              </div>
              <div className="text-4xl bg-orange-500/10 text-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                📚
              </div>
            </div>

            <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">Preparation Level</span>
                <h3 className="text-xl font-black text-orange-500 mt-2">
                  {percentA2zCompleted === 100 ? '👑 A2Z Legend' : percentA2zCompleted >= 75 ? '🥷 Master' : percentA2zCompleted >= 50 ? '⚔️ Challenger' : percentA2zCompleted >= 25 ? '🛡️ Explorer' : '🌱 Initiate'}
                </h3>
                <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1">Complete steps to unlock coding mastery</p>
              </div>
              <div className="text-4xl bg-[var(--primary-light)] text-[var(--primary)] w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                ⚡
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search Striver A2Z problems or subtopics..."
                  value={a2zSearch}
                  onChange={(e) => setA2zSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition duration-200"
                />
              </div>

              {(a2zSearch !== '' || a2zDifficulty !== 'All') && (
                <button
                  onClick={() => {
                    setA2zSearch('');
                    setA2zDifficulty('All');
                  }}
                  className="px-4 py-2.5 bg-[var(--bg-sub)] hover:bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl text-[10px] font-black uppercase tracking-wider transition duration-200 shrink-0"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)]">Filter by Difficulty</span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setA2zDifficulty(diff)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${
                      a2zDifficulty === diff
                        ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                        : 'bg-[var(--bg-sub)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                    }`}
                  >
                    {diff === 'All' ? '🌐 All Difficulties' : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Steps list */}
          <div className="space-y-4">
            {STRIVER_A2Z_SHEET.map((step) => {
              const matchedProblems = getFilteredStepProblems(step);
              if (matchedProblems.length === 0 && (a2zSearch !== '' || a2zDifficulty !== 'All')) {
                return null;
              }

              const isExpanded = expandedA2zStep === step.step;
              
              const stepProblemsList = [];
              step.subcategories.forEach(sub => {
                sub.problems.forEach(p => stepProblemsList.push(p));
              });
              const stepTotal = stepProblemsList.length;
              const stepSolved = stepProblemsList.filter(p => a2zCompletions.includes(p.id)).length;
              const stepPercent = stepTotal > 0 ? Math.round((stepSolved / stepTotal) * 100) : 0;

              return (
                <div 
                  key={step.step}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm animate-fade-in"
                >
                  <button
                    onClick={() => setExpandedA2zStep(isExpanded ? null : step.step)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--bg-sub)]/10 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-sm shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-sm text-[var(--text-main)] leading-snug truncate">
                          {step.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-[10px] font-bold text-[var(--text-muted)]">
                            {stepSolved} / {stepTotal} Completed
                          </span>
                          <span className="w-1.5 h-1.5 bg-[var(--border)] rounded-full" />
                          <span className="text-[10px] font-bold text-orange-500">
                            {stepPercent}% Finished
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-4">
                      <div className="w-20 hidden sm:block h-1.5 bg-[var(--bg-sub)] rounded-full overflow-hidden border border-[var(--border)]">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${stepPercent}%` }}
                        />
                      </div>
                      <span className="text-lg text-[var(--text-muted)]">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 border-t border-[var(--border)] bg-[var(--bg-sub)]/20 space-y-6">
                          {step.subcategories.map((sub, subIdx) => {
                            const subProblems = sub.problems.filter(p => {
                              const searchLower = a2zSearch.toLowerCase();
                              const matchesSearch = p.name.toLowerCase().includes(searchLower);
                              const matchesDiff = a2zDifficulty === 'All' || p.difficulty === a2zDifficulty;
                              return matchesSearch && matchesDiff;
                            });

                            if (subProblems.length === 0) return null;

                            return (
                              <div key={subIdx} className="space-y-3">
                                <h4 className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-wider border-l-2 border-orange-500 pl-2.5">
                                  {sub.title}
                                </h4>
                                
                                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
                                  {subProblems.map((p) => {
                                    const isDone = a2zCompletions.includes(p.id);
                                    return (
                                      <div 
                                        key={p.id} 
                                        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 ${
                                          isDone 
                                            ? 'bg-emerald-500/5 hover:bg-emerald-500/10' 
                                            : 'hover:bg-[var(--bg-sub)]/30'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <button
                                            onClick={() => handleToggleA2zProblem(p.id)}
                                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                                              isDone 
                                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                : 'border-[var(--border)] hover:border-[var(--primary)] bg-[var(--bg-sub)]'
                                            }`}
                                          >
                                            {isDone && <span className="text-xs font-black">✓</span>}
                                          </button>
                                          <div>
                                            <span className={`text-xs font-black transition-all ${
                                              isDone 
                                                ? 'text-[var(--text-muted)] line-through' 
                                                : 'text-[var(--text-main)]'
                                            }`}>
                                              {p.name}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                            p.difficulty === 'Easy' 
                                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                              : p.difficulty === 'Medium'
                                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                          }`}>
                                            {p.difficulty}
                                          </span>

                                          {p.leetcode && (
                                            <a
                                              href={p.leetcode}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500 hover:text-white text-[9px] font-black uppercase tracking-wider transition-all duration-150"
                                            >
                                              LeetCode 🍊
                                            </a>
                                          )}

                                          {p.gfg && (
                                            <a
                                              href={p.gfg}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-[9px] font-black uppercase tracking-wider transition-all duration-150"
                                            >
                                              GFG 🟢
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const TopicsList = ({ phaseId, isTopicCompleted, activeLevel, isDSA }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (phaseId) {
      setLoading(true);
      api.get(`/topics/phase/${phaseId}`).then(res => {
        setTopics(res.data.data);
        setLoading(false);
      });
    }
  }, [phaseId]);

  if (!phaseId) return <div className="text-center py-10 text-[var(--text-light)] italic">No missions defined for this level yet.</div>;
  
  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent mx-auto"></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
      {topics.map((topic, i) => {
        const completed = isTopicCompleted(topic._id);
        
        return (
          <Link 
            key={topic._id} 
            to={`/topic/${topic._id}`}
            className={`group p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
              completed 
                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5' 
                : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 shrink-0 ${
                completed 
                  ? 'bg-green-100 text-[var(--brand-green)] shadow-[var(--shadow-soft)]' 
                  : 'bg-[var(--bg-sub)] text-[var(--text-light)] group-hover:bg-[var(--brand-green-light)] group-hover:text-[var(--brand-green)] group-hover:rotate-6'
              }`}>
                {completed ? <FiCheckCircle /> : <FiPlayCircle />}
              </div>
              <div>
                <h4 className={`font-black text-sm transition-colors leading-snug ${completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-main)] group-hover:text-[var(--primary)]'}`}>{topic.title}</h4>
                <div className="text-[9px] font-black text-[var(--text-light)] uppercase mt-1 tracking-widest flex items-center gap-2.5">
                  <span className="flex items-center gap-1"><FiClock /> {topic.estimatedTime}</span>
                  <span className="w-1 h-1 bg-[var(--border)] rounded-full"></span>
                  <span className="text-amber-500 font-black">+50 XP</span>
                  {isDSA && <span className="text-[var(--primary)] font-black">Watch • Quiz • Code</span>}
                </div>
              </div>
            </div>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[var(--bg-sub)] text-[var(--text-light)] group-hover:bg-[var(--primary-light)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5'}`}>
              <FiZap className="text-base" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Roadmap;
