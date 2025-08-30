'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LINK_FORMATS } from '@/constants/upload';
import { copyToClipboard } from '@/lib/utils';

interface LinkCopyButtonsProps {
  url: string;
  filename?: string;
  className?: string;
  showPreview?: boolean;
}

export function LinkCopyButtons({ url, filename = 'image', className, showPreview = false }: LinkCopyButtonsProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>(LINK_FORMATS[0].id);
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});
  const [showPreviewText, setShowPreviewText] = useState(showPreview);

  const handleCopySuccess = (formatId: string) => {
    setCopyStates(prev => ({ ...prev, [formatId]: true }));
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [formatId]: false }));
    }, 2000);
  };

  const getLinkByFormat = (formatId: string) => {
    if (formatId === 'qrcode') {
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    }
    
    const format = LINK_FORMATS.find(f => f.id === formatId);
    return format ? format.format.replace('{url}', url) : url;
  };

  const handleCopy = async (formatId: string) => {
    try {
      const text = getLinkByFormat(formatId);
      await copyToClipboard(text);
      handleCopySuccess(formatId);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={className}>
      {/* 格式选择器 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {LINK_FORMATS.filter(f => f.id !== 'qrcode').map((format) => (
          <Button
            key={format.id}
            variant={selectedFormat === format.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFormat(format.id)}
            className="text-xs h-8"
          >
            {format.label}
          </Button>
        ))}
      </div>

      {/* 链接输入框和操作按钮 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={getLinkByFormat(selectedFormat)}
              readOnly
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(selectedFormat)}
            className="flex-shrink-0"
          >
            {copyStates[selectedFormat] ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreviewText(!showPreviewText)}
            className="flex-shrink-0"
          >
            {showPreviewText ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(url, '_blank')}
            className="flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* 预览区域 */}
        {showPreviewText && (
          <div className="space-y-2">
            <div className="text-xs text-gray-600 flex items-center justify-between">
              <span>格式说明: {LINK_FORMATS.find(f => f.id === selectedFormat)?.description}</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <div className="text-xs text-gray-500 mb-2">预览效果:</div>
              {selectedFormat === 'direct' && (
                <div className="text-sm text-blue-600 break-all">{url}</div>
              )}
              {selectedFormat === 'markdown' && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">代码:</div>
                  <code className="text-xs bg-white p-2 rounded border block">{getLinkByFormat(selectedFormat)}</code>
                  <div className="text-xs text-gray-600">渲染效果:</div>
                  <img src={url} alt={filename} className="max-w-32 max-h-32 object-contain border rounded" />
                </div>
              )}
              {selectedFormat === 'html' && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">代码:</div>
                  <code className="text-xs bg-white p-2 rounded border block break-all">{getLinkByFormat(selectedFormat)}</code>
                  <div className="text-xs text-gray-600">渲染效果:</div>
                  <div dangerouslySetInnerHTML={{ __html: getLinkByFormat(selectedFormat) }} />
                </div>
              )}
              {selectedFormat === 'bbcode' && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">BBCode 代码:</div>
                  <code className="text-xs bg-white p-2 rounded border block break-all">{getLinkByFormat(selectedFormat)}</code>
                </div>
              )}
              {(selectedFormat === 'markdown-link' || selectedFormat === 'html-link') && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">代码:</div>
                  <code className="text-xs bg-white p-2 rounded border block break-all">{getLinkByFormat(selectedFormat)}</code>
                </div>
              )}
              {(selectedFormat === 'reddit' || selectedFormat === 'discord') && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">分享链接:</div>
                  <div className="text-sm text-blue-600 break-all">{url}</div>
                  <div className="text-xs text-gray-500">可以直接粘贴到 {LINK_FORMATS.find(f => f.id === selectedFormat)?.label}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 快速复制按钮 */}
        <div className="flex flex-wrap gap-1">
          {['direct', 'markdown', 'html', 'bbcode'].map((formatId) => (
            <Button
              key={formatId}
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(formatId)}
              className="text-xs h-7 px-2"
            >
              {copyStates[formatId] ? (
                <Check className="w-3 h-3 text-green-600 mr-1" />
              ) : (
                <Copy className="w-3 h-3 mr-1" />
              )}
              {LINK_FORMATS.find(f => f.id === formatId)?.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}