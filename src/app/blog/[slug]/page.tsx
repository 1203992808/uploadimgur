import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Upload, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPostBySlug, getAllPosts } from '@/lib/blog';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | ImgurUpload.pro Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords.join(', '),
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      url: `https://imgurupload.pro/blog/${post.slug}`,
      siteName: "ImgurUpload.pro Blog",
      images: [
        {
          url: post.image || "https://imgurupload.pro/blog-og-image.jpg",
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.seo.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: [post.image || "https://imgurupload.pro/blog-og-image.jpg"],
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
      canonical: `https://imgurupload.pro/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Convert markdown content to HTML (basic conversion for demonstration)
  const formatContent = (content: string) => {
    // Remove the first line if it's an h1 title (since we display the title separately)
    const processedContent = content.replace(/^# .*$/m, '').trim();
    
    // Split content by lines for better processing
    const lines = processedContent.split('\n');
    const processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        processedLines.push('');
        continue;
      }
      
      // Handle images with captions
      if (line.match(/!\[(.*?)\]\((.*?)\)/)) {
        const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          processedLines.push(`<img src="${imgMatch[2]}" alt="${imgMatch[1]}" class="w-full max-w-4xl mx-auto rounded-2xl shadow-lg mb-4 border border-gray-200" />`);
          // Check if next line is a caption (italic text)
          if (i + 1 < lines.length && lines[i + 1].trim().match(/^\*([^*]+)\*$/)) {
            const captionMatch = lines[i + 1].trim().match(/^\*([^*]+)\*$/);
            if (captionMatch) {
              processedLines.push(`<em class="italic text-gray-600 text-sm block text-center mb-8 -mt-2">${captionMatch[1]}</em>`);
              i++; // Skip the caption line
            }
          }
        }
        continue;
      }
      
      // Handle headers
      if (line.startsWith('### ')) {
        processedLines.push(`<h3 class="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4 leading-tight">${line.substring(4)}</h3>`);
        continue;
      }
      if (line.startsWith('## ')) {
        processedLines.push(`<h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mt-12 mb-6 leading-tight">${line.substring(3)}</h2>`);
        continue;
      }
      if (line.startsWith('# ')) {
        processedLines.push(`<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">${line.substring(2)}</h1>`);
        continue;
      }
      
      // Handle list items
      if (line.startsWith('- ')) {
        processedLines.push(`<li class="mb-2 text-gray-700">${line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-600">$1</strong>')}</li>`);
        continue;
      }
      
      // Handle regular paragraphs
      if (line) {
        const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-600">$1</strong>');
        processedLines.push(`<p class="text-gray-700 leading-relaxed mb-6 text-lg">${processedLine}</p>`);
      }
    }

    // Join lines and handle lists
    let result = processedLines.join('\n');
    
    // Wrap consecutive list items in ul tags
    result = result.replace(/(<li class="mb-2 text-gray-700">.*?<\/li>\s*)+/g, (match) => {
      return `<ul class="list-disc list-inside space-y-2 mb-6 ml-4">${match}</ul>`;
    });

    return result;
  };

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
            <div className="flex items-center space-x-2">
              <Link href="/blog">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Blog
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Tool
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article>
          {/* Article Header */}
          <header className="mb-12">
            <div className="space-y-6">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-gray-400 mt-1" />
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg rounded-2xl mb-12">
            <CardContent className="p-8 sm:p-12">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              />
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Ready to Apply These Imgur Upload Techniques?
                </h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  Put your knowledge into practice with our professional, free imgur upload tool.
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
                    <span className="text-blue-700">Start Uploading Now</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center space-y-8">
            <Link href="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ImgurUpload.pro
              </span>
            </Link>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Professional imgur upload insights and the ultimate free tool for imgur image upload without registration.
            </p>
            <div className="pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                © 2025 ImgurUpload.pro - Professional Imgur Upload Blog & Tools
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}