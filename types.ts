
export type Language = 'en-US' | 'hi-IN';

export const LANGUAGES: { [key in Language]: { name: string, code: string } } = {
  'en-US': { name: 'English', code: 'EN' },
  'hi-IN': { name: 'Hindi', code: 'हिं' }
};

export enum ScanMode {
  GENERAL = 'GENERAL',
  DOCUMENT = 'DOCUMENT'
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  image: string;
  description: string;
  language: Language;
  mode: ScanMode;
}

export enum AppTab {
  SCAN = 'SCAN',
  HISTORY = 'HISTORY'
}
