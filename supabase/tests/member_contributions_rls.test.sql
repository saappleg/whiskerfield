begin;

select plan(10);

select ok(to_regclass('public.member_reviews') is not null, 'member_reviews table exists');
select ok(to_regclass('public.member_stories') is not null, 'member_stories table exists');
select ok((select relrowsecurity from pg_class where oid = 'public.member_reviews'::regclass), 'member_reviews has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.member_stories'::regclass), 'member_stories has RLS enabled');
select ok(has_table_privilege('anon', 'public.member_reviews', 'select'), 'anon can read published review rows');
select ok(not has_table_privilege('anon', 'public.member_reviews', 'insert'), 'anon cannot insert reviews');
select ok(has_table_privilege('authenticated', 'public.member_reviews', 'insert'), 'authenticated can insert reviews');
select ok(has_table_privilege('anon', 'public.member_stories', 'select'), 'anon can read published story rows');
select ok(not has_table_privilege('anon', 'public.member_stories', 'insert'), 'anon cannot insert stories');
select ok(has_table_privilege('authenticated', 'public.member_stories', 'insert'), 'authenticated can insert stories');

select * from finish();
rollback;
