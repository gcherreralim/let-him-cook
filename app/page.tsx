import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { RecipeGrid } from "@/components/RecipeGrid";
import { EmptyBook } from "@/components/EmptyBook";
import type { Recipe } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("is_favorite", { ascending: false })
    .order("created_at", { ascending: false });

  const list = (recipes || []) as Recipe[];

  return (
    <div className="min-h-dvh">
      <Header active="recipes" />
      <main className="mx-auto max-w-5xl px-5 py-7">
        {list.length === 0 ? (
          <EmptyBook />
        ) : (
          <>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[2px] text-tomatodeep">Your recipe book</p>
              <h1 className="mt-1 font-serif2 text-3xl font-semibold tracking-tight sm:text-4xl">
                What are we cooking today?
              </h1>
              <p className="mt-1 text-sm font-semibold text-inksoft">
                {list.length} {list.length === 1 ? "recipe" : "recipes"} gathered — handwritten, and pulled from all over.
              </p>
            </div>
            <RecipeGrid recipes={list} />
          </>
        )}
      </main>
    </div>
  );
}
