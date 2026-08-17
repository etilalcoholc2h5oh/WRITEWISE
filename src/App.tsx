import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Sparkles, PenTool } from 'lucide-react';
import { Role, User } from './types';
import { auth, db } from './lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import StudentDashboard from './pages/student/StudentDashboard';
import WritingSpace from './pages/student/WritingSpace';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherReview from './pages/teacher/TeacherReview';

// Import our generated assets
import studentImg from './assets/images/chibi_student_1786859898494.jpg';
import teacherImg from './assets/images/chibi_teacher_1786859916336.jpg';
import logoImg from './assets/images/logo write wise AI-1.png';

function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const TEACHER_PIN = "123456";
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinAction, setPinAction] = useState<'select' | 'switch' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Fetch user profile
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile({ id: user.uid, ...docSnap.data() } as User);
          } else {
            setUserProfile(null); // User needs to select a role
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error("Guest login failed:", error);
      if (error.code === 'auth/admin-restricted-operation' || error.code === 'auth/operation-not-allowed') {
        alert("Mode Tamu (Anonymous) belum diaktifkan di Firebase!\n\nUntuk mengaktifkannya:\n1. Buka Firebase Console\n2. Masuk ke Authentication > Sign-in method\n3. Tambahkan 'Anonymous' dan Enable.");
      } else {
        alert("Gagal masuk sebagai tamu: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const executeSwitchRole = async (newRole: Role) => {
    if (!firebaseUser || !userProfile) return;
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), { role: newRole });
      setUserProfile({ ...userProfile, role: newRole });
      alert(`Berhasil berganti ke peran ${newRole}!`);
    } catch (error) {
      console.error("Error switching role:", error);
    }
  };

  const handleSwitchRole = () => {
    if (!userProfile) return;
    if (userProfile.role === 'student') {
      setPinAction('switch');
      setPinInput('');
      setShowPinModal(true);
    } else {
      executeSwitchRole('student');
    }
  };

  const verifyPin = async () => {
    if (pinInput === TEACHER_PIN) {
      setShowPinModal(false);
      if (pinAction === 'select') {
        await selectRole('teacher');
      } else if (pinAction === 'switch') {
        await executeSwitchRole('teacher');
      }
    } else {
      alert("PIN Salah! Akses ditolak.");
    }
  };

  const selectRole = async (selectedRole: Role) => {
    if (!firebaseUser) return;
    try {
      let displayName = firebaseUser.displayName;
      if (!displayName) {
        const guestNameEl = document.getElementById('guestName') as HTMLInputElement;
        displayName = guestNameEl?.value || "Siswa Tamu";
      }

      const newUserProfile: User = {
        id: firebaseUser.uid,
        name: displayName,
        role: selectedRole,
        email: firebaseUser.email || ''
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: newUserProfile.name,
        email: newUserProfile.email,
        role: newUserProfile.role
      });
      setUserProfile(newUserProfile);
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Could not save your role. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF9F1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!firebaseUser || !userProfile) {
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
          
          {!firebaseUser ? (
            <div className="relative z-10 pt-4 flex flex-col items-center gap-4">
              <button 
                onClick={handleLogin}
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 rounded-2xl font-bold transition-transform hover:-translate-y-1 shadow-lg text-lg flex items-center justify-center gap-3 w-full max-w-sm"
              >
                Sign in with Google
              </button>
              <button 
                onClick={handleGuestLogin}
                className="bg-white hover:bg-neutral-50 text-neutral-800 border-2 border-neutral-200 px-8 py-4 rounded-2xl font-bold transition-transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3 w-full max-w-sm"
              >
                Masuk Tanpa Akun (Tamu)
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 relative z-10">
              <div className="col-span-full mb-4 space-y-3">
                <h3 className="text-xl font-bold text-neutral-800">Welcome, {firebaseUser.displayName || 'Tamu'}!</h3>
                {!firebaseUser.displayName && (
                  <input 
                    type="text" 
                    id="guestName"
                    placeholder="Tuliskan nama kamu..."
                    className="p-3 border-2 border-neutral-200 rounded-xl w-full max-w-xs mx-auto block text-center font-bold focus:border-indigo-500 focus:outline-none"
                  />
                )}
                <p className="text-neutral-500">Please choose your role to continue:</p>
              </div>
              <button 
                onClick={() => selectRole('student')}
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
                onClick={() => {
                  setPinAction('select');
                  setPinInput('');
                  setShowPinModal(true);
                }}
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
          )}
        </div>
      </div>
    );
  }

  const role = userProfile.role;

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
            <button 
              onClick={handleSwitchRole}
              className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
            >
              <Sparkles size={16} />
              <span className="hidden md:inline">Switch to {role === 'student' ? 'Teacher' : 'Student'}</span>
            </button>
            <div className="hidden md:flex items-center text-sm font-bold text-neutral-700 bg-neutral-100 px-4 py-1.5 rounded-full">
              <img src={role === 'student' ? studentImg : teacherImg} alt="avatar" className="w-6 h-6 rounded-full mr-2 border border-neutral-200 object-cover" />
              {userProfile.name} <span className="text-neutral-400 ml-1 font-medium capitalize">({role})</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
          <Routes>
            <Route path="/" element={role === 'student' ? <StudentDashboard user={userProfile} /> : <TeacherDashboard user={userProfile} />} />
            <Route path="/student/write/:assignmentId" element={<WritingSpace user={userProfile} />} />
            <Route path="/teacher/review/:submissionId" element={<TeacherReview user={userProfile} />} />
          </Routes>
        </main>
      </div>

      {showPinModal && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl border border-neutral-100 p-6 space-y-4">
            <h3 className="text-xl font-bold text-neutral-800 text-center">Masukkan PIN Guru</h3>
            <p className="text-sm text-neutral-500 text-center">Demi keamanan, silakan masukkan PIN rahasia (123456) untuk mengakses dasbor Guru.</p>
            <input 
              type="password" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="PIN Guru..."
              className="w-full p-4 bg-neutral-50 border-2 border-neutral-200 rounded-xl text-center font-black text-xl tracking-[0.2em] focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowPinModal(false)}
                className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={verifyPin}
                className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
