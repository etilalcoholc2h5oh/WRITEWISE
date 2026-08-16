import React from 'react';
import { Link } from 'react-router-dom';
import { mockAssignments, mockSubmissions } from '../../data/mockData';
import { FileText, Users, CheckCircle, Clock, Sparkles } from 'lucide-react';
import teacherImg from '../../assets/images/chibi_teacher_1786859916336.jpg';

export default function TeacherDashboard() {
  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto w-full">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border-4 border-emerald-100">
          <img src={teacherImg} alt="Teacher" className="w-full h-full object-cover" />
        </div>
        <div className="text-center md:text-left z-10">
          <h1 className="text-2xl md:text-4xl font-black text-neutral-800 tracking-tight mb-2 flex items-center justify-center md:justify-start gap-2">
            Welcome back, Mr. Andi! <Sparkles className="text-emerald-400" size={24} />
          </h1>
          <p className="text-neutral-500 font-medium">You have 12 submissions waiting for your magic touch. ✨</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full pointer-events-none" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border-2 border-blue-100 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 text-blue-600 mb-2 md:mb-4">
            <div className="p-2 md:p-3 bg-blue-50 rounded-2xl">
              <Users size={24} />
            </div>
            <span className="font-bold hidden sm:inline">Active Classes</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl md:text-5xl font-black text-neutral-800">1</div>
            <span className="text-xs font-bold text-neutral-400 uppercase sm:hidden">Classes</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-5 md:p-6 rounded-[2rem] shadow-md flex flex-col justify-between text-white hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-2 md:mb-4 relative z-10">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white">
              <CheckCircle size={24} />
            </div>
            <span className="font-bold hidden sm:inline">To Review</span>
          </div>
          <div className="flex items-end justify-between relative z-10">
            <div className="text-3xl md:text-5xl font-black">12</div>
            <span className="text-xs font-bold text-emerald-100 uppercase sm:hidden">Review</span>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white p-5 md:p-6 rounded-[2rem] border-2 border-purple-100 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 text-purple-600 mb-2 md:mb-4">
            <div className="p-2 md:p-3 bg-purple-50 rounded-2xl">
              <FileText size={24} />
            </div>
            <span className="font-bold">Assignments</span>
          </div>
          <div className="text-3xl md:text-5xl font-black text-neutral-800">2</div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 px-2">Needs Review (English 10A) 📝</h2>
        
        {/* Mobile View (Cards) */}
        <div className="md:hidden space-y-4">
          {mockSubmissions.map(sub => {
            const assignment = mockAssignments.find(a => a.id === sub.assignmentId);
            return (
              <div key={sub.id} className="bg-white p-5 rounded-[2rem] border-2 border-neutral-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-lg text-neutral-900">Budi Santoso</div>
                    <div className="text-sm font-medium text-neutral-500">{assignment?.title}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl">
                    <Clock size={12} /> Review
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">AI Suggestion</span>
                    <span className="font-black text-purple-600 text-lg">{sub.aiAnalysis?.suggestedScore}/100</span>
                  </div>
                  <Link 
                    to={`/teacher/review/${sub.id}`}
                    className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                  >
                    Grade Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block bg-white rounded-[2rem] border-2 border-neutral-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-50/50 border-b-2 border-neutral-100">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">AI Suggestion</th>
                <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-50">
              {mockSubmissions.map(sub => {
                const assignment = mockAssignments.find(a => a.id === sub.assignmentId);
                return (
                  <tr key={sub.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-neutral-800">Budi Santoso</td>
                    <td className="px-6 py-5 text-neutral-600 font-medium">{assignment?.title}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800">
                        <Clock size={12} /> Needs Review
                      </span>
                    </td>
                    <td className="px-6 py-5 font-black text-purple-600">
                      {sub.aiAnalysis?.suggestedScore}/100
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        to={`/teacher/review/${sub.id}`}
                        className="inline-flex font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl group-hover:bg-emerald-100 transition-colors"
                      >
                        Grade Now
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
