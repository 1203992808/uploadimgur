import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Upload, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: "Professional Imgur Upload Blog - Expert Tips & Guides | ImgurUpload.pro",
  description: "Master imgur upload with our comprehensive blog. Expert guides on imgur image upload, optimization strategies, professional techniques, and best practices for developers and content creators.",
  openGraph: {
    title: "Professional Imgur Upload Blog - Expert Tips & Guides",
    description: "Master imgur upload with our comprehensive blog. Expert guides on imgur image upload, optimization strategies, professional techniques, and best practices.",
    url: "https://imgurupload.pro/blog",
    siteName: "ImgurUpload.pro Blog",
    images: [
      {
        url: "https://imgurupload.pro/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Professional Imgur Upload Blog"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Imgur Upload Blog - Expert Tips & Guides",
    description: "Master imgur upload with our comprehensive blog. Expert guides on imgur image upload, optimization strategies, and professional techniques.",
    images: ["https://imgurupload.pro/blog-og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://imgurupload.pro/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ImgurUpload
              </div>
            </Link>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                <Upload className="w-4 h-4 mr-2" />
                Upload Tool
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Professional Imgur Upload Blog
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight">
            Master <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Imgur Upload</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expert guides, professional techniques, and insider tips for mastering imgur upload workflows. 
            From basic imgur image upload to advanced optimization strategies.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {posts.map((post) => (
            <Card key={post.id} className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-2">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More */}
                  <div className="pt-4">
                    <Link href={`/blog/${post.slug}`}>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl group-hover:scale-105 transition-all duration-300"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl">
            <CardContent className="p-12">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Ready to Start Your Imgur Upload Journey?
                </h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  Put your newfound knowledge into practice with our professional imgur upload tool.
                </p>
                <Link href="/">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-700 hover:bg-slate-50 hover:text-blue-800 rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-blue-200 hover:border-blue-300"
                    style={{
                      backgroundColor: 'white !important',
                      color: '#1d4ed8 !important'
                    }}
                  >
                    <Upload className="w-6 h-6 mr-3 text-blue-700" />
                    <span className="text-blue-700">Try Our Upload Tool</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center space-y-6">
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ImgurUpload.pro
              </span>
            </Link>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional imgur upload insights and the ultimate free tool for imgur image upload without registration.
            </p>
            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-500">
                © 2025 ImgurUpload.pro - Professional Imgur Upload Blog & Tools
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}