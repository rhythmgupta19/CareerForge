import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiBookOpen, FiSearch, FiHeart, FiEye, FiClock, FiUser, FiTag, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [likedBlogs, setLikedBlogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('liked_blogs') || '[]');
    } catch {
      return [];
    }
  });

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    localStorage.setItem('liked_blogs', JSON.stringify(likedBlogs));
  }, [likedBlogs]);

  const categories = ['All', 'Web Development', 'DevOps', 'Data Science', 'General'];

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (blogId) => {
    const isLiked = likedBlogs.includes(blogId);
    if (isLiked) {
      setLikedBlogs(prev => prev.filter(id => id !== blogId));
      setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, likes: Math.max((b.likes || 0) - 1, 0) } : b));
      toast.success('Removed from liked articles');
    } else {
      setLikedBlogs(prev => [...prev, blogId]);
      setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, likes: (b.likes || 0) + 1 } : b));
      toast.success('Added to liked articles! ❤️');
    }
    api.post(`/blogs/${blogId}/like`).catch(err => console.warn(err));
  };

  const handleOpenBlog = (blog) => {
    setSelectedBlog(blog);
    setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, views: (b.views || 0) + 1 } : b));
    api.post(`/blogs/${blog._id}/view`).catch(err => console.warn(err));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-[var(--bg-main)]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-7xl mx-auto py-10 px-6 lg:px-8 bg-[var(--bg-main)] text-[var(--text-main)] min-h-screen">
      <div className="mb-12">
        <div className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full mb-4 py-1.5 px-4 font-black text-xs uppercase tracking-wider">
          Community Hub
        </div>
        <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight mb-4 flex items-center gap-4">
          Engineering Blogs
        </h1>
        <p className="text-[var(--text-muted)] text-sm font-semibold max-w-2xl leading-relaxed">
          Deep dives into full-stack systems, architectural patterns, developer guidelines, and industry insights written by students and mentors.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)] group-focus-within:text-[var(--primary)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search blogs by title or content keywords..." 
            className="w-full pl-12 pr-4 h-12 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-colors shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-[var(--primary)] text-[var(--text-main)] border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10' 
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]/40 hover:text-[var(--text-main)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredBlogs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((b) => (
            <div key={b._id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl hover:border-[var(--primary)]/40 hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden">
              {/* Cover Image */}
              <div className="h-48 overflow-hidden relative bg-zinc-900 border-b border-[var(--border)]">
                <img 
                  src={b.imageUrl || 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80'} 
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-emerald-400 font-black py-1 px-3 text-[9px] rounded-lg uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                  {b.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[9px] text-[var(--text-light)] font-black uppercase mb-3">
                    <span className="flex items-center gap-1"><FiUser /> {b.author || 'Guest Author'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><FiClock /> {new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-black text-[var(--text-main)] mb-3 group-hover:text-[var(--primary)] transition-colors leading-snug line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-xs font-semibold mb-6 leading-relaxed line-clamp-3">
                    {b.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleLike(b._id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${likedBlogs.includes(b._id) ? 'text-rose-500' : 'text-[var(--text-muted)] hover:text-rose-500'}`}
                    >
                      <FiHeart className={likedBlogs.includes(b._id) ? 'fill-current' : ''} />
                      <span>{b.likes || 0}</span>
                    </button>
                    <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <FiEye />
                      <span>{b.views || 0}</span>
                    </span>
                  </div>

                  <button 
                    onClick={() => handleOpenBlog(b)}
                    className="flex items-center gap-1 text-[var(--primary)] hover:text-indigo-400 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Read Article <FiBookOpen className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm animate-fade-in">
          <div className="text-6xl mb-6 opacity-20">📝</div>
          <h3 className="text-xl font-black text-[var(--text-main)] mb-2 tracking-tight">No articles found</h3>
          <p className="text-[var(--text-muted)] font-semibold text-sm">Try exploring different keywords or category tags.</p>
        </div>
      )}

      {/* Expanded Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-up max-h-[85vh] flex flex-col">
            {/* Image Header with close */}
            <div className="h-64 overflow-hidden relative bg-zinc-900 flex-shrink-0">
              <img 
                src={selectedBlog.imageUrl || 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80'} 
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white font-black text-sm flex items-center justify-center transition-colors cursor-pointer hover:bg-black/95 shadow"
              >
                ✕
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-emerald-500 text-black font-black py-1 px-3 text-[9px] rounded-lg uppercase tracking-widest border border-emerald-400/20 shadow-sm inline-block mb-3">
                  {selectedBlog.category}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {selectedBlog.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Body Content */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6 select-text">
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-[var(--text-light)] font-black uppercase border-b border-[var(--border)] pb-4">
                <span className="flex items-center gap-1.5 text-[var(--text-main)]"><FiUser className="text-[var(--primary)]" /> {selectedBlog.author || 'Guest Author'}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><FiClock /> {new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><FiEye /> {selectedBlog.views || 0} Views</span>
                <span className="flex items-center gap-1.5"><FiHeart className="text-rose-500 fill-current" /> {selectedBlog.likes || 0} Likes</span>
              </div>

              <div className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed whitespace-pre-line prose dark:prose-invert max-w-none">
                {selectedBlog.content}
              </div>

              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--border)]">
                  {selectedBlog.tags.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-[var(--bg-sub)] border border-[var(--border)] rounded-lg text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">
                      <FiTag size={10} className="text-[var(--primary)]" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
