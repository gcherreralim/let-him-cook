import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { ShoppingList } from "@/components/ShoppingList";
import type { ShoppingItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ShoppingPage() {
  const supabase = createClient();
  const { data } = await supabase.from("shopping_items").select("*").order("created_at");
  return (
    <div className="min-h-dvh">
      <Header active="shopping" />
      <main className="mx-auto max-w-4xl px-5 py-7">
        <ShoppingList items={(data || []) as ShoppingItem[]} />
      </main>
    </div>
  );
}
