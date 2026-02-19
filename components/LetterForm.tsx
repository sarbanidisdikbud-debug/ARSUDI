
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Loader2, 
  FileText,
  Upload,
  AlertCircle,
  FileBadge,
  Lightbulb,
  Hash,
  Calendar,
  Send,
  User,
  AlignLeft,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Letter } from '../types';
import { CATEGORIES, EDUCATION_LEVELS } from '../constants';
import { extractMetadataFromImage, isGeminiAvailable } from '../services/geminiService';

interface Props {
  onAdd: (letter: Letter) => void;
  initialData?: Letter;
}

export default function LetterForm({ onAdd, initialData }: Props) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.attachment || null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Letter, 'id' | 'aiSummary' | 'tags' | 'attachment'>>(
    initialData ? {
      number: initialData.number,
      title: initialData.title,
      sender: initialData.sender,
      receiver: initialData.receiver,
      date: initialData.date,
      category: initialData.category,
      type: initialData.type,
      description: initialData.description,
      content: initialData.content,
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
      content: '',
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

    setMimeType(file.type);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processWithAI = async () => {
    if (!preview || !mimeType) return;
    
    setAiProcessing(true);
    setError(null);
    
    try {
      const base64Data = preview.split(',')[1];
      const metadata = await extractMetadataFromImage(base64Data, mimeType);
      
      if (metadata) {
        setFormData(prev => ({
          ...prev,
          number: metadata.number || prev.number,
          title: metadata.title || prev.title,
          sender: metadata.sender || prev.sender,
          receiver: metadata.receiver || prev.receiver,
          date: metadata.date || prev.date,
          category: metadata.category || prev.category,
          content: metadata.content || prev.content,
        }));
      }
    } catch (err) {
      console.error(err);
      setError('AI gagal menganalisis dokumen. Pastikan gambar jelas atau isi manual.');
    } finally {
      setAiProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      onAdd({
        ...formData,
        id: initialData?.id || Math.random().toString(36).substr(2, 9),
        tags: [formData.category.toLowerCase(), (formData.educationLevel || '').toLowerCase()],
        attachment: preview || undefined
      });
      setLoading(false);
      navigate('/list');
    }, 500);
  };

  return (
    <div className="relative min-h-screen -m-10 p-10 overflow-hidden bg-slate-50/30">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[100px] -z-10" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="group p-5 bg-white shadow-sm hover:shadow-xl border border-slate-200 rounded-[1.5rem] text-slate-500 hover:text-indigo-600 transition-all active:scale-95"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="px-3 py-1 bg-indigo-600 text-[10px] font-black text-white rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-100">Arsip Digital</div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sistem BP PAUD & PNF</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {initialData ? 'Perbarui Arsip' : 'Input Surat Baru'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-sm">
             <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-inner">
                <Lightbulb size={20} />
             </div>
             <div>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Teknologi AI Gemini</p>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Metadata Extraction Ready</p>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-white/50">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 px-2 flex items-center gap-3">
                <FileBadge size={16} className="text-indigo-500" /> Dokumen Fisik
              </h3>
              
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative border-2 border-dashed rounded-[2.5rem] p-10 transition-all flex flex-col items-center justify-center gap-6 cursor-pointer overflow-hidden ${
                  preview ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5'
                }`}
              >
                {preview ? (
                  <div className="w-full text-center relative">
                    {preview.startsWith('data:image/') ? (
                      <div className="relative group/img">
                        <img src={preview} alt="Preview" className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white" />
                        <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-3xl" />
                      </div>
                    ) : (
                      <div className="p-10 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl">
                        <FileText size={56} className="mx-auto mb-5" />
                        <p className="text-[11px] font-black uppercase tracking-[0.2em]">BERKAS PDF TERUNGGAH</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="p-8 bg-white shadow-2xl rounded-[2rem] text-indigo-600 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                      <Upload size={40} />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-slate-800 text-base">Klik/Seret Dokumen</p>
                      <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">MAX 5MB (PDF/IMAGE)</p>
                    </div>
                  </>
                )}
              </div>
              
              {preview && (
                <div className="space-y-4 mt-8">
                  <button 
                    type="button"
                    disabled={aiProcessing || !isGeminiAvailable()}
                    onClick={processWithAI}
                    title={!isGeminiAvailable() ? 'AI tidak dikonfigurasi. Tambahkan GEMINI_API_KEY di .env.' : undefined}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                  >
                    {aiProcessing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {aiProcessing ? 'Menganalisis...' : (isGeminiAvailable() ? 'Ekstrak Data (AI)' : 'AI Tidak Tersedia')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setPreview(null); setMimeType(null); }}
                    className="w-full py-3 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-[0.2em] transition-all text-center"
                  >
                    Ganti Lampiran
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
               <ShieldCheck className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
               <h4 className="font-black text-xl mb-4 tracking-tight uppercase">Sistem Terenkripsi</h4>
               <p className="text-[11px] opacity-70 leading-relaxed font-bold tracking-wide">
                  Setiap file dan metadata diarsipkan menggunakan standar enkripsi militer. Hanya personil BP PAUD & PNF yang memiliki akses kunci digital.
               </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-white space-y-12">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-slate-100">
                <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Aliran Dokumen</h3>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status Perpindahan Surat</p>
                </div>
                <div className="flex p-2 bg-slate-100 rounded-[1.75rem] gap-2 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'MASUK'})}
                    className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                      formData.type === 'MASUK' ? 'bg-white text-indigo-600 shadow-xl scale-[1.05]' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    SURAT MASUK
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'KELUAR'})}
                    className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                      formData.type === 'KELUAR' ? 'bg-white text-emerald-600 shadow-xl scale-[1.05]' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    SURAT KELUAR
                  </button>
                </div>
              </div>

              <div className="space-y-16">
                {/* Section 01 */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-100">01</div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">Informasi Legalitas</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Perihal / Judul Surat</label>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"><FileText size={22} /></div>
                        <input
                          required
                          type="text"
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-black text-slate-900 text-lg placeholder:text-slate-300 shadow-sm"
                          placeholder="Contoh: Undangan Rapat Koordinasi..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nomor Surat Resmi</label>
                        <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"><Hash size={18} /></div>
                          <input
                            required
                            type="text"
                            value={formData.number}
                            onChange={e => setFormData({...formData, number: e.target.value})}
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-800 shadow-sm"
                            placeholder="Nomor surat..."
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Tanggal Dokumen</label>
                        <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-600 pointer-events-none z-10"><Calendar size={18} /></div>
                          <input
                            required
                            type="date"
                            value={formData.date}
                            onClick={(e) => (e.target as any).showPicker?.()}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                            className="w-full pl-14 pr-10 py-5 bg-white border border-slate-300 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none font-black text-slate-900 shadow-lg shadow-slate-100 cursor-pointer text-sm transition-all appearance-none"
                          />
                          <Calendar size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 02 */}
                <div className="space-y-8">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-100">02</div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">Entitas Pengarsipan</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Asal Pengirim</label>
                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"><User size={18} /></div>
                        <input
                          required
                          type="text"
                          value={formData.sender}
                          onChange={e => setFormData({...formData, sender: e.target.value})}
                          className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-800"
                          placeholder="Instansi Pengirim..."
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Tujuan Penerima</label>
                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"><Send size={18} /></div>
                        <input
                          required
                          type="text"
                          value={formData.receiver}
                          onChange={e => setFormData({...formData, receiver: e.target.value})}
                          className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-800"
                          placeholder="Instansi Penerima..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 03 */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-300">03</div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">Kategorisasi Sistem</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Kategori Surat</label>
                      <select
                        value={formData.educationLevel}
                        onChange={e => setFormData({...formData, educationLevel: e.target.value})}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none font-black text-slate-800 shadow-sm cursor-pointer appearance-none"
                      >
                        {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Klasifikasi Arsip</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none font-black text-slate-800 shadow-sm cursor-pointer appearance-none"
                      >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Transkrip / Ringkasan Dokumen</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-6 text-slate-300 group-focus-within:text-indigo-500 transition-colors"><AlignLeft size={20} /></div>
                      <textarea
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:border-indigo-500 outline-none font-medium text-slate-700 shadow-sm min-h-[200px] resize-none leading-relaxed"
                        placeholder="Salinan teks surat dari lampiran atau ringkasan manual..."
                      />
                    </div>
                  </div>
                </div>

              </div>

              {error && (
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-[2rem] text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-sm animate-shake">
                  <AlertCircle size={20} /> {error}
                </div>
              )}

              <div className="pt-10">
                <button
                  disabled={loading || aiProcessing}
                  type="submit"
                  className="w-full py-6 bg-slate-950 hover:bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[12px] flex items-center justify-center gap-5 transition-all duration-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] hover:shadow-indigo-500/40 active:scale-95 disabled:opacity-50 group"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} className="group-hover:-translate-y-1 transition-transform" />}
                  {initialData ? 'PERBARUI DATABASE DIGITAL' : 'ARSIPKAN DOKUMEN SEKARANG'}
                </button>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
