import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { RecipeEditor } from "@/components/RecipeEditor";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Ingredient, Recipe, Step } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", params.id).single();
  if (!recipe) notFound();

  const [{ data: ingredients }, { data: steps }] = await Promise.all([
    supabase.from("ingredients").select("*").eq("recipe_id", params.id).order("position"),
    supabase.from("steps").select("*").eq("recipe_id", params.id).order("position"),
  ]);

  const r = recipe as Recipe;
  return (
    <div className="min-h-dvh">
      <Header active="recipes" />
      <Suspense>
        <RecipeEditor
          recipeId={r.id}
          initial={{
            title: r.title, description: r.description, note: r.note, collection: r.collection,
            source_url: r.source_url, source_type: r.source_type,
            servings: r.servings, prep_minutes: r.prep_minutes, cook_minutes: r.cook_minutes,
            tags: r.tags,
            ingredients: (ingredients || []) as Ingredient[],
            steps: (steps || []) as Step[],
          }}
        />
      </Suspense>
    </div>
  );
}
