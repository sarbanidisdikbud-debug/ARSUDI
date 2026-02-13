
import React, { useState } from 'react';
import { Lock, User as UserIcon, AlertCircle, Loader2, FileText } from 'lucide-react';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
  users: User[];
}

export default function Login({ onLogin, users }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const foundUser = users.find(u => u.username === username && u.password === password);
      
      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('Username atau password salah.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Background Layer with Ken Burns Effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 animate-ken-burns"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")',
        }}
      />
      
      {/* Moving Blobs for Dynamic Feel */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Main Overlay Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-indigo-950/80" />

      {/* Login Container */}
      <div className="relative z-10 max-w-md w-full px-4 py-12">
        <div className="text-center mb-8 animate-float">
          <div className="inline-flex p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl mb-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <FileText size={50} className="text-white drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl mb-2">
            ARSUDI<span className="text-indigo-400"> PAUD DAN PNF</span>
          </h1>
          <p className="text-indigo-100/60 font-semibold uppercase tracking-[0.3em] text-xs">Arsip Surat Digital</p>
          <p className="text-indigo-100/60 font-semibold uppercase tracking-[0.3em] text-xs">PAUD dan PNF </p>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 animate-in fade-in zoom-in-95 duration-700">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Login Portal</h2>
            <p className="text-slate-500 text-sm mt-1">Sistem Pengarsipan Digital Cerdas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm animate-shake">
                <AlertCircle size={20} />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-widest">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <UserIcon size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-widest">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.25rem] font-black shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-3 mt-4 group active:scale-[0.97] disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span className="text-lg uppercase">Masuk Sistem</span>
                  <div className="bg-white/20 p-1.5 rounded-lg group-hover:translate-x-1 transition-transform">
                    <FileText size={18} className="text-white" />
                  </div>
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-12 space-y-2">
          <p className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase">
            Modern Digital Solution
          </p>
          <p className="text-white/20 text-[9px] uppercase tracking-widest">
            &copy;  BP PAUD & PNF - Digital Archive
          </p>
        </div>
      </div>
    </div>
  );
}
