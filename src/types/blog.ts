export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  tags: string[];
  image?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}