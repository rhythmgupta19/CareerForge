import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { 
  FiPlus, FiEdit2, FiTrash2, FiEye, FiSettings, FiCheckCircle, 
  FiXCircle, FiGrid, FiHelpCircle, FiChevronUp, FiChevronDown, FiBookOpen 
} from 'react-icons/fi';
import DevOpsAssessmentView from '../../components/devops/DevOpsAssessmentView';

const ManageAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [domains, setDomains] = useState([]);
  const [phases, setPhases] = useState([]);
  const [topics, setTopics] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [previewLevelId, setPreviewLevelId] = useState(null);
  const [previewTopicId, setPreviewTopicId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    roadmapId: '',
    levelId: '',
    moduleId: '',
    assignmentType: 'topic',
    passingPercentage: 70,
    maxAttempts: 3,
    timeLimitMinutes: 0,
    isPublished: true,
    order: 0,
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: ''
      }
    ]
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [assRes, domRes, phaseRes, topicRes] = await Promise.all([
        api.get('/assessments/admin/all'),
        api.get('/domains'),
        api.get('/phases'),
        api.get('/topics/all')
      ]);

      if (assRes.data.success) setAssessments(assRes.data.data);
      if (domRes.data.success) setDomains(domRes.data.data);
      if (phaseRes.data.success) setPhases(phaseRes.data.data);
      if (topicRes.data.success) setTopics(topicRes.data.data);
    } catch (err) {
      toast.error('Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingAssessment(null);
    setFormData({
      title: '',
      roadmapId: domains[0]?._id || '',
      levelId: '',
      moduleId: '',
      assignmentType: 'topic',
      passingPercentage: 70,
      maxAttempts: 3,
      timeLimitMinutes: 0,
      isPublished: true,
      order: assessments.length,
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: ''
        }
      ]
    });
    setModalOpen(true);
  };

  const openEditModal = (ass) => {
    setEditingAssessment(ass);
    setFormData({
      title: ass.title,
      roadmapId: ass.roadmapId?._id || ass.roadmapId || '',
      levelId: ass.levelId?._id || ass.levelId || '',
      moduleId: ass.moduleId?._id || ass.moduleId || '',
      assignmentType: ass.assignmentType || 'topic',
      passingPercentage: ass.passingPercentage || 70,
      maxAttempts: ass.maxAttempts || 3,
      timeLimitMinutes: ass.timeLimitMinutes || 0,
      isPublished: ass.isPublished !== undefined ? ass.isPublished : true,
      order: ass.order || 0,
      questions: ass.questions && ass.questions.length > 0 ? ass.questions.map(q => ({
        question: q.question,
        options: [...q.options],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || ''
      })) : [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: ''
        }
      ]
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    try {
      const res = await api.delete(`/assessments/admin/${id}`);
      if (res.data.success) {
        toast.success('Assessment deleted successfully');
        loadData();
      } else {
        toast.error(res.data.message || 'Delete failed.');
      }
    } catch (err) {
      toast.error('Failed to delete assessment.');
    }
  };

  const handleTogglePublish = async (ass) => {
    try {
      const res = await api.post('/assessments/admin/save', {
        assessmentId: ass._id,
        roadmapId: ass.roadmapId?._id || ass.roadmapId,
        levelId: ass.levelId?._id || ass.levelId,
        moduleId: ass.moduleId?._id || ass.moduleId,
        assignmentType: ass.assignmentType,
        title: ass.title,
        questions: ass.questions,
        isPublished: !ass.isPublished
      });
      if (res.data.success) {
        toast.success(ass.isPublished ? 'Assessment unpublished' : 'Assessment published');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleAddQuestion = () => {
    if (formData.questions.length >= 20) {
      toast.error('Maximum limit of 20 questions reached.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: ''
      }]
    }));
  };

  const handleRemoveQuestion = (idx) => {
    if (formData.questions.length === 1) return;
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const handleQuestionChange = (qIdx, field, value) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx][field] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx].options[oIdx] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Validations
    if (!formData.title.trim()) return toast.error('Assessment Title is required');
    if (!formData.roadmapId) return toast.error('Roadmap assignment is required');
    if (!formData.levelId) return toast.error('Roadmap Level is required');
    
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) return toast.error(`Question ${i + 1} prompt cannot be empty`);
      if (q.options.some(opt => !opt.trim())) return toast.error(`Fill all options for Question ${i + 1}`);
      if (!q.correctAnswer) return toast.error(`Select correct answer for Question ${i + 1}`);
      if (!q.options.includes(q.correctAnswer)) return toast.error(`Correct Answer for Question ${i + 1} must match one of the options`);
      if (!q.explanation.trim()) return toast.error(`Explanation is required for Question ${i + 1}`);
    }

    try {
      const payload = {
        ...formData,
        assessmentId: editingAssessment?._id || undefined
      };
      
      const res = await api.post('/assessments/admin/save', payload);
      if (res.data.success) {
        toast.success(editingAssessment ? 'Assessment updated successfully' : 'Assessment created successfully');
        setModalOpen(false);
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save assessment.');
    }
  };

  const handleReorder = async (idx, direction) => {
    const list = [...assessments];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap order
    const temp = list[idx].order;
    list[idx].order = list[targetIdx].order;
    list[targetIdx].order = temp;

    try {
      const orders = list.map(item => ({ id: item._id, order: item.order }));
      const res = await api.post('/assessments/admin/reorder', { orders });
      if (res.data.success) {
        toast.success('Ordering updated');
        loadData();
      }
    } catch (err) {
      toast.error('Reorder save failed.');
    }
  };

  const handlePreview = (ass) => {
    if (ass.assignmentType === 'level') {
      setPreviewLevelId(ass.levelId?._id || ass.levelId);
      setPreviewTopicId(null);
    } else {
      setPreviewTopicId(ass.moduleId?._id || ass.moduleId);
      setPreviewLevelId(null);
    }
    setPreviewOpen(true);
  };

  // Filters for selection cascading
  const filteredPhases = phases.filter(p => (p.domainId?._id || p.domainId) === formData.roadmapId);
  const filteredTopics = topics.filter(t => (t.phaseId?._id || t.phaseId) === formData.levelId);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-[#09090b] text-white min-h-screen">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-gradient">MCQ Assessment Management</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Configure &amp; Assign DevOps assessments</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-black uppercase tracking-wider rounded-xl transition duration-200 inline-flex items-center gap-1.5 shadow"
        >
          <FiPlus /> Create Assessment
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent mx-auto"></div>
        </div>
      ) : assessments.length === 0 ? (
        <div className="card p-12 text-center text-zinc-500 space-y-4">
          <div className="text-5xl">🧭</div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">No Assessments Found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">Create roadmap level or topic-level assessments to start grading DevOps student milestones.</p>
        </div>
      ) : (
        <div className="card border border-zinc-800 bg-[#141416] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead className="bg-zinc-900 text-zinc-300 font-black uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-4">Title / Target</th>
                  <th className="p-4">Assignment Scope</th>
                  <th className="p-4 text-center">Settings</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {assessments.map((ass, idx) => (
                  <tr key={ass._id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{ass.title}</div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">
                        Domain: {ass.roadmapId?.name || '(unassigned)'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          ass.assignmentType === 'level' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' :
                          ass.assignmentType === 'topic' ? 'bg-amber-950 text-amber-400 border border-amber-900' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {ass.assignmentType}
                        </span>
                        <span className="font-medium text-zinc-300">
                          {ass.assignmentType === 'level' ? `LVL ${ass.levelId?.phaseNumber || 0} - ${ass.levelId?.name || ''}` : 
                           ass.assignmentType === 'topic' ? `${ass.moduleId?.title || '(no topic)'}` : 
                           ass.roadmapId?.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="space-y-1 font-semibold text-[10px]">
                        <div>Pass score: <span className="text-emerald-400">{ass.passingPercentage}%</span></div>
                        <div>Time Limit: <span className="text-zinc-300">{ass.timeLimitMinutes === 0 ? 'Unlimited' : `${ass.timeLimitMinutes} min`}</span></div>
                        <div>Attempts: <span className="text-zinc-300">{ass.maxAttempts}</span></div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleTogglePublish(ass)}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border transition duration-200 ${
                          ass.isPublished 
                            ? 'bg-emerald-950 border-emerald-800 text-emerald-400' 
                            : 'bg-rose-950 border-rose-800 text-rose-450'
                        }`}
                      >
                        {ass.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handlePreview(ass)}
                          title="Preview Assessment"
                          className="p-2 bg-zinc-850 hover:bg-zinc-800 rounded-lg text-zinc-300 transition"
                        >
                          <FiEye size={13} />
                        </button>
                        <button 
                          onClick={() => openEditModal(ass)}
                          title="Edit Assessment"
                          className="p-2 bg-zinc-850 hover:bg-zinc-850/80 rounded-lg text-amber-500 transition"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(ass._id)}
                          title="Delete"
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-500 transition"
                        >
                          <FiTrash2 size={13} />
                        </button>
                        <div className="flex flex-col gap-0.5 ml-2 border-l border-zinc-800 pl-2">
                          <button 
                            onClick={() => handleReorder(idx, 'up')}
                            disabled={idx === 0}
                            className="text-zinc-650 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <FiChevronUp size={14} />
                          </button>
                          <button 
                            onClick={() => handleReorder(idx, 'down')}
                            disabled={idx === assessments.length - 1}
                            className="text-zinc-650 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <FiChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE/EDIT ASSESSMENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form 
            onSubmit={handleSave}
            className="w-full max-w-3xl bg-[#141416] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center shrink-0">
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                {editingAssessment ? 'Edit MCQ Assessment' : 'New MCQ Assessment'}
              </h2>
              <button 
                type="button" 
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-full">
                  <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Assessment Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Docker Advanced Level Assessment"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Roadmap Domain</label>
                  <select
                    value={formData.roadmapId}
                    onChange={(e) => setFormData(prev => ({ ...prev, roadmapId: e.target.value, levelId: '', moduleId: '' }))}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold focus:outline-none"
                  >
                    <option value="">Select Domain</option>
                    {domains.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Assignment Target</label>
                  <select
                    value={formData.assignmentType}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignmentType: e.target.value, moduleId: e.target.value === 'level' ? '' : prev.moduleId }))}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold focus:outline-none"
                  >
                    <option value="topic">Topic-Level Assessment</option>
                    <option value="level">Roadmap Level Assessment</option>
                    <option value="video">Video-Level Assessment</option>
                    <option value="course">Course/Domain-Level Assessment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Roadmap Level (Phase)</label>
                  <select
                    value={formData.levelId}
                    onChange={(e) => setFormData(prev => ({ ...prev, levelId: e.target.value, moduleId: '' }))}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold focus:outline-none"
                  >
                    <option value="">Select Level</option>
                    {filteredPhases.map(p => <option key={p._id} value={p._id}>Level {p.phaseNumber} - {p.name}</option>)}
                  </select>
                </div>

                {formData.assignmentType !== 'level' && (
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Module (Topic)</label>
                    <select
                      value={formData.moduleId}
                      onChange={(e) => setFormData(prev => ({ ...prev, moduleId: e.target.value }))}
                      className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold focus:outline-none"
                    >
                      <option value="">Select Topic</option>
                      {filteredTopics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-850 pt-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Passing score (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formData.passingPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, passingPercentage: parseInt(e.target.value, 10) }))}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Max Attempts allowed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxAttempts}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxAttempts: parseInt(e.target.value, 10) }))}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Time Limit (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 for unlimited"
                    value={formData.timeLimitMinutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeLimitMinutes: parseInt(e.target.value, 10) }))}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* QUESTIONS DYNAMIC LIST */}
              <div className="border-t border-zinc-850 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Questions ({formData.questions.length} / 20)</h3>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 transition"
                  >
                    <FiPlus /> Add Question
                  </button>
                </div>

                <div className="space-y-5">
                  {formData.questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl relative space-y-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        disabled={formData.questions.length === 1}
                        className="absolute top-4 right-4 text-rose-500 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                      >
                        Delete
                      </button>

                      <div className="space-y-1">
                        <label className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Question {qIdx + 1}</label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                          placeholder="e.g. Which command list directory contents?"
                          className="w-full p-3 bg-zinc-950 border border-zinc-850 rounded-xl text-white font-bold focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="space-y-0.5">
                            <label className="text-zinc-550 font-bold uppercase tracking-wider text-[8px]">Option {oIdx + 1}</label>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                              placeholder={`Option ${oIdx + 1}`}
                              className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-white font-semibold focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-zinc-550 font-bold uppercase tracking-wider text-[8px]">Correct Answer</label>
                          <select
                            value={q.correctAnswer}
                            onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)}
                            className="w-full p-3 bg-zinc-950 border border-zinc-850 rounded-xl text-white font-bold focus:outline-none"
                          >
                            <option value="">Select Option</option>
                            {q.options.map((opt, oIdx) => opt.trim() && <option key={oIdx} value={opt}>{opt}</option>)}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-550 font-bold uppercase tracking-wider text-[8px]">Explanation</label>
                          <textarea
                            value={q.explanation}
                            onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                            placeholder="Explanation of correct answer"
                            rows="2"
                            className="w-full p-3 bg-zinc-950 border border-zinc-850 rounded-xl text-white font-semibold focus:outline-none text-[10px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center shrink-0">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-400">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="rounded border-zinc-700 bg-zinc-900 text-[var(--primary)] focus:ring-[var(--primary)] h-4 w-4"
                />
                Publish immediately
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-white rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl text-xs font-black uppercase tracking-wider transition"
                >
                  Save Assessment
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* PREVIEW ASSESSMENT MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-[#141416] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center shrink-0">
              <h2 className="text-sm font-black uppercase tracking-wider text-amber-500">Preview Assessment (Student View)</h2>
              <button 
                type="button" 
                onClick={() => setPreviewOpen(false)}
                className="text-zinc-450 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col">
              {previewTopicId ? (
                <DevOpsAssessmentView 
                  topicId={previewTopicId}
                  onPassed={() => toast.success('Mock submission completed successfully')}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#09090b] text-center">
                  <FiCheckCircle size={40} className="text-emerald-500 mb-3" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Level-Level Assessment Mode</h3>
                  <p className="text-xs text-zinc-550 max-w-sm mt-1 leading-relaxed">
                    This is a level assessment preview. Level assessments are taken when all topics in a level are completed.
                  </p>
                  <button 
                    onClick={() => setPreviewOpen(false)}
                    className="mt-4 px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold"
                  >
                    Close Preview
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAssessments;
