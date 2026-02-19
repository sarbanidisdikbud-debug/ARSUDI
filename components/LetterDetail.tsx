
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  Calendar, 
  User as UserIcon, 
  Tag, 
  FileText, 
  Sparkles,
  Loader2,
  Printer,
  ChevronRight,
  Download,
  Eye,
  GraduationCap
} from 'lucide-react';
import { Letter, UserRole } from '../types';
import { summarizeLetter, isGeminiAvailable } from '../services/geminiService';

interface Props {
  letters: Letter[];
  userRole: UserRole;
  onUpdate: (letter: Letter) => void;
  onDelete: (id: string) => void;
}

export default function LetterDetail({ letters, userRole, onUpdate, onDelete }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const letter = letters.find(l => l.id === id);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  if (!letter) return <div className="text-center py-20">Surat tidak ditemukan.</div>;

  const isAdmin = userRole === 'ADMIN';

  const handleSummarize = async () => {
    if (!letter.content) return;
    setIsSummarizing(true);
    const summary = await summarizeLetter(letter.content);
    onUpdate({ ...letter, aiSummary: summary });
    setIsSummarizing(false);
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus arsip ini?')) {
      onDelete(letter.id);
      navigate('/list');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex items-center justify-between no-print">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrint}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
            title="Cetak Dokumen"
          >
            <Printer size={20} />
          </button>
          {isAdmin && (
            <>
              <button onClick={handleDelete} className="p-2.5 bg-white border border-rose-100 text-rose-600 rounded-xl hover:bg-rose-50 transition-colors">
                <Trash2 size={20} />
              </button>
              <Link 
                to={`/edit/${letter.id}`}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Edit3 size={18} /> Edit Arsip
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                  letter.type === 'MASUK' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {letter.type === 'MASUK' ? 'Surat Masuk' : 'Surat Keluar'}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  {letter.educationLevel || 'Umum'}
                </span>
                <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  {letter.category}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{letter.title}</h1>
              <p className="text-slate-500 font-mono mt-4 text-lg">{letter.number}</p>
            </div>

            <div className="p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <FileText size={16} /> Isi Dokumen
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {letter.content || "Konten teks tidak tersedia."}
                </p>
              </div>
              
              {letter.attachment && (
                <div className="mt-12 pt-8 border-t border-slate-100 attachment-print">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Eye size={16} /> Lampiran Berkas
                  </h3>
                  {letter.attachment.startsWith('data:image/') ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
                      <img 
                        src={letter.attachment} 
                        alt="Scan Surat" 
                        className={`w-full transition-all duration-300 ${showFullImage ? '' : 'max-h-96 object-top object-cover print-full-height'}`}
                      />
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                      <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl">
                        <FileText size={32} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">Dokumen Digital</p>
                        <p className="text-xs text-slate-400">Berkas ini disimpan sebagai lampiran arsip permanen.</p>
                      </div>
                      <a 
                        href={letter.attachment} 
                        download={`arsip-${letter.number.replace(/\//g, '-')}`}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 no-print"
                      >
                        <Download size={18} /> Download
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 no-print">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-amber-800">
                <Sparkles size={20} />
                <h3 className="font-bold">Ringkasan Cerdas (AI)</h3>
              </div>
              {!letter.aiSummary && (
                <button 
                  onClick={handleSummarize}
                  disabled={isSummarizing || !isGeminiAvailable()}
                  title={!isGeminiAvailable() ? 'AI tidak dikonfigurasi. Tambahkan GEMINI_API_KEY di .env.' : undefined}
                  className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {isSummarizing ? <Loader2 size={16} className="animate-spin" /> : (isGeminiAvailable() ? 'Generate Ringkasan' : 'AI Tidak Tersedia')}
                </button>
              )}
            </div>
            <div className="text-amber-900/80 italic text-sm leading-relaxed">
              {letter.aiSummary || "Ringkasan belum di-generate. Klik tombol di atas untuk membuat ringkasan otomatis menggunakan Gemini AI."}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24 print-metadata">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4">Info Metadata</h3>
            <div className="space-y-4">
              <InfoItem icon={<Calendar size={18} />} label="Tanggal" value={new Date(letter.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
              <InfoItem icon={<GraduationCap size={18} />} label="Kategori Surat" value={letter.educationLevel || 'Umum'} />
              <InfoItem icon={<UserIcon size={18} />} label="Pengirim" value={letter.sender} />
              <InfoItem icon={<ChevronRight size={18} />} label="Penerima" value={letter.receiver} />
              <div className="flex items-start gap-3 no-print">
                <Tag className="text-slate-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {letter.tags.length > 0 ? letter.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                        #{tag}
                      </span>
                    )) : (
                      <span className="text-xs text-slate-400 italic">Tidak ada tag</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-3">
    <div className="text-slate-400 mt-1 shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">{label}</p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  </div>
);
