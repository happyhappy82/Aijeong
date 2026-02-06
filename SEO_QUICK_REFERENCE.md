# SEO Quick Reference

## Component Usage

### SEOHead Component
Import and use in the `<head>` of your Astro pages:

```astro
---
import SEOHead from '@/components/SEOHead.astro';
---

<html lang="ko">
  <head>
    <SEOHead
      title="페이지 제목"
      description="페이지 설명"
    />
  </head>
  <body>
    <!-- content -->
  </body>
</html>
```

### For Blog Posts (Article Type)

```astro
<SEOHead
  title={post.title}
  description={post.summary}
  ogImage={post.coverImage}
  ogType="article"
  article={{
    publishedTime: post.date,
    modifiedTime: post.updatedDate,
    author: post.author,
    tags: [post.category]
  }}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | No | "에이정 - AI 교육 전문 기업" | Page title |
| `description` | string | No | "가장 쉬운 AI교육, 에이정" | Meta description |
| `ogImage` | string | No | Logo URL | Open Graph image |
| `ogType` | 'website' \| 'article' | No | 'website' | Open Graph type |
| `canonicalUrl` | string | No | Current page URL | Canonical URL |
| `article` | object | No | undefined | Article metadata |

### Article Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `publishedTime` | string | No | ISO date string |
| `modifiedTime` | string | No | ISO date string |
| `author` | string | No | Author name |
| `tags` | string[] | No | Article tags/categories |

## Generated Meta Tags

The component generates:
- ✅ Title tag
- ✅ Meta description
- ✅ Canonical link
- ✅ Open Graph tags (og:title, og:description, og:image, og:url, og:type, og:locale, og:site_name)
- ✅ Article tags (article:published_time, article:modified_time, article:author, article:tag)
- ✅ Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- ✅ Robots tags
- ✅ Organization JSON-LD structured data
- ✅ Article JSON-LD structured data (when article prop is provided)

## Configuration Files

### astro.config.mjs
```javascript
{
  site: 'https://aijeong.com',
  trailingSlash: 'always',
  integrations: [sitemap()]
}
```

### vercel.json
- Security headers configured
- Cache control for static assets
- Trailing slash redirects

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://aijeong.com/sitemap-index.xml
```

## Build & Deploy

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## File Locations (Absolute Paths)

- SEOHead: `/Users/gwonsunhyeon/aijeong-astro/src/components/SEOHead.astro`
- Config: `/Users/gwonsunhyeon/aijeong-astro/astro.config.mjs`
- TypeScript: `/Users/gwonsunhyeon/aijeong-astro/tsconfig.json`
- Vercel: `/Users/gwonsunhyeon/aijeong-astro/vercel.json`
- Robots: `/Users/gwonsunhyeon/aijeong-astro/public/robots.txt`

## Testing Checklist

- [ ] View page source and verify meta tags
- [ ] Test with Google Rich Results Test
- [ ] Test with Facebook Sharing Debugger
- [ ] Test with Twitter Card Validator
- [ ] Verify robots.txt is accessible
- [ ] Verify sitemap is generated after build
- [ ] Check canonical URLs are correct
- [ ] Verify structured data with Schema.org validator
