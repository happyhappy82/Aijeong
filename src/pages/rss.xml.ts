import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPosts } from '../lib/wp-content';

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return rss({
    title: '에이정, 가장 쉬운 AI교육',
    description: '가장 쉬운 AI교육, 에이정',
    site: context.site!.toString(),
    items: sortedPosts.map(post => ({
      title: post.title,
      pubDate: new Date(post.date),
      description: post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '').trim() : '',
      link: `/${post.slug}/`,
    })),
    customData: '<language>ko</language>',
  });
}
