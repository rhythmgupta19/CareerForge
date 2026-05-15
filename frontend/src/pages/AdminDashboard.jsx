import { Users, BookOpen, ShieldCheck, Settings } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage domains, users, and platform content.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">14</div>
            <div className="text-gray-500 text-sm">Active Domains</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">1,245</div>
            <div className="text-gray-500 text-sm">Total Students</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">48</div>
            <div className="text-gray-500 text-sm">Assessments</div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all text-left">
          <h3 className="font-bold text-lg mb-2">Manage Domains & Roadmaps</h3>
          <p className="text-gray-500 text-sm">Edit phases, topics, and links for all domains.</p>
        </button>
        <button className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all text-left">
          <h3 className="font-bold text-lg mb-2">Manage Assessments</h3>
          <p className="text-gray-500 text-sm">Add or edit HackerRank custom assessment links.</p>
        </button>
        <button className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all text-left">
          <h3 className="font-bold text-lg mb-2">Manage Cloud Credits</h3>
          <p className="text-gray-500 text-sm">Update free benefits and Github student pack links.</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
