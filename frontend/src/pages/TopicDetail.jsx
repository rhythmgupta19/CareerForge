import { useParams } from 'react-router-dom';
import { BookOpen, Youtube, CheckCircle, Clock } from 'lucide-react';

const TopicDetail = () => {
  const { topicId } = useParams();

  // Dummy data
  const topic = {
    title: 'HTML Basics',
    description: 'Learn the foundational markup language of the web.',
    theoryLink: 'https://www.geeksforgeeks.org/html/html-tutorial/',
    youtubeLink: 'https://www.youtube.com/results?search_query=html+full+course+for+beginners'
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-4">{topic.title}</h1>
        <p className="text-gray-500 text-lg mb-8">{topic.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a href={topic.theoryLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 p-6 rounded-2xl transition-colors border border-green-100 dark:border-green-900/30">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-green-800 dark:text-green-400">Read Theory</div>
              <div className="text-sm text-green-600 dark:text-green-500">GeeksforGeeks Tutorial</div>
            </div>
          </a>

          <a href={topic.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 p-6 rounded-2xl transition-colors border border-red-100 dark:border-red-900/30">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-red-800 dark:text-red-400">Watch Video</div>
              <div className="text-sm text-red-600 dark:text-red-500">YouTube Course</div>
            </div>
          </a>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-8 flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
            <CheckCircle className="w-5 h-5" /> Mark as Completed
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold px-6 py-3 rounded-xl transition-colors">
            <Clock className="w-5 h-5" /> Add Study Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
