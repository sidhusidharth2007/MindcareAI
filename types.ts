
export type Role = 'user' | 'model';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
  groundingUrls?: { title: string; uri: string }[];
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'angry';
  note?: string;
}

export interface CrisisResource {
  name: string;
  number: string;
  description: string;
  url: string;
}
