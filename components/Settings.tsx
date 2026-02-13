
import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Building2, 
  Monitor, 
  Save, 
  Download, 
  Trash2, 
  ShieldCheck,
  Database,
  Info
} from 'lucide-react';
import { User } from '../types';

interface Props {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onUpdateAppTitle: (title: string) => void;
  appTitle: string;
}

export default function Settings({ currentUser, onUpdateUser, onUpdateAppTitle, appTitle }: Props) {
  const [activeTab, setActiveTab] = useState<'profil' | 'organisasi' | 'sistem'>('profil');
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [username, setUsername] = useState(currentUser.username);
  const [tempAppTitle, setTempAppTitle] = useState(appTitle);
  const [storageUsage, setStorageUsage] = useState<string>('0 KB');

  useEffect(() => {
    // Menghitung estimasi penggunaan localStorage
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length + key.length) * 2;
      }
    }
    setStorageUsage((total / 1024).toFixed(2) + ' KB');
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...currentUser, fullName, username });
    alert('Profil berhasil diperbarui!');
  };

  const handleUpdateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAppTitle(tempAppTitle);
    alert('Pengaturan organisasi diperbarui!');
  };

  const handleExportData = () => {
    const data = {
      letters: localStorage.getItem('letters_data') || '[]',
      users: localStorage.getItem('app_users') || '[]',
      config: { appTitle, exportDate: new Date().toISOString() }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_arsip_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan Sistem</h2>
        <p className="text-slate-500 font-medium">Kustomisasi akun dan parameter aplikasi arsip digital</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-6 space-y-2">
          <TabButton 
            active={activeTab === 'profil'} 
            onClick={() => setActiveTab('profil')} 
            icon={<UserIcon size={18} />} 
            label="Profil Saya" 
          />
          {currentUser.role === 'ADMIN' && (
            <TabButton 
              active={activeTab === 'organisasi'} 
              onClick={() => setActiveTab('organisasi')} 
              icon={<Building2 size={18} />} 
              label="Kustomisasi Instansi" 
            />
          )}
          <TabButton 
            active={activeTab === 'sistem'} 
            onClick={() => setActiveTab('sistem')} 
            icon={<Monitor size={18} />} 
            label="Sistem & Keamanan" 
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12">
          {activeTab === 'profil' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-100 text-indigo-600 rounded-3xl">
                  <UserIcon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Informasi Pribadi</h3>
                  <p className="text-sm text-slate-500">Kelola identitas publik Anda dalam aplikasi</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    <Save size={18} /> Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'organisasi' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
               <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-3xl">
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Profil Instansi</h3>
                  <p className="text-sm text-slate-500">Sesuaikan identitas lembaga pada sistem arsip</p>
                </div>
              </div>

              <form onSubmit={handleUpdateOrg} className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Aplikasi / Header</label>
                  <input 
                    type="text" 
                    value={tempAppTitle}
                    onChange={(e) => setTempAppTitle(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
                  />
                  <p className="text-[10px] text-slate-400 font-bold italic mt-2">Nama ini akan muncul di sidebar dan laporan resmi.</p>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
                   <Info className="text-indigo-400 shrink-0" size={20} />
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">
                     Perubahan di sini bersifat global. Semua pengguna yang masuk akan melihat identitas organisasi yang baru setelah halaman dimuat ulang.
                   </p>
                </div>

                <div className="pt-4">
                  <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                    <Save size={18} /> Perbarui Instansi
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'sistem' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
               <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-slate-100 text-slate-600 rounded-3xl">
                  <Database size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Status & Pemeliharaan</h3>
                  <p className="text-sm text-slate-500">Monitor kesehatan database dan lakukan backup</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Penyimpanan Lokal</p>
                  <h4 className="text-3xl font-black text-indigo-600">{storageUsage}</h4>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '5%' }} />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-2 font-bold italic">Batas aman: 5 MB (Browser standard)</p>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keamanan Sesi</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-black">
                    <ShieldCheck size={20} />
                    <span>Terproteksi</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-bold">
                    Sesi login Anda mengenkripsi data sensitif di level aplikasi.
                  </p>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                   <Download size={16} className="text-indigo-500" /> Cadangan Data (Backup)
                </h4>
                <p className="text-xs text-slate-500 font-medium">Lakukan ekspor data secara berkala untuk menjaga keamanan arsip Anda dari kegagalan browser.</p>
                <button 
                  onClick={handleExportData}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95 group"
                >
                  <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> Ekspor Seluruh Arsip (.JSON)
                </button>
              </div>

              {currentUser.role === 'ADMIN' && (
                <div className="pt-10 border-t border-slate-100">
                   <h4 className="text-sm font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                    <Trash2 size={16} /> Zona Bahaya
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-2">Menghapus seluruh data aplikasi akan mengembalikan sistem ke kondisi awal.</p>
                  <button 
                    onClick={() => { if(confirm('Hapus seluruh data? Tindakan ini tidak bisa dibatalkan!')) { localStorage.clear(); window.location.reload(); }}}
                    className="mt-4 px-6 py-3 border-2 border-rose-100 text-rose-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 transition-all"
                  >
                    Reset Aplikasi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
        active 
          ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200/50' 
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
      }`}
    >
      <div className={`shrink-0 ${active ? 'text-indigo-600' : 'text-slate-300'}`}>
        {icon}
      </div>
      <span className="tracking-tight">{label}</span>
    </button>
  );
}
