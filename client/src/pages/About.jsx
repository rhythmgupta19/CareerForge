import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiTarget, FiUsers, FiCpu, FiAward } from 'react-icons/fi';
import logoImg from '../assets/logo.png';

const About = () => {
  useEffect(() => {
    // Force light mode on public pages to prevent dark mode class leakage
    document.documentElement.classList.remove('dark');
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: <FiTarget className="text-emerald-500 text-2xl" />,
      title: "Action-Oriented Learning",
      description: "We bypass passive video lecture fatigue. CareerForge is built on sandbox execution, dry runs, and active code compilation."
    },
    {
      icon: <FiCpu className="text-orange-500 text-2xl" />,
      title: "AI Personalization",
      description: "Our integrated Code Guru and adaptive seeder engine analyzes your level to design roadmaps fit for your speed."
    },
    {
      icon: <FiUsers className="text-blue-500 text-2xl" />,
      title: "Community First",
      description: "Learning is social. Track daily streaks, challenge peers, and share badges that showcase your genuine talent."
    },
    {
      icon: <FiAward className="text-purple-500 text-2xl" />,
      title: "Verified Credentials",
      description: "Every learning milestone rewards collectible domain-specific badges structured with distinct vector rarities."
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

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs mb-6 uppercase tracking-wider border border-emerald-100">
            🌱 Who We Are
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            Forging the Future of<br />
            <span className="text-[var(--brand-green)] relative inline-block">
              Tech Education
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="6" fill="transparent"/></svg>
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-semibold leading-relaxed">
            CareerForge is an interactive, gamified career acceleration platform designed to transition developers from initiates to tech domain experts.
          </p>
        </div>

        {/* Brand Mission Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-gray-100 shadow-[var(--shadow-soft)] mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-green-light)] rounded-full blur-[60px] opacity-40 pointer-events-none"></div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Our Core Mission</h2>
              <p className="text-gray-600 font-semibold leading-relaxed mb-6">
                Most educational hubs rely on passive listening. We believe that true engineering excellence is forged through practice. We offer curriculum structures based on real-world expectations, instant feedback sandbox execution, and continuous personalized advice.
              </p>
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-3xl">🎯</span>
                <div>
                  <h4 className="font-extrabold text-emerald-900 text-sm">Empowerment over Memorization</h4>
                  <p className="text-xs text-emerald-700 font-bold mt-0.5">We track and build genuine capability ready for live technical challenges.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 font-mono text-xs text-gray-600 relative">
              <div className="text-emerald-600 font-bold mb-2">// CareerForge Core Philosophy</div>
              <div className="space-y-1">
                <p><span className="text-purple-600">const</span> mission = <span className="text-amber-600">"Accelerate Careers"</span>;</p>
                <p><span className="text-purple-600">const</span> methodology = <span className="text-amber-600">"Interactive & Gamified"</span>;</p>
                <p><span className="text-purple-600">const</span> success = () =&gt; {'{'}</p>
                <p className="pl-4 text-gray-400">return learning.byDoing() && consistency.dailyStreak();</p>
                <p>{'}'};</p>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center text-[10px] font-sans font-bold text-gray-400">
                <span>VERIFIED ALGORITHM</span>
                <span className="text-emerald-500">ACTIVE 🟢</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10">How We Stand Apart</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-[var(--brand-green)] transition-all duration-300 hover:shadow-[var(--shadow-soft)] hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shadow-inner mb-5">
                  {val.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{val.title}</h3>
                <p className="text-gray-500 font-bold text-sm leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Callout */}
        <section className="bg-gradient-to-r from-[var(--brand-green)] to-emerald-600 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
          <h2 className="text-3xl font-black mb-4">Ready to Start Forging?</h2>
          <p className="text-emerald-100 font-bold max-w-md mx-auto mb-8 text-sm sm:text-base">
            Create your free account, pick your target domain, and unlock your customized roadmap with an AI code mentor today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="px-8 py-4 bg-white text-[var(--brand-green)] font-black rounded-xl hover:bg-emerald-50 transition-all hover:scale-105 shadow-md">
              Sign Up For Free
            </Link>
            <Link to="/login" className="px-8 py-4 bg-transparent border-2 border-white/80 hover:border-white text-white font-black rounded-xl hover:bg-white/10 transition-all">
              Sign In
            </Link>
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

export default About;
