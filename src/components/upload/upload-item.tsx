'use client';

import React, { useState } from 'react';
import { Check, X, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn, formatFileSize, copyToClipboard } from '@/lib/utils';
import { UploadFile } from '@/types/upload';
import { LINK_FORMATS } from '@/constants/upload';

interface UploadItemProps {
  uploadFile: UploadFile;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
}

export function UploadItem({ uploadFile, onRemove, onRetry }: UploadItemProps) {
  const [selectedFormat, setSelectedFormat] = useState<typeof LINK_FORMATS[number]['id']>(LINK_FORMATS[0].id);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const getStatusColor = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'uploading':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleCopy = async (text: string, format: string) => {
    try {
      await copyToClipboard(text);
      setCopySuccess(format);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getLinkByFormat = (formatId: string) => {
    if (!uploadFile.result?.url) return '';
    
    const format = LINK_FORMATS.find(f => f.id === formatId);
    return format ? format.format.replace('{url}', uploadFile.result.url) : uploadFile.result.url;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Preview */}
          <div className="flex-shrink-0">
            {uploadFile.preview && (
              <img
                src={uploadFile.preview}
                alt={uploadFile.file.name}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-medium truncate">
                  {uploadFile.file.name}
                </h4>
                <span className={cn('flex items-center space-x-1', getStatusColor(uploadFile.status))}>
                  {getStatusIcon(uploadFile.status)}
                  <span className="text-xs capitalize">{uploadFile.status}</span>
                </span>
              </div>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(uploadFile.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* File Info */}
            <p className="text-xs text-gray-500 mb-2">
              {formatFileSize(uploadFile.file.size)} • {uploadFile.file.type}
            </p>

            {/* Progress */}
            {uploadFile.status === 'uploading' && (
              <div className="mb-3">
                <Progress value={uploadFile.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Uploading... {uploadFile.progress}%
                </p>
              </div>
            )}

            {/* Error */}
            {uploadFile.status === 'error' && (
              <div className="mb-3">
                <p className="text-sm text-red-600">{uploadFile.error}</p>
                {onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetry(uploadFile.id)}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                )}
              </div>
            )}

            {/* Success - Links */}
            {uploadFile.status === 'success' && uploadFile.result && (
              <div className="space-y-3">
                {/* Format Selector */}
                <div className="flex flex-wrap gap-1">
                  {LINK_FORMATS.map((format) => (
                    <Button
                      key={format.id}
                      variant={selectedFormat === format.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFormat(format.id)}
                      className="text-xs"
                    >
                      {format.label}
                    </Button>
                  ))}
                </div>

                {/* Link Display */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={getLinkByFormat(selectedFormat)}
                      readOnly
                      className="w-full px-2 py-1 text-xs bg-gray-50 border rounded font-mono"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(getLinkByFormat(selectedFormat), selectedFormat)}
                  >
                    {copySuccess === selectedFormat ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(uploadFile.result!.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(uploadFile.result!.url, 'direct')}
                    className="text-xs"
                  >
                    Copy Direct Link
                  </Button>
                  {uploadFile.result.deleteUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(uploadFile.result!.deleteUrl!, '_blank')}
                      className="text-xs text-red-600"
                    >
                      Delete Page
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}