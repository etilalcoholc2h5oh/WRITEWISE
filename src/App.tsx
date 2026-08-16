import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Sparkles, PenTool } from 'lucide-react';
import { currentUserStudent, currentUserTeacher } from './data/mockData';
import { Role } from './types';

import StudentDashboard from './pages/student/StudentDashboard';
import WritingSpace from './pages/student/WritingSpace';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherReview from './pages/teacher/TeacherReview';

// Import our generated assets
import studentImg from './assets/images/chibi_student_1786859898494.jpg';
import teacherImg from './assets/images/chibi_teacher_1786859916336.jpg';
import logoImg from './assets/images/logo write wise AI-1.png';

function App() {
  const [role, setRole] = React.useState<Role | null>(null);

  if (!role) {
    return (
      <div className="min-h-screen bg-[#FDF9F1] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-pink-200">
        <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-100 p-6 md:p-12 text-center space-y-10 relative overflow-hidden">
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-50 to-transparent pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" />

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-2 shadow-sm rounded-3xl overflow-hidden bg-white border border-indigo-100">
              <img src={logoImg} alt="WriteWise AI Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-neutral-800 tracking-tight">
              WriteWise <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">AI</span>
            </h1>
            <p className="text-neutral-500 font-medium text-lg max-w-md mx-auto">
              Your personal AI writing buddy! Let's level up your writing skills together. ✨
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 relative z-10">
            <button 
              onClick={() => setRole('student')}
              className="group flex flex-col items-center p-6 bg-white border-2 border-neutral-100 hover:border-blue-300 hover:bg-blue-50/50 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100"
            >
              <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-blue-100 bg-blue-50 group-hover:scale-105 transition-transform duration-300">
                <img src={studentImg} alt="Student" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2 text-xl font-bold text-neutral-800 mb-1">
                Student <Sparkles size={20} className="text-blue-400" />
              </div>
              <p className="text-sm text-neutral-500 font-medium">Practice writing with AI hints</p>
            </button>

            <button 
              onClick={() => setRole('teacher')}
              className="group flex flex-col items-center p-6 bg-white border-2 border-neutral-100 hover:border-emerald-300 hover:bg-emerald-50/50 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100"
            >
              <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-emerald-100 bg-emerald-50 group-hover:scale-105 transition-transform duration-300">
                <img src={teacherImg} alt="Teacher" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2 text-xl font-bold text-neutral-800 mb-1">
                Teacher <BookOpen size={20} className="text-emerald-400" />
              </div>
              <p className="text-sm text-neutral-500 font-medium">Review and grade submissions</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const user = role === 'student' ? currentUserStudent : currentUserTeacher;

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#FDF9F1] font-sans text-neutral-800 selection:bg-pink-200">
        <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-indigo-100 shadow-sm">
              <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
            </div>
            WriteWise <span className="text-pink-500">AI</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center text-sm font-bold text-neutral-700 bg-neutral-100 px-4 py-1.5 rounded-full">
              <img src={role === 'student' ? studentImg : teacherImg} alt="avatar" className="w-6 h-6 rounded-full mr-2 border border-neutral-200 object-cover" />
              {user.name} <span className="text-neutral-400 ml-1 font-medium capitalize">({user.role})</span>
            </div>
            <button 
              onClick={() => setRole(null)}
              className="text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
          <Routes>
            <Route path="/" element={role === 'student' ? <StudentDashboard /> : <TeacherDashboard />} />
            <Route path="/student/write/:assignmentId" element={<WritingSpace />} />
            <Route path="/teacher/review/:submissionId" element={<TeacherReview />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
