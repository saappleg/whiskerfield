-- Whiskerfield social network schema.
-- Run against the intended Supabase project, then verify the checks at the end.
-- All browser access uses the publishable key plus Auth and RLS; never use a
-- service_role or secret key in the GitHub Pages site.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text not null unique
    check (handle = lower(handle) and handle ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null check (char_length(display_name) between 2 and 40),
  avatar_url text,
  bio text check (bio is null or char_length(bio) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migration helper if table already exists
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio text;

create table if not exists public.memberships (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'cancelled')),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pets (
  id bigint generated always as identity primary key,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 50),
  breed text check (breed is null or char_length(breed) <= 80),
  age text check (age is null or char_length(age) <= 50),
  quirk text check (quirk is null or char_length(quirk) <= 200),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.profiles (id) on delete cascade,
  topic text not null default 'cat_life'
    check (topic in ('cat_life', 'care', 'introductions', 'home')),
  pet_id bigint references public.pets (id) on delete set null,
  image_url text,
  body text not null check (char_length(body) between 1 and 1000),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Migration helper if community_posts already exists
alter table public.community_posts add column if not exists pet_id bigint references public.pets (id) on delete set null;
alter table public.community_posts add column if not exists image_url text;
alter table public.community_posts add column if not exists pet_ids bigint[];

create table if not exists public.community_comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.community_posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create table if not exists public.community_reactions (
  id bigint generated always as identity primary key,
  target_type text not null check (target_type in ('post', 'comment')),
  target_id bigint not null,
  user_identifier text not null,
  reaction text not null check (reaction in ('like', 'love', 'treat', 'sad', 'laugh', 'omg', 'angry')),
  created_at timestamptz not null default now(),
  unique (target_type, target_id, user_identifier)
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
create index if not exists community_comments_author_id_idx
  on public.community_comments (author_id);
create index if not exists pets_owner_id_idx
  on public.pets (owner_id);
create index if not exists community_reactions_target_idx
  on public.community_reactions (target_type, target_id);
create index if not exists community_reactions_user_idx
  on public.community_reactions (user_identifier);

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.pets enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_reactions enable row level security;
alter table public.member_resources enable row level security;

-- Explicit, least-privilege Data API grants.
revoke all on table public.profiles, public.memberships, public.pets, public.community_posts,
  public.community_comments, public.community_reactions, public.member_resources from anon, authenticated;

grant select on table public.profiles to anon, authenticated;
grant insert, update on table public.profiles to authenticated;

grant select, insert, update on table public.memberships to authenticated;

grant select on table public.pets to anon, authenticated;
grant insert, update, delete on table public.pets to authenticated;

grant select on table public.community_posts to anon, authenticated;
grant insert, delete on table public.community_posts to authenticated;

grant select on table public.community_comments to anon, authenticated;
grant insert, delete on table public.community_comments to authenticated;

grant select, insert, update, delete on table public.community_reactions to anon, authenticated;

grant select on table public.member_resources to anon, authenticated;

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

drop policy if exists "reactions are readable by all" on public.community_reactions;
create policy "reactions are readable by all"
  on public.community_reactions for select to anon, authenticated
  using (true);

drop policy if exists "anyone can insert reactions" on public.community_reactions;
create policy "anyone can insert reactions"
  on public.community_reactions for insert to anon, authenticated
  with check (char_length(user_identifier) between 3 and 100);

drop policy if exists "anyone can update reactions" on public.community_reactions;
create policy "anyone can update reactions"
  on public.community_reactions for update to anon, authenticated
  using (true)
  with check (char_length(user_identifier) between 3 and 100);

drop policy if exists "anyone can delete reactions" on public.community_reactions;
create policy "anyone can delete reactions"
  on public.community_reactions for delete to anon, authenticated
  using (true);

drop policy if exists "public pets are readable" on public.pets;
create policy "public pets are readable"
  on public.pets for select to anon, authenticated
  using (true);

drop policy if exists "members insert own pets" on public.pets;
create policy "members insert own pets"
  on public.pets for insert to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists "members update own pets" on public.pets;
create policy "members update own pets"
  on public.pets for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "members delete own pets" on public.pets;
create policy "members delete own pets"
  on public.pets for delete to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "member resources are public" on public.member_resources;
create policy "member resources are public"
  on public.member_resources for select to anon, authenticated
  using (true);

-- Enable Supabase Realtime for instant synchronization across all visitors
do $$
begin
  alter publication supabase_realtime add table public.community_posts;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.community_comments;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.community_reactions;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.pets;
exception when others then null;
end $$;

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
