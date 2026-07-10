import Link from "next/link";
import { signOut } from "@/app/actions";
import { Icon } from "./icons";
import { bearLogo } from "@/lib/illustrations";

export function Header({ active }: { active?: "recipes" | "shopping" }) {
  return (
    <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-tomato">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
        <Link href="/" className="flex items-center gap-3 text-cream">
          <span
            className="grid h-[52px] w-[52px] flex-none place-items-center rounded-[14px] border-2 border-ink bg-cream shadow-cardxs"
            dangerouslySetInnerHTML={{ __html: bearLogo(42) }}
          />
          <span className="font-hand text-[26px] leading-none tracking-wide">Gabby&apos;s Cookbook</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-xl border-2 border-ink/40 bg-cream/15 p-1 sm:flex">
          <Link
            href="/"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold ${active === "recipes" ? "bg-cream text-tomatodeep" : "text-cream hover:bg-cream/15"}`}
          >
            <Icon.Book /> Recipes
          </Link>
          <Link
            href="/shopping"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold ${active === "shopping" ? "bg-cream text-tomatodeep" : "text-cream hover:bg-cream/15"}`}
          >
            <Icon.Cart /> Shopping list
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/new" className="btn-plain hidden sm:inline-flex"><Icon.Plus /> Add recipe</Link>
          <Link href="/new" className="icon-btn sm:hidden" aria-label="Add recipe"><Icon.Plus /></Link>
          <form action={signOut}>
            <button className="icon-btn" aria-label="Sign out" title="Sign out"><Icon.Logout /></button>
          </form>
        </div>
      </div>

      {/* mobile nav */}
      <div className="flex border-t-2 border-ink/30 sm:hidden">
        <Link href="/" className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-bold ${active === "recipes" ? "bg-cream text-tomatodeep" : "text-cream"}`}><Icon.Book /> Recipes</Link>
        <Link href="/shopping" className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-bold ${active === "shopping" ? "bg-cream text-tomatodeep" : "text-cream"}`}><Icon.Cart /> Shopping</Link>
      </div>
    </header>
  );
}
