-- ============================================================
-- Gabby's Cookbook — Supabase schema
-- ============================================================

create table if not exists public.recipes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  description   text default '',
  note          text default '',
  collection    text default '',
  source_url    text,
  source_type   text default 'manual',
  servings      integer default 2,
  prep_minutes  integer,
  cook_minutes  integer,
  tags          text[] default '{}',
  is_favorite   boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists public.ingredients (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references public.recipes (id) on delete cascade,
  position   integer not null default 0,
  amount     text default '',
  unit       text default '',
  item       text not null,
  group_name text default ''
);

create table if not exists public.steps (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references public.recipes (id) on delete cascade,
  position   integer not null default 0,
  body       text not null
);

create table if not exists public.shopping_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  item        text not null,
  qty         text default '',
  category    text default 'Other',
  from_recipe text default '',
  done        boolean default false,
  created_at  timestamptz default now()
);

create index if not exists idx_recipes_user on public.recipes (user_id, created_at desc);
create index if not exists idx_ingredients_recipe on public.ingredients (recipe_id, position);
create index if not exists idx_steps_recipe on public.steps (recipe_id, position);
create index if not exists idx_shopping_user on public.shopping_items (user_id, created_at);

create or replace function public.touch_updated_at()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_recipes_updated on public.recipes;
create trigger trg_recipes_updated
  before update on public.recipes
  for each row execute function public.touch_updated_at();

alter table public.recipes enable row level security;
alter table public.ingredients enable row level security;
alter table public.steps enable row level security;
alter table public.shopping_items enable row level security;

drop policy if exists "recipes_all" on public.recipes;
create policy "recipes_all" on public.recipes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ingredients_all" on public.ingredients;
create policy "ingredients_all" on public.ingredients
  for all using (
    exists (select 1 from public.recipes r where r.id = ingredients.recipe_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.recipes r where r.id = ingredients.recipe_id and r.user_id = auth.uid())
  );

drop policy if exists "steps_all" on public.steps;
create policy "steps_all" on public.steps
  for all using (
    exists (select 1 from public.recipes r where r.id = steps.recipe_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.recipes r where r.id = steps.recipe_id and r.user_id = auth.uid())
  );

drop policy if exists "shopping_all" on public.shopping_items;
create policy "shopping_all" on public.shopping_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
