import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { 
  FiClock, 
  FiActivity, 
  FiCalendar, 
  FiUsers, 
  FiUserCheck, 
  FiBookOpen, 
  FiSearch, 
  FiTrendingUp, 
  FiMonitor 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UserAnalytics() {
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastActive'); // 'lastActive' | 'totalTime' | 'logins' | 'streak'
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, summaryRes] = await Promise.all([
        api.get('/admin/activity/users'),
        api.get('/admin/activity/summary')
      ]);
      setUsersData(usersRes.data.data);
      setSummary(summaryRes.data.data);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
      toast.error('Could not fetch user activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatHours = (seconds) => {
    const hrs = seconds / 3600;
    if (hrs < 0.1) return `${Math.round(seconds / 60)}m`;
    return `${hrs.toFixed(1)}h`;
  };

  // Filter and sort users
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredUsers = usersData
    .filter(u => 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortBy] || 0;
      let valB = b[sortBy] || 0;

      // Handle custom sorting fields
      if (sortBy === 'lastActive') {
        valA = a.lastActive ? new Date(a.lastActive).getTime() : 0;
        valB = b.lastActive ? new Date(b.lastActive).getTime() : 0;
      } else if (sortBy === 'totalTime') {
        valA = a.totalPlatformTime || 0;
        valB = b.totalPlatformTime || 0;
      } else if (sortBy === 'logins') {
        valA = a.totalLogins || 0;
        valB = b.totalLogins || 0;
      } else if (sortBy === 'streak') {
        valA = a.loginStreak || 0;
        valB = b.loginStreak || 0;
      }

      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
        <p className="text-xs text-[var(--text-muted)] font-black uppercase">Loading Analytics Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Daily Active Users</span>
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-xs shadow-sm"><FiUsers className="text-indigo-400" /></div>
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] mt-3 leading-none">{summary?.dau || 0}</div>
          <span className="text-[8px] text-[var(--text-muted)] font-semibold mt-2">Active last 24 hours</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Weekly Active</span>
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-xs shadow-sm"><FiCalendar className="text-blue-400" /></div>
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] mt-3 leading-none">{summary?.wau || 0}</div>
          <span className="text-[8px] text-[var(--text-muted)] font-semibold mt-2">Active last 7 days</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">Monthly Active</span>
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-xs shadow-sm"><FiUserCheck className="text-teal-400" /></div>
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] mt-3 leading-none">{summary?.mau || 0}</div>
          <span className="text-[8px] text-[var(--text-muted)] font-semibold mt-2">Active last 30 days</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Avg Session Time</span>
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-xs shadow-sm"><FiClock className="text-amber-400" /></div>
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] mt-3 leading-none">{formatHours(summary?.avgSessionTime || 0)}</div>
          <span className="text-[8px] text-[var(--text-muted)] font-semibold mt-2">Active engagement ratio</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent border border-rose-500/20 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Sessions Today</span>
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-xs shadow-sm"><FiActivity className="text-rose-400" /></div>
          </div>
          <div className="text-2xl font-black text-[var(--text-main)] mt-3 leading-none">{summary?.totalSessionsToday || 0}</div>
          <span className="text-[8px] text-[var(--text-muted)] font-semibold mt-2">Daily sessions initiated</span>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Engagement Trends */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">Active Engagement Trends</h3>
            <p className="text-[8px] text-[var(--text-muted)] font-semibold">User logins & active platform hours over past 7 days</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="activeHoursG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: 10, color: '#fff' }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2e2e2e" opacity={0.3} />
                <Area type="monotone" dataKey="activeHours" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#activeHoursG)" name="Active Hours" />
                <Line type="monotone" dataKey="logins" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Logins" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course / Page Engagement */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">Page / Module Engagements</h3>
            <p className="text-[8px] text-[var(--text-muted)] font-semibold">Accumulated visits & active study hours by module type</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.pageEngagement || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="pageName" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: 10, color: '#fff' }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2e2e2e" opacity={0.3} />
                <Bar dataKey="hoursSpent" fill="#10b981" radius={[4, 4, 0, 0]} name="Hours Spent" />
                <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Visit Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Activity Hours */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">Peak Usage Hours</h3>
            <p className="text-[8px] text-[var(--text-muted)] font-semibold">Hourly active user distribution on the platform</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.peakHours || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="peakHoursG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#888888" fontSize={8} tickLine={false} axisLine={false} interval={2} />
                <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: 10, color: '#fff' }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2e2e2e" opacity={0.3} />
                <Area type="monotone" dataKey="activeUsers" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#peakHoursG)" name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Active Students List */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">Most Active Students</h3>
            <p className="text-[8px] text-[var(--text-muted)] font-semibold">Top learners with highest total platform study time</p>
          </div>
          <div className="space-y-3">
            {summary?.mostActiveStudents?.map((student, idx) => (
              <div key={student.userId || idx} className="p-3 bg-[var(--bg-sub)] rounded-xl border border-[var(--border)] flex items-center justify-between hover:border-[var(--primary)] transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold text-xs border border-[var(--border)]">
                    {student.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[var(--text-main)]">{student.fullName}</h4>
                    <span className="text-[9px] text-[var(--text-muted)] font-bold">{student.email}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-500">{formatHours(student.totalTimeSpent || 0)}</div>
                  <span className="text-[8px] text-[var(--text-muted)] font-semibold uppercase">{student.totalLogins} Logins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User activity database list */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">User Engagement Database</h3>
            <p className="text-[8px] text-[var(--text-muted)] font-semibold">Sorting and filtering detailed student activity metrics</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-2.5 text-[var(--text-light)]" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or email..."
                className="w-full pl-9 pr-4 py-2 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto select-text custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--bg-sub)] border-b border-[var(--border)] text-[9px] font-black text-[var(--text-light)] uppercase tracking-widest">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3 cursor-pointer hover:text-[var(--text-main)]" onClick={() => handleSort('logins')}>Logins {sortBy === 'logins' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                <th className="px-5 py-3 cursor-pointer hover:text-[var(--text-main)]" onClick={() => handleSort('lastActive')}>Last Active {sortBy === 'lastActive' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                <th className="px-5 py-3 cursor-pointer hover:text-[var(--text-main)]" onClick={() => handleSort('totalTime')}>Platform Time {sortBy === 'totalTime' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                <th className="px-5 py-3">Avg Session</th>
                <th className="px-5 py-3 cursor-pointer hover:text-[var(--text-main)]" onClick={() => handleSort('streak')}>Streak {sortBy === 'streak' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                <th className="px-5 py-3">Videos</th>
                <th className="px-5 py-3">Quiz</th>
                <th className="px-5 py-3">Most Active Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs font-semibold text-[var(--text-main)]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-[var(--text-muted)]">No active logs found matching the filter criteria</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-[var(--bg-sub)]/30 transition-colors">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold text-xs border border-[var(--border)] shrink-0">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-main)]">{user.fullName}</div>
                        <div className="text-[9px] text-[var(--text-muted)] font-medium leading-none mt-0.5">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold">{user.totalLogins || 0}</td>
                    <td className="px-5 py-3 font-medium text-[var(--text-light)]">
                      {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-5 py-3 text-emerald-500 font-bold">{formatHours(user.totalPlatformTime || 0)}</td>
                    <td className="px-5 py-3 font-medium text-[var(--text-light)]">{formatHours(user.avgSessionDuration || 0)}</td>
                    <td className="px-5 py-3 font-bold text-amber-500">🔥 {user.loginStreak || 0}</td>
                    <td className="px-5 py-3 font-medium text-[var(--text-light)]">{user.videosWatched || 0}</td>
                    <td className="px-5 py-3 font-medium text-[var(--text-light)]">{user.assessmentsAttempted || 0}</td>
                    <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-md bg-[var(--primary-light)] text-[var(--primary)] text-[9px] font-black uppercase tracking-wider">{user.mostVisitedPage || 'Dashboard'}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
