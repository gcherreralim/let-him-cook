import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { notFound } from "next/navigation";
import type { Ingredient, Recipe, Step } from "@/lib/types";
import { RecipeView } from "@/components/RecipeView";

export const dynamic = "force-dynamic";

export default async function RecipePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", params.id).single();
  if (!recipe) notFound();

  const [{ data: ingredients }, { data: steps }] = await Promise.all([
    supabase.from("ingredients").select("*").eq("recipe_id", params.id).order("position"),
    supabase.from("steps").select("*").eq("recipe_id", params.id).order("position"),
  ]);

  return (
    <div className="min-h-dvh">
      <Header active="recipes" />
      <RecipeView
        recipe={recipe as Recipe}
        ingredients={(ingredients || []) as Ingredient[]}
        steps={(steps || []) as Step[]}
      />
    </div>
  );
}
