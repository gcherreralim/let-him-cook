"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Ingredient, Recipe, Step } from "@/lib/types";
import { Icon } from "./icons";
import { cx, fmtMinutes, sourceLabel, scaleAmount, totalTime, detectTimerMinutes, categorizeIngredient } from "@/lib/utils";
import { deleteRecipe, toggleFavorite, addShoppingItems } from "@/app/actions";
import { illoSvg } from "@/lib/illustrations";

export function RecipeView({ recipe, ingredients, steps }: { recipe: Recipe; ingredients: Ingredient[]; steps: Step[] }) {
  const [servings, setServings] = useState(recipe.servings || 1);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());
  const [fav, setFav] = useState(recipe.is_favorite);
  const [cookMode, setCookMode] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [listMsg, setListMsg] = useState<string | null>(null);
  const [addingList, setAddingList] = useState(false);

  const factor = (recipe.servings || 1) > 0 ? servings / (recipe.servings || 1) : 1;
  const t = totalTime(recipe.prep_minutes, recipe.cook_minutes);

  const groups = useMemo(() => {
    const map = new Map<string, Ingredient[]>();
    for (const ing of ingredients) {
      const g = ing.group_name || "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(ing);
    }
    return Array.from(map.entries());
  }, [ingredients]);

  function toggleCheck(id: string) {
    setChecked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function onFav() {
    setFav((v) => !v);
    await toggleFavorite(recipe.id, !fav);
  }

  async function addToList() {
    setAddingList(true);
    const items = ingredients
      .filter((ing) => !checked.has(ing.id || `${ing.position}`))
      .map((ing) => ({
        item: ing.item,
        qty: [scaleAmount(ing.amount, factor), ing.unit].filter(Boolean).join(" "),
        category: categorizeIngredient(ing.item),
        from_recipe: recipe.title,
      }));
    const res = await addShoppingItems(items);
    setAddingList(false);
    if ((res as any)?.error) setListMsg("Couldn't add — try again.");
    else {
      setListMsg(`Added ${(res as any).added} items to your list!`);
      setTimeout(() => setListMsg(null), 2500);
    }
  }

  if (cookMode) {
    return <CookMode recipe={recipe} steps={steps} onExit={() => setCookMode(false)} />;
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-6 animate-rise">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="btn-ghost -ml-2"><Icon.Back /> Back to the book</Link>
        <div className="flex items-center gap-2">
          <button onClick={onFav}
            className={cx("icon-btn", fav && "!border-tomato !bg-tomato/10 !text-tomato")}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}>
            <Icon.Heart filled={fav} />
          </button>
          <button onClick={() => window.print()} className="icon-btn" aria-label="Print"><Icon.Print /></button>
          <Link href={`/recipe/${recipe.id}/edit`} className="btn-plain"><Icon.Edit /> Edit</Link>
          <div className="relative">
            <button onClick={() => setConfirmDel((v) => !v)} className="icon-btn hover:!border-tomato hover:!text-tomato" aria-label="Delete recipe">
              <Icon.Trash />
            </button>
            {confirmDel && (
              <div className="absolute right-0 top-12 z-20 w-56 rounded-xl border-2 border-ink bg-paper2 p-3 shadow-card">
                <p className="text-sm font-bold">Tear this page out?</p>
                <p className="mb-2 text-xs font-semibold text-inksoft">This can&apos;t be undone.</p>
                <div className="flex gap-2">
                  <button onClick={() => deleteRecipe(recipe.id)} className="btn flex-1 bg-tomato py-1.5 text-xs text-cream shadow-cardxs">Delete</button>
                  <button onClick={() => setConfirmDel(false)} className="btn-plain flex-1 !py-1.5 text-xs">Keep it</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* title plate */}
      <div className="paper-card mb-6 flex flex-col overflow-hidden sm:flex-row">
        <div className="h-[160px] flex-none border-b-[2.5px] border-ink sm:h-auto sm:w-[270px] sm:border-b-0 sm:border-r-[2.5px] [&>svg]:h-full [&>svg]:min-h-[160px] [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: illoSvg(recipe.title, recipe.tags) }} />
        <div className="flex-1 p-6">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="pill">{sourceLabel(recipe.source_type)}</span>
            {recipe.collection && <span className="pill !bg-mustard">{recipe.collection}</span>}
            {recipe.tags?.map((tag) => <span key={tag} className="pill">{tag}</span>)}
          </div>
          <h1 className="font-serif2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{recipe.title}</h1>
          {recipe.description && <p className="mt-2 text-[15px] font-medium leading-relaxed text-inksoft">{recipe.description}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-6">
            {recipe.prep_minutes ? (
              <div className="text-center leading-none">
                <span className="block font-serif2 text-3xl font-semibold text-tomatodeep">{recipe.prep_minutes}</span>
                <small className="text-[10px] font-bold uppercase tracking-wide text-muted">prep min</small>
              </div>) : null}
            {recipe.cook_minutes ? (
              <div className="text-center leading-none">
                <span className="block font-serif2 text-3xl font-semibold text-tomatodeep">{recipe.cook_minutes}</span>
                <small className="text-[10px] font-bold uppercase tracking-wide text-muted">cook min</small>
              </div>) : null}
            {t ? (
              <div className="text-center leading-none">
                <span className="block font-serif2 text-3xl font-semibold text-tomatodeep">{t}</span>
                <small className="text-[10px] font-bold uppercase tracking-wide text-muted">total min</small>
              </div>) : null}
            {recipe.source_url && (
              <a href={recipe.source_url} target="_blank" rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-line px-2.5 py-1.5 text-[13px] font-bold text-sagedeep hover:border-sage">
                <Icon.Link /> original
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        {/* Ingredients */}
        <div>
          <section className="paper-card p-5">
            <div className="mb-1 flex items-center justify-between gap-3">
              <h2 className="font-serif2 text-2xl font-semibold">Ingredients</h2>
              <div className="flex items-center gap-1 rounded-[14px] border-2 border-ink bg-paper3 p-1">
                <button onClick={() => setServings((s) => Math.max(1, s - 1))}
                  className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-paper2 hover:bg-cream active:translate-y-px" aria-label="Fewer servings">−</button>
                <div className="min-w-[52px] text-center leading-none">
                  <span className="block font-serif2 text-2xl font-semibold text-tomatodeep">{servings}</span>
                  <small className="text-[9px] font-bold uppercase text-muted">servings</small>
                </div>
                <button onClick={() => setServings((s) => s + 1)}
                  className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-paper2 hover:bg-cream active:translate-y-px" aria-label="More servings">+</button>
              </div>
            </div>
            {servings !== recipe.servings && (
              <button onClick={() => setServings(recipe.servings)} className="mb-1 rounded-lg border-2 border-dashed border-line px-2 py-1 text-xs font-bold text-sagedeep hover:border-sage">
                ↺ reset to original {recipe.servings}
              </button>
            )}
            <hr className="stitch my-3" />
            <ul>
              {groups.map(([group, items], gi) => (
                <li key={gi}>
                  {group && <p className="mb-1 mt-4 font-serif2 text-[15px] font-semibold italic text-tomatodeep first:mt-0">{group}</p>}
                  <ul>
                    {items.map((ing) => {
                      const id = ing.id || `${gi}-${ing.position}`;
                      const on = checked.has(id);
                      const amt = scaleAmount(ing.amount, factor);
                      const q = [amt, ing.unit].filter(Boolean).join(" ");
                      return (
                        <li key={id}>
                          <button onClick={() => toggleCheck(id)}
                            className="flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left text-[15px] font-semibold hover:bg-cream">
                            <span className={cx("mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md border-2 transition",
                              on ? "-rotate-3 border-sage bg-sage text-cream" : "border-ink bg-paper")}>
                              {on && <Icon.Check width={11} height={11} />}
                            </span>
                            <span className={cx(on && "text-muted line-through")}>
                              {q && <b className={on ? "" : "text-tomatodeep"}>{q} </b>}
                              {ing.item}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
              {ingredients.length === 0 && <li className="text-sm font-semibold text-muted">No ingredients listed.</li>}
            </ul>
            {ingredients.length > 0 && (
              <>
                <hr className="stitch my-4" />
                <button onClick={addToList} disabled={addingList} className="btn-sage w-full">
                  <Icon.Cart /> {addingList ? "Adding…" : listMsg || "Add these to shopping list"}
                </button>
                <p className="mt-2 text-center text-[11px] font-semibold text-muted">Unchecked items go to the list, sorted by aisle.</p>
              </>
            )}
          </section>

          {recipe.note && (
            <section className="relative mt-5 rounded-card border-[2.5px] border-ink p-5 shadow-card"
              style={{ background: "repeating-linear-gradient(#FEFAF2,#FEFAF2 30px,#f0e3c8 30px,#f0e3c8 32px)" }}>
              <span className="pointer-events-none absolute bottom-0 left-6 top-0 w-0.5 bg-tomato/30" />
              <div className="mb-1 flex items-center gap-2 text-mustarddeep">
                <Icon.Bulb /><span className="font-hand text-xl text-ink">Gabby&apos;s note</span>
              </div>
              <p className="pl-3 text-[14.5px] font-semibold leading-[32px] text-inksoft">{recipe.note}</p>
            </section>
          )}
        </div>

        {/* Steps */}
        <section className="paper-card p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-serif2 text-2xl font-semibold">How to make it</h2>
            {steps.length > 0 && (
              <button onClick={() => setCookMode(true)} className="btn-tomato !py-2 text-xs"><Icon.Timer /> Cook mode</button>
            )}
          </div>
          <hr className="stitch my-3" />
          <ol className="space-y-4">
            {steps.map((step, i) => {
              const on = doneSteps.has(i);
              const timer = detectTimerMinutes(step.body);
              return (
                <li key={step.id || i} className="flex gap-3.5">
                  <button
                    onClick={() => setDoneSteps((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                    className={cx("grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-ink font-serif2 text-[15px] font-semibold text-cream shadow-cardxs transition hover:-translate-y-px",
                      on ? "bg-sage" : "bg-tomato")}
                    aria-label={`Mark step ${i + 1}`}>
                    {on ? <Icon.Check /> : i + 1}
                  </button>
                  <div className="pt-1">
                    <p className={cx("text-[15px] font-medium leading-relaxed", on && "text-muted line-through")}>{step.body}</p>
                    {timer && (
                      <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border-2 border-line bg-paper3 px-2 py-0.5 text-xs font-bold text-mustarddeep">
                        <Icon.Timer /> {timer} min
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
            {steps.length === 0 && <li className="text-sm font-semibold text-muted">No steps listed.</li>}
          </ol>
          <p className="mt-8 text-center font-hand text-2xl text-tomatodeep">Buon appetito!</p>
        </section>
      </div>
    </main>
  );
}

// ============ Cook mode ============
function CookMode({ recipe, steps, onExit }: { recipe: Recipe; steps: Step[]; onExit: () => void }) {
  const [i, setI] = useState(0);
  const [wakeOn, setWakeOn] = useState(false);
  const [timerLeft, setTimerLeft] = useState<number | null>(null);
  const wakeRef = useRef<any>(null);
  const intRef = useRef<any>(null);

  const step = steps[i];
  const n = steps.length;
  const atEnd = i === n - 1;
  const timerMin = step ? detectTimerMinutes(step.body) : null;

  // wake lock
  async function toggleWake() {
    try {
      if (wakeOn) {
        await wakeRef.current?.release();
        wakeRef.current = null;
        setWakeOn(false);
      } else if ("wakeLock" in navigator) {
        wakeRef.current = await (navigator as any).wakeLock.request("screen");
        wakeRef.current.addEventListener?.("release", () => setWakeOn(false));
        setWakeOn(true);
      }
    } catch { /* not supported / denied */ }
  }
  useEffect(() => () => { wakeRef.current?.release?.(); clearInterval(intRef.current); }, []);

  // reset timer when step changes
  useEffect(() => { clearInterval(intRef.current); setTimerLeft(null); }, [i]);

  function startTimer(mins: number) {
    clearInterval(intRef.current);
    setTimerLeft(mins * 60);
    intRef.current = setInterval(() => {
      setTimerLeft((s) => {
        if (s == null) return s;
        if (s <= 1) { clearInterval(intRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink text-cream">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <p className="font-hand text-lg text-mustard">Now cooking</p>
          <p className="font-serif2 text-lg font-semibold leading-tight">{recipe.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleWake}
            className={cx("flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-bold transition",
              wakeOn ? "border-mustard bg-mustard text-ink" : "border-cream/30 text-cream hover:bg-cream/10")}>
            <Icon.Sun /> {wakeOn ? "Screen on" : "Keep screen on"}
          </button>
          <button onClick={onExit} className="grid h-11 w-11 place-items-center rounded-xl border-2 border-cream/25 bg-cream/10 hover:bg-cream/20" aria-label="Exit cook mode">
            <Icon.X />
          </button>
        </div>
      </div>

      <div className="mx-6 h-1.5 overflow-hidden rounded-full bg-cream/15">
        <div className="h-full rounded-full bg-mustard transition-all duration-300" style={{ width: `${((i + 1) / n) * 100}%` }} />
      </div>
      <div className="flex justify-center gap-2 py-4">
        {steps.map((_, di) => (
          <button key={di} onClick={() => setI(di)} aria-label={`Go to step ${di + 1}`}
            className={cx("h-2.5 w-2.5 rounded-full transition",
              di === i ? "scale-125 bg-mustard" : di < i ? "bg-sage" : "bg-cream/25")} />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-7 px-7 pb-8 text-center">
        <p className="font-serif2 text-xl font-semibold text-mustard">
          Step {i + 1} <span className="text-cream/45">of {n}</span>
        </p>
        <p className="max-w-xl font-serif2 text-2xl font-medium leading-relaxed sm:text-3xl">{step?.body}</p>
        {timerMin && (
          timerLeft == null ? (
            <button onClick={() => startTimer(timerMin)}
              className="inline-flex items-center gap-2 rounded-2xl border-[2.5px] border-cream bg-mustard px-5 py-3 font-bold text-ink shadow-[3px_3px_0_rgba(254,250,242,.3)] hover:brightness-105">
              <Icon.Timer /> Start {timerMin}:00 timer
            </button>
          ) : (
            <div className={cx("rounded-2xl border-[2.5px] px-6 py-3 font-serif2 text-3xl font-semibold",
              timerLeft === 0 ? "animate-pulse border-tomato bg-tomato text-cream" : "border-mustard text-mustard")}>
              {timerLeft === 0 ? "⏰ Time!" : fmt(timerLeft)}
            </div>
          )
        )}
      </div>

      <div className="flex gap-3 border-t-2 border-cream/15 px-6 py-4">
        <button onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}
          className="btn flex-1 justify-center border-cream/30 bg-transparent py-3.5 text-cream shadow-none hover:bg-cream/10 disabled:opacity-30">
          <Icon.Back /> Back
        </button>
        {atEnd ? (
          <button onClick={onExit} className="btn flex-1 justify-center border-ink bg-mustard py-3.5 font-bold text-ink shadow-[3px_3px_0_rgba(254,250,242,.3)]">
            <Icon.Check /> All done!
          </button>
        ) : (
          <button onClick={() => setI((x) => Math.min(n - 1, x + 1))}
            className="btn flex-1 justify-center border-ink bg-tomato py-3.5 text-cream shadow-[3px_3px_0_rgba(254,250,242,.3)] hover:bg-tomatodeep">
            Next step <Icon.ChevR />
          </button>
        )}
      </div>
    </div>
  );
}
