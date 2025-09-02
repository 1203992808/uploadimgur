import { UploadHistory } from '@/types/upload';

const STORAGE_KEY = 'upload_history';
const MAX_HISTORY_ITEMS = 50; // 减少最大历史记录数量
const MAX_STORAGE_SIZE = 2 * 1024 * 1024; // 2MB 最大存储限制

export class HistoryManager {
  static getHistory(): UploadHistory[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load upload history:', error);
      // 如果解析失败，清除损坏的数据
      this.clearHistory();
      return [];
    }
  }

  static addItem(item: UploadHistory): void {
    if (typeof window === 'undefined') return;

    try {
      // 创建简化的历史记录项，减少存储空间
      const simplifiedItem: UploadHistory = {
        id: item.id,
        filename: item.filename,
        url: item.url,
        deleteUrl: item.deleteUrl,
        timestamp: item.timestamp,
        size: item.size,
        // 不存储 thumbnail，节省空间
        thumbnail: undefined
      };

      const history = this.getHistory();
      let newHistory = [simplifiedItem, ...history.slice(0, MAX_HISTORY_ITEMS - 1)];
      
      // 检查存储大小并自动清理最老的记录
      let dataString = JSON.stringify(newHistory);
      
      // 如果数据太大，自动删除最老的3个记录，直到大小合适
      while (dataString.length > MAX_STORAGE_SIZE && newHistory.length > 3) {
        newHistory = newHistory.slice(0, -3); // 删除最老的3个
        dataString = JSON.stringify(newHistory);
      }
      
      // 如果还是太大，继续删除直到只剩1个
      while (dataString.length > MAX_STORAGE_SIZE && newHistory.length > 1) {
        newHistory = newHistory.slice(0, -1);
        dataString = JSON.stringify(newHistory);
      }
      
      this.saveHistory(newHistory);
    } catch (error) {
      this.handleStorageError(error);
    }
  }

  static removeItem(id: string): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      this.saveHistory(filtered);
    } catch (error) {
      this.handleStorageError(error);
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
        this.saveHistory(history);
      }
    } catch (error) {
      this.handleStorageError(error);
    }
  }

  private static saveHistory(history: UploadHistory[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      this.handleStorageError(error, history);
    }
  }

  private static handleStorageError(error: unknown, history?: UploadHistory[]): void {
    console.error('Storage error:', error);
    
    if ((error as Error).name === 'QuotaExceededError') {
      // 自动清理，不提示用户
      if (history && history.length > 3) {
        // 自动删除最老的3个记录
        const cleanedHistory = history.slice(0, -3);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedHistory));
          console.log(`Auto-cleaned history: removed 3 oldest items, ${cleanedHistory.length} items remaining`);
        } catch {
          // 如果还是失败，继续删除更多记录
          this.emergencyCleanup();
        }
      } else {
        // 如果记录太少，直接清空
        this.emergencyCleanup();
      }
    }
  }

  private static emergencyCleanup(): void {
    try {
      // 清除历史记录
      this.clearHistory();
      
      // 可以在这里清除其他非关键的 localStorage 数据
      // 例如临时缓存等
      
      console.log('Auto emergency cleanup completed - all history cleared');
    } catch (error) {
      console.error('Emergency cleanup failed:', error);
    }
  }

  // 获取当前存储使用情况
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    if (typeof window === 'undefined') {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      const history = this.getHistory();
      const dataString = JSON.stringify(history);
      const used = dataString.length;
      const available = MAX_STORAGE_SIZE - used;
      const percentage = (used / MAX_STORAGE_SIZE) * 100;
      
      return { used, available, percentage };
    } catch {
      return { used: 0, available: MAX_STORAGE_SIZE, percentage: 0 };
    }
  }
}