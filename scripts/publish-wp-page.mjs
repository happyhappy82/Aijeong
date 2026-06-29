#!/usr/bin/env node

import { readFile } from "node:fs/promises";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function trimSlash(value) {
  return String(value).replace(/\/+$/, "");
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
      data?.message || data?.error || data?.raw || `${res.status} ${res.statusText}`;
    throw new Error(`${label} failed: ${detail}`);
  }

  return data;
}

async function main() {
  const baseUrl = trimSlash(process.env.AIJEONG_WP_BASE_URL || "https://aijeong.com");
  const user = requiredEnv("AIJEONG_WP_USER");
  const appPassword = requiredEnv("AIJEONG_WP_APP_PASSWORD");

  const pageFile = requiredEnv("WP_PAGE_FILE");
  const slug = requiredEnv("WP_PAGE_SLUG");
  const title = requiredEnv("WP_PAGE_TITLE");
  const excerpt = process.env.WP_PAGE_EXCERPT || "";
  const status = process.env.WP_PAGE_STATUS || "publish";

  const content = await readFile(pageFile, "utf8");
  const authHeader = `Basic ${Buffer.from(`${user}:${appPassword}`).toString("base64")}`;

  async function wpJson(path, options = {}) {
    const res = await fetch(`${baseUrl}/wp-json/wp/v2${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader,
        ...(options.headers || {}),
      },
    });

    return readJsonResponse(res, `WordPress ${options.method || "GET"} ${path}`);
  }

  async function publicHead(path) {
    const res = await fetch(`${baseUrl}${path}`, { method: "HEAD" });
    return res.status;
  }

  const pagePayload = {
    title,
    slug,
    status,
    content,
    excerpt,
  };

  const existingPages = await wpJson(
    `/pages?slug=${encodeURIComponent(slug)}&_fields=id,slug,status,link,title`
  );

  const existingPage = Array.isArray(existingPages) ? existingPages[0] : null;
  const result = existingPage
    ? await wpJson(`/pages/${existingPage.id}`, {
        method: "POST",
        body: JSON.stringify(pagePayload),
      })
    : await wpJson("/pages", {
        method: "POST",
        body: JSON.stringify(pagePayload),
      });

  const publicStatus = await publicHead(`/${slug}/`);

  console.log(
    JSON.stringify(
      {
        ok: true,
        action: existingPage ? "updated" : "created",
        page: {
          id: result.id,
          title: result.title?.rendered,
          slug: result.slug,
          status: result.status,
          link: result.link,
        },
        verification: {
          url: `${baseUrl}/${slug}/`,
          status: publicStatus,
        },
      },
      null,
      2
    )
  );
}

function githubAnnotationMessage(message) {
  return String(message || "Unknown error")
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`::error title=WordPress publish failed::${githubAnnotationMessage(message)}`);
  console.error(message);
  process.exit(1);
});
