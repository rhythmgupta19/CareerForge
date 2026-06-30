import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FiTerminal, FiTrash2, FiRefreshCw, FiClock, FiActivity } from 'react-icons/fi';

const PracticeTerminal = ({ topicId, activeLabId, onProgressUpdate }) => {
  const [history, setHistory] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState('/home/student');
  const [practiceTime, setPracticeTime] = useState(0);
  const [commandsCount, setCommandsCount] = useState(0);
  
  const consoleEndRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const activeTimeRef = useRef(0);

  // Initialize terminal and fetch progress
  useEffect(() => {
    const fetchTerminalProgress = async () => {
      try {
        const { data } = await api.get(`/terminal/progress/${topicId}`);
        if (data.success && data.progress) {
          setPracticeTime(data.progress.practiceTimeSeconds || 0);
          setCommandsCount(data.progress.commandsExecutedCount || 0);
          activeTimeRef.current = data.progress.practiceTimeSeconds || 0;
        }
      } catch (err) {
        console.warn('Failed to load terminal progress stats', err);
      }
    };
    
    fetchTerminalProgress();
    
    // Add welcome output line
    setHistory([
      { type: 'output', text: 'Welcome to CareerForge Interactive DevOps Laboratory v1.0.0.' },
      { type: 'output', text: 'Type "help" to see all simulated sandbox commands.' },
      { type: 'output', text: '' }
    ]);

    // Setup active practice time-tracker
    timerRef.current = setInterval(() => {
      setPracticeTime(prev => {
        const next = prev + 1;
        // Sync to backend every 30 seconds
        if (next % 30 === 0) {
          api.post('/terminal/time-sync', { topicId, durationSeconds: 30 })
            .catch(e => console.warn('Failed to sync practice duration', e));
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [topicId]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    const command = inputVal.trim();
    if (!command) return;

    // Add command to log
    const cmdLog = { type: 'input', dir: currentDir, text: command };
    setHistory(prev => [...prev, cmdLog]);
    setCmdHistory(prev => [command, ...prev]);
    setHistoryIndex(-1);
    setInputVal('');

    try {
      const { data } = await api.post('/terminal/execute', {
        command,
        topicId,
        activeLabId
      });

      if (data.success) {
        setCommandsCount(prev => prev + 1);
        if (data.output === '__CLEAR__') {
          setHistory([]);
        } else if (data.output) {
          setHistory(prev => [...prev, { type: 'output', text: data.output }]);
        }
        setCurrentDir(data.currentDir);
        
        if (data.labCompleted) {
          toast.success(`🎉 Lab challenge completed! +${data.xpEarned} XP awarded!`);
          if (onProgressUpdate) onProgressUpdate(data.completedLabs);
        }
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setHistory(prev => [...prev, { type: 'error', text: `Error: ${errMsg}` }]);
    }
  };

  // Keyboard navigation for history
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const handleClear = () => {
    setHistory([]);
  };

  const handleResetSession = async () => {
    if (window.confirm('Are you sure you want to reset your terminal session? All files created will be permanently deleted.')) {
      try {
        const { data } = await api.post('/terminal/reset', { topicId, activeLabId });
        if (data.success) {
          setCurrentDir(data.currentDir);
          setHistory([
            { type: 'output', text: 'Terminal session successfully reset.' },
            { type: 'output', text: 'Type "help" to see available commands.' },
            { type: 'output', text: '' }
          ]);
          toast.success('Session reset complete.');
        }
      } catch (err) {
        toast.error('Failed to reset session');
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0c0d] font-mono text-zinc-300 overflow-hidden relative border-l border-[#2e2e30]">
      {/* Terminal Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141416] border-b border-[#222225] shrink-0 text-xs select-none">
        <div className="flex items-center gap-2">
          <FiTerminal className="text-emerald-500 animate-pulse" />
          <span className="font-black text-zinc-400 uppercase tracking-widest text-[9px]">Interactive DevOps Sandbox</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1">
            <FiClock /> Time: <strong className="text-zinc-300 font-bold">{formatTime(practiceTime)}</strong>
          </span>
          <span className="flex items-center gap-1">
            <FiActivity /> Commands: <strong className="text-zinc-300 font-bold">{commandsCount}</strong>
          </span>
          <div className="flex gap-1">
            <button
              onClick={handleClear}
              className="p-1 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
              title="Clear Terminal (Ctrl+L)"
            >
              <FiTrash2 size={12} />
            </button>
            <button
              onClick={handleResetSession}
              className="p-1 hover:text-yellow-400 hover:bg-zinc-800 rounded transition-colors"
              title="Reset Sandbox Session"
            >
              <FiRefreshCw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-1.5 cursor-text text-sm select-text selection:bg-emerald-500/30"
      >
        {history.map((log, idx) => (
          <div key={idx} className="leading-relaxed whitespace-pre-wrap break-all">
            {log.type === 'input' ? (
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-400 font-bold">student@careerforge:</span>
                <span className="text-emerald-500 font-black">{log.dir}</span>
                <span className="text-zinc-500 font-extrabold">$</span>
                <span className="text-white font-medium">{log.text}</span>
              </div>
            ) : log.type === 'error' ? (
              <div className="text-red-400 font-semibold">{log.text}</div>
            ) : (
              <div className="text-zinc-300 font-light">{log.text}</div>
            )}
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 px-4 py-3 bg-[#0d0d0e] border-t border-[#1a1a1c] shrink-0 text-sm">
        <span className="text-indigo-400 font-bold select-none">student@careerforge:</span>
        <span className="text-emerald-500 font-black select-none">{currentDir}</span>
        <span className="text-zinc-500 font-extrabold select-none">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white border-none outline-none focus:ring-0 focus:outline-none p-0 m-0 caret-emerald-500 font-mono"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          autoFocus
        />
      </form>
    </div>
  );
};

export default PracticeTerminal;
