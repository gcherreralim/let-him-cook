import { Suspense } from "react";
import { Header } from "@/components/Header";
import { RecipeEditor } from "@/components/RecipeEditor";

export const dynamic = "force-dynamic";

export default function NewRecipePage() {
  return (
    <div className="min-h-dvh">
      <Header active="recipes" />
      <Suspense>
        <RecipeEditor initial={{ source_type: "manual" }} />
      </Suspense>
    </div>
  );
}
