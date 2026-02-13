
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Loader2, 
  FileText,
  Upload,
  X,
  AlertCircle,
  Sparkles,
  FileBadge,
  GraduationCap,
  BookOpen,
  Library,
  School,
  Pencil,
  Lightbulb
} from 'lucide-react';
import { Letter } from '../types';
import { CATEGORIES, EDUCATION_LEVELS } from '../constants';

interface Props {
  onAdd: (letter: Letter) => void;
  initialData?: Letter;
}

export default function LetterForm({ onAdd, initialData }: Props) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.attachment || null);

  const [formData, setFormData] = useState<Omit<Letter, 'id' | 'aiSummary' | 'tags' | 'attachment' | 'content'>>(
    initialData ? {
      number: initialData.number,
      title: initialData.title,
      sender: initialData.sender,
      receiver: initialData.receiver,
      date: initialData.date,
      category: initialData.category,
      type: initialData.type,
      description: initialData.description,
      educationLevel: initialData.educationLevel || 'Umum',
    } : {
      number: '',
      title: '',
      sender: '',
      receiver: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Dinas',
      type: 'MASUK',
      description: '',
      educationLevel: 'Umum',
    }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran berkas terlalu besar. Maksimal 5MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      onAdd({
        ...formData,
        content: '', 
        id: initialData?.id || Math.random().toString(36).substr(2, 9),
        tags: [formData.category.toLowerCase(), (formData.educationLevel || '').toLowerCase()],
        attachment: preview || undefined
      });
      setLoading(false);
      navigate('/list');
    }, 800);
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] -m-8 p-8 overflow-hidden bg-slate-50/50">
      <div className="absolute top-[10%] left-[5%] text-indigo-200/40 animate-float opacity-30">
        <GraduationCap size={120} />
      </div>
      <div className="absolute bottom-[15%] right-[5%] text-emerald-200/40 animate-float animation-delay-2000 opacity-30">
        <BookOpen size={140} />
      </div>
      <div className="absolute top-[40%] right-[10%] text-amber-200/40 animate-float animation-delay-4000 opacity-20">
        <School size={100} />
      </div>
      <div className="absolute bottom-[30%] left-[8%] text-blue-200/40 animate-float animation-delay-2000 opacity-25">
        <Library size={110} />
      </div>
      <div className="absolute top-[20%] right-[30%] text-rose-200/30 animate-float opacity-20">
        <Pencil size={60} />
      </div>
      <div className="absolute bottom-[5%] left-[40%] text-yellow-200/40 animate-float animation-delay-4000 opacity-30">
        <Lightbulb size={80} />
      </div>

      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] -z-10 animate-blob" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[100px] -z-10 animate-blob animation-delay-2000" />
      
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30 -z-10" />

      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-700 pb-12 relative">
        <div className="flex items-center gap-5 mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white shadow-sm hover:shadow-md border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all active:scale-90"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <FileBadge size={16} className="text-indigo-600" />
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Modul Kearsipan BP PAUD & PNF</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              {initialData ? 'Perbarui Arsip' : 'Arsipkan Surat'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/60 backdrop-blur-md p-4 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white/80 group transition-all hover:shadow-[0_15px_50px_rgba(0,0,0,0.05)]">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
              />
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center gap-5 cursor-pointer overflow-hidden ${
                  preview 
                    ? 'border-indigo-100 bg-white/50' 
                    : 'border-slate-200 hover:border-indigo-400 hover:bg-white/80'
                }`}
              >
                {preview ? (
                  <div className="w-full flex flex-col items-center gap-5">
                    {preview.startsWith('data:image/') ? (
                      <div className="relative w-full max-h-64 rounded-3xl overflow-hidden border border-slate-100 shadow-xl bg-white">
                        <img src={preview} alt="Dokumen Preview" className="w-full h-full object-contain p-3" />
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                          <span className="bg-white px-6 py-3 rounded-2xl text-slate-900 font-black text-sm flex items-center gap-3 transform translate-y-4 hover:translate-y-0 transition-all shadow-2xl">
                            <Upload size={20} className="text-indigo-600" /> GANTI BERKAS
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-5 p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-[1.5rem] w-full text-white shadow-2xl shadow-indigo-200">
                        <div className="p-4 bg-white/20 rounded-2xl">
                          <FileText size={32} />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-black tracking-tight">Dokumen Digital Terpilih</p>
                          <p className="text-xs text-indigo-100 uppercase font-bold tracking-[0.2em]">Format PDF / Arsip Digital</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                          className="p-3 bg-white/10 hover:bg-rose-500 rounded-2xl transition-all"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20" />
                      <div className="relative p-7 bg-white border border-slate-100 shadow-2xl rounded-3xl text-indigo-600">
                        <Upload size={40} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-black text-slate-800 text-xl tracking-tight">Lampirkan Berkas Surat</p>
                      <p className="text-sm text-slate-500 mt-2 max-w-[280px] font-medium leading-relaxed">Pilih pindaian surat (PNG, JPG) atau berkas PDF resmi untuk disimpan</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] text-rose-600 text-sm flex items-center gap-4 animate-shake shadow-sm">
                <div className="p-2 bg-rose-100 rounded-xl">
                   <AlertCircle size={20} />
                </div>
                <p className="font-bold tracking-tight">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.04)] border border-white/60 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Jenis Alur Surat</label>
                  <div className="flex p-2 bg-slate-100/80 rounded-[1.25rem] gap-2 border border-slate-200/40">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'MASUK'})}
                      className={`flex-1 py-3.5 px-5 rounded-[1rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                        formData.type === 'MASUK' 
                          ? 'bg-white text-indigo-600 shadow-xl scale-[1.02]' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      SURAT MASUK
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'KELUAR'})}
                      className={`flex-1 py-3.5 px-5 rounded-[1rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                        formData.type === 'KELUAR' 
                          ? 'bg-white text-emerald-600 shadow-xl scale-[1.02]' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      SURAT KELUAR
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nomor Surat Resmi</label>
                  <input
                    required
                    type="text"
                    value={formData.number}
                    onChange={e => setFormData({...formData, number: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-bold shadow-sm"
                    placeholder="E.g. 001/SK/XII/2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Perihal Utama</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-black text-slate-800 text-lg shadow-sm"
                    placeholder="Judul singkat isi surat"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <GraduationCap size={14} className="text-indigo-500" /> Jenjang Pendidikan Terkait
                  </label>
                  <div className="relative">
                    <select
                      value={formData.educationLevel}
                      onChange={e => setFormData({...formData, educationLevel: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none shadow-sm font-black text-slate-800 cursor-pointer appearance-none"
                    >
                      {EDUCATION_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-indigo-400">
                       <School size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Pengirim (Dari)</label>
                  <input
                    required
                    type="text"
                    value={formData.sender}
                    onChange={e => setFormData({...formData, sender: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none font-bold text-slate-700 shadow-sm"
                    placeholder="Instansi / Nama Pengirim"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Penerima (Kepada)</label>
                  <input
                    required
                    type="text"
                    value={formData.receiver}
                    onChange={e => setFormData({...formData, receiver: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none font-bold text-slate-700 shadow-sm"
                    placeholder="Instansi / Nama Penerima"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tanggal Surat</label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none shadow-sm font-black text-slate-700"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kategori Arsip</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none shadow-sm font-black text-slate-800 cursor-pointer appearance-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">
                       <FileText size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Catatan Tambahan (Ringkasan)</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-700 shadow-sm resize-none leading-relaxed"
                  rows={4}
                  placeholder="Berikan deskripsi singkat mengenai isi atau kepentingan surat ini..."
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all duration-500 disabled:opacity-50 shadow-2xl hover:shadow-indigo-500/40 active:scale-95 group"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} className="group-hover:rotate-12 transition-transform" />}
                {initialData ? 'PERBARUI DATA ARSIP' : 'SIMPAN KE DATABASE DIGITAL'}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-indigo-600 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 text-white relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <GraduationCap size={24} />
                 </div>
                 <h4 className="text-xl font-black mb-4 tracking-tight">Kearsipan Pendidikan 4.0</h4>
                 <p className="text-sm opacity-90 leading-relaxed font-bold">
                   Sistem ini dirancang khusus untuk BP PAUD & PNF Kabupaten Balangan guna mengelola arsip pendidikan secara terstruktur dan aman.
                 </p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white/80 space-y-6">
               <h4 className="font-black text-slate-800 uppercase text-[11px] tracking-[0.2em] flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" /> INFORMASI JENJANG
               </h4>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">
                 Pemilihan <b>Jenjang Pendidikan</b> akan memudahkan pencarian dokumen saat audit internal maupun eksternal terkait program-program spesifik PAUD atau PNF.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
