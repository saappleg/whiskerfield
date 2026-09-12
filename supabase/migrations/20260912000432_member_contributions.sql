-- Member-created editorial contributions.
-- Published rows are readable publicly; only the author can create/delete their own rows.

create table if not exists public.member_reviews (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.profiles (id) on delete cascade,
  product_name text not null check (char_length(product_name) between 2 and 120),
  product_category text not null default 'other'
    check (product_category in ('scratchers', 'carriers', 'feeding', 'litter', 'enrichment', 'home', 'other')),
  rating smallint not null check (rating between 1 and 5),
  title text not null check (char_length(title) between 3 and 120),
  body text not null check (char_length(body) between 20 and 2000),
  verdict text not null default 'mixed'
    check (verdict in ('recommend', 'mixed', 'skip')),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.member_stories (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 140),
  category text not null default 'cat_life'
    check (category in ('cat_life', 'care', 'home', 'adoption', 'rescue', 'other')),
  body text not null check (char_length(body) between 40 and 5000),
  submitted_for_feature boolean not null default false,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists member_reviews_public_feed_idx
  on public.member_reviews (created_at desc, id desc) where is_published;
create index if not exists member_stories_public_feed_idx
  on public.member_stories (is_featured desc, created_at desc, id desc) where is_published;

alter table public.member_reviews enable row level security;
alter table public.member_stories enable row level security;

revoke all on table public.member_reviews, public.member_stories from anon, authenticated;
grant select on table public.member_reviews, public.member_stories to anon, authenticated;
grant insert, delete on table public.member_reviews, public.member_stories to authenticated;

drop policy if exists "published member reviews are readable" on public.member_reviews;
create policy "published member reviews are readable"
  on public.member_reviews for select to anon, authenticated
  using (is_published);

drop policy if exists "members publish their own reviews" on public.member_reviews;
create policy "members publish their own reviews"
  on public.member_reviews for insert to authenticated
  with check ((select auth.uid()) = author_id and is_published);

drop policy if exists "members delete their own reviews" on public.member_reviews;
create policy "members delete their own reviews"
  on public.member_reviews for delete to authenticated
  using ((select auth.uid()) = author_id);

drop policy if exists "published member stories are readable" on public.member_stories;
create policy "published member stories are readable"
  on public.member_stories for select to anon, authenticated
  using (is_published);

drop policy if exists "members publish their own stories" on public.member_stories;
create policy "members publish their own stories"
  on public.member_stories for insert to authenticated
  with check ((select auth.uid()) = author_id and is_published and not is_featured);

drop policy if exists "members delete their own stories" on public.member_stories;
create policy "members delete their own stories"
  on public.member_stories for delete to authenticated
  using ((select auth.uid()) = author_id);

do $$
begin
  alter publication supabase_realtime add table public.member_reviews;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.member_stories;
exception when others then null;
end $$;
