import type { SourceType } from "@/lib/types";

interface OEmbedResult {
  title?: string;
  author?: string;
  description?: string;
  thumbnail?: string;
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/122.0 Safari/537.36";

function meta(html: string, prop: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
      "i"
    ),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return decodeHtml(m[1]);
  }
  return null;
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function youtubeId(url: string): string | null {
  const m =
    url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
    url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export async function fetchOEmbed(
  url: string,
  source: SourceType
): Promise<OEmbedResult | null> {
  try {
    if (source === "youtube") {
      // YouTube oEmbed gives title/author/thumbnail (no full description),
      // so we also scrape the watch page meta for the description.
      const id = youtubeId(url);
      const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
        url
      )}`;
      const [oembedRes, pageRes] = await Promise.allSettled([
        fetch(oembedUrl, { headers: { "User-Agent": UA } }),
        fetch(id ? `https://www.youtube.com/watch?v=${id}` : url, {
          headers: { "User-Agent": UA },
        }),
      ]);

      const result: OEmbedResult = {};
      if (oembedRes.status === "fulfilled" && oembedRes.value.ok) {
        const j = await oembedRes.value.json();
        result.title = j.title;
        result.author = j.author_name;
        result.thumbnail =
          id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : j.thumbnail_url;
      }
      if (pageRes.status === "fulfilled" && pageRes.value.ok) {
        const html = await pageRes.value.text();
        // Description often in a JSON blob "shortDescription":"..."
        const desc =
          html.match(/"shortDescription":"([^]*?[^\\])"/)?.[1] ||
          meta(html, "og:description") ||
          meta(html, "description");
        if (desc) {
          result.description = desc
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"')
            .replace(/\\u0026/g, "&");
        }
        if (!result.title) result.title = meta(html, "og:title") || undefined;
      }
      return result;
    }

    if (source === "instagram") {
      // Instagram blocks most scraping; use og: meta tags from the page.
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) return null;
      const html = await res.text();
      return {
        title: meta(html, "og:title") || undefined,
        description:
          meta(html, "og:description") || meta(html, "description") || undefined,
        thumbnail: meta(html, "og:image") || undefined,
      };
    }
  } catch {
    return null;
  }
  return null;
}
