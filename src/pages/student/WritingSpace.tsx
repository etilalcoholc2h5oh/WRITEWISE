import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Info, CheckCircle, Wand2, Send, ChevronUp, ChevronDown, Smile, Meh, Frown, Star, BookOpen, BrainCircuit } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import aiMascot from '../../assets/images/chibi_ai_1786859929949.jpg';

export default function WritingSpace({ user }: { user: any }) {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Steps: 'mood' -> 'write' -> 'reflect'
  const [step, setStep] = useState<'mood' | 'write' | 'reflect'>('mood');
  const [mood, setMood] = useState<'confident' | 'normal' | 'need_help' | null>(null);
  
  const [content, setContent] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [isAiMobileOpen, setIsAiMobileOpen] = useState(false);

  // Reflection
  const [difficulties, setDifficulties] = useState<Record<string, boolean>>({});
  const [learned, setLearned] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!assignmentId) return;
      try {
        const docRef = doc(db, 'assignments', assignmentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAssignment({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching assignment", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  const submitWork = async () => {
    if (!assignment) return;
    try {
      const subId = `sub_${Date.now()}`;
      await setDoc(doc(db, 'submissions', subId), {
        assignmentId: assignment.id,
        studentId: user.id,
        content: content,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        aiAnalysis: {
          suggestedScore: Math.floor(Math.random() * 20) + 80 // dummy score
        },
        aiLog: {
          errorsDetected: 2,
          hintsUsed: hintLevel,
          explainsOpened: 0,
          correctionsApplied: 0,
          revisionCount: 1
        },
        reflection: {
          mood,
          difficulties: Object.keys(difficulties).filter(k => difficulties[k]),
          learned,
          rating
        }
      });
      alert("Tugas berhasil dikumpulkan! Hebat!");
      navigate('/');
    } catch (error) {
      console.error("Error submitting", error);
      alert("Gagal mengumpulkan tugas.");
    }
  };

  if (loading) return <div className="text-center p-12">Loading...</div>;
  if (!assignment) return <div className="text-center p-12">Assignment not found</div>;

  const minWords = 50; // default min words
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const progressPercent = Math.min(100, (wordCount / minWords) * 100);
  const canContinueToReflect = wordCount >= minWords;

  // Render Mood Picker Step
  if (step === 'mood') {
    return (
      <div className="h-[calc(100vh-6rem)] flex items-center justify-center">
        <div className="bg-white p-8 rounded-[2rem] border border-blue-100 shadow-xl max-w-md w-full text-center">
          <img src={aiMascot} alt="AI Mascot" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-50 object-cover" />
          <h2 className="text-2xl font-black text-slate-800 mb-2">How do you feel about writing today?</h2>
          <p className="text-sm font-medium text-slate-500 mb-8">Ini membantu Wise menyesuaikan bantuan yang diberikan.</p>
          
          <div className="flex gap-4 justify-center">
            <button onClick={() => { setMood('confident'); setStep('write'); }} className="flex-1 p-4 rounded-2xl border-2 border-slate-100 hover:border-emerald-400 hover:bg-emerald-50 transition-all group">
              <Smile size={32} className="mx-auto mb-2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <span className="font-bold text-xs text-slate-600 group-hover:text-emerald-700">Confident</span>
            </button>
            <button onClick={() => { setMood('normal'); setStep('write'); }} className="flex-1 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50 transition-all group">
              <Meh size={32} className="mx-auto mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="font-bold text-xs text-slate-600 group-hover:text-blue-700">Okay</span>
            </button>
            <button onClick={() => { setMood('need_help'); setStep('write'); }} className="flex-1 p-4 rounded-2xl border-2 border-slate-100 hover:border-amber-400 hover:bg-amber-50 transition-all group">
              <Frown size={32} className="mx-auto mb-2 text-slate-400 group-hover:text-amber-500 transition-colors" />
              <span className="font-bold text-xs text-slate-600 group-hover:text-amber-700">Need Help</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Reflection Step
  if (step === 'reflect') {
    const difficultyOptions = ['Grammar', 'Vocabulary', 'Finding Ideas', 'Organization'];
    return (
      <div className="h-[calc(100vh-6rem)] flex flex-col md:items-center py-6">
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-blue-100 shadow-xl max-w-2xl w-full">
          <div className="flex items-center gap-4 mb-6">
            <img src={aiMascot} alt="AI Mascot" className="w-16 h-16 rounded-full border-4 border-blue-50 object-cover" />
            <div>
              <h2 className="text-2xl font-black text-slate-800">Great effort today! 🎉</h2>
              <div className="flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-max mt-1">
                <BookOpen size={14} /> Reflective Learning
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-bold text-slate-700 mb-3">Hari ini saya paling kesulitan pada...</p>
              <div className="grid grid-cols-2 gap-3">
                {difficultyOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setDifficulties(prev => ({...prev, [opt]: !prev[opt]}))}
                    className={cn("p-3 rounded-xl border-2 text-sm font-bold text-left transition-colors", 
                      difficulties[opt] ? "bg-blue-50 border-blue-400 text-blue-800" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100")}
                  >
                    {difficulties[opt] ? '✓ ' : ''}{opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-700 mb-3">Apa yang kamu pelajari hari ini?</p>
              <textarea 
                value={learned}
                onChange={e => setLearned(e.target.value)}
                rows={3}
                className="w-full font-medium text-sm rounded-xl border-2 border-slate-200 p-3 resize-none outline-none focus:border-blue-400"
                placeholder="Tulis refleksimu..."
              />
            </div>

            <div>
              <p className="font-bold text-slate-700 mb-3">Was Wise's hint helpful?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star size={32} className={cn("transition-colors", star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 hover:text-amber-200")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button onClick={() => setStep('write')} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors">
                Back to Edit
              </button>
              <button onClick={submitWork} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-bold transition-transform hover:-translate-y-1 shadow-lg">
                <Send size={18} />
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Main Editor
  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-neutral-200 transition-colors">
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <button 
          onClick={() => setStep('reflect')} 
          disabled={!canContinueToReflect}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Reflection
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full min-h-0 relative">
        {/* Editor Area */}
        <div className="flex-1 bg-white rounded-[2rem] border-2 border-neutral-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 md:p-6 border-b-2 border-neutral-100 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase tracking-wider rounded-lg mb-2">
                Writing Space
              </span>
              <h2 className="font-black text-xl text-neutral-800">{assignment.title}</h2>
              <p className="text-sm text-neutral-500 mt-1 font-medium">{assignment.instructions}</p>
            </div>
            
            <div className="shrink-0 w-full md:w-48">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Progress</span>
                <span>{wordCount} / {minWords} words</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-500", wordCount >= minWords ? "bg-emerald-500" : "bg-blue-500")}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium leading-tight">
                Penilaian kualitas tulisan ditentukan guru lewat rubrik di Teacher Review, bukan angka otomatis di sini.
              </p>
            </div>
          </div>
          
          <div className="flex-1 relative group bg-[#fbfbfb]">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none outline-none w-full h-full text-lg md:text-xl text-neutral-700 font-medium font-sans leading-loose md:leading-loose bg-transparent p-6 whitespace-pre-wrap break-words overflow-y-auto focus:ring-4 focus:ring-inset focus:ring-blue-50/50"
              placeholder="Start your story here..."
              onPaste={(e) => {
                e.preventDefault();
                alert("Paste dinonaktifkan untuk menjaga keaslian tulisanmu 😊");
              }}
            />
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className={cn(
          "lg:w-[360px] flex flex-col gap-4 transition-all duration-300 z-20",
          "fixed inset-x-0 bottom-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[2rem] p-4 border-t-2 border-blue-100 lg:relative lg:inset-auto lg:shadow-none lg:bg-transparent lg:rounded-none lg:p-0 lg:border-none",
          isAiMobileOpen ? "h-[60vh] lg:h-auto" : "h-[80px] lg:h-auto"
        )}>
          {/* Mobile Toggle Handle */}
          <button 
            className="lg:hidden absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-blue-100 shadow-sm flex items-center justify-center text-blue-500"
            onClick={() => setIsAiMobileOpen(!isAiMobileOpen)}
          >
            {isAiMobileOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>

          <div className={cn(
            "bg-white rounded-[2rem] border-2 border-blue-100 p-5 flex-1 flex flex-col overflow-hidden shadow-sm",
            !isAiMobileOpen && "hidden lg:flex"
          )}>
            <div className="flex items-center gap-3 text-slate-800 font-black mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm shrink-0">
                <img src={aiMascot} alt="AI Mascot" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg">Wise AI Companion</span>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 space-y-4">
              {hintLevel === 0 && (
                <button 
                  onClick={() => setHintLevel(1)}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-4 rounded-xl border-2 border-blue-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Lightbulb size={20} />
                  Get a Hint 💡
                </button>
              )}

              {hintLevel >= 1 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="font-bold text-xs text-amber-700 mb-1">HINT L1</p>
                  <p className="font-medium text-sm text-slate-700 mb-2">
                    💡 Coba ceritakan di mana lokasinya, siapa saja yang ikut, dan bagaimana cuaca hari itu.
                  </p>
                  <span className="inline-block font-bold text-[10px] bg-white border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full mb-3">Fokus: Finding Ideas</span>
                  
                  {hintLevel === 1 && (
                    <button 
                      onClick={() => setHintLevel(2)}
                      className="w-full mt-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 rounded-lg border border-slate-200 transition-colors text-xs"
                    >
                      Get Next-Level Hint 💡
                    </button>
                  )}
                </div>
              )}

              {hintLevel >= 2 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mt-3">
                  <p className="font-bold text-xs text-amber-700 mb-1">HINT L2</p>
                  <p className="font-medium text-sm text-slate-700 mb-2">
                    💡 Untuk membuat kalimat yang menarik, gunakan kata sifat. Misalnya: "The beach was very crowded" atau "The sun shone brightly".
                  </p>
                  <span className="inline-block font-bold text-[10px] bg-white border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full mb-2">Fokus: Vocabulary</span>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-slate-100">
                <p className="font-bold text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <BrainCircuit size={14} /> AI Principles
                </p>
                <ul className="text-xs font-medium text-slate-500 space-y-2">
                  <li className="flex items-start gap-1">
                    <span className="text-emerald-500">✓</span> Gives hints, never full answers
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-emerald-500">✓</span> Never writes your essay
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-emerald-500">✓</span> Never replaces your teacher
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

