import React from 'react';
import { Link } from 'react-router-dom';
import { mockAssignments } from '../../data/mockData';
import { FileText, Clock, ChevronRight, Sparkles } from 'lucide-react';

import studentImg from '../../assets/images/chibi_student_1786859898494.jpg';

export default function StudentDashboard() {
  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto w-full">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border-4 border-amber-100">
          <img src={studentImg} alt="Student" className="w-full h-full object-cover" />
        </div>
        <div className="text-center md:text-left z-10">
          <h1 className="text-2xl md:text-4xl font-black text-neutral-800 tracking-tight mb-2 flex items-center justify-center md:justify-start gap-2">
            Hey there, Budi! <Sparkles className="text-amber-400" size={24} />
          </h1>
          <p className="text-neutral-500 font-medium">Ready to write some awesome stories today? You have {mockAssignments.length} assignments waiting!</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full pointer-events-none" />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 px-2">Your Quests 🚀</h2>
        <div className="grid gap-4">
          {mockAssignments.map(assignment => (
            <div key={assignment.id} className="group bg-white p-5 md:p-6 rounded-[2rem] border-2 border-neutral-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:border-blue-300 transition-all duration-300 hover:shadow-md gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 text-xs font-bold rounded-xl uppercase tracking-wider">
                    {assignment.genre}
                  </span>
                  <div className="flex items-center text-xs md:text-sm font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-xl gap-1.5">
                    <Clock size={14} />
                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-neutral-800 mb-1 group-hover:text-blue-600 transition-colors">{assignment.title}</h3>
                  <p className="text-neutral-500 text-sm font-medium line-clamp-2 md:line-clamp-none">{assignment.instructions}</p>
                </div>
              </div>
              
              <Link 
                to={`/student/write/${assignment.id}`}
                className="shrink-0 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 md:py-4 rounded-2xl font-bold transition-transform hover:-translate-y-1 w-full sm:w-auto"
              >
                <FileText size={18} />
                Start Writing
                <ChevronRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
