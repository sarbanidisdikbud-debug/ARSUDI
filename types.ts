
export type LetterType = 'MASUK' | 'KELUAR';
export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  username: string;
  password?: string; // Optional because we don't always need it in the UI
  role: UserRole;
  fullName: string;
}

export interface Letter {
  id: string;
  number: string;
  title: string;
  sender: string;
  receiver: string;
  date: string;
  category: string;
  type: LetterType;
  description: string;
  content: string;
  aiSummary?: string;
  tags: string[];
  attachment?: string; // Base64 data of the uploaded document
  educationLevel?: string; // New field for educational background/level
}

export interface Statistics {
  totalMasuk: number;
  totalKeluar: number;
  categoryDistribution: { name: string; value: number }[];
}
