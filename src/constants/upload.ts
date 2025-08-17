import { UploadConfig } from '@/types/upload';

export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 100,
  acceptedTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ],
  enableProcessing: true,
  processingOptions: {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg',
    enableCompression: true
  }
};

export const SUPPORTED_FORMATS = [
  { value: 'jpeg', label: 'JPEG', extension: '.jpg' },
  { value: 'png', label: 'PNG', extension: '.png' },
  { value: 'webp', label: 'WebP', extension: '.webp' }
] as const;

export const LINK_FORMATS = [
  { id: 'direct', label: 'Direct Link', format: '{url}' },
  { id: 'markdown', label: 'Markdown', format: '![image]({url})' },
  { id: 'html', label: 'HTML', format: '<img src="{url}" alt="image" />' },
  { id: 'bbcode', label: 'BBCode', format: '[img]{url}[/img]' }
] as const;

export const API_ENDPOINTS = {
  IMGUR: 'https://api.imgur.com/3/image',
  PROXY: '/api/upload'
} as const;