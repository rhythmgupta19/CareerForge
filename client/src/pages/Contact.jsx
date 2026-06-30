import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiMessageSquare, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import logoImg from '../assets/logo.png';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    // Force light mode on public pages to prevent dark mode class leakage
    document.documentElement.classList.remove('dark');
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return toast.error("Please fill out all required fields.");
    }

    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Message sent successfully! 🚀", { id: 'contact-success' });
    }, 1500);
  };

  const faqs = [
    {
      q: "Is CareerForge really free?",
      a: "Yes! CareerForge is completely free. You can study DSA roadmaps, complete full-stack web development tracks, compile code, earn vector badges, and interact with the AI Code Guru mentor without any charges."
    },
    {
      q: "How does the AI Code Guru work?",
      a: "Our Code Guru is trained to diagnose compilation failures, analyze algorithmic time complexity, and give hints in Hinglish or English. It analyzes your active code sandbox to guide you toward solutions without giving direct answers."
    },
    {
      q: "Can I learn if I am a complete beginner?",
      a: "Absolutely! We have a 'Zero to Coding' track customized exactly for beginners, which teaches fundamental building blocks, logical loops, and problem solving before diving into core technical roadmaps."
    },
    {
      q: "How do I claim my certificates or badges?",
      a: "Badges are unlocked dynamically as you progress. Completing roadmaps, maintaining daily streaks, and solving challenges will automatically unlock badges (Common, Uncommon, Rare, Epic, Legendary) in your dashboard profile."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0FBFE] flex flex-col font-sans text-gray-800" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Navbar */}
      <nav className="px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-2 group outline-none">
            <img src={logoImg} alt="CareerForge Logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform shrink-0 object-cover" />
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight"><span className="text-logo-gradient">CareerForge</span></h1>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-extrabold text-gray-600 hover:text-[var(--brand-green)] transition-all">
            <FiArrowLeft strokeWidth={2.5} /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-black text-xs mb-6 uppercase tracking-wider border border-blue-100">
            💬 Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            Contact Support & Teams
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-semibold leading-relaxed">
            Have questions, feedback, or custom business inquiries? Drop us a line and our hub support will resolve it.
          </p>
        </div>

        {/* Form and Contact details Row */}
        <div className="grid md:grid-cols-5 gap-8 items-start mb-20">
          {/* Left Details cards (col-span-2) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[var(--shadow-soft)] flex items-start gap-4">
              <span className="text-3xl bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-500 shadow-inner shrink-0">
                <FiMail />
              </span>
              <div>
                <h4 className="font-black text-gray-950 text-base mb-1">Email Recipient</h4>
                <p className="text-xs text-gray-500 font-bold leading-relaxed mb-2">General inquiries & support:</p>
                <a href="mailto:support@careerforge.dev" className="text-sm font-extrabold text-[var(--brand-green)] hover:underline">support@careerforge.dev</a>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[var(--shadow-soft)] flex items-start gap-4">
              <span className="text-3xl bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center text-orange-500 shadow-inner shrink-0">
                <FiMessageSquare />
              </span>
              <div>
                <h4 className="font-black text-gray-950 text-base mb-1">Response Guarantee</h4>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                  Our team reads and processes every message. We guarantee a response to your inquiries within 24 working hours.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[var(--shadow-soft)] flex items-start gap-4">
              <span className="text-3xl bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center text-purple-500 shadow-inner shrink-0">
                <FiMapPin />
              </span>
              <div>
                <h4 className="font-black text-gray-950 text-base mb-1">Location hub</h4>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                  CareerForge is built by a distributed network of remote software engineers. Our administrative hub coordinates from Bangalore, India.
                </p>
              </div>
            </div>
          </div>

          {/* Right Form Container (col-span-3) */}
          <div className="md:col-span-3 bg-white rounded-3xl p-8 sm:p-10 border-2 border-gray-100 shadow-[var(--shadow-soft)] relative overflow-hidden">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-6 animate-fade-in">
                <div className="text-6xl text-emerald-500 flex justify-center">
                  <FiCheckCircle strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Thank you, {formData.name}!</h3>
                <p className="text-gray-500 font-bold text-sm max-w-sm mx-auto leading-relaxed">
                  Your message regarding "{formData.subject}" has been delivered successfully. Check your inbox at <span className="text-gray-900 font-extrabold">{formData.email}</span> for updates soon.
                </p>
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black uppercase tracking-wider rounded-xl transition duration-200"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Your Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Subject *</label>
                  <input 
                    type="text" 
                    name="subject" 
                    required 
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="General Question / Technical Issue"
                    className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Detailed Message *</label>
                  <textarea 
                    name="message" 
                    required 
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe how we can help you..."
                    className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all text-sm font-semibold resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-[var(--shadow-bubbly)] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Send Message <FiSend /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden transition-all shadow-sm">
                  <button 
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left font-black text-gray-900 text-sm sm:text-base hover:bg-gray-50/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-gray-400 font-extrabold ml-4 shrink-0">{isExpanded ? "▲" : "▼"}</span>
                  </button>
                  {isExpanded && (
                    <div className="p-5 pt-0 text-gray-500 font-semibold text-xs sm:text-sm border-t border-gray-100/50 bg-[#F8FAFC]/50 leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1E293B] text-white py-12 px-6 mt-16 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="CareerForge Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-lg font-black tracking-tight"><span className="text-logo-gradient">CareerForge</span></span>
          </div>
          <div className="flex flex-wrap gap-6 text-gray-400 font-bold text-sm">
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
