import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiClock, FiDollarSign, FiBriefcase, FiCopy, FiCheck } from 'react-icons/fi';
import logoImg from '../assets/logo.png';
import toast from 'react-hot-toast';

const Careers = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    // Force light mode on public pages to prevent dark mode class leakage
    document.documentElement.classList.remove('dark');
    window.scrollTo(0, 0);
  }, []);

  const openPositions = [
    {
      title: "Senior Full Stack Engineer (React/Node)",
      department: "Engineering",
      location: "Remote (Global)",
      type: "Full-Time",
      salary: "$110k - $140k",
      description: "Build next-generation compilers, sandbox sandboxes, dynamic seeder scripts, and gamification frameworks."
    },
    {
      title: "Technical Curriculum Writer (DSA Specialist)",
      department: "Education",
      location: "Remote (APAC/Europe)",
      type: "Contract or Full-Time",
      salary: "$80k - $105k",
      description: "Design comprehensive company-specific roadmap tracks and interactive Striver's A2Z content maps."
    },
    {
      title: "Product Designer (UI/UX)",
      department: "Design",
      location: "Remote (Global)",
      type: "Full-Time",
      salary: "$90k - $120k",
      description: "Perfect our vector-based SVGs, interactive badge progression showcases, and dashboard visual cues."
    },
    {
      title: "AI Research Engineer (LLM Integration)",
      department: "AI & Innovation",
      location: "Remote (Global)",
      type: "Full-Time",
      salary: "$130k - $160k",
      description: "Train and align our conversational AI Code Guru helper to diagnose complex terminal compiling errors."
    }
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("careers@careerforge.dev");
    setCopiedEmail(true);
    toast.success("HR Email copied to clipboard! 🚀", { id: "email-copied" });
    setTimeout(() => setCopiedEmail(false), 3000);
  };

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
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 font-black text-xs mb-6 uppercase tracking-wider border border-orange-100">
            💼 Join the Forge
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            Build the Future of<br />
            <span className="text-[var(--brand-orange)] relative inline-block">
              Tech Careers
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="6" fill="transparent"/></svg>
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-semibold leading-relaxed">
            We are a remote-first, mission-driven team dedicated to helping developers master software engineering concepts through practical, verified gamification.
          </p>
        </div>

        {/* Benefits Grid */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-gray-100 shadow-[var(--shadow-soft)] mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 text-center md:text-left">Why Work With Us?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: "🌍", title: "100% Remote Flexibility", desc: "Work from anywhere in the world. We collaborate asynchronously and value ownership." },
              { icon: "🌱", title: "Learning Allowance", desc: "$2,000 yearly budget for books, courses, conferences, and custom workstation upgrades." },
              { icon: "❤️", title: "Health & Well-being", desc: "Premium mental and physical health plans, plus 25 days of paid annual vacation." }
            ].map((benefit, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-4xl mb-4 bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">{benefit.icon}</span>
                <h4 className="font-black text-gray-950 text-base mb-2">{benefit.title}</h4>
                <p className="text-gray-500 font-bold text-xs leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">Current Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((pos, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 hover:border-[var(--brand-green)] transition-all duration-300 hover:shadow-[var(--shadow-soft)] relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">{pos.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><FiBriefcase /> {pos.department}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1"><FiMapPin /> {pos.location}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1"><FiClock /> {pos.type}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1 text-emerald-600 font-black"><FiDollarSign /> {pos.salary}</span>
                    </div>
                    <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-3xl">
                      {pos.description}
                    </p>
                  </div>
                  <button 
                    onClick={handleCopyEmail}
                    className="px-6 py-3 bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white text-xs font-black uppercase tracking-wider rounded-xl transition duration-200 shadow shrink-0 self-start md:self-center"
                  >
                    Apply Now ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Apply Info */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-lg border border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-black mb-4">Don't see your role?</h2>
          <p className="text-slate-400 font-bold max-w-lg mx-auto mb-8 text-sm leading-relaxed">
            We are always looking for exceptional, self-driven creators. Send your resume and a summary of your best projects directly to our recruiting inbox.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-slate-800/80 border border-slate-700/60 p-2 pl-4 pr-2 rounded-2xl max-w-md w-full justify-between">
            <span className="font-mono text-sm text-slate-300 tracking-wide select-all">careers@careerforge.dev</span>
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all w-full sm:w-auto justify-center"
            >
              {copiedEmail ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
              <span>{copiedEmail ? "Copied!" : "Copy Email"}</span>
            </button>
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

export default Careers;
