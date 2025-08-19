import { BlogPost } from '@/types/blog';
import blogData from '@/data/blog-posts.json';

export function getAllPosts(): BlogPost[] {
  return blogData.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const post = blogData.posts.find(post => post.slug === slug);
  return post || null;
}

export function getRecentPosts(limit: number = 3): BlogPost[] {
  return getAllPosts().slice(0, limit);
}