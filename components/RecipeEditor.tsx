"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import type { Ingredient, ParsedRecipe, Step } from "@/lib/types";
import { saveRecipe, type RecipeInput } from "@/app/actions";
import { Icon } from "./icons";
import { ILLO, ILLO_LABEL, matchIllustration } from "@/lib/illustrations";

let uid = 0;
const key = () => `k${uid++}`;
type IngRow = Ingredient & { _k: string };
type StepRow = Step & { _k: string };
const toIngRows = (l: Ingredient[]): IngRow[] => l.map((i) => ({ ...i, _k: key() }));
const toStepRows = (l: Step[]): StepRow[] => l.map((s) => ({ ...s, _k: key() }));

export function RecipeEditor({
  initial, recipeId,
}: { initial: Partial<ParsedRecipe> & { note?: string; collection?: string }; recipeId?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [note, setNote] = useState(initial.note || "");
  const [collection, setCollection] = useState(initial.collection || "");
  const [sourceUrl, setSourceUrl] = useState(initial.source_url || "");
  const [sourceType, setSourceType] = useState(initial.source_type || "manual");
  const [servings, setServings] = useState(initial.servings || 2);
  const [prep, setPrep] = useState<number | "">(initial.prep_minutes ?? "");
  const [cook, setCook] = useState<number | "">(initial.cook_minutes ?? "");
  const [tags, setTags] = useState<string[]>(initial.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState<IngRow[]>(
    toIngRows(initial.ingredients?.length ? initial.ingredients : [{ position: 0, amount: "", unit: "", item: "", group_name: "" }])
  );
  const [steps, setSteps] = useState<StepRow[]>(
    toStepRows(initial.steps?.length ? initial.steps : [{ position: 0, body: "" }])
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // import bar state
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<{ type: "err" | "ok"; text: string } | null>(null);
  const importRef = useRef<HTMLDivElement>(null);

  const illoKey = matchIllustration(title, tags);

  async function runImport() {
    setImportMsg(null);
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      setImportMsg({ type: "err", text: "Paste a full link starting with http:// or https://" });
      return;
    }
    setImporting(true);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) { setImportMsg({ type: "err", text: data.error || "Couldn't read that link." }); return; }
      const p = data.recipe as ParsedRecipe;
      setTitle(p.title || "");
      setDescription(p.description || "");
      setSourceUrl(p.source_url || "");
      setSourceType(p.source_type || "web");
      setServings(p.servings || 2);
      setPrep(p.prep_minutes ?? "");
      setCook(p.cook_minutes ?? "");
      setTags(p.tags || []);
      setIngredients(toIngRows(p.ingredients?.length ? p.ingredients : [{ position: 0, amount: "", unit: "", item: "", group_name: "" }]));
      setSteps(toStepRows(p.steps?.length ? p.steps : [{ position: 0, body: "" }]));
      setImportMsg({ type: "ok", text: `✨ Found ${p.ingredients?.length || 0} ingredients and ${p.steps?.length || 0} steps — filled in below. Edit anything, then save.` });
    } catch {
      setImportMsg({ type: "err", text: "Network hiccup — check the link and try again." });
    } finally {
      setImporting(false);
    }
  }

  function updateIng(k: string, patch: Partial<Ingredient>) {
    setIngredients((rows) => rows.map((r) => (r._k === k ? { ...r, ...patch } : r)));
  }
  function updateStep(k: string, body: string) {
    setSteps((rows) => rows.map((r) => (r._k === k ? { ...r, body } : r)));
  }
  function commitTag() {
    const t = tagInput.trim().replace(/,$/, "");
    if (t && !tags.includes(t)) setTags((x) => [...x, t]);
    setTagInput("");
  }

  async function onSave() {
    setError(null);
    if (!title.trim()) {
      setError("Give your recipe a name.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    const payload: RecipeInput = {
      id: recipeId, title, description, note, collection,
      source_url: sourceUrl || null,
      source_type: sourceType as ParsedRecipe["source_type"],
      servings: Number(servings) || 1,
      prep_minutes: prep === "" ? null : Number(prep),
      cook_minutes: cook === "" ? null : Number(cook),
      tags,
      ingredients: ingredients.map((r, i) => ({ ...r, position: i })),
      steps: steps.map((r, i) => ({ ...r, position: i })),
    };
    const res = await saveRecipe(payload);
    setSaving(false);
    if (res?.error) { setError(res.error); return; }
    router.push(`/recipe/${res.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-6">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={() => router.back()} className="btn-ghost -ml-2"><Icon.Back /> Back to the book</button>
        <button onClick={onSave} disabled={saving} className="btn-tomato">
          {saving ? "Saving…" : recipeId ? "Save changes" : "Save to my book"}
        </button>
      </div>

      {!recipeId && (
        <div ref={importRef} className="paper-card mb-6 bg-gradient-to-br from-paper2 to-mustard/10 p-5">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border-2 border-ink bg-mustard shadow-cardxs">
              <Icon.Sparkle width={22} height={22} />
            </span>
            <div>
              <p className="font-serif2 text-lg font-semibold">Import from a link</p>
              <p className="text-[13.5px] font-semibold leading-snug text-inksoft">
                Paste a YouTube video, Instagram reel, or any recipe page — we&apos;ll fill in the page for you.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Icon.Link className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !importing && runImport()}
                placeholder="https://…"
                className="field pl-10"
                disabled={importing}
                autoFocus={params.get("import") === "1"}
              />
            </div>
            <button onClick={runImport} disabled={importing || !url.trim()} className="btn-tomato shrink-0">
              {importing ? "Reading…" : <><Icon.Sparkle /> Import</>}
            </button>
          </div>
          {importMsg && (
            <p className={`mt-3 text-sm font-semibold ${importMsg.type === "err" ? "text-tomatodeep" : "text-sagedeep"}`}>{importMsg.text}</p>
          )}
          {!importMsg && (
            <p className="mt-3 text-xs font-semibold text-muted">
              Tip: works best on recipe blogs and videos where the recipe is written in the description.
            </p>
          )}
        </div>
      )}

      {error && <p className="mb-5 rounded-xl border-2 border-tomato bg-tomato/10 px-4 py-3 text-sm font-semibold text-tomatodeep">{error}</p>}

      <div className="paper-card p-6">
        {/* name + live illustration preview */}
        <div className="mb-4 flex items-end gap-4">
          <div className="flex-1">
            <label className="label" htmlFor="title">Recipe name</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Apple cinnamon cake…" className="field font-serif2 text-lg" />
          </div>
          <div className="flex flex-none flex-col items-center gap-1" title="Picked automatically from the name">
            <span
              className="block h-16 w-16 overflow-hidden rounded-[14px] border-[2.5px] border-ink bg-paper3 shadow-cardxs [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: ILLO[illoKey] }}
            />
            <span className="whitespace-nowrap font-serif2 text-[11px] font-semibold italic text-tomatodeep">
              {title.trim() ? `${ILLO_LABEL[illoKey]} ✨` : "picks itself ✨"}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="label" htmlFor="desc">A little description</label>
          <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="What makes this one special?" rows={2} className="field resize-y" />
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <div>
            <label className="label" htmlFor="servings">Servings</label>
            <input id="servings" type="number" min={1} value={servings}
              onChange={(e) => setServings(Number(e.target.value))} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="prep">Prep (min)</label>
            <input id="prep" type="number" min={0} value={prep}
              onChange={(e) => setPrep(e.target.value === "" ? "" : Number(e.target.value))} className="field" placeholder="—" />
          </div>
          <div>
            <label className="label" htmlFor="cook">Cook (min)</label>
            <input id="cook" type="number" min={0} value={cook}
              onChange={(e) => setCook(e.target.value === "" ? "" : Number(e.target.value))} className="field" placeholder="—" />
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Collection</label>
            <input value={collection} onChange={(e) => setCollection(e.target.value)}
              placeholder="Weeknight, Bakes, Sunday…" className="field" />
          </div>
          <div>
            <label className="label">Tags</label>
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border-2 border-ink bg-paper p-1.5">
              {tags.map((t) => (
                <span key={t} className="pill bg-paper2">
                  {t}
                  <button onClick={() => setTags((x) => x.filter((y) => y !== t))} aria-label={`Remove ${t}`} className="text-muted hover:text-tomato">
                    <Icon.X width={11} height={11} />
                  </button>
                </span>
              ))}
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commitTag(); } }}
                onBlur={commitTag}
                placeholder={tags.length ? "Add…" : "dinner, quick…"}
                className="min-w-[6rem] flex-1 bg-transparent px-1.5 py-1 text-sm font-semibold outline-none placeholder:text-muted" />
            </div>
          </div>
        </div>

        <hr className="stitch my-6" />

        {/* Ingredients */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif2 text-xl font-semibold">Ingredients</h2>
          <span className="text-xs font-bold text-muted">{ingredients.length}</span>
        </div>
        <div className="space-y-2">
          {ingredients.map((row) => (
            <div key={row._k} className="flex items-center gap-2">
              <input value={row.amount} onChange={(e) => updateIng(row._k, { amount: e.target.value })}
                placeholder="1" className="field w-16 !px-2 text-center text-sm" aria-label="Amount" />
              <input value={row.unit} onChange={(e) => updateIng(row._k, { unit: e.target.value })}
                placeholder="cup" className="field w-20 !px-2 text-center text-sm" aria-label="Unit" />
              <input value={row.item} onChange={(e) => updateIng(row._k, { item: e.target.value })}
                placeholder="ingredient" className="field flex-1 text-sm" aria-label="Ingredient" />
              <button onClick={() => setIngredients((rows) => rows.filter((r) => r._k !== row._k))}
                className="grid h-9 w-9 flex-none place-items-center rounded-xl border-2 border-line text-muted hover:border-tomato hover:text-tomato" aria-label="Remove ingredient">
                <Icon.Trash width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setIngredients((rows) => [...rows, { _k: key(), position: rows.length, amount: "", unit: "", item: "", group_name: "" }])}
          className="btn-plain mt-3 !py-2 text-xs"><Icon.Plus width={13} height={13} /> Add ingredient</button>

        <hr className="stitch my-6" />

        {/* Steps */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif2 text-xl font-semibold">Steps</h2>
          <span className="text-xs font-bold text-muted">{steps.length}</span>
        </div>
        <div className="space-y-2">
          {steps.map((row, i) => (
            <div key={row._k} className="flex items-start gap-3">
              <span className="mt-1 grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-ink bg-tomato font-serif2 text-[15px] font-semibold text-cream">{i + 1}</span>
              <textarea value={row.body} onChange={(e) => updateStep(row._k, e.target.value)}
                placeholder="Describe this step…" rows={2} className="field flex-1 resize-y text-sm" />
              <button onClick={() => setSteps((rows) => rows.filter((r) => r._k !== row._k))}
                className="mt-1 grid h-9 w-9 flex-none place-items-center rounded-xl border-2 border-line text-muted hover:border-tomato hover:text-tomato" aria-label="Remove step">
                <Icon.Trash width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setSteps((rows) => [...rows, { _k: key(), position: rows.length, body: "" }])}
          className="btn-plain mt-3 !py-2 text-xs"><Icon.Plus width={13} height={13} /> Add step</button>

        <hr className="stitch my-6" />

        <div className="mb-2">
          <label className="label">Gabby&apos;s note <span className="font-normal text-muted">(tips for future you)</span></label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Don't move the thighs while they sear…" rows={2} className="field resize-y" />
        </div>
      </div>

      <div className="sticky bottom-0 -mx-5 mt-8 border-t-2 border-line bg-paper/95 px-5 py-3 backdrop-blur sm:hidden">
        <button onClick={onSave} disabled={saving} className="btn-tomato w-full">
          {saving ? "Saving…" : recipeId ? "Save changes" : "Save to my book"}
        </button>
      </div>
    </div>
  );
}
