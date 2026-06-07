# TopicDetail.jsx Enhancement Code Snippets

## 🎯 Ready-to-Use Components

### 1. Resource Tabs Component

Add this component inside TopicDetail.jsx (after existing helper functions):

```javascript
// Resource Tabs Component - Add after getYouTubeEmbedUrl function
const ResourceTabs = ({ topic, isCompleted }) => {
  const [activeTab, setActiveTab] = useState('video');
  
  const tabs = [
    { id: 'video', label: 'Video Tutorial', icon: <FiYoutube />, color: 'red' },
    { id: 'documentation', label: 'Documentation', icon: <FiBook />, color: 'green' },
    { id: 'practice', label: 'Practice', icon: <FiCode />, color: 'orange' },
    { id: 'notes', label: 'Notes', icon: <FiFileText />, color: 'purple' }
  ];
  
  const hasResources = {
    video: topic.youtubeLink,
    documentation: topic.gfgLink || topic.documentationLink || topic.theoryLink,
    practice: topic.practiceLink,
    notes: topic.notesLink
  };
  
  const visibleTabs = tabs.filter(tab => hasResources[tab.id]);
  
  return (
    <div className="resource-tabs-container">
      {/* Tabs Header */}
      <div className="flex gap-2 border-b border-[var(--border)] mb-6 overflow-x-auto">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? `border-b-2 border-${tab.color}-500 text-${tab.color}-500`
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Video Tab */}
          {activeTab === 'video' && topic.youtubeLink && (
            <div className="space-y-4">
              {isCompleted && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg text-sm">
                  <FiCheckCircle className="text-green-500" />
                  <span className="font-bold text-green-700 dark:text-green-400">
                    Topic Completed! Feel free to rewatch this tutorial anytime.
                  </span>
                </div>
              )}
              
              <div className="aspect-video rounded-xl overflow-hidden border border-[var(--border)] shadow-lg">
                <iframe
                  id="tutorial-video-iframe"
                  src={getYouTubeEmbedUrl(topic.youtubeLink)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-[var(--bg-sub)] rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <FiClock />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--text-light)] uppercase">Estimated Time</div>
                    <div className="font-bold text-[var(--text-main)]">{topic.estimatedTime}</div>
                  </div>
                </div>
                
                {topic.instructor && (
                  <div className="text-right">
                    <div className="text-xs font-bold text-[var(--text-light)] uppercase">Instructor</div>
                    <div className="font-bold text-[var(--text-main)]">{topic.instructor}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Documentation Tab */}
          {activeTab === 'documentation' && (
            <div className="grid md:grid-cols-2 gap-4">
              {topic.gfgLink && (
                <a
                  href={topic.gfgLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl hover:shadow-lg hover:border-emerald-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-2xl">
                      📚
                    </div>
                    <FiExternalLink className="text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <h3 className="font-black text-lg text-emerald-900 dark:text-emerald-100 mb-2">
                    GeeksforGeeks
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                    Comprehensive article with theory, examples, and code snippets
                  </p>
                </a>
              )}
              
              {topic.documentationLink && (
                <a
                  href={topic.documentationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-lg hover:border-blue-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-2xl">
                      📖
                    </div>
                    <FiExternalLink className="text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <h3 className="font-black text-lg text-blue-900 dark:text-blue-100 mb-2">
                    Official Documentation
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Authoritative reference and technical specifications
                  </p>
                </a>
              )}
              
              {topic.theoryLink && (
                <a
                  href={topic.theoryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl hover:shadow-lg hover:border-purple-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-2xl">
                      🎓
                    </div>
                    <FiExternalLink className="text-purple-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <h3 className="font-black text-lg text-purple-900 dark:text-purple-100 mb-2">
                    Theory & Concepts
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                    In-depth explanation and conceptual understanding
                  </p>
                </a>
              )}
            </div>
          )}
          
          {/* Practice Tab */}
          {activeTab === 'practice' && topic.practiceLink && (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center text-3xl">
                    💪
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-orange-900 dark:text-orange-100">
                      Practice Problems
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                      Apply what you learned with hands-on coding challenges
                    </p>
                  </div>
                </div>
                
                <a
                  href={topic.practiceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Start Practicing
                  <FiArrowRight />
                </a>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                  <div className="text-xs font-bold text-[var(--text-light)] uppercase mb-1">Difficulty</div>
                  <div className={`font-black text-lg ${
                    topic.difficulty === 'beginner' ? 'text-green-600' :
                    topic.difficulty === 'intermediate' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                  </div>
                </div>
                
                <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                  <div className="text-xs font-bold text-[var(--text-light)] uppercase mb-1">XP Reward</div>
                  <div className="font-black text-lg text-amber-500">+50 XP</div>
                </div>
                
                <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                  <div className="text-xs font-bold text-[var(--text-light)] uppercase mb-1">Platform</div>
                  <div className="font-black text-lg text-[var(--primary)]">
                    {topic.practiceLink.includes('leetcode') ? 'LeetCode' :
                     topic.practiceLink.includes('hackerrank') ? 'HackerRank' :
                     topic.practiceLink.includes('codechef') ? 'CodeChef' : 'External'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notes Tab */}
          {activeTab === 'notes' && topic.notesLink && (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-2 border-pink-200 dark:border-pink-800 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center text-3xl">
                    📝
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-pink-900 dark:text-pink-100">
                      Study Notes & Cheatsheet
                    </h3>
                    <p className="text-sm text-pink-700 dark:text-pink-300 font-medium">
                      Download comprehensive notes and quick reference materials
                    </p>
                  </div>
                </div>
                
                <a
                  href={topic.notesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <FiDownload />
                  Download Notes
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```

### 2. Phase Topics Sidebar Component

Add this component after ResourceTabs:

```javascript
// Phase Topics Sidebar - Add after ResourceTabs component
const PhaseTopicsSidebar = ({ allTopics, currentTopicId, phaseInfo, isTopicCompleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sorted = [...allTopics].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 lg:left-[calc(var(--sidebar-width)+1rem)] flex items-center gap-2 px-4 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-r-xl font-bold text-sm shadow-lg transition-all hover:shadow-xl"
      >
        <FiList size={18} />
        <span className="hidden sm:inline">Topics ({sorted.length})</span>
      </button>
      
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 sm:w-96 bg-[var(--bg-card)] border-r-2 border-[var(--border)] shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-[var(--bg-card)] border-b border-[var(--border)] p-6 z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-[var(--text-main)] mb-1">
                      Phase Topics
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] font-medium">
                      {phaseInfo?.name || 'Current Phase'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-lg bg-[var(--bg-sub)] hover:bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center text-[var(--text-main)] transition-all"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[var(--text-light)] uppercase">Progress</span>
                    <span className="font-black text-[var(--primary)]">
                      {sorted.filter(t => isTopicCompleted(t._id)).length} / {sorted.length}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--bg-sub)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-1000"
                      style={{ width: `${(sorted.filter(t => isTopicCompleted(t._id)).length / sorted.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Topics List */}
              <div className="p-4 space-y-2">
                {sorted.map((topic, index) => {
                  const isActive = topic._id === currentTopicId;
                  const isCompleted = isTopicCompleted(topic._id);
                  
                  return (
                    <Link
                      key={topic._id}
                      to={`/topic/${topic._id}`}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isActive
                          ? 'bg-[var(--primary)] text-white shadow-lg'
                          : isCompleted
                          ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 hover:shadow-md'
                          : 'bg-[var(--bg-sub)] hover:bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md'
                      }`}
                    >
                      {/* Number Badge */}
                      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isCompleted
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                      }`}>
                        {index + 1}
                      </div>
                      
                      {/* Topic Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm leading-tight mb-1 truncate ${
                          isActive ? 'text-white' : 'text-[var(--text-main)] group-hover:text-[var(--primary)]'
                        }`}>
                          {topic.title}
                        </h4>
                        <div className={`flex items-center gap-2 text-xs ${
                          isActive ? 'text-white/80' : 'text-[var(--text-muted)]'
                        }`}>
                          <FiClock size={12} />
                          <span className="font-medium">{topic.estimatedTime}</span>
                        </div>
                      </div>
                      
                      {/* Status Icon */}
                      <div className="shrink-0">
                        {isCompleted && !isActive && (
                          <FiCheckCircle className="text-green-500 text-xl" />
                        )}
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                        {!isCompleted && !isActive && (
                          <FiChevronRight className="text-[var(--text-light)] group-hover:text-[var(--primary)] transition-transform group-hover:translate-x-1" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
```

### 3. Integration Instructions

**Step 1:** Find where the video player is currently rendered in TopicDetail.jsx

**Step 2:** Replace the video section with:

```javascript
{/* Resource Tabs Section */}
{!shouldSplitWorkspace && (
  <div className="card p-6 mb-8">
    <ResourceTabs topic={topic} isCompleted={isCompleted} />
  </div>
)}
```

**Step 3:** Add Phase Topics Sidebar before the closing div of the component:

```javascript
{/* Phase Topics Navigation */}
{allTopics.length > 0 && (
  <PhaseTopicsSidebar
    allTopics={allTopics}
    currentTopicId={id}
    phaseInfo={topic?.phaseId}
    isTopicCompleted={isTopicCompleted}
  />
)}
```

### 4. Required Imports

Make sure these are imported at the top of TopicDetail.jsx:

```javascript
import {
  FiCheckCircle, FiPlay, FiBook, FiYoutube, FiCode, FiArrowLeft,
  FiMessageSquare, FiZap, FiAward, FiClock, FiArrowRight, FiInfo,
  FiBookOpen, FiTerminal, FiAward as FiTrophy, FiChevronRight,
  FiMaximize2, FiMinimize2, FiList, FiX, FiExternalLink,
  FiFileText, FiDownload
} from 'react-icons/fi';
```

---

## 🎨 CSS Additions

Add these styles to your global CSS or create a new file `client/src/styles/resources.css`:

```css
/* Resource Tabs Animations */
.resource-tabs-container {
  @apply w-full;
}

/* Smooth scroll for mobile tabs */
.resource-tabs-container > div:first-child {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.resource-tabs-container > div:first-child::-webkit-scrollbar {
  display: none;
}

/* Resource Card Hover Effect */
.resource-card {
  @apply transition-all duration-300;
}

.resource-card:hover {
  @apply -translate-y-1;
}

/* Phase Sidebar Scrollbar */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: var(--primary) var(--bg-sub);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-[var(--bg-sub)] rounded-lg;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-[var(--primary)] rounded-lg;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-[var(--primary-dark)];
}
```

---

## ✅ Testing Checklist

After implementing:

- [ ] Resource tabs appear for topics with resources
- [ ] Video can be rewatched after completion
- [ ] Documentation links open in new tab
- [ ] Phase sidebar shows all topics
- [ ] Current topic is highlighted
- [ ] Completed topics show checkmark
- [ ] Progress bar updates correctly
- [ ] Mobile responsive (sidebar slides in)
- [ ] Dark mode looks good
- [ ] Smooth animations
- [ ] No console errors

---

## 🚀 Deployment Notes

1. **Before deploying:**
   - Add resource links to existing topics via admin panel
   - Test on multiple browsers
   - Check mobile responsiveness
   - Verify all external links work

2. **After deploying:**
   - Monitor user feedback
   - Track resource usage analytics
   - Check video playback performance
   - Verify sidebar works on all devices

---

**Ready to implement? Copy the components above into TopicDetail.jsx and you're good to go!** 🎉
