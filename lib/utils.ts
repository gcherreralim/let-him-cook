export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function totalTime(prep: number | null, cook: number | null): number | null {
  const t = (prep || 0) + (cook || 0);
  return t > 0 ? t : null;
}

export function fmtMinutes(mins: number | null): string {
  if (!mins || mins <= 0) return "";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

const SOURCE_LABEL: Record<string, string> = {
  youtube: "YouTube", instagram: "Instagram", web: "From the web", manual: "Handwritten",
};
export function sourceLabel(s: string): string { return SOURCE_LABEL[s] || "Recipe"; }

// ---- serving scaler ----
const UNI: Record<string, number> = {
  "½": .5, "⅓": 1/3, "⅔": 2/3, "¼": .25, "¾": .75, "⅛": .125, "⅜": .375, "⅝": .625, "⅞": .875,
};
function parseAmt(t: string): number | null {
  t = (t || "").trim();
  if (UNI[t] != null) return UNI[t];
  let m = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (m) return +m[1] + +m[2] / +m[3];
  m = t.match(/^(\d+)\/(\d+)$/);
  if (m) return +m[1] / +m[2];
  if (/^\d+(\.\d+)?$/.test(t)) return parseFloat(t);
  return null;
}
function pretty(n: number): string {
  const r = Math.round(n * 100) / 100, w = Math.floor(r), f = r - w;
  const map: [number, string][] = [
    [.125,"⅛"],[.25,"¼"],[.333,"⅓"],[.375,"⅜"],[.5,"½"],[.625,"⅝"],[.667,"⅔"],[.75,"¾"],[.875,"⅞"],
  ];
  let best = "", bd = .07;
  for (const [v, s] of map) { const d = Math.abs(f - v); if (d < bd) { bd = d; best = s; } }
  if (best) return w ? `${w} ${best}` : best;
  if (f < .06) return String(w);
  return String(r);
}
export function scaleAmount(amount: string, factor: number): string {
  if (!amount || factor === 1) return amount;
  const range = amount.match(/^(.+?)\s*[-–]\s*(.+)$/);
  if (range) return `${scaleAmount(range[1], factor)}–${scaleAmount(range[2], factor)}`;
  const v = parseAmt(amount);
  if (v == null) return amount;
  return pretty(v * factor);
}

// ---- step timer detection: "sear for 8 minutes" -> 8 ----
export function detectTimerMinutes(body: string): number | null {
  const m = body.match(/(\d+)(?:\s*[-–]\s*\d+)?\s*min/i) || body.match(/(\d+)\s*hour/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (/hour/i.test(m[0])) return n * 60;
  return n > 0 && n <= 600 ? n : null;
}

// ---- ingredient -> shopping category ----
const CAT_WORDS: [string, string[]][] = [
  ["Produce", ["garlic","onion","lemon","lime","tomato","parsley","cilantro","basil","scallion","ginger","carrot","celery","potato","pepper,","bell pepper","spinach","kale","lettuce","cucumber","avocado","mushroom","broccoli","zucchini","apple","banana","berr","orange","herb","chili","shallot","leek","cabbage","corn","peas","mango","fruit","vegetable"]],
  ["Meat & Fish", ["chicken","beef","pork","lamb","turkey","salmon","fish","shrimp","prawn","bacon","sausage","ham","steak","mince","ground ","tuna","crab","thigh","breast","drumstick"]],
  ["Dairy", ["butter","milk","cream","cheese","yogurt","yoghurt","egg","mozzarella","parmesan","cheddar","feta","ricotta"]],
  ["Pantry", ["flour","sugar","salt","pepper","oil","rice","pasta","noodle","stock","broth","soy","vinegar","sauce","miso","honey","spice","cumin","paprika","oregano","cinnamon","vanilla","baking","yeast","bean","lentil","chickpea","can ","canned","tomato paste","sesame","cornstarch","syrup","oats","bread crumb","panko","wine","mirin","sake","tahini","peanut","nut","seed"]],
];
export function categorizeIngredient(item: string): string {
  const t = item.toLowerCase();
  for (const [cat, words] of CAT_WORDS) {
    for (const w of words) { if (t.includes(w)) return cat; }
  }
  return "Other";
}
