"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Recipe } from "@/lib/types";
import { Icon } from "./icons";
import { cx, fmtMinutes, sourceLabel, totalTime } from "@/lib/utils";
import { illoSvg } from "@/lib/illustrations";

const SRC_TONE: Record<string, string> = {
  youtube: "bg-tomato text-cream",
  instagram: "bg-plum text-cream",
  web: "bg-sage text-cream",
  manual: "bg-mustard text-ink",
};

function Card({ recipe }: { recipe: Recipe }) {
  const t = totalTime(recipe.prep_minutes, recipe.cook_minutes);
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-card border-[2.5px] border-ink bg-paper2 shadow-card transition duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-cardhover"
    >
      <div className="relative h-[150px] overflow-hidden border-b-[2.5px] border-ink [&>svg]:h-full [&>svg]:w-full">
        <span dangerouslySetInnerHTML={{ __html: illoSvg(recipe.title, recipe.tags) }} />
        <span className={cx("pill absolute left-3 top-3 text-[11px]", SRC_TONE[recipe.source_type] || SRC_TONE.manual)}>
          {sourceLabel(recipe.source_type)}
        </span>
        {recipe.is_favorite && (
          <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-cream text-tomato">
            <Icon.Heart filled width={14} height={14} />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif2 text-lg font-semibold leading-snug tracking-tight">{recipe.title}</h3>
        {recipe.description && (
          <p className="mt-1 line-clamp-2 text-[13.5px] font-medium leading-relaxed text-inksoft">{recipe.description}</p>
        )}
        <div className="mt-auto flex items-center gap-4 pt-3 text-xs font-bold text-inksoft">
          <span className="inline-flex items-center gap-1.5"><Icon.Users className="text-sagedeep" />{recipe.servings}</span>
          {t && <span className="inline-flex items-center gap-1.5"><Icon.Clock className="text-sagedeep" />{fmtMinutes(t)}</span>}
          <span className="ml-auto text-muted"><Icon.ChevR /></span>
        </div>
      </div>
    </Link>
  );
}

export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const [q, setQ] = useState("");
  const [coll, setColl] = useState<string>("All");
  const [favOnly, setFavOnly] = useState(false);

  const collections = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => r.collection && set.add(r.collection));
    return ["All", ...Array.from(set).sort()];
  }, [recipes]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return recipes.filter((r) => {
      if (favOnly && !r.is_favorite) return false;
      if (coll !== "All" && r.collection !== coll) return false;
      if (!needle) return true;
      return (
        r.title.toLowerCase().includes(needle) ||
        r.description?.toLowerCase().includes(needle) ||
        r.tags?.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [recipes, q, coll, favOnly]);

  return (
    <div>
      <div className="relative mb-4">
        <Icon.Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search recipes, tags…"
          className="field pl-11 shadow-cardsm"
          aria-label="Search recipes"
        />
      </div>

      <div className="mb-7 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFavOnly((v) => !v)}
          className={cx("pill px-3 py-1.5 shadow-cardxs transition", favOnly && "!bg-tomato !text-cream")}
        >
          <Icon.Heart filled={favOnly} width={12} height={12} /> Favorites
        </button>
        {collections.length > 1 && <span className="mx-1 h-5 w-0.5 bg-line" />}
        {collections.length > 1 && collections.map((c) => (
          <button
            key={c}
            onClick={() => setColl(c)}
            className={cx("pill px-3 py-1.5 shadow-cardxs transition", coll === c && "!bg-mustard")}
          >
            {c === "All" ? "📚 All" : c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-line bg-paper2/60 py-14 text-center">
          <p className="text-4xl">🍳</p>
          <p className="mt-2 font-hand text-2xl">Nothing matches that yet…</p>
          <p className="mt-1 text-sm font-semibold text-inksoft">Try another search or clear the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => <Card key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  );
}
