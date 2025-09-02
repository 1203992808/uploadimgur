'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Download, Check, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LINK_FORMATS, BATCH_EXPORT_FORMATS } from '@/constants/upload';
import { UploadFile } from '@/types/upload';
import { copyToClipboard } from '@/lib/utils';

interface LinkManagerProps {
  uploadFiles: UploadFile[];
  className?: string;
}

export function LinkManager({ uploadFiles, className }: LinkManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>(LINK_FORMATS[0].id);
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});
  
  const successFiles = useMemo(() => 
    uploadFiles.filter(file => file.status === 'success' && file.result?.url),
    [uploadFiles]
  );

  if (successFiles.length === 0) return null;

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

  const handleCopyAsText = async (formatId: string) => {
    const links = generateLinksByFormat(formatId);
    const text = links.map(link => link.formatted).join('\n');
    
    try {
      await copyToClipboard(text);
      handleCopySuccess(`format-${formatId}`);
    } catch (error) {
      console.error('Failed to copy text:', error);
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

    // 下载文件
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

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Link Manager</CardTitle>
            <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
              {successFiles.length} images
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        <CardDescription>
          Batch manage and export image links in multiple formats
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 快速操作 */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAllLinks}
            className="flex items-center space-x-2"
          >
            {copyStates['all-links'] ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>Copy All Links</span>
          </Button>
          
          {/* 格式选择器 */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LINK_FORMATS.filter(f => f.id !== 'qrcode').map((format) => (
              <option key={format.id} value={format.id}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        {/* 展开的详细功能 */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* 格式预览 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Format Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LINK_FORMATS.filter(f => f.id !== 'qrcode').slice(0, 4).map((format) => (
                  <div key={format.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{format.label}</span>
                        <p className="text-xs text-gray-500">{format.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyAsText(format.id)}
                        className="flex-shrink-0"
                      >
                        {copyStates[`format-${format.id}`] ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-600 truncate">
                      {format.format.replace('{url}', 'https://i.imgur.com/example.jpg')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 批量导出 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Batch Export</h4>
              <div className="flex flex-wrap gap-2">
                {BATCH_EXPORT_FORMATS.map((exportFormat) => (
                  <Button
                    key={exportFormat.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportBatch(exportFormat.id)}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-3 h-3" />
                    <span>{exportFormat.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 链接列表 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">All Links</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {generateLinksByFormat(selectedFormat).map((link, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{link.filename}</p>
                      <p className="text-xs text-gray-500 font-mono truncate">{link.formatted}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        try {
                          await copyToClipboard(link.formatted);
                          handleCopySuccess(`link-${index}`);
                        } catch (error) {
                          console.error('Failed to copy link:', error);
                        }
                      }}
                    >
                      {copyStates[`link-${index}`] ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}