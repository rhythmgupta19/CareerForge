import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  FiAward, 
  FiActivity, 
  FiClock, 
  FiCompass, 
  FiTarget, 
  FiTrendingUp, 
  FiZap, 
  FiCalendar, 
  FiBookOpen, 
  FiList 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'weekly' | 'monthly' | 'course'
  const [loading, setLoading] = useState(true);
  const [boardData, setBoardData] = useState([]);
  const [myRankInfo, setMyRankInfo] = useState(null);
  const [myStats, setMyStats] = useState(null);
  const [allBadges, setAllBadges] = useState([]);
  const [activeCourse, setActiveCourse] = useState('');

  const fetchSettingsAndStats = async () => {
    try {
      const [statsRes, settingsRes] = await Promise.all([
        api.get('/leaderboard/me'),
        api.get('/admin/leaderboard/settings') // We fetch the full list of configurable badges
      ]);
      setMyStats(statsRes.data.data);
      setAllBadges(settingsRes.data.data?.badges || []);
    } catch (err) {
      console.error('Failed to load gamification profile:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      let endpoint = `/leaderboard/${activeTab}`;
      if (activeTab === 'course') {
        // If course tab is selected, we use the user's active domain ID or default
        const courseId = myStats?.stats?.courseId || '654321098765432109876543'; // mock fallback or read from stats
        endpoint = `/leaderboard/course/${courseId}`;
      }
      
      const res = await api.get(endpoint);
      setBoardData(res.data.data?.topTen || []);
      setMyRankInfo(res.data.data?.myRankInfo || null);
    } catch (err) {
      console.error('Failed to fetch leaderboard ranks:', err);
      toast.error('Could not retrieve rankings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndStats();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, myStats]);

  const getLevelLabel = (level) => {
    const labels = {
      1: 'Novice Scholar',
      2: 'Dedicated Apprentice',
      3: 'Elite Voyager',
      4: 'Ascendant Master',
      5: 'Grand Architect',
      6: 'Platform Sage'
    };
    return labels[level] || 'Novice Scholar';
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    const hrs = seconds / 3600;
    if (hrs < 0.1) return `${Math.round(seconds / 60)}m`;
    return `${hrs.toFixed(1)}h`;
  };

  // Re-organize podium data
  const podium = [];
  if (boardData.length > 0) podium.push({ ...boardData[0], place: 1 });
  if (boardData.length > 1) podium.push({ ...boardData[1], place: 2 });
  if (boardData.length > 2) podium.push({ ...boardData[2], place: 3 });

  // Order podium as: 2nd, 1st, 3rd for standard visual display
  const orderedPodium = [];
  if (podium.find(p => p.place === 2)) orderedPodium.push(podium.find(p => p.place === 2));
  if (podium.find(p => p.place === 1)) orderedPodium.push(podium.find(p => p.place === 1));
  if (podium.find(p => p.place === 3)) orderedPodium.push(podium.find(p => p.place === 3));

  const listData = boardData.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-fade-in select-text">
      {/* Gamification Header Panel */}
      <div className="p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-3xl shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <FiZap /> Level Progression Console
          </span>
          <h1 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tight">
            Level {myStats?.level || 1} • {getLevelLabel(myStats?.level || 1)}
          </h1>
          <p className="text-[11px] text-[var(--text-muted)] font-semibold max-w-lg">
            Earn points by passing milestone assessments, watching video lectures, solving coding sandbox problems, and maintaining daily login streaks.
          </p>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="w-full lg:w-96 space-y-2 bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
          <div className="flex justify-between text-[10px] font-black text-[var(--text-main)] uppercase">
            <span>Progress to Level {Math.min(6, (myStats?.level || 1) + 1)}</span>
            <span className="text-indigo-400">{myStats?.progressPercent || 0}%</span>
          </div>
          <div className="w-full bg-[var(--bg-sub)] rounded-full h-3 border border-[var(--border)] overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${myStats?.progressPercent || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-bold">
            <span>{myStats?.points || 0} Points Accumulated</span>
            <span>{myStats?.pointsRemaining || 0} XP Required</span>
          </div>
        </div>
      </div>

      {/* Gamified stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">Total Experience</span>
            <FiAward className="text-indigo-400" size={14} />
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] mt-3 leading-none">{myStats?.points || 0} <span className="text-[9px] text-[var(--text-muted)] uppercase">XP</span></div>
          <span className="text-[8px] text-[var(--text-muted)] font-semibold mt-1">Platform-wide points</span>
        </div>

        <div className="p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">Active Streak</span>
            <FiZap className="text-amber-500" size={14} />
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] mt-3 leading-none">🔥 {myStats?.stats?.loginStreak || 0}</div>
          <span className="text-[8px] text-[var(--text-muted)] font-semibold mt-1">Consecutive logins streak</span>
        </div>

        <div className="p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">Coding Sandbox Solves</span>
            <FiTarget className="text-emerald-500" size={14} />
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] mt-3 leading-none">{myStats?.stats?.codingProblemsSolved || 0}</div>
          <span className="text-[8px] text-[var(--text-muted)] font-semibold mt-1">Sandbox exercises completed</span>
        </div>

        <div className="p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">Total Time Invested</span>
            <FiClock className="text-teal-500" size={14} />
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] mt-3 leading-none">{formatTime(myStats?.stats?.totalStudyTime || 0)}</div>
          <span className="text-[8px] text-[var(--text-muted)] font-semibold mt-1">Active study minutes logged</span>
        </div>
      </div>

      {/* Badges Cabinet */}
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm space-y-4">
        <div>
          <h2 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">Achievements Locker</h2>
          <p className="text-[9px] text-[var(--text-muted)] font-semibold">Track your unlocked credentials and specialized badges</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {allBadges.map((badge) => {
            const isUnlocked = myStats?.badges?.includes(badge.key);
            return (
              <div 
                key={badge.key}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20 shadow-sm opacity-100' 
                    : 'bg-[var(--bg-sub)] border-[var(--border)] opacity-40 grayscale'
                }`}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <div className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-wide truncate">{badge.name}</div>
                <div className="text-[8px] text-[var(--text-muted)] font-semibold leading-tight mt-1 line-clamp-2">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard layout switcher */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Leaderboard Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest">Coaching Leaderboard</h2>
              <p className="text-[9px] text-[var(--text-muted)] font-semibold">Real-time learning stats rankings</p>
            </div>
            
            {/* Tab Swappers */}
            <div className="flex bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl p-1 gap-1">
              {['global', 'weekly', 'monthly', 'course'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                    activeTab === tab 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-[var(--text-light)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-wider">Syncing rankings cache...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Podium View for Top 3 */}
              {orderedPodium.length > 0 && (
                <div className="grid grid-cols-3 gap-3 items-end pt-10 pb-6 max-w-xl mx-auto">
                  {orderedPodium.map((student) => {
                    const placeColors = {
                      1: { from: 'from-amber-500/20', to: 'to-amber-500/5', border: 'border-amber-500/35', text: 'text-amber-500', height: 'h-48' },
                      2: { from: 'from-slate-400/20', to: 'to-slate-400/5', border: 'border-slate-400/35', text: 'text-slate-400', height: 'h-40' },
                      3: { from: 'from-amber-700/20', to: 'to-amber-700/5', border: 'border-amber-700/35', text: 'text-amber-700', height: 'h-36' }
                    };
                    const color = placeColors[student.place];
                    return (
                      <div key={student._id} className="flex flex-col items-center">
                        <div className="relative mb-2">
                          <div className="w-12 h-12 rounded-full border-2 border-indigo-500 overflow-hidden bg-indigo-50 flex items-center justify-center font-bold text-xs">
                            {student.userId?.avatar ? (
                              <img src={student.userId.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              student.fullName?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-lg font-black ${color.text}`}>
                            {student.place === 1 ? '👑' : student.place === 2 ? '🥈' : '🥉'}
                          </span>
                        </div>
                        <div className="text-center mb-1">
                          <div className="text-[10px] font-black text-[var(--text-main)] truncate max-w-[80px]">{student.fullName}</div>
                          <div className="text-[8px] text-indigo-400 font-bold leading-none mt-0.5">{student.points} XP</div>
                        </div>
                        {/* Podium pedestal */}
                        <div className={`w-full bg-gradient-to-t ${color.from} ${color.to} border-t-2 ${color.border} rounded-t-xl ${color.height} flex flex-col justify-end items-center pb-4`}>
                          <span className={`text-xl font-black ${color.text}`}>#{student.place}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table list view for top 10 */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs font-semibold text-[var(--text-main)]">
                    <thead>
                      <tr className="bg-[var(--bg-sub)] border-b border-[var(--border)] text-[9px] font-black text-[var(--text-light)] uppercase tracking-widest">
                        <th className="px-5 py-3">Rank</th>
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Level</th>
                        <th className="px-5 py-3">Study Time</th>
                        <th className="px-5 py-3">Login Streak</th>
                        <th className="px-5 py-3 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {listData.length === 0 && boardData.length <= 3 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-[var(--text-muted)] italic font-semibold">No other active student rankings registered</td>
                        </tr>
                      ) : (
                        listData.map((student, idx) => (
                          <tr key={student._id} className="hover:bg-[var(--bg-sub)]/35 transition-colors">
                            <td className="px-5 py-3.5 font-black text-[var(--text-light)]">#{idx + 4}</td>
                            <td className="px-5 py-3.5 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold text-xs border border-[var(--border)] shrink-0">
                                {student.fullName?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-[var(--text-main)]">{student.fullName}</div>
                                <div className="text-[9px] text-[var(--text-muted)] leading-none mt-0.5">{student.courseId?.name || 'DevOps Path'}</div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5"><span className="px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] text-[9px] font-black uppercase">LVL {student.level}</span></td>
                            <td className="px-5 py-3.5 font-medium text-[var(--text-light)]">{formatTime(student.totalStudyTime)}</td>
                            <td className="px-5 py-3.5 font-bold text-amber-500">🔥 {student.loginStreak}</td>
                            <td className="px-5 py-3.5 text-right text-emerald-500 font-bold">{student.points} XP</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Own User Rank Banner if outside top 10 */}
              {myRankInfo && myRankInfo.rank > 10 && (
                <div className="p-4 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/25 rounded-2xl flex items-center justify-between shadow-sm animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                      #{myRankInfo.rank}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wide">Your Ranking Standing</h4>
                      <p className="text-[9px] text-[var(--text-muted)] font-semibold">Keep studying and passing assessments to rise on the leaderboard!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-indigo-500">{myRankInfo.points} XP</div>
                    <span className="text-[9px] text-[var(--text-muted)] font-semibold uppercase">Level {myRankInfo.level}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
              <FiTarget className="text-indigo-400" /> Point Rules Cabinet
            </h3>
            <div className="space-y-3.5 text-[11px] font-semibold text-[var(--text-light)]">
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span>Daily Logins</span>
                <span className="text-emerald-500 font-bold">+5 XP</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span>Complete Video Lectures</span>
                <span className="text-emerald-500 font-bold">+10 XP</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span>Complete Roadmap Modules</span>
                <span className="text-emerald-500 font-bold">+25 XP</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span>Pass Assessment Test</span>
                <span className="text-emerald-500 font-bold">+30 XP</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span>Excellent Score (90%+)</span>
                <span className="text-emerald-500 font-bold">+50 XP</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span>Solve coding playgrounds</span>
                <span className="text-emerald-500 font-bold">+15 XP</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Maintain Daily login streak</span>
                <span className="text-emerald-500 font-bold">+10 XP/day</span>
              </div>
            </div>
          </div>

          {/* Gamification tips */}
          <div className="bg-indigo-600 text-white rounded-3xl p-6 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <FiCompass /> Voyager Tip
            </h3>
            <p className="text-[10px] text-indigo-100 font-medium leading-relaxed">
              Consistently logging in every day triggers the Daily Streak bonus multiplier. Make learning a habit to rise on the leaderboard faster!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
