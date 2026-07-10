"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { ShoppingItem } from "@/lib/types";
import { CAT_ORDER } from "@/lib/types";
import { Icon } from "./icons";
import { cx, categorizeIngredient } from "@/lib/utils";
import { addShoppingItems, clearDoneShopping, toggleShoppingItem } from "@/app/actions";
import { useRouter } from "next/navigation";

const CAT_ICON: Record<string, string> = {
  Produce: "🥬", "Meat & Fish": "🐟", Dairy: "🧈", Pantry: "🫙", Other: "🧺",
};

export function ShoppingList({ items }: { items: ShoppingItem[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [manual, setManual] = useState("");
  const doneCt = items.filter((x) => x.done).length;

  const byCat: Record<string, ShoppingItem[]> = {};
  items.forEach((x) => {
    const c = (CAT_ORDER as readonly string[]).includes(x.category) ? x.category : "Other";
    (byCat[c] = byCat[c] || []).push(x);
  });

  function toggle(item: ShoppingItem) {
    start(async () => { await toggleShoppingItem(item.id, !item.done); router.refresh(); });
  }
  function clearDone() {
    start(async () => { await clearDoneShopping(); router.refresh(); });
  }
  function addManual() {
    const t = manual.trim();
    if (!t) return;
    setManual("");
    start(async () => {
      await addShoppingItems([{ item: t, qty: "", category: categorizeIngredient(t), from_recipe: "" }]);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[2px] text-tomatodeep">Off to the market</p>
          <h1 className="mt-1 font-serif2 text-3xl font-semibold tracking-tight sm:text-4xl">Shopping list</h1>
          <p className="mt-1 text-sm font-semibold text-inksoft">
            {items.length ? `${items.length} items · ${doneCt} in the basket.` : "Nothing on the list yet."}
          </p>
        </div>
        <span className="text-5xl">🧺</span>
      </div>

      {/* manual add */}
      <div className="mb-5 flex gap-2">
        <input value={manual} onChange={(e) => setManual(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addManual()}
          placeholder="Add something (milk, foil, coffee…)" className="field flex-1 shadow-cardxs" />
        <button onClick={addManual} disabled={pending || !manual.trim()} className="btn-tomato shrink-0"><Icon.Plus /> Add</button>
      </div>

      {items.length > 0 && (
        <div className="mb-6 flex items-center gap-3">
          <div className="h-3.5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper3">
            <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${items.length ? (doneCt / items.length) * 100 : 0}%` }} />
          </div>
          <button onClick={clearDone} disabled={pending || doneCt === 0} className="btn-plain !py-2 text-xs"><Icon.Check /> Clear checked</button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-line bg-paper2/60 px-6 py-14 text-center">
          <p className="text-5xl">🧺</p>
          <p className="mt-3 font-hand text-3xl">Your basket&apos;s empty!</p>
          <p className="mx-auto mt-2 max-w-sm text-sm font-semibold text-inksoft">
            Open a recipe and tap &quot;Add to shopping list&quot; — items land here, sorted by aisle. Or add staples above.
          </p>
          <Link href="/" className="btn-tomato mt-5"><Icon.Book /> Browse recipes</Link>
        </div>
      ) : (
        <div className="gap-5 sm:columns-2">
          {(CAT_ORDER as readonly string[]).filter((c) => byCat[c]).map((c) => (
            <section key={c} className="paper-card mb-5 break-inside-avoid p-4">
              <div className="mb-2 flex items-center gap-2.5 border-b-2 border-dashed border-line pb-2">
                <span className="text-xl">{CAT_ICON[c]}</span>
                <span className="font-serif2 text-lg font-semibold text-tomatodeep">{c}</span>
                <span className="ml-auto rounded-full border-2 border-line bg-paper3 px-2.5 py-0.5 text-xs font-bold text-muted">{byCat[c].length}</span>
              </div>
              {byCat[c].map((x) => (
                <button key={x.id} onClick={() => toggle(x)} disabled={pending}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-1.5 py-2 text-left hover:bg-cream", x.done && "opacity-70")}>
                  <span className={cx("grid h-5 w-5 flex-none place-items-center rounded-md border-2 transition",
                    x.done ? "-rotate-3 border-sage bg-sage text-cream" : "border-ink bg-paper")}>
                    {x.done && <Icon.Check width={11} height={11} />}
                  </span>
                  {x.qty && <span className={cx("min-w-[42px] text-sm font-bold", x.done ? "text-muted line-through" : "text-tomatodeep")}>{x.qty}</span>}
                  <span className={cx("flex-1 text-[14.5px] font-semibold", x.done && "text-muted line-through")}>{x.item}</span>
                  {x.from_recipe && <span className="text-[11px] font-semibold italic text-muted">{x.from_recipe}</span>}
                </button>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
