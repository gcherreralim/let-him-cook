import Link from "next/link";
import { Icon } from "./icons";
import { bearLogo } from "@/lib/illustrations";

export function EmptyBook() {
  return (
    <div className="relative mx-auto mt-6 max-w-xl rounded-3xl border-[2.5px] border-ink bg-paper2 px-6 py-10 text-center shadow-card animate-rise">
      <div className="pointer-events-none absolute inset-2 rounded-2xl border-2 border-dashed border-line" />
      <div
        className="mx-auto mb-3 grid h-[130px] w-[130px] place-items-center rounded-full border-[2.5px] border-ink bg-cream shadow-cardsm [&>svg]:h-[104px] [&>svg]:w-[104px]"
        dangerouslySetInnerHTML={{ __html: bearLogo(104) }}
      />
      <p className="text-xs font-bold uppercase tracking-[2px] text-tomatodeep">Welcome, Gabby</p>
      <h1 className="mt-1 font-hand text-4xl leading-tight">Your cookbook is empty… for now</h1>
      <p className="mx-auto mt-3 max-w-md text-[15px] font-semibold leading-relaxed text-inksoft">
        Start it off by writing a recipe by hand, or paste a link from YouTube, an Instagram reel,
        or any recipe page and we&apos;ll fill the page in for you.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/new" className="btn-tomato px-5 py-3"><Icon.Plus /> Add your first recipe</Link>
        <Link href="/new?import=1" className="btn-sage px-5 py-3"><Icon.Link /> Import from a link</Link>
      </div>
      <p className="mt-7 font-hand text-lg text-tomatodeep">every good cook starts with page one</p>
    </div>
  );
}
