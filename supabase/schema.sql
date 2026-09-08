-- Whiskerfield social network schema.
-- Run against the intended Supabase project, then verify the checks at the end.
-- All browser access uses the publishable key plus Auth and RLS; never use a
-- service_role or secret key in the GitHub Pages site.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text not null unique
    check (handle = lower(handle) and handle ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null check (char_length(display_name) between 2 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'cancelled')),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.profiles (id) on delete cascade,
  topic text not null default 'cat_life'
    check (topic in ('cat_life', 'care', 'introductions', 'home')),
  body text not null check (char_length(body) between 1 and 1000),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.community_comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.community_posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create table if not exists public.member_resources (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  kind text not null check (kind in ('guide', 'notes', 'good_things')),
  title text not null check (char_length(title) between 3 and 120),
  summary text not null check (char_length(summary) between 3 and 280),
  body text not null check (char_length(body) between 3 and 8000),
  published_at timestamptz not null default now()
);

-- Index the foreign keys and public-feed access patterns.
create index if not exists community_posts_author_id_idx
  on public.community_posts (author_id);
create index if not exists community_posts_public_feed_idx
  on public.community_posts (created_at desc, id desc) where is_published;
create index if not exists community_comments_post_id_idx
  on public.community_comments (post_id, created_at asc);

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.member_resources enable row level security;

-- Explicit, least-privilege Data API grants.
revoke all on table public.profiles, public.memberships, public.community_posts,
  public.community_comments, public.member_resources from anon, authenticated;

grant select on table public.profiles to anon, authenticated;
grant insert, update on table public.profiles to authenticated;

grant select, insert, update on table public.memberships to authenticated;

grant select on table public.community_posts to anon, authenticated;
grant insert, delete on table public.community_posts to authenticated;

grant select on table public.community_comments to anon, authenticated;
grant insert, delete on table public.community_comments to authenticated;

grant select on table public.member_resources to authenticated;

-- RLS Policies
drop policy if exists "public profiles are readable" on public.profiles;
create policy "public profiles are readable"
  on public.profiles for select to anon, authenticated using (true);

drop policy if exists "members create own profile" on public.profiles;
create policy "members create own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "members update own profile" on public.profiles;
create policy "members update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "members see own membership" on public.memberships;
create policy "members see own membership"
  on public.memberships for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "members join for themselves" on public.memberships;
create policy "members join for themselves"
  on public.memberships for insert to authenticated
  with check ((select auth.uid()) = user_id and status = 'active');

drop policy if exists "members update own membership" on public.memberships;
create policy "members update own membership"
  on public.memberships for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "public feed shows published posts" on public.community_posts;
create policy "public feed shows published posts"
  on public.community_posts for select to anon, authenticated
  using (is_published);

drop policy if exists "members publish their own posts" on public.community_posts;
create policy "members publish their own posts"
  on public.community_posts for insert to authenticated
  with check ((select auth.uid()) = author_id and is_published);

drop policy if exists "members delete their own posts" on public.community_posts;
create policy "members delete their own posts"
  on public.community_posts for delete to authenticated
  using ((select auth.uid()) = author_id);

drop policy if exists "public comments are readable" on public.community_comments;
create policy "public comments are readable"
  on public.community_comments for select to anon, authenticated
  using (true);

drop policy if exists "members publish comments" on public.community_comments;
create policy "members publish comments"
  on public.community_comments for insert to authenticated
  with check ((select auth.uid()) = author_id);

drop policy if exists "members delete own comments" on public.community_comments;
create policy "members delete own comments"
  on public.community_comments for delete to authenticated
  using ((select auth.uid()) = author_id);

drop policy if exists "active members read the shelf" on public.member_resources;
create policy "active members read the shelf"
  on public.member_resources for select to authenticated
  using (
    exists (
      select 1
      from public.memberships
      where memberships.user_id = (select auth.uid())
        and memberships.status = 'active'
    )
  );

-- Starter material lives in the protected table, not in the public JavaScript bundle.
insert into public.member_resources (slug, kind, title, summary, body)
values
  ('fifteen-minute-home-reset', 'guide', 'The 15-minute home reset',
   'A tiny room-by-room routine for calmer cat evenings.',
   'Start with the room your cat chooses most. Refresh water, scoop the box, clear one walking path, and put one comfort object back where it belongs. Finish by sitting down for two quiet minutes. The point is not a perfect home; it is a predictable one.'),
  ('vet-visit-observation-log', 'notes', 'What to notice before the next vet visit',
   'A light-touch observation log for everyday changes.',
   'For three days, note appetite, water, litter-box habits, energy, grooming, and any change in routine. Bring the pattern, not just the worry. A few concrete notes give a veterinarian a much clearer starting point.'),
  ('two-useful-things', 'good_things', 'This month’s two genuinely useful finds',
   'Small improvements chosen for a cat and their human.',
   'Look for the object that removes one daily point of friction: a washable feeding mat, a stable scratcher, a carrier that stays open in the room. Useful is more valuable than novel, especially in a cat home.')
on conflict (slug) do update set
  kind = excluded.kind,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body;
