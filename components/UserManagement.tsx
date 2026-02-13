
import React, { useState } from 'react';
import { 
  UserPlus, 
  Trash2, 
  Shield, 
  User as UserIcon,
  Check,
  X
} from 'lucide-react';
import { User, UserRole } from '../types';

interface Props {
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserManagement({ users, onAddUser, onDeleteUser }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    role: 'USER' as UserRole
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: formData.username,
      fullName: formData.fullName,
      password: formData.password,
      role: formData.role
    };
    onAddUser(newUser);
    setIsAdding(false);
    setFormData({ username: '', fullName: '', password: '', role: 'USER' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h2>
          <p className="text-slate-500 text-sm">Kelola akses dan akun staff kearsipan</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          {isAdding ? <X size={18} /> : <UserPlus size={18} />}
          {isAdding ? 'Batal' : 'Tambah User'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm animate-in zoom-in-95 duration-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nama Lengkap</label>
              <input 
                required
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Staff IT"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
              <input 
                required
                type="text"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="username"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
              <input 
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="******"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="USER">Staff (Archive & View)</option>
                  <option value="ADMIN">Admin (Full Access)</option>
                </select>
              </div>
              <button type="submit" className="p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors self-end">
                <Check size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Username</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{u.fullName}</p>
                      <p className="text-xs text-slate-400">ID: {u.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600">
                    {u.username}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    u.role === 'ADMIN' 
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {u.role === 'ADMIN' ? <Shield size={10} /> : <UserIcon size={10} />}
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {u.username !== 'admin' && (
                    <button 
                      onClick={() => onDeleteUser(u.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Hapus User"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
