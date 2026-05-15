import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Circle, Lock, ArrowRight, PlayCircle, BookOpen, Code2 } from 'lucide-react';

const roadmapData = {
  phases: [
    {
      id: 1,
      title: "Internet and Web Basics",
      description: "Understand how the internet, browsers, and DNS work.",
      status: "completed",
      topics: [
        { name: "How the Internet Works", type: "theory" },
        { name: "HTTP/HTTPS & DNS", type: "theory" }
      ]
    },
    {
      id: 2,
      title: "HTML & CSS",
      description: "Build the skeleton and style of your web pages.",
      status: "in-progress",
      topics: [
        { name: "HTML Basics", type: "theory", completed: true },
        { name: "CSS Basics", type: "theory", completed: false },
        { name: "Flexbox & Grid", type: "practice", completed: false },
        { name: "Responsive Design", type: "practice", completed: false }
      ],
      assessment: { title: "HTML & CSS HackerRank Quiz", required: true }
    },
    {
      id: 3,
      title: "JavaScript Essentials",
      description: "Make your websites interactive with vanilla JavaScript.",
      status: "locked",
      topics: [
        { name: "Variables & Data Types" },
        { name: "Functions & DOM Manipulation" },
        { name: "Async JavaScript" }
      ]
    }
  ]
};

const RoadmapPage = () => {
  const { domainId } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-blue-600 font-bold mb-4 uppercase tracking-wider">
          <Link to="/domains" className="hover:underline">Domains</Link>
          <span>/</span>
          <span>Web Development</span>
        </div>
        <h1 className="text-4xl font-extrabold mb-4">Web Development Roadmap</h1>
        <p className="text-xl text-gray-500">A step-by-step path to becoming a full-stack web developer. Follow the phases, complete topics, and pass assessments to unlock the next level.</p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
        {roadmapData.phases.map((phase, index) => (
          <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm
              ${phase.status === 'completed' ? 'bg-green-500 text-white' : 
                phase.status === 'in-progress' ? 'bg-blue-600 text-white' : 
                'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
              {phase.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
               phase.status === 'in-progress' ? <Circle className="w-5 h-5 fill-current" /> : 
               <Lock className="w-4 h-4" />}
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider
                  ${phase.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  phase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                  Phase {phase.id}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
              <p className="text-gray-500 text-sm mb-6">{phase.description}</p>
              
              <div className="space-y-3 mb-6">
                {phase.topics.map((topic, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm ${phase.status === 'locked' ? 'opacity-50' : ''}`}>
                    {topic.completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
                    <span className="flex-1 font-medium">{topic.name}</span>
                    {topic.type === 'theory' && <BookOpen className="w-4 h-4 text-gray-400" />}
                    {topic.type === 'practice' && <Code2 className="w-4 h-4 text-gray-400" />}
                  </div>
                ))}
              </div>

              {phase.assessment && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 p-4 rounded-xl flex justify-between items-center mb-4">
                  <div>
                    <div className="font-bold text-purple-700 dark:text-purple-400 text-sm">Assessment Required</div>
                    <div className="text-xs text-purple-600 dark:text-purple-500 opacity-80">{phase.assessment.title}</div>
                  </div>
                  <Lock className="w-4 h-4 text-purple-500" />
                </div>
              )}

              {phase.status === 'in-progress' && (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors">
                  Continue Learning
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
