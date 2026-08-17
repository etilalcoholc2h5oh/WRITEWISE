import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Sparkles, Activity, CheckSquare, Save } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, Assignment, Submission } from '../../types';

import aiImg from '../../assets/images/chibi_ai_1786859929949.jpg';

export default function TeacherReview({ user }: { user: User }) {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [student, setStudent] = useState<User | null>(null);
  
  const [finalScore, setFinalScore] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!submissionId) return;
        
        // Fetch submission
        const subRef = doc(db, 'submissions', submissionId);
        const subSnap = await getDoc(subRef);
        if (!subSnap.exists()) return;
        const subData = { id: subSnap.id, ...subSnap.data() } as Submission;
        setSubmission(subData);
        setFinalScore(subData.teacherFeedback?.score || subData.aiAnalysis?.suggestedScore || 0);
        setFeedback(subData.teacherFeedback?.feedback || '');

        // Fetch assignment
        const assignRef = doc(db, 'assignments', subData.assignmentId);
        const assignSnap = await getDoc(assignRef);
        if (assignSnap.exists()) {
          setAssignment({ id: assignSnap.id, ...assignSnap.data() } as Assignment);
        }

        // Fetch student
        const studentRef = doc(db, 'users', subData.studentId);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          setStudent({ id: studentSnap.id, ...studentSnap.data() } as User);
        }

      } catch (error) {
        console.error("Error fetching review data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [submissionId]);


  if (loading) return <div className="text-center p-12">Loading...</div>;
  if (!submission || !assignment) return <div className="text-center p-12">Submission not found</div>;

  const { aiLog, aiAnalysis } = submission;

  const saveReview = async () => {
    if (!submission) return;
    
    try {
      await updateDoc(doc(db, 'submissions', submission.id), {
        status: 'graded',
        teacherFeedback: {
          score: finalScore,
          feedback: feedback,
          gradedAt: new Date().toISOString()
        }
      });
      alert('Review saved! Final score and feedback sent to student.');
      navigate('/');
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-neutral-200 transition-colors">
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <button onClick={saveReview} className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
          <Save size={16} />
          Finalize Grade
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
        
        {/* Column 1: Writing & Student Info */}
        <div className="flex-1 flex flex-col gap-4 min-h-[400px] lg:min-h-0">
          <div className="bg-white p-4 md:p-5 rounded-[2rem] border-2 border-neutral-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-indigo-500 border-2 border-indigo-200 shadow-inner">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="font-black text-neutral-800 text-xl">{student?.name || 'Unknown Student'}</h2>
              <p className="text-xs md:text-sm font-medium text-neutral-500">{assignment.title} • {new Date(submission.submittedAt || '').toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 md:p-8 rounded-[2rem] border-2 border-neutral-100 shadow-sm overflow-y-auto">
            <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 font-bold text-[10px] uppercase tracking-wider rounded-lg mb-4">
              Final Draft
            </div>
            <div className="text-lg md:text-xl font-medium leading-loose text-neutral-800 whitespace-pre-wrap font-sans">
              {submission.content}
            </div>
          </div>
        </div>

        {/* Column 2: AI Analysis & Assistance Log */}
        <div className="lg:w-[340px] flex flex-col gap-6 overflow-y-auto pr-1">
          <div className="bg-white p-5 md:p-6 rounded-[2rem] border-2 border-purple-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-3 font-black text-purple-700 mb-6 relative z-10 text-lg">
              <img src={aiImg} alt="AI" className="w-8 h-8 rounded-full border border-purple-200" />
              AI Analysis
            </div>
            
            <div className="space-y-5 relative z-10">
              <div className="p-5 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl border-2 border-purple-100 text-center">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Suggested Score</div>
                <div className="text-4xl font-black text-purple-700">{aiAnalysis?.suggestedScore}<span className="text-lg text-purple-400">/100</span></div>
              </div>
              
              <div>
                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Summary</h4>
                <p className="text-sm font-medium text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-2xl">{aiAnalysis?.summary}</p>
              </div>
              
              <div>
                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Error Patterns</h4>
                <div className="flex flex-col gap-2">
                  {aiAnalysis?.errorPatterns.map((pattern, i) => (
                    <div key={i} className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl">
                      • {pattern}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {aiLog && (
            <div className="bg-white p-5 md:p-6 rounded-[2rem] border-2 border-blue-100 shadow-sm flex-1">
              <div className="flex items-center gap-2 font-black text-blue-700 mb-2 text-lg">
                <Activity size={20} />
                Process Log
              </div>
              <p className="text-xs font-medium text-neutral-400 mb-5">How the student wrote this piece.</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xs font-bold text-neutral-600">Errors Detected</span>
                  <span className="font-black text-neutral-800 text-lg">{aiLog.errorsDetected}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                  <span className="text-xs font-bold text-amber-700">Hints Used</span>
                  <span className="font-black text-amber-600 text-lg">{aiLog.hintsUsed}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-xs font-bold text-blue-700">Explains Opened</span>
                  <span className="font-black text-blue-600 text-lg">{aiLog.explainsOpened}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                  <span className="text-xs font-bold text-emerald-700">Fixes Applied</span>
                  <span className="font-black text-emerald-600 text-lg">{aiLog.correctionsApplied}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl mt-4">
                  <span className="text-xs font-bold text-neutral-600">Total Revisions</span>
                  <span className="font-black text-neutral-800 text-lg">{aiLog.revisionCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Rubric & Teacher Feedback */}
        <div className="lg:w-[400px] bg-white rounded-[2rem] border-2 border-neutral-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b-2 border-neutral-100 flex items-center gap-2 font-black text-neutral-800 text-lg bg-emerald-50/50">
            <CheckSquare size={24} className="text-emerald-500" />
            Grading & Feedback
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div>
              <h4 className="text-sm font-black text-neutral-800 mb-4 flex items-center justify-between">
                Rubric
                <span className="text-[10px] font-bold text-neutral-400 uppercase bg-neutral-100 px-2 py-1 rounded-lg">AI hints included</span>
              </h4>
              <div className="space-y-3">
                {Object.entries(aiAnalysis?.rubricSuggestions || {}).map(([category, score]) => (
                  <div key={category} className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl">
                    <span className="text-xs font-bold text-neutral-700">{category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-purple-400 uppercase">AI: {score}</span>
                      <input 
                        type="number" 
                        defaultValue={score as number}
                        className="w-16 p-2 bg-white border-2 border-neutral-200 rounded-xl text-center text-sm font-black text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
                        min={0}
                        max={20}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-neutral-800 mb-3">Your Feedback</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Give awesome feedback here! 🚀"
                className="w-full h-32 p-4 bg-neutral-50 border-2 border-neutral-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 resize-none transition-all"
              />
            </div>
          </div>

          <div className="p-6 border-t-2 border-neutral-100 bg-neutral-900 text-white rounded-b-[2rem] m-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-400">FINAL SCORE</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={finalScore}
                  onChange={(e) => setFinalScore(parseInt(e.target.value))}
                  className="w-24 p-2 text-3xl font-black text-white text-right bg-transparent border-b-2 border-neutral-700 focus:border-emerald-500 focus:outline-none transition-colors"
                />
                <span className="text-neutral-500 font-bold text-xl">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
