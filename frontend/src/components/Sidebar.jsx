import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShieldCheck, Cloud, Bot, Award, Map as MapIcon, User } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Domains', path: '/domains', icon: <MapIcon className="w-5 h-5" /> },
    { name: 'Assessments', path: '/assessments', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Cloud Credits', path: '/cloud-credits', icon: <Cloud className="w-5 h-5" /> },
    { name: 'AI Mentor', path: '/ai-chat', icon: <Bot className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full hidden md:flex flex-col">
      <div className="flex-1 py-6 px-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Link to="/admin" className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-bold transition-colors">
          <User className="w-4 h-4" /> Switch to Admin
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
