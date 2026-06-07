# CareerForge Resource Management - System Architecture

## 📐 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CareerForge Platform                      │
│                                                               │
│  ┌────────────────────────┐    ┌─────────────────────────┐ │
│  │   ADMIN INTERFACE      │    │   USER INTERFACE        │ │
│  │   (Resource Manager)   │    │   (Learning Experience) │ │
│  └────────────────────────┘    └─────────────────────────┘ │
│             │                              │                 │
│             └──────────┬───────────────────┘                 │
│                        │                                     │
│                   ┌────▼────┐                                │
│                   │ Topic   │                                │
│                   │ Model   │                                │
│                   └─────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Data Flow Architecture

### Admin Workflow

```
Admin Dashboard
      │
      ▼
Navigate to /admin/topics
      │
      ├─► Select Domain (Web Dev, DSA, DevOps)
      │        │
      │        ▼
      │   Select Phase (Level 0, 1, 2...)
      │        │
      │        ▼
      │   View Topics List
      │        │
      │        ├─► Option 1: Inline Edit
      │        │        │
      │        │        ├─► Click "Edit Resources"
      │        │        ├─► Fill in 6 resource fields
      │        │        ├─► Click "Save Resources"
      │        │        └─► API PUT /topics/:id
      │        │
      │        └─► Option 2: Full Edit Page
      │                 │
      │                 ├─► Navigate to /admin/topics/edit/:id
      │                 ├─► Edit all topic details
      │                 ├─► Edit all 6 resource links
      │                 ├─► Preview resource count
      │                 ├─► Click "Save Changes"
      │                 └─► API PUT /topics/:id
      │
      ▼
Resources Saved to Database
      │
      ▼
Available to Users Immediately
```

### User Workflow

```
User Dashboard
      │
      ▼
Navigate to Roadmap
      │
      ▼
Select Phase Level
      │
      ▼
Click on Topic
      │
      ▼
Topic Detail Page Loads
      │
      ├─► Resource Tabs Displayed
      │        │
      │        ├─► Video Tab (YouTube embed)
      │        │     ├─ Shows "Completed" badge if done
      │        │     └─ Allows rewatching anytime
      │        │
      │        ├─► Documentation Tab
      │        │     ├─ GeeksforGeeks link
      │        │     ├─ Official Documentation
      │        │     └─ Theory/Articles
      │        │
      │        ├─► Practice Tab
      │        │     └─ External coding challenges
      │        │
      │        └─► Notes Tab
      │              └─ Downloadable study materials
      │
      └─► Phase Topics Sidebar
               │
               ├─► Shows all topics in phase
               ├─► Highlights current topic
               ├─► Shows completion status
               ├─► Progress bar
               └─► Quick navigation
```

---

## 🗄️ Database Schema

### Topic Model

```javascript
Topic {
  // Identity & Organization
  _id: ObjectId
  phaseId: ObjectId → Phase
  domainId: ObjectId → Domain
  order: Number
  
  // Basic Information
  title: String                    // "Introduction to Arrays"
  description: String              // "Learn array fundamentals..."
  difficulty: Enum                 // beginner | intermediate | advanced
  estimatedTime: String            // "2 hours"
  instructor: String               // "Apna College"
  
  // Learning Resources (The New Features!)
  theoryLink: String               // ✅ General theory article
  gfgLink: String                  // ✅ GeeksforGeeks documentation
  youtubeLink: String              // ✅ Video tutorial
  documentationLink: String        // ✅ Official docs (MDN, etc.)
  practiceLink: String             // ✅ Coding challenges
  notesLink: String                // ✅ Study notes/cheatsheet
  
  // Metadata
  isActive: Boolean
  isRequired: Boolean
  createdAt: Date
  updatedAt: Date
}
```

### Relationships

```
Domain ─┬─► Phase ─┬─► Topic ─┬─► User Progress
        │          │          │
        │          │          └─► Resources (links)
        │          │
        │          └─► Multiple Topics
        │
        └─► Multiple Phases

User ───► Progress ─┬─► completedTopics[]
                    │     └─► topicId reference
                    │
                    └─► domainsProgress{}
                          └─► xp, currentPhase, etc.
```

---

## 📱 Component Architecture

### Admin Components

```
AdminShell
    │
    └─► ManageTopics
            │
            ├─► Domain Dropdown
            ├─► Phase Dropdown
            │
            └─► Topics List
                    │
                    ├─► Topic Card (each)
                    │     │
                    │     ├─► Basic Info Display
                    │     ├─► Resource Links Preview
                    │     │
                    │     └─► Actions
                    │           ├─► "Edit Resources" → Inline Form
                    │           └─► Navigate to /admin/topics/edit/:id
                    │
                    └─► EditTopic (Full Page)
                            │
                            ├─► Basic Info Form
                            │     ├─ Title
                            │     ├─ Description
                            │     ├─ Difficulty
                            │     └─ Estimated Time
                            │
                            └─► Resources Form
                                  ├─ YouTube Link
                                  ├─ GFG Link
                                  ├─ Theory Link
                                  ├─ Documentation Link
                                  ├─ Practice Link
                                  └─ Notes Link
```

### User Components

```
AppShell
    │
    └─► Roadmap
            │
            └─► Phase Levels
                    │
                    └─► Topics List
                            │
                            └─► TopicDetail
                                    │
                                    ├─► Header
                                    │     ├─ Title
                                    │     ├─ Breadcrumbs
                                    │     └─ Completion Status
                                    │
                                    ├─► ResourceTabs ✨ NEW
                                    │     │
                                    │     ├─► Tab: Video
                                    │     │     ├─ YouTube Embed
                                    │     │     ├─ Completion Badge
                                    │     │     └─ Rewatch Anytime
                                    │     │
                                    │     ├─► Tab: Documentation
                                    │     │     ├─ GFG Card
                                    │     │     ├─ Official Docs Card
                                    │     │     └─ Theory Card
                                    │     │
                                    │     ├─► Tab: Practice
                                    │     │     └─ Practice Link Card
                                    │     │
                                    │     └─► Tab: Notes
                                    │           └─ Download Button
                                    │
                                    ├─► PhaseTopicsSidebar ✨ NEW
                                    │     │
                                    │     ├─► Header
                                    │     │     ├─ Phase Name
                                    │     │     └─ Progress Bar
                                    │     │
                                    │     └─► Topics List
                                    │           └─ Topic Item (each)
                                    │                 ├─ Number Badge
                                    │                 ├─ Title
                                    │                 ├─ Time
                                    │                 └─ Status Icon
                                    │
                                    └─► Completion Actions
                                          ├─ Mark Complete Button
                                          └─ Next Topic Link
```

---

## 🔄 State Management

### TopicDetail State

```javascript
// Resource Management
const [activeResourceTab, setActiveResourceTab] = useState('video');
                                                            ↓
                                            Switches between tabs:
                                            - video
                                            - documentation
                                            - practice
                                            - notes

// Phase Navigation
const [showPhaseTopics, setShowPhaseTopics] = useState(false);
                                                          ↓
                                              Opens/closes sidebar

// Topic Data
const [topic, setTopic] = useState(null);
                                     ↓
                    Fetched from API: /topics/:id
                    Contains all 6 resource links

// Related Topics
const [allTopics, setAllTopics] = useState([]);
                                             ↓
                          Fetched from API: /topics/phase/:phaseId
                          Used in sidebar navigation

// Completion Status
const isCompleted = useMemo(() => {
  return progress.completedTopics.some(t => t.topicId === topicId);
}, [progress, topicId]);
                 ↓
      Determines if video can be rewatched
      Shows completion badges
```

---

## 🛠️ API Endpoints

### Topic Management

```
GET    /api/topics/:id
       └─► Returns single topic with all fields
           └─► Used by: TopicDetail page

PUT    /api/topics/:id
       └─► Updates topic resources
           └─► Used by: EditTopic, ManageTopics

GET    /api/topics/phase/:phaseId
       └─► Returns all topics in phase
           └─► Used by: Roadmap, Phase Sidebar

GET    /api/domains
       └─► Returns all domains
           └─► Used by: ManageTopics dropdown

GET    /api/phases/domain/:domainId
       └─► Returns all phases in domain
           └─► Used by: ManageTopics dropdown
```

### Progress Tracking

```
POST   /api/progress/complete-topic
       └─► Marks topic as completed
           └─► Used by: TopicDetail completion

GET    /api/progress/dashboard
       └─► Returns user progress
           └─► Used by: Dashboard, Progress tracking
```

---

## 🎨 UI Component Tree

```
TopicDetail.jsx
│
├─► useState Hooks
│   ├─ topic
│   ├─ allTopics
│   ├─ activeResourceTab ✨
│   └─ showPhaseTopics ✨
│
├─► useEffect Hooks
│   ├─ Fetch topic data
│   ├─ Fetch phase topics
│   └─ Initialize YouTube player
│
├─► Helper Functions
│   ├─ getYouTubeEmbedUrl()
│   ├─ isTopicCompleted()
│   └─ handleComplete()
│
├─► Components
│   │
│   ├─► Header Section
│   │   ├─ Breadcrumbs
│   │   ├─ Title
│   │   └─ Difficulty Badge
│   │
│   ├─► ResourceTabs ✨ NEW
│   │   ├─ TabHeader
│   │   │   ├─ Video Tab Button
│   │   │   ├─ Documentation Tab Button
│   │   │   ├─ Practice Tab Button
│   │   │   └─ Notes Tab Button
│   │   │
│   │   └─ TabContent (AnimatePresence)
│   │       ├─ VideoTab
│   │       │   ├─ Completion Badge
│   │       │   ├─ YouTube Iframe
│   │       │   └─ Video Info Card
│   │       │
│   │       ├─ DocumentationTab
│   │       │   ├─ GFG Link Card
│   │       │   ├─ Official Docs Card
│   │       │   └─ Theory Card
│   │       │
│   │       ├─ PracticeTab
│   │       │   └─ Practice Platform Card
│   │       │
│   │       └─ NotesTab
│   │           └─ Download Button
│   │
│   ├─► PhaseTopicsSidebar ✨ NEW
│   │   ├─ Toggle Button (fixed position)
│   │   │
│   │   └─ Sidebar (AnimatePresence)
│   │       ├─ Header
│   │       │   ├─ Phase Name
│   │       │   ├─ Close Button
│   │       │   └─ Progress Bar
│   │       │
│   │       └─ Topics List
│   │           └─ TopicItem (map)
│   │               ├─ Number Badge
│   │               ├─ Title & Time
│   │               └─ Status Icon
│   │                   ├─ ✓ if completed
│   │                   ├─ • if active
│   │                   └─ › if pending
│   │
│   └─► Completion Section
│       ├─ Complete Button
│       └─ Next Topic Link
│
└─► Return JSX
```

---

## 🔐 Security & Permissions

### Admin Routes

```
/admin/topics ──────────► Protected by admin role
                          │
                          ├─ useAuth() check
                          ├─ role === 'admin'
                          └─ Redirect to /login if not authorized

/admin/topics/edit/:id ─► Same protection
                          └─ Additional: verify topic exists
```

### User Routes

```
/topic/:id ─────────────► Protected by auth
                          │
                          ├─ useAuth() check
                          ├─ Any authenticated user
                          └─ Can only view, not edit resources
```

### API Security

```
PUT /api/topics/:id ───► Requires admin JWT token
                         │
                         ├─ Verify token
                         ├─ Check admin role
                         └─ Validate request body
```

---

## 📊 Data Validation

### Resource URL Validation

```javascript
// Frontend Validation
const validateURL = (url) => {
  if (!url) return true; // Optional field
  
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

// Backend Validation
const topicSchema = new mongoose.Schema({
  gfgLink: {
    type: String,
    validate: {
      validator: (v) => !v || /^https?:\/\/.+/.test(v),
      message: 'Invalid URL format'
    }
  }
  // ... same for all resource links
});
```

---

## 🚀 Performance Optimizations

### Code Splitting

```javascript
// Lazy load admin pages
const EditTopic = React.lazy(() => import('./pages/admin/EditTopic'));
const ManageTopics = React.lazy(() => import('./pages/admin/ManageTopics'));

// Lazy load heavy components
const ResourceTabs = React.lazy(() => import('./components/ResourceTabs'));
```

### Memoization

```javascript
// Prevent unnecessary re-renders
const isCompleted = useMemo(() => {
  return completedTopics.some(t => t.topicId === id);
}, [completedTopics, id]);

const sortedTopics = useMemo(() => {
  return [...allTopics].sort((a, b) => a.order - b.order);
}, [allTopics]);
```

### Caching Strategy

```javascript
// Cache topic data
useEffect(() => {
  const cachedTopic = sessionStorage.getItem(`topic_${id}`);
  if (cachedTopic) {
    setTopic(JSON.parse(cachedTopic));
  } else {
    fetchTopic(id).then(data => {
      sessionStorage.setItem(`topic_${id}`, JSON.stringify(data));
      setTopic(data);
    });
  }
}, [id]);
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Extra Small Devices (phones) */
@media (min-width: 0px) {
  .resource-tabs { flex-direction: column; }
  .phase-sidebar { width: 100%; }
}

/* Small Devices (landscape phones) */
@media (min-width: 640px) {
  .resource-tabs { flex-direction: row; }
  .phase-sidebar { width: 80%; }
}

/* Medium Devices (tablets) */
@media (min-width: 768px) {
  .resource-tabs { justify-content: center; }
  .phase-sidebar { width: 400px; }
}

/* Large Devices (desktops) */
@media (min-width: 1024px) {
  .resource-tabs { gap: 2rem; }
  .phase-sidebar { width: 400px; left: calc(var(--sidebar-width) + 1rem); }
}
```

---

## 🎯 User Journey Map

### New User Journey

```
1. Sign Up ──────► Select Domain
                        │
                        ▼
2. Onboarding ───► Answer Questions
                        │
                        ▼
3. Dashboard ────► See Roadmap
                        │
                        ▼
4. Roadmap ──────► Select Phase
                        │
                        ▼
5. Phase View ───► Click Topic
                        │
                        ▼
6. Topic Detail ─┬─► Watch Video
                 ├─► Read Documentation ✨ NEW
                 ├─► Practice Coding ✨ NEW
                 ├─► Download Notes ✨ NEW
                 └─► Navigate Phase Topics ✨ NEW
                        │
                        ▼
7. Mark Complete ─► Next Topic
                        │
                        ▼
8. Repeat until phase complete
                        │
                        ▼
9. Unlock Next Phase
```

### Returning User Journey

```
1. Login ────────► Dashboard
                        │
                        ▼
2. See Progress ─► Continue Last Topic
                        │
                        ▼
3. Topic Detail ─┬─► Re-watch Video ✨ NEW FEATURE
                 ├─► Review Documentation
                 └─► Check Other Topics in Phase
                        │
                        ▼
4. Continue Learning or Review
```

---

## 🔍 Feature Discoverability

### How Users Find Resources

```
Entry Point 1: Topic Detail Page
      │
      └─► Resource Tabs immediately visible
            └─► User clicks to explore

Entry Point 2: Completed Topic
      │
      └─► "Rewatch" badge shown
            └─► User realizes they can revisit

Entry Point 3: Phase Sidebar
      │
      └─► Fixed button on left side
            └─► User clicks to see all topics

Entry Point 4: Admin Panel
      │
      └─► Clear "Edit Resources" button
            └─► Admin adds content
```

---

## 🧪 Testing Strategy

### Unit Tests

```javascript
describe('ResourceTabs', () => {
  it('shows only tabs with resources', () => {
    // Test tab visibility
  });
  
  it('switches between tabs', () => {
    // Test tab switching
  });
  
  it('allows video rewatch after completion', () => {
    // Test rewatch functionality
  });
});

describe('PhaseTopicsSidebar', () => {
  it('shows all topics in phase', () => {
    // Test topic listing
  });
  
  it('highlights current topic', () => {
    // Test active state
  });
  
  it('shows completion status', () => {
    // Test completion icons
  });
});
```

### Integration Tests

```javascript
describe('Topic Resource Flow', () => {
  it('admin adds resources', async () => {
    // 1. Login as admin
    // 2. Navigate to /admin/topics
    // 3. Edit topic
    // 4. Add resource links
    // 5. Save
    // 6. Verify in database
  });
  
  it('user views resources', async () => {
    // 1. Login as user
    // 2. Navigate to topic
    // 3. See resource tabs
    // 4. Click each tab
    // 5. Verify content
  });
});
```

---

## 📈 Analytics & Tracking

### Events to Track

```javascript
// Resource Engagement
analytics.track('resource_viewed', {
  topicId,
  resourceType: 'video' | 'documentation' | 'practice' | 'notes',
  timestamp
});

// Video Rewatching
analytics.track('video_rewatched', {
  topicId,
  completedAt,
  rewatchedAt,
  daysAfterCompletion
});

// Phase Navigation
analytics.track('phase_sidebar_opened', {
  phaseId,
  currentTopicId,
  totalTopics,
  completedCount
});

// Resource Links Clicked
analytics.track('resource_link_clicked', {
  topicId,
  resourceType,
  externalUrl
});
```

---

## 🎓 Educational Impact

### Learning Pathways

```
Single Topic Learning Path:

Video (Watch) ──► Documentation (Read) ──► Practice (Code) ──► Notes (Review)
      │                  │                       │                    │
      ▼                  ▼                       ▼                    ▼
  Understanding      Deep Diving          Application           Reference
   Concepts           Details              Skills               Material

Multiple Learning Styles Supported:
- Visual Learners ───► Video Tutorials
- Reading Learners ──► Documentation & Articles
- Kinesthetic ───────► Practice Problems
- Quick Reference ───► Study Notes
```

---

## 🏗️ Extensibility

### Future Enhancements

```
Current Architecture ──► Supports Adding:
│
├─► New Resource Types
│   ├─ Just add field to Topic model
│   ├─ Add tab in ResourceTabs
│   └─ Add input in EditTopic
│
├─► Resource Analytics
│   ├─ Track views per resource
│   ├─ Popular resources dashboard
│   └─ Effectiveness metrics
│
├─► User Bookmarks
│   ├─ Save favorite resources
│   ├─ Quick access panel
│   └─ Share with others
│
├─► Resource Ratings
│   ├─ Users rate quality
│   ├─ Admin sees feedback
│   └─ Improve content
│
└─► Offline Access
    ├─ Download resources
    ├─ Cache videos
    └─ PWA support
```

---

## 🎯 Success Criteria

### Technical Metrics

```
Performance:
  ✓ Page load < 2s
  ✓ Resource tab switch < 100ms
  ✓ Sidebar open < 200ms
  ✓ Video playback smooth

Reliability:
  ✓ 99.9% uptime
  ✓ Zero data loss
  ✓ Graceful error handling

Quality:
  ✓ Lighthouse score > 90
  ✓ Accessibility score > 95
  ✓ Zero console errors
```

### User Metrics

```
Engagement:
  ✓ 70%+ use documentation
  ✓ 30%+ rewatch videos
  ✓ 50%+ use phase sidebar

Satisfaction:
  ✓ 4.5/5 star rating
  ✓ Positive feedback
  ✓ Feature requests

Learning Outcomes:
  ✓ 85%+ completion rate
  ✓ Improved test scores
  ✓ Faster progression
```

---

**System Architecture Complete!**
This document provides a comprehensive technical overview of the
resource management system and how all pieces fit together. 🏗️
