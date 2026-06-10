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
  FiTrendingUp,
  FiEdit,
  FiVideo,
  FiFileText
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [topics, setTopics] = useState([]);
  const [assessments, setAssessments] = useState([]);
  
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [credits, setCredits] = useState([]);

  // Form creation inputs
  const [newBlog, setNewBlog] = useState({ title: '', content: '', author: '', category: 'Web Development', tags: '', imageUrl: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', domain: 'webdev', difficulty: 'intermediate', steps: '', roadmap: '' });
  const [newInternship, setNewInternship] = useState({ title: '', company: '', location: 'Remote', stipend: '', description: '', applyLink: '', domain: 'webdev', requirements: '' });
  const [newCredit, setNewCredit] = useState({ title: '', platform: '', category: 'cloud', link: '', description: '', icon: '☁️', eligibility: '', order: 1 });
  
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'domains' | 'topics' | 'assessments'
  const [loading, setLoading] = useState(true);

  // DevOps MCQ admin panel states
  const [assessmentsSubTab, setAssessmentsSubTab] = useState('milestones'); // 'milestones' | 'devops'
  const [editingDevopsAssessment, setEditingDevopsAssessment] = useState(null);
  const [showDevopsEditModal, setShowDevopsEditModal] = useState(false);
  const [devopsStats, setDevopsStats] = useState(null);
  const [devopsScores, setDevopsScores] = useState([]);
  const [showDevopsStatsModal, setShowDevopsStatsModal] = useState(false);

  const fetchDevopsStatsAndScores = async (moduleId) => {
    const loadingToast = toast.loading("Loading statistics and user score records...");
    try {
      const [statsRes, scoresRes] = await Promise.all([
        api.get(`/assessments/admin/stats/${moduleId}`),
        api.get(`/assessments/admin/scores/${moduleId}`)
      ]);
      setDevopsStats(statsRes.data.data);
      setDevopsScores(scoresRes.data.data || []);
      setShowDevopsStatsModal(true);
      toast.success("DevOps metrics loaded!", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load statistics/scores.", { id: loadingToast });
    }
  };

  const handleEditDevopsAssessment = async (topic) => {
    const loadingToast = toast.loading("Loading DevOps assessment details...");
    try {
      const res = await api.get(`/assessments/module/${topic._id}`);
      if (res.data.success && res.data.data) {
        const fullAssessment = res.data.data;
        let questions = fullAssessment.questions || [];
        if (questions.length < 10) {
          const defaultQs = Array.from({ length: 10 - questions.length }, () => ({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            explanation: ''
          }));
          questions = [...questions, ...defaultQs];
        }
        setEditingDevopsAssessment({
          roadmapId: topic.domainId?._id || topic.domainId,
          levelId: topic.phaseId?._id || topic.phaseId,
          moduleId: topic._id,
          title: fullAssessment.title || `${topic.title} Assessment`,
          questions: questions.map(q => ({
            question: q.question || '',
            options: q.options || ['', '', '', ''],
            correctAnswer: q.correctAnswer || '',
            explanation: q.explanation || ''
          }))
        });
        setShowDevopsEditModal(true);
        toast.success("DevOps assessment loaded for editing!", { id: loadingToast });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        const questionsTemplate = Array.from({ length: 10 }, () => ({
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: ''
        }));
        setEditingDevopsAssessment({
          roadmapId: topic.domainId?._id || topic.domainId,
          levelId: topic.phaseId?._id || topic.phaseId,
          moduleId: topic._id,
          title: `${topic.title} MCQ Assessment`,
          questions: questionsTemplate
        });
        setShowDevopsEditModal(true);
        toast.success("Initialized a fresh DevOps assessment template!", { id: loadingToast });
      } else {
        toast.error(err.response?.data?.message || "Failed to load assessment.", { id: loadingToast });
      }
    }
  };

  const handleSaveDevopsAssessment = async (e) => {
    e.preventDefault();
    if (!editingDevopsAssessment.title || !editingDevopsAssessment.questions || editingDevopsAssessment.questions.length !== 10) {
      toast.error("An assessment requires a title and exactly 10 questions.");
      return;
    }
    
    for (let i = 0; i < 10; i++) {
      const q = editingDevopsAssessment.questions[i];
      if (!q.question || !q.correctAnswer || !q.explanation) {
        toast.error(`Question ${i + 1} is missing a prompt, correct answer, or explanation.`);
        return;
      }
      if (!q.options || q.options.length !== 4 || q.options.some(opt => !opt)) {
        toast.error(`Question ${i + 1} must contain exactly 4 non-empty options.`);
        return;
      }
      if (!q.options.includes(q.correctAnswer)) {
        toast.error(`Question ${i + 1}'s correct answer must match one of its options exactly.`);
        return;
      }
    }
    
    const loadingToast = toast.loading("Saving DevOps Assessment...");
    try {
      const res = await api.post('/assessments/admin/save', editingDevopsAssessment);
      if (res.data.success) {
        toast.success("DevOps assessment updated successfully!", { id: loadingToast });
        setShowDevopsEditModal(false);
        setEditingDevopsAssessment(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save DevOps assessment.", { id: loadingToast });
    }
  };
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedDomainForTopics, setSelectedDomainForTopics] = useState('');
  
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
    shortDescription: '',
    estimatedDuration: '4-6 months',
    difficultyLevel: 'beginner',
    certificationLink: ''
  });

  // Edit Domain Modal State
  const [editingDomain, setEditingDomain] = useState(null);

  // Topic Edit Modal State
  const [editingTopic, setEditingTopic] = useState(null);

  // Assessment Modals State
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    domainId: '',
    platform: 'HackerRank',
    assessmentLink: '',
    passingScore: 60
  });
  const [editingAssessment, setEditingAssessment] = useState(null);

  const handleAddQuestion = () => {
    const miniAssessment = editingTopic?.miniAssessment || { passingPercentage: 60, questions: [] };
    const questions = [...(miniAssessment.questions || [])];
    questions.push({ prompt: '', options: ['', '', '', ''], answer: '' });
    setEditingTopic({
      ...editingTopic,
      miniAssessment: {
        ...miniAssessment,
        questions
      }
    });
  };

  const handleUpdateQuestion = (qIdx, field, value) => {
    const miniAssessment = editingTopic?.miniAssessment || { passingPercentage: 60, questions: [] };
    const questions = [...(miniAssessment.questions || [])];
    questions[qIdx] = { ...questions[qIdx], [field]: value };
    setEditingTopic({
      ...editingTopic,
      miniAssessment: {
        ...miniAssessment,
        questions
      }
    });
  };

  const handleUpdateOption = (qIdx, optIdx, value) => {
    const miniAssessment = editingTopic?.miniAssessment || { passingPercentage: 60, questions: [] };
    const questions = [...(miniAssessment.questions || [])];
    const options = [...(questions[qIdx].options || ['', '', '', ''])];
    options[optIdx] = value;
    
    let answer = questions[qIdx].answer;
    if (questions[qIdx].answer && !options.includes(questions[qIdx].answer)) {
      answer = '';
    }

    questions[qIdx] = { ...questions[qIdx], options, answer };

    setEditingTopic({
      ...editingTopic,
      miniAssessment: {
        ...miniAssessment,
        questions
      }
    });
  };

  const handleDeleteQuestion = (qIdx) => {
    const miniAssessment = editingTopic?.miniAssessment || { passingPercentage: 60, questions: [] };
    const questions = (miniAssessment.questions || []).filter((_, idx) => idx !== qIdx);
    setEditingTopic({
      ...editingTopic,
      miniAssessment: {
        ...miniAssessment,
        questions
      }
    });
  };

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
      setDomains(domainsRes.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load administration workspace data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await api.get('/topics/all');
      setTopics(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load curriculum topics');
    }
  };

  const fetchAssessments = async () => {
    try {
      const res = await api.get('/assessments');
      setAssessments(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load active assessments');
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
        setDomains([...domains, res.data.data]);
        setShowDomainModal(false);
        setNewDomain({
          name: '',
          slug: '',
          shortDescription: '',
          estimatedDuration: '4-6 months',
          difficultyLevel: 'beginner',
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

  const handleUpdateDomain = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving domain updates...");
    try {
      const res = await api.put(`/domains/${editingDomain._id}`, editingDomain);
      if (res.data.success) {
        toast.success("Domain updated successfully!", { id: loadingToast });
        setDomains(domains.map(d => d._id === editingDomain._id ? res.data.data : d));
        setEditingDomain(null);
      }
    } catch (err) {
      toast.error("Failed to update domain: slug might be duplicate", { id: loadingToast });
    }
  };

  const handleDeleteDomain = async (domainId) => {
    if (!window.confirm("Are you absolutely sure you want to delete this domain? This will also affect linked roadmaps!")) return;
    const loadingToast = toast.loading("Removing domain path...");
    try {
      const res = await api.delete(`/domains/${domainId}`);
      if (res.data.success) {
        toast.success("Domain removed successfully", { id: loadingToast });
        setDomains(domains.filter(d => d._id !== domainId));
      }
    } catch (err) {
      toast.error("Failed to delete domain path", { id: loadingToast });
    }
  };

  const handleUpdateTopicLinks = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating topic resource links...");
    try {
      const res = await api.put(`/topics/${editingTopic._id}`, {
        youtubeLink: editingTopic.youtubeLink?.trim() || '',
        gfgLink: editingTopic.gfgLink?.trim() || '',
        miniAssessment: editingTopic.miniAssessment
      });
      if (res.data.success) {
        toast.success("Topic video, doc links & assessment updated!", { id: loadingToast });
        setTopics(topics.map(t => t._id === editingTopic._id ? res.data.data : t));
        setEditingTopic(null);
      }
    } catch (err) {
      toast.error("Failed to update topic links", { id: loadingToast });
    }
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    if (!newAssessment.title || !newAssessment.domainId) {
      toast.error("Title and Target Domain are required");
      return;
    }
    const loadingToast = toast.loading("Assigning assessment...");
    try {
      const res = await api.post('/assessments', newAssessment);
      if (res.data.success) {
        toast.success("New assessment assigned successfully!", { id: loadingToast });
        setAssessments([...assessments, res.data.data]);
        setShowAssessmentModal(false);
        setNewAssessment({
          title: '',
          description: '',
          domainId: '',
          platform: 'HackerRank',
          assessmentLink: '',
          passingScore: 60
        });
      }
    } catch (err) {
      toast.error("Failed to add assessment", { id: loadingToast });
    }
  };

  const handleUpdateAssessment = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating assessment details...");
    try {
      const res = await api.put(`/assessments/${editingAssessment._id}`, editingAssessment);
      if (res.data.success) {
        toast.success("Assessment updated successfully!", { id: loadingToast });
        setAssessments(assessments.map(a => a._id === editingAssessment._id ? res.data.data : a));
        setEditingAssessment(null);
      }
    } catch (err) {
      toast.error("Failed to update assessment", { id: loadingToast });
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    const loadingToast = toast.loading("Removing assessment...");
    try {
      const res = await api.delete(`/assessments/${assessmentId}`);
      if (res.data.success) {
        toast.success("Assessment removed successfully", { id: loadingToast });
        setAssessments(assessments.filter(a => a._id !== assessmentId));
      }
    } catch (err) {
      toast.error("Failed to delete assessment", { id: loadingToast });
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load blogs');
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load projects');
    }
  };

  const fetchInternships = async () => {
    try {
      const res = await api.get('/internships');
      setInternships(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load internships');
    }
  };

  const fetchCredits = async () => {
    try {
      const res = await api.get('/cloud-credits');
      setCredits(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load cloud credits');
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding blog post...");
    try {
      const tagsArray = newBlog.tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await api.post('/blogs', { ...newBlog, tags: tagsArray });
      if (res.data.success) {
        toast.success("Blog created!", { id: loadingToast });
        setBlogs([res.data.data, ...blogs]);
        setNewBlog({ title: '', content: '', author: '', category: 'Web Development', tags: '', imageUrl: '' });
      }
    } catch (err) {
      toast.error("Failed to create blog", { id: loadingToast });
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    const loadingToast = toast.loading("Deleting blog post...");
    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.data.success) {
        toast.success("Blog deleted", { id: loadingToast });
        setBlogs(blogs.filter(b => b._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete blog", { id: loadingToast });
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding project blueprint...");
    try {
      const stepsArray = newProject.steps.split('\n').map((line, idx) => {
        const parts = line.split(':');
        return {
          stepNumber: idx + 1,
          title: parts[0]?.trim() || `Step ${idx + 1}`,
          guidance: parts.slice(1).join(':')?.trim() || parts[0]?.trim()
        };
      }).filter(s => s.guidance);

      const roadmapArray = newProject.roadmap.split('\n').map(line => {
        const parts = line.split(':');
        const tasks = parts.slice(1).join(':')?.split(',').map(t => t.trim()).filter(Boolean) || [];
        return {
          phaseName: parts[0]?.trim() || 'Phase Details',
          tasks
        };
      }).filter(r => r.phaseName);

      const res = await api.post('/projects', {
        ...newProject,
        steps: stepsArray,
        roadmap: roadmapArray
      });
      if (res.data.success) {
        toast.success("Project blueprint created!", { id: loadingToast });
        setProjects([res.data.data, ...projects]);
        setNewProject({ title: '', description: '', domain: 'webdev', difficulty: 'intermediate', steps: '', roadmap: '' });
      }
    } catch (err) {
      toast.error("Failed to create project blueprint", { id: loadingToast });
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project blueprint?")) return;
    const loadingToast = toast.loading("Deleting project...");
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.data.success) {
        toast.success("Project deleted", { id: loadingToast });
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete project", { id: loadingToast });
    }
  };

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding internship position...");
    try {
      const reqsArray = newInternship.requirements.split('\n').map(r => r.trim()).filter(Boolean);
      const res = await api.post('/internships', { ...newInternship, requirements: reqsArray });
      if (res.data.success) {
        toast.success("Internship listed!", { id: loadingToast });
        setInternships([res.data.data, ...internships]);
        setNewInternship({ title: '', company: '', location: 'Remote', stipend: '', description: '', applyLink: '', domain: 'webdev', requirements: '' });
      }
    } catch (err) {
      toast.error("Failed to list internship", { id: loadingToast });
    }
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm("Delete this internship position?")) return;
    const loadingToast = toast.loading("Deleting internship...");
    try {
      const res = await api.delete(`/internships/${id}`);
      if (res.data.success) {
        toast.success("Internship deleted", { id: loadingToast });
        setInternships(internships.filter(i => i._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete internship", { id: loadingToast });
    }
  };

  const handleCreateCredit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding cloud credit tool...");
    try {
      const res = await api.post('/cloud-credits', newCredit);
      if (res.data.success) {
        toast.success("Cloud Credit added!", { id: loadingToast });
        setCredits([...credits, res.data.data]);
        setNewCredit({ title: '', platform: '', category: 'cloud', link: '', description: '', icon: '☁️', eligibility: '', order: 1 });
      }
    } catch (err) {
      toast.error("Failed to add credit benefit", { id: loadingToast });
    }
  };

  const handleDeleteCredit = async (id) => {
    if (!window.confirm("Delete this cloud credit perk?")) return;
    const loadingToast = toast.loading("Deleting perk...");
    try {
      const res = await api.delete(`/cloud-credits/${id}`);
      if (res.data.success) {
        toast.success("Perk deleted", { id: loadingToast });
        setCredits(credits.filter(c => c._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete perk", { id: loadingToast });
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
    <div className="admin-dashboard fade-in max-w-7xl mx-auto pb-16 px-4">
      {/* Header and Welcome banner */}
      <div className="admin-hero card p-8 bg-gradient-to-br from-indigo-50/70 to-emerald-50/40 dark:from-slate-900 dark:to-indigo-950/70 border border-indigo-100 dark:border-indigo-900/30 shadow-md dark:shadow-2xl rounded-3xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] font-black text-emerald-700 dark:text-indigo-400 uppercase tracking-widest bg-emerald-50 dark:bg-indigo-950 border border-emerald-200/60 dark:border-indigo-900/50 px-3 py-1 rounded-full">
              Teammate Portal
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mt-3 mb-1 tracking-tight">Admin & Teammate Workspace</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Personalize student trajectories, oversee specializations, and customize platform curriculums.</p>
          </div>

          <div className="flex flex-wrap gap-2 bg-slate-100/80 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/60 dark:border-white/5">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'users' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              👥 Users
            </button>
            <button
              onClick={() => setActiveTab('domains')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'domains' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              🗺️ Domains
            </button>
            <button
              onClick={() => {
                setActiveTab('topics');
                fetchTopics();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'topics' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              📚 Topics
            </button>
            <button
              onClick={() => {
                setActiveTab('assessments');
                fetchAssessments();
                fetchTopics();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'assessments' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              📝 Assessments
            </button>
            <button
              onClick={() => {
                setActiveTab('blogs');
                fetchBlogs();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'blogs' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              📝 Blogs
            </button>
            <button
              onClick={() => {
                setActiveTab('projects');
                fetchProjects();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'projects' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              🛠️ Projects
            </button>
            <button
              onClick={() => {
                setActiveTab('internships');
                fetchInternships();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'internships' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              💼 Internships
            </button>
            <button
              onClick={() => {
                setActiveTab('credits');
                fetchCredits();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'credits' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              ☁️ Credits
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Overview row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Registered</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiUsers className="text-indigo-650 dark:text-indigo-400 text-lg" /> {stats?.totalUsers || 0}
          </div>
        </div>
        <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Students</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiUserCheck className="text-emerald-650 dark:text-emerald-400 text-lg" /> {stats?.totalStudents || 0}
          </div>
        </div>
        <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Assigned Mentors</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiAward className="text-amber-550 dark:text-amber-400 text-lg" /> {stats?.totalMentors || 0}
          </div>
        </div>
        <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Active Specializations</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiMap className="text-purple-650 dark:text-purple-400 text-lg" /> {stats?.totalDomains || 0}
          </div>
        </div>
        <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl col-span-2 md:col-span-1 shadow-sm hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Milestones</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiCheckSquare className="text-sky-650 dark:text-sky-400 text-lg" /> {stats?.totalAssessments || 0}
          </div>
        </div>
      </div>

      {/* Tabs panels */}
      {activeTab === 'users' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          {/* Controls toolbar */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search registered teammates or students by name/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-all font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Privilege Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
              >
                <option value="all">Show All Users</option>
                <option value="student">Students Only</option>
                <option value="mentor">Mentors Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>
          </div>

          {/* Users Grid/Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[10px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                  <th className="p-4">User Identity</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Selected Specialization</th>
                  <th className="p-4">XP & Progress</th>
                  <th className="p-4">Academic details</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-indigo-600/20 border border-emerald-100 dark:border-indigo-500/20 text-emerald-700 dark:text-indigo-400 font-black text-sm flex items-center justify-center">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white text-xs block">{user.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 rounded-lg px-2 py-1.5 text-[10px] font-black text-emerald-700 dark:text-indigo-300 uppercase tracking-wider focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
                        >
                          <option value="student">Student</option>
                          <option value="mentor">Mentor</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td className="p-4">
                        {user.selectedDomain ? (
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg">
                            🚀 {user.selectedDomain.name}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unselected</span>
                        )}
                      </td>
                      <td className="p-4 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black">
                          <span className="text-amber-600 dark:text-amber-400">{user.xp || 0} XP • Lvl {Math.floor((user.xp || 0) / 1000) + 1}</span>
                          <span className="text-emerald-700 dark:text-indigo-400">{user.overallProgress || 0}% Complete</span>
                        </div>
                        <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-950/80 rounded-full overflow-hidden border border-slate-300/40 dark:border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-indigo-500 dark:to-indigo-400 transition-all duration-300"
                            style={{ width: `${user.overallProgress || 0}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-4">
                        {user.profile?.collegeName ? (
                          <div>
                            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold block">{user.profile.collegeName.substring(0, 25)}</span>
                            <span className="text-[9px] text-slate-550 dark:text-slate-550 font-semibold block">{user.profile.branch} • Year {user.profile.year}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No academic profile</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openPersonalizeDrawer(user)}
                            className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 flex items-center justify-center text-xs hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
                            title="Personalize & View details"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 dark:border-rose-500/10 flex items-center justify-center text-xs hover:bg-rose-500 hover:text-white transition-all"
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
      )}

      {activeTab === 'domains' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Domain Specializations</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Overview of registered learning pathways inside CareerForge</p>
            </div>
            <button
              onClick={() => setShowDomainModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2"
            >
              <FiPlus /> Add Domain
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {domains.map((dom) => (
              <div key={dom._id} className="bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-black text-slate-800 dark:text-white text-sm">{dom.name}</h4>
                    <span className="text-[8px] font-black text-emerald-700 dark:text-indigo-400 uppercase tracking-widest bg-emerald-50 dark:bg-indigo-950 border border-emerald-200 dark:border-indigo-900 px-2 py-0.5 rounded-full">{dom.slug}</span>
                  </div>
                  <p className="text-slate-650 dark:text-slate-400 text-xs leading-relaxed mt-2 line-clamp-3">{dom.shortDescription}</p>
                  {dom.certificationLink && (
                    <div className="mt-3 truncate">
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 block">CERTIFICATION LINK:</span>
                      <a href={dom.certificationLink} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-indigo-400 hover:underline">
                        {dom.certificationLink}
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex justify-between items-center text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                  <div className="flex gap-1.5">
                    <span className="bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">⏳ {dom.estimatedDuration || '4-6 months'}</span>
                    <span className="bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">🔥 {dom.difficultyLevel || 'Intermediate'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDomain(dom)}
                      className="px-2.5 py-1 bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 rounded-lg hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                    >
                      <FiEdit size={10} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDomain(dom._id)}
                      className="px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-550/10 dark:border-rose-500/10 rounded-lg hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1"
                    >
                      <FiTrash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Topic Video & Documentation Links</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Edit lecture videos and study guide documentation for each topic</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filter Domain:</span>
              <select
                value={selectedDomainForTopics}
                onChange={(e) => setSelectedDomainForTopics(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
              >
                <option value="">Select Domain...</option>
                {domains.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedDomainForTopics ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[10px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                    <th className="p-4">Topic Title</th>
                    <th className="p-4">YouTube Video Link</th>
                    <th className="p-4">GFG/Doc Link</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {topics.filter(t => (t.domainId?._id || t.domainId) === selectedDomainForTopics).length > 0 ? (
                    topics.filter(t => (t.domainId?._id || t.domainId) === selectedDomainForTopics).map((t) => (
                      <tr key={t._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-slate-800 dark:text-white text-xs block">{t.title}</span>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Order: {t.order} • {t.difficulty}</span>
                        </td>
                        <td className="p-4">
                          {t.youtubeLink ? (
                            <a href={t.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-650 dark:text-indigo-400 hover:underline truncate block max-w-xs">
                              {t.youtubeLink}
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-slate-650 italic">No Video Link</span>
                          )}
                        </td>
                        <td className="p-4">
                          {t.gfgLink ? (
                            <a href={t.gfgLink} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-605 dark:text-emerald-400 hover:underline truncate block max-w-xs">
                              {t.gfgLink}
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-slate-650 italic">No Doc Link</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setEditingTopic(t)}
                            className="px-3 py-1.5 bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 rounded-lg text-[10px] font-black hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-1"
                          >
                            <FiVideo size={10} /> Edit Video & Docs
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500 text-xs font-semibold">
                        No topics found for this domain path.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 dark:text-slate-550 text-xs font-black bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
              Please select a domain specialization path from the filter dropdown to view and edit topics.
            </div>
          )}
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <div className="flex gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
            <button
              onClick={() => setAssessmentsSubTab('milestones')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                assessmentsSubTab === 'milestones'
                  ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Milestone External Tests
            </button>
            <button
              onClick={() => setAssessmentsSubTab('devops')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                assessmentsSubTab === 'devops'
                  ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              DevOps MCQ Assessments
            </button>
          </div>

          {assessmentsSubTab === 'milestones' ? (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Milestone Assessments</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Manage and assign diagnostic tests / validation assessments to specific domains</p>
                </div>
                <button
                  onClick={() => {
                    if (domains.length === 0) {
                      toast.error("Please add a domain specialization path first!");
                      return;
                    }
                    setNewAssessment({
                      ...newAssessment,
                      domainId: domains[0]._id
                    });
                    setShowAssessmentModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2"
                >
                  <FiPlus /> Assign Assessment
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map((a) => {
                  const domain = domains.find(d => d._id === (a.domainId?._id || a.domainId));
                  return (
                    <div key={a._id} className="bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-black text-slate-800 dark:text-white text-sm">{a.title}</h4>
                          <span className="text-[8px] font-black text-emerald-700 dark:text-indigo-400 uppercase tracking-widest bg-emerald-50 dark:bg-indigo-950 border border-emerald-200 dark:border-indigo-900 px-2 py-0.5 rounded-full">{a.platform}</span>
                        </div>
                        <p className="text-slate-650 dark:text-slate-400 text-xs leading-relaxed mt-2 line-clamp-3">{a.description || "No description provided."}</p>
                        <div className="mt-3">
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 block">TARGET DOMAIN:</span>
                          <span className="text-xs font-bold text-emerald-700 dark:text-indigo-300">{domain ? domain.name : 'All Specializations'}</span>
                        </div>
                        <div className="mt-3 truncate">
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 block">TEST URL:</span>
                          <a href={a.assessmentLink} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-indigo-400 hover:underline">
                            {a.assessmentLink}
                          </a>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex justify-between items-center text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                        <span className="text-slate-700 dark:text-slate-300">🎯 Pass: {a.passingScore}%</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingAssessment(a)}
                            className="px-2.5 py-1 bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 rounded-lg hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAssessment(a._id)}
                            className="px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-550/10 dark:border-rose-500/10 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {assessments.length === 0 && (
                  <div className="col-span-3 p-12 text-center text-slate-500 dark:text-slate-550 text-xs font-black bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
                    No milestone assessments assigned yet. Click "Assign Assessment" to begin!
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white">DevOps Topic MCQs</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Manage the 10-question MCQ quizzes for all DevOps roadmap tracks.</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[9px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-3">Topic Title</th>
                      <th className="p-3">Phase / Level</th>
                      <th className="p-3">Questions</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {topics.filter(t => (t.domainId?.slug === 'devops' || t.domainId === 'devops' || (typeof t.domainId === 'object' && t.domainId?.slug === 'devops'))).length > 0 ? (
                      topics.filter(t => (t.domainId?.slug === 'devops' || t.domainId === 'devops' || (typeof t.domainId === 'object' && t.domainId?.slug === 'devops'))).map((t) => (
                        <tr key={t._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-slate-800 dark:text-white">{t.title}</td>
                          <td className="p-3 text-slate-500 font-bold uppercase">Level {t.phaseId?.phaseNumber ?? 0}</td>
                          <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">10 Questions (Pass &ge; 70%)</td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEditDevopsAssessment(t)}
                                className="px-3 py-1.5 bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 rounded-lg hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 font-black uppercase tracking-wider text-[10px]"
                              >
                                <FiEdit size={10} /> Edit Questions
                              </button>
                              <button
                                onClick={() => fetchDevopsStatsAndScores(t._id)}
                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/10 rounded-lg hover:bg-indigo-650 hover:text-white transition-all flex items-center gap-1 font-black uppercase tracking-wider text-[10px]"
                              >
                                <FiActivity size={10} /> Performance Scores
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500 italic">No DevOps topics loaded yet. Make sure to seed or select DevOps domain first.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'blogs' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Manage Community Blogs</h3>
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Create Form */}
            <form onSubmit={handleCreateBlog} className="lg:col-span-5 space-y-4 text-xs font-semibold">
              <h4 className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">Create Blog Post</h4>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  placeholder="Demystifying JavaScript Event Loop"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Author Name</label>
                <input 
                  type="text" 
                  value={newBlog.author}
                  onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Category</label>
                  <select 
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Data Science">Data Science</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Tags (comma-separated)</label>
                  <input 
                    type="text" 
                    value={newBlog.tags}
                    onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                    placeholder="javascript, event-loop, webdev"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Cover Image URL</label>
                <input 
                  type="url" 
                  value={newBlog.imageUrl}
                  onChange={(e) => setNewBlog({ ...newBlog, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Article Content</label>
                <textarea 
                  rows="4"
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  placeholder="Write full article body content..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-600 dark:bg-indigo-600 hover:bg-emerald-500 dark:hover:bg-indigo-500 text-white font-black rounded-xl uppercase tracking-wider transition-colors cursor-pointer text-xs"
              >
                Create Blog Post
              </button>
            </form>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">Active Blog Posts</h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[9px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-3">Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Author</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {blogs.length > 0 ? (
                      blogs.map(blog => (
                        <tr key={blog._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{blog.title}</td>
                          <td className="p-3 text-[10px] text-indigo-400 uppercase font-black">{blog.category}</td>
                          <td className="p-3 text-slate-500">{blog.author}</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500 italic">No blog posts seeded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Manage Guided Capstone Projects</h3>
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Create Form */}
            <form onSubmit={handleCreateProject} className="lg:col-span-5 space-y-4 text-xs font-semibold">
              <h4 className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">Create Capstone Project</h4>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="E-Commerce Microservices Orchestration"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Domain Track</label>
                  <select 
                    value={newProject.domain}
                    onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="webdev">Web Development (webdev)</option>
                    <option value="devops">DevOps (devops)</option>
                    <option value="datascience">Data Science (datascience)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Difficulty</label>
                  <select 
                    value={newProject.difficulty}
                    onChange={(e) => setNewProject({ ...newProject, difficulty: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Description</label>
                <textarea 
                  rows="2"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Brief high-level description of requirements..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Checklist Steps (Format: "Title: Guidance" - one per line)</label>
                <textarea 
                  rows="3"
                  value={newProject.steps}
                  onChange={(e) => setNewProject({ ...newProject, steps: e.target.value })}
                  placeholder="Local Orchestration: Create a docker-compose definition&#10;Containerize Services: Write multi-stage Dockerfiles"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Phase Roadmap (Format: "Phase Name: Task 1, Task 2" - one per line)</label>
                <textarea 
                  rows="3"
                  value={newProject.roadmap}
                  onChange={(e) => setNewProject({ ...newProject, roadmap: e.target.value })}
                  placeholder="Phase 1 - Containerization: Dockerfiles, Secrets management&#10;Phase 2 - Kubernetes: Deployments, Services, ConfigMaps"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-600 dark:bg-indigo-600 hover:bg-emerald-500 dark:hover:bg-indigo-500 text-white font-black rounded-xl uppercase tracking-wider transition-colors cursor-pointer text-xs"
              >
                Create Project Blueprint
              </button>
            </form>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">Active Capstone Project Blueprints</h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[9px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-3">Project Title</th>
                      <th className="p-3">Track</th>
                      <th className="p-3">Difficulty</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {projects.length > 0 ? (
                      projects.map(p => (
                        <tr key={p._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-slate-800 dark:text-white">{p.title}</td>
                          <td className="p-3 text-[10px] text-emerald-550 uppercase font-black">{p.domain}</td>
                          <td className="p-3 text-slate-550 capitalize">{p.difficulty}</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleDeleteProject(p._id)}
                              className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500 italic">No guided projects found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'internships' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Manage Internship Board</h3>
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Create Form */}
            <form onSubmit={handleCreateInternship} className="lg:col-span-5 space-y-4 text-xs font-semibold">
              <h4 className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">List Internship Position</h4>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newInternship.title}
                  onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                  placeholder="Frontend Engineer Intern"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    value={newInternship.company}
                    onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                    placeholder="Vercel Inc."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={newInternship.location}
                    onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                    placeholder="Remote / Hybrid"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Stipend / Month</label>
                  <input 
                    type="text" 
                    value={newInternship.stipend}
                    onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })}
                    placeholder="$2,500 / Month"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Domain Path</label>
                  <select 
                    value={newInternship.domain}
                    onChange={(e) => setNewInternship({ ...newInternship, domain: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="webdev">Web Development (webdev)</option>
                    <option value="devops">DevOps (devops)</option>
                    <option value="datascience">Data Science (datascience)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Application URL</label>
                <input 
                  type="url" 
                  value={newInternship.applyLink}
                  onChange={(e) => setNewInternship({ ...newInternship, applyLink: e.target.value })}
                  placeholder="https://vercel.com/careers"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Candidate Requirements (one per line)</label>
                <textarea 
                  rows="2"
                  value={newInternship.requirements}
                  onChange={(e) => setNewInternship({ ...newInternship, requirements: e.target.value })}
                  placeholder="Proficient in React & TS&#10;Familiarity with TailwindCSS"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Short Role Description</label>
                <textarea 
                  rows="3"
                  value={newInternship.description}
                  onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                  placeholder="Provide a description of the tasks the intern will perform..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-600 dark:bg-indigo-600 hover:bg-emerald-500 dark:hover:bg-indigo-500 text-white font-black rounded-xl uppercase tracking-wider transition-colors cursor-pointer text-xs"
              >
                List Position
              </button>
            </form>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">Active Internship Board</h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[9px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-3">Role Title</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Location</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {internships.length > 0 ? (
                      internships.map(i => (
                        <tr key={i._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-slate-800 dark:text-white">{i.title}</td>
                          <td className="p-3 text-emerald-750 dark:text-indigo-400 font-bold">{i.company}</td>
                          <td className="p-3 text-slate-500">{i.location}</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleDeleteInternship(i._id)}
                              className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500 italic">No internship positions active.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'credits' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Manage Cloud Credits & Free Perks</h3>
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Create Form */}
            <form onSubmit={handleCreateCredit} className="lg:col-span-5 space-y-4 text-xs font-semibold">
              <h4 className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">Add Free Perk</h4>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newCredit.title}
                  onChange={(e) => setNewCredit({ ...newCredit, title: e.target.value })}
                  placeholder="GitHub Student Developer Pack"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Platform Name</label>
                  <input 
                    type="text" 
                    value={newCredit.platform}
                    onChange={(e) => setNewCredit({ ...newCredit, platform: e.target.value })}
                    placeholder="GitHub / Google Cloud"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Category</label>
                  <select 
                    value={newCredit.category}
                    onChange={(e) => setNewCredit({ ...newCredit, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="cloud">Cloud Credits (cloud)</option>
                    <option value="education">Education Pack (education)</option>
                    <option value="hosting">Hosting Service (hosting)</option>
                    <option value="database">Database (database)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Icon Emoji</label>
                  <input 
                    type="text" 
                    value={newCredit.icon}
                    onChange={(e) => setNewCredit({ ...newCredit, icon: e.target.value })}
                    placeholder="☁️"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Display Order</label>
                  <input 
                    type="number" 
                    value={newCredit.order}
                    onChange={(e) => setNewCredit({ ...newCredit, order: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Claim Link</label>
                <input 
                  type="url" 
                  value={newCredit.link}
                  onChange={(e) => setNewCredit({ ...newCredit, link: e.target.value })}
                  placeholder="https://education.github.com/pack"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Candidate Eligibility Requirements</label>
                <input 
                  type="text" 
                  value={newCredit.eligibility}
                  onChange={(e) => setNewCredit({ ...newCredit, eligibility: e.target.value })}
                  placeholder="Students with active .edu email address"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Short Description</label>
                <textarea 
                  rows="2"
                  value={newCredit.description}
                  onChange={(e) => setNewCredit({ ...newCredit, description: e.target.value })}
                  placeholder="Free premium student developer tools pack..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-600 dark:bg-indigo-600 hover:bg-emerald-500 dark:hover:bg-indigo-500 text-white font-black rounded-xl uppercase tracking-wider transition-colors cursor-pointer text-xs"
              >
                Add Credit Perk
              </button>
            </form>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">Active Credits & Perks</h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[9px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-3">Perk Title</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {credits.length > 0 ? (
                      credits.map(c => (
                        <tr key={c._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-slate-800 dark:text-white">{c.icon} {c.title}</td>
                          <td className="p-3 text-emerald-700 dark:text-indigo-400 font-bold">{c.platform}</td>
                          <td className="p-3 text-slate-550 uppercase font-black text-[9px]">{c.category}</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleDeleteCredit(c._id)}
                              className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500 italic">No free perks listed yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Personalization Modal (Drawer style) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/5 h-full overflow-y-auto p-8 shadow-2xl flex flex-col justify-between">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-indigo-600/20 border border-emerald-100 dark:border-indigo-500/20 text-emerald-700 dark:text-indigo-400 font-black text-lg flex items-center justify-center">
                    {selectedUser.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">{selectedUser.fullName}</h3>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{selectedUser.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <FiX />
                </button>
              </div>

              {/* Progress & Personalization Slider Console */}
              <div className="bg-emerald-50/50 dark:bg-indigo-950/20 border border-emerald-100 dark:border-indigo-900/30 rounded-2xl p-5 space-y-4">
                <h4 className="text-[10px] font-black text-emerald-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <FiSettings /> Teammate Personalization panel
                </h4>

                <div className="space-y-4">
                  {/* XP update */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Custom User XP Balance:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={customXp}
                        onChange={(e) => setCustomXp(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950/85 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-bold w-full focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
                      />
                      <button
                        onClick={() => setCustomXp(Number(customXp) + 250)}
                        className="px-2.5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[9px] font-black text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                      >
                        +250 XP
                      </button>
                    </div>
                  </div>

                  {/* Progress percentage slider */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-550 dark:text-slate-400 mb-1">
                      <span>Curriculum Completion Progress:</span>
                      <span className="text-slate-800 dark:text-white font-black">{customProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={customProgress}
                      onChange={(e) => setCustomProgress(e.target.value)}
                      className="w-full accent-emerald-650 dark:accent-indigo-500"
                    />
                  </div>

                  {/* Current phase */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Current Active Learning Phase Index:</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={customPhase}
                      onChange={(e) => setCustomPhase(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950/85 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-bold w-full focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveProgress}
                    disabled={updatingProgress}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-slate-350 dark:disabled:bg-indigo-800 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    {updatingProgress ? "Applying Changes..." : "Apply Personalization Settings"}
                  </button>
                </div>
              </div>

              {/* Onboarding Profiles & Stats details */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Academic & Onboarding Summary</h4>

                {selectedUser.profile?.collegeName ? (
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-2">
                      <div className="flex justify-between"><span className="text-slate-500">Institution:</span><span className="text-slate-800 dark:text-white font-bold">{selectedUser.profile.collegeName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Branch & Year:</span><span className="text-slate-800 dark:text-white font-bold">{selectedUser.profile.branch} • Year {selectedUser.profile.year}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Daily Study Target:</span><span className="text-slate-800 dark:text-white font-bold">{selectedUser.profile.dailyStudyTime || 0} minutes</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Pace:</span><span className="text-emerald-700 dark:text-indigo-400 font-bold">{selectedUser.profile.roadmapType || "Steady"}</span></div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-2">
                      <span className="text-[10px] text-slate-500 block">Languages & Tools:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedUser.profile.knownLanguages?.map(lang => (
                          <span key={lang} className="text-[9px] bg-white dark:bg-slate-800/60 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-semibold">{lang}</span>
                        ))}
                        {selectedUser.profile.knownTools?.map(tool => (
                          <span key={tool} className="text-[9px] bg-white dark:bg-slate-800/60 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-semibold">{tool}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs italic">User has not completed the interest onboarding profile.</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-white/5 pt-6 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 bg-slate-150 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl text-xs font-black transition-all"
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
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Add New Domain Specialized Path</h3>
              <button
                onClick={() => setShowDomainModal(false)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateDomain} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Domain Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Computing"
                  value={newDomain.name}
                  onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Unique Slug:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cloud-computing"
                  value={newDomain.slug}
                  onChange={(e) => setNewDomain({ ...newDomain, slug: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Description:</label>
                <textarea
                  placeholder="Summarize the career specialization target..."
                  rows="3"
                  value={newDomain.shortDescription}
                  onChange={(e) => setNewDomain({ ...newDomain, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Duration:</label>
                  <input
                    type="text"
                    value={newDomain.estimatedDuration}
                    onChange={(e) => setNewDomain({ ...newDomain, estimatedDuration: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Difficulty:</label>
                  <select
                    value={newDomain.difficultyLevel}
                    onChange={(e) => setNewDomain({ ...newDomain, difficultyLevel: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Global Certification Link:</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newDomain.certificationLink}
                  onChange={(e) => setNewDomain({ ...newDomain, certificationLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Create Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Domain Modal */}
      {editingDomain && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Edit Domain Specialization</h3>
              <button
                onClick={() => setEditingDomain(null)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateDomain} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Domain Name:</label>
                <input
                  type="text"
                  required
                  value={editingDomain.name}
                  onChange={(e) => setEditingDomain({ ...editingDomain, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Unique Slug:</label>
                <input
                  type="text"
                  required
                  value={editingDomain.slug}
                  onChange={(e) => setEditingDomain({ ...editingDomain, slug: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Description:</label>
                <textarea
                  rows="3"
                  value={editingDomain.shortDescription}
                  onChange={(e) => setEditingDomain({ ...editingDomain, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Duration:</label>
                  <input
                    type="text"
                    value={editingDomain.estimatedDuration}
                    onChange={(e) => setEditingDomain({ ...editingDomain, estimatedDuration: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Difficulty:</label>
                  <select
                    value={editingDomain.difficultyLevel}
                    onChange={(e) => setEditingDomain({ ...editingDomain, difficultyLevel: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Global Certification Link:</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingDomain.certificationLink || ''}
                  onChange={(e) => setEditingDomain({ ...editingDomain, certificationLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDomain(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Edit Topic Resource Links & Assessment</h3>
              <button
                onClick={() => setEditingTopic(null)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateTopicLinks} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-black text-slate-550 dark:text-slate-400 block">TOPIC TITLE:</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white block mt-1">{editingTopic.title}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">YouTube Video Link:</label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/watch?v=... or video ID"
                    value={editingTopic.youtubeLink || ''}
                    onChange={(e) => setEditingTopic({ ...editingTopic, youtubeLink: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Documentation (GFG/Other) Link:</label>
                  <input
                    type="url"
                    placeholder="https://geeksforgeeks.org/..."
                    value={editingTopic.gfgLink || ''}
                    onChange={(e) => setEditingTopic({ ...editingTopic, gfgLink: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <hr className="border-slate-100 dark:border-white/5" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Mini Assessment (MCQ)</h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 border border-emerald-200 dark:border-indigo-800 text-emerald-700 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Passing Percentage (%):</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingTopic.miniAssessment?.passingPercentage ?? 60}
                      onChange={(e) => setEditingTopic({
                        ...editingTopic,
                        miniAssessment: {
                          ...(editingTopic.miniAssessment || { questions: [] }),
                          passingPercentage: Number(e.target.value)
                        }
                      })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {(!editingTopic.miniAssessment?.questions || editingTopic.miniAssessment.questions.length === 0) ? (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                      <p className="text-[10px] text-slate-400 font-bold">No custom assessment questions defined.</p>
                      <p className="text-[9px] text-slate-400/80 font-medium mt-0.5">(Will fallback to default keyword-matching MCQ quiz)</p>
                    </div>
                  ) : (
                    editingTopic.miniAssessment.questions.map((q, qIdx) => (
                      <div key={qIdx} className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(qIdx)}
                          className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 text-xs font-bold"
                          title="Delete Question"
                        >
                          ✕ Delete
                        </button>
                        
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Question {qIdx + 1} Prompt:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. What is the time complexity of reading arr[i]?"
                            value={q.prompt || ''}
                            onChange={(e) => handleUpdateQuestion(qIdx, 'prompt', e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {[0, 1, 2, 3].map((optIdx) => (
                            <div key={optIdx}>
                              <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Option {optIdx + 1}:</label>
                              <input
                                type="text"
                                required
                                placeholder={`Option ${optIdx + 1}`}
                                value={q.options?.[optIdx] || ''}
                                onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-1 text-[11px] text-slate-800 dark:text-white focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Correct Answer:</label>
                          <select
                            required
                            value={q.answer || ''}
                            onChange={(e) => handleUpdateQuestion(qIdx, 'answer', e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                          >
                            <option value="">-- Select Correct Option --</option>
                            {(q.options || []).map((opt, oIdx) => (
                              <option key={oIdx} value={opt} disabled={!opt}>{opt || `Option ${oIdx + 1} (Empty)`}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Save Links & Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign/Add Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Assign Milestone Assessment</h3>
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Assessment Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced DevOps Challenge"
                  value={newAssessment.title}
                  onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Target Domain Specialization:</label>
                <select
                  required
                  value={newAssessment.domainId}
                  onChange={(e) => setNewAssessment({ ...newAssessment, domainId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                >
                  {domains.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Platform Provider:</label>
                <select
                  value={newAssessment.platform}
                  onChange={(e) => setNewAssessment({ ...newAssessment, platform: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                >
                  <option value="HackerRank">HackerRank</option>
                  <option value="GFG">GeeksforGeeks</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="CodeChef">CodeChef</option>
                  <option value="Custom">Custom</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Test/Assessment Link:</label>
                <input
                  type="url"
                  required
                  placeholder="https://hackerrank.com/..."
                  value={newAssessment.assessmentLink}
                  onChange={(e) => setNewAssessment({ ...newAssessment, assessmentLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Passing Score (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAssessment.passingScore}
                    onChange={(e) => setNewAssessment({ ...newAssessment, passingScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Short Description:</label>
                <textarea
                  rows="2"
                  placeholder="Tell students what is required in this milestone test..."
                  value={newAssessment.description}
                  onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssessmentModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Assign Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Assessment Modal */}
      {editingAssessment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Edit Milestone Assessment</h3>
              <button
                onClick={() => setEditingAssessment(null)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateAssessment} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Assessment Title:</label>
                <input
                  type="text"
                  required
                  value={editingAssessment.title}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Target Domain Specialization:</label>
                <select
                  required
                  value={editingAssessment.domainId?._id || editingAssessment.domainId}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, domainId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                >
                  {domains.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Platform Provider:</label>
                <select
                  value={editingAssessment.platform}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, platform: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                >
                  <option value="HackerRank">HackerRank</option>
                  <option value="GFG">GeeksforGeeks</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="CodeChef">CodeChef</option>
                  <option value="Custom">Custom</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Test/Assessment Link:</label>
                <input
                  type="url"
                  required
                  value={editingAssessment.assessmentLink}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, assessmentLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-555 dark:text-slate-400 block mb-1">Passing Score (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingAssessment.passingScore}
                    onChange={(e) => setEditingAssessment({ ...editingAssessment, passingScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-555 dark:text-slate-400 block mb-1">Short Description:</label>
                <textarea
                  rows="2"
                  value={editingAssessment.description}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAssessment(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DevOps Assessment MCQ Edit Modal */}
      {showDevopsEditModal && editingDevopsAssessment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Edit DevOps MCQ Mini Assessment</h3>
              <button
                onClick={() => {
                  setShowDevopsEditModal(false);
                  setEditingDevopsAssessment(null);
                }}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveDevopsAssessment} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Assessment Title:</label>
                <input
                  type="text"
                  required
                  value={editingDevopsAssessment.title}
                  onChange={(e) => setEditingDevopsAssessment({ ...editingDevopsAssessment, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {editingDevopsAssessment.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl space-y-4 relative">
                    <div className="text-xs font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
                      Question {qIdx + 1} of 10
                    </div>
                    
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Prompt / Question Text:</label>
                      <textarea
                        required
                        rows="2"
                        placeholder="e.g. Which tool is standard for container orchestration?"
                        value={q.question || ''}
                        onChange={(e) => {
                          const updatedQs = [...editingDevopsAssessment.questions];
                          updatedQs[qIdx] = { ...q, question: e.target.value };
                          setEditingDevopsAssessment({ ...editingDevopsAssessment, questions: updatedQs });
                        }}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[0, 1, 2, 3].map((optIdx) => (
                        <div key={optIdx}>
                          <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Option {optIdx + 1}:</label>
                          <input
                            type="text"
                            required
                            placeholder={`Option ${optIdx + 1}`}
                            value={q.options?.[optIdx] || ''}
                            onChange={(e) => {
                              const updatedQs = [...editingDevopsAssessment.questions];
                              const newOpts = [...(q.options || ['', '', '', ''])];
                              newOpts[optIdx] = e.target.value;
                              
                              let correctAns = q.correctAnswer;
                              if (correctAns && !newOpts.includes(correctAns)) {
                                correctAns = '';
                              }
                              
                              updatedQs[qIdx] = { ...q, options: newOpts, correctAnswer: correctAns };
                              setEditingDevopsAssessment({ ...editingDevopsAssessment, questions: updatedQs });
                            }}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Correct Answer Match:</label>
                        <select
                          required
                          value={q.correctAnswer || ''}
                          onChange={(e) => {
                            const updatedQs = [...editingDevopsAssessment.questions];
                            updatedQs[qIdx] = { ...q, correctAnswer: e.target.value };
                            setEditingDevopsAssessment({ ...editingDevopsAssessment, questions: updatedQs });
                          }}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none font-bold"
                        >
                          <option value="">-- Select Correct Answer Option --</option>
                          {q.options.map((opt, oIdx) => (
                            <option key={oIdx} value={opt} disabled={!opt}>{opt || `Option ${oIdx + 1} (Empty)`}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Explanation Hint:</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kubernetes orchestrates containers, Docker builds them."
                          value={q.explanation || ''}
                          onChange={(e) => {
                            const updatedQs = [...editingDevopsAssessment.questions];
                            updatedQs[qIdx] = { ...q, explanation: e.target.value };
                            setEditingDevopsAssessment({ ...editingDevopsAssessment, questions: updatedQs });
                          }}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDevopsEditModal(false);
                    setEditingDevopsAssessment(null);
                  }}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Save DevOps Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DevOps Assessment Statistics & Scores Modal */}
      {showDevopsStatsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Assessment Analytics & User Scores</h3>
              <button
                onClick={() => {
                  setShowDevopsStatsModal(false);
                  setDevopsStats(null);
                  setDevopsScores([]);
                }}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            {devopsStats && (
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl">
                  <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-0.5">Unique Users</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white">{devopsStats.uniqueUsers}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl">
                  <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-0.5">Total Attempts</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white">{devopsStats.totalAttempts}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl">
                  <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-0.5">Avg Score</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{Math.round(devopsStats.avgScore || 0)}%</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl">
                  <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-0.5">Pass Rate</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {devopsStats.uniqueUsers > 0 ? Math.round((devopsStats.passedUsers / devopsStats.uniqueUsers) * 100) : 0}%
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">User Performance Records</h4>
              <div className="overflow-y-auto max-h-[250px] rounded-xl border border-slate-150 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 custom-scrollbar text-xs">
                <table className="w-full text-left border-collapse font-semibold">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[9px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-3">Student Name</th>
                      <th className="p-3 text-center">Score</th>
                      <th className="p-3 text-center">Passed</th>
                      <th className="p-3 text-center">Attempts</th>
                      <th className="p-3 text-right">Completed Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {devopsScores.length > 0 ? (
                      devopsScores.map((scoreRec) => (
                        <tr key={scoreRec._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30">
                          <td className="p-3">
                            <span className="font-bold text-slate-800 dark:text-white block">{scoreRec.userId?.fullName || "Deleted User"}</span>
                            <span className="text-[9px] text-slate-550 mt-0.5 block">{scoreRec.userId?.email || ""}</span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-350">{scoreRec.score}%</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              scoreRec.passed 
                                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20' 
                                : 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
                            }`}>
                              {scoreRec.passed ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-650 dark:text-slate-400">{scoreRec.attempts}</td>
                          <td className="p-3 text-right text-slate-500 text-[10px]">
                            {scoreRec.completedAt ? new Date(scoreRec.completedAt).toLocaleDateString() : "Pending"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-slate-500 italic">No score records logged for this assessment yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowDevopsStatsModal(false);
                  setDevopsStats(null);
                  setDevopsScores([]);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-650 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl text-xs font-black transition-colors"
              >
                Close Metrics Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
