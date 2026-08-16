import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAssignments } from '../../data/mockData';
import { ArrowLeft, Lightbulb, Info, CheckCircle, Wand2, Send, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

import aiMascot from '../../assets/images/chibi_ai_1786859929949.jpg';

export default function WritingSpace() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const assignment = mockAssignments.find(a => a.id === assignmentId);
  
  const [content, setContent] = useState('Yesterday, I go to the beach with my family.');
  const [activeAI, setActiveAI] = useState<'hint' | 'explain' | 'correction' | null>(null);
  const [isAiMobileOpen, setIsAiMobileOpen] = useState(false);
  
  const handleAIAction = (action: 'hint' | 'explain' | 'correction') => {
    setActiveAI(action);
  };

  const applyCorrection = () => {
    setContent(content.replace('go', 'went'));
    setActiveAI(null);
  };

  const submitWork = () => {
    alert("Assignment submitted! The AI will now generate an analysis for the teacher.");
    navigate('/');
  };

  if (!assignment) return <div>Assignment not found</div>;

  const renderTextWithHighlights = () => {
    if (content.includes('go')) {
      const parts = content.split('go');
      return (
        <>
          {parts[0]}
          <span className="relative group cursor-pointer inline-block">
            <span className="border-b-4 border-amber-400 bg-amber-100/50 px-1 rounded-md font-medium text-amber-900">go</span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-neutral-900 text-white text-xs px-3 py-2 rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
              Hmm, check this word! 👀
            </span>
          </span>
          {parts[1]}
        </>
      );
    }
    return content;
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-neutral-200 transition-colors">
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <button onClick={submitWork} className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
          <Send size={16} />
          Submit Work!
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full min-h-0 relative">
        {/* Editor Area */}
        <div className="flex-1 bg-white rounded-[2rem] border-2 border-neutral-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 md:p-6 border-b-2 border-neutral-100 bg-amber-50/30 flex items-center justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase tracking-wider rounded-lg mb-2">
                Writing Space
              </span>
              <h2 className="font-black text-xl text-neutral-800">{assignment.title}</h2>
              <p className="text-sm text-neutral-500 mt-1 font-medium">{assignment.instructions}</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 relative group bg-[#fbfbfb]">
            <div className="absolute inset-6 text-lg md:text-xl text-transparent pointer-events-none whitespace-pre-wrap font-sans leading-loose md:leading-loose">
              {renderTextWithHighlights()}
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none outline-none text-lg md:text-xl text-neutral-700 font-medium font-sans leading-loose md:leading-loose bg-transparent absolute inset-6 p-0"
              placeholder="Start your story here..."
            />
          </div>
        </div>

        {/* AI Assistant Sidebar (Desktop) / Bottom Sheet (Mobile) */}
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
            "bg-gradient-to-b from-blue-50/80 to-indigo-50/30 rounded-[2rem] border-2 border-blue-100 p-5 flex-1 flex flex-col overflow-hidden",
            !isAiMobileOpen && "hidden lg:flex"
          )}>
            <div className="flex items-center gap-3 text-blue-700 font-black mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                <img src={aiMascot} alt="AI Mascot" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl">AI Buddy</span>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 pb-8 lg:pb-0">
              {content.includes('go') ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border-2 border-amber-100 shadow-sm relative">
                    <div className="absolute -top-3 -right-3 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">1</div>
                    <p className="text-sm font-bold text-neutral-800">Oops, I spotted something! 🕵️</p>
                    <p className="text-xs text-neutral-500 mt-1 font-medium">Check out the highlighted word in your text.</p>
                    
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => handleAIAction('hint')}
                        className={cn("flex flex-col items-center justify-center p-2 rounded-xl border-2 text-xs font-bold transition-all", 
                          activeAI === 'hint' ? "bg-amber-100 border-amber-300 text-amber-800 scale-105 shadow-sm" : "bg-neutral-50 border-neutral-100 text-neutral-500 hover:bg-amber-50")}
                      >
                        <Lightbulb size={18} className="mb-1" /> Hint
                      </button>
                      <button 
                        onClick={() => handleAIAction('explain')}
                        className={cn("flex flex-col items-center justify-center p-2 rounded-xl border-2 text-xs font-bold transition-all", 
                          activeAI === 'explain' ? "bg-blue-100 border-blue-300 text-blue-800 scale-105 shadow-sm" : "bg-neutral-50 border-neutral-100 text-neutral-500 hover:bg-blue-50")}
                      >
                        <Info size={18} className="mb-1" /> Explain
                      </button>
                      <button 
                        onClick={() => handleAIAction('correction')}
                        className={cn("flex flex-col items-center justify-center p-2 rounded-xl border-2 text-xs font-bold transition-all", 
                          activeAI === 'correction' ? "bg-emerald-100 border-emerald-300 text-emerald-800 scale-105 shadow-sm" : "bg-neutral-50 border-neutral-100 text-neutral-500 hover:bg-emerald-50")}
                      >
                        <CheckCircle size={18} className="mb-1" /> Fix it
                      </button>
                    </div>
                  </div>

                  {activeAI === 'hint' && (
                    <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border-2 border-orange-200 text-orange-900 text-sm animate-in fade-in slide-in-from-top-2 shadow-sm font-medium">
                      <strong className="block mb-1 text-orange-800 flex items-center gap-1"><Lightbulb size={16}/> Small Hint:</strong>
                      Look at "Yesterday". What kind of time word is that? Should your verb be in the past or present? 🤔
                    </div>
                  )}

                  {activeAI === 'explain' && (
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl border-2 border-indigo-200 text-indigo-900 text-sm animate-in fade-in slide-in-from-top-2 shadow-sm font-medium">
                      <strong className="block mb-1 text-indigo-800 flex items-center gap-1"><Info size={16}/> Let's break it down:</strong>
                      "Yesterday" means it already happened! So instead of present tense, we need to use the simple past form.
                    </div>
                  )}

                  {activeAI === 'correction' && (
                    <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl border-2 border-teal-200 text-teal-900 text-sm animate-in fade-in slide-in-from-top-2 shadow-sm space-y-3 font-medium">
                      <div>
                        <strong className="block mb-2 text-teal-800 flex items-center gap-1"><Wand2 size={16}/> Magic Fix:</strong>
                        Change "go" to <span className="font-black text-emerald-900 bg-white/60 px-2 py-0.5 rounded-lg border border-emerald-300 mx-1">went</span>
                      </div>
                      <button onClick={applyCorrection} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-transform active:scale-95 shadow-sm">
                        Apply Magic ✨
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 bg-white rounded-2xl border-2 border-emerald-100 shadow-sm flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle size={32} />
                  </div>
                  <p className="text-lg font-black text-neutral-800">Looking awesome! 🌟</p>
                  <p className="text-sm font-medium text-neutral-500 mt-2">No errors detected right now. Keep up the great work!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
