import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiTrash2, FiUser, FiCpu, FiCompass, FiZap, FiAward, FiClock, FiStar, FiActivity, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

// Robust Error Boundary for ReactMarkdown to prevent blank page crashes in React 19
class SafeMarkdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SafeMarkdown caught rendering exception:", error, errorInfo);
  }

  render() {
    const { content, className } = this.props;
    if (this.state.hasError || !content) {
      return <div className={`whitespace-pre-wrap ${className || ''}`}>{content || ''}</div>;
    }

    // Dynamic cleaning of mojibake characters that can trip up v10 markdown parsers
    let cleanContent = content;
    try {
      cleanContent = cleanContent
        .replace(/ðŸ‘‹/g, '👋')
        .replace(/ðŸš€/g, '🚀')
        .replace(/ðŸ‘¾/g, '👾')
        .replace(/ðŸ”¥/g, '🔥')
        .replace(/ðŸ’¬/g, '💬')
        .replace(/ðŸ’ª/g, '💪')
        .replace(/ðŸ—‚/g, '📋')
        .replace(/ðŸ” /g, '💡')
        .replace(/ðŸŽ¯/g, '🎯')
        .replace(/ðŸ“Š/g, '📊')
        .replace(/ðŸ“…/g, '📅')
        .replace(/ðŸ /g, '🛠️')
        .replace(/ðŸ¾/g, '🐾');
    } catch (e) {
      console.warn("Character cleaning exception:", e);
    }

    return (
      <div className={className || ''}>
        <ReactMarkdown>{cleanContent}</ReactMarkdown>
      </div>
    );
  }
}

const AiChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [insights, setInsights] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/history');
      if (res.data.data.length === 0) {
        setMessages([{
          _id: 'initial',
          role: 'assistant',
          content: `Hi ${user.fullName.split(' ')[0]}! 👋 I am Code Guru, your personal coding helper!\n\nI can guide you on:\n\n* **Domain Selection:** Deciding what domain to choose (Web Development or DSA).\n* **Weak Topics:** Targeted revision and practice strategies.\n* **Weekly Plan:** Custom learning schedules built for your pace.\n* **Placement Audit:** Placement and internship readiness metrics.\n* **Concepts & Coding:** Explaining tricky programming syntax or logic.\n\nWhat should we tackle today? Choose a suggested question below or ask me anything! 🚀`
        }]);
      } else {
        setMessages(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await api.get('/ai/performance-insights');
      setInsights(res.data.data);
    } catch (err) {
      console.log('Error loading dynamic AI insights:', err.message);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchHistory();
    fetchInsights();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || sending) return;

    setInput('');
    const userMessage = text.trim();
    
    // Add User Message optimistically
    const newMsg = { _id: Date.now(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMsg]);
    setSending(true);

    try {
      const res = await api.post('/ai/chat', { message: userMessage });
      setMessages(prev => [...prev, { _id: Date.now() + 1, role: 'assistant', content: res.data.data.message }]);
      
      // Refresh insights dynamically after a question is asked to keep stats in sync!
      fetchInsights();
    } catch (err) {
      toast.error('Failed to get response from Code Guru');
      setMessages(prev => prev.filter(m => m._id !== newMsg._id));
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear your mentorship log?')) return;
    try {
      await api.delete('/ai/history');
      setMessages([{
        _id: 'initial',
        role: 'assistant',
        content: "Chat history cleared. How can I help you today?"
      }]);
      toast.success('Mentorship history cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  const suggestedPrompts = [
    { label: "What domain should I choose?", text: "What domain should I choose?" },
    { label: "What should I learn next?", text: "What should I learn next in my roadmap?" },
    { label: "Analyze my performance", text: "Analyze my performance, what are my weak topics?" },
    { label: "Create my weekly plan", text: "Create my weekly study plan based on my pace" },
    { label: "Suggest a project", text: "Suggest a project for my level and domain" }
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col px-4 py-4 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[var(--border)] shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-main)] flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white p-1.5 rounded-lg text-sm shadow-md shrink-0">🤖</span>
            <span className="text-logo-gradient">Code Guru</span> AI Chat
          </h1>
        </div>
        <button 
          onClick={handleClear} 
          className="p-2 text-[var(--text-light)] hover:text-red-500 hover:bg-red-500/5 rounded-xl border border-[var(--border)] transition-all shrink-0"
          title="Clear History"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar px-1">
        {messages.length <= 1 ? (
          <div className="flex flex-col items-center justify-center my-auto py-10 text-center animate-fade-in max-w-2xl mx-auto h-full">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center text-3xl shadow-lg mb-6 animate-pulse shrink-0">
              🤖
            </div>
            <h2 className="text-3xl font-black text-[var(--text-main)] mb-2">
              How can I help you today, {user.fullName.split(' ')[0]}?
            </h2>
            <p className="text-sm text-[var(--text-muted)] font-bold mb-10 max-w-md">
              Ask Code Guru anything about coding roadmaps, domain selection, weak topics, or technical interview prep.
            </p>
            
            {/* Grid of suggested prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
              {suggestedPrompts.slice(0, 4).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.text)}
                  disabled={sending}
                  className="bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--bg-sub)] p-5 rounded-2xl transition-all shadow-sm flex flex-col justify-between group cursor-pointer text-[var(--text-main)]"
                >
                  <div className="font-extrabold text-sm mb-1 text-[var(--text-main)] flex items-center justify-between w-full">
                    <span>{prompt.label}</span>
                    <FiArrowRight className="text-[var(--text-light)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-xs text-[var(--text-light)] font-bold">{prompt.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg._id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'user' ? (
                  // User Message: neat right-aligned bubble
                  <div className="flex flex-col items-end w-full">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-100 dark:bg-zinc-800 text-[var(--text-main)] rounded-2xl rounded-tr-sm px-4.5 py-3 max-w-[75%] shadow-sm font-bold text-sm leading-relaxed whitespace-pre-wrap"
                    >
                      {msg.content}
                    </motion.div>
                  </div>
                ) : (
                  // Assistant Message: flat left-aligned block with avatar
                  <div className="flex gap-4 items-start w-full py-4 border-t border-[var(--border)]/30 first:border-t-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center text-sm shadow-md shrink-0">
                      🤖
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[var(--text-light)] font-black uppercase tracking-wider mb-1">Code Guru</div>
                      <SafeMarkdown className="markdown-prose text-[var(--text-main)] text-sm leading-relaxed" content={msg.content} />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {sending && (
              <div className="flex gap-4 items-start w-full py-4 border-t border-[var(--border)]/30">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center text-sm shadow-md shrink-0">
                  🤖
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[var(--text-light)] font-black uppercase tracking-wider mb-2">Code Guru is thinking</div>
                  <div className="flex items-center gap-1.5 py-1">
                    <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-bounce shrink-0"></div>
                    <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-bounce shrink-0" style={{animationDelay: '0.15s'}}></div>
                    <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-bounce shrink-0" style={{animationDelay: '0.3s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-4 pb-2 bg-[var(--bg-main)] shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }} 
          className="max-w-3xl mx-auto w-full relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Code Guru anything about code, domain choices, career prep..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-full pl-6 pr-14 py-4 text-sm text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-semibold shadow-md"
            disabled={sending}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || sending}
            className={`absolute right-2 top-2 w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
              !input.trim() || sending 
                ? 'bg-transparent text-[var(--text-light)] cursor-not-allowed' 
                : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md shadow-indigo-500/10'
            }`}
          >
            <FiSend size={14} />
          </button>
        </form>
        <p className="text-[9px] text-center text-[var(--text-light)] font-bold mt-3 uppercase tracking-wider">
          Code Guru can make mistakes. Verify important info.
        </p>
      </div>

    </div>
  );
};

export default AiChat;
