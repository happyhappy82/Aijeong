#!/usr/bin/env node

import fs from "node:fs/promises";

const NOTION_VERSION = "2022-06-28";

const PRESETS = {
  column: {
    label: "AJEONG column",
    notionDataSourceId: "2f1753eb-c013-8175-8432-000b321b3ed0",
    wpCategorySlug: "column",
    listUrl: "https://aijeong.com/column/",
  },
  edu: {
    label: "AJEONG education case",
    notionDataSourceId: "35c753eb-c013-81be-8eb6-000be4fe4adc",
    wpCategorySlug: "casestudy",
    listUrl: "https://aijeong.com/교육사례-2/",
  },
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

async function readGitHubEventInputs() {
  if (!process.env.GITHUB_EVENT_PATH) return {};
  try {
    const raw = await fs.readFile(process.env.GITHUB_EVENT_PATH, "utf8");
    const event = JSON.parse(raw);
    return {
      type: event.inputs?.type || event.client_payload?.type,
      notionPageId:
        event.inputs?.notion_page_id || event.client_payload?.notion_page_id,
    };
  } catch {
    return {};
  }
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function trimSlash(value) {
  return value.replace(/\/+$/, "");
}

function normalizePageId(id) {
  return id.replace(/-/g, "").trim();
}

function wpBaseUrl() {
  return trimSlash(process.env.AIJEONG_WP_BASE_URL || "https://aijeong.com");
}

function wpAuthHeader() {
  const user = requiredEnv("AIJEONG_WP_USER");
  const password = requiredEnv("AIJEONG_WP_APP_PASSWORD");
  return `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
}

function notionHeaders(contentType = true) {
  const headers = {
    Authorization: `Bearer ${requiredEnv("NOTION_API_KEY")}`,
    "Notion-Version": NOTION_VERSION,
  };
  if (contentType) headers["Content-Type"] = "application/json";
  return headers;
}

function wpHeaders(contentType = true) {
  const headers = {
    Authorization: wpAuthHeader(),
  };
  if (contentType) headers["Content-Type"] = "application/json";
  return headers;
}

async function readJsonResponse(res, label) {
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!res.ok) {
    const detail =
      data?.message ||
      data?.error ||
      data?.raw ||
      `${res.status} ${res.statusText}`;
    throw new Error(`${label} failed: ${detail}`);
  }

  return data;
}

async function notionJson(path, options = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      ...notionHeaders(options.body !== undefined),
      ...(options.headers || {}),
    },
  });
  return readJsonResponse(res, `Notion ${options.method || "GET"} ${path}`);
}

async function wpJson(path, options = {}) {
  const res = await fetch(`${wpBaseUrl()}/wp-json/wp/v2${path}`, {
    ...options,
    headers: {
      ...wpHeaders(options.body !== undefined),
      ...(options.headers || {}),
    },
  });
  return readJsonResponse(res, `WordPress ${options.method || "GET"} ${path}`);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("\n", " ");
}

function plainText(richText = []) {
  return richText.map((part) => part.plain_text || "").join("");
}

function richTextToHtml(richText = []) {
  return richText
    .map((part) => {
      let value = escapeHtml(part.plain_text || "").replaceAll("\n", "<br />");
      const annotations = part.annotations || {};
      if (annotations.code) value = `<code>${value}</code>`;
      if (annotations.bold) value = `<strong>${value}</strong>`;
      if (annotations.italic) value = `<em>${value}</em>`;
      if (annotations.underline) value = `<u>${value}</u>`;
      if (annotations.strikethrough) value = `<s>${value}</s>`;
      const href = part.href || part.text?.link?.url;
      if (href) {
        value = `<a href="${escapeAttr(href)}" target="_blank" rel="noopener">${value}</a>`;
      }
      return value;
    })
    .join("");
}

function propertyPlainText(page, name) {
  const prop = page.properties?.[name];
  if (!prop) return "";
  if (prop.type === "title") return plainText(prop.title || []);
  if (prop.type === "rich_text") return plainText(prop.rich_text || []);
  if (prop.type === "url") return prop.url || "";
  if (prop.type === "number") return String(prop.number ?? "");
  if (prop.type === "date") return prop.date?.start || "";
  return "";
}

function propertyStatus(page, name) {
  const prop = page.properties?.[name];
  if (!prop) return "";
  if (prop.type === "status") return prop.status?.name || "";
  if (prop.type === "select") return prop.select?.name || "";
  return "";
}

function propertyMultiSelect(page, name) {
  const prop = page.properties?.[name];
  if (!prop || prop.type !== "multi_select") return [];
  return (prop.multi_select || []).map((tag) => tag.name).filter(Boolean);
}

function firstFileUrl(page, names) {
  for (const name of names) {
    const prop = page.properties?.[name];
    if (!prop || prop.type !== "files") continue;
    const file = prop.files?.[0];
    if (!file) continue;
    return file.type === "external" ? file.external?.url : file.file?.url;
  }
  return "";
}

function coverUrl(page) {
  if (page.cover?.type === "external") return page.cover.external?.url || "";
  if (page.cover?.type === "file") return page.cover.file?.url || "";
  return firstFileUrl(page, ["대표 이미지", "Cover", "Thumbnail"]);
}

function slugify(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extensionFromContentType(contentType) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("svg")) return "svg";
  return "jpg";
}

function contentTypeFromFilename(filename) {
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".gif")) return "image/gif";
  if (filename.endsWith(".webp")) return "image/webp";
  if (filename.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
}

function filenameForImage(url, fallbackBase, contentType) {
  const urlPath = (() => {
    try {
      return new URL(url).pathname;
    } catch {
      return "";
    }
  })();
  const rawName = urlPath.split("/").pop() || "";
  const extMatch = rawName.match(/\.([a-z0-9]{2,5})$/i);
  const ext = extMatch?.[1]?.toLowerCase() || extensionFromContentType(contentType);
  const base = fallbackBase.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");
  return `${base || "notion-image"}.${ext}`;
}

async function fetchBlockChildren(blockId) {
  const results = [];
  let startCursor = "";
  do {
    const query = new URLSearchParams({ page_size: "100" });
    if (startCursor) query.set("start_cursor", startCursor);
    const data = await notionJson(`/blocks/${blockId}/children?${query}`);
    results.push(...(data.results || []));
    startCursor = data.has_more ? data.next_cursor : "";
  } while (startCursor);
  return results;
}

async function fetchAllBlocks(pageId) {
  return fetchBlockChildren(pageId);
}

async function resolveCategoryId(slug) {
  const data = await wpJson(`/categories?slug=${encodeURIComponent(slug)}`);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`WordPress category not found for slug: ${slug}`);
  }
  return data[0].id;
}

async function resolveTagIds(names) {
  const ids = [];
  for (const name of names) {
    const found = await wpJson(`/tags?search=${encodeURIComponent(name)}`);
    const exact = Array.isArray(found)
      ? found.find((tag) => tag.name.toLowerCase() === name.toLowerCase())
      : null;
    if (exact) {
      ids.push(exact.id);
      continue;
    }
    const created = await wpJson("/tags", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    ids.push(created.id);
  }
  return ids;
}

async function findExistingPost(slug) {
  const query = new URLSearchParams({
    slug,
    status: "any",
    per_page: "1",
  });
  const data = await wpJson(`/posts?${query}`);
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function uploadMediaFromUrl(url, fallbackBase, altText, cache) {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url);

  const imageResponse = await fetch(url);
  if (!imageResponse.ok) {
    throw new Error(`Image download failed: ${imageResponse.status} ${url}`);
  }

  const contentType =
    imageResponse.headers.get("content-type")?.split(";")[0] ||
    contentTypeFromFilename(url);
  const filename = filenameForImage(url, fallbackBase, contentType);
  const buffer = Buffer.from(await imageResponse.arrayBuffer());

  const media = await wpJson("/media", {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
    body: buffer,
  });

  if (altText) {
    try {
      await wpJson(`/media/${media.id}`, {
        method: "POST",
        body: JSON.stringify({ alt_text: altText }),
      });
    } catch (error) {
      console.warn(`Media alt text update skipped: ${error.message}`);
    }
  }

  const uploaded = { id: media.id, url: media.source_url };
  cache.set(url, uploaded);
  return uploaded;
}

async function convertListItem(block, ctx) {
  const value = block[block.type] || {};
  const content = richTextToHtml(value.rich_text || []);
  const children = block.has_children
    ? await convertBlocks(await fetchBlockChildren(block.id), ctx)
    : "";
  return `<li>${content}${children ? `\n${children}` : ""}</li>`;
}

async function convertTable(block, ctx) {
  const rows = await fetchBlockChildren(block.id);
  const hasHeader = Boolean(block.table?.has_column_header);
  const rowHtml = rows
    .filter((row) => row.type === "table_row")
    .map((row, index) => {
      const tag = hasHeader && index === 0 ? "th" : "td";
      const cells = (row.table_row?.cells || [])
        .map((cell) => `<${tag}>${richTextToHtml(cell)}</${tag}>`)
        .join("");
      return `<tr>${cells}</tr>`;
    });

  if (rowHtml.length === 0) return "";
  if (!hasHeader) return `<table><tbody>${rowHtml.join("")}</tbody></table>`;
  return `<table><thead>${rowHtml[0]}</thead><tbody>${rowHtml
    .slice(1)
    .join("")}</tbody></table>`;
}

async function convertBlock(block, ctx) {
  const value = block[block.type] || {};
  const text = richTextToHtml(value.rich_text || []);
  const children = block.has_children
    ? await convertBlocks(await fetchBlockChildren(block.id), ctx)
    : "";

  switch (block.type) {
    case "paragraph":
      return `${text ? `<p>${text}</p>` : ""}${children ? `\n${children}` : ""}`;
    case "heading_1":
      return `<h2>${text}</h2>${children ? `\n${children}` : ""}`;
    case "heading_2":
      return `<h3>${text}</h3>${children ? `\n${children}` : ""}`;
    case "heading_3":
      return `<h4>${text}</h4>${children ? `\n${children}` : ""}`;
    case "quote":
      return `<blockquote>${text}${children ? `\n${children}` : ""}</blockquote>`;
    case "callout":
      return `<blockquote>${text}${children ? `\n${children}` : ""}</blockquote>`;
    case "divider":
      return "<hr />";
    case "code": {
      const language = value.language ? ` class="language-${escapeAttr(value.language)}"` : "";
      return `<pre><code${language}>${escapeHtml(plainText(value.rich_text || []))}</code></pre>`;
    }
    case "image": {
      const url =
        value.type === "external" ? value.external?.url : value.file?.url;
      const caption = richTextToHtml(value.caption || []);
      const altText = plainText(value.caption || []);
      const media = await uploadMediaFromUrl(
        url,
        `notion-${block.id}`,
        altText,
        ctx.mediaCache,
      );
      if (media?.id) ctx.bodyMediaIds.push(media.id);
      return `<figure class="wp-block-image"><img src="${escapeAttr(
        media?.url || url,
      )}" alt="${escapeAttr(altText)}" />${
        caption ? `<figcaption>${caption}</figcaption>` : ""
      }</figure>`;
    }
    case "bookmark":
    case "embed":
    case "video":
    case "file":
    case "pdf": {
      const url =
        value.url ||
        value.external?.url ||
        value.file?.url ||
        value[block.type]?.url ||
        "";
      if (!url) return children;
      return `<p><a href="${escapeAttr(url)}" target="_blank" rel="noopener">${escapeHtml(
        url,
      )}</a></p>${children ? `\n${children}` : ""}`;
    }
    case "to_do": {
      const checked = value.checked ? "[x]" : "[ ]";
      return `<p>${checked} ${text}</p>${children ? `\n${children}` : ""}`;
    }
    case "toggle":
      return `<details><summary>${text}</summary>${children}</details>`;
    case "table":
      return convertTable(block, ctx);
    case "column_list":
    case "column":
    case "synced_block":
    case "template":
      return children;
    case "child_page":
      return `<h3>${escapeHtml(value.title || "Related page")}</h3>`;
    case "table_of_contents":
    case "breadcrumb":
      return "";
    default:
      return children;
  }
}

async function convertBlocks(blocks, ctx) {
  const html = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const listType = block.type;
      const tag = listType === "bulleted_list_item" ? "ul" : "ol";
      const items = [];
      while (i < blocks.length && blocks[i].type === listType) {
        items.push(await convertListItem(blocks[i], ctx));
        i += 1;
      }
      i -= 1;
      html.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }

    const converted = await convertBlock(block, ctx);
    if (converted) html.push(converted);
  }
  return html.join("\n");
}

async function updateNotionSuccess(pageId, post) {
  try {
    await notionJson(`/pages/${pageId}`, {
      method: "PATCH",
      body: JSON.stringify({
        properties: {
          "WP Post ID": { number: post.id },
          "WP URL": { url: post.link },
          "Published At": { date: { start: new Date().toISOString() } },
          "Publish Error": { rich_text: [] },
        },
      }),
    });
  } catch (error) {
    console.warn(`Notion success sync skipped: ${error.message}`);
  }
}

async function updateNotionError(pageId, error) {
  if (!pageId || !process.env.NOTION_API_KEY) return;
  try {
    await notionJson(`/pages/${pageId}`, {
      method: "PATCH",
      body: JSON.stringify({
        properties: {
          "Publish Error": {
            rich_text: [
              {
                type: "text",
                text: { content: String(error.message || error).slice(0, 1900) },
              },
            ],
          },
        },
      }),
    });
  } catch (syncError) {
    console.warn(`Notion error sync skipped: ${syncError.message}`);
  }
}

async function publishNotionPage({ type, notionPageId }) {
  const preset = PRESETS[type];
  if (!preset) {
    throw new Error(`Unsupported type: ${type}. Use one of: ${Object.keys(PRESETS).join(", ")}`);
  }
  if (!notionPageId) throw new Error("Missing Notion page ID");

  const pageId = normalizePageId(notionPageId);
  const page = await notionJson(`/pages/${pageId}`);
  const status = propertyStatus(page, "Status");
  if (status !== "Published") {
    throw new Error(`Notion Status must be Published before publishing. Current: ${status || "(empty)"}`);
  }

  const title = propertyPlainText(page, "Title");
  if (!title) throw new Error("Notion Title is required");
  const slug = propertyPlainText(page, "Slug") || slugify(title);
  if (!slug) throw new Error("Slug is required or must be derivable from Title");

  const excerpt = propertyPlainText(page, "Excerpt");
  const tagNames = propertyMultiSelect(page, "Tags");
  const ctx = {
    mediaCache: new Map(),
    bodyMediaIds: [],
  };

  const cover = coverUrl(page);
  const coverMedia = cover
    ? await uploadMediaFromUrl(cover, `notion-cover-${pageId}`, title, ctx.mediaCache)
    : null;

  const blocks = await fetchAllBlocks(pageId);
  const content = await convertBlocks(blocks, ctx);
  if (!content.trim()) throw new Error("Notion page body is empty");

  const categoryId = await resolveCategoryId(preset.wpCategorySlug);
  const tagIds = await resolveTagIds(tagNames);
  const existing = await findExistingPost(slug);
  const featuredMedia = coverMedia?.id || ctx.bodyMediaIds[0] || undefined;

  const payload = {
    title,
    slug,
    excerpt,
    content,
    status: "publish",
    categories: [categoryId],
    tags: tagIds,
  };
  if (featuredMedia) payload.featured_media = featuredMedia;

  const post = existing
    ? await wpJson(`/posts/${existing.id}`, {
        method: "POST",
        body: JSON.stringify(payload),
      })
    : await wpJson("/posts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

  await updateNotionSuccess(pageId, post);

  const publicChecks = {};
  for (const [key, url] of Object.entries({ post: post.link, list: preset.listUrl })) {
    try {
      const res = await fetch(url);
      const body = await res.text();
      publicChecks[key] = { ok: res.ok, titleIncluded: body.includes(title) };
    } catch (error) {
      publicChecks[key] = { ok: false, error: error.message };
    }
  }

  return {
    ok: true,
    type,
    source: preset.label,
    notionPageId: page.id,
    title,
    slug,
    status: post.status,
    action: existing ? "updated" : "created",
    postId: post.id,
    url: post.link,
    featuredMediaId: featuredMedia || null,
    categorySlug: preset.wpCategorySlug,
    listUrl: preset.listUrl,
    publicChecks,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const eventInputs = await readGitHubEventInputs();
  const type = args.type || process.env.INPUT_TYPE || eventInputs.type;
  const notionPageId =
    args["notion-page-id"] ||
    args.notionPageId ||
    process.env.INPUT_NOTION_PAGE_ID ||
    eventInputs.notionPageId;

  try {
    const result = await publishNotionPage({ type, notionPageId });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    await updateNotionError(notionPageId ? normalizePageId(notionPageId) : "", error);
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
