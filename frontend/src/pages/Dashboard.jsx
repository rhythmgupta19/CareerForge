import { Flame, Trophy, Map as MapIcon, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Student! 👋</h1>
          <p className="text-gray-500">Continue your Web Development journey.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
          <Bot className="w-5 h-5" />
          Talk to AI Mentor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">12 Days</div>
            <div className="text-gray-500 text-sm">Current Streak</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">4</div>
            <div className="text-gray-500 text-sm">Badges Earned</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 md:col-span-2">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <MapIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <div className="text-lg font-bold">Web Development Progress</div>
              <div className="text-blue-600 font-bold">35%</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Current Phase: HTML & CSS</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <input type="checkbox" checked readOnly className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <span className="flex-1 font-medium line-through text-gray-400">HTML Basics</span>
              </div>
              <div className="flex items-center gap-4 p-4 border border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800 rounded-2xl">
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <span className="flex-1 font-bold text-blue-700 dark:text-blue-400">CSS Basics</span>
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">Resume</button>
              </div>
              <div className="flex items-center gap-4 p-4 opacity-50">
                <input type="checkbox" disabled className="w-5 h-5 rounded" />
                <span className="flex-1 font-medium">Responsive Design</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">AI Next Step Suggestion</h2>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-8 h-8" />
              <h3 className="text-lg font-bold">CareerForge Agent</h3>
            </div>
            <p className="mb-6 opacity-90 leading-relaxed">
              You've completed HTML! To master CSS, focus on Flexbox and Grid today. I have found an interactive game to practice Flexbox. Would you like to try it?
            </p>
            <button className="w-full bg-white text-indigo-600 font-bold py-2.5 rounded-xl hover:bg-opacity-90 transition-all">
              View Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
