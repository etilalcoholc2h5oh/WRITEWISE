import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, ChevronRight, Sparkles, CheckCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

import studentImg from '../../assets/images/chibi_student_1786859898494.jpg';

export default function StudentDashboard({ user }: { user: any }) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignmentsSnap = await getDocs(collection(db, 'assignments'));
        const assignmentsData = assignmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAssignments(assignmentsData);

        if (user) {
          const subsSnap = await getDocs(query(collection(db, 'submissions'), where('studentId', '==', user.id)));
          const subsData = subsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSubmissions(subsData);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="text-center p-12">Loading...</div>;

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto w-full">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border-4 border-amber-100">
          <img src={studentImg} alt="Student" className="w-full h-full object-cover" />
        </div>
        <div className="text-center md:text-left z-10">
          <h1 className="text-2xl md:text-4xl font-black text-neutral-800 tracking-tight mb-2 flex items-center justify-center md:justify-start gap-2">
            Hey there, {user?.displayName || 'Tamu'}! <Sparkles className="text-amber-400" size={24} />
          </h1>
          <p className="text-neutral-500 font-medium">Ready to write some awesome stories today? You have {assignments.length} assignments waiting!</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full pointer-events-none" />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 px-2">Your Quests 🚀</h2>
        <div className="grid gap-4">
          {assignments.map(assignment => {
            const submission = submissions.find(s => s.assignmentId === assignment.id);
            const gradeInfo = submission?.teacherReview;

            return (
              <div key={assignment.id} className="group bg-white p-5 md:p-6 rounded-[2rem] border-2 border-neutral-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:border-blue-300 transition-all duration-300 hover:shadow-md gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 text-xs font-bold rounded-xl uppercase tracking-wider">
                      {assignment.genre || 'General'}
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
                  
                  {gradeInfo && (
                    <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2 text-lg">
                        <CheckCircle size={20} /> Graded: {gradeInfo.score}/100
                      </div>
                      <div className="text-sm font-medium text-emerald-900 bg-white p-3 rounded-xl shadow-sm border border-emerald-50">
                        <span className="font-bold text-emerald-700 block mb-1 text-[10px] uppercase tracking-wider">Teacher Feedback:</span>
                        {gradeInfo.feedback || 'Great job!'}
                      </div>
                    </div>
                  )}
                </div>
                
                {!gradeInfo ? (
                  <Link 
                    to={`/student/write/${assignment.id}`}
                    className="shrink-0 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 md:py-4 rounded-2xl font-bold transition-transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    <FileText size={18} />
                    {submission ? 'Edit Draft' : 'Start Writing'}
                    <ChevronRight size={18} />
                  </Link>
                ) : (
                  <div className="shrink-0 flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 px-6 py-3 md:py-4 rounded-2xl font-bold w-full sm:w-auto">
                    <CheckCircle size={18} />
                    Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
