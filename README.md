# 📂 ARSUDI AI - BP PAUD & PNF

Sistem Arsip Surat Digital modern berbasis Web dengan integrasi kecerdasan buatan (Gemini AI) untuk otomatisasi ringkasan dan ekstraksi metadata dokumen.

## ✨ Fitur Utama
- **AI-Powered Archiving**: Ekstraksi otomatis nomor, pengirim, dan perihal surat menggunakan Google Gemini 3.
- **OCR Integration**: Analisis gambar surat (Scan/Foto) langsung menjadi metadata digital.
- **Modern UI/UX**: Desain bento-box yang responsif dengan Tailwind CSS.
- **Secure Storage**: Enkripsi metadata di sisi klien dan penyimpanan lokal/cloud yang aman.
- **Export Ready**: Unduh rekapitulasi seluruh arsip dalam format CSV.

## 🚀 Cara Sinkron ke GitHub

1. **Inisialisasi Repositori Lokal:**
   Buka terminal di folder proyek Anda:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Arsudi AI System"
   ```

2. **Hubungkan ke GitHub:**
   Buat repositori baru di GitHub (kosong), lalu jalankan:
   ```bash
   git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
   git branch -M main
   git push -u origin main
   ```

## 🌐 Deployment (Vercel / GitHub Pages)

### Deployment via Vercel (Rekomendasi)
1. Login ke [Vercel](https://vercel.com).
2. Klik **Add New Project** dan pilih repositori GitHub ini.
3. **PENTING:** Masuk ke bagian **Environment Variables**.
4. Tambahkan Variable:
   - Key: `API_KEY`
   - Value: `(Kunci API Gemini Anda)`
5. Klik **Deploy**.

### Deployment via GitHub Pages
Aplikasi ini sudah mendukung `HashRouter`, sehingga aman dideploy ke GitHub Pages tanpa konfigurasi server tambahan.

## 🔑 Konfigurasi API Key
Dapatkan API Key Gemini secara gratis di [Google AI Studio](https://aistudio.google.com/). Kunci ini diperlukan untuk fitur ekstraksi AI dan ringkasan otomatis.

## 🛠 Teknologi
- **Core**: React 18 & React Router 7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI**: Google Generative AI (Gemini 3 Flash)
- **Deployment**: GitHub Actions Ready

---
*Dibuat untuk BP PAUD & PNF - Digital Transformation Project.*

## 🧭 Local Development

Prasyarat: Node.js & npm terpasang (unduh dari https://nodejs.org)

Langkah menjalankan proyek secara lokal:

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

Jika memakai Gemini API, buat file `.env` dengan variabel:

```
GEMINI_API_KEY=your_api_key_here
```
