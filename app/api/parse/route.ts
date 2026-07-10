import { NextResponse } from "next/server";
import type { ParsedRecipe, SourceType } from "@/lib/types";
import { parseJsonLd, parseMicrodata } from "@/lib/parse/jsonld";
import { extractWithAI } from "@/lib/parse/ai";
import { fetchOEmbed } from "@/lib/parse/social";

export const runtime = "nodejs";
export const maxDuration = 60;

function detectSource(url: string): SourceType {
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("instagram.com")) return "instagram";
  return "web";
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/122.0 Safari/537.36";

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
  return await res.text();
}

export async function POST(req: Request) {
  let url = "";
  try {
    const body = await req.json();
    url = (body.url || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json(
      { error: "Enter a valid link starting with http:// or https://" },
      { status: 400 }
    );
  }

  const source_type = detectSource(url);

  try {
    // 1. Fetch the page HTML (works for web + social meta tags)
    let html = "";
    try {
      html = await fetchHtml(url);
    } catch {
      html = "";
    }

    // 2. Structured data first — cheapest & most accurate for recipe sites
    let parsed: ParsedRecipe | null = null;
    if (html) {
      parsed = parseJsonLd(html, url, source_type) || parseMicrodata(html, url, source_type);
    }

    // 3. Social posts: enrich caption/thumbnail via oEmbed, then AI-extract
    if (!parsed && (source_type === "youtube" || source_type === "instagram")) {
      const oembed = await fetchOEmbed(url, source_type);
      const context = [
        oembed?.title ? `Title: ${oembed.title}` : "",
        oembed?.author ? `Author: ${oembed.author}` : "",
        oembed?.description ? `Description/Caption:\n${oembed.description}` : "",
        html ? stripToText(html).slice(0, 6000) : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      parsed = await extractWithAI(context, url, source_type);
      if (parsed && oembed?.thumbnail && !parsed.image_url) {
        parsed.image_url = oembed.thumbnail;
      }
      if (parsed && oembed?.title && !parsed.title) parsed.title = oembed.title;
    }

    // 4. Web page with no structured data → AI fallback on visible text
    if (!parsed && html) {
      parsed = await extractWithAI(stripToText(html).slice(0, 12000), url, source_type);
    }

    if (!parsed) {
      return NextResponse.json(
        {
          error:
            "Couldn't find a recipe on that page. You can still paste the text manually, or start from scratch.",
        },
        { status: 422 }
      );
    }

    parsed.source_url = url;
    parsed.source_type = source_type;
    return NextResponse.json({ recipe: parsed });
  } catch (err) {
    console.error("parse error", err);
    return NextResponse.json(
      { error: "Something went wrong reading that link. Try again, or add it manually." },
      { status: 500 }
    );
  }
}

// Rough HTML → text for AI context / fallback
function stripToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
