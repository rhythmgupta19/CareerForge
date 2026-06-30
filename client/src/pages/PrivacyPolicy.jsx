import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiDatabase, FiLock, FiCpu } from 'react-icons/fi';
import logoImg from '../assets/logo.png';

const PrivacyPolicy = () => {
  useEffect(() => {
    // Force light mode on public pages to prevent dark mode class leakage
    document.documentElement.classList.remove('dark');
    window.scrollTo(0, 0);
  }, []);

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
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-black text-xs mb-6 uppercase tracking-wider border border-blue-100">
            🔒 Trust & Security
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm font-bold leading-relaxed">
            Last Updated: June 12, 2026. Review how CareerForge handles user data.
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 bg-white rounded-3xl p-8 sm:p-12 border-2 border-gray-100 shadow-[var(--shadow-soft)]">
          
          {/* Introduction */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-3 flex items-center gap-2">
              <FiShield className="text-[var(--primary)]" /> Introduction
            </h2>
            <p className="text-gray-600 font-semibold text-sm leading-relaxed">
              At CareerForge, we respect your privacy and are committed to protecting the information you share with us. This Privacy Policy details exactly which information we collect, how it is stored, how it is processed to power your learning experience, and your rights regarding this data.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Data We Collect */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-4 flex items-center gap-2">
              <FiDatabase className="text-[var(--brand-orange)]" /> What Data We Collect
            </h2>
            <p className="text-gray-600 font-semibold text-sm leading-relaxed mb-4">
              To operate the interactive sandboxes, personalized roadmaps, streaking system, and AI Code Guru, we process the following information:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "1. Account Credentials & Profiles",
                  detail: "Your full name, email address, password hashes (secured with industry-standard bcrypt), onboarding configuration selections (preferred language, daily practice intensity, comfortable English setting), and theme choices."
                },
                {
                  title: "2. Gamification & Progression Metrics",
                  detail: "Total Experience Points (XP), current phase level progress, active domain selections, streak counters (daily consecutive logins), completed milestones, and earned vector achievements/badges."
                },
                {
                  title: "3. Coding Submissions & sandbox activity",
                  detail: "Source code compilation logs, practice checkpoint completions, and code written within Monaco editors. We also track checklist completions for external coding challenges (such as Striver's A2Z sheet) stored locally on your device via browser local storage (under 'a2z_cp_done')."
                },
                {
                  title: "4. AI Mentor Chat History",
                  detail: "Transcripts of chats with our conversational Code Guru mentor. These transcripts are analyzed to provide tailored debugging suggestions, hints, and explanations without disclosing personal metrics."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                  <h4 className="font-black text-gray-950 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* How We Use Your Data */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-3 flex items-center gap-2">
              <FiCpu className="text-purple-500" /> How We Use Your Data
            </h2>
            <p className="text-gray-600 font-semibold text-sm leading-relaxed mb-4">
              CareerForge uses your data strictly to facilitate, customize, and gamify your educational roadmap:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-xs font-bold text-gray-500 leading-relaxed">
              <li>To customize your learning timeline and adjust level recommendations using our AI seeder algorithms.</li>
              <li>To display progress logs, unlocked badges, and daily streaks on the dashboard.</li>
              <li>To compile code, validate test cases, and record accepted answers in the database.</li>
              <li>To maintain authorization sessions and prevent credential leakage.</li>
              <li>To diagnose technical editor errors and continuously optimize app performance.</li>
            </ul>
          </div>

          <hr className="border-gray-100" />

          {/* Security & Storage */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-3 flex items-center gap-2">
              <FiLock className="text-blue-500" /> Storage & Security
            </h2>
            <p className="text-gray-600 font-semibold text-sm leading-relaxed">
              Your data is stored securely in encrypted databases. We do not sell, trade, or distribute your personal details to advertising agencies or outside third parties. Your account password is encrypted before writing to our MongoDB servers, and all communications are encrypted under secure HTTP (SSL) connections.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Contact */}
          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <h3 className="font-black text-blue-900 text-sm mb-2">Questions or Data Requests?</h3>
            <p className="text-xs text-blue-700 font-bold leading-relaxed">
              If you have any questions regarding your information, or if you would like to request a deletion of your account and related learning progress logs, please email our security officer at <a href="mailto:privacy@careerforge.dev" className="underline font-black hover:text-[var(--brand-green)]">privacy@careerforge.dev</a>.
            </p>
          </div>

        </div>
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

export default PrivacyPolicy;
