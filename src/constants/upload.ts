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
  { id: 'direct', label: 'Direct Link', format: '{url}', description: 'Direct image link' },
  { id: 'markdown', label: 'Markdown', format: '![image]({url})', description: 'For GitHub, Reddit' },
  { id: 'html', label: 'HTML', format: '<img src="{url}" alt="image" />', description: 'Web embed code' },
  { id: 'bbcode', label: 'BBCode', format: '[img]{url}[/img]', description: 'For forums' },
  { id: 'markdown-link', label: 'Markdown Link', format: '[image]({url})', description: 'Markdown link format' },
  { id: 'html-link', label: 'HTML Link', format: '<a href="{url}" target="_blank"><img src="{url}" alt="image"></a>', description: 'Clickable HTML image' },
  { id: 'reddit', label: 'Reddit', format: '{url}', description: 'Reddit image sharing' },
  { id: 'discord', label: 'Discord', format: '{url}', description: 'Discord image sharing' },
  { id: 'qrcode', label: 'QR Code', format: 'qr:{url}', description: 'QR code format' }
] as const;

// Batch export formats
export const BATCH_EXPORT_FORMATS = [
  { id: 'text', label: 'Plain Text List', extension: '.txt' },
  { id: 'markdown', label: 'Markdown Format', extension: '.md' },
  { id: 'html', label: 'HTML Format', extension: '.html' },
  { id: 'json', label: 'JSON Format', extension: '.json' }
] as const;

export const API_ENDPOINTS = {
  IMGUR: 'https://api.imgur.com/3/image',
  PROXY: '/api/upload'
} as const;