import type { ParsedRecipe, SourceType } from "@/lib/types";

const SYSTEM = `You extract structured recipes from messy text (video captions, transcripts, blog posts). 
Return ONLY a JSON object, no markdown fences, no commentary. Use this exact shape:
{
  "title": string,
  "description": string,
  "servings": number,
  "prep_minutes": number | null,
  "cook_minutes": number | null,
  "tags": string[],
  "ingredients": [{ "amount": string, "unit": string, "item": string, "group_name": string }],
  "steps": [string]
}
Rules:
- Split each ingredient into amount (e.g. "1 1/2"), unit (e.g. "cup"), and item (e.g. "flour"). If no amount/unit, leave them "".
- group_name groups ingredients under headers like "For the sauce"; use "" if none.
- steps is an ordered array of instruction strings, one action per step.
- If the text has no real recipe, return {"title":"","ingredients":[],"steps":[]}.
- Keep quantities as written; do not invent ingredients or steps.`;

export async function extractWithAI(
  context: string,
  url: string,
  source_type: SourceType
): Promise<ParsedRecipe | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || !context.trim()) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: `Extract the recipe from this ${source_type} content:\n\n${context}`,
          },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text: string = (data.content || [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("")
      .trim();

    const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const obj = JSON.parse(clean.slice(start, end + 1));

    if (!obj.title && (!obj.ingredients?.length && !obj.steps?.length)) return null;

    return {
      title: obj.title || "Untitled recipe",
      description: obj.description || "",
      image_url: null,
      servings: Number(obj.servings) > 0 ? Number(obj.servings) : 2,
      prep_minutes: obj.prep_minutes ?? null,
      cook_minutes: obj.cook_minutes ?? null,
      tags: Array.isArray(obj.tags) ? obj.tags.slice(0, 8) : [],
      ingredients: (obj.ingredients || []).map((x: any, i: number) => ({
        position: i,
        amount: String(x.amount ?? ""),
        unit: String(x.unit ?? ""),
        item: String(x.item ?? "").trim(),
        group_name: String(x.group_name ?? ""),
      })).filter((x: any) => x.item),
      steps: (obj.steps || [])
        .map((s: any, i: number) => ({ position: i, body: String(s).trim() }))
        .filter((s: any) => s.body),
      source_url: url,
      source_type,
    };
  } catch {
    return null;
  }
}
