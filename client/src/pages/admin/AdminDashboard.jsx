import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiUsers, 
  FiMap, 
  FiCheckSquare, 
  FiAward, 
  FiSearch, 
  FiTrash2, 
  FiEye, 
  FiPlus, 
  FiActivity, 
  FiUserCheck, 
  FiX, 
  FiClock, 
  FiBookOpen, 
  FiSettings, 
  FiTrendingUp 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'stats' | 'users' | 'domains'
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Selected User for Detail Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [customXp, setCustomXp] = useState(0);
  const [customProgress, setCustomProgress] = useState(0);
  const [customPhase, setCustomPhase] = useState(0);

  // New Domain Creation Modal State
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [newDomain, setNewDomain] = useState({
    name: '',
    slug: '',
    description: '',
    estimatedDuration: '4-6 months',
    difficultyLevel: 'Beginner to Intermediate',
    certificationLink: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, domainsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/domains')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setDomains(domainsRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load administration workspace data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const loadingToast = toast.loading("Updating user privilege level...");
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        toast.success("Role updated successfully!", { id: loadingToast });
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      toast.error("Failed to alter user privileges", { id: loadingToast });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you absolutely sure you want to delete this user? This action is irreversible.")) return;
    const loadingToast = toast.loading("Removing user account...");
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        toast.success("User deleted successfully", { id: loadingToast });
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) {
      toast.error("Failed to delete user account", { id: loadingToast });
    }
  };

  const openPersonalizeDrawer = (user) => {
    setSelectedUser(user);
    setCustomXp(user.xp || 0);
    setCustomProgress(user.overallProgress || 0);
    setCustomPhase(user.currentPhase || 0);
  };

  const handleSaveProgress = async () => {
    setUpdatingProgress(true);
    const loadingToast = toast.loading("Saving personalization updates...");
    try {
      const res = await api.put(`/admin/users/${selectedUser._id}/progress`, {
        xp: Number(customXp),
        overallProgress: Number(customProgress),
        currentPhase: Number(customPhase)
      });
      if (res.data.success) {
        toast.success("Student records updated!", { id: loadingToast });
        setUsers(users.map(u => u._id === selectedUser._id ? res.data.data : u));
        setSelectedUser(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to update student records", { id: loadingToast });
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleCreateDomain = async (e) => {
    e.preventDefault();
    if (!newDomain.name || !newDomain.slug) {
      toast.error("Please provide both domain name and a unique slug");
      return;
    }
    const loadingToast = toast.loading("Registering new domain...");
    try {
      const res = await api.post('/domains', newDomain);
      if (res.data) {
        toast.success("New domain added successfully!", { id: loadingToast });
        setDomains([...domains, res.data]);
        setShowDomainModal(false);
        setNewDomain({
          name: '',
          slug: '',
          description: '',
          estimatedDuration: '4-6 months',
          difficultyLevel: 'Beginner to Intermediate',
          certificationLink: ''
        });
        // Reload stats
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data.data);
      }
    } catch (err) {
      toast.error("Failed to register domain: Slug might be duplicate", { id: loadingToast });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
        <p className="text-sm font-bold text-slate-400">Loading CareerForge Administration Console...</p>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-7xl mx-auto pb-16 px-4">
      {/* Header and Welcome banner */}
      <div className="card p-8 bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/30 shadow-2xl rounded-3xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-950 border border-indigo-900/50 px-3 py-1 rounded-full">
              Teammate Portal
            </span>
            <h1 className="text-3xl font-black text-white mt-3 mb-1 tracking-tight">Admin & Teammate Workspace</h1>
            <p className="text-slate-400 text-sm font-medium">Personalize student trajectories, oversee specializations, and customize platform curriculums.</p>
          </div>

          <div className="flex gap-2 bg-slate-950/40 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              👥 Manage Users
            </button>
            <button
              onClick={() => setActiveTab('domains')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'domains' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              🗺️ Domain Specializations
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Overview row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div className="bg-slate-900/55 border border-white/5 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Registered</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <FiUsers className="text-indigo-400 text-lg" /> {stats?.totalUsers || 0}
          </div>
        </div>
        <div className="bg-slate-900/55 border border-white/5 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Students</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <FiUserCheck className="text-emerald-400 text-lg" /> {stats?.totalStudents || 0}
          </div>
        </div>
        <div className="bg-slate-900/55 border border-white/5 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Assigned Mentors</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <FiAward className="text-amber-400 text-lg" /> {stats?.totalMentors || 0}
          </div>
        </div>
        <div className="bg-slate-900/55 border border-white/5 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Active Specializations</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <FiMap className="text-purple-400 text-lg" /> {stats?.totalDomains || 0}
          </div>
        </div>
        <div className="bg-slate-900/55 border border-white/5 p-5 rounded-2xl col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Milestones</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <FiCheckSquare className="text-sky-400 text-lg" /> {stats?.totalAssessments || 0}
          </div>
        </div>
      </div>

      {/* Tabs panels */}
      {activeTab === 'users' ? (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
          {/* Controls toolbar */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search registered teammates or students by name/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/45 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Privilege Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950/45 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Show All Users</option>
                <option value="student">Students Only</option>
                <option value="mentor">Mentors Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>
          </div>

          {/* Users Grid/Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/40 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-4">User Identity</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Selected Specialization</th>
                  <th className="p-4">XP & Progress</th>
                  <th className="p-4">Academic details</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 font-black text-sm flex items-center justify-center">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">{user.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="bg-slate-950/60 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] font-black text-indigo-300 uppercase tracking-wider focus:outline-none focus:border-indigo-500"
                        >
                          <option value="student">Student</option>
                          <option value="mentor">Mentor</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td className="p-4">
                        {user.selectedDomain ? (
                          <span className="text-xs font-bold text-slate-300 bg-slate-800/40 border border-white/5 px-2.5 py-1 rounded-lg">
                            🚀 {user.selectedDomain.name}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unselected</span>
                        )}
                      </td>
                      <td className="p-4 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black">
                          <span className="text-amber-400">{user.xp || 0} XP • Lvl {Math.floor((user.xp || 0) / 1000) + 1}</span>
                          <span className="text-indigo-400">{user.overallProgress || 0}% Complete</span>
                        </div>
                        <div className="w-32 h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300"
                            style={{ width: `${user.overallProgress || 0}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-4">
                        {user.profile?.collegeName ? (
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">{user.profile.collegeName.substring(0, 25)}</span>
                            <span className="text-[9px] text-slate-500 font-semibold block">{user.profile.branch} • Year {user.profile.year}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No academic profile</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openPersonalizeDrawer(user)}
                            className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 flex items-center justify-center text-xs hover:bg-indigo-600 hover:text-white transition-all"
                            title="Personalize & View details"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/10 flex items-center justify-center text-xs hover:bg-rose-500 hover:text-white transition-all"
                            title="Delete User"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 text-xs font-semibold">
                      No users match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-white">Domain Specializations</h3>
              <p className="text-slate-400 text-xs mt-0.5">Overview of registered learning pathways inside CareerForge</p>
            </div>
            <button
              onClick={() => setShowDomainModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2"
            >
              <FiPlus /> Add Domain
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {domains.map((dom) => (
              <div key={dom._id} className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-black text-white text-sm">{dom.name}</h4>
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-950 border border-indigo-900 px-2 py-0.5 rounded-full">{dom.slug}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mt-2 line-clamp-3">{dom.description}</p>
                </div>

                <div className="border-t border-white/5 pt-4 flex flex-wrap gap-2 text-[10px] text-slate-400 font-bold">
                  <span className="bg-slate-800/40 px-2 py-1 rounded">⏳ {dom.estimatedDuration || '4-6 months'}</span>
                  <span className="bg-slate-800/40 px-2 py-1 rounded">🔥 {dom.difficultyLevel || 'Intermediate'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Personalization Modal (Drawer style) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-slate-950 border-l border-white/5 h-full overflow-y-auto p-8 shadow-2xl flex flex-col justify-between">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 font-black text-lg flex items-center justify-center">
                    {selectedUser.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{selectedUser.fullName}</h3>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{selectedUser.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <FiX />
                </button>
              </div>

              {/* Progress & Personalization Slider Console */}
              <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-2xl p-5 space-y-4">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <FiSettings /> Teammate Personalization panel
                </h4>

                <div className="space-y-4">
                  {/* XP update */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Custom User XP Balance:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={customXp}
                        onChange={(e) => setCustomXp(e.target.value)}
                        className="bg-slate-950/85 border border-white/5 rounded-xl px-3 py-2 text-xs text-white font-bold w-full"
                      />
                      <button
                        onClick={() => setCustomXp(Number(customXp) + 250)}
                        className="px-2.5 py-2 bg-slate-900 border border-white/5 rounded-xl text-[9px] font-black text-slate-300 hover:text-white"
                      >
                        +250 XP
                      </button>
                    </div>
                  </div>

                  {/* Progress percentage slider */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Curriculum Completion Progress:</span>
                      <span className="text-white font-black">{customProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={customProgress}
                      onChange={(e) => setCustomProgress(e.target.value)}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  {/* Current phase */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Current Active Learning Phase Index:</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={customPhase}
                      onChange={(e) => setCustomPhase(e.target.value)}
                      className="bg-slate-950/85 border border-white/5 rounded-xl px-3 py-2 text-xs text-white font-bold w-full"
                    />
                  </div>

                  <button
                    onClick={handleSaveProgress}
                    disabled={updatingProgress}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    {updatingProgress ? "Applying Changes..." : "Apply Personalization Settings"}
                  </button>
                </div>
              </div>

              {/* Onboarding Profiles & Stats details */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic & Onboarding Summary</h4>

                {selectedUser.profile?.collegeName ? (
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between"><span className="text-slate-500">Institution:</span><span className="text-white font-bold">{selectedUser.profile.collegeName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Branch & Year:</span><span className="text-white font-bold">{selectedUser.profile.branch} • Year {selectedUser.profile.year}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Daily Study Target:</span><span className="text-white font-bold">{selectedUser.profile.dailyStudyTime || 0} minutes</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Pace:</span><span className="text-white font-bold text-indigo-400">{selectedUser.profile.roadmapType || "Steady"}</span></div>
                    </div>

                    <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                      <span className="text-[10px] text-slate-500 block">Languages & Tools:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedUser.profile.knownLanguages?.map(lang => (
                          <span key={lang} className="text-[9px] bg-slate-800/60 px-2 py-0.5 rounded border border-white/5 text-slate-300">{lang}</span>
                        ))}
                        {selectedUser.profile.knownTools?.map(tool => (
                          <span key={tool} className="text-[9px] bg-slate-800/60 px-2 py-0.5 rounded border border-white/5 text-slate-300">{tool}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs italic">User has not completed the interest onboarding profile.</p>
                )}
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white rounded-xl text-xs font-black transition-all"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Domain Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-base">Add New Domain Specialized Path</h3>
              <button
                onClick={() => setShowDomainModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateDomain} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Domain Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Computing"
                  value={newDomain.name}
                  onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Unique Slug:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cloud-computing"
                  value={newDomain.slug}
                  onChange={(e) => setNewDomain({ ...newDomain, slug: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Description:</label>
                <textarea
                  placeholder="Summarize the career specialization target..."
                  rows="3"
                  value={newDomain.description}
                  onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Duration:</label>
                  <input
                    type="text"
                    value={newDomain.estimatedDuration}
                    onChange={(e) => setNewDomain({ ...newDomain, estimatedDuration: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Difficulty:</label>
                  <input
                    type="text"
                    value={newDomain.difficultyLevel}
                    onChange={(e) => setNewDomain({ ...newDomain, difficultyLevel: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Global Certification Link:</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newDomain.certificationLink}
                  onChange={(e) => setNewDomain({ ...newDomain, certificationLink: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="w-1/2 py-2.5 bg-slate-900 border border-white/5 text-slate-400 rounded-xl text-xs font-black hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black"
                >
                  Create Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
