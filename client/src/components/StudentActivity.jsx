import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { FiClock, FiActivity, FiLogOut, FiPlay, FiAward, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentActivity() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/activity/summary');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load activity summary:', err);
        toast.error('Unable to retrieve activity logs');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-[var(--bg-sub)] w-1/4 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-[var(--bg-sub)] rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Formatting helpers
  const formatHours = (seconds) => {
    const hrs = seconds / 3600;
    if (hrs < 0.1) {
      return `${Math.round(seconds / 60)}m`;
    }
    return `${hrs.toFixed(1)}h`;
  };

  const cards = [
    {
      title: 'Platform Hours',
      value: formatHours(stats.totalTimeSpentInSeconds || 0),
      icon: <FiClock className="text-blue-500" />,
      bg: 'from-blue-500/10 to-indigo-500/5',
      border: 'border-blue-500/20'
    },
    {
      title: 'Learning Streak',
      value: `${stats.currentLoginStreak || 0} Days`,
      icon: <FiActivity className="text-amber-500 animate-pulse" />,
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-500/20'
    },
    {
      title: 'Total Logins',
      value: stats.totalLoginCount || 0,
      icon: <FiLogOut className="text-emerald-500" />,
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Videos Watched',
      value: stats.totalVideosWatched || 0,
      icon: <FiPlay className="text-purple-500" />,
      bg: 'from-purple-500/10 to-pink-500/5',
      border: 'border-purple-500/20'
    },
    {
      title: 'Assessments Attempted',
      value: stats.totalAssessmentsAttempted || 0,
      icon: <FiAward className="text-rose-500" />,
      bg: 'from-rose-500/10 to-red-500/5',
      border: 'border-rose-500/20'
    }
  ];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div>
          <h2 className="text-sm font-black text-[var(--text-main)] uppercase tracking-wider">My Learning Activity</h2>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">Real-time statistics of your CareerForge timeline.</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
          <FiCalendar size={12} /> Active Now
        </div>
      </div>

      {/* Main KPI metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c, idx) => (
          <div 
            key={idx} 
            className={`p-4 bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl flex flex-col justify-between transition-all hover:scale-102 hover:shadow-md duration-300`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">{c.title}</span>
              <div className="w-7 h-7 rounded-lg bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border)] shadow-sm text-sm shrink-0">
                {c.icon}
              </div>
            </div>
            <div className="text-lg font-black text-[var(--text-main)] mt-3 leading-none">{c.value}</div>
          </div>
        ))}
      </div>

      {/* Weekly & Monthly breakdowns */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[var(--bg-sub)] rounded-2xl border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-widest">This Week's Effort</span>
            <span className="text-xs font-black text-blue-500">{formatHours(stats.timeSpentThisWeek || 0)}</span>
          </div>
          <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border)]">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, ((stats.timeSpentThisWeek || 0) / 36000) * 100)}%` }} // Target: 10 hours per week
            />
          </div>
          <p className="text-[9px] text-[var(--text-muted)] font-semibold">Weekly Target: 10 Hours platform time.</p>
        </div>

        <div className="p-4 bg-[var(--bg-sub)] rounded-2xl border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-widest">This Month's Effort</span>
            <span className="text-xs font-black text-emerald-500">{formatHours(stats.timeSpentThisMonth || 0)}</span>
          </div>
          <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border)]">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, ((stats.timeSpentThisMonth || 0) / 144000) * 100)}%` }} // Target: 40 hours per month
            />
          </div>
          <p className="text-[9px] text-[var(--text-muted)] font-semibold">Monthly Target: 40 Hours platform time.</p>
        </div>
      </div>
    </div>
  );
}
