import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FiTerminal, FiUser, FiActivity, FiRefreshCw, FiPlusCircle, FiFileText } from 'react-icons/fi';

const ManageTerminalLabs = () => {
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessions, setSessions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New Lab Form State
  const [newLab, setNewLab] = useState({
    labId: '',
    title: '',
    description: '',
    category: 'linux',
    objectives: '',
    xpReward: 50,
    rules: [{ type: 'file_exists', path: '' }]
  });

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/terminal/admin/sessions');
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      toast.error('Failed to load active terminal sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/terminal/labs');
      if (data.success) {
        setLabs(data.labs || []);
      }
    } catch (err) {
      toast.error('Failed to load terminal labs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sessions') fetchSessions();
    if (activeTab === 'labs') fetchLabs();
  }, [activeTab]);

  const handleResetSession = async (userId, topicId, studentName) => {
    if (window.confirm(`Are you sure you want to force reset the terminal session for ${studentName}?`)) {
      try {
        const { data } = await api.post('/terminal/admin/reset-session', { userId, topicId });
        if (data.success) {
          toast.success(`Session reset successfully for ${studentName}`);
          fetchSessions();
        }
      } catch (err) {
        toast.error('Failed to reset student session');
      }
    }
  };

  const handleAddRule = () => {
    setNewLab(prev => ({
      ...prev,
      rules: [...prev.rules, { type: 'file_exists', path: '' }]
    }));
  };

  const handleRemoveRule = (idx) => {
    setNewLab(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== idx)
    }));
  };

  const handleRuleChange = (idx, field, val) => {
    setNewLab(prev => {
      const updatedRules = [...prev.rules];
      updatedRules[idx][field] = val;
      return { ...prev, rules: updatedRules };
    });
  };

  const handleCreateLab = async (e) => {
    e.preventDefault();
    
    // Parse objectives by newline
    const parsedObjectives = newLab.objectives.split('\n').filter(o => o.trim().length > 0);
    const labData = {
      labId: newLab.labId,
      title: newLab.title,
      description: newLab.description,
      category: newLab.category,
      objectives: parsedObjectives,
      xpReward: newLab.xpReward,
      validationRules: newLab.rules.map(r => ({
        type: r.type,
        path: r.path || undefined,
        content: r.content || undefined,
        imageName: r.imageName || undefined,
        resourceName: r.resourceName || undefined
      }))
    };

    try {
      const { data } = await api.post('/terminal/admin/labs', labData);
      if (data.success) {
        toast.success('Terminal Lab created successfully!');
        setNewLab({
          labId: '',
          title: '',
          description: '',
          category: 'linux',
          objectives: '',
          xpReward: 50,
          rules: [{ type: 'file_exists', path: '' }]
        });
        fetchLabs();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lab');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-6 space-y-6 text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
      {/* Admin Title Banner */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-600/20 text-indigo-500 rounded-2xl flex items-center justify-center text-2xl">
            <FiTerminal />
          </div>
          <div>
            <h1 className="text-xl font-black text-[var(--text-main)] tracking-tight">Manage Terminal Labs</h1>
            <p className="text-[10px] text-[var(--text-light)] uppercase tracking-wider mt-1">DevOps Sandbox Control Panel</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)] pb-2 select-none">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 rounded-lg font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'sessions'
              ? 'bg-[var(--primary)] text-[var(--text-main)] shadow-sm'
              : 'hover:bg-[var(--bg-card)]'
          }`}
        >
          <FiUser /> Active Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('labs')}
          className={`px-4 py-2 rounded-lg font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'labs'
              ? 'bg-[var(--primary)] text-[var(--text-main)] shadow-sm'
              : 'hover:bg-[var(--bg-card)]'
          }`}
        >
          <FiFileText /> Lab Catalog ({labs.length})
        </button>
      </div>

      {/* TAB CONTENT: Sessions */}
      {activeTab === 'sessions' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-sub)]/30 font-black uppercase text-[10px] text-[var(--text-light)] flex items-center justify-between">
            <span>Student Command Sessions</span>
            <button onClick={fetchSessions} className="p-1 hover:bg-zinc-800 rounded transition-colors text-[var(--primary)]">
              Refresh ↺
            </button>
          </div>
          {loading ? (
            <div className="p-8 text-center">Loading student activity logs...</div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center">No active student terminal sessions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-sub)]/10 text-[var(--text-light)]">
                    <th className="p-4 font-black">Student</th>
                    <th className="p-4 font-black">Topic</th>
                    <th className="p-4 font-black">Current Dir</th>
                    <th className="p-4 font-black">Commands Count</th>
                    <th className="p-4 font-black">Last Command</th>
                    <th className="p-4 font-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((sess) => (
                    <tr key={sess._id} className="border-b border-[var(--border)] hover:bg-[var(--bg-sub)]/10">
                      <td className="p-4 font-bold text-[var(--text-main)]">
                        <div>{sess.userId?.fullName || 'Anonymous'}</div>
                        <div className="text-[10px] text-[var(--text-light)] font-medium mt-0.5">{sess.userId?.email}</div>
                      </td>
                      <td className="p-4">{sess.topicId?.title || 'Unknown Topic'}</td>
                      <td className="p-4 font-mono text-[var(--primary)]">{sess.currentDir}</td>
                      <td className="p-4">{sess.history?.length || 0}</td>
                      <td className="p-4 font-mono text-[var(--text-light)] max-w-xs truncate">
                        {sess.history?.[sess.history.length - 1] || '-'}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleResetSession(sess.userId?._id, sess.topicId?._id, sess.userId?.fullName)}
                          className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-wider text-red-400 transition-all flex items-center gap-1"
                        >
                          <FiRefreshCw size={10} /> Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Labs Catalog */}
      {activeTab === 'labs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Labs List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-sub)]/30 font-black uppercase text-[10px] text-[var(--text-light)]">
                Existing Predefined Lab Environments
              </div>
              {loading ? (
                <div className="p-8 text-center">Loading labs catalog...</div>
              ) : labs.length === 0 ? (
                <div className="p-8 text-center">No terminal exercises seeded.</div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {labs.map((lab) => (
                    <div key={lab._id} className="p-4 hover:bg-[var(--bg-sub)]/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-[9px] uppercase font-bold">
                            {lab.category}
                          </span>
                          <h3 className="font-black text-sm text-[var(--text-main)]">{lab.title}</h3>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-black">+{lab.xpReward} XP</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">{lab.description}</p>
                      
                      <div className="space-y-1">
                        <div className="text-[9px] text-[var(--text-light)] uppercase tracking-wider font-bold">Objectives</div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                          {lab.objectives.map((obj, oIdx) => (
                            <li key={oIdx}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Lab Form */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 shadow-sm space-y-4 h-fit">
            <h3 className="font-black text-sm text-[var(--text-main)] flex items-center gap-1.5 border-b border-[var(--border)] pb-3">
              <FiPlusCircle className="text-indigo-500" /> Create Custom Exercise
            </h3>
            <form onSubmit={handleCreateLab} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Unique Lab ID</label>
                <input
                  type="text"
                  placeholder="e.g. linux_basics_2"
                  value={newLab.labId}
                  onChange={(e) => setNewLab({ ...newLab, labId: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Lab Title"
                  value={newLab.title}
                  onChange={(e) => setNewLab({ ...newLab, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Description</label>
                <textarea
                  placeholder="Describe the context of this terminal lab exercise..."
                  rows={2}
                  value={newLab.description}
                  onChange={(e) => setNewLab({ ...newLab, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newLab.category}
                    onChange={(e) => setNewLab({ ...newLab, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  >
                    <option value="linux">Linux</option>
                    <option value="git">Git</option>
                    <option value="docker">Docker</option>
                    <option value="k8s">Kubernetes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">XP Reward</label>
                  <input
                    type="number"
                    value={newLab.xpReward}
                    onChange={(e) => setNewLab({ ...newLab, xpReward: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Objectives (one per line)</label>
                <textarea
                  placeholder="1. Create a directory named workspace..."
                  rows={3}
                  value={newLab.objectives}
                  onChange={(e) => setNewLab({ ...newLab, objectives: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none"
                  required
                />
              </div>

              {/* Validation Rules */}
              <div className="space-y-2 border-t border-[var(--border)] pt-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">Validation Rules</label>
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="text-[9px] text-[var(--primary)] hover:text-emerald-400 font-bold"
                  >
                    + Add Rule
                  </button>
                </div>
                
                {newLab.rules.map((rule, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-[var(--bg-sub)]/50 p-2.5 rounded-lg border border-[var(--border)] relative">
                    <div className="flex-1 space-y-1.5">
                      <select
                        value={rule.type}
                        onChange={(e) => handleRuleChange(idx, 'type', e.target.value)}
                        className="w-full px-2 py-1 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded font-semibold text-[10px]"
                      >
                        <option value="file_exists">File Exists</option>
                        <option value="dir_exists">Directory Exists</option>
                        <option value="file_contains">File Contains Text</option>
                        <option value="git_initialized">Git Initialized</option>
                        <option value="git_committed">Git Committed Changes</option>
                        <option value="docker_running">Docker Container Running</option>
                        <option value="k8s_applied">Kubernetes Applied Pod</option>
                      </select>
                      
                      {(rule.type === 'file_exists' || rule.type === 'dir_exists' || rule.type === 'file_contains') && (
                        <input
                          type="text"
                          placeholder="e.g. /home/student/app.js"
                          value={rule.path || ''}
                          onChange={(e) => handleRuleChange(idx, 'path', e.target.value)}
                          className="w-full px-2 py-1 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded text-[10px]"
                        />
                      )}
                      {rule.type === 'file_contains' && (
                        <input
                          type="text"
                          placeholder="text to find inside file"
                          value={rule.content || ''}
                          onChange={(e) => handleRuleChange(idx, 'content', e.target.value)}
                          className="w-full px-2 py-1 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded text-[10px]"
                        />
                      )}
                      {rule.type === 'docker_running' && (
                        <input
                          type="text"
                          placeholder="image name (e.g. nginx:alpine)"
                          value={rule.imageName || ''}
                          onChange={(e) => handleRuleChange(idx, 'imageName', e.target.value)}
                          className="w-full px-2 py-1 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded text-[10px]"
                        />
                      )}
                      {rule.type === 'k8s_applied' && (
                        <input
                          type="text"
                          placeholder="resource name (e.g. nginx-pod)"
                          value={rule.resourceName || ''}
                          onChange={(e) => handleRuleChange(idx, 'resourceName', e.target.value)}
                          className="w-full px-2 py-1 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded text-[10px]"
                        />
                      )}
                    </div>
                    {newLab.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-red-400 hover:text-red-500 font-black text-sm p-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-500/10 cursor-pointer text-center"
              >
                Create Lab &amp; Exercise
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTerminalLabs;
