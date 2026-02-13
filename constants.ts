
import { Letter } from './types';

export const CATEGORIES = [
  'Dinas',
  'Surat Tugas',
  'Undangan',
  'Pemberitahuan',
  'Rahasia',
  'Niaga',
  'Lainnya'
];

export const EDUCATION_LEVELS = [
  'Umum',
  'PAUD (Pendidikan Anak Usia Dini)',
  'TK (Taman Kanak-Kanak)',
  'SD / MI',
  'SMP / MTs',
  'SMA / MA / SMK',
  'PNF (Pendidikan Non Formal)',
  'LKP (Lembaga Kursus & Pelatihan)',
  'PKBM (Pusat Kegiatan Belajar Masyarakat)'
];

export const INITIAL_LETTERS: Letter[] = [
  {
    id: '1',
    number: '001/UND/2023',
    title: 'Undangan Rapat Tahunan',
    sender: 'Sekretariat Jenderal',
    receiver: 'Semua Kepala Divisi',
    date: '2023-11-20',
    category: 'Undangan',
    type: 'MASUK',
    description: 'Rapat koordinasi akhir tahun anggaran 2023.',
    content: 'Dengan hormat, sehubungan dengan berakhirnya tahun anggaran 2023, kami mengundang Bapak/Ibu untuk hadir pada rapat koordinasi yang akan dilaksanakan pada hari Senin, 27 November 2023.',
    aiSummary: 'Undangan rapat koordinasi tahunan untuk seluruh kepala divisi pada 27 November 2023.',
    tags: ['rapat', 'tahunan', 'penting'],
    educationLevel: 'Umum'
  },
  {
    id: '2',
    number: '056/SK/DIR/XII/2023',
    title: 'Surat Keputusan Penunjukan Vendor',
    sender: 'Direktur Utama',
    receiver: 'PT Maju Jaya Sentosa',
    date: '2023-12-05',
    category: 'Dinas',
    type: 'KELUAR',
    description: 'Penunjukan vendor pengerjaan renovasi kantor pusat.',
    content: 'Memutuskan untuk menunjuk PT Maju Jaya Sentosa sebagai pelaksana proyek renovasi kantor pusat berdasarkan hasil tender nomor 042/TND/X/2023.',
    aiSummary: 'Surat keputusan resmi penunjukan PT Maju Jaya Sentosa sebagai vendor renovasi kantor pusat.',
    tags: ['vendor', 'proyek', 'renovasi'],
    educationLevel: 'Umum'
  }
];
