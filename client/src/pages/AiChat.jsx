import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiTrash2, FiUser, FiCpu, FiMessageSquare, FiInfo, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import aiLogo from '../assets/ai-logo.png';

const AiChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/history');
      if (res.data.data.length === 0) {
        setMessages([{
          _id: 'initial',
          role: 'assistant',
          content: `Hi ${user.fullName.split(' ')[0]}! 👋 I'm your CareerForge AI Mentor.\n\nI see you're interested in **${user.selectedDomain?.name || 'exploring tech careers'}**. I can help you with:\n- Career roadmaps and next steps\n- Explaining complex technical concepts\n- Project ideas and interview prep\n- Study plans\n\nHow can I help you today?`
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    
    const newMsg = { _id: Date.now(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMsg]);
    setSending(true);

    try {
      const res = await api.post('/ai/chat', { message: userMessage });
      setMessages(prev => [...prev, { _id: Date.now() + 1, role: 'assistant', content: res.data.data.message }]);
    } catch (err) {
      toast.error('Failed to get response');
      setMessages(prev => prev.filter(m => m._id !== newMsg._id));
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear chat history?')) return;
    try {
      await api.delete('/ai/history');
      setMessages([{
        _id: 'initial',
        role: 'assistant',
        content: "Chat history cleared. How can I help you today?"
      }]);
      toast.success('Chat history cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  const commonQuestions = [
    "What should be my next step?",
    "How to prepare for interviews?",
    "Suggest a good project idea",
    "Explain React hooks clearly"
  ];

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-primary/10">
            <img src={aiLogo} alt="AI Mentor Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1a1a1a] tracking-tight">AI Mentor</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active System</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleClear} 
          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Clear History"
        >
          <FiTrash2 size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto py-8 space-y-8 custom-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden flex items-center justify-center text-xl shadow-sm ${
                msg.role === 'user' ? 'bg-white border-2 border-gray-100 text-[#1a1a1a]' : 'bg-white shadow-lg shadow-primary/10'
              }`}>
                {msg.role === 'user' ? <FiUser /> : <img src={aiLogo} alt="AI" className="w-full h-full object-contain p-2" />}
              </div>
              
              <div className={`max-w-[85%] md:max-w-[75%] space-y-2 ${msg.role === 'user' ? 'items-end text-right' : ''}`}>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  {msg.role === 'user' ? 'You' : 'CareerForge AI'}
                </div>
                <div className={`p-5 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white shadow-xl shadow-primary/10 rounded-tr-none font-medium' 
                    : 'bg-white border-2 border-gray-50 text-[#1a1a1a] shadow-sm rounded-tl-none'
                }`}>
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:font-black prose-headings:text-[#1a1a1a] prose-strong:text-primary">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-6"
          >
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-primary/10">
              <img src={aiLogo} alt="AI" className="w-full h-full object-contain p-2" />
            </div>
            <div className="bg-white border-2 border-gray-50 p-6 rounded-3xl rounded-tl-none shadow-sm flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area Container */}
      <div className="pb-8 pt-4">
        {/* Suggested Actions */}
        {messages.length <= 2 && !sending && (
          <div className="flex flex-wrap gap-2 mb-6">
            {commonQuestions.map((q, i) => (
              <button 
                key={i} 
                onClick={() => setInput(q)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-100 hover:border-primary/30 hover:bg-primary/5 text-xs font-bold text-gray-500 hover:text-primary rounded-full transition-all"
              >
                <FiPlus className="text-gray-300" /> {q}
              </button>
            ))}
          </div>
        )}

        {/* Real Input */}
        <form 
          onSubmit={handleSend} 
          className="relative bg-white border-2 border-gray-100 rounded-[2rem] p-2 focus-within:border-primary/30 focus-within:shadow-2xl focus-within:shadow-primary/5 transition-all"
        >
          <div className="flex items-center">
            <div className="flex-1 px-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message your AI Mentor..."
                className="w-full py-4 text-sm font-medium text-[#1a1a1a] placeholder-gray-400 focus:outline-none bg-transparent"
                disabled={sending}
              />
            </div>
            <button 
              type="submit" 
              disabled={!input.trim() || sending}
              className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all ${
                !input.trim() || sending 
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                  : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95'
              }`}
            >
              <FiSend size={24} />
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
           <FiInfo className="text-primary" /> CareerForge AI can make mistakes. Verify important information.
        </div>
      </div>
    </div>
  );
};

export default AiChat;
