export interface WPPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  categorySlug: 'blog' | 'casestudy';
  tags: string[];
  featuredImage: string | null;
}
