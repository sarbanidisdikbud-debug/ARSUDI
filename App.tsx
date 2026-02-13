
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
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
  Users as UsersIcon
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
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [appTitle, setAppTitle] = useState(() => {
    return localStorage.getItem('app_title') || 'ARSIP SURAT PAUD DAN PNF';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', username: 'admin', password: 'admin123', role: 'ADMIN', fullName: 'Administrator Utama' },
      { id: '2', username: 'user', password: 'user123', role: 'USER', fullName: 'Staff Kearsipan' }
    ];
  });

  const [letters, setLetters] = useState<Letter[]>(() => {
    const saved = localStorage.getItem('letters_data');
    return saved ? JSON.parse(saved) : INITIAL_LETTERS;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('letters_data', JSON.stringify(letters));
  }, [letters]);

  useEffect(() => {
    localStorage.setItem('app_title', appTitle);
  }, [appTitle]);

  const handleLogout = () => {
    setUser(null);
  };

  const addLetter = (newLetter: Letter) => {
    setLetters(prev => [newLetter, ...prev]);
  };

  const deleteLetter = (id: string) => {
    setLetters(prev => prev.filter(l => l.id !== id));
  };

  const updateLetter = (updated: Letter) => {
    setLetters(prev => prev.map(l => l.id === updated.id ? updated : l));
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} users={users} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  const isAdmin = user.role === 'ADMIN';

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 text-white flex flex-col z-50`}>
          <div className="p-6 flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'justify-center'}`}>
              <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-white line-clamp-1">{appTitle}</span>}
            </div>
          </div>

          <nav className="flex-1 mt-6 px-4 space-y-2">
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isSidebarOpen} />
            <SidebarLink to="/list" icon={<Inbox size={20} />} label="Semua Arsip" isOpen={isSidebarOpen} />
            <SidebarLink to="/add" icon={<PlusCircle size={20} />} label="Tambah Surat" isOpen={isSidebarOpen} />
            
            {isAdmin && (
              <>
                <SidebarLink to="/users" icon={<UsersIcon size={20} />} label="Manajemen User" isOpen={isSidebarOpen} />
              </>
            )}

            <div className="border-t border-slate-800 my-4 pt-4">
              <span className={`text-xs font-semibold text-slate-500 uppercase px-2 mb-2 block ${!isSidebarOpen && 'text-center'}`}>
                {isSidebarOpen ? 'Kategori Cepat' : '...'}
              </span>
              {isSidebarOpen && (
                <div className="space-y-1">
                  {CATEGORIES.slice(0, 4).map(cat => (
                    <Link key={cat} to={`/list?category=${cat}`} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-1">
            <div className={`flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-slate-800/50 border border-slate-700 ${!isSidebarOpen && 'justify-center p-2'}`}>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                <UserIcon size={16} />
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden text-white">
                  <p className="text-xs font-bold truncate">{user.fullName}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                    <ShieldCheck size={10} className="text-indigo-400" /> {user.role}
                  </p>
                </div>
              )}
            </div>
            
            <SidebarLink to="/settings" icon={<SettingsIcon size={20} />} label="Pengaturan" isOpen={isSidebarOpen} />
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-900/30 rounded-lg transition-colors ${!isSidebarOpen && 'justify-center'}`}
            >
              <LogOut size={20} />
              {isSidebarOpen && <span>Keluar</span>}
            </button>
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 rounded-lg transition-colors ${!isSidebarOpen && 'justify-center'}`}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              {isSidebarOpen && <span>Tutup Menu</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">{appTitle}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Cari cepat..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-full text-sm w-48 focus:w-64 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                <Sparkles size={14} />
                AI Enhanced
              </div>
            </div>
          </header>

          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard letters={letters} />} />
              <Route path="/list" element={<LetterList letters={letters} onDelete={isAdmin ? deleteLetter : undefined} />} />
              <Route path="/add" element={<LetterForm onAdd={addLetter} />} />
              <Route path="/users" element={isAdmin ? <UserManagement users={users} onAddUser={addUser} onDeleteUser={deleteUser} /> : <Navigate to="/" replace />} />
              <Route path="/letter/:id" element={<LetterDetail letters={letters} userRole={user.role} onUpdate={updateLetter} onDelete={deleteLetter} />} />
              <Route path="/settings" element={
                <Settings 
                  currentUser={user} 
                  onUpdateUser={updateUser} 
                  onUpdateAppTitle={setAppTitle}
                  appTitle={appTitle}
                />
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 font-semibold' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      } ${!isOpen && 'justify-center'}`}
    >
      <div className="shrink-0">{icon}</div>
      {isOpen && <span className="font-medium">{label}</span>}
    </Link>
  );
};

export default App;
