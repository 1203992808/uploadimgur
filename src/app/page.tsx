'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, History, Trash2, Image as ImageIcon, BookOpen } from 'lucide-react';
import { UploadArea } from '@/components/upload/upload-area';
import { UploadItem } from '@/components/upload/upload-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpload } from '@/hooks/use-upload';

export default function Home() {
  const {
    uploadFiles,
    isUploading,
    history,
    addFiles,
    addFromUrl,
    uploadAll,
    retryUpload,
    removeFile,
    clearCompleted,
    clearAll,
    loadHistory,
    removeFromHistory,
    clearHistory
  } = useUpload();

  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const uploadControlsRef = useRef<HTMLDivElement>(null);
  const uploadAllRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleHistoryToggle = () => {
    setShowHistory(!showHistory);
    // 如果显示历史记录，滚动到历史记录部分
    if (!showHistory) {
      setTimeout(() => {
        historyRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  const handleFilesSelect = async (files: File[]) => {
    await addFiles(files);
    // 自动滚动到Upload All按钮区域，居中显示
    setTimeout(() => {
      uploadAllRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 300);
  };

  const handleUrlSubmit = async (url: string) => {
    await addFromUrl(url);
    // 自动滚动到Upload All按钮区域，居中显示
    setTimeout(() => {
      uploadAllRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 300);
  };

  const pendingCount = uploadFiles.filter(f => f.status === 'pending').length;
  const successCount = uploadFiles.filter(f => f.status === 'success').length;
  const errorCount = uploadFiles.filter(f => f.status === 'error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ImgurUpload
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/blog">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-full transition-all duration-200 hover:shadow-md"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                  <span className="hidden sm:inline">Blog</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleHistoryToggle}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-full transition-all duration-200 hover:shadow-md"
                size="sm"
              >
                <History className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">History ({history.length})</span>
                <span className="sm:hidden">({history.length})</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-8 sm:space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
              ⚡ Free Imgur Upload Tool - No Registration Required
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
               Upload Images to Imgur
            </h1>
           
          </div>

          {/* Upload Area */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg rounded-3xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 sm:p-10">
              <UploadArea
                onFilesSelect={handleFilesSelect}
                onUrlSubmit={handleUrlSubmit}
                disabled={isUploading}
              />
            </CardContent>
          </Card>

          {/* Upload All Button Section */}
          {uploadFiles.length > 0 && pendingCount > 0 && (
            <div className="flex justify-center" ref={uploadAllRef}>
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 pt-5">
                  <div className="flex items-center justify-center gap-4 ">
                    <Button
                      onClick={uploadAll}
                      disabled={isUploading}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      size="lg"
                    >
                      <Upload className="w-6 h-6 mr-3" />
                      Upload All ({pendingCount} files)
                    </Button>
                    <Button
                      onClick={clearAll}
                      disabled={isUploading}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400 rounded-xl px-6 py-4 transition-all duration-300"
                      size="lg"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upload Controls */}
          {uploadFiles.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl" ref={uploadControlsRef}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      {uploadFiles.length} files
                    </span>
                    {pendingCount > 0 && (
                      <span className="text-sm text-orange-600">
                        {pendingCount} pending
                      </span>
                    )}
                    {successCount > 0 && (
                      <span className="text-sm text-green-600">
                        {successCount} uploaded
                      </span>
                    )}
                    {errorCount > 0 && (
                      <span className="text-sm text-red-600">
                        {errorCount} failed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {successCount > 0 && (
                      <Button
                        variant="ghost"
                        onClick={clearCompleted}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full hidden sm:inline-flex"
                        size="sm"
                      >
                        Clear Completed
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={clearAll}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Items */}
          {uploadFiles.length > 0 && (
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => (
                <UploadItem
                  key={uploadFile.id}
                  uploadFile={uploadFile}
                  onRemove={removeFile}
                  onRetry={retryUpload}
                />
              ))}
            </div>
          )}

          {/* History */}
          {showHistory && (
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl" ref={historyRef}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Upload History
                  </CardTitle>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={clearHistory}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                    >
                      Clear History
                    </Button>
                  )}
                </div>
                <CardDescription className="text-gray-600">
                  Your recent uploads are stored locally in your browser.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <History className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">
                      No upload history yet. Upload some images to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {item.thumbnail && (
                              <img
                                src={item.thumbnail}
                                alt={item.filename}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            )}
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">{item.filename}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(item.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(item.url, '_blank')}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromHistory(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {uploadFiles.length === 0 && !showHistory && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20">
                <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    Professional Imgur Upload Service
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Start your imgur upload instantly without creating an account. Our secure imgur image upload platform ensures fast, reliable hosting for all your image sharing requirements.
                  </p>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    Advanced Imgur Image Upload Formats
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Comprehensive support for JPG, PNG, GIF, WebP, and BMP imgur image upload. Our intelligent imgur upload system provides automatic optimization for superior loading speeds across all platforms.
                  </p>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <History className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    Smart Imgur Upload Management
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Generate instant direct imgur upload links perfect for Reddit posts, forum discussions, and social media sharing. Monitor your imgur image upload history with our advanced local tracking system.
                  </p>
                </Card>
              </div>

              {/* Why Choose Us Section */}
              <div className="mt-16 sm:mt-20">
              <div className="text-center space-y-4 sm:space-y-6 mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Why Choose Our Professional Imgur Upload Platform?
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                  Experience the most efficient imgur upload solution designed for seamless imgur image upload without registration hassles. Our platform revolutionizes how you manage imgur upload tasks.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Optimized Reddit Imgur Upload Integration</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Transform your Reddit posting experience with our specialized imgur upload technology. Generate instant imgur image upload links that integrate flawlessly with Reddit&apos;s embedding system for maximum engagement.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Lightning-fast direct links for Reddit imgur upload</li>
                    <li>• Zero verification requirements for imgur upload</li>
                    <li>• Permanent image hosting on Imgur infrastructure</li>
                    <li>• Cross-platform imgur image upload compatibility</li>
                  </ul>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Anonymous Imgur Upload Technology</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Experience complete anonymity with our advanced imgur upload system. Our privacy-first imgur image upload service ensures zero personal data exposure while delivering premium Imgur hosting capabilities.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Zero personal data required for imgur upload</li>
                    <li>• Completely anonymous imgur image upload process</li>
                    <li>• No user tracking during imgur upload sessions</li>
                    <li>• Military-grade HTTPS imgur upload encryption</li>
                  </ul>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Multi-Method Imgur Upload System</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Access multiple innovative imgur upload channels tailored to your workflow. Whether drag-and-drop, clipboard integration, or URL-based imgur image upload, our platform adapts to your preferred imgur upload methodology.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Intuitive drag & drop imgur upload interface</li>
                    <li>• One-click clipboard imgur upload functionality</li>
                    <li>• Direct URL-to-imgur upload conversion</li>
                    <li>• Batch processing imgur image upload capabilities</li>
                  </ul>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Imgur Upload Processing</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Receive instant imgur upload results with zero processing delays. Our high-performance imgur image upload engine delivers immediate shareable URLs optimized for global accessibility and reliability.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Sub-second imgur upload processing times</li>
                    <li>• Instant imgur upload link generation</li>
                    <li>• One-click imgur upload URL copying</li>
                    <li>• Comprehensive imgur image upload tracking</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 sm:mt-20">
              <div className="text-center space-y-4 sm:space-y-6 mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Comprehensive Imgur Upload FAQ Guide
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                  Master every aspect of imgur upload with our detailed guide. Learn advanced imgur image upload techniques and discover professional tips for optimal results.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Do I need an Imgur account for professional imgur upload?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely not! Our advanced imgur upload platform enables seamless imgur image upload without any account requirements. Experience instant imgur upload capabilities while maintaining complete anonymity through our secure gateway.
                  </p>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">What&apos;s the lifespan of my imgur upload content?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your imgur image upload content remains permanently hosted on Imgur&apos;s robust infrastructure. Our imgur upload service ensures long-term accessibility, with images maintained indefinitely unless they violate platform policies or remain inactive for extended periods.
                  </p>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Which file formats work with our imgur upload system?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our comprehensive imgur image upload platform supports all industry-standard formats: JPG, JPEG, PNG, GIF, WebP, and BMP. Each imgur upload undergoes intelligent optimization while preserving image quality, with support for files up to 20MB.
                  </p>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Does your platform support batch imgur upload operations?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! Our advanced imgur upload engine handles multiple imgur image upload tasks simultaneously. Each imgur upload generates unique direct links with individual progress tracking for optimal workflow management.
                  </p>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">What privacy levels does imgur upload provide?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our imgur image upload service automatically sets images as &quot;hidden&quot; within Imgur&apos;s infrastructure, ensuring they remain invisible in public galleries and search indexes. While direct imgur upload links provide access, your content stays private from general discovery.
                  </p>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Is professional imgur upload service cost-free?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our comprehensive imgur image upload platform remains completely free with zero hidden fees or subscription requirements. Enjoy unlimited imgur upload capabilities without watermarks, restrictions, or premium barriers.
                  </p>
                </Card>
              </div>
            </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200 mt-20 sm:mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ImgurUpload.pro
              </span>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              Experience the ultimate imgur upload platform for instant imgur image upload without registration. Our professional service delivers seamless imgur upload capabilities perfect for Reddit, forums, and social media integration.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm sm:text-base text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Registration-Free Imgur Upload</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Unlimited Imgur Image Upload</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>Instant Imgur Upload Links</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Secure Anonymous Imgur Upload</span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-500">
                © 2025 ImgurUpload.pro - Free Imgur Upload Tool. Not affiliated with Imgur, Inc.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
