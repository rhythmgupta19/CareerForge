import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { FiSave, FiX, FiExternalLink, FiBook, FiYoutube, FiCode, FiFileText } from 'react-icons/fi';

const EditTopic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    estimatedTime: '',
    theoryLink: '',
    gfgLink: '',
    youtubeLink: '',
    documentationLink: '',
    practiceLink: '',
    notesLink: '',
    instructor: ''
  });

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      const res = await api.get(`/topics/${id}`);
      const topicData = res.data.data;
      setTopic(topicData);
      setFormData({
        title: topicData.title || '',
        description: topicData.description || '',
        difficulty: topicData.difficulty || 'beginner',
        estimatedTime: topicData.estimatedTime || '',
        theoryLink: topicData.theoryLink || '',
        gfgLink: topicData.gfgLink || '',
        youtubeLink: topicData.youtubeLink || '',
        documentationLink: topicData.documentationLink || '',
        practiceLink: topicData.practiceLink || '',
        notesLink: topicData.notesLink || '',
        instructor: topicData.instructor || ''
      });
    } catch (error) {
      toast.error('Failed to load topic');
      navigate('/admin/topics');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/topics/${id}`, formData);
      toast.success('Topic resources updated successfully! 🎉');
      navigate('/admin/topics');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update topic');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 lg:px-8">
      <div className="mb-8">
        <div className="inline-block badge badge-blue mb-4 py-1.5 px-4 font-bold">Admin Panel</div>
        <h1 className="text-4xl font-extrabold text-[var(--text-main)] tracking-tight mb-3">
          Edit Topic Resources
        </h1>
        <p className="text-[var(--text-muted)] text-lg font-medium">
          Manage learning resources and links for: <span className="font-black text-[var(--primary)]">{topic?.title}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
          <h2 className="text-xl font-black text-[var(--text-main)] mb-6 flex items-center gap-2">
            <FiBook className="text-[var(--primary)]" />
            Basic Information
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                Topic Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input w-full resize-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                  Estimated Time
                </label>
                <input
                  type="text"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  placeholder="e.g., 2 hours"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                  Instructor
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  placeholder="e.g., Apna College"
                  className="input w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Learning Resources Card */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
          <h2 className="text-xl font-black text-[var(--text-main)] mb-6 flex items-center gap-2">
            <FiYoutube className="text-red-500" />
            Learning Resources
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <FiYoutube className="text-red-500" />
                YouTube Video Link
              </label>
              <input
                type="url"
                name="youtubeLink"
                value={formData.youtubeLink}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="input w-full"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                Primary video tutorial for this topic
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <FiBook className="text-green-600" />
                GeeksforGeeks Link
              </label>
              <input
                type="url"
                name="gfgLink"
                value={formData.gfgLink}
                onChange={handleChange}
                placeholder="https://www.geeksforgeeks.org/..."
                className="input w-full"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                GFG article for documentation and examples
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <FiFileText className="text-blue-600" />
                Theory/Article Link
              </label>
              <input
                type="url"
                name="theoryLink"
                value={formData.theoryLink}
                onChange={handleChange}
                placeholder="https://..."
                className="input w-full"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                Additional theory resource or blog post
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <FiExternalLink className="text-purple-600" />
                Official Documentation Link
              </label>
              <input
                type="url"
                name="documentationLink"
                value={formData.documentationLink}
                onChange={handleChange}
                placeholder="https://..."
                className="input w-full"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                Official docs or reference material
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <FiCode className="text-orange-600" />
                Practice Problems Link
              </label>
              <input
                type="url"
                name="practiceLink"
                value={formData.practiceLink}
                onChange={handleChange}
                placeholder="https://leetcode.com/... or https://hackerrank.com/..."
                className="input w-full"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                External practice platform link (LeetCode, HackerRank, etc.)
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <FiFileText className="text-pink-600" />
                Notes/Cheatsheet Link
              </label>
              <input
                type="url"
                name="notesLink"
                value={formData.notesLink}
                onChange={handleChange}
                placeholder="https://..."
                className="input w-full"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                Link to downloadable notes or cheatsheet
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/topics')}
            className="btn-secondary flex items-center gap-2 px-6 py-3"
            disabled={saving}
          >
            <FiX /> Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2 px-8 py-3 shadow-lg"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preview Card */}
      <div className="mt-8 card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-sm font-black text-[var(--text-main)] mb-4 uppercase tracking-wider">
          📋 Quick Preview
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-[var(--text-muted)]">Total Resources: </span>
            <span className="font-black text-[var(--primary)]">
              {[formData.youtubeLink, formData.gfgLink, formData.theoryLink, formData.documentationLink, formData.practiceLink, formData.notesLink].filter(Boolean).length} / 6
            </span>
          </div>
          <div>
            <span className="font-bold text-[var(--text-muted)]">Difficulty: </span>
            <span className={`font-black ${
              formData.difficulty === 'beginner' ? 'text-green-600' :
              formData.difficulty === 'intermediate' ? 'text-orange-600' :
              'text-red-600'
            }`}>
              {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTopic;
