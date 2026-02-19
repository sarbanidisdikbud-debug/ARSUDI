
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  Send, 
  PlusCircle, 
  Search, 
  Settings as SettingsIcon, 
  FileText, 
  Menu, 
  X,
  Sparkles,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Users as UsersIcon,
  GraduationCap,
  AlertTriangle
} from 'lucide-react';
import { Letter, User } from './types';
import { INITIAL_LETTERS, CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import LetterForm from './components/LetterForm';
import LetterList from './components/LetterList';
import LetterDetail from './components/LetterDetail';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [appTitle, setAppTitle] = useState(() => localStorage.getItem('app_title') || 'ARSUDI');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [letters, setLetters] = useState<Letter[]>(() => {
    try {
      const saved = localStorage.getItem('letters_data');
      return saved ? JSON.parse(saved) : INITIAL_LETTERS;
    } catch { return INITIAL_LETTERS; }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('app_users');
      return saved ? JSON.parse(saved) : [
        { id: '1', username: 'admin', password: 'admin123', role: 'ADMIN', fullName: 'Administrator Utama' },
        { id: '2', username: 'staff', password: 'staff123', role: 'USER', fullName: 'Staff Kearsipan' }
      ];
    } catch { return []; }
  });

  useEffect(() => { 
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user)); 
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);
  
  useEffect(() => { localStorage.setItem('letters_data', JSON.stringify(letters)); }, [letters]);
  useEffect(() => { localStorage.setItem('app_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('app_title', appTitle); }, [appTitle]);

  if (!user) return <Login onLogin={setUser} users={users} />;

  const handleLogout = () => {
    if (!logoutConfirm) {
      setLogoutConfirm(true);
      setTimeout(() => setLogoutConfirm(false), 3000);
      return;
    }
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddLetter = (newLetter: Letter) => {
    setLetters(prev => [newLetter, ...prev]);
  };

  const handleUpdateLetter = (updatedLetter: Letter) => {
    setLetters(prev => prev.map(l => l.id === updatedLetter.id ? updatedLetter : l));
  };

  // Helper component for editing letters
  const EditLetterWrapper = () => {
    const { id } = useParams();
    const letterToEdit = letters.find(l => l.id === id);
    if (!letterToEdit) return <Navigate to="/list" />;
    return <LetterForm onAdd={handleUpdateLetter} initialData={letterToEdit} />;
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* Sidebar Modern */}
        <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} transition-all duration-500 bg-slate-950 text-white flex flex-col z-50 relative border-r border-white/5`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full -z-10" />
          
          <div className="p-8 flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/30 shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-black text-xl tracking-tighter text-white truncate uppercase">{appTitle}</h1>
                <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">PAUD DAN PNF</p>
              </div>
            )}
          </div>

          <nav className="flex-1 px-5 space-y-2 overflow-y-auto custom-scrollbar">
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isSidebarOpen} />
            <SidebarLink to="/list" icon={<Inbox size={20} />} label="Semua Arsip" isOpen={isSidebarOpen} />
            <SidebarLink to="/add" icon={<PlusCircle size={20} />} label="Tambah Surat" isOpen={isSidebarOpen} />
            {user.role === 'ADMIN' && <SidebarLink to="/users" icon={<UsersIcon size={20} />} label="Manajemen User" isOpen={isSidebarOpen} />}
          </nav>

          <div className="p-5 mt-auto border-t border-white/5 space-y-4 bg-slate-950/50 backdrop-blur-md">
             <div className={`p-4 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4 ${!isSidebarOpen && 'justify-center p-2'}`}>
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 font-black text-white text-xs shadow-lg shadow-indigo-600/20">
                   {user.fullName.charAt(0)}
                </div>
                {isSidebarOpen && (
                  <div className="overflow-hidden">
                    <p className="text-xs font-black truncate text-white uppercase">{user.fullName}</p>
                    <p className="text-[9px] text-indigo-400 font-bold flex items-center gap-1 uppercase tracking-widest">
                       <ShieldCheck size={10} /> {user.role}
                    </p>
                  </div>
                )}
             </div>

             <div className="flex flex-col gap-2">
               <SidebarLink to="/settings" icon={<SettingsIcon size={20} />} label="Pengaturan" isOpen={isSidebarOpen} />
               
               <button 
                type="button"
                onClick={handleLogout}
                title={!isSidebarOpen ? (logoutConfirm ? "Konfirmasi Keluar" : "Keluar Sistem") : ""}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${!isSidebarOpen && 'justify-center'} ${
                  logoutConfirm 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40 animate-pulse' 
                    : 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
                }`}
               >
                 {logoutConfirm ? (
                   <AlertTriangle size={22} className="shrink-0" />
                 ) : (
                   <LogOut size={22} className="shrink-0 group-hover:scale-110 transition-transform" />
                 )}
                 {isSidebarOpen && (
                   <span className="text-[11px] font-black uppercase tracking-widest truncate">
                     {logoutConfirm ? "Klik Lagi Konfirmasi" : "Keluar Sistem"}
                   </span>
                 )}
               </button>

               <button 
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={!isSidebarOpen ? "Buka Sidebar" : "Tutup Sidebar"}
                className={`w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:bg-white/5 hover:text-slate-300 rounded-2xl transition-all duration-300 ${!isSidebarOpen && 'justify-center'}`}
               >
                 {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                 {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">Sembunyikan</span>}
               </button>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 p-6 px-10 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-6">
               <div className="hidden md:flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Kabupaten Balangan</span>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{appTitle}</h2>
               </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative group hidden lg:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Cari perihal surat..." 
                  className="pl-12 pr-6 py-3 bg-slate-100 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-xs font-bold w-64 transition-all"
                />
              </div>
              <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2 shadow-sm">
                <Sparkles size={14} className="animate-pulse" />
                AI Enhanced System
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
             <div className="absolute top-20 right-20 text-indigo-500/5 -rotate-12 pointer-events-none">
                <GraduationCap size={400} />
             </div>
             
             <div className="max-w-7xl mx-auto relative z-10">
                <Routes>
                  <Route path="/" element={<Dashboard letters={letters} />} />
                  <Route path="/list" element={<LetterList letters={letters} onDelete={id => setLetters(l => l.filter(x => x.id !== id))} />} />
                  <Route path="/add" element={<LetterForm onAdd={handleAddLetter} />} />
                  <Route path="/edit/:id" element={<EditLetterWrapper />} />
                  <Route path="/users" element={user.role === 'ADMIN' ? <UserManagement users={users} onAddUser={nu => setUsers([...users, nu])} onDeleteUser={id => setUsers(u => u.filter(x => x.id !== id))} onUpdateUser={handleUpdateUser} /> : <Navigate to="/" />} />
                  <Route path="/letter/:id" element={<LetterDetail letters={letters} userRole={user.role} onUpdate={handleUpdateLetter} onDelete={id => setLetters(ls => ls.filter(x => x.id !== id))} />} />
                  <Route path="/settings" element={<Settings currentUser={user} onUpdateUser={setUser} onUpdateAppTitle={setAppTitle} appTitle={appTitle} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
             </div>
          </div>
        </main>
      </div>
    </Router>
  );
};

const SidebarLink = ({ to, icon, label, isOpen }: any) => {
  const loc = useLocation();
  const active = loc.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
        active 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 font-black' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      } ${!isOpen && 'justify-center'}`}
    >
      <div className="shrink-0">{icon}</div>
      {isOpen && <span className="text-[11px] font-black uppercase tracking-widest truncate">{label}</span>}
    </Link>
  );
};

export default App;
