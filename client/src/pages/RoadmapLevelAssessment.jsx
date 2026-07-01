import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiArrowLeft, FiHelpCircle, FiChevronRight, FiRefreshCw, FiBookOpen, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RoadmapLevelAssessment = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bypassing, setBypassing] = useState(false);
  const [bypassSuccess, setBypassSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      setResults(null);
      setSelectedAnswers({});
      setCurrentIdx(0);
      setBypassSuccess(false);

      const res = await api.get(`/assessments/level/${levelId}`);
      if (res.data.success) {
        if (res.data.data) {
          setAssessment(res.data.data);
          setLoading(false);
        } else {
          // No assessment exists for this level! Auto-complete it.
          handleAutoBypass();
        }
      } else {
        setError('Failed to fetch assessment questions.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while loading questions.');
      setLoading(false);
    }
  };

  const handleAutoBypass = async () => {
    try {
      setBypassing(true);
      const res = await api.post('/assessments/level/complete-without-assessment', { levelId });
      if (res.data.success) {
        setBypassSuccess(true);
        refreshUser();
      } else {
        setError(res.data.message || 'Failed to complete level.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to automatically complete level.');
    } finally {
      setBypassing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (levelId) {
      fetchAssessment();
    }
  }, [levelId]);

  const handleSelectOption = (option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: option
    }));
  };

  const handleNext = () => {
    if (currentIdx < assessment.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = assessment.questions.some((_, idx) => !selectedAnswers[idx]);
    if (unanswered) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/assessments/level/submit', {
        levelId,
        answers: selectedAnswers
      });

      if (res.data.success && res.data.data) {
        setResults(res.data.data);
        if (res.data.data.passed) {
          toast.success('Congratulations! Level assessment passed! 🎉');
          refreshUser();
        } else {
          toast.error('Assessment failed. Score is below 70%.');
        }
      } else {
        toast.error('Failed to submit assessment.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answers.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || bypassing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#09090b]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent mb-4"></div>
        <p className="text-zinc-400 font-bold text-xs uppercase tracking-wider">
          {bypassing ? 'Bypassing missing assessment...' : 'Loading level assessment...'}
        </p>
      </div>
    );
  }

  if (bypassSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-[#09090b] text-zinc-400 space-y-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
          <div className="text-6xl">🕊️</div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">No Level Assessment Required</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            This level does not have an assessment configured. The system has automatically marked it completed and unlocked the next phase!
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/roadmap')}
              className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md inline-flex items-center gap-2"
            >
              <FiArrowLeft /> Return to Roadmap
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-[#09090b] text-rose-450 space-y-4">
        <div className="text-5xl">⚠️</div>
        <h3 className="text-sm font-black text-white uppercase tracking-wider">Error occurred</h3>
        <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">{error}</p>
        <button onClick={() => navigate('/roadmap')} className="px-5 py-2.5 bg-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-zinc-700">
          Back to Roadmap
        </button>
      </div>
    );
  }

  if (results) {
    const { score, passed, explanations } = results;
    return (
      <div className="min-h-screen bg-[#09090b] text-white p-6 sm:p-10 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-2xl bg-[#141416] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className={`p-6 rounded-2xl border text-center space-y-4 ${
            passed 
              ? 'bg-emerald-500/10 border-emerald-500/20' 
              : 'bg-rose-500/10 border-rose-500/20'
          }`}>
            <div className="text-6xl">{passed ? '🏆' : '❌'}</div>
            <div>
              <h2 className="text-xl font-black">{passed ? 'Level Assessment Passed!' : 'Assessment Failed'}</h2>
              <p className="text-xs text-zinc-400 mt-1">Passing threshold: 70%</p>
            </div>
            <div className="text-3xl font-black text-gradient">Score: {score}%</div>

            {passed ? (
              <button
                onClick={() => navigate('/roadmap')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 inline-flex items-center gap-2"
              >
                Continue Roadmap <FiChevronRight />
              </button>
            ) : (
              <button
                onClick={fetchAssessment}
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 inline-flex items-center gap-2"
              >
                <FiRefreshCw /> Retake Assessment
              </button>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Question Reviews</h3>
            <div className="space-y-3">
              {Object.keys(explanations).map((idxStr) => {
                const idx = parseInt(idxStr, 10);
                const exp = explanations[idxStr];
                const userAns = selectedAnswers[idx];

                return (
                  <div key={idx} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-start gap-3 justify-between">
                      <span className="font-bold text-xs text-zinc-300">Q{idx + 1}. {exp.question}</span>
                      <span className="shrink-0 text-lg">
                        {exp.isCorrect ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-rose-500" />}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-semibold">
                      <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                        <span className="text-zinc-500 uppercase tracking-wider text-[8px] block">Your Choice</span>
                        <span className={exp.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{userAns || '(no answer)'}</span>
                      </div>
                      {!exp.isCorrect && (
                        <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                          <span className="text-zinc-500 uppercase tracking-wider text-[8px] block">Correct Answer</span>
                          <span className="text-emerald-400">{exp.correctAnswer}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-lg text-[10px] text-zinc-400 leading-relaxed font-medium">
                      <span className="font-bold text-zinc-300 flex items-center gap-1 mb-1">
                        <FiBookOpen size={10} className="text-indigo-400" /> Explanation:
                      </span>
                      {exp.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / assessment.questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between">
      {/* Navbar Header */}
      <header className="p-4 bg-[#141416] border-b border-zinc-800 shrink-0 flex items-center justify-between">
        <button
          onClick={() => navigate('/roadmap')}
          className="px-4 py-2 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2"
        >
          <FiArrowLeft /> Back to Roadmap
        </button>
        <span className="text-xs font-black uppercase tracking-wider text-[var(--primary)]">{assessment.title}</span>
        <span className="text-[10px] text-zinc-500 font-bold bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
          LVL ASSESSMENT
        </span>
      </header>

      {/* Progress Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl bg-[#141416] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          {/* Progress bar */}
          <div className="h-1 bg-zinc-900">
            <div 
              className="h-full bg-gradient-to-r from-[var(--primary)] to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
              <span>Question {currentIdx + 1} of {assessment.questions.length}</span>
              <span className="text-[var(--primary)]">{progressPercent}%</span>
            </div>

            <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-start gap-3">
              <FiHelpCircle className="text-[var(--primary)] text-lg shrink-0 mt-0.5" />
              <h3 className="font-black text-sm text-zinc-100 leading-snug">{currentQuestion.question}</h3>
            </div>

            {/* Options grid */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, oIdx) => {
                const isSelected = selectedAnswers[currentIdx] === option;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-xl border text-left font-bold text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[var(--primary-light)]/25 border-[var(--primary)] text-white shadow-sm ring-1 ring-[var(--primary)]/20'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span>{option}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                      isSelected ? 'border-[var(--primary)] bg-[var(--primary)] text-white' : 'border-zinc-700'
                    }`}>
                      {isSelected && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer controls */}
          <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-all"
            >
              Previous
            </button>

            {currentIdx === assessment.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedAnswers[currentIdx]}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow-md inline-flex items-center gap-1"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'} <FiCheckCircle />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!selectedAnswers[currentIdx]}
                className="px-5 py-2 bg-gradient-to-r from-[var(--primary)] to-indigo-500 hover:opacity-90 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition duration-200 inline-flex items-center gap-1"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoadmapLevelAssessment;
