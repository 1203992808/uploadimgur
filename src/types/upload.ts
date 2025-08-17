export interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  result?: UploadResult;
}

export interface UploadResult {
  url: string;
  deleteUrl?: string;
  id: string;
  filename: string;
  size: number;
}

export interface UploadHistory {
  id: string;
  filename: string;
  url: string;
  deleteUrl?: string;
  timestamp: number;
  size: number;
  thumbnail?: string;
}

export interface ProcessingOptions {
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp';
  enableCompression: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadConfig {
  maxFileSize: number;
  maxFiles: number;
  acceptedTypes: string[];
  enableProcessing: boolean;
  processingOptions: ProcessingOptions;
}