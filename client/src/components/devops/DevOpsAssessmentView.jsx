import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiAward, FiHelpCircle, FiChevronRight, FiRefreshCw, FiBookOpen } from 'react-icons/fi';

const DevOpsAssessmentView = ({ topicId, onPassed }) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
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

      const res = await api.get(`/assessments/module/${topicId}`);
      if (res.data.success && res.data.data) {
        setAssessment(res.data.data);
      } else {
        setError('Failed to fetch assessment questions.');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Topic has no assessment configuration
        setError('no_assessment');
      } else {
        setError(err.response?.data?.message || 'An error occurred while loading questions.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      fetchAssessment();
    }
  }, [topicId]);

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
    // Check if all questions are answered
    const unanswered = assessment.questions.some((_, idx) => !selectedAnswers[idx]);
    if (unanswered) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/assessments/submit', {
        moduleId: topicId,
        answers: selectedAnswers
      });

      if (res.data.success && res.data.data) {
        setResults(res.data.data);
        if (res.data.data.passed) {
          toast.success('Congratulations! You passed the assessment! 🎉');
          if (onPassed) {
            onPassed();
          }
        } else {
          toast.error('Assessment failed. Score is below 70%. You can retry anytime!');
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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#09090b] min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent mb-4"></div>
        <p className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Loading Assessment Questions...</p>
      </div>
    );
  }

  if (error === 'no_assessment') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#09090b] text-zinc-400 min-h-[400px] space-y-4">
        <div className="text-5xl">🕊️</div>
        <h3 className="text-sm font-black text-white uppercase tracking-wider">No mini-assessment required</h3>
        <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
          This topic does not require a mini MCQ assessment. Complete the terminal tasks and mark the topic completed.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#09090b] text-rose-450 min-h-[400px] space-y-4">
        <div className="text-5xl">⚠️</div>
        <h3 className="text-sm font-black text-white uppercase tracking-wider">Failed to Load Assessment</h3>
        <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">{error}</p>
        <button onClick={fetchAssessment} className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-xs font-bold hover:bg-zinc-700">
          Try Again
        </button>
      </div>
    );
  }

  if (results) {
    const { score, passed, explanations } = results;
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#09090b] text-white custom-scrollbar space-y-6">
        <div className={`p-6 rounded-2xl border text-center space-y-4 ${
          passed 
            ? 'bg-emerald-500/10 border-emerald-500/20' 
            : 'bg-rose-500/10 border-rose-500/20'
        }`}>
          <div className="text-5xl">{passed ? '🏆' : '❌'}</div>
          <div>
            <h2 className="text-xl font-black">{passed ? 'Assessment Passed!' : 'Assessment Failed'}</h2>
            <p className="text-xs text-zinc-400 mt-1">Passing threshold: 70%</p>
          </div>
          <div className="text-3xl font-black text-gradient">Score: {score}%</div>

          {!passed && (
            <button
              onClick={fetchAssessment}
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 inline-flex items-center gap-2"
            >
              <FiRefreshCw /> Retake Assessment
            </button>
          )}
        </div>

        {/* Explanations Catalog */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Review Questions & Explanations</h3>
          
          <div className="space-y-3">
            {Object.keys(explanations).map((idxStr) => {
              const idx = parseInt(idxStr, 10);
              const exp = explanations[idxStr];
              const userAns = selectedAnswers[idx];

              return (
                <div key={idx} className="p-4 bg-[#141416] border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-start gap-3 justify-between">
                    <span className="font-bold text-xs text-zinc-300">Q{idx + 1}. {exp.question}</span>
                    <span className="shrink-0 text-lg">
                      {exp.isCorrect ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-rose-500" />}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-semibold">
                    <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                      <span className="text-zinc-500 uppercase tracking-wider text-[8px] block">Your Answer</span>
                      <span className={exp.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{userAns || '(no answer)'}</span>
                    </div>
                    {!exp.isCorrect && (
                      <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                        <span className="text-zinc-500 uppercase tracking-wider text-[8px] block">Correct Answer</span>
                        <span className="text-emerald-400">{exp.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-lg text-[10px] text-zinc-400 leading-relaxed font-medium">
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
    );
  }

  const currentQuestion = assessment.questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / assessment.questions.length) * 100);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#09090b] text-white">
      {/* Title / Progress Header */}
      <div className="p-4 bg-[#141416] border-b border-zinc-800 shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--primary)]">{assessment.title}</span>
          <span className="text-[10px] text-zinc-500 font-bold">
            Question {currentIdx + 1} of {assessment.questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--primary)] to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Canvas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="p-5 bg-[#141416] border border-zinc-800 rounded-2xl flex items-start gap-3">
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
                    ? 'bg-[var(--primary-light)]/20 border-[var(--primary)] text-white shadow-sm ring-1 ring-[var(--primary)]/20'
                    : 'bg-[#141416] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
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
      <div className="p-4 bg-[#141416] border-t border-zinc-800 flex justify-between items-center shrink-0">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-all"
        >
          Previous
        </button>

        {currentIdx === assessment.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || !selectedAnswers[currentIdx]}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow-md inline-flex items-center gap-1"
          >
            {submitting ? 'Submitting...' : 'Submit Answers'} <FiCheckCircle />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentIdx]}
            className="px-5 py-2 bg-gradient-to-r from-[var(--primary)] to-indigo-500 hover:opacity-90 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition duration-200 inline-flex items-center gap-1"
          >
            Next <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default DevOpsAssessmentView;
