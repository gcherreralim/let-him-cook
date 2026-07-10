export type SourceType = "manual" | "youtube" | "instagram" | "web";

export interface Ingredient {
  id?: string;
  recipe_id?: string;
  position: number;
  amount: string;
  unit: string;
  item: string;
  group_name: string;
}

export interface Step {
  id?: string;
  recipe_id?: string;
  position: number;
  body: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  note: string;
  collection: string;
  source_url: string | null;
  source_type: SourceType;
  servings: number;
  prep_minutes: number | null;
  cook_minutes: number | null;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingItem {
  id: string;
  user_id: string;
  item: string;
  qty: string;
  category: string;
  from_recipe: string;
  done: boolean;
  created_at: string;
}

export interface ParsedRecipe {
  title: string;
  description: string;
  image_url?: string | null;
  servings: number;
  prep_minutes: number | null;
  cook_minutes: number | null;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  source_url: string | null;
  source_type: SourceType;
}

export const CAT_ORDER = ["Produce", "Meat & Fish", "Dairy", "Pantry", "Other"] as const;
