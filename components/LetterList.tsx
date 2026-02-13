
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  Send, 
  Search, 
  Trash2, 
  ExternalLink, 
  Calendar,
  Download,
  FileSpreadsheet,
  FilterX
} from 'lucide-react';
import { Letter } from '../types';
import { CATEGORIES } from '../constants';

interface Props {
  letters: Letter[];
  onDelete?: (id: string) => void;
}

export default function LetterList({ letters, onDelete }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MASUK' | 'KELUAR'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLetters = useMemo(() => {
    return letters.filter(letter => {
      const matchesSearch = 
        letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.receiver.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'ALL' || letter.type === typeFilter;
      const matchesCategory = categoryFilter === 'Semua' || letter.category === categoryFilter;
      
      const matchesDate = (() => {
        if (!startDate && !endDate) return true;
        const lDate = letter.date; // YYYY-MM-DD
        if (startDate && lDate < startDate) return false;
        if (endDate && lDate > endDate) return false;
        return true;
      })();

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });
  }, [letters, searchTerm, typeFilter, categoryFilter, startDate, endDate]);

  const handleDownloadCSV = () => {
    if (filteredLetters.length === 0) return;

    const headers = [
      'Nomor Surat',
      'Judul/Perihal',
      'Tipe',
      'Pengirim',
      'Penerima',
      'Kategori',
      'Jenjang Pendidikan',
      'Tanggal',
      'Ringkasan AI'
    ];

    const rows = filteredLetters.map(letter => [
      `"${letter.number}"`,
      `"${letter.title}"`,
      letter.type,
      `"${letter.sender}"`,
      `"${letter.receiver}"`,
      `"${letter.category}"`,
      `"${letter.educationLevel || 'Umum'}"`,
      letter.date,
      `"${letter.aiSummary || '-'}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Arsip_Surat_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setCategoryFilter('Semua');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari perihal, nomor surat, pengirim, atau penerima..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
              {(['ALL', 'MASUK', 'KELUAR'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    typeFilter === type 
                      ? 'bg-white text-indigo-600 shadow-md' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {type === 'ALL' ? 'Semua' : type}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-tight focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none cursor-pointer"
            >
              <option value="Semua">Kategori: Semua</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-50">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filter Tanggal:</span>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
              <span className="text-slate-300">-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
            {(startDate || endDate || searchTerm || categoryFilter !== 'Semua' || typeFilter !== 'ALL') && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <FilterX size={14} /> Reset
              </button>
            )}
          </div>

          <button
            onClick={handleDownloadCSV}
            disabled={filteredLetters.length === 0}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 hover:shadow-emerald-200 w-full lg:w-auto justify-center"
          >
            <FileSpreadsheet size={16} />
            Download Rekap (.CSV)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dokumen & Nomor</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pihak Terkait</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori & Jenjang</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggal</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLetters.length > 0 ? (
                filteredLetters.map(letter => (
                  <tr key={letter.id} className="group hover:bg-indigo-50/30 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`shrink-0 p-3.5 rounded-2xl shadow-sm ${
                          letter.type === 'MASUK' 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {letter.type === 'MASUK' ? <Inbox size={22} /> : <Send size={22} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{letter.title}</p>
                          <p className="text-xs font-bold text-slate-400 mt-1.5 font-mono bg-slate-100 inline-block px-2 py-0.5 rounded-md">{letter.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700">{letter.type === 'MASUK' ? letter.sender : letter.receiver}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1 flex items-center gap-1">
                          <div className={`w-1 h-1 rounded-full ${letter.type === 'MASUK' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                          {letter.type === 'MASUK' ? 'Dari Pengirim' : 'Tujuan Penerima'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center w-fit px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {letter.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 italic">
                          {letter.educationLevel || 'Umum'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 text-sm font-bold text-slate-600">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                          <Calendar size={14} />
                        </div>
                        {new Date(letter.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <Link 
                          to={`/letter/${letter.id}`} 
                          className="p-3 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100"
                          title="Lihat Detail & Scan"
                        >
                          <ExternalLink size={20} />
                        </Link>
                        {onDelete && (
                          <button 
                            onClick={() => onDelete(letter.id)}
                            className="p-3 bg-white text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100"
                            title="Hapus Permanen"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-indigo-100 blur-3xl rounded-full opacity-50" />
                        <div className="relative p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                          <Search size={48} className="text-slate-300" />
                        </div>
                      </div>
                      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-sm">Arsip tidak ditemukan</p>
                      <button 
                        onClick={resetFilters}
                        className="mt-4 text-indigo-600 font-bold text-xs hover:underline"
                      >
                        Reset semua filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-8 py-4 bg-slate-900 rounded-[1.5rem] text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
        <span>Menampilkan {filteredLetters.length} dari {letters.length} Total Arsip Digital</span>
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 
          Sistem Online & Terenkripsi
        </span>
      </div>
    </div>
  );
}
