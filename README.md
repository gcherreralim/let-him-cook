# 🐻 Gabby's Cookbook

Your personal illustrated recipe book. Write recipes by hand or paste a link from
YouTube, an Instagram reel, or any recipe site — the app pulls out the full
ingredient list and steps for you to edit. Every recipe gets a hand-drawn
illustration picked automatically from its title. Includes a serving scaler,
aisle-sorted shopping list, collections, notes, and a full-screen cook mode with
timers and keep-screen-awake.

**Stack:** Next.js 14 (App Router) · Supabase (Postgres + Auth + RLS) · Tailwind · Vercel

---

## Status: database is already set up ✅

The Supabase side is done — the cookbook tables (`recipes`, `ingredients`,
`steps`, `shopping_items`) were created in the **FIXIT_FELIX** project
(`lzfjovczaixzczzfmiyf`) with row-level security enabled, isolated from the
finance tables. `.env.production` in this repo already contains the correct
`NEXT_PUBLIC_SUPABASE_URL` and anon key, so the app connects out of the box.

## Deploy: GitHub → Vercel (~5 minutes)

1. **Push to GitHub**
   ```bash
   cd gabbys-cookbook
   git init && git add -A && git commit -m "Gabby's Cookbook"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. **Import into Vercel** — vercel.com → Add New → Project → pick the repo.
   Framework auto-detects as Next.js. No build settings needed.
3. **(Optional) AI import for videos/reels** — add `ANTHROPIC_API_KEY` under
   Project → Settings → Environment Variables. Without it, link import still
   works for any site publishing structured recipe data (most recipe blogs);
   the AI key adds extraction from YouTube descriptions, Instagram captions,
   and messy pages. **Never commit this key to the repo.**
4. **Deploy**, then copy your Vercel URL.

## After deploying: 2 Supabase settings

In the Supabase dashboard for FIXIT_FELIX (`lzfjovczaixzczzfmiyf`):

1. **Authentication → URL Configuration** — set **Site URL** to your Vercel URL
   and add it to **Redirect URLs** (so email-confirmation links land correctly).
2. **Authentication → Providers → Email** — optionally turn **Confirm email**
   off if you want to sign up without the confirmation-email step.

Then open the site, create your account, and add your first recipe.

## Local development

```bash
npm install
cp .env.production .env.local   # already has the right values
npm run dev                     # http://localhost:3000
```

## Features map

| Feature | Where |
|---|---|
| Add/edit recipes (ingredients, steps, servings, tags, collection, note) | `/new`, `/recipe/[id]/edit` |
| Link import (JSON-LD → oEmbed/caption → AI fallback) | import bar on `/new`, API at `app/api/parse` |
| Auto-picked illustrations (24 scenes + matcher) | `lib/illustrations.ts` |
| Serving scaler with fraction math | recipe page |
| Shopping list: per-aisle grouping, add-from-recipe, manual add, clear checked | `/shopping` |
| Cook mode: step-by-step, auto-detected timers, wake lock | recipe page → Cook mode |
| Search, favorites, collections | home |

## Notes & limits

- **Video/reel imports** depend on the creator writing the recipe in the
  description/caption — platforms don't expose transcripts via a simple public
  API. Recipe websites import near-perfectly via structured data.
- **Illustrations** are matched from the title/tags at render time (dish-format
  words like "soup"/"curry" win over ingredient words like "chicken"), with a
  cozy pot as the fallback. Tune keyword lists in `lib/illustrations.ts`.
- The anon key in `.env.production` is safe to commit — Supabase anon keys are
  public by design; data protection comes from row-level security.

## ⚠️ Outstanding security item (FIXIT_FELIX finance tables)

The cookbook tables are locked down per-user, but the pre-existing finance
tables (`transactions`, `categories`, `budgets`, `recurring`, `pending`) have
**RLS disabled** — anyone with the project's anon key (which is public once any
app using it is deployed) can read/write them. When you have a moment, either
add RLS policies matched to how FIXIT_FELIX authenticates, or at minimum be
aware of the exposure. Enabling RLS without policies will block the FIXIT_FELIX
app, so don't run it blindly:

```sql
alter table public.transactions enable row level security;
alter table public.categories  enable row level security;
alter table public.budgets     enable row level security;
alter table public.recurring   enable row level security;
alter table public.pending     enable row level security;
-- then add policies that fit how FIXIT_FELIX signs in
```
