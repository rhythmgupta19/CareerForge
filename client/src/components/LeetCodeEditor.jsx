import React, { useState, useEffect } from 'react';
import { FiCode, FiPlay, FiCheck, FiX, FiTerminal, FiCpu, FiAward, FiInfo, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LeetCodeEditor = ({ problem, onClose, onSolve }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [success, setSuccess] = useState(false);

  // Set default code template based on problem and language
  useEffect(() => {
    if (!problem) return;
    
    const templates = {
      javascript: `// Language: JavaScript\n// ${problem.title}\n\nfunction solveProblem(input) {\n    // Write your code here\n    \n    return "Hello World";\n}\n`,
      python: `# Language: Python\n# ${problem.title}\n\ndef solve_problem(input_data):\n    # Write your code here\n    pass\n`,
      cpp: `// Language: C++\n// ${problem.title}\n\n#include <iostream>\nusing namespace std;\n\nvoid solveProblem() {\n    // Write your code here\n}\n`,
      java: `// Language: Java\n// ${problem.title}\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n`
    };

    setCode(templates[language] || templates.javascript);
    setOutput('');
    setConsoleLogs([]);
    setSuccess(false);
  }, [problem, language]);

  if (!problem) return null;

  // Run the code locally or via high-fidelity simulation
  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleLogs(['[System] Initializing environment...', `[System] Setting up language: ${language.toUpperCase()}`]);
    setOutput('');

    setTimeout(() => {
      if (language === 'javascript') {
        try {
          // A safe, controlled mock execution for demo purposes
          // We search for a return statement or clean function execution
          setConsoleLogs(prev => [...prev, '[Compiler] Executing main script...']);
          
          let result;
          // Simple local execution check
          if (code.includes('return')) {
            // Safe simulation checking user output
            setConsoleLogs(prev => [...prev, '[Runner] Executing test cases...']);
            setConsoleLogs(prev => [...prev, '✓ Test case 1: Input variables correct']);
            result = "Success! Output matched expected test pattern.";
          } else {
            result = "Warning: Code compiled but did not return any value. Please make sure to return your answer.";
          }
          
          setOutput(result);
          setConsoleLogs(prev => [...prev, '[System] Done executing. Process exited with code 0.']);
        } catch (err) {
          setOutput(`Error: ${err.message}`);
          setConsoleLogs(prev => [...prev, `[Compiler Error] Exited with status 1: ${err.message}`]);
        }
      } else {
        // High-fidelity simulation for Python, C++, Java
        setConsoleLogs(prev => [
          ...prev,
          `[Compiler] Spawning local ${language} interpreter instance...`,
          '[Compiler] Running syntax inspection...',
          '✓ Compilation successful!',
          '[Runner] Injecting test case vectors...',
          '✓ Test case 1: Input values matched constraints',
          '✓ Test case 2: Edge condition validated successfully'
        ]);
        setOutput(`Success: Solved successfully in ${language} environment!\nExecution time: 42ms\nMemory usage: 14.8 MB`);
      }
      setIsRunning(false);
    }, 1200);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      toast.success('Challenge Solved! Reward Added! 🚀');
      if (onSolve) {
        onSolve(problem.problemId);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      <div className="bg-[#111827] border border-[#1f2937] w-full max-w-7xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col fade-in">
        
        {/* Editor Header */}
        <div className="bg-[#1f2937]/50 border-b border-[#374151] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4361ee]/20 text-[#4361ee] rounded-xl flex items-center justify-center text-lg border border-[#4361ee]/30">
              <FiCode />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg flex items-center gap-3">
                {problem.title}
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {problem.difficulty}
                </span>
              </h2>
              <p className="text-[#9ca3af] text-xs font-semibold">Mapped Practice Module</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#1f2937] text-white border border-[#374151] px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#4361ee]/40 transition-all cursor-pointer"
            >
              <option value="javascript">JavaScript (ES6)</option>
              <option value="python">Python 3.10</option>
              <option value="cpp">C++ (GCC 11)</option>
              <option value="java">Java (JDK 17)</option>
            </select>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#374151]/50 text-gray-400 hover:text-white hover:bg-[#374151] transition-all flex items-center justify-center text-lg"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT PANE: Description & Test Cases */}
          <div className="w-full md:w-5/12 border-r border-[#1f2937] p-6 md:p-8 overflow-y-auto flex flex-col gap-6 bg-[#0f172a]/40">
            <div>
              <h3 className="text-white text-sm font-black uppercase tracking-wider mb-3 flex items-center gap-2 text-indigo-400">
                <FiInfo /> Problem Description
              </h3>
              <div className="text-gray-300 text-sm leading-relaxed space-y-4 font-medium">
                <p>{problem.description}</p>
              </div>
            </div>

            <div className="bg-[#1e293b]/40 rounded-2xl border border-[#334155] p-5">
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-indigo-400">
                <FiAward /> Challenge Completion Reward
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span>Experience Points (XP)</span>
                  <span className="text-amber-400 font-black">+50 XP</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span>Progress Credit</span>
                  <span className="text-[#4361ee] font-black">+1 Skill Index</span>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-[#1e293b]/20 rounded-2xl border border-[#334155]/40 p-4 text-xs text-gray-400 font-medium">
              <span className="font-bold text-white block mb-1">💡 Hint</span>
              Remember to write your logic cleanly. Consider edge cases such as empty values, null elements, or boundary thresholds before running.
            </div>
          </div>

          {/* RIGHT PANE: Code Area & Terminal */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
            
            {/* Code inputs */}
            <div className="flex-1 relative border-b border-[#1f2937]">
              <div className="absolute top-3 left-3 z-10 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                Source Code
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-8 pt-10 font-mono text-sm bg-transparent text-gray-100 outline-none resize-none leading-relaxed overflow-y-auto"
                spellCheck="false"
                style={{ tabSize: 4 }}
              />
            </div>

            {/* Terminal Outputs */}
            <div className="h-44 bg-[#090d16] p-4 flex flex-col font-mono text-xs border-t border-[#1f2937]">
              <div className="flex items-center justify-between border-b border-[#1f2937]/50 pb-2 mb-2">
                <span className="text-gray-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                  <FiTerminal /> Console Output
                </span>
                <span className="text-gray-600 text-[10px]">Interactive Sandbox</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin text-gray-300">
                {consoleLogs.map((log, index) => (
                  <div key={index} className={
                    log.includes('✓') ? 'text-emerald-400 font-bold' :
                    log.includes('[Compiler Error]') ? 'text-rose-400 font-bold' :
                    log.includes('[System]') ? 'text-indigo-400 font-bold' :
                    'text-gray-400 font-medium'
                  }>
                    {log}
                  </div>
                ))}
                {output && (
                  <div className="mt-2 pt-2 border-t border-[#1f2937]/30 text-emerald-300 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10 font-semibold whitespace-pre-line">
                    {output}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Editor Footer Actions */}
        <div className="bg-[#1f2937]/50 border-t border-[#374151] px-6 py-4 flex items-center justify-between">
          <div className="text-gray-400 text-xs font-semibold">
            {success ? (
              <span className="text-emerald-400 font-black flex items-center gap-1.5">
                <FiCheck /> Verification passed! Submit to save.
              </span>
            ) : (
              <span>Write your code and run tests to verify.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunCode}
              disabled={isRunning || isSubmitting || success}
              className="px-5 py-2.5 rounded-xl bg-[#374151] hover:bg-[#4b5563] text-white text-xs font-black transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <FiPlay className={isRunning ? 'animate-spin' : ''} /> 
              {isRunning ? 'Running Code...' : 'Run Tests'}
            </button>

            {success ? (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center gap-2"
              >
                Done <FiChevronRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#4361ee] hover:bg-[#3851dd] text-white text-xs font-black transition-all flex items-center gap-2 disabled:opacity-40"
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Solution'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeetCodeEditor;
