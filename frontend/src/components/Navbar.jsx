import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
        <Briefcase className="w-8 h-8" />
        CareerForge
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/domains" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Domains</Link>
        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md">
          Login / Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
