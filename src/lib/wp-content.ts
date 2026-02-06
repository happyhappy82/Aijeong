import type { WPPost } from './wp-types';

// Load posts from JSON data file
export async function getAllPosts(): Promise<WPPost[]> {
  const data = await import('../data/wp-posts.json');
  return data.posts || [];
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}

export async function getBlogPosts(): Promise<WPPost[]> {
  const posts = await getAllPosts();
  return posts.filter(p => p.categorySlug === 'blog').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getCaseStudyPosts(): Promise<WPPost[]> {
  const posts = await getAllPosts();
  return posts.filter(p => p.categorySlug === 'casestudy').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
