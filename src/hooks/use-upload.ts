'use client';

import { useState, useCallback } from 'react';
import { UploadFile, UploadHistory, UploadResult } from '@/types/upload';
import { UploadAPI } from '@/lib/api/upload';
import { ImageProcessor } from '@/lib/image/processor';
import { HistoryManager } from '@/lib/storage/history';
import { generateId, createImagePreview, fetchImageFromUrl } from '@/lib/utils';
import { DEFAULT_UPLOAD_CONFIG } from '@/constants/upload';

export function useUpload() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState<UploadHistory[]>([]);

  // Load history on mount
  const loadHistory = useCallback(() => {
    const savedHistory = HistoryManager.getHistory();
    setHistory(savedHistory);
  }, []);

  // Add files to upload queue
  const addFiles = useCallback(async (files: File[]) => {
    const newUploadFiles: UploadFile[] = [];

    for (const file of files) {
      // Validate file
      const validation = UploadAPI.validateFile(
        file,
        DEFAULT_UPLOAD_CONFIG.maxFileSize,
        DEFAULT_UPLOAD_CONFIG.acceptedTypes
      );

      if (!validation.valid) {
        newUploadFiles.push({
          id: generateId(),
          file,
          status: 'error',
          progress: 0,
          error: validation.error
        });
        continue;
      }

      // Create preview
      try {
        const preview = await createImagePreview(file);
        newUploadFiles.push({
          id: generateId(),
          file,
          preview,
          status: 'pending',
          progress: 0
        });
      } catch (error) {
        newUploadFiles.push({
          id: generateId(),
          file,
          status: 'error',
          progress: 0,
          error: 'Failed to create preview'
        });
      }
    }

    setUploadFiles(prev => [...newUploadFiles, ...prev]);
    return newUploadFiles;
  }, []);

  // Upload single file
  const uploadFile = useCallback(async (uploadFile: UploadFile) => {
    const updateFile = (updates: Partial<UploadFile>) => {
      setUploadFiles(prev => 
        prev.map(f => f.id === uploadFile.id ? { ...f, ...updates } : f)
      );
    };

    updateFile({ status: 'uploading', progress: 0 });

    try {
      let fileToUpload: File | Blob = uploadFile.file;

      // Process image if enabled
      if (DEFAULT_UPLOAD_CONFIG.enableProcessing) {
        try {
          fileToUpload = await ImageProcessor.processImage(
            uploadFile.file,
            DEFAULT_UPLOAD_CONFIG.processingOptions
          );
        } catch (error) {
          console.warn('Image processing failed, using original file:', error);
        }
      }

      // Upload file
      const result = await UploadAPI.uploadFile(
        fileToUpload as File,
        (progress) => updateFile({ progress })
      );

      if (result.success && result.data) {
        updateFile({
          status: 'success',
          progress: 100,
          result: result.data
        });

        // Add to history
        const historyItem: UploadHistory = {
          id: uploadFile.id,
          filename: uploadFile.file.name,
          url: result.data.url,
          deleteUrl: result.data.deleteUrl,
          timestamp: Date.now(),
          size: uploadFile.file.size,
          thumbnail: uploadFile.preview
        };

        HistoryManager.addItem(historyItem);
        setHistory(prev => [historyItem, ...prev]);

        return result.data;
      } else {
        updateFile({
          status: 'error',
          error: result.error || 'Upload failed'
        });
        return null;
      }
    } catch (error) {
      updateFile({
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      });
      return null;
    }
  }, []);

  // Upload all pending files
  const uploadAll = useCallback(async () => {
    const pendingFiles = uploadFiles.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      const results = await Promise.allSettled(
        pendingFiles.map(file => uploadFile(file))
      );

      const successful = results.filter(
        (result): result is PromiseFulfilledResult<UploadResult | null> => 
          result.status === 'fulfilled' && result.value !== null
      ).length;

      return { successful, total: pendingFiles.length };
    } finally {
      setIsUploading(false);
    }
  }, [uploadFiles, uploadFile]);

  // Retry failed upload
  const retryUpload = useCallback(async (id: string) => {
    const file = uploadFiles.find(f => f.id === id);
    if (!file) return;

    setUploadFiles(prev =>
      prev.map(f =>
        f.id === id ? { ...f, status: 'pending', error: undefined } : f
      )
    );

    await uploadFile({ ...file, status: 'pending', error: undefined });
  }, [uploadFiles, uploadFile]);

  // Remove file from queue
  const removeFile = useCallback((id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  // Clear completed uploads
  const clearCompleted = useCallback(() => {
    setUploadFiles(prev => 
      prev.filter(f => f.status === 'pending' || f.status === 'uploading')
    );
  }, []);

  // Clear all uploads
  const clearAll = useCallback(() => {
    setUploadFiles([]);
  }, []);

  // Remove from history
  const removeFromHistory = useCallback((id: string) => {
    HistoryManager.removeItem(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    HistoryManager.clearHistory();
    setHistory([]);
  }, []);

  // Add files from URL
  const addFromUrl = useCallback(async (url: string) => {
    try {
      const file = await fetchImageFromUrl(url);
      return await addFiles([file]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch image from URL';
      
      const errorUploadFile: UploadFile = {
        id: generateId(),
        file: new File([], 'url-image', { type: 'image/jpeg' }),
        status: 'error',
        progress: 0,
        error: errorMessage
      };

      setUploadFiles(prev => [errorUploadFile, ...prev]);
      return [errorUploadFile];
    }
  }, [addFiles]);

  return {
    uploadFiles,
    isUploading,
    history,
    addFiles,
    addFromUrl,
    uploadFile,
    uploadAll,
    retryUpload,
    removeFile,
    clearCompleted,
    clearAll,
    loadHistory,
    removeFromHistory,
    clearHistory
  };
}