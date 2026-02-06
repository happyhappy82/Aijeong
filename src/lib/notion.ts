import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { estimateReadingTime, slugify } from "./utils";
import { SAMPLE_BLOG_POSTS, SAMPLE_EDUCATION_CASES } from "./sample-data";
import type { BlogPost, EducationCase } from "./types";

function isNotionConfigured(): boolean {
  return !!(
    import.meta.env.NOTION_API_KEY &&
    !import.meta.env.NOTION_API_KEY.startsWith("your_")
  );
}

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const BLOG_DB_ID = import.meta.env.NOTION_BLOG_DB_ID || "";
const EDUCATION_DB_ID = import.meta.env.NOTION_EDUCATION_DB_ID || "";

async function cacheImage(url: string, slug: string, index: number): Promise<string> {
  if (!url || !url.startsWith("http")) return url;

  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const IMAGE_CACHE_DIR = path.join(process.cwd(), "public", "images", "cache");

    await fs.mkdir(IMAGE_CACHE_DIR, { recursive: true });

    const ext = url.includes(".png") ? "png" : url.includes(".gif") ? "gif" : "jpg";
    const filename = `${slug}-${index}.${ext}`;
    const filepath = path.join(IMAGE_CACHE_DIR, filename);

    try {
      await fs.access(filepath);
      return `/images/cache/${filename}`;
    } catch {
      // File doesn't exist, download it
    }

    const response = await fetch(url);
    if (!response.ok) return url;

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(filepath, buffer);

    return `/images/cache/${filename}`;
  } catch {
    return url;
  }
}

function getPropertyValue(page: Record<string, unknown>, key: string): string {
  const props = page.properties as Record<string, Record<string, unknown>>;
  const prop = props?.[key];
  if (!prop) return "";

  const type = prop.type as string;

  if (type === "title") {
    const titleArr = prop.title as Array<{ plain_text: string }>;
    return titleArr?.map((t) => t.plain_text).join("") || "";
  }
  if (type === "rich_text") {
    const textArr = prop.rich_text as Array<{ plain_text: string }>;
    return textArr?.map((t) => t.plain_text).join("") || "";
  }
  if (type === "select") {
    const select = prop.select as { name: string } | null;
    return select?.name || "";
  }
  if (type === "date") {
    const date = prop.date as { start: string } | null;
    return date?.start || "";
  }
  if (type === "number") {
    return String(prop.number ?? "");
  }
  if (type === "checkbox") {
    return String(prop.checkbox ?? "false");
  }
  if (type === "url") {
    return (prop.url as string) || "";
  }
  if (type === "files") {
    const files = prop.files as Array<{
      type: string;
      file?: { url: string };
      external?: { url: string };
    }>;
    if (files?.[0]) {
      return files[0].type === "file" ? files[0].file?.url || "" : files[0].external?.url || "";
    }
    return "";
  }

  return "";
}

function getCoverImage(page: Record<string, unknown>): string {
  const cover = page.cover as {
    type: string;
    file?: { url: string };
    external?: { url: string };
  } | null;

  if (!cover) return "";
  return cover.type === "file" ? cover.file?.url || "" : cover.external?.url || "";
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!isNotionConfigured() || !BLOG_DB_ID) return SAMPLE_BLOG_POSTS;

  try {
    const response = await notion.databases.query({
      database_id: BLOG_DB_ID,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    const posts: BlogPost[] = [];

    for (const page of response.results) {
      const p = page as Record<string, unknown>;
      const title = getPropertyValue(p, "Title") || getPropertyValue(p, "Name");
      const slug = getPropertyValue(p, "Slug") || slugify(title);
      const coverUrl = getPropertyValue(p, "Cover") || getCoverImage(p);
      const coverImage = await cacheImage(coverUrl, slug, 0);

      posts.push({
        id: p.id as string,
        slug,
        title,
        summary: getPropertyValue(p, "Summary") || getPropertyValue(p, "Description"),
        category: getPropertyValue(p, "Category") || "일반",
        coverImage,
        date: getPropertyValue(p, "Date") || (p.created_time as string) || "",
        author: getPropertyValue(p, "Author") || "에이정",
        readingTime: 3,
        published: true,
      });
    }

    return posts;
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isNotionConfigured() || !BLOG_DB_ID) {
    return SAMPLE_BLOG_POSTS.find((p) => p.slug === slug) || null;
  }

  const posts = await getAllBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  try {
    const mdblocks = await n2m.pageToMarkdown(post.id);
    let content = n2m.toMarkdownString(mdblocks).parent;

    const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
    let match;
    let imageIndex = 1;
    while ((match = imageRegex.exec(content)) !== null) {
      const cachedUrl = await cacheImage(match[2], slug, imageIndex++);
      content = content.replace(match[2], cachedUrl);
    }

    post.content = content;
    post.readingTime = estimateReadingTime(content);
    return post;
  } catch (error) {
    console.error("Failed to fetch blog post content:", error);
    return post;
  }
}

export async function getAllEducationCases(): Promise<EducationCase[]> {
  if (!isNotionConfigured() || !EDUCATION_DB_ID) return SAMPLE_EDUCATION_CASES;

  try {
    const response = await notion.databases.query({
      database_id: EDUCATION_DB_ID,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    const cases: EducationCase[] = [];

    for (const page of response.results) {
      const p = page as Record<string, unknown>;
      const title = getPropertyValue(p, "Title") || getPropertyValue(p, "Name");
      const slug = getPropertyValue(p, "Slug") || slugify(title);
      const coverUrl = getPropertyValue(p, "Cover") || getCoverImage(p);
      const coverImage = await cacheImage(coverUrl, slug, 0);

      cases.push({
        id: p.id as string,
        slug,
        title,
        organization: getPropertyValue(p, "Organization") || "",
        participants: parseInt(getPropertyValue(p, "Participants") || "0", 10),
        category: getPropertyValue(p, "Category") || "일반",
        coverImage,
        date: getPropertyValue(p, "Date") || (p.created_time as string) || "",
        summary: getPropertyValue(p, "Summary") || getPropertyValue(p, "Description"),
        published: true,
      });
    }

    return cases;
  } catch (error) {
    console.error("Failed to fetch education cases:", error);
    return [];
  }
}

export async function getEducationCaseBySlug(slug: string): Promise<EducationCase | null> {
  if (!isNotionConfigured() || !EDUCATION_DB_ID) {
    return SAMPLE_EDUCATION_CASES.find((c) => c.slug === slug) || null;
  }

  const cases = await getAllEducationCases();
  const educationCase = cases.find((c) => c.slug === slug);
  if (!educationCase) return null;

  try {
    const mdblocks = await n2m.pageToMarkdown(educationCase.id);
    const content = n2m.toMarkdownString(mdblocks).parent;
    educationCase.content = content;
    return educationCase;
  } catch (error) {
    console.error("Failed to fetch education case content:", error);
    return educationCase;
  }
}
