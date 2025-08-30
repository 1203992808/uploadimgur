'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Download, Trash2, ChevronDown, ChevronUp, Check, Upload, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LINK_FORMATS, BATCH_EXPORT_FORMATS } from '@/constants/upload';
import { UploadFile } from '@/types/upload';
import { copyToClipboard } from '@/lib/utils';

interface UploadControlsProps {
  uploadFiles: UploadFile[];
  onUploadAll: () => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  isUploading: boolean;
  className?: string;
}

export function UploadControls({ 
  uploadFiles, 
  onUploadAll, 
  onClearCompleted, 
  onClearAll, 
  isUploading, 
  className 
}: UploadControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>(LINK_FORMATS[0].id);
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});

  const pendingCount = uploadFiles.filter(f => f.status === 'pending').length;
  const successCount = uploadFiles.filter(f => f.status === 'success').length;
  const errorCount = uploadFiles.filter(f => f.status === 'error').length;
  
  const successFiles = useMemo(() => 
    uploadFiles.filter(file => file.status === 'success' && file.result?.url),
    [uploadFiles]
  );

  const handleCopySuccess = (key: string) => {
    setCopyStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const generateLinksByFormat = (formatId: string) => {
    const format = LINK_FORMATS.find(f => f.id === formatId);
    if (!format) return [];
    
    return successFiles.map(file => ({
      filename: file.file.name,
      url: file.result!.url,
      formatted: format.format.replace('{url}', file.result!.url)
    }));
  };

  const handleCopyAllLinks = async () => {
    const links = generateLinksByFormat(selectedFormat);
    const text = links.map(link => link.formatted).join('\n');
    
    try {
      await copyToClipboard(text);
      handleCopySuccess('all-links');
    } catch (error) {
      console.error('Failed to copy links:', error);
    }
  };

  const handleExportBatch = (exportFormat: string) => {
    const links = generateLinksByFormat(selectedFormat);
    const exportFormatInfo = BATCH_EXPORT_FORMATS.find(f => f.id === exportFormat);
    if (!exportFormatInfo) return;

    let content = '';
    const timestamp = new Date().toISOString().split('T')[0];

    switch (exportFormat) {
      case 'text':
        content = links.map(link => link.formatted).join('\n');
        break;
      case 'markdown':
        content = `# Image Links Export\n\nExported at: ${timestamp}\n\n${links.map((link, index) => `${index + 1}. ${link.formatted}`).join('\n')}`;
        break;
      case 'html':
        content = `<!DOCTYPE html>
<html>
<head>
  <title>Image Links Export</title>
  <meta charset="UTF-8">
</head>
<body>
  <h1>Image Links Export</h1>
  <p>Exported at: ${timestamp}</p>
  <ul>
    ${links.map(link => `<li>${link.formatted}</li>`).join('\n    ')}
  </ul>
</body>
</html>`;
        break;
      case 'json':
        content = JSON.stringify({
          exportedAt: timestamp,
          format: LINK_FORMATS.find(f => f.id === selectedFormat)?.label || selectedFormat,
          links: links
        }, null, 2);
        break;
    }

    // Download file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `image-links-${timestamp}${exportFormatInfo.extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (uploadFiles.length === 0) return null;

  return (
    <Card className={className}>
      <CardContent className="p-4 sm:p-6">
        {/* Main Controls Row */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          {/* Left side - File stats */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-gray-800">
                {uploadFiles.length} files
              </span>
              {pendingCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  {pendingCount} pending
                </span>
              )}
              {successCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {successCount} uploaded
                </span>
              )}
              {errorCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  {errorCount} failed
                </span>
              )}
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Upload All Button */}
            {pendingCount > 0 && (
              <Button
                onClick={onUploadAll}
                disabled={isUploading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload All ({pendingCount})
              </Button>
            )}

            {/* Link Management Controls */}
            {successCount > 0 && (
              <>
                {/* Format selector */}
                <div className="relative">
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    {LINK_FORMATS.filter(f => f.id !== 'qrcode').map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Copy All Links */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAllLinks}
                  className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-4 py-2"
                >
                  {copyStates['all-links'] ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      <span className="hidden sm:inline text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Copy All</span>
                    </>
                  )}
                </Button>

                {/* Advanced Controls Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-lg px-3 py-2"
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">More</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
              </>
            )}

            {/* Clear buttons */}
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
              {successCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={onClearCompleted}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-lg px-3 py-2"
                  size="sm"
                >
                  <span className="hidden sm:inline text-xs">Clear Completed</span>
                  <span className="sm:hidden text-xs">Clear</span>
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={onClearAll}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 rounded-lg p-2"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Export Options */}
        {isExpanded && successCount > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            {/* Batch Export */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-600 mr-2 flex items-center">
                Export:
              </span>
              {BATCH_EXPORT_FORMATS.map((exportFormat) => (
                <Button
                  key={exportFormat.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportBatch(exportFormat.id)}
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  {exportFormat.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}