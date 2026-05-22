import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiBookOpen, FiMusic, FiCode, FiAward, FiCheckCircle, FiPlay, FiBook, FiCheck, FiFolder, FiExternalLink } from 'react-icons/fi';
import domainRoadmaps from '../data/domainRoadmaps';
import LeetCodeEditor from './LeetCodeEditor';
import toast from 'react-hot-toast';

const InteractiveRoadmap = ({ domainSlug }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState({
    completedTopics: {},
    completedProblems: {},
    completedProjects: {}
  });
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Load roadmap data
  useEffect(() => {
    if (!domainSlug) return;
    const data = domainRoadmaps[domainSlug];
    if (data) {
      setRoadmap(data);
      // Load progress from localStorage
      const saved = localStorage.getItem(`roadmap_progress_${domainSlug}`);
      if (saved) {
        try {
          setProgress(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved progress", e);
        }
      } else {
        setProgress({
          completedTopics: {},
          completedProblems: {},
          completedProjects: {}
        });
      }
    } else {
      setRoadmap(null);
    }
  }, [domainSlug]);

  // Save progress
  const saveProgress = (newProgress) => {
    setProgress(newProgress);
    localStorage.setItem(`roadmap_progress_${domainSlug}`, JSON.stringify(newProgress));
  };

  if (!roadmap) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <FiBookOpen size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Roadmap Under Construction</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">We are currently designing a specialized step-by-step master path for this domain. Check back soon!</p>
      </div>
    );
  }

  // Calculate metrics
  const totalItems = roadmap.steps.reduce((acc, step) => {
    return acc + step.topics.length + step.practiceProblems.length + 1; // 1 for the project
  }, 0);

  const completedItemsCount = roadmap.steps.reduce((acc, step) => {
    let completed = 0;
    step.topics.forEach(t => {
      if (progress.completedTopics[`${step.stepNumber}_${t}`]) completed++;
    });
    step.practiceProblems.forEach(p => {
      if (progress.completedProblems[p.problemId]) completed++;
    });
    if (progress.completedProjects[step.stepNumber]) completed++;
    return acc + completed;
  }, 0);

  const percentage = totalItems > 0 ? Math.round((completedItemsCount / totalItems) * 100) : 0;

  const toggleTopic = (stepNumber, topicName) => {
    const key = `${stepNumber}_${topicName}`;
    const newCompletedTopics = { ...progress.completedTopics };
    const isNowCompleted = !newCompletedTopics[key];
    
    if (isNowCompleted) {
      newCompletedTopics[key] = true;
      toast.success(`Topic Mastered! +10 XP 🚀`);
    } else {
      delete newCompletedTopics[key];
    }

    saveProgress({
      ...progress,
      completedTopics: newCompletedTopics
    });
  };

  const toggleProject = (stepNumber) => {
    const newCompletedProjects = { ...progress.completedProjects };
    const isNowCompleted = !newCompletedProjects[stepNumber];

    if (isNowCompleted) {
      newCompletedProjects[stepNumber] = true;
      toast.success(`Mini Project Completed! +50 XP 🏆`);
    } else {
      delete newCompletedProjects[stepNumber];
    }

    saveProgress({
      ...progress,
      completedProjects: newCompletedProjects
    });
  };

  const handleSolveProblem = (problemId) => {
    const newCompletedProblems = { ...progress.completedProblems, [problemId]: true };
    saveProgress({
      ...progress,
      completedProblems: newCompletedProblems
    });
    setSelectedProblem(null);
  };

  return (
    <div className="space-y-10">
      {/* Roadmap Metrics overview */}
      <div className="card p-8 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4361ee]/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <FiTrendingUp /> Step-by-Step Learning
            </div>
            <h2 className="text-3xl font-black mb-3 tracking-tight">{roadmap.title}</h2>
            <p className="text-indigo-200/80 text-sm leading-relaxed max-w-xl font-medium">
              {roadmap.description}
            </p>
            <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
              <span className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                ⏳ {roadmap.estimatedDuration}
              </span>
              <span className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                🔥 {roadmap.difficultyLevel}
              </span>
            </div>
          </div>

          <div className="w-full md:w-64 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm text-center">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest block mb-2">Roadmap Progress</span>
            <div className="text-4xl font-black mb-3">{percentage}%</div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-indigo-400 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-indigo-200/60 uppercase">
              {completedItemsCount} / {totalItems} items completed
            </span>
          </div>
        </div>
      </div>

      {/* Step Navigator and Content split pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Navigator (3 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-4">Learning Steps</div>
          <div className="space-y-2">
            {roadmap.steps.map((step, idx) => {
              const active = activeStep === idx;
              
              // calculate step progress
              const totalStepItems = step.topics.length + step.practiceProblems.length + 1;
              let completedStepItems = 0;
              step.topics.forEach(t => {
                if (progress.completedTopics[`${step.stepNumber}_${t}`]) completedStepItems++;
              });
              step.practiceProblems.forEach(p => {
                if (progress.completedProblems[p.problemId]) completedStepItems++;
              });
              if (progress.completedProjects[step.stepNumber]) completedStepItems++;
              const stepDone = completedStepItems === totalStepItems;

              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                    active 
                      ? 'bg-white border-[#4361ee] shadow-lg shadow-indigo-50/50' 
                      : 'bg-white border-[#f3f0ec] hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-xs ${
                    stepDone 
                      ? 'bg-emerald-500 text-white' 
                      : active 
                        ? 'bg-[#4361ee] text-white' 
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    {stepDone ? <FiCheck /> : step.stepNumber}
                  </div>
                  <div>
                    <h4 className="font-black text-[#1a1a1a] text-sm leading-tight mb-1">{step.title}</h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {completedStepItems} of {totalStepItems} Complete
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#eaecf0] rounded-3xl p-8 shadow-sm space-y-8">
          
          {/* Step Header */}
          <div className="border-b border-[#f2f4f7] pb-6">
            <span className="text-primary text-[10px] font-black uppercase tracking-widest block mb-2">
              STEP {roadmap.steps[activeStep].stepNumber} • {roadmap.steps[activeStep].topics.length} TOPICS
            </span>
            <h3 className="text-2xl font-black text-[#1a1a1a] tracking-tight mb-3">
              {roadmap.steps[activeStep].title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              {roadmap.steps[activeStep].description}
            </p>
          </div>

          {/* Topics and Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Topic List */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
                <FiBookOpen className="text-primary" /> Topic learning path
              </h4>
              <div className="space-y-2">
                {roadmap.steps[activeStep].topics.map((topic, tIdx) => {
                  const completed = !!progress.completedTopics[`${roadmap.steps[activeStep].stepNumber}_${topic}`];
                  return (
                    <div
                      key={tIdx}
                      onClick={() => toggleTopic(roadmap.steps[activeStep].stepNumber, topic)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        completed 
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' 
                          : 'bg-gray-50/50 border-gray-100 hover:border-gray-200 text-[#1a1a1a]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
                        completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300'
                      }`}>
                        {completed && <FiCheck />}
                      </div>
                      <span className="text-xs font-bold">{topic}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resources list */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
                <FiBook className="text-[#f59e0b]" /> Study Resources
              </h4>
              <div className="space-y-3">
                {roadmap.steps[activeStep].gfgLinks.map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#eaecf0] hover:border-indigo-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black">
                        G
                      </div>
                      <div>
                        <span className="text-xs font-black text-gray-700 block">{link.title}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">GeeksforGeeks Docs</span>
                      </div>
                    </div>
                    <FiExternalLink className="text-gray-300 group-hover:text-primary transition-colors text-sm" />
                  </a>
                ))}

                {roadmap.steps[activeStep].youtubeLinks.map((link, yIdx) => (
                  <a
                    key={yIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-[#eaecf0] hover:border-indigo-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-sm shrink-0">
                          <FiMusic />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-700 block leading-tight group-hover:text-[#4361ee] transition-colors">{link.title}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                            {link.channelName || "Focus Music"}
                          </span>
                        </div>
                      </div>
                      <FiExternalLink className="text-gray-300 group-hover:text-[#4361ee] transition-colors text-sm shrink-0 mt-1" />
                    </div>
                    {link.reason && (
                      <p className="text-[10px] text-gray-500 font-semibold bg-gray-50 p-2 rounded-lg leading-relaxed mt-1">
                        🎧 {link.reason}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Problems & Code Editor trigger */}
          <div className="border-t border-[#f2f4f7] pt-6 space-y-4">
            <h4 className="text-xs font-black text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
              <FiCode className="text-indigo-500" /> Hands-on Coding Practice
            </h4>
            <div className="space-y-3">
              {roadmap.steps[activeStep].practiceProblems.map((prob) => {
                const solved = !!progress.completedProblems[prob.problemId];
                return (
                  <div
                    key={prob.problemId}
                    className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 rounded-2xl border transition-all ${
                      solved 
                        ? 'bg-emerald-50/20 border-emerald-200' 
                        : 'bg-white border-[#eaecf0] hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-[#1a1a1a] text-sm">{prob.title}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          prob.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {prob.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                        {prob.description}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedProblem(prob)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                        solved 
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200' 
                          : 'bg-indigo-50 text-[#4361ee] hover:bg-indigo-100'
                      }`}
                    >
                      {solved ? <><FiCheckCircle /> Solved</> : <><FiPlay /> Open Sandbox</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Project & Assessment Placement */}
          <div className="border-t border-[#f2f4f7] pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mini Project card */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
              <h5 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">
                <FiFolder className="text-amber-500" /> Mini Project Mission
              </h5>
              <p className="text-[#1a1a1a] font-bold text-xs leading-relaxed">
                {roadmap.steps[activeStep].miniProject}
              </p>
              <button
                onClick={() => toggleProject(roadmap.steps[activeStep].stepNumber)}
                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  progress.completedProjects[roadmap.steps[activeStep].stepNumber]
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                {progress.completedProjects[roadmap.steps[activeStep].stepNumber] 
                  ? <><FiCheckCircle /> Mission Accomplished</> 
                  : 'Mark as Completed'}
              </button>
            </div>

            {/* Assessment card */}
            <div className="p-5 rounded-2xl bg-[#f2f4f7] border border-[#eaecf0] flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <FiAward className="text-indigo-500" /> Milestone Check
                </h5>
                <p className="text-gray-400 text-xs font-semibold leading-relaxed mb-4">
                  Validate your skills with the step validation test. Unlocks global badges.
                </p>
              </div>
              <a
                href={roadmap.steps[activeStep].assessmentLinkPlaceholder}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-white border border-[#eaecf0] hover:border-indigo-300 text-gray-700 text-xs font-black transition-all flex items-center justify-center gap-2 group"
              >
                Launch Assessment <FiExternalLink className="text-gray-300 group-hover:text-primary transition-colors" />
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Code Sandbox Modal overlay */}
      {selectedProblem && (
        <LeetCodeEditor
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onSolve={handleSolveProblem}
        />
      )}
    </div>
  );
};

export default InteractiveRoadmap;
