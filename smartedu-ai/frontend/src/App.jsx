import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import AITeacher from './modules/teacher/AITeacher.jsx';
import VirtualLab from './modules/lab/VirtualLab.jsx';
import QuizGenerator from './modules/quiz/QuizGenerator.jsx';

export const MODULES = [
  { id: 'teacher', name: 'AI Teacher', icon: '🧑‍🏫', desc: 'Virtual intellektual o‘qituvchi' },
  { id: 'lab', name: '3D Virtual Lab', icon: '🧪', desc: 'Interaktiv kimyo laboratoriyasi' },
  { id: 'quiz', name: 'AI Quiz Generator', icon: '📝', desc: 'AI yaratadigan testlar' },
];

export default function App() {
  const [activeModule, setActiveModule] = useState('teacher');

  return (
    <div className="flex h-full">
      <Sidebar active={activeModule} onSelect={setActiveModule} />

      <main className="flex-1 min-w-0 h-full overflow-hidden">
        {activeModule === 'teacher' && <AITeacher />}
        {activeModule === 'lab' && <VirtualLab />}
        {activeModule === 'quiz' && <QuizGenerator />}
      </main>
    </div>
  );
}
