"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Ingredient, ParsedRecipe, Step } from "@/lib/types";

export interface RecipeInput {
  id?: string;
  title: string;
  description: string;
  note: string;
  collection: string;
  source_url: string | null;
  source_type: ParsedRecipe["source_type"];
  servings: number;
  prep_minutes: number | null;
  cook_minutes: number | null;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
}

export async function saveRecipe(input: RecipeInput) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };
  if (!input.title.trim()) return { error: "Give your recipe a name." };

  const row = {
    user_id: user.id,
    title: input.title.trim(),
    description: input.description ?? "",
    note: input.note ?? "",
    collection: (input.collection ?? "").trim(),
    source_url: input.source_url,
    source_type: input.source_type,
    servings: input.servings || 1,
    prep_minutes: input.prep_minutes,
    cook_minutes: input.cook_minutes,
    tags: input.tags,
  };

  let recipeId = input.id;
  if (recipeId) {
    const { error } = await supabase.from("recipes").update(row).eq("id", recipeId).eq("user_id", user.id);
    if (error) return { error: error.message };
    await supabase.from("ingredients").delete().eq("recipe_id", recipeId);
    await supabase.from("steps").delete().eq("recipe_id", recipeId);
  } else {
    const { data, error } = await supabase.from("recipes").insert(row).select("id").single();
    if (error || !data) return { error: error?.message || "Could not save." };
    recipeId = data.id;
  }

  const ingredients = input.ingredients
    .filter((i) => i.item.trim())
    .map((i, idx) => ({
      recipe_id: recipeId, position: idx,
      amount: i.amount ?? "", unit: i.unit ?? "",
      item: i.item.trim(), group_name: i.group_name ?? "",
    }));
  const steps = input.steps
    .filter((s) => s.body.trim())
    .map((s, idx) => ({ recipe_id: recipeId, position: idx, body: s.body.trim() }));

  if (ingredients.length) {
    const { error } = await supabase.from("ingredients").insert(ingredients);
    if (error) return { error: error.message };
  }
  if (steps.length) {
    const { error } = await supabase.from("steps").insert(steps);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/recipe/${recipeId}`);
  return { id: recipeId };
}

export async function deleteRecipe(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };
  const { error } = await supabase.from("recipes").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/");
  redirect("/");
}

export async function toggleFavorite(id: string, value: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };
  const { error } = await supabase.from("recipes").update({ is_favorite: value }).eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath(`/recipe/${id}`);
  return { ok: true };
}

export async function saveNote(id: string, note: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };
  const { error } = await supabase.from("recipes").update({ note }).eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath(`/recipe/${id}`);
  return { ok: true };
}

// ---- shopping list ----

export interface ShoppingAdd { item: string; qty: string; category: string; from_recipe: string; }

export async function addShoppingItems(items: ShoppingAdd[]) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };
  const rows = items
    .filter((x) => x.item.trim())
    .map((x) => ({
      user_id: user.id, item: x.item.trim(), qty: x.qty ?? "",
      category: x.category || "Other", from_recipe: x.from_recipe ?? "",
    }));
  if (!rows.length) return { ok: true, added: 0 };
  const { error } = await supabase.from("shopping_items").insert(rows);
  if (error) return { error: error.message };
  revalidatePath("/shopping");
  return { ok: true, added: rows.length };
}

export async function toggleShoppingItem(id: string, done: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };
  const { error } = await supabase.from("shopping_items").update({ done }).eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/shopping");
  return { ok: true };
}

export async function clearDoneShopping() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };
  const { error } = await supabase.from("shopping_items").delete().eq("user_id", user.id).eq("done", true);
  if (error) return { error: error.message };
  revalidatePath("/shopping");
  return { ok: true };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
