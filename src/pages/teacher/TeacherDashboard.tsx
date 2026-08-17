import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, CheckCircle, Clock, Sparkles, Plus, X } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { User, Assignment, Submission, ClassInfo } from '../../types';

import teacherImg from '../../assets/images/chibi_teacher_1786859916336.jpg';

export default function TeacherDashboard({ user }: { user: User }) {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    genre: '',
    topic: '',
    instructions: '',
    dueDate: ''
  });

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let classId = classes.length > 0 ? classes[0].id : `class_${user.id}`;
      
      if (classes.length === 0) {
        await setDoc(doc(db, 'classes', classId), {
          name: 'My First Class',
          teacherId: user.id
        });
        setClasses([{ id: classId, name: 'My First Class', teacherId: user.id }]);
      }

      const aId = `assign_${Date.now()}`;
      const assignmentData = {
        classId,
        teacherId: user.id,
        title: newAssignment.title,
        genre: newAssignment.genre,
        topic: newAssignment.topic,
        instructions: newAssignment.instructions,
        dueDate: newAssignment.dueDate
      };

      await setDoc(doc(db, 'assignments', aId), assignmentData);
      setAssignments([...assignments, { id: aId, ...assignmentData } as Assignment]);
      setIsCreating(false);
      setNewAssignment({ title: '', genre: '', topic: '', instructions: '', dueDate: '' });
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch classes
        const qClasses = query(collection(db, 'classes'), where('teacherId', '==', user.id));
        const classesSnap = await getDocs(qClasses);
        setClasses(classesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ClassInfo)));

        // Fetch assignments
        const qAssignments = query(collection(db, 'assignments'), where('teacherId', '==', user.id));
        const assignmentsSnap = await getDocs(qAssignments);
        const aList = assignmentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Assignment));
        setAssignments(aList);

        // Fetch submissions
        const qSubmissions = query(collection(db, 'submissions'), where('teacherId', '==', user.id));
        const subSnap = await getDocs(qSubmissions);
        const sList = subSnap.docs.map(d => ({ id: d.id, ...d.data() } as Submission));
        setSubmissions(sList);

        // Fetch students to show their names
        const qUsers = query(collection(db, 'users'), where('role', '==', 'student'));
        const usersSnap = await getDocs(qUsers);
        const uDict: Record<string, User> = {};
        usersSnap.docs.forEach(d => {
          uDict[d.id] = { id: d.id, ...d.data() } as User;
        });
        setStudents(uDict);

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user.id]);

  if (loading) return <div className="text-center p-12">Loading...</div>;

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto w-full">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border-4 border-emerald-100">
          <img src={teacherImg} alt="Teacher" className="w-full h-full object-cover" />
        </div>
        <div className="text-center md:text-left z-10">
          <h1 className="text-2xl md:text-4xl font-black text-neutral-800 tracking-tight mb-2 flex items-center justify-center md:justify-start gap-2">
            Welcome back, {user.name.split(' ')[0]}! <Sparkles className="text-emerald-400" size={24} />
          </h1>
          <p className="text-neutral-500 font-medium">You have {submissions.filter(s => s.status === 'submitted').length} submissions waiting for your magic touch. ✨</p>
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
            <div className="text-3xl md:text-5xl font-black text-neutral-800">{classes.length}</div>
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
            <div className="text-3xl md:text-5xl font-black">{submissions.filter(s => s.status === 'submitted').length}</div>
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
          <div className="text-3xl md:text-5xl font-black text-neutral-800">{assignments.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-800">Needs Review 📝</h2>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform hover:bg-neutral-800"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Create Assignment</span>
          </button>
        </div>
        
        {submissions.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-[2rem] border-2 border-neutral-100 text-neutral-500">No submissions to review!</div>
        ) : (
          <>
            {/* Mobile View (Cards) */}
            <div className="md:hidden space-y-4">
              {submissions.map(sub => {
                const assignment = assignments.find(a => a.id === sub.assignmentId);
                const studentName = students[sub.studentId]?.name || 'Unknown Student';
                return (
                  <div key={sub.id} className="bg-white p-5 rounded-[2rem] border-2 border-neutral-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-lg text-neutral-900">{studentName}</div>
                        <div className="text-sm font-medium text-neutral-500">{assignment?.title || 'Unknown Assignment'}</div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl">
                        <Clock size={12} /> {sub.status}
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
                  {submissions.map(sub => {
                    const assignment = assignments.find(a => a.id === sub.assignmentId);
                    const studentName = students[sub.studentId]?.name || 'Unknown Student';
                    return (
                      <tr key={sub.id} className="hover:bg-neutral-50/50 transition-colors group">
                        <td className="px-6 py-5 font-bold text-neutral-800">{studentName}</td>
                        <td className="px-6 py-5 text-neutral-600 font-medium">{assignment?.title || 'Unknown'}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${sub.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {sub.status === 'graded' ? <CheckCircle size={12} /> : <Clock size={12} />} 
                            {sub.status}
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
                            {sub.status === 'graded' ? 'Edit Grade' : 'Grade Now'}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h3 className="text-xl font-bold text-neutral-800">Create New Assignment</h3>
              <button 
                onClick={() => setIsCreating(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateAssignment} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-neutral-600">Title</label>
                <input 
                  required
                  type="text" 
                  value={newAssignment.title}
                  onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. My Unforgettable Holiday"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-neutral-600">Genre</label>
                  <input 
                    required
                    type="text" 
                    value={newAssignment.genre}
                    onChange={e => setNewAssignment({...newAssignment, genre: e.target.value})}
                    className="w-full p-3 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g. Recount Text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-neutral-600">Topic</label>
                  <input 
                    required
                    type="text" 
                    value={newAssignment.topic}
                    onChange={e => setNewAssignment({...newAssignment, topic: e.target.value})}
                    className="w-full p-3 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g. Personal Experience"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-neutral-600">Due Date</label>
                <input 
                  required
                  type="date" 
                  value={newAssignment.dueDate}
                  onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-neutral-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-neutral-600">Instructions</label>
                <textarea 
                  required
                  value={newAssignment.instructions}
                  onChange={e => setNewAssignment({...newAssignment, instructions: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors resize-none h-32"
                  placeholder="Write instructions for the students..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 text-sm font-bold text-neutral-500 hover:text-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
