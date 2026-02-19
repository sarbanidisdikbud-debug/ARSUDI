
import { GoogleGenAI, Type } from "@google/genai";

// Resolve API key from common sources (Vite: import.meta.env, or replaced process.env during build)
const API_KEY = (typeof (globalThis as any).process === 'object' && (globalThis as any).process.env && (globalThis as any).process.env.API_KEY)
  || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY : undefined)
  || undefined;

function getClient() {
  if (!API_KEY) throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY or process.env.API_KEY');
  return new GoogleGenAI({ apiKey: API_KEY });
}

export const isGeminiAvailable = () => !!API_KEY;

export const summarizeLetter = async (content: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ringkaslah isi surat berikut ini menjadi satu kalimat yang padat dan informatif dalam Bahasa Indonesia: \n\n ${content}`,
    });
    // response.text is a getter, use it directly without calling as a function
    return response.text?.trim() || "Gagal membuat ringkasan.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi AI.";
  }
};

export const extractMetadata = async (text: string) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ekstrak informasi penting dari teks surat berikut dalam format JSON. Field yang dibutuhkan: 
      - number (nomor surat)
      - sender (pengirim)
      - receiver (penerima)
      - title (perihal/judul singkat)
      - category (pilih satu: Dinas, Pribadi, Undangan, Pemberitahuan, Rahasia, Niaga, Lainnya)
      
      Teks surat: \n ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            number: { type: Type.STRING },
            sender: { type: Type.STRING },
            receiver: { type: Type.STRING },
            title: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["number", "sender", "receiver", "title", "category"]
        }
      }
    });

    // response.text contains the string output which should be JSON
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Extraction Error:", error);
    return null;
  }
};

export const extractMetadataFromImage = async (base64Data: string, mimeType: string) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: `Anda adalah asisten kearsipan digital profesional. Analisis dokumen/gambar surat ini dan ekstrak informasi berikut dalam format JSON:
            - number: nomor surat resmi (jika tidak ditemukan, biarkan kosong)
            - title: perihal atau judul surat yang sangat ringkas
            - sender: nama instansi atau orang pengirim
            - receiver: nama instansi atau orang penerima
            - date: tanggal surat dalam format YYYY-MM-DD
            - category: pilih satu yang paling cocok (Dinas, Pribadi, Undangan, Pemberitahuan, Rahasia, Niaga, atau Lainnya)
            - content: transkrip lengkap teks yang ada dalam surat
            
            PENTING: Berikan hasil hanya dalam format JSON yang valid.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            number: { type: Type.STRING },
            title: { type: Type.STRING },
            sender: { type: Type.STRING },
            receiver: { type: Type.STRING },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
            content: { type: Type.STRING },
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Document Analysis Error:", error);
    throw error;
  }
};
