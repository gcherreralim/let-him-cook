import type { Ingredient, ParsedRecipe, SourceType, Step } from "@/lib/types";

// ---- helpers ------------------------------------------------

function decode(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ISO-8601 duration (PT1H30M) → minutes
function durationToMinutes(iso?: string): number | null {
  if (!iso || typeof iso !== "string") return null;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return null;
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const total = h * 60 + min;
  return total > 0 ? total : null;
}

function toArray<T>(v: T | T[] | undefined | null): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function firstImage(img: any): string | null {
  if (!img) return null;
  if (typeof img === "string") return img;
  if (Array.isArray(img)) return firstImage(img[0]);
  if (typeof img === "object") return img.url || img["@id"] || null;
  return null;
}

function parseServings(y: any): number {
  if (!y) return 2;
  const s = Array.isArray(y) ? y[0] : y;
  const n = parseInt(String(s).replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

// Split "1 1/2 cups flour" into amount / unit / item (best effort)
const UNITS = [
  "cup","cups","tbsp","tablespoon","tablespoons","tsp","teaspoon","teaspoons",
  "g","gram","grams","kg","kilogram","kilograms","ml","milliliter","milliliters",
  "l","liter","liters","litre","litres","oz","ounce","ounces","lb","lbs","pound","pounds",
  "pinch","pinches","clove","cloves","can","cans","slice","slices","stick","sticks",
  "handful","handfuls","piece","pieces","dash","dashes","sprig","sprigs","head","heads",
  "package","packages","pkg","bunch","bunches","stalk","stalks","quart","quarts","pint","pints",
];

export function splitIngredient(raw: string): { amount: string; unit: string; item: string } {
  const text = decode(raw);
  // leading quantity: digits, fractions, unicode fractions, ranges
  const qtyMatch = text.match(
    /^((?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?|[½⅓⅔¼¾⅛⅜⅝⅞])(?:\s*[-–]\s*(?:\d+(?:\.\d+)?|\d+\/\d+))?)/
  );
  let amount = "";
  let rest = text;
  if (qtyMatch) {
    amount = qtyMatch[1].trim();
    rest = text.slice(qtyMatch[0].length).trim();
  }
  let unit = "";
  const words = rest.split(/\s+/);
  if (words.length > 1) {
    const cand = words[0].toLowerCase().replace(/\.$/, "");
    if (UNITS.includes(cand)) {
      unit = words[0].replace(/\.$/, "");
      rest = words.slice(1).join(" ");
    }
  }
  return { amount, unit, item: rest.trim() || text };
}

function normalizeIngredients(list: any): Ingredient[] {
  return toArray(list)
    .map((x) => (typeof x === "string" ? x : x?.text || ""))
    .map(decode)
    .filter(Boolean)
    .map((raw, i) => {
      const { amount, unit, item } = splitIngredient(raw);
      return { position: i, amount, unit, item, group_name: "" } as Ingredient;
    });
}

function flattenInstructions(instr: any): string[] {
  const out: string[] = [];
  const walk = (node: any) => {
    if (!node) return;
    if (typeof node === "string") {
      const t = decode(node);
      if (t) out.push(t);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const type = node["@type"];
    if (type === "HowToSection") {
      walk(node.itemListElement || node.steps);
      return;
    }
    if (node.text) {
      const t = decode(node.text);
      if (t) out.push(t);
      return;
    }
    if (node.itemListElement) walk(node.itemListElement);
  };
  walk(instr);
  return out;
}

function normalizeSteps(instr: any): Step[] {
  const raw = flattenInstructions(instr);
  // Some sites cram all steps into one blob; split on sentence/newline if huge
  let bodies = raw;
  if (raw.length === 1 && raw[0].length > 400) {
    bodies = raw[0]
      .split(/(?<=\.)\s+(?=[A-Z])|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return bodies.map((body, i) => ({ position: i, body } as Step));
}

function buildFromRecipeNode(
  node: any,
  url: string,
  source_type: SourceType
): ParsedRecipe {
  const prep = durationToMinutes(node.prepTime);
  const cook = durationToMinutes(node.cookTime);
  const total = durationToMinutes(node.totalTime);
  return {
    title: decode(node.name || "Untitled recipe"),
    description: decode(node.description || ""),
    image_url: firstImage(node.image),
    servings: parseServings(node.recipeYield),
    prep_minutes: prep,
    cook_minutes: cook ?? (total && prep ? total - prep : total),
    tags: toArray(node.recipeCuisine)
      .concat(toArray(node.keywords).flatMap((k: string) => String(k).split(",")))
      .map((t) => decode(String(t)))
      .filter(Boolean)
      .slice(0, 8),
    ingredients: normalizeIngredients(node.recipeIngredient || node.ingredients),
    steps: normalizeSteps(node.recipeInstructions),
    source_url: url,
    source_type,
  };
}

function findRecipeNode(data: any): any | null {
  const nodes = toArray(data);
  for (const n of nodes) {
    if (!n || typeof n !== "object") continue;
    const t = n["@type"];
    const types = toArray(t).map((x) => String(x).toLowerCase());
    if (types.includes("recipe")) return n;
    if (n["@graph"]) {
      const g = findRecipeNode(n["@graph"]);
      if (g) return g;
    }
  }
  return null;
}

export function parseJsonLd(
  html: string,
  url: string,
  source_type: SourceType
): ParsedRecipe | null {
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];
  for (const b of blocks) {
    let json: any;
    try {
      json = JSON.parse(b[1].trim());
    } catch {
      // some sites embed multiple objects or trailing commas — try lenient repair
      try {
        json = JSON.parse(b[1].replace(/,\s*([}\]])/g, "$1").trim());
      } catch {
        continue;
      }
    }
    const node = findRecipeNode(json);
    if (node) {
      const parsed = buildFromRecipeNode(node, url, source_type);
      if (parsed.ingredients.length || parsed.steps.length) return parsed;
    }
  }
  return null;
}

// Minimal microdata fallback (itemprop-based)
export function parseMicrodata(
  html: string,
  url: string,
  source_type: SourceType
): ParsedRecipe | null {
  const ing = [...html.matchAll(/itemprop=["']recipeIngredient["'][^>]*>([\s\S]*?)<\//gi)]
    .map((m) => decode(m[1]))
    .filter(Boolean);
  const steps = [...html.matchAll(/itemprop=["']recipeInstructions["'][^>]*>([\s\S]*?)<\//gi)]
    .map((m) => decode(m[1]))
    .filter(Boolean);
  if (!ing.length && !steps.length) return null;

  const nameMatch = html.match(/itemprop=["']name["'][^>]*>([\s\S]*?)<\//i);
  return {
    title: nameMatch ? decode(nameMatch[1]) : "Untitled recipe",
    description: "",
    image_url: null,
    servings: 2,
    prep_minutes: null,
    cook_minutes: null,
    tags: [],
    ingredients: ing.map((raw, i) => {
      const s = splitIngredient(raw);
      return { position: i, ...s, group_name: "" };
    }),
    steps: steps.map((body, i) => ({ position: i, body })),
    source_url: url,
    source_type,
  };
}
