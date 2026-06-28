import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { 
  FiSettings, 
  FiRefreshCw, 
  FiAlertTriangle, 
  FiDownload, 
  FiToggleLeft, 
  FiToggleRight, 
  FiSave, 
  FiCheckCircle 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LeaderboardManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pointRules, setPointRules] = useState({
    dailyLogin: 5,
    completeVideo: 10,
    completeModule: 25,
    passAssessment: 30,
    score90PlusBonus: 50,
    submitAssignment: 20,
    solveCodingProblem: 15,
    dailyStreakBonus: 10,
    perfectAttendance: 50
  });
  const [badges, setBadges] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, usersRes, globalRes] = await Promise.all([
        api.get('/leaderboard/admin/settings'),
        api.get('/admin/activity/users'),
        api.get('/leaderboard/global')
      ]);

      if (settingsRes.data.data) {
        setPointRules(settingsRes.data.data.pointSystem || {});
        setBadges(settingsRes.data.data.badges || []);
      }

      // Filter at risk students: last active more than 7 days ago, or never logged in
      const allUsers = usersRes.data.data || [];
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const atRisk = allUsers.filter(u => {
        if (!u.lastActive) return true; // never active
        return new Date(u.lastActive).getTime() < sevenDaysAgo;
      });
      setAtRiskStudents(atRisk);

      // Save global ranks data for CSV export
      setLeaderboardData(globalRes.data.data?.topTen || []);
    } catch (err) {
      console.error('Failed to load admin leaderboard manager:', err);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await api.put('/leaderboard/admin/settings', {
        pointSystem: pointRules,
        badges
      });
      toast.success('Gamification config successfully saved!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('Could not save modifications');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (type) => {
    if (!window.confirm(`Are you sure you want to reset all ${type} points? This cannot be undone.`)) return;
    try {
      await api.post('/leaderboard/admin/reset', { resetType: type });
      toast.success(`Successfully reset all ${type} scores!`);
      fetchData();
    } catch (err) {
      console.error('Failed to reset rankings:', err);
      toast.error('Reset failed');
    }
  };

  const handleRecalculate = async () => {
    try {
      await api.post('/leaderboard/admin/recalculate');
      toast.success('Forced recalculation triggers processed successfully!');
      fetchData();
    } catch (err) {
      console.error('Recalculation failed:', err);
      toast.error('Calculation failed');
    }
  };

  const toggleBadge = (key) => {
    setBadges(badges.map(b => b.key === key ? { ...b, isActive: !b.isActive } : b));
  };

  const exportToCSV = () => {
    if (leaderboardData.length === 0) {
      toast.error('No leaderboard data to export');
      return;
    }

    const headers = ['Rank', 'Name', 'Points', 'Level', 'Login Streak', 'Videos Watched', 'Assessments Passed'];
    const rows = leaderboardData.map((s, index) => [
      index + 1,
      s.fullName,
      s.points,
      s.level,
      s.loginStreak,
      s.videosCompleted,
      s.assessmentsPassed
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leaderboard_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leaderboard report downloaded successfully');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-wider">Syncing Gamification configs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in select-text">
      {/* Settings Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Point configuration */}
        <div className="lg:col-span-6 bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
              <FiSettings className="text-indigo-400" /> Points System Configuration
            </h3>
            <p className="text-[9px] text-[var(--text-muted)] font-semibold">Customize point allocations for student activities</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            {Object.keys(pointRules).map((rule) => (
              <div key={rule} className="space-y-1">
                <label className="text-[10px] text-[var(--text-light)] uppercase tracking-wide block capitalize">
                  {rule.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="number"
                  value={pointRules[rule]}
                  onChange={(e) => setPointRules({ ...pointRules, [rule]: Number(e.target.value) })}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-main)] outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <FiSave /> {saving ? 'Saving...' : 'Apply Point Weight Modifications'}
          </button>
        </div>

        {/* Resets & Maintenance */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl space-y-6 shadow-sm">
            <div>
              <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">Leaderboard Reset Operations</h3>
              <p className="text-[9px] text-[var(--text-muted)] font-semibold">Maintenance tasks to reset weekly/monthly points and force ranking calculations</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleReset('weekly')}
                className="p-4 bg-[var(--bg-sub)] border border-[var(--border)] rounded-2xl hover:border-indigo-500 text-center transition-all"
              >
                <div className="text-xl mb-1">📅</div>
                <div className="text-[9px] font-black text-[var(--text-main)] uppercase">Reset Weekly</div>
              </button>

              <button
                onClick={() => handleReset('monthly')}
                className="p-4 bg-[var(--bg-sub)] border border-[var(--border)] rounded-2xl hover:border-indigo-500 text-center transition-all"
              >
                <div className="text-xl mb-1">📆</div>
                <div className="text-[9px] font-black text-[var(--text-main)] uppercase">Reset Monthly</div>
              </button>

              <button
                onClick={handleRecalculate}
                className="p-4 bg-[var(--bg-sub)] border border-[var(--border)] rounded-2xl hover:border-indigo-500 text-center transition-all"
              >
                <div className="text-xl mb-1">🔄</div>
                <div className="text-[9px] font-black text-[var(--text-main)] uppercase">Recalculate</div>
              </button>
            </div>

            <button
              onClick={exportToCSV}
              className="w-full py-2.5 bg-[var(--bg-sub)] border border-[var(--border)] hover:border-indigo-500 text-[var(--text-main)] rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <FiDownload /> Export Leaderboard Report (CSV)
            </button>
          </div>

          {/* At risk of inactivity card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl space-y-4 shadow-sm">
            <div>
              <h3 className="text-xs font-black text-rose-500 uppercase tracking-wider flex items-center gap-2">
                <FiAlertTriangle /> Students At Risk of Inactivity
              </h3>
              <p className="text-[9px] text-[var(--text-muted)] font-semibold">Students with no active study logs over the past 7 days</p>
            </div>

            <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {atRiskStudents.length === 0 ? (
                <p className="text-[10px] text-[var(--text-muted)] italic font-semibold text-center py-4">No at-risk students logged</p>
              ) : (
                atRiskStudents.map((s) => (
                  <div key={s._id} className="p-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[var(--text-main)] leading-none">{s.fullName}</h4>
                      <span className="text-[9px] text-[var(--text-muted)] font-semibold mt-1 block">{s.email}</span>
                    </div>
                    <span className="text-[9px] text-rose-500 font-black uppercase">
                      {s.lastActive ? `Last active ${new Date(s.lastActive).toLocaleDateString()}` : 'Never active'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Badges checklist */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-3xl space-y-4 shadow-sm">
        <div>
          <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">Badge System Status Management</h3>
          <p className="text-[9px] text-[var(--text-muted)] font-semibold">Enable or disable automatic badges triggered during curriculum progression</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.key}
              className="p-4 bg-[var(--bg-sub)] border border-[var(--border)] rounded-2xl flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{badge.icon}</span>
                <div>
                  <h4 className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-wide leading-none">{badge.name}</h4>
                  <p className="text-[8px] text-[var(--text-muted)] font-semibold mt-1 leading-tight">{badge.description}</p>
                </div>
              </div>

              <button
                onClick={() => toggleBadge(badge.key)}
                className="text-xl text-slate-500 hover:text-indigo-600 transition-colors"
              >
                {badge.isActive ? (
                  <FiToggleRight className="text-indigo-600" size={24} />
                ) : (
                  <FiToggleLeft className="text-slate-400" size={24} />
                )}
              </button>
            </div>
          ))}
        </div>
        
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <FiCheckCircle /> {saving ? 'Applying...' : 'Apply Badge Configuration Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
