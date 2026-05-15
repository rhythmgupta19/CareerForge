import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DomainSelection from './pages/DomainSelection';
import RoadmapPage from './pages/RoadmapPage';
import TopicDetail from './pages/TopicDetail';
import AssessmentsPage from './pages/AssessmentsPage';
import CloudCredits from './pages/CloudCredits';
import AIChatPage from './pages/AIChatPage';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          {/* Main content area wrapped in a flex container to allow sidebar layout */}
          <main className="flex-grow overflow-y-auto">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<div className="flex h-full"><Sidebar /><div className="flex-1 overflow-y-auto"><Dashboard /></div></div>} />
              <Route path="/domains" element={<div className="flex h-full"><Sidebar /><div className="flex-1 overflow-y-auto"><DomainSelection /></div></div>} />
              <Route path="/roadmap/:domainId" element={<div className="flex h-full"><Sidebar /><div className="flex-1 overflow-y-auto"><RoadmapPage /></div></div>} />
              <Route path="/topic/:topicId" element={<div className="flex h-full"><Sidebar /><div className="flex-1 overflow-y-auto"><TopicDetail /></div></div>} />
              <Route path="/assessments" element={<div className="flex h-full"><Sidebar /><div className="flex-1 overflow-y-auto"><AssessmentsPage /></div></div>} />
              <Route path="/cloud-credits" element={<div className="flex h-full"><Sidebar /><div className="flex-1 overflow-y-auto"><CloudCredits /></div></div>} />
              <Route path="/ai-chat" element={<div className="flex h-full"><Sidebar /><div className="flex-1 overflow-y-auto"><AIChatPage /></div></div>} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
