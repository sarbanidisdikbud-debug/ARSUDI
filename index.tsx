
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const init = () => {
  const container = document.getElementById('root');
  if (!container) return;
  
  // Mencegah inisialisasi ganda
  if ((window as any).__REACT_ROOT_INITIALIZED__) return;
  (window as any).__REACT_ROOT_INITIALIZED__ = true;

  try {
    const root = createRoot(container);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    const hideLoader = () => {
      const loader = document.getElementById('initial-loader');
      const rootEl = document.getElementById('root');
      if (loader && rootEl) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
          rootEl.classList.add('ready');
        }, 500);
      }
    };

    // Hilangkan loader setelah React memulai proses rendering
    setTimeout(hideLoader, 1000);

  } catch (error) {
    console.error("Gagal memulai aplikasi ARSUDI:", error);
    const loaderText = document.querySelector('#initial-loader p:last-child');
    if (loaderText) {
      loaderText.innerHTML = "<span style='color: #fb7185'>Gagal memuat komponen sistem.</span><br/>Coba segarkan halaman.";
    }
  }
};

// Gunakan listener DOMContentLoaded untuk kecepatan inisialisasi
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  window.addEventListener('DOMContentLoaded', init, { once: true });
}
