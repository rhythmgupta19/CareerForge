import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiAward, FiExternalLink, FiLock, FiCheckCircle, FiXCircle, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Assessments = () => {
  const { user, refreshUser } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingScore, setSubmittingScore] = useState(null);

  useEffect(() => {
    if (user?.selectedDomain) {
      fetchAssessments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAssessments = async () => {
    try {
      const res = await api.get(`/assessments/domain/${user.selectedDomain._id || user.selectedDomain}`);
      setAssessments(res.data.data);
    } catch (err) {
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePass = async (assessment) => {
    setSubmittingScore(assessment._id);
    try {
      const score = Math.floor(Math.random() * (100 - assessment.passingScore + 1)) + assessment.passingScore;
      
      await api.post('/progress/submit-assessment', {
        assessmentId: assessment._id,
        score,
        passed: true
      });
      
      await refreshUser();
      toast.success(`Passed! Score: ${score}% 🎉`);
    } catch (err) {
      toast.error('Failed to submit result');
    } finally {
      setSubmittingScore(null);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><div className="spinner"></div></div>;
  if (!user.selectedDomain) return <div className="text-center py-24 text-[#4b5563] font-medium">Please select a domain to view assessments.</div>;

  return (
    <div className="fade-in max-w-7xl mx-auto py-10 px-6 lg:px-8">
      <div className="mb-12">
        <div className="badge badge-blue mb-4 py-1.5 px-4 font-bold">Skill Validation</div>
        <h1 className="text-4xl font-extrabold text-[#1a1a1a] tracking-tight mb-4 flex items-center gap-4">
          Certifications & Tests
        </h1>
        <p className="text-[#4b5563] text-lg font-medium max-w-2xl">
          Validate your technical skills through platform-vetted assessments and earn badges to verify your mastery.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {assessments.map((assessment) => {
          const phaseNum = assessment.phaseId?.phaseNumber || assessment.order;
          const isUnlocked = user.currentPhase >= phaseNum;
          const result = user.testResults?.find(t => t.assessmentId === assessment._id || t.assessmentId?._id === assessment._id);
          const isPassed = result?.passed;

          return (
            <div key={assessment._id} className={`card p-8 relative overflow-hidden transition-all bg-white border-soft ${
              isPassed ? 'ring-1 ring-emerald-100 shadow-md' : 
              !isUnlocked ? 'opacity-70 grayscale bg-[#fafafa]' : 'hover:border-blue-200'
            }`}>
              {isPassed && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                  <FiCheckCircle className="text-sm" /> Passed: {result.score}%
                </div>
              )}
              
              {!isUnlocked && !isPassed && (
                <div className="absolute top-0 right-0 bg-[#f3f4f6] text-[#9ca3af] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                  <FiLock className="text-sm" /> Locked Phase {phaseNum}
                </div>
              )}

              <div className="flex items-start gap-5 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                  isPassed ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                  'bg-blue-50 border-blue-100 text-[#2563eb]'
                }`}>
                  {assessment.platform === 'HackerRank' ? 'H' : <FiAward />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight mb-2 line-clamp-1">{assessment.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="badge badge-gray bg-[#f3f4f6] text-[#374151] py-0.5 px-2.5 font-bold text-[10px] uppercase tracking-wider">{assessment.platform}</div>
                    <div className="badge badge-blue py-0.5 px-2.5 font-bold text-[10px] uppercase tracking-wider">{assessment.difficultyRating}</div>
                    <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest flex items-center ml-1">Req: {assessment.passingScore}%</div>
                  </div>
                </div>
              </div>
              
              <p className="text-[#4b5563] text-sm leading-relaxed mb-8 h-12 line-clamp-2">
                {assessment.description || `Complete this comprehensive assessment to validate your mastery of Phase ${phaseNum} concepts.`}
              </p>

              <div className="flex items-center gap-3 mt-auto pt-6 border-t border-[#f3f4f6]">
                {isPassed ? (
                  <button disabled className="w-full py-3 rounded-xl font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-default flex items-center justify-center gap-2">
                    Verified Mastery <FiCheckCircle />
                  </button>
                ) : isUnlocked ? (
                  <>
                    <a 
                      href={assessment.assessmentLink === 'ADMIN_WILL_ADD_HACKERRANK_ASSESSMENT_LINK' ? 'https://www.hackerrank.com/skills-verification' : assessment.assessmentLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary flex-1 py-3 text-sm font-bold shadow-sm"
                    >
                      Take Assessment <FiExternalLink className="ml-1" />
                    </a>
                    <button 
                      onClick={() => handleSimulatePass(assessment)}
                      disabled={submittingScore === assessment._id}
                      className="btn-secondary py-3 px-4 text-[10px] font-black uppercase tracking-widest border-[#e5e7eb] hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
                      title="For MVP demo: Simulate passing score"
                    >
                      {submittingScore === assessment._id ? '...' : 'Dev: Pass'}
                    </button>
                  </>
                ) : (
                  <button disabled className="w-full py-3 rounded-xl font-bold bg-[#f9fafb] text-[#9ca3af] border border-[#e5e7eb] cursor-not-allowed flex items-center justify-center gap-2">
                    Unlock Phase {phaseNum} <FiLock className="text-sm" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Institute Certification Section */}
      <div className="mt-20 border-t border-gray-100 pt-12">
        <div className="badge badge-blue mb-4 py-1.5 px-4 font-bold">Official Credential</div>
        <h2 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight mb-8">CareerForge Institute Certificate</h2>
        
        <div className={`card p-1 bg-gradient-to-br from-blue-600 to-indigo-900 border-none relative overflow-hidden ${user.currentPhase < 9 ? 'opacity-75 grayscale' : ''}`}>
           <div className="bg-white rounded-[1.25rem] p-8 md:p-12 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
               <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center p-6 group">
                  {user.currentPhase >= 9 ? (
                    <>
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
                        <FiAward />
                      </div>
                      <span className="text-xs font-black text-[#1a1a1a] uppercase tracking-widest">Certificate Ready</span>
                    </>
                  ) : (
                    <>
                      <FiLock className="text-4xl text-gray-300 mb-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Locked until Phase 9 completion</span>
                    </>
                  )}
               </div>

               <div className="flex-1 text-center md:text-left">
                 <h3 className="text-2xl md:text-3xl font-black text-[#1a1a1a] mb-4 tracking-tight">
                   {user.selectedDomain?.name} Professional Excellence Certificate
                 </h3>
                 <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-xl">
                   This official credential verifies that you have successfully completed all technical phases, assignments, and assessments within the {user.selectedDomain?.name} domain.
                 </p>
                 
                 {user.currentPhase >= 9 ? (
                   <button className="btn-primary px-10 py-4 text-lg shadow-xl shadow-blue-100">
                     View & Download Certificate <FiExternalLink className="ml-2" />
                   </button>
                 ) : (
                   <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 font-bold text-sm">
                     <FiLock /> Complete all phases to unlock
                   </div>
                 )}
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Assessments;
