'use client';

import React, { useCallback, useState } from 'react';
import { Upload, Link, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DEFAULT_UPLOAD_CONFIG } from '@/constants/upload';

interface UploadAreaProps {
  onFilesSelect: (files: File[]) => void;
  onUrlSubmit?: (url: string) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
}

export function UploadArea({
  onFilesSelect,
  onUrlSubmit,
  maxFiles = DEFAULT_UPLOAD_CONFIG.maxFiles,
  acceptedTypes = DEFAULT_UPLOAD_CONFIG.acceptedTypes,
  disabled = false,
  className
}: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [isBatchMode, setIsBatchMode] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => 
      acceptedTypes.includes(file.type)
    ).slice(0, maxFiles);

    if (imageFiles.length > 0) {
      onFilesSelect(imageFiles);
    }
  }, [disabled, acceptedTypes, maxFiles, onFilesSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || disabled) return;

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => 
      acceptedTypes.includes(file.type)
    ).slice(0, maxFiles);

    if (imageFiles.length > 0) {
      onFilesSelect(imageFiles);
    }

    // Reset input
    e.target.value = '';
  }, [disabled, acceptedTypes, maxFiles, onFilesSelect]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (disabled) return;

    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => 
      item.type.startsWith('image/')
    );

    if (imageItems.length > 0) {
      const files = imageItems.map(item => item.getAsFile()).filter(Boolean) as File[];
      const validFiles = files.filter(file => 
        acceptedTypes.includes(file.type)
      ).slice(0, maxFiles);

      if (validFiles.length > 0) {
        onFilesSelect(validFiles);
      }
    }
  }, [disabled, acceptedTypes, maxFiles, onFilesSelect]);

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!urlValue.trim() || !onUrlSubmit || disabled) return;
    
    if (isBatchMode) {
      // 批量模式：按行分割URL
      const urls = urlValue.trim().split('\n').filter(url => url.trim());
      urls.forEach(url => onUrlSubmit(url.trim()));
    } else {
      // 单个模式
      onUrlSubmit(urlValue.trim());
    }
    
    setUrlValue('');
    setShowUrlInput(false);
  }, [urlValue, onUrlSubmit, disabled, isBatchMode]);

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-3xl p-8 sm:p-16 text-center transition-all duration-300 cursor-pointer group',
          isDragOver && !disabled
            ? 'border-blue-500 bg-blue-50/80 backdrop-blur-sm shadow-lg scale-[1.02]'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        />

        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          
          <div className="space-y-3 max-w-lg px-4 sm:px-0">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
              {isDragOver && !disabled ? '✨ Drop your images here' : 'Upload Your Images'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Drag and drop, click to select, paste from clipboard, or add from URL. Supports JPG, PNG, GIF, WebP up to {Math.round(DEFAULT_UPLOAD_CONFIG.maxFileSize / 1024 / 1024)}MB each.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10">
            <Button 
              type="button" 
              variant="outline"
              disabled={disabled}
              onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 rounded-full px-6 sm:px-8 py-3 font-semibold transition-all duration-300 hover:shadow-md"
            >
              <Upload className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Choose Files</span>
              <span className="sm:hidden ml-1">Choose</span>
            </Button>
            
            {onUrlSubmit && (
              <Button 
                type="button" 
                variant="outline"
                disabled={disabled}
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 rounded-full px-6 sm:px-8 py-3 font-semibold transition-all duration-300 hover:shadow-md"
              >
                <Link className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">From URL</span>
                <span className="sm:hidden ml-1">URL</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* URL Input */}
      {showUrlInput && onUrlSubmit && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="url-input" className="block text-sm font-medium text-gray-700">
                {isBatchMode ? 'Image URLs (one per line)' : 'Image URL'}
              </label>
              <button
                type="button"
                onClick={() => setIsBatchMode(!isBatchMode)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {isBatchMode ? 'Single URL' : 'Batch URLs'}
              </button>
            </div>
            {isBatchMode ? (
              <textarea
                id="url-input"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                disabled={disabled}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 resize-none"
              />
            ) : (
              <input
                id="url-input"
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            )}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlValue('');
                  setIsBatchMode(false);
                }}
                disabled={disabled}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={disabled || !urlValue.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                {isBatchMode ? 'Add URLs' : 'Add from URL'}
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}