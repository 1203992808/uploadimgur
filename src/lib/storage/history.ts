import { UploadHistory } from '@/types/upload';

const STORAGE_KEY = 'upload_history';
const MAX_HISTORY_ITEMS = 100;

export class HistoryManager {
  static getHistory(): UploadHistory[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load upload history:', error);
      return [];
    }
  }

  static addItem(item: UploadHistory): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const newHistory = [item, ...history.slice(0, MAX_HISTORY_ITEMS - 1)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save upload history:', error);
    }
  }

  static removeItem(id: string): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove history item:', error);
    }
  }

  static clearHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  static updateItem(id: string, updates: Partial<UploadHistory>): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const index = history.findIndex(item => item.id === id);
      
      if (index !== -1) {
        history[index] = { ...history[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Failed to update history item:', error);
    }
  }
}