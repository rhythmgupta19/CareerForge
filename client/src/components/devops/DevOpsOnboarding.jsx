import React, { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FiCheck, FiArrowRight, FiShield, FiCpu, FiServer, FiZap, FiBookOpen } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 'networking',
    text: "Do you know Networking? (IP, TCP/UDP, DNS, HTTP)",
    icon: <FiServer className="text-sky-400" size={24} />
  },
  {
    id: 'linux',
    text: "Do you know Linux? (Bash commands, permissions, processes)",
    icon: <FiCpu className="text-emerald-400" size={24} />
  },
  {
    id: 'git',
    text: "Do you know Git? (Commits, branching, pull requests)",
    icon: <FiZap className="text-amber-400" size={24} />
  },
  {
    id: 'docker',
    text: "Have you worked with Docker containers before?",
    icon: <FiShield className="text-indigo-400" size={24} />
  },
  {
    id: 'kubernetes',
    text: "Have you worked with Kubernetes orchestration before?",
    icon: <FiBookOpen className="text-rose-400" size={24} />
  },
  {
    id: 'beginner',
    text: "Are you a complete beginner in DevOps?",
    icon: <span className="text-2xl">🌱</span>
  }
];

const DevOpsOnboarding = ({ onCompleted }) => {
  const [answers, setAnswers] = useState({
    networking: '',
    linux: '',
    git: '',
    docker: '',
    kubernetes: '',
    beginner: ''
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Custom Manual Selection for Experienced Users
  const [isExperienced, setIsExperienced] = useState(false);
  const [manualLevel, setManualLevel] = useState(0);
  const [step, setStep] = useState('questions'); // 'questions' | 'select-level' | 'success'

  const handleAnswer = (val) => {
    const qId = QUESTIONS[currentStep].id;
    const updatedAnswers = { ...answers, [qId]: val };
    setAnswers(updatedAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Analyze Answers
      const q1 = updatedAnswers.networking === 'yes';
      const q2 = updatedAnswers.linux === 'yes';
      const q3 = updatedAnswers.git === 'yes';
      const q4 = updatedAnswers.docker === 'yes';
      const q5 = updatedAnswers.kubernetes === 'yes';
      const q6 = updatedAnswers.beginner === 'yes';

      // Experienced Check: Docker/K8s or all core skills (Net + Linux + Git), unless beginner
      if (!q6 && (q4 || q5 || (q1 && q2 && q3))) {
        setIsExperienced(true);
        setStep('select-level');
      } else {
        submitAnswers(updatedAnswers);
      }
    }
  };

  const submitAnswers = async (finalAnswers = answers, chosenLevel = null) => {
    try {
      setLoading(true);
      const payload = {
        answers: finalAnswers,
        manualLevel: chosenLevel !== null ? chosenLevel : undefined
      };

      const res = await api.post('/progress/onboarding', payload);
      if (res.data.success) {
        setStep('success');
        setTimeout(() => {
          onCompleted();
        }, 2500);
      }
    } catch (err) {
      toast.error('Failed to submit onboarding selections.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-main)] z-50 flex flex-col items-center justify-center text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary)] border-t-transparent mb-4"></div>
        <p className="text-[var(--text-muted)] font-black text-xs uppercase tracking-wider">Analyzing your DevOps skill profile...</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-[var(--bg-main)] z-50 flex flex-col items-center justify-center text-center p-10 space-y-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
          <div className="text-6xl">🚀</div>
          <h2 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-wider text-gradient">Roadmap Tailored!</h2>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
            Your personalized starting level has been configured. Let's start the DevOps adventure!
          </p>
        </motion.div>
      </div>
    );
  }

  if (step === 'select-level') {
    return (
      <div className="fixed inset-0 bg-[var(--bg-main)] z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
          <div className="text-4xl">⚡</div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[var(--text-main)] uppercase tracking-wider">Experienced DevOps User Detected</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Based on your answers, you already have strong foundations! Choose your starting level in the roadmap manually:
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => setManualLevel(0)}
              className={`w-full p-4 rounded-xl border text-left font-bold text-xs transition-all flex justify-between items-center ${
                manualLevel === 0 
                  ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--text-main)]' 
                  : 'bg-[var(--bg-sub)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
              }`}
            >
              <span>Level 0: Linux Basics (Beginner)</span>
              {manualLevel === 0 && <FiCheck className="text-[var(--primary)]" />}
            </button>
            <button
              onClick={() => setManualLevel(1)}
              className={`w-full p-4 rounded-xl border text-left font-bold text-xs transition-all flex justify-between items-center ${
                manualLevel === 1 
                  ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--text-main)]' 
                  : 'bg-[var(--bg-sub)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
              }`}
            >
              <span>Level 1: Networking Basics (Intermediate)</span>
              {manualLevel === 1 && <FiCheck className="text-[var(--primary)]" />}
            </button>
            <button
              onClick={() => setManualLevel(2)}
              className={`w-full p-4 rounded-xl border text-left font-bold text-xs transition-all flex justify-between items-center ${
                manualLevel === 2 
                  ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--text-main)]' 
                  : 'bg-[var(--bg-sub)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
              }`}
            >
              <span>Level 2: Git &amp; GitHub (Advanced)</span>
              {manualLevel === 2 && <FiCheck className="text-[var(--primary)]" />}
            </button>
          </div>

          <button
            onClick={() => submitAnswers(answers, manualLevel)}
            className="w-full py-3.5 bg-gradient-to-r from-[var(--primary)] to-emerald-600 hover:opacity-90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            Confirm starting level <FiArrowRight />
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentStep];

  return (
    <div className="fixed inset-0 bg-[var(--bg-main)] z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Progress bar */}
        <div className="h-1 bg-[var(--bg-sub)]">
          <div 
            className="h-full bg-gradient-to-r from-[var(--primary)] to-emerald-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[var(--text-light)] font-bold uppercase tracking-wider">
            <span>DevOps Onboarding</span>
            <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 py-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-sub)] border border-[var(--border)] flex items-center justify-center shadow-inner">
              {q.icon}
            </div>
            <h3 className="text-sm font-black text-[var(--text-main)] leading-relaxed uppercase tracking-wider max-w-sm">
              {q.text}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer('yes')}
              className="py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-450 font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer('no')}
              className="py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-450 font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOpsOnboarding;
